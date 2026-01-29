import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout.js'
import Alert from '../../components/Alert.js'
import MathDisplay from '../../components/MathDisplay.js'
import { 
  ArrowLeft, Edit2, Save, X, Download, Trash2, FileText, Plus, 
  ChevronDown, ChevronUp, FileDown, ListChecks, Circle, Type, 
  MessageSquare, Square, Edit3, CheckCircle2, Sparkles
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ExportDropdown from '../../components/ExportDropdown.js'


export async function getServerSideProps(context) {
  return {
    props: {}
  }
}

// Question type detection and display
const QUESTION_TYPES = {
  'multiple-choice': { 
    icon: ListChecks, 
    label: 'Multiple Choice', 
    color: 'blue',
    detect: (text) => /Multiple Choice:|[A-D]\)/.test(text)
  },
  'true-false': { 
    icon: Circle, 
    label: 'True/False', 
    color: 'green',
    detect: (text) => /True\/False:/i.test(text)
  },
  'fill-blank': { 
    icon: Type, 
    label: 'Fill in Blank', 
    color: 'purple',
    detect: (text) => /_____|\[blank\]/.test(text)
  },
  'short-answer': { 
    icon: MessageSquare, 
    label: 'Short Answer', 
    color: 'orange',
    detect: (text) => /Short Answer:/i.test(text)
  },
  'matching': { 
    icon: Square, 
    label: 'Matching', 
    color: 'pink',
    detect: (text) => /Match:|Matching:/i.test(text)
  },
  'open-ended': { 
    icon: Edit3, 
    label: 'Open-Ended', 
    color: 'indigo',
    detect: () => false // Default fallback
  }
}

function detectQuestionType(text) {
  for (const [key, type] of Object.entries(QUESTION_TYPES)) {
    if (type.detect(text)) return key
  }
  return 'open-ended' // Default
}

