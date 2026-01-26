import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { fetchUserDocuments } from '../lib/supabase'
import { PlusCircle, FileText, File, ArrowRight, Clock, BookOpen } from 'lucide-react'

export default function Home({ session, loading: appLoading }) {
  const router = useRouter()
  const [documents, setDocuments] = useState([])
  const [recentDocuments, setRecentDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!appLoading && !session) router.push('/landing')
  }, [session, appLoading, router])

  useEffect(() => {
    if (session?.user?.id) {
      const loadData = async () => {
        setLoading(true)
        const { data, error } = await fetchUserDocuments(session.user.id)
        if (!error && data) {
          setDocuments(data)
          setRecentDocuments(data.slice(0, 3))
        }
        setLoading(false)
      }
      loadData()
    }
  }, [session?.user?.id])

  const getTimeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return new Date(dateString).toLocaleDateString()
  }

  const userName = session?.user?.email 
    ? session.user.email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + session.user.email.split('@')[0].split('.')[0].slice(1) 
    : 'Educator'

  return (
    <Layout session={session} loading={appLoading}>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{userName}</span>
            </h1>
            <p className="mt-3 text-lg text-slate-500">
              You've crafted <span className="font-semibold text-slate-900">{documents.length}</span> documents so far.
            </p>
          </div>
        </header>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <button 
            onClick={() => router.push('/create')}
            className="group relative overflow-hidden bg-white p-8 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <PlusCircle size={120} className="text-indigo-600" />
            </div>
            <div className="relative flex flex-col h-full">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <PlusCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Create New Material</h3>
              <p className="text-slate-500 mb-6">Generate AI-powered assignments, quizzes, or lesson plans in seconds.</p>
              <div className="mt-auto flex items-center text-sm font-bold text-indigo-600">
                Get started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          <button 
            onClick={() => router.push('/materials')}
            className="group relative overflow-hidden bg-white p-8 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText size={120} className="text-emerald-600" />
            </div>
            <div className="relative flex flex-col h-full">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">My Library</h3>
              <p className="text-slate-500 mb-6">Review, edit, and organize all of your previously generated materials.</p>
              <div className="mt-auto flex items-center text-sm font-bold text-emerald-600">
                Browse library <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        {/* Recent Materials */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Recent Creations</h2>
            <button onClick={() => router.push('/materials')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : recentDocuments.length === 0 ? (
            <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <File className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No documents yet</h3>
              <p className="text-slate-500 mt-1 mb-6">Your recent creations will appear here.</p>
              <button 
                onClick={() => router.push('/create')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                Create your first one
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentDocuments.map((doc) => (
                <div 
                  key={doc.id} 
                  onClick={() => router.push(`/materials/${doc.id}`)}
                  className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                      {doc.doc_type}
                    </span>
                    <div className="flex items-center text-slate-400 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {getTimeAgo(doc.created_at)}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {doc.topic}
                  </h3>
                  <div className="flex items-center text-sm text-slate-500 mb-6">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {doc.subject} • Grade {doc.grade}
                  </div>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between group-hover:border-indigo-50 transition-colors">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">View Details</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  )
}
