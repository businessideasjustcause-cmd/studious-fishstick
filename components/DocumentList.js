import { useRouter } from 'next/router'
import Button from './Button'
import {
  FileText,
  Calendar,
  GraduationCap,
  Trash2,
  Copy,
  Download,
  Loader2,
} from 'lucide-react'

export default function DocumentList({ documents, onDocumentDeleted, view }) {
  const router = useRouter()

  if (!documents || documents.length === 0) return null

  return view === 'list' ? (
    <div className="bg-white rounded-xl shadow-sm divide-y">
      {documents.map((d) => (
        <div
          key={d.id}
          onClick={() => router.push(`/materials/${d.id}`)}
          className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
        >
          <div>
            <h3 className="font-semibold text-gray-900">{d.topic}</h3>
            <div className="flex gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <FileText size={14} /> {d.doc_type}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap size={14} /> Grade {d.grade}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />{' '}
                {new Date(d.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((d) => (
        <div
          key={d.id}
          onClick={() => router.push(`/materials/${d.id}`)}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer"
        >
          <h3 className="font-semibold text-lg mb-2">{d.topic}</h3>
          <p className="text-sm text-gray-600 mb-3">{d.doc_type}</p>
          <p className="text-xs text-gray-500">
            Grade {d.grade} • {new Date(d.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}