function QuestionTypeBadge({ type }) {
  const typeInfo = QUESTION_TYPES[type] || QUESTION_TYPES['open-ended']
  const Icon = typeInfo.icon
  
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    pink: 'bg-pink-100 text-pink-700 border-pink-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  }
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClasses[typeInfo.color]}`}>
      <Icon className="w-3.5 h-3.5" />
      {typeInfo.label}
    </div>
  )
}

export default function DocumentView({ session, loading: appLoading }) {
  const router = useRouter()
  const { id } = router.query
  const [document, setDocument] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answerKey, setAnswerKey] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [alert, setAlert] = useState(null)
  const [addingQuestion, setAddingQuestion] = useState(false)
  const [newQuestionText, setNewQuestionText] = useState('')
  const [newQuestionType, setNewQuestionType] = useState('open-ended')
  const [showQuestions, setShowQuestions] = useState(true)
  const [showAnswerKey, setShowAnswerKey] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleText, setTitleText] = useState('')
  const [questionTypeFilter, setQuestionTypeFilter] = useState('all')


  useEffect(() => {
    if (!id) return
    fetchDocument()
  }, [id])


  const fetchDocument = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single()


      if (error) throw error


      setDocument(data)
      setTitleText(data.title || data.topic)
      parseQuestions(data.content)
      parseAnswerKey(data.answer_key)
    } catch (error) {
      console.error('Error fetching document:', error)
      setAlert({ message: 'Failed to load document', type: 'error' })
      setTimeout(() => router.push('/materials'), 2000)
    } finally {
      setLoading(false)
    }
  }


  const parseQuestions = (content) => {
    let parsedQuestions = []
    if (content) {
      try {
        const parsed = JSON.parse(content)
        if (Array.isArray(parsed)) {
          parsedQuestions = parsed
        } else if (parsed.questions && Array.isArray(parsed.questions)) {
          parsedQuestions = parsed.questions
        }
      } catch (e) {
        parsedQuestions = content.split(/\n(?=Question|\d+\.|Q:)/).map((q, i) => ({
          id: i,
          text: q.trim(),
        }))
      }
    }
   
    const questionsWithTypes = parsedQuestions.map((q, i) => {
      const text = typeof q === 'string' ? q : q.text || ''
      return {
        id: i,
        text,
        type: detectQuestionType(text)
      }
    })
    
    setQuestions(questionsWithTypes)
  }

  const parseAnswerKey = (answerKeyData) => {
    let keys = []
    
    if (answerKeyData) {
      try {
        const parsed = JSON.parse(typeof answerKeyData === 'string' ? answerKeyData : JSON.stringify(answerKeyData))
        if (Array.isArray(parsed)) {
          keys = parsed.map((item, i) => {
            return {
              id: item.id !== undefined ? item.id : i,
              text: item.text || String(item) || '',
            }
          })
        }
      } catch (e) {
        console.error('Error parsing answer key:', e)
        keys = []
      }
    }
    
    if (keys.length === 0 && questions.length > 0) {
      keys = questions.map((q, i) => ({
        id: i,
        text: `[Answer Key ${i + 1} - Click to edit]`,
      }))
    }

    const validKeys = keys.filter(k => k && k.text !== null && k.text !== undefined)
    setAnswerKey(validKeys.length > 0 ? validKeys : [{ id: 0, text: '[No answer keys available]' }])
  }


  const handleEdit = (index, text) => {
    setEditingId(index)
    setEditText(text)
  }


  const handleSave = async (index) => {
    setSaving(true)
    try {
      const updated = [...questions]
      updated[index].text = editText
      updated[index].type = detectQuestionType(editText) // Re-detect type on edit
      setQuestions(updated)


      const updatedContent = JSON.stringify(updated.map(q => q.text))
      const { error } = await supabase
        .from('documents')
        .update({ content: updatedContent })
        .eq('id', id)


      if (error) throw error
      setEditingId(null)
      setAlert({ message: 'Question saved successfully!', type: 'success' })
    } catch (error) {
      console.error('Error saving:', error)
      setAlert({ message: 'Failed to save question', type: 'error' })
    } finally {
      setSaving(false)
    }
  }


  const handleCancel = () => {
    setEditingId(null)
    setEditText('')
  }

  const handleSaveTitle = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('documents')
        .update({ title: titleText })
        .eq('id', id)

      if (error) throw error
      setDocument({ ...document, title: titleText })
      setEditingTitle(false)
      setAlert({ message: 'Title saved successfully!', type: 'success' })
    } catch (error) {
      console.error('Error saving title:', error)
      setAlert({ message: 'Failed to save title', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAnswerKey = async (index) => {
    setSaving(true)
    try {
      const updated = [...answerKey]
      updated[index] = {
        id: updated[index].id,
        text: editText,
      }
      setAnswerKey(updated)

      const updatedAnswerKey = JSON.stringify(updated)
      const { error } = await supabase
        .from('documents')
        .update({ answer_key: updatedAnswerKey })
        .eq('id', id)

      if (error) throw error
      setEditingId(null)
      setAlert({ message: 'Answer key saved successfully!', type: 'success' })
    } catch (error) {
      console.error('Error saving answer key:', error)
      setAlert({ message: 'Failed to save answer key', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleCancelAnswerKey = () => {
    setEditingId(null)
    setEditText('')
  }


  const handleAddQuestion = async () => {
    if (!newQuestionText.trim()) {
      setAlert({ message: 'Question cannot be empty', type: 'error' })
      return
    }


    try {
      const newQuestion = { 
        id: questions.length, 
        text: newQuestionText.trim(),
        type: detectQuestionType(newQuestionText.trim())
      }
      const updated = [...questions, newQuestion]
      setQuestions(updated)


      const updatedContent = JSON.stringify(updated.map(q => q.text))
      const { error } = await supabase
        .from('documents')
        .update({ content: updatedContent })
        .eq('id', id)


      if (error) throw error
      setNewQuestionText('')
      setNewQuestionType('open-ended')
      setAddingQuestion(false)
      setAlert({ message: 'Question added successfully!', type: 'success' })
    } catch (error) {
      console.error('Error adding question:', error)
      setAlert({ message: 'Failed to add question', type: 'error' })
    }
  }


  const handleDeleteQuestion = async (index) => {
    if (!window.confirm('Delete this question?')) return


    try {
      const updated = questions.filter((_, i) => i !== index)
      setQuestions(updated)


      const updatedContent = JSON.stringify(updated.map(q => q.text))
      const { error } = await supabase
        .from('documents')
        .update({ content: updatedContent })
        .eq('id', id)


      if (error) throw error
      setAlert({ message: 'Question deleted!', type: 'success' })
    } catch (error) {
      console.error('Error deleting question:', error)
      setAlert({ message: 'Failed to delete question', type: 'error' })
    }
  }

  /**
   * FIXED EXPORT TO PDF
   * Correctly handles the binary stream from pdfkit and triggers a browser download
   */
  const exportToPdf = async (includeAnswerKey = false) => {
    try {
      setAlert({ message: 'Generating PDF...', type: 'info' });

      const qs = questions.length > 0 ? questions.map(q => q.text) : ['[No questions]'];
      const aks = includeAnswerKey && answerKey.length > 0 ? answerKey.map(a => a.text) : [];
      
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleText || document.topic,
          grade: document.grade,
          subject: document.subject,
          docType: document.doc_type,
          questions: qs,
          answerKey: aks,
          includeAnswerKey
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate PDF');
      }

      // 1. Convert response to Blob (Crucial for PDFkit streams)
      const blob = await response.blob();
      
      // 2. Create a temporary URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // 3. Create and trigger download link
      const a = window.document.createElement('a');
      a.href = downloadUrl;
      
      // Sanitize filename: remove special characters and spaces
      const cleanTitle = (titleText || document.topic).replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const suffix = includeAnswerKey ? 'with_answers' : 'questions';
      a.download = `${cleanTitle}_${suffix}.pdf`;
      
      window.document.body.appendChild(a);
      a.click();
      
      // 4. Cleanup
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setAlert({ message: `PDF exported successfully!`, type: 'success' });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setAlert({ message: error.message || 'Failed to export PDF', type: 'error' });
    }
  };

  
  /**
   * FIXED DELETE MATERIAL
   * Handles the state during deletion and provides a smooth redirect
   */
  const handleDelete = async () => {
    const confirmMessage = 'Are you sure you want to delete this material? This cannot be undone.';
    if (!window.confirm(confirmMessage)) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAlert({ message: 'Material deleted successfully', type: 'success' });
      
      // Give the user a moment to see the success message
      setTimeout(() => {
        router.push('/materials');
      }, 1200);
      
    } catch (error) {
      console.error('Error deleting:', error);
      setAlert({ message: 'Failed to delete material', type: 'error' });
      setDeleting(false); // Reset button state if deletion fails
    }
  };

  // Get question type statistics
  const getQuestionTypeStats = () => {
    const stats = {}
    questions.forEach(q => {
      stats[q.type] = (stats[q.type] || 0) + 1
    })
    return stats
  }

  // Filter questions by type
  const filteredQuestions = questionTypeFilter === 'all' 
    ? questions 
    : questions.filter(q => q.type === questionTypeFilter)


  if (loading || !document) {
    return (
      <Layout session={session} loading={appLoading}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading document...</p>
          </div>
        </div>
      </Layout>
    )
  }


  const typeStats = getQuestionTypeStats()

  return (
    <Layout session={session} loading={appLoading}>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="max-w-5xl mx-auto animate-fade-in-up-1 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-all duration-200 font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Materials
          </button>
         
          {editingTitle ? (
            <div className="mb-6">
              <textarea
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                className="w-full text-4xl font-bold text-slate-900 p-4 border-2 border-indigo-500 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gradient-to-br from-white to-indigo-50"
                rows="2"
                disabled={saving}
              />
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleSaveTitle}
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition-all duration-200 font-medium shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Title'}
                </button>
                <button
                  onClick={() => {
                    setEditingTitle(false)
                    setTitleText(document.title || document.topic)
                  }}
                  disabled={saving}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:bg-slate-100 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 group cursor-pointer flex items-start gap-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {titleText || document.topic}
              </h1>
              <button
                onClick={() => {
                  setEditingTitle(true)
                  setTitleText(titleText || document.topic)
                }}
                className="opacity-0 group-hover:opacity-100 mt-2 p-2 text-slate-400 hover:text-slate-600 transition-all duration-200 hover:scale-110"
                title="Edit title"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          )}
         
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm">
              <Sparkles className="w-4 h-4" />
              {document.doc_type}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200">
              <span className="font-semibold">Grade</span> {document.grade}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200">
              {document.subject}
            </span>
          </div>
        </div>


        {/* Action Buttons Container */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 animate-fade-in-up-2">
          
          {/* The New Component: Consolidates all export logic */}
          <ExportDropdown onExport={exportToPdf} />

          {/* Refined Standalone Delete Button */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="group flex items-center gap-2 px-6 py-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-all duration-200 font-semibold disabled:opacity-50 hover:shadow-sm"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {deleting ? 'Deleting...' : 'Delete Material'}
          </button>
        </div>


        {/* Questions Container */}
        <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl shadow-md animate-fade-in-up-3 mb-6 overflow-hidden">
          <button
            onClick={() => setShowQuestions(!showQuestions)}
            className="w-full flex items-center gap-4 p-6 hover:bg-slate-100/50 transition-all duration-200"
          >
            {showQuestions ? <ChevronUp className="w-6 h-6 text-indigo-600" /> : <ChevronDown className="w-6 h-6 text-indigo-600" />}
            <FileText className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900">Questions</h2>
            <span className="ml-auto text-sm font-semibold text-slate-600 bg-slate-200 px-3 py-1 rounded-full">
              {questions.length} {questions.length === 1 ? 'question' : 'questions'}
            </span>
          </button>
          
          {showQuestions && (
          <>
            {/* Question Type Filter */}
            {Object.keys(typeStats).length > 1 && (
              <div className="px-6 pt-4 pb-2 border-t border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-700">Filter by type:</span>
                  <button
                    onClick={() => setQuestionTypeFilter('all')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                      questionTypeFilter === 'all' 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    All ({questions.length})
                  </button>
                  {Object.entries(typeStats).map(([type, count]) => {
                    const typeInfo = QUESTION_TYPES[type]
                    const Icon = typeInfo.icon
                    const colorClasses = {
                      blue: questionTypeFilter === type ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200',
                      green: questionTypeFilter === type ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200',
                      purple: questionTypeFilter === type ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200',
                      orange: questionTypeFilter === type ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200',
                      pink: questionTypeFilter === type ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-200',
                      indigo: questionTypeFilter === type ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200'
                    }
                    return (
                      <button
                        key={type}
                        onClick={() => setQuestionTypeFilter(type)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${colorClasses[typeInfo.color]}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {typeInfo.label} ({count})
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="p-6 pt-4 space-y-4 border-t border-slate-200">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  {questionTypeFilter === 'all' ? (
                    <>
                      <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                      <p className="text-lg font-medium">No questions found</p>
                      <p className="text-sm">Add your first question below!</p>
                    </>
                  ) : (
                    <>
                      <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                      <p className="text-lg font-medium">No {QUESTION_TYPES[questionTypeFilter].label} questions</p>
                      <p className="text-sm">Try a different filter or add new questions</p>
                    </>
                  )}
                </div>
              ) : (
                filteredQuestions.map((question, index) => {
                  const actualIndex = questions.findIndex(q => q.id === question.id)
                  return (
                    <div
                      key={question.id}
                      className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
                          {actualIndex + 1}
                        </div>

                        <div className="flex-1 min-w-0 space-y-3">
                          <QuestionTypeBadge type={question.type} />
                          
                          {editingId === actualIndex ? (
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full border-2 border-indigo-400 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white"
                              rows="4"
                              placeholder="Use $ for inline math: $x = 2$ or $$ for display math: $$x = 2$$"
                            />
                          ) : (
                            <div className="text-slate-900 text-base leading-relaxed">
                              <MathDisplay content={question.text} />
                            </div>
                          )}
                        </div>

                        {editingId === actualIndex ? (
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleSave(actualIndex)}
                              disabled={saving}
                              className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200 disabled:opacity-50 hover:scale-105"
                            >
                              <Save className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all duration-200 hover:scale-105"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <button
                              onClick={() => handleEdit(actualIndex, question.text)}
                              className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-200 hover:scale-105"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(actualIndex)}
                              className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200 hover:scale-105"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Add Question Section */}
            <div className="p-6 pt-4 border-t border-slate-200 bg-slate-50/50">
              {!addingQuestion ? (
                <button
                  onClick={() => setAddingQuestion(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Add Question
                </button>
              ) : (
                <div className="bg-white border-2 border-indigo-300 rounded-xl p-6 space-y-4 shadow-sm">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">New Question</label>
                    <p className="text-xs text-slate-600 mb-3">💡 Use $x = 2$ for inline math, or $$\frac{1}{2}$$ for display math</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Question Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(QUESTION_TYPES).map(([key, type]) => {
                        const Icon = type.icon
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setNewQuestionType(key)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                              newQuestionType === key 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                : 'border-slate-200 hover:border-slate-300 text-slate-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {type.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <textarea
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Enter your question here... Example: Solve $2x + 3 = 7$"
                    className="w-full border-2 border-indigo-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white"
                    rows="3"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddQuestion}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-semibold shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      Add Question
                    </button>
                    <button
                      onClick={() => {
                        setAddingQuestion(false)
                        setNewQuestionText('')
                        setNewQuestionType('open-ended')
                      }}
                      className="px-5 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
          )}
        </div>

        {/* Answer Key Container */}
        <div className="bg-gradient-to-br from-white to-emerald-50 border border-emerald-200 rounded-2xl shadow-md animate-fade-in-up-4 overflow-hidden">
          <button
            onClick={() => setShowAnswerKey(!showAnswerKey)}
            className="w-full flex items-center gap-4 p-6 hover:bg-emerald-100/50 transition-all duration-200"
          >
            {showAnswerKey ? <ChevronUp className="w-6 h-6 text-emerald-600" /> : <ChevronDown className="w-6 h-6 text-emerald-600" />}
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-slate-900">Answer Key</h2>
            <span className="ml-auto text-sm font-semibold text-emerald-700 bg-emerald-200 px-3 py-1 rounded-full">
              {answerKey.length} {answerKey.length === 1 ? 'answer' : 'answers'}
            </span>
          </button>
          
          {showAnswerKey && (
          <div className="p-6 pt-4 space-y-4 border-t border-emerald-200">
            {answerKey && answerKey.length > 0 ? (
              answerKey.map((answer, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-emerald-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      {editingId === `answer-${index}` ? (
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full border-2 border-emerald-400 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
                          rows="4"
                          placeholder="Enter answer..."
                        />
                      ) : (
                        <div className="text-slate-900 text-base leading-relaxed">
                          {answer?.text ? <MathDisplay content={answer.text} /> : <span className="text-slate-500 italic">[No answer provided]</span>}
                        </div>
                      )}
                    </div>

                    {editingId === `answer-${index}` ? (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleSaveAnswerKey(index)}
                          disabled={saving}
                          className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200 disabled:opacity-50 hover:scale-105"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleCancelAnswerKey}
                          className="p-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all duration-200 hover:scale-105"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={() => {
                            setEditingId(`answer-${index}`)
                            setEditText(answer.text)
                          }}
                          className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200 hover:scale-105"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-500">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">No answer key available</p>
                <p className="text-sm">Edit the answer items above to add answers</p>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </Layout>
  )
}