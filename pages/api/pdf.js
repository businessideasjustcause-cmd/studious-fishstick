import PDFDocument from 'pdfkit'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Legacy GET endpoint support
    return handleGetRequest(req, res)
  } else if (req.method === 'POST') {
    // New POST endpoint for better data handling
    return handlePostRequest(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function handleGetRequest(req, res) {
  try {
    const { topic, doc_type, grade, subject, questions } = req.query

    if (!questions) {
      return res.status(400).json({ error: 'Questions required' })
    }

    const questionList = JSON.parse(Array.isArray(questions) ? questions[0] : questions)

    // Create PDF document
    const doc = new PDFDocument({
      bufferPages: true,
    })

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${topic || 'document'}.pdf"`)

    // Pipe to response
    doc.pipe(res)

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text(topic || 'Document', 50, 50)
    doc.fontSize(12).font('Helvetica').fillColor('#666')
    doc.text(`${doc_type} | Grade ${grade} | ${subject}`, 50, 85)
    doc.moveDown(2)

    // Questions
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Questions', 50, 140)
    doc.moveDown(1)

    let yPosition = 180
    const pageHeight = doc.page.height
    const bottomMargin = 50

    questionList.forEach((question, index) => {
      const questionText = typeof question === 'string' ? question : question.text || ''
      
      // Check if we need a new page
      if (yPosition > pageHeight - bottomMargin) {
        doc.addPage()
        yPosition = 50
      }

      // Question number and text
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#4f46e5')
      doc.text(`${index + 1}.`, 50, yPosition)

      doc.fontSize(11).font('Helvetica').fillColor('#000')
      const lines = doc.heightOfString(questionText, { width: 450 })
      doc.text(questionText, 75, yPosition, { width: 450 })

      yPosition += lines + 15
    })

    // Footer
    doc.fontSize(9).fillColor('#999').text(
      `Generated on ${new Date().toLocaleDateString()} | Draft`,
      50,
      pageHeight - 30,
      { align: 'center' }
    )

    // Finalize PDF
    doc.end()
  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).json({ error: 'Failed to generate PDF' })
  }
}

async function handlePostRequest(req, res) {
  try {
    const { title, grade, subject, docType, questions, answerKey, includeAnswerKey } = req.body

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Questions array required' })
    }

    // Create PDF document
    const doc = new PDFDocument({
      bufferPages: true,
      size: 'A4',
      margin: 50,
    })

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${(title || 'document').replace(/\s+/g, '_')}.pdf"`)

    // Pipe to response
    doc.pipe(res)

    // Title
    doc.fontSize(20).font('Helvetica-Bold').text(title || 'Document', { align: 'center' })
    doc.fontSize(11).font('Helvetica').fillColor('#666')
    const metadata = `Grade: ${grade} | Subject: ${subject} | Type: ${docType}`
    doc.text(metadata, { align: 'center' })
    doc.moveDown(1)

    // Line separator
    const pageWidth = doc.page.width
    doc.moveTo(50, doc.y).lineTo(pageWidth - 50, doc.y).stroke('#ccc')
    doc.moveDown(0.5)

    // Questions section
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Questions')
    doc.moveDown(0.5)

    let yPosition = doc.y
    const pageHeight = doc.page.height
    const bottomMargin = 50

    questions.forEach((question, index) => {
      const questionText = sanitizeText(question)
      
      // Check if we need a new page
      if (yPosition > pageHeight - bottomMargin - 30) {
        doc.addPage()
        yPosition = 50
      }

      // Question number and text
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#4f46e5')
      doc.text(`Q${index + 1}:`, { continued: true })

      doc.font('Helvetica').fillColor('#000').text(` ${questionText}`)
      yPosition = doc.y + 10
    })

    // Answer key section if requested
    if (includeAnswerKey && answerKey && answerKey.length > 0) {
      // New page for answer key
      doc.addPage()
      
      // Title for answer key
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Answer Key')
      doc.moveDown(0.5)

      let answerYPosition = doc.y
      answerKey.forEach((answer, index) => {
        const answerText = sanitizeText(answer)
        
        // Check if we need another page
        if (answerYPosition > pageHeight - bottomMargin - 30) {
          doc.addPage()
          answerYPosition = 50
        }

        // Answer number and text
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#27ae60')
        doc.text(`A${index + 1}:`, { continued: true })

        doc.font('Helvetica').fillColor('#000').text(` ${answerText}`)
        answerYPosition = doc.y + 10
      })
    }

    // Footer on last page
    const pages = doc.bufferedPageRange().count
    for (let i = 0; i < pages; i++) {
      doc.switchToPage(i)
      doc.fontSize(9).fillColor('#999').text(
        `Generated on ${new Date().toLocaleDateString()} | Draft • Page ${i + 1}`,
        50,
        doc.page.height - 30,
        { align: 'center' }
      )
    }

    // Finalize PDF
    doc.end()
  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message })
  }
}

function sanitizeText(text) {
  if (!text) return '[No content]'
  // Convert to string and remove excessive whitespace
  return String(text).trim()
}