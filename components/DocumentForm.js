import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button'
import Dropdown from './Dropdown'
import { supabase } from '../lib/supabase'
import { 
  FileText, HelpCircle, BookOpen, CheckSquare, GraduationCap, 
  BarChart3, X, Check, Plus, Zap, Loader2 
} from 'lucide-react'


/** Modal Component */
function Modal({ open, onClose, title, children }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!open || !mounted) return null


  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="fixed inset-0 bg-black/40 animate-[fadeIn_0.2s_ease-out]" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-[10000] animate-[slideUp_0.3s_ease-out]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-auto">{children}</div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>,
    document.body
  )
}


/** Constants */
const contentTypes = [
  { value: 'worksheet', label: 'Worksheet', description: 'Fill-in-blank, short & extended response', icon: FileText },
  { value: 'quiz', label: 'Quiz', description: 'Multiple choice & short answer', icon: HelpCircle },
  { value: 'assignment', label: 'Assignment', description: 'Structured task with rubric', icon: CheckSquare },
  { value: 'test', label: 'Test', description: 'Comprehensive assessment', icon: BookOpen },
  { value: 'lesson', label: 'Lesson', description: 'Complete lesson plan', icon: GraduationCap }
]


const difficultyLevels = [
  { value: 'under', label: 'Below Grade Level', description: 'Scaffolded for struggling learners' },
  { value: 'on', label: 'On Grade Level', description: 'Meets standard expectations' },
  { value: 'above', label: 'Above Grade Level', description: 'Extended challenge' }
]


