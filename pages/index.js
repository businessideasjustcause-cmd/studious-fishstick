import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { fetchUserDocuments, getUserProfile } from '../lib/supabase'
import { PlusCircle, FileText, File } from 'lucide-react'

export default function Home({ session, loading: appLoading }) {
  const router = useRouter()
  const [documents, setDocuments] = useState([])
  const [recentDocuments, setRecentDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Handle Authentication Redirects
  useEffect(() => {
    if (!appLoading && !session) {
      router.push('/landing')
    }
  }, [session, appLoading, router])

  // 2. Fetch Data
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

  // Helper functions
  const getTimeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return new Date(dateString).toLocaleDateString()
  }

  const getDocTypeLabel = (type) => {
    const labels = { assignment: 'Assignment', quiz: 'Quiz', test: 'Test', worksheet: 'Worksheet', lesson: 'Lesson' }
    return labels[type] || type
  }

  // Formatting name for greeting
  const userName = session?.user?.email 
    ? session.user.email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + session.user.email.split('@')[0].split('.')[0].slice(1) 
    : 'User'

  return (
    <Layout session={session} loading={appLoading}>
      {/* 
          Ensure the Layout component handles the sidebar. 
          The content below is the 'children' prop passed to Layout. 
      */}
      <div className="max-w-7xl mx-auto p-8 animate-fade-in-up-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600">You have {documents.length} document{documents.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in-up-2">
          <button 
            onClick={() => router.push('/create')} 
            className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-6 border border-gray-200 text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <PlusCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Create New Material</h3>
                <p className="text-sm text-gray-600">Generate assignments, quizzes, or lesson plans</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => router.push('/materials')} 
            className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-6 border border-gray-200 text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">My Documents</h3>
                <p className="text-sm text-gray-600">View and manage all your created materials</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Materials */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Materials</h2>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : recentDocuments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
              <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No documents yet. Create your first one!</p>
              <button onClick={() => router.push('/create')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Create Document
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                      {getDocTypeLabel(doc.doc_type)}
                    </span>
                    <span className="text-xs text-gray-500">{getTimeAgo(doc.created_at)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{doc.topic}</h3>
                  <p className="text-sm text-gray-600 mb-3">{doc.subject} • Grade {doc.grade}</p>
                  <button 
                    onClick={() => router.push(`/materials/${doc.id}`)} 
                    className="w-full py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}