// /pages/api/generate-document.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const { topic, grade, subject, docType, standards, course, level, questionCount, questionTypes } = req.body;

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

  const requestedCount = Number(questionCount) || 6;
  const selectedTypes = questionTypes && questionTypes.length > 0 ? questionTypes : ['open-ended'];

  // Build subject-specific prompt
  let prompt = buildPrompt(subject, topic, grade, difficultyText, course, docType, requestedCount, selectedTypes);

  try {
    console.log('Calling HF Router with prompt about:', topic);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // Generate questions - INCREASED max_tokens to prevent cutoff
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
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2500, // INCREASED to accommodate multiple choice options
          temperature: 0.7,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const data = await hfResponse.json();
    console.log('HF API Status:', hfResponse.status);

    if (!hfResponse.ok) {
      console.error('HF API Error:', JSON.stringify(data));
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

    // Extract the generated text
    let generatedText = '';
    if (data?.choices?.[0]?.message?.content) {
      generatedText = data.choices[0].message.content;
    }

    console.log('Raw generated text:', generatedText.substring(0, 300));

    // Extract and clean content
    let content = extractAndCleanJSON(generatedText);

    if (content.length === 0) {
      const lines = generatedText
        .split('\n')
        .map(line => fixLatexIssues(line.trim()))
        .filter(line => line.length > 5 && !line.includes('```'));
      if (lines.length > 0) {
        content = lines.slice(0, requestedCount);
      }
    }

    if (content.length === 0) {
      console.error('Could not extract content from response');
      return res.status(500).json({ 
        error: 'Could not generate valid content',
        details: 'Try again or try a different topic'
      });
    }

    // Pad or trim to requested count
    content = normalizeArrayLength(content, requestedCount, 'question');

    console.log('Generated content with', content.length, 'items');
    
    // Generate title
    const title = await generateTitle(topic, grade, subject, docType);

    // Generate answer keys
    const answerKey = await generateAnswerKeys(content, topic, requestedCount, selectedTypes);

    return res.status(200).json({ 
      success: true, 
      content, 
      title, 
      answerKey
    });
  } catch (err) {
    console.error('Generation error:', err.message);
    
    if (err.name === 'AbortError') {
      return res.status(504).json({ 
        error: 'Request timeout',
        details: 'The AI took too long. Try again.'
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to generate document',
      details: err.message 
    });
  }
}

// Build question type instructions
function buildQuestionTypeInstructions(questionTypes) {
  const typeInstructions = {
    'multiple-choice': 'Multiple Choice: Provide the question followed by 4 answer options (A, B, C, D) with one correct answer.',
    'true-false': 'True/False: Present a statement that can be answered as either True or False.',
    'fill-blank': 'Fill in the Blank: Create a sentence with a blank space (use _____ or [blank]) for students to complete.',
    'short-answer': 'Short Answer: Ask a question that requires a 1-2 sentence written response.',
    'matching': 'Matching: Create pairs of items where students match terms with definitions or related concepts. Format as "Match: [Item 1] with [Item 2]"',
    'open-ended': 'Open-Ended: Ask a question that requires an extended written response or explanation.'
  };

  const selectedInstructions = questionTypes.map(type => typeInstructions[type] || '').filter(Boolean);
  
  if (selectedInstructions.length === 0) {
    return 'Generate open-ended questions that require extended written responses.';
  }

  if (selectedInstructions.length === 1) {
    return `Question Format: ${selectedInstructions[0]}`;
  }

  return `Question Formats (mix these types throughout the questions):
${selectedInstructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

Distribute questions evenly across all selected types.`;
}

// Build the appropriate prompt based on subject
function buildPrompt(subject, topic, grade, difficultyText, course, docType, requestedCount, questionTypes) {
  const subjectLower = subject.toLowerCase();
  const questionTypeInstructions = buildQuestionTypeInstructions(questionTypes);
  
  if (subjectLower.includes('math')) {
    return `You are an expert math teacher. Generate exactly ${requestedCount} math problems or questions about "${topic}".

Grade Level: ${grade}
Subject: Mathematics
Difficulty: ${difficultyText}
${course ? `Course: ${course}` : ''}

${questionTypeInstructions}

CRITICAL LaTeX RULES - YOU MUST FOLLOW THESE:
- ALL math expressions MUST be inside dollar signs: $...$
- In JSON strings, use SINGLE backslash for LaTeX commands
- Fractions: Use $\\frac{3}{4}$ (one backslash in the JSON string)
- Square roots: Use $\\sqrt{16}$ (one backslash)
- Exponents: $x^2$, $2^3$
- Multiplication: $\\times$ (one backslash)
- Greek letters: $\\pi$, $\\alpha$, $\\theta$ (one backslash each)

WRONG Examples (DO NOT DO THIS):
- "Solve frac{3}{4}" ❌ (missing dollar signs and backslash)
- "Find sqrt{16}" ❌ (missing dollar signs and backslash)
- "Calculate $frac{3}{4}$" ❌ (missing backslash)

CORRECT Examples (note: single backslash in JSON):
- "Solve: $\\frac{3}{4} + \\frac{1}{2}$"
- "Find $\\sqrt{16}$"
- "If $x^2 = 25$, what is $x$?"
- "Multiple Choice: What is $\\frac{1}{2} + \\frac{1}{4}$? A) $\\frac{1}{4}$ B) $\\frac{3}{4}$ C) $\\frac{2}{4}$ D) $1$"

Generate ONLY a valid JSON array of exactly ${requestedCount} strings. Do not include any explanatory text before or after the JSON.
The response should look like: ["Question 1 with $\\frac{a}{b}$", "Question 2 with $\\sqrt{x}$", ...]`;
  } else if (subjectLower.includes('ela') || subjectLower.includes('english')) {
    return `You are an expert English Language Arts teacher. Generate exactly ${requestedCount} ELA questions or activities about "${topic}".

Grade Level: ${grade}
Subject: English Language Arts
Difficulty: ${difficultyText}
${course ? `Course: ${course}` : ''}

${questionTypeInstructions}

IMPORTANT: Do not include any math problems or mathematical expressions. This is for reading, writing, and language learning only.

Examples:
- "Multiple Choice: What is the main theme of the story? A) Friendship B) Courage C) Betrayal D) Growth"
- "True/False: The protagonist learns a valuable lesson by the end of the story."
- "Fill in the Blank: The author uses _____ to create suspense in the narrative."
- "Short Answer: How does the setting contribute to the mood of the story?"

Generate ONLY a valid JSON array of exactly ${requestedCount} strings. Do not include any explanatory text before or after the JSON.
The response should look like: ["Question 1", "Question 2", "Question 3", ...]`;
  } else if (subjectLower.includes('science')) {
    return `You are an expert science teacher. Generate exactly ${requestedCount} science questions or activities about "${topic}".

Grade Level: ${grade}
Subject: Science
Difficulty: ${difficultyText}
${course ? `Course: ${course}` : ''}

${questionTypeInstructions}

For mathematical formulas in science, use LaTeX notation with SINGLE BACKSLASH in the JSON:
- Inline: $E = mc^2$
- Fractions: $\\frac{d}{t}$ (one backslash)
- Chemical formulas: $H_2O$, $CO_2$
- Greek letters: $\\Delta T$, $\\alpha$ (one backslash)

Examples:
- "Multiple Choice: What is the chemical formula for water? A) $H_2O$ B) $CO_2$ C) $O_2$ D) $H_2O_2$"
- "True/False: Photosynthesis occurs in the mitochondria of plant cells."
- "Fill in the Blank: The process by which plants make food is called _____."

Focus primarily on science concepts.

Generate ONLY a valid JSON array of exactly ${requestedCount} strings. Do not include any explanatory text before or after the JSON.
The response should look like: ["Question 1", "Question 2", ...]`;
  } else {
    return `You are an expert educational content creator. Generate exactly ${requestedCount} questions or activities for a ${docType} about "${topic}".

Grade Level: ${grade}
Subject: ${subject}
Difficulty: ${difficultyText}
${course ? `Course: ${course}` : ''}

${questionTypeInstructions}

If you include math, use LaTeX with single backslash: $\\frac{a}{b}$, $\\sqrt{x}$

Generate ONLY a valid JSON array of exactly ${requestedCount} strings. Do not include any explanatory text before or after the JSON.
The response should look like: ["Question 1", "Question 2", ...]`;
  }
}

// Generate a title for the document
async function generateTitle(topic, grade, subject, docType) {
  const titlePrompt = `Create a short, creative title (3-7 words max) for a ${docType} about "${topic}" for grade ${grade} ${subject}. Return ONLY the title, no quotes or extra text.`;
  
  try {
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

    const titleData = await titleResponse.json();
    if (titleData?.choices?.[0]?.message?.content) {
      return titleData.choices[0].message.content.trim().replace(/['"]/g, '');
    }
  } catch (e) {
    console.error('Title generation error:', e);
  }
  
  return topic; // Fallback
}

// Generate answer keys for the questions (with batching for large sets)
async function generateAnswerKeys(content, topic, requestedCount, questionTypes) {
  const BATCH_SIZE = 8; // Generate answers in batches of 8
  
  if (requestedCount <= BATCH_SIZE) {
    // Small enough - do it in one go
    return generateAnswerKeyBatch(content, topic, 0, requestedCount, questionTypes);
  }
  
  // Large set - batch it
  console.log(`Generating ${requestedCount} answers in batches of ${BATCH_SIZE}`);
  const allAnswers = [];
  
  for (let i = 0; i < requestedCount; i += BATCH_SIZE) {
    const end = Math.min(i + BATCH_SIZE, requestedCount);
    const batchQuestions = content.slice(i, end);
    const batchAnswers = await generateAnswerKeyBatch(batchQuestions, topic, i, end - i, questionTypes);
    allAnswers.push(...batchAnswers);
  }
  
  return normalizeArrayLength(allAnswers, requestedCount, 'answer');
}

// Generate a batch of answer keys
async function generateAnswerKeyBatch(questions, topic, startIndex, count, questionTypes) {
  // Determine if we have multiple choice questions
  const hasMultipleChoice = questionTypes?.includes('multiple-choice') || 
    questions.some(q => /Multiple Choice:|[A-D]\)/i.test(q));
  
  const answerKeyPrompt = `Generate concise answer keys for these ${count} questions about "${topic}".

CRITICAL LATEX RULES FOR ANSWERS:
- For math answers: Use proper LaTeX with SINGLE BACKSLASH in JSON
  - Correct: $\\frac{3}{4}$, $\\sqrt{9}$, $x = 5$
  - Wrong: $frac{3}{4}$, $sqrt{9}$ (missing backslash)
- For descriptive text: Write as plain English
  - Wrong: "$\\frac{3}{4}$ of the students"
  - Correct: "Three-quarters of the students" or "75% of the students"

ANSWER FORMAT GUIDELINES:
- Multiple Choice: Provide the letter of the correct answer and a brief explanation (e.g., "B - The fraction simplifies to 3/4")
- True/False: State "True" or "False" and provide a brief explanation
- Fill in the Blank: Provide the word(s) that complete the sentence
- Short Answer: Provide a complete but concise answer (1-2 sentences)
- Matching: Indicate the correct pairs
- Open-Ended: Provide key points that should be included in a complete answer

Return ONLY a valid JSON array of exactly ${count} strings. No explanatory text.

Questions:
${questions.map((q, i) => `${startIndex + i + 1}. ${q}`).join('\n')}`;

  try {
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
          max_tokens: 2000, // Increased for more detailed answers
          temperature: 0.7,
        }),
      }
    );

    const answerKeyData = await answerKeyResponse.json();
    if (answerKeyData?.choices?.[0]?.message?.content) {
      let answerKeyText = answerKeyData.choices[0].message.content;
      const answers = extractAndCleanJSON(answerKeyText);
      console.log(`Batch ${startIndex}-${startIndex + count}: Generated ${answers.length} answers`);
      return answers;
    }
  } catch (e) {
    console.error('Answer key batch error:', e);
  }

  return [];
}

