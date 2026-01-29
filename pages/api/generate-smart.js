// pages/api/generate-smart.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  const { prompt } = req.body;

  try {
    // Step 1: Use Llama to extract parameters
    const extractResponse = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.1-8B-Instruct',
        messages: [{
          role: 'system',
          content: 'Return ONLY JSON. Keys: topic, grade, subject, docType, questionCount. Example: "3rd grade math quiz on fractions" -> {"topic":"fractions","grade":"3","subject":"math","docType":"quiz","questionCount":6}'
        }, { role: 'user', content: prompt }],
        response_format: { type: "json_object" } 
      })
    });

    const extraction = await extractResponse.json();
    
    // FIX 1: Correct the path to the message content
    const rawContent = extraction.choices[0].message.content;
    const params = JSON.parse(rawContent);

    // Step 2: Call the main generator internally
    // FIX 2: Better fallback for local development URLs
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://${req.headers.host}`;
    
    const finalResponse = await fetch(`${baseUrl}/api/generate-document`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        mode: 'smart', // Tells generate-document to bypass strict validation
        level: 'on' 
      })
    });

    const finalData = await finalResponse.json();

    // Pass the final data (including answerKey) back to the frontend
    return res.status(200).json(finalData);

  } catch (error) {
    console.error("Smart Interceptor Error:", error);
    return res.status(500).json({ error: 'Smart Engine failed to interpret prompt' });
  }
}
