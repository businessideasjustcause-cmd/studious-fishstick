// /pages/api/migrate-data.js
// Temporary endpoint to populate missing titles and answer keys for existing documents
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  try {
    // Fetch all documents
    const { data: documents, error: fetchError } = await supabase
      .from('documents')
      .select('*');

    if (fetchError) throw fetchError;

    let updated = 0;
    let errors = [];

    // Process each document
    for (const doc of documents) {
      try {
        const updates = {};
        let needsUpdate = false;

        // Add title if missing (use topic as default)
        if (!doc.title) {
          updates.title = doc.topic || `${doc.doc_type} for Grade ${doc.grade}`;
          needsUpdate = true;
        }

        // Add answer key if missing (generate from content)
        if (!doc.answer_key) {
          let answerKeyContent = [];
          
          // Parse content to generate placeholder answers
          if (doc.content) {
            try {
              const parsed = JSON.parse(doc.content);
              const items = Array.isArray(parsed) ? parsed : parsed.questions || [];
              
              // Generate placeholder answers for each question
              answerKeyContent = items.map((item, index) => ({
                index: index,
                question: typeof item === 'string' ? item.substring(0, 100) : (item.text || '').substring(0, 100),
                answer: `Answer to Question ${index + 1}`,
              }));
            } catch (e) {
              // If parsing fails, create basic structure
              answerKeyContent = [
                { index: 0, question: 'Q1', answer: 'Answer 1' },
              ];
            }
          }
          
          updates.answer_key = JSON.stringify(answerKeyContent);
          needsUpdate = true;
        }

        // Update the document if needed
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('documents')
            .update(updates)
            .eq('id', doc.id);

          if (updateError) {
            errors.push({ id: doc.id, error: updateError.message });
          } else {
            updated++;
          }
        }
      } catch (err) {
        errors.push({ id: doc.id, error: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Migration complete. Updated ${updated} documents.`,
      errors: errors.length > 0 ? errors : undefined,
      totalDocuments: documents.length,
      updatedDocuments: updated,
    });
  } catch (error) {
    console.error('Migration error:', error);
    return res.status(500).json({
      error: 'Migration failed',
      details: error.message,
    });
  }
}
