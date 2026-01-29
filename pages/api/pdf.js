import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, readFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomBytes } from 'crypto';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handlePostRequest(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handlePostRequest(req, res) {
  let tempTexFile = null;
  let tempPdfFile = null;
  
  try {
    const { title, grade, subject, docType, questions, answerKey, includeAnswerKey } = req.body;
    
    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Questions array required' });
    }

    // Clean all questions and answers before processing
    const cleanedQuestions = questions.map(q => fixLatexIssues(String(q)));
    const cleanedAnswers = answerKey ? answerKey.map(a => {
      const text = typeof a === 'string' ? a : (a.text || a.answer || String(a));
      return fixLatexIssues(text);
    }) : [];

    // Generate LaTeX document
    const latexContent = generateLaTeX({
      title,
      grade,
      subject,
      docType,
      questions: cleanedQuestions,
      answerKey: cleanedAnswers,
      includeAnswerKey
    });

    // Create temporary files
    const tempId = randomBytes(16).toString('hex');
    const tempDir = tmpdir();
    tempTexFile = join(tempDir, `${tempId}.tex`);
    tempPdfFile = join(tempDir, `${tempId}.pdf`);

    // Write LaTeX to file
    await writeFile(tempTexFile, latexContent, 'utf-8');
    
    console.log('LaTeX Preview (first 500 chars):');
    console.log(latexContent.substring(0, 500));

    // Compile LaTeX to PDF - First pass
    console.log('Compiling PDF (pass 1)...');
    try {
      await execAsync(`cd "${tempDir}" && pdflatex -interaction=nonstopmode "${tempTexFile}"`, {
        timeout: 30000,
        maxBuffer: 1024 * 1024 * 10
      });
    } catch (execError) {
      const logFile = tempTexFile.replace('.tex', '.log');
      let errorDetails = execError.message;
      
      try {
        const logContent = await readFile(logFile, 'utf-8');
        const errorLines = logContent.match(/! .*/g);
        if (errorLines) {
          errorDetails = errorLines.join('\n');
          console.error('LaTeX Errors:', errorDetails);
        }
        
        const debugPath = '/tmp/failed-latex.tex';
        await writeFile(debugPath, latexContent, 'utf-8');
        console.error('Saved failed LaTeX to:', debugPath);
        
      } catch (logErr) {
        console.error('Could not read log file');
      }
      
      throw new Error(`LaTeX compilation failed: ${errorDetails}`);
    }
    
    // Second pass for page numbers
    console.log('Compiling PDF (pass 2)...');
    try {
      await execAsync(`cd "${tempDir}" && pdflatex -interaction=nonstopmode "${tempTexFile}"`, {
        timeout: 30000,
        maxBuffer: 1024 * 1024 * 10
      });
    } catch (e) {
      console.warn('Second pass warning (ignorable):', e.message);
    }

    // Read the generated PDF
    const pdfBuffer = await readFile(tempPdfFile);
    console.log('PDF generated successfully:', pdfBuffer.length, 'bytes');

    // Set response headers
    const filename = (title || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to generate PDF', 
        details: error.message
      });
    }
  } finally {
    // Cleanup
    if (tempTexFile) {
      await unlink(tempTexFile).catch(() => {});
      await unlink(tempTexFile.replace('.tex', '.aux')).catch(() => {});
      await unlink(tempTexFile.replace('.tex', '.log')).catch(() => {});
    }
    if (tempPdfFile) {
      await unlink(tempPdfFile).catch(() => {});
    }
  }
}

