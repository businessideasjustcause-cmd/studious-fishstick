import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { fetchUserDocuments } from '../lib/supabase'
import { LayoutList, LayoutGrid, FileText, Calendar, GraduationCap } from 'lucide-react'

export default function MaterialsPage({ session, loading }) {
  const router = useRouter()
  const [docs, setDocs] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [sortBy, setSortBy] = useState('date-newest')
  const [sortOpen, setSortOpen] = useState(false)
  const [view, setView] = useState('list') // list | cards

  useEffect(() => {
    if (!loading && !session) router.replace('/landing')
  }, [loading, session, router])

  useEffect(() => {
    if (!session?.user?.id) return
    let mounted = true
    const load = async () => {
      setPageLoading(true)
      const { data, error } = await fetchUserDocuments(session.user.id)
      if (!error && mounted) {
  const parsedDocs = (data || []).map(d => ({
    ...d,
    content: typeof d.content === 'string' ? JSON.parse(d.content) : d.content,
  }))
  setDocs(parsedDocs)
}

      if (mounted) setPageLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [session?.user?.id])

  const sortedDocs = useMemo(() => {
    const d = [...docs]
    switch (sortBy) {
      case 'date-oldest': return d.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at))
      case 'name-a-z': return d.sort((a,b)=>a.topic.localeCompare(b.topic))
      case 'name-z-a': return d.sort((a,b)=>b.topic.localeCompare(a.topic))
      case 'type': return d.sort((a,b)=>a.doc_type.localeCompare(b.doc_type))
      case 'grade': return d.sort((a,b)=>a.grade.localeCompare(b.grade))
      default: return d.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))
    }
  }, [docs, sortBy])

  return (
    <Layout session={session} loading={loading}>
      <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in-up-1">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">My Materials</h1>
          <p className="text-gray-600">All your generated documents</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="relative">
            <button onClick={()=>setSortOpen(v=>!v)} className="px-4 py-2 border rounded-lg font-medium hover:border-gray-400">
              Sort: {sortBy.replace('-',' ')}
            </button>
            {sortOpen && (
              <div className="absolute mt-2 w-52 bg-white border rounded-lg shadow-lg z-20">
                {[
                  ['date-newest','Date (Newest)'],
                  ['date-oldest','Date (Oldest)'],
                  ['name-a-z','Name (A–Z)'],
                  ['name-z-a','Name (Z–A)'],
                  ['type','Type'],
                  ['grade','Grade']
                ].map(([val,label]) => (
                  <button key={val} onClick={()=>{setSortBy(val); setSortOpen(false)}}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-indigo-50 ${sortBy===val?'bg-indigo-100 font-semibold':''}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex border rounded-lg overflow-hidden">
            <button onClick={()=>setView('list')} className={`p-2 ${view==='list'?'bg-indigo-100':''}`}><LayoutList /></button>
            <button onClick={()=>setView('cards')} className={`p-2 ${view==='cards'?'bg-indigo-100':''}`}><LayoutGrid /></button>
          </div>
        </div>

        {/* Content */}
        {pageLoading ? (
          <div className="text-center py-16 text-gray-500">Loading your materials…</div>
        ) : sortedDocs.length === 0 ? (
          <div className="bg-white p-12 rounded-xl text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">No materials yet</h3>
            <p className="text-gray-600 mb-6">Create your first worksheet or quiz.</p>
            <button onClick={()=>router.push('/create')} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create Document</button>
          </div>
        ) : view==='list' ? (
          <div className="bg-white rounded-xl shadow-sm divide-y">
            {sortedDocs.map(d=>(
              <div key={d.id} onClick={()=>router.push(`/materials/${d.id}`)}
                className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{d.topic}</h3>
                  <div className="flex gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><FileText size={14}/>{d.doc_type}</span>
                    <span className="flex items-center gap-1"><GraduationCap size={14}/>Grade {d.grade}</span>
                    <span className="flex items-center gap-1"><Calendar size={14}/>{new Date(d.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDocs.map(d=>(
              <div key={d.id} onClick={()=>router.push(`/materials/${d.id}`)}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer"
              >
                <h3 className="font-semibold text-lg mb-2">{d.topic}</h3>
                <p className="text-sm text-gray-600 mb-3">{d.doc_type}</p>
                <p className="text-xs text-gray-500">Grade {d.grade} • {new Date(d.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}