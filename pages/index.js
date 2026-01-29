import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Footer from '../components/Footer'
import { fetchUserDocuments } from '../lib/supabase'
import { 
  PlusCircle, FileText, File, ArrowRight, Clock, 
  BookOpen, Lightbulb, Sparkles, RotateCcw, Zap, TrendingUp, History 
} from 'lucide-react'
import LoginFooter from '@/components/Loginfooter'

export default function Home({ session, loading: appLoading }) {
  const router = useRouter()
  const [documents, setDocuments] = useState([])
  const [recentDocuments, setRecentDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTips, setActiveTips] = useState([])

  const allTips = [
    "Add 'State Standards' to your prompt to auto-align alignment codes.",
    "Export to PDF to preserve layouts for Google Classroom.",
    "Use 'Include Answer Key' in your topic to save grading time.",
    "Try 'Lab Activity' as a doc type for hands-on science materials.",
    "Specify 'Lexile Level' to differentiate reading for your students.",
    "Use the 'Collaborate' button to share materials with your department.",
    "DraftStudio works best when you specify a clear 'Learning Objective'."
  ]

  const shuffleTips = () => {
    const shuffled = [...allTips].sort(() => 0.5 - Math.random())
    setActiveTips(shuffled.slice(0, 2))
  }

  useEffect(() => {
    shuffleTips()
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

  // --- 2026 Stats Calculation ---
  const HOURS_PER_DOC = 1.5 
  const totalHoursSaved = (documents.length * HOURS_PER_DOC).toFixed(1)

  return (
    <Layout session={session} loading={appLoading}>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-1000">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Welcome back, <br /><span className="text-indigo-600">{userName}</span>
            </h1>
            <p className="mt-3 text-lg text-slate-500 font-medium italic">
              "Every great lesson begins with a focused draft."
            </p>
          </div>
        </header>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button 
            onClick={() => router.push('/select')}
            className="group relative overflow-hidden bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <PlusCircle size={120} className="text-indigo-600" />
            </div>
            <div className="relative flex flex-col h-full text-left">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <PlusCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Create New Material</h3>
              <p className="text-slate-500 mb-6 text-sm">Generate AI-powered assignments, quizzes, or lesson plans in seconds.</p>
              <div className="mt-auto flex items-center text-sm font-bold text-indigo-600 uppercase tracking-widest">
                Get started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          <button 
            onClick={() => router.push('/materials')}
            className="group relative overflow-hidden bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText size={120} className="text-emerald-600" />
            </div>
            <div className="relative flex flex-col h-full text-left">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">My Library</h3>
              <p className="text-slate-500 mb-6 text-sm">Review, edit, and organize all of your previously generated materials.</p>
              <div className="mt-auto flex items-center text-sm font-bold text-emerald-600 uppercase tracking-widest">
                Browse library <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        {/* Recent Materials */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <History size={20} className="text-slate-400" /> Recent Creations
            </h2>
            <button onClick={() => router.push('/materials')} className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:underline">View All</button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-[2.5rem] bg-slate-100 animate-pulse" />)}
            </div>
          ) : recentDocuments.length === 0 ? (
            <div className="bg-slate-50 rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-200">
               <File className="h-10 w-10 text-slate-300 mx-auto mb-4" />
               <p className="font-bold text-slate-500 italic">No materials drafted yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentDocuments.map((doc) => (
                <div key={doc.id} onClick={() => router.push(`/materials/${doc.id}`)} className="group cursor-pointer bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700">{doc.doc_type}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTimeAgo(doc.created_at)}</span>
                  </div>
                  <h3 className="font-black text-slate-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{doc.topic}</h3>
                  <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                    <BookOpen size={14} className="mr-2" /> {doc.subject} &bull; Grade {doc.grade}
                  </div>
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between group-hover:border-indigo-50 transition-colors">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Open Workspace</span>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- TIPS & STATS SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Dynamic Tips Panel */}
          <div className="lg:col-span-2 bg-indigo-600 rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl shadow-indigo-100 group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
               <Lightbulb size={200} className="text-white" />
             </div>
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                    <Sparkles size={12} /> Pro Insights
                  </div>
                  <button onClick={shuffleTips} className="text-[10px] font-black text-indigo-200 hover:text-white uppercase tracking-widest flex items-center gap-2">
                    <RotateCcw size={14} /> New Tip
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeTips.map((tip, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${i * 150}ms` }}>
                      <p className="text-sm font-bold text-white leading-relaxed italic">"{tip}"</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* Stats Summary Panel */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-sm">
             <div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <Zap size={24} fill="currentColor" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Efficiency Gain</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Based on your {documents.length} creations, you have reclaimed significant instructional time.
                </p>
             </div>
             <div className="mt-8">
                <p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">
                  {totalHoursSaved}<span className="text-lg text-slate-400 font-bold ml-1">hrs</span>
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                   <TrendingUp size={14} className="text-emerald-500" /> Life Savings Total
                </p>
             </div>
          </div>
        </section>

      </div>
      <LoginFooter />
    </Layout>
  )
}