function generateLaTeX({ title, grade, subject, docType, questions, answerKey, includeAnswerKey }) {
  const escapedTitle = escapeLatex(title || 'Document');
  const escapedGrade = escapeLatex(grade || 'N/A');
  const escapedSubject = escapeLatex(subject || 'N/A');
  const escapedDocType = escapeLatex(docType || 'N/A');

  let latex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{geometry}
\\usepackage{xcolor}
\\usepackage{enumitem}

\\geometry{margin=1in}

\\definecolor{primary}{RGB}{79, 70, 229}
\\definecolor{success}{RGB}{16, 185, 129}

\\begin{document}

\\begin{center}
{\\Large\\bfseries ${escapedTitle}}\\\\[0.5em]
{\\small Grade: ${escapedGrade} | Subject: ${escapedSubject} | Type: ${escapedDocType}}
\\end{center}

\\vspace{1em}

\\section*{Questions}

\\begin{enumerate}[leftmargin=*, itemsep=2em]
`;

  // Add questions
  questions.forEach((question, index) => {
    try {
      const processedQuestion = processLatexContent(question);
      latex += `\\item ${processedQuestion}\n\n`;
    } catch (e) {
      console.error(`Error processing question ${index + 1}:`, e.message);
      latex += `\\item [Error in question ${index + 1}]\n\n`;
    }
  });

  latex += `\\end{enumerate}\n\n`;

  // Add answer key if requested
  if (includeAnswerKey && answerKey && answerKey.length > 0) {
    latex += `\\newpage\n\n\\section*{Answer Key}\n\n`;
    latex += `\\begin{enumerate}[leftmargin=*]\n`;
    
    answerKey.forEach((answer, index) => {
      try {
        // Handle both string and object formats
        let answerText = '';
        if (typeof answer === 'string') {
          answerText = answer;
        } else if (answer && typeof answer === 'object') {
          answerText = answer.text || answer.answer || String(answer);
        } else {
          answerText = String(answer);
        }
        
        const processedAnswer = processLatexContent(answerText);
        latex += `\\item ${processedAnswer}\n\n`;
      } catch (e) {
        console.error(`Error processing answer ${index + 1}:`, e.message);
        latex += `\\item [Error in answer ${index + 1}]\n\n`;
      }
    });
    
    latex += `\\end{enumerate}\n`;
  }

  latex += `\\end{document}`;

  return latex;
}

function processLatexContent(text) {
  if (!text) return '';
  
  let content = String(text);
  const parts = [];
  let lastIndex = 0;
  
  // Match math delimiters: $...$ or $$...$$
  const mathRegex = /(\$\$[^\$]+\$\$|\$[^\$]+\$)/g;
  let match;
  
  while ((match = mathRegex.exec(content)) !== null) {
    // Add escaped text before math
    if (match.index > lastIndex) {
      const textPart = content.substring(lastIndex, match.index);
      parts.push(escapeLatex(textPart));
    }
    
    // Add math content - clean but keep as math
    let mathContent = match[1];
    mathContent = cleanMathContent(mathContent);
    parts.push(mathContent);
    
    lastIndex = match.index + match[1].length;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(escapeLatex(content.substring(lastIndex)));
  }
  
  return parts.join('');
}

function cleanMathContent(math) {
  if (!math) return math;
  
  let cleaned = math;
  
  // Fix multiple backslashes
  cleaned = cleaned.replace(/\\\\\\/g, '\\');
  cleaned = cleaned.replace(/\\\\/g, '\\');
  
  // Fix missing backslashes before LaTeX commands inside math mode
  cleaned = cleaned.replace(/([^\\])frac\{/g, '$1\\frac{');
  cleaned = cleaned.replace(/\$\s*frac\{/g, '$\\frac{');
  cleaned = cleaned.replace(/\$frac\{/g, '$\\frac{');
  
  cleaned = cleaned.replace(/([^\\])sqrt\{/g, '$1\\sqrt{');
  cleaned = cleaned.replace(/\$\s*sqrt\{/g, '$\\sqrt{');
  cleaned = cleaned.replace(/\$sqrt\{/g, '$\\sqrt{');
  
  cleaned = cleaned.replace(/([^\\])times\b/g, '$1\\times');
  cleaned = cleaned.replace(/\$times\b/g, '$\\times');
  
  // Remove stray dollar signs inside math
  if (cleaned.startsWith('$$')) {
    const inner = cleaned.slice(2, -2).replace(/\$/g, '');
    cleaned = '$$' + inner + '$$';
  } else if (cleaned.startsWith('$')) {
    const inner = cleaned.slice(1, -1).replace(/\$/g, '');
    cleaned = '$' + inner + '$';
  }
  
  return cleaned;
}

function escapeLatex(text) {
  if (!text) return '';
  
  let escaped = String(text);
  
  // Escape LaTeX special characters (order matters!)
  escaped = escaped.replace(/\\/g, '\\textbackslash{}');
  escaped = escaped.replace(/&/g, '\\&');
  escaped = escaped.replace(/%/g, '\\%');
  escaped = escaped.replace(/\$/g, '\\$');
  escaped = escaped.replace(/#/g, '\\#');
  escaped = escaped.replace(/_/g, '\\_');
  escaped = escaped.replace(/\{/g, '\\{');
  escaped = escaped.replace(/\}/g, '\\}');
  escaped = escaped.replace(/~/g, '\\textasciitilde{}');
  escaped = escaped.replace(/\^/g, '\\textasciicircum{}');
  
  // Fix double-escaped backslash
  escaped = escaped.replace(/\\textbackslash\{\}textbackslash\{\}/g, '\\textbackslash{}');
  
  // Handle newlines
  escaped = escaped.replace(/\n\n+/g, '\n\n');
  escaped = escaped.replace(/\n/g, ' ');
  
  return escaped;
}

function fixLatexIssues(str) {
  if (!str || typeof str !== 'string') return '';
  let s = String(str);
  
  // Fix all frac variations
  s = s.replace(/\$\s*frac\{/g, '$\\frac{');
  s = s.replace(/\$frac\{/g, '$\\frac{');
  s = s.replace(/([^\\])frac\{/g, '$1\\frac{');
  s = s.replace(/^frac\{/g, '\\frac{');
  
  // Fix all sqrt variations
  s = s.replace(/\$\s*sqrt\{/g, '$\\sqrt{');
  s = s.replace(/\$sqrt\{/g, '$\\sqrt{');
  s = s.replace(/([^\\])sqrt\{/g, '$1\\sqrt{');
  s = s.replace(/^sqrt\{/g, '\\sqrt{');
  
  // Fix times
  s = s.replace(/\$\s*times\b/g, '$\\times');
  s = s.replace(/\$times\b/g, '$\\times');
  s = s.replace(/([^\\])times\b/g, '$1\\times');
  
  // Fix Greek letters
  const greekLetters = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'theta', 
                       'lambda', 'mu', 'pi', 'sigma', 'phi', 'omega', 'Delta'];
  greekLetters.forEach(letter => {
    s = s.replace(new RegExp(`\\$\\s*${letter}\\b`, 'g'), `$\\${letter}`);
    s = s.replace(new RegExp(`\\$${letter}\\b`, 'g'), `$\\${letter}`);
    s = s.replace(new RegExp(`([^\\\\])${letter}\\b`, 'g'), `$1\\${letter}`);
  });
  
  return s;
}