/** Main Form Component */
export default function DocumentForm({ onSubmit, isLoading = false }) {
  const [docType, setDocType] = useState('worksheet')
  const [grade, setGrade] = useState('K')
  const [subject, setSubject] = useState('Math')
  const [topic, setTopic] = useState('')
  const [course, setCourse] = useState('')
  const [standardsSelected, setStandardsSelected] = useState([])
  const [level, setLevel] = useState('on')
  const [questionCount, setQuestionCount] = useState(6)


  const [errors, setErrors] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)


  const [showStandardsModal, setShowStandardsModal] = useState(false)
  const [standardsList, setStandardsList] = useState([])
  const [standardsSearch, setStandardsSearch] = useState('')
  const [loadingStandards, setLoadingStandards] = useState(false)


  const [showCourseModal, setShowCourseModal] = useState(false)
  const highSchoolCourses = ['Math 1', 'Math 2', 'Algebra I', 'Geometry', 'Algebra II', 'Precalculus']


  /** Fetch Standards from Supabase */
  useEffect(() => { if (showStandardsModal) fetchStandards() }, [showStandardsModal, grade, subject, course])
  async function fetchStandards() {
    try {
      setLoadingStandards(true)
      let builder = supabase.from('standards').select('id,name,content,grade,subject')
      // Use 'HS' for high school
      const supabaseGrade = grade === 'High School' ? 'HS' : grade
      if (grade) builder = builder.eq('grade', supabaseGrade)
      if (subject) builder = builder.eq('subject', subject)
      if (course && grade.toLowerCase().includes('high')) builder = builder.ilike('content', `%${course}%`)
      const { data, error } = await builder.limit(500)
      if (error) throw error
      setStandardsList(data || [])
    } catch (err) {
      console.error(err)
      setStandardsList([])
    } finally { setLoadingStandards(false) }
  }


  function toggleStandard(s) {
    setStandardsSelected(prev => prev.find(p => p.id === s.id) ? prev.filter(p => p.id !== s.id) : [...prev, s])
  }


  function validateForGenerate() {
    const newErrors = {}
    if (!subject) newErrors.subject = 'Subject required'
    if (!grade) newErrors.grade = 'Grade required'
    if (!topic || !topic.trim()) newErrors.topic = 'Topic required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  /** Submit Handler */
  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateForGenerate()) return

    setIsGenerating(true)
    setErrors({})
    try {
      const payload = {
        docType, subject, grade, topic,
        standards: standardsSelected.map(s => s.content),
        course, level, questionCount
      }

      console.log('Sending payload:', payload)
      const resp = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const data = await resp.json()
      console.log('API Response:', resp.status, data)
      
      if (!resp.ok) {
        const errorMessage = data?.error || data?.message || 'Failed to generate document'
        throw new Error(errorMessage)
      }

      const content = data.content || []
      if (!Array.isArray(content) || content.length === 0) {
        throw new Error('No content generated. Please try again.')
      }

      // Store content and title as JSON string
      const doc = {
        doc_type: docType,
        subject,
        grade,
        topic,
        title: data.title || topic,
        standards: standardsSelected.map(s => s.content).join('\n'),
        content: JSON.stringify(content),
        answer_key: data.answerKey ? JSON.stringify(data.answerKey) : null
      }

      console.log('Creating document:', doc)
      await onSubmit(doc)
    } catch (err) {
      console.error('Generation error:', err)
      let message = 'Unknown error occurred'
      if (err instanceof Error) {
        message = err.message
      } else if (typeof err === 'string') {
        message = err
      }
      setErrors({ general: message })
    } finally { 
      setIsGenerating(false) 
    }
  }


  /** Render Form */
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="space-y-2 animate-fade-in-up-1">
        <h1 className="text-3xl font-bold text-slate-900">Create New Material</h1>
        <p className="text-slate-600">Generate standards-aligned worksheets, quizzes, and lesson plans</p>
      </div>


      {/* Content Type */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 animate-fade-in-up-2">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-1">
          <FileText className="h-5 w-5 text-indigo-600" /> Content Type
        </h2>
        <p className="text-sm text-slate-600">Choose what kind of material to generate</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {contentTypes.map(type => {
            const Icon = type.icon
            return (
              <button key={type.value} type="button" onClick={() => setDocType(type.value)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${docType===type.value?'border-indigo-600 bg-indigo-50':'border-slate-200 hover:border-slate-300'}`}>
                <div className="flex items-center gap-2 mb-1"><Icon className="h-4 w-4" /> {type.label}</div>
                <div className="text-sm text-slate-600">{type.description}</div>
              </button>
            )
          })}
        </div>
      </div>


      {/* Standards & Topic */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 animate-fade-in-up-3 relative z-40">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-1">
          <GraduationCap className="h-5 w-5 text-indigo-600" /> Standards & Topic
        </h2>
        <p className="text-sm text-slate-600">Select grade level, subject, and specify your topic</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dropdown label="Grade Level" value={grade} onChange={setGrade} options={[
            {value:'K',label:'Kindergarten'},{value:'1',label:'1st Grade'},{value:'2',label:'2nd Grade'},
            {value:'3',label:'3rd Grade'},{value:'4',label:'4th Grade'},{value:'5',label:'5th Grade'},
            {value:'6',label:'6th Grade'},{value:'7',label:'7th Grade'},{value:'8',label:'8th Grade'},
            {value:'High School',label:'High School'}
          ]} placeholder="Select grade level"/>
          <Dropdown label="Subject" value={subject} onChange={setSubject} options={[
            {value:'Math',label:'Math'},{value:'ELA',label:'English Language Arts'},
            {value:'Science',label:'Science'},{value:'Social Studies',label:'Social Studies'}
          ]} placeholder="Select subject"/>
        </div>


        {grade==='High School' && <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">Course</label>
          <div className="flex gap-2">
            <input type="text" readOnly value={course} placeholder="Select a high school course (optional)"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"/>
            <button type="button" onClick={()=>setShowCourseModal(true)}
              className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 font-medium text-sm">Select</button>
          </div>
        </div>}


        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">Topic <span className="text-red-500">*</span></label>
          <textarea value={topic} onChange={(e)=>setTopic(e.target.value)} 
            placeholder="e.g., Adding fractions with unlike denominators, or Character analysis in fiction..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          <p className="text-xs text-slate-500">Be specific about what you want students to practice</p>
        </div>
      </div>


      {/* Standards Selector */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 animate-fade-in-up-4 relative z-30">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Standards</h3>
            <p className="text-xs text-slate-600 mt-1">Optional — choose relevant standards</p>
          </div>
          <button type="button" onClick={()=>setShowStandardsModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm">Browse Standards</button>
        </div>
        {standardsSelected.length===0 ? <div className="text-sm text-slate-500 py-2">No standards selected</div> :
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-700">{standardsSelected.length} standards selected:</div>
            <ul className="space-y-1">
              {standardsSelected.map(s => (
                <li key={s.id} className="text-sm text-slate-700 flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-600"/> {s.name || s.content.slice(0,80)}
                </li>
              ))}
            </ul>
          </div>
        }
      </div>


      {/* Advanced Options */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 animate-fade-in-up-5 relative z-20">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-1">
          <Zap className="h-5 w-5 text-indigo-600"/> Advanced Options
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Number of Questions: <span className="text-indigo-600 font-semibold">{questionCount}</span></label>
            <input type="range" min="3" max="20" value={questionCount} onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>3 questions</span>
              <span>20 questions</span>
            </div>
          </div>
        </div>
      </div>


      {/* Difficulty */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 animate-fade-in-up-6 relative z-10">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-1">
          <BarChart3 className="h-5 w-5 text-indigo-600"/> Difficulty Level
        </h2>
        <p className="text-sm text-slate-600">Customize the challenge level</p>
        <div className="space-y-2">
          {difficultyLevels.map(opt => (
            <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${level===opt.value?'border-indigo-600 bg-indigo-50':'border-slate-200 hover:border-slate-300'}`}>
              <input type="radio" name="difficulty" value={opt.value} checked={level===opt.value} onChange={()=>setLevel(opt.value)} className="mt-1"/>
              <div>
                <div className="font-medium text-slate-900">{opt.label}</div>
                <div className="text-xs text-slate-600">{opt.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>


      {/* Error Message */}
      {errors.general && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{errors.general}</div>}


      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 animate-fade-in-up-7">
        <Button type="submit" disabled={isLoading || isGenerating} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
          {isGenerating || isLoading ? <><Loader2 className="h-4 w-4 animate-spin"/> Generating...</> : <><Zap className="h-4 w-4"/> Generate & Create</>}
        </Button>
      </div>


      {/* Modals */}
      <Modal open={showStandardsModal} onClose={()=>setShowStandardsModal(false)} title={`Standards — ${grade}`}>
        <div className="space-y-3">
          <input value={standardsSearch} onChange={(e)=>setStandardsSearch(e.target.value)}
            placeholder="Search standards" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          {loadingStandards && <div className="text-center py-4 text-slate-600">Loading standards...</div>}
          <div className="space-y-2">
            {standardsList.filter(s => !standardsSearch || s.content.toLowerCase().includes(standardsSearch.toLowerCase()) || (s.name||'').toLowerCase().includes(standardsSearch.toLowerCase()))
            .map(s => {
              const selected = standardsSelected.find(ss => ss.id===s.id)
              return (
                <div key={s.id} className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selected?'border-indigo-600 bg-indigo-50':'border-slate-200 hover:border-slate-300'}`} onClick={()=>toggleStandard(s)}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">{s.name || s.content.slice(0,60)}</div>
                      <div className="text-xs text-slate-600 mt-1">{s.content.slice(0,140)}</div>
                    </div>
                    <div className="text-lg">{selected?<Check className="h-5 w-5 text-indigo-600"/>:<Plus className="h-5 w-5 text-slate-400"/>}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Modal>


      <Modal open={showCourseModal} onClose={()=>setShowCourseModal(false)} title="Select High School Course">
        <div className="grid grid-cols-1 gap-2">
          {highSchoolCourses.map(c => (
            <button key={c} type="button" onClick={()=>{setCourse(c); setShowCourseModal(false)}} className="text-left px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50">{c}</button>
          ))}
        </div>
      </Modal>
    </form>
  )
}