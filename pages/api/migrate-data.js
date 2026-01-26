// /pages/api/migrate-data.js
import { createClient } from '@supabase/supabase-js';

// Use Service Role Key for administrative tasks to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // 1. Security: Check for Admin Secret Header
  const adminSecret = req.headers['x-migration-secret'];
  if (adminSecret !== process.env.MIGRATION_SECRET) {
    return res.status(401).json({ error: 'Unauthorized: Admin secret required' });
  }

  const isDryRun = req.body.dryRun === true;

  try {
    // 2. Fetch documents that specifically need the update
    const { data: documents, error: fetchError } = await supabase
      .from('documents')
      .select('id, title, topic, doc_type, grade, content, answer_key')
      .or('title.is.null,answer_key.is.null'); // Only target missing data

    if (fetchError) throw fetchError;
    if (!documents || documents.length === 0) {
      return res.status(200).json({ message: 'No documents require migration.' });
    }

    const migrationLogs = [];
    let updatedCount = 0;

    // 3. Process Batch
    for (const doc of documents) {
      const updates = {};
      
      // Fallback Title Generation
      if (!doc.title) {
        updates.title = doc.topic || `${doc.doc_type || 'Material'} - Grade ${doc.grade || 'K'}`;
      }

      // Placeholder Answer Key Generation
      if (!doc.answer_key) {
        let answerKeyContent = [];
        try {
          const parsed = typeof doc.content === 'string' ? JSON.parse(doc.content) : doc.content;
          const items = Array.isArray(parsed) ? parsed : (parsed?.questions || []);
          
          answerKeyContent = items.map((item, index) => ({
            index: index + 1,
            label: `Question ${index + 1}`,
            answer: "Teacher feedback required" 
          }));
        } catch (e) {
          answerKeyContent = [{ index: 1, label: "Manual Key", answer: "Draft generated without specific answers" }];
        }
        updates.answer_key = JSON.stringify(answerKeyContent);
      }

      if (!isDryRun) {
        const { error: updateError } = await supabase
          .from('documents')
          .update(updates)
          .eq('id', doc.id);
        
        if (!updateError) updatedCount++;
        else migrationLogs.push({ id: doc.id, status: 'error', error: updateError.message });
      } else {
        migrationLogs.push({ id: doc.id, status: 'dry-run', updates });
      }
    }

    return res.status(200).json({
      success: true,
      mode: isDryRun ? 'DRY_RUN' : 'LIVE',
      processed: documents.length,
      updated: updatedCount,
      logs: migrationLogs.length > 0 ? migrationLogs : 'All clear'
    });

  } catch (error) {
    return res.status(500).json({ error: 'Migration Failed', message: error.message });
  }
}
