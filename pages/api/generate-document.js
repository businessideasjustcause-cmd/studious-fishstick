// /pages/api/generate-document.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const { topic, grade, subject, docType, standards, course, level, questionCount } = req.body;

  // Validate required fields
  if (!topic || !grade || !subject || !docType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!process.env.HF_TOKEN) {
    return res.status(500).json({ error: 'HF_TOKEN not set' });
  }

  // Convert difficulty level to text
  const difficultyText =
    level === 'under' ? 'Below Grade Level' :
    level === 'above' ? 'Above Grade Level' : 'On Grade Level';

  // Build subject-specific prompt
  let prompt = '';
  
  const requestedCount = Number(questionCount) || 6;

  if (subject.toLowerCase().includes('math')) {
    prompt = `You are an expert math teacher. Generate exactly ${requestedCount} math problems or questions about "${topic}".

  Grade Level: ${grade}
  Subject: Mathematics
  Difficulty: ${difficultyText}
  ${course ? `Course: ${course}` : ''}

  IMPORTANT: Return LaTeX onlyon for fractions, exponents, square roots, and equations. For all other expressions, use plain ASCII notation. Do NOT use LaTeX for entire problems or instructions.
  Examples of when to use LaTeX:
  - Fractions like 3/4 or (3/4)
  - Exponents like x^2 or 2^3
  - Square roots like sqrt(16) or sqrt(x)
  - Equations like x + 5 = 12, 2x - 3 = 7

  Do not include any non-math reading passages. Generate a JSON array of strings with the math problems/questions. Return ONLY valid JSON, no other text.
  Example format: ["Solve: x + 5 = 12", "Simplify: 6/8", ...]`;
  } else if (subject.toLowerCase().includes('ela') || subject.toLowerCase().includes('english')) {
    prompt = `You are an expert English Language Arts teacher. Generate exactly ${requestedCount} ELA questions or activities about "${topic}".

Grade Level: ${grade}
Subject: English Language Arts
Difficulty: ${difficultyText}
${course ? `Course: ${course}` : ''}

IMPORTANT: Do not include any math problems or mathematical expressions. This is for reading, writing, and language learning only.

Generate a JSON array of strings with the ELA questions/activities. Return ONLY valid JSON, no other text.
Example format: ["What is the main theme of this passage?", "Write a character analysis of...", "Identify the literary devices used in..."]`;
  } else if (subject.toLowerCase().includes('science')) {
    prompt = `You are an expert science teacher. Generate exactly ${requestedCount} science questions or activities about "${topic}".

Grade Level: ${grade}
Subject: Science
Difficulty: ${difficultyText}
${course ? `Course: ${course}` : ''}

For any mathematical expressions or measurements, use LaTeX (e.g., E = mc^2, Delta T, v = d/t). Do NOT use ASCII.
But focus primarily on science concepts, not math.

Generate a JSON array of strings with the science questions/activities. Return ONLY valid JSON, no other text.
Example format: ["Explain the process of photosynthesis", "What are the layers of the atmosphere?", ...]`;
  } else {
    prompt = `You are an expert educational content creator. Generate exactly ${requestedCount} questions or activities for a ${docType} about "${topic}".

Grade Level: ${grade}
Subject: ${subject}
Difficulty: ${difficultyText}
${course ? `Course: ${course}` : ''}

Generate a JSON array of strings with the questions/activities. Return ONLY valid JSON, no other text.
Example format: ["Question 1", "Question 2", ...]`;
  }

  try {
    // Call HuggingFace Router API with timeout
    console.log('Calling HF Router with prompt about:', topic);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const hfResponse = await fetch(
      'https://router.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.1-8B-Instruct',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const data = await hfResponse.json();
    console.log('HF API Status:', hfResponse.status);
    console.log('HF API Response:', JSON.stringify(data).substring(0, 500));

    if (!hfResponse.ok) {
      console.error('HF API Error:', JSON.stringify(data));
      // Check if it's a rate limit or loading error
      if (data?.[0]?.error?.includes('is currently loading')) {
        return res.status(503).json({ 
          error: 'Model is loading. Please try again in a moment.' 
        });
      }
      const errorMsg = data?.[0]?.error || data?.error || JSON.stringify(data);
      return res.status(hfResponse.status).json({ 
        error: 'Failed to generate content',
        details: errorMsg
      });
    }

    // Extract the generated text from OpenAI-compatible response
    let generatedText = '';
    if (data?.choices?.[0]?.message?.content) {
      generatedText = data.choices[0].message.content;
    }

 // --- POST-PROCESSING: Ensure LaTeX is preserved and properly formatted ---
function ensureLatexFormat(str) {
    if (!str || typeof str !== 'string') return '';
    let s = String(str);

    // 1. Normalize whitespace (optional, keeps text readable)
    s = s.replace(/\s+/g, ' ').trim();

    // 2. Do NOT remove dollar signs.
    // 3. Do NOT convert \frac or \sqrt to plain text.
    // 4. Optionally: Normalize inline LaTeX delimiters if necessary
    // Example: s = s.replace(/\\(/g, '$').replace(/\\)/g, '$');

    return s;
}

generatedText = ensureLatexFormat(generatedText);

    console.log('Generated text sample:', generatedText.substring(0, 200));

// Extract JSON array from the response
const jsonMatch = generatedText.match(/\[[\s\S]*?\]/);
let content = [];

if (jsonMatch) {
    try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
            // Changed from fixLatexToAscii to ensureLatexFormat
            content = parsed
                .map(item => ensureLatexFormat(String(item).trim()))
                .filter(item => item.length > 0);
        }
    } catch (parseError) {
        console.error('JSON parse error:', parseError);
    }
}

