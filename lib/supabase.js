import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY


if (!supabaseUrl || !supabaseAnonKey) {
 throw new Error(
   'Missing Supabase environment variables. Please check .env.local file.'
 )
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey)


export async function signInWithEmail(email, password) {
 try {
   const { data, error } = await supabase.auth.signInWithPassword({
     email,
     password,
   })
   return { data, error }
 } catch (error) {
   console.error('Email sign-in error:', error)
   return { data: null, error }
 }
}


export async function signUpWithEmail(email, password) {
 try {
   const { data, error } = await supabase.auth.signUp({
     email,
     password,
   })
   return { data, error }
 } catch (error) {
   console.error('Email sign-up error:', error)
   return { data: null, error }
 }
}


export async function signOut() {
 try {
   const { error } = await supabase.auth.signOut()
   return { error }
 } catch (error) {
   console.error('Sign-out error:', error)
   return { error }
 }
}


export async function getCurrentUser() {
 try {
   const {
     data: { user },
     error,
   } = await supabase.auth.getUser()
   return { user, error }
 } catch (error) {
   console.error('Get current user error:', error)
   return { user: null, error }
 }
}


export async function getUserProfile(userId) {
 try {
   const { data, error } = await supabase
     .from('user_profiles')
     .select('*')
     .eq('id', userId)
     .single()
   return { data, error }
 } catch (error) {
   console.error('Get user profile error:', error)
   return { data: null, error }
 }
}


export async function fetchUserDocuments(userId) {
 try {
   const { data, error } = await supabase
     .from('documents')
     .select('*')
     .eq('user_id', userId)
     .order('created_at', { ascending: false })
   return { data, error }
 } catch (error) {
   console.error('Fetch documents error:', error)
   return { data: null, error }
 }
}


export async function createDocument(documentData) {
 try {
   const { data, error } = await supabase
     .from('documents')
     .insert([documentData])
     .select()
   return { data, error }
 } catch (error) {
   console.error('Create document error:', error)
   return { data: null, error }
 }
}


export async function updateDocument(documentId, updates) {
 try {
   const { data, error } = await supabase
     .from('documents')
     .update(updates)
     .eq('id', documentId)
     .select()
   return { data, error }
 } catch (error) {
   console.error('Update document error:', error)
   return { data: null, error }
 }
}


export async function deleteDocument(documentId) {
 try {
   const { error } = await supabase
     .from('documents')
     .delete()
     .eq('id', documentId)
   return { error }
 } catch (error) {
   console.error('Delete document error:', error)
   return { error }
 }
}