// Extract and clean JSON from AI response
function extractAndCleanJSON(text) {
  if (!text) return [];
  
  // Try to find JSON array in the response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];
  
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (Array.isArray(parsed)) {
      return parsed.map(item => {
        let cleaned = String(item).trim();
        // Apply LaTeX fixes AFTER JSON parsing (when backslashes are already unescaped)
        cleaned = fixLatexIssues(cleaned);
        return cleaned;
      }).filter(item => item.length > 0);
    }
  } catch (e) {
    console.error('JSON parse error:', e);
  }
  
  return [];
}

// Fix common LaTeX issues - IMPROVED VERSION
// This runs AFTER JSON parsing, so single backslashes in JSON become single backslashes in JS
function fixLatexIssues(str) {
  if (!str || typeof str !== 'string') return '';
  let s = String(str);
  
  // Pattern: find LaTeX commands that are missing the backslash
  // We need to be careful not to double-fix already correct LaTeX
  
  // Fix \frac that's missing the backslash (but not already correct \\frac)
  // Look for: $ followed by frac{ (no backslash before frac)
  s = s.replace(/\$([^\\]*)frac\{/g, (match, before) => {
    return `$${before}\\frac{`;
  });
  
  // Fix \sqrt that's missing the backslash
  s = s.replace(/\$([^\\]*)sqrt\{/g, (match, before) => {
    return `$${before}\\sqrt{`;
  });
  
  // Fix \times that's missing the backslash
  s = s.replace(/\$([^\\]*)times\b/g, (match, before) => {
    return `$${before}\\times`;
  });
  
  // Fix Greek letters (pi, alpha, beta, etc.) that are missing backslash
  const greekLetters = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'theta', 
                       'lambda', 'mu', 'pi', 'sigma', 'phi', 'omega', 'Delta'];
  
  greekLetters.forEach(letter => {
    // Within $...$ find the letter not preceded by backslash
    const regex = new RegExp(`(\\$[^$]*)\\b${letter}\\b(?!\\w)`, 'g');
    s = s.replace(regex, (match, before) => {
      // Check if it's already escaped
      if (before.endsWith('\\')) return match;
      return `${before}\\${letter}`;
    });
  });
  
  // Fix other common commands
  const commands = ['cdot', 'div', 'pm', 'infty', 'sum', 'lim', 'sin', 'cos', 'tan', 'int'];
  commands.forEach(cmd => {
    const regex = new RegExp(`(\\$[^$]*)\\b${cmd}\\b`, 'g');
    s = s.replace(regex, (match, before) => {
      if (before.endsWith('\\')) return match;
      return `${before}\\${cmd}`;
    });
  });
  
  return s;
}

// Normalize array length - pad or trim
function normalizeArrayLength(arr, targetLength, type) {
  let result = [...arr];
  
  if (result.length > targetLength) {
    result = result.slice(0, targetLength);
  }
  
  while (result.length < targetLength) {
    const index = result.length + 1;
    result.push(`[${type.charAt(0).toUpperCase() + type.slice(1)} ${index} - Click to edit]`);
  }
  
  return result;
}