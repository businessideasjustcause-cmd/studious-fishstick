import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { deleteDocuments, fetchUserDocuments } from '../lib/supabase' 
import { 
  LayoutGrid, FileText, Calendar, GraduationCap, Search, X, 
  Plus, Trash2, CheckSquare, Sparkles, LayoutList
} from 'lucide-react'

export default function MaterialsPage({ session, loading }) {
  const router = useRouter()
  const [docs, setDocs] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [view, setView] = useState('grid') // 'grid' or 'list'
  const [selectedIds, setSelectedIds] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!loading && !session) router.replace('/landing')
  }, [loading, session, router])

  const loadData = async () => {
    if (!session?.user?.id) return
    setPageLoading(true)
    const { data, error } = await fetchUserDocuments(session.user.id)
    if (!error) setDocs(data || [])
    setPageLoading(false)
  }

  useEffect(() => { loadData() }, [session?.user?.id])

  const filteredDocs = useMemo(() => {
    return docs.filter(d => 
      d.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.doc_type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [docs, searchQuery])

  const handleBatchDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} items permanently?`)) return
    const { error } = await deleteDocuments(selectedIds)
    if (!error) {
      setDocs(docs.filter(d => !selectedIds.includes(d.id)))
      setSelectedIds([])
    }
  }

  return (
    <Layout session={session} loading={loading}>
      <div className="min-h-screen bg-[#F9FBFF]">
        <div className="max-w-[1600px] mx-auto px-6 py-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                My Library <Sparkles className="text-indigo-500" size={24}/>
              </h1>
              <p className="text-slate-500 font-medium mt-1">Manage all your generated educational materials</p>
            </div>
            
            <button 
              onClick={() => router.push('/create')} 
              className="bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-bold"
            >
              <Plus size={20} strokeWidth={3}/> New Document
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
            <div className="relative flex-grow max-w-2xl w-full group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                type="text" placeholder="Search by topic or type..." 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-[1.5rem] shadow-sm focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-700" 
              />
            </div>
            
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
               <button onClick={() => setView('grid')} className={`p-2.5 rounded-xl transition-all ${view === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={22}/></button>
               <button onClick={() => setView('list')} className={`p-2.5 rounded-xl transition-all ${view === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><LayoutList size={22}/></button>
            </div>
          </div>

          {/* Results */}
          {pageLoading ? (
            <div className="flex flex-col items-center py-40 animate-pulse">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"/>
              <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Accessing Library...</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in zoom-in-95 duration-500">
              {filteredDocs.map((d) => (
                <div key={d.id} className={`group relative bg-white border border-slate-50 p-7 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${selectedIds.includes(d.id) ? 'ring-4 ring-indigo-100 border-indigo-200' : ''}`}>
                  <button 
                    onClick={() => setSelectedIds(prev => prev.includes(d.id) ? prev.filter(id => id !== d.id) : [...prev, d.id])}
                    className={`absolute top-6 right-6 z-10 p-2 rounded-xl transition-all ${selectedIds.includes(d.id) ? 'bg-indigo-600 text-white' : 'opacity-0 group-hover:opacity-100 bg-slate-100 text-slate-400'}`}
                  >
                    <CheckSquare size={18} strokeWidth={3}/>
                  </button>
                  <div className="cursor-pointer" onClick={() => router.push(`/materials/${d.id}`)}>
                    <div className="w-14 h-14 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors"><FileText size={28}/></div>
                    <h4 className="text-lg font-black text-slate-900 truncate mb-1">{d.topic}</h4>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6">{d.doc_type}</p>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-t pt-5 border-slate-50">
                      <span className="flex items-center gap-1.5"><GraduationCap size={14}/> Grade {d.grade}</span>
                      <span>{new Date(d.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredDocs.map((d) => (
                <div key={d.id} className="group flex items-center px-8 py-5 hover:bg-slate-50 border-b border-slate-50 last:border-none transition-colors relative">
                  <button 
                    onClick={() => setSelectedIds(prev => prev.includes(d.id) ? prev.filter(id => id !== d.id) : [...prev, d.id])}
                    className={`mr-6 p-2 rounded-xl transition-all ${selectedIds.includes(d.id) ? 'bg-indigo-600 text-white' : 'opacity-0 group-hover:opacity-100 bg-slate-100 text-slate-400'}`}
                  >
                    <CheckSquare size={16}/>
                  </button>
                  <div className="flex flex-grow items-center gap-6 cursor-pointer" onClick={() => router.push(`/materials/${d.id}`)}>
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0"><FileText size={20}/></div>
                    <div className="flex-grow grid grid-cols-4 items-center">
                      <span className="col-span-2 font-bold text-slate-900 truncate pr-4">{d.topic}</span>
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{d.doc_type}</span>
                      <span className="text-xs font-bold text-slate-400 text-right">{new Date(d.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Island */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-12 duration-500">
            <div className="flex flex-col"><span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Selected</span><span className="font-black text-lg leading-tight">{selectedIds.length} Items</span></div>
            <div className="h-10 w-[1px] bg-slate-700"/>
            <button onClick={handleBatchDelete} className="flex items-center gap-2 hover:text-rose-400 font-bold text-sm transition-colors"><Trash2 size={20}/> Delete Selected</button>
            <button onClick={() => setSelectedIds([])} className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-colors"><X size={18}/></button>
          </div>
        )}
      </div>
    </Layout>
  )
}
