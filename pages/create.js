import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import DocumentForm from '../components/DocumentForm'
import { createDocument } from '../lib/supabase'

export default function CreatePage({ session, loading: appLoading }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!appLoading && !session) {
      router.push('/landing')
    }
  }, [session, appLoading, router])

  const handleCreateDocument = async (formData) => {
    setLoading(true)
    setError(null)

    try {
      const docPayload = {
        user_id: session.user.id,
        doc_type: formData.doc_type,
        subject: formData.subject,
        grade: formData.grade,
        topic: formData.topic,
        title: formData.title || formData.topic,
        standards: formData.standards || null,
        content: formData.content,
        answer_key: formData.answer_key || null,
      }

      console.log('Creating document with payload:', docPayload)
      const { data, error: createError } = await createDocument(docPayload)

      if (createError) {
        console.error('Document creation error:', createError)
        setError(createError.message || 'Failed to save document')
        setLoading(false)
      } else {
        console.log('Document created successfully:', data)
        // Redirect to edit page for the newly created document
        if (data && data[0]?.id) {
          router.push(`/materials/${data[0].id}`)
        } else {
          router.push('/materials')
        }
      }
    } catch (err) {
      console.error('Error in handleCreateDocument:', err)
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <Layout session={session} loading={appLoading}>
      <div className="p-8 animate-fade-in-up-1 relative">
        {/* Header */}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Form Container - Removed max-w and mx-auto, removed shadow and padding */}
        <div className="relative">
          <DocumentForm onSubmit={handleCreateDocument} isLoading={loading} />
        </div>
      </div>
    </Layout>
  )
}