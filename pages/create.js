import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import DocumentForm from '../components/DocumentForm'
import { createDocument } from '../lib/supabase'
import { Sparkles, ArrowLeft, AlertCircle, FilePlus2, Wand2 } from 'lucide-react'
import LoginFooter from '@/components/Loginfooter'

export default function CreatePage({ session, loading: appLoading }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
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

      const { data, error: createError } = await createDocument(docPayload)

      if (createError) {
        setError(createError.message || 'Failed to save document')
        setLoading(false)
      } else {
        if (data && data[0]?.id) {
          router.push(`/materials/${data[0].id}`)
        } else {
          router.push('/materials')
        }
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <Layout session={session} loading={appLoading}>
      <div className={`max-w-5xl mx-auto px-6 py-12 transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-8 border-b border-slate-100 gap-6">
          <div className="space-y-2">
            <button 
              onClick={() => router.push('/materials')}
              className="flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors mb-4"
            >
              <ArrowLeft size={14} className="mr-2" /> Back to Library
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Create Material <Wand2 className="text-indigo-500" size={28} />
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Define your parameters and let Draft Studio draft your next resource.
            </p>
          </div>
          
          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-2xl text-sm font-bold border border-indigo-100">
            <Sparkles size={16} />
            Creation Ready
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Main Workspace Area */}
        <div className="relative">
          {/* Subtle Background Accent */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50/50 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 sm:p-12">
             <DocumentForm onSubmit={handleCreateDocument} isLoading={loading} />
          </div>
        </div>

        {/* Footer Hint */}
        <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
          Draft Studio &bull; Education Workspace
        </p>
      </div>

      {/* Full Screen Loading Overlay for Generation */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-2 italic">Drafting your material...</h2>
          <p className="text-slate-500 font-medium max-w-xs">
            Our AI is generating questions, aligning standards, and preparing your workspace.
          </p>
        </div>
      )}
      <LoginFooter />
    </Layout>
  )
}
