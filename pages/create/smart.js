import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import SmartForm from '../../components/SmartForm'
import { createDocument } from '../../lib/supabase'
import { Wand2, Zap, AlertCircle, ChevronLeft } from 'lucide-react'
import LoginFooter from '@/components/Loginfooter'

export default function SmartCreatePage({ session, loading: appLoading }) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  const handleSmartGenerate = async (formData) => {
    setIsGenerating(true)
    setError(null)

    try {
      // 1. Call your existing generate-document API
      const resp = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: formData.prompt, 
          mode: 'smart',
          // Fill defaults so your API validation doesn't fail
          topic: formData.prompt, 
          grade: 'General', 
          subject: 'General', 
          docType: 'draft' 
        })
      })

      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Generation failed')

      // 2. Prepare the document for Supabase (NO metadata column used here)
      const docPayload = {
        user_id: session.user.id,
        doc_type: 'Smart Draft',
        subject: 'General',
        grade: 'K-12',
        topic: formData.prompt,
        title: data.title || 'Smart Draft',
        content: JSON.stringify(data.content),
        standards: null,
        answer_key: null
      }

      // 3. Save to database
      const { data: newDoc, error: dbError } = await createDocument(docPayload)
      if (dbError) throw dbError

      // 4. Redirect to the result
      router.push(`/materials/${newDoc[0].id}`)

    } catch (err) {
      console.error('Smart Mode Error:', err)
      setError(err.message || 'An unexpected error occurred.')
      setIsGenerating(false)
    }
  }

  return (
    <Layout session={session} loading={appLoading}>
      <div className="max-w-6xl mx-auto px-6 py-12 min-h-[calc(100vh-120px)] flex flex-col relative animate-in fade-in duration-1000">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <button onClick={() => router.push('/select')} className="group flex items-center text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-orange-600 transition-all mb-4">
              <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Select
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
              Smart Mode <Wand2 className="text-orange-500 animate-pulse" size={32} />
            </h1>
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 text-orange-700 rounded-2xl text-sm font-bold border border-orange-100 shadow-sm shadow-orange-100/50">
            <Zap size={16} className="fill-orange-600" /> Smart Generatation Powered by Llama-3.1
          </div>
        </header>

        {error && (
          <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-[1.5rem] flex items-center gap-3 text-rose-700">
            <AlertCircle size={20} />
            <span className="font-bold text-xs uppercase tracking-tight">{error}</span>
          </div>
        )}

        <div className="relative flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-50/40 blur-[120px] rounded-full pointer-events-none" />
          {/* Passed onSubmit as a prop here */}
          <SmartForm onSubmit={handleSmartGenerate} isLoading={isGenerating} />
        </div>
      </div>

      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
            <Zap className="absolute inset-0 m-auto text-orange-500 animate-pulse" size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">Drafting Material...</h2>
          <p className="text-slate-500 font-medium max-w-sm text-lg italic italic">"Llama-3.1-8b is analyzing your prompt..."</p>
        </div>
      )}
      <LoginFooter />
    </Layout>
  )
}