// If parsing failed, try to extract individual questions
if (content.length === 0) {
    const lines = generatedText
        .split('\n')
        // Changed from fixLatexToAscii to ensureLatexFormat
        .map(line => ensureLatexFormat(line.trim()))
        .filter(line => line.length > 5 && !line.includes('```'));

    if (lines.length > 0) {
        content = lines.slice(0, requestedCount);
    }
}

// If still no content, return error
if (content.length === 0) {
    console.error('Could not extract content from response');
    return res.status(500).json({
        error: 'Could not generate valid content',
        details: 'Try again or try a different topic'
    });
}

// --- Example Implementation of ensureLatexFormat (for context) ---
function ensureLatexFormat(text) {
    if (!text) return "";
    
    let formatted = text;
    
    // Example conversions:
    // Convert 1/2 to \frac{1}{2}
    formatted = formatted.replace(/(\w+)\/(\w+)/g, "\\frac{$1}{$2}");
    // Convert x^2 to x^{2}
    formatted = formatted.replace(/(\w+)\^(\w+)/g, "$1^{$2}");
    // Convert sqrt(x) to \sqrt{x}
    formatted = formatted.replace(/sqrt\((.*?)\)/g, "\\sqrt{$1}");
    
    return formatted;
}

    // If still no content, return error
    if (content.length === 0) {
      console.error('Could not extract content from response');
      return res.status(500).json({ 
        error: 'Could not generate valid content',
        details: 'Try again or try a different topic'
      });
    }

    // Ensure content array matches requested count
    if (content.length > requestedCount) content = content.slice(0, requestedCount);
    if (content.length < requestedCount) {
      const existing = content.length;
      for (let i = existing; i < requestedCount; i++) {
        content.push(`Placeholder question ${i + 1} — edit this question.`);
      }
    }

    console.log('Generated content with', content.length, 'items');
    
    // Generate a title for the document
    const titlePrompt = `Create a short, descriptive title (3-7 words max) for a ${docType} about "${topic}" for grade ${grade} ${subject}. Return ONLY the title, no quotes or extra text.`;
    
    const titleResponse = await fetch(
      'https://router.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.1-8B-Instruct',
          messages: [{ role: 'user', content: titlePrompt }],
          max_tokens: 50,
          temperature: 0.7,
        }),
      }
    );

    let title = topic; // fallback to topic if title generation fails
    try {
      const titleData = await titleResponse.json();
      if (titleData?.choices?.[0]?.message?.content) {
        title = titleData.choices[0].message.content.trim();
      }
    } catch (e) {
      console.error('Title generation error:', e);
    }

    // Generate answer keys for each question
    const answerKeyPrompt = `You are an expert educator. Generate concise answer keys for these ${requestedCount} questions/problems about "${topic}".

  Provide answers in a JSON array format matching the question count.
  For math: show brief work using LaTeX (e.g., x = 5, \frac{3}{4}, \sqrt{9}). Do NOT use plain ASCII.
  For ELA: provide model answers or key points.
  For Science: explain the concept clearly.

  Return ONLY a valid JSON array of strings, no other text.
  Example: ["Answer 1", "Answer 2", ...]

  Questions to answer:
  ${content.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;

    const answerKeyResponse = await fetch(
      'https://router.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.1-8B-Instruct',
          messages: [{ role: 'user', content: answerKeyPrompt }],
          max_tokens: 1000,
          temperature: 0.7,
        }),
        signal: controller.signal,
      }
    );

 let answerKey = [];
try {
  const answerKeyData = await answerKeyResponse.json();
  if (answerKeyData?.choices?.[0]?.message?.content) {
    let answerKeyText = answerKeyData.choices[0].message.content;

    // 1. REMOVE ensureLatexFormat FROM HERE (It breaks the JSON structure)
    const jsonMatch = answerKeyText.match(/\[[\s\S]*?\]/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) {
        answerKey = parsed.map((answer, index) => ({
          id: index,
          // 2. APPLY IT HERE ONLY to the individual string content
          text: ensureLatexFormat(String(answer).trim()),
        }));
      }
    }
  }
} catch (e) {
  console.error('Answer key generation error:', e);
}

    // Ensure answerKey length matches requestedCount
    if (!Array.isArray(answerKey) || answerKey.length === 0) {
      answerKey = content.map((_, index) => ({ id: index, text: `[Answer Key ${index + 1} - Click to edit]` }));
    }
    if (answerKey.length > requestedCount) answerKey = answerKey.slice(0, requestedCount);
    if (answerKey.length < requestedCount) {
      const existing = answerKey.length;
      for (let i = existing; i < requestedCount; i++) {
        answerKey.push({ id: i, text: `[Answer Key ${i + 1} - Click to edit]` });
      }
    }

    return res.status(200).json({ success: true, content, title, answerKey });
  } catch (err) {
    console.error('Generation error:', err.message);
    
    if (err.name === 'AbortError') {
      return res.status(504).json({ 
        error: 'Request timeout',
        details: 'The AI model took too long to respond. Try again.'
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to generate document',
      details: err.message 
    });
  }
}