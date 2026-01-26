import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * AUTHENTICATION
 */
export async function signInWithEmail(email, password) {
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email, password) {
  return await supabase.auth.signUp({ email, password })
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export async function getUserProfile(userId) {
  return await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

/**
 * DOCUMENTS (SINGLE OPERATIONS)
 */
export async function fetchUserDocuments(userId) {
  return await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function createDocument(documentData) {
  return await supabase
    .from('documents')
    .insert([documentData])
    .select()
}

export async function updateDocument(documentId, updates) {
  return await supabase
    .from('documents')
    .update(updates)
    .eq('id', documentId)
    .select()
}

export async function deleteDocument(documentId) {
  return await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)
}

/**
 * BATCH OPERATIONS
 */

/**
 * Deletes multiple documents at once based on an array of IDs.
 * Used for the "Action Island" batch delete feature.
 */
export async function deleteDocuments(ids) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .delete()
      .in('id', ids)
    return { data, error }
  } catch (error) {
    console.error('Batch delete error:', error)
    return { data: null, error }
  }
}
