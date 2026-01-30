import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button'
import Dropdown from './Dropdown'
import { supabase } from '../lib/supabase'
import { 
  FileText, HelpCircle, BookOpen, CheckSquare, GraduationCap, 
  BarChart3, X, Check, Plus, Zap, Loader2, ChevronDown, ChevronUp,
  Settings, ListChecks, Circle, Square, Type, MessageSquare, Edit3
} from 'lucide-react'


/** Modal Component */
function Modal({ open, onClose, title, children }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!open || !mounted) return null


  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="fixed inset-0 bg-black/40 animate-[fadeIn_0.2s_ease-out]" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 z-[10000] animate-[slideUp_0.3s_ease-out]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
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
  { value: 'under', label: 'Below Grade Level', description: 'Scaffolded for struggling learners', color: 'emerald' },
  { value: 'on', label: 'On Grade Level', description: 'Meets standard expectations', color: 'blue' },
  { value: 'above', label: 'Above Grade Level', description: 'Extended challenge', color: 'purple' }
]

const questionTypes = [
  { value: 'multiple-choice', label: 'Multiple Choice', description: '4 answer options, one correct', icon: ListChecks },
  { value: 'true-false', label: 'True/False', description: 'Binary choice questions', icon: Circle },
  { value: 'fill-blank', label: 'Fill in the Blank', description: 'Complete the sentence', icon: Type },
  { value: 'short-answer', label: 'Short Answer', description: '1-2 sentence responses', icon: MessageSquare },
  { value: 'matching', label: 'Matching', description: 'Pair items from two columns', icon: Square },
  { value: 'open-ended', label: 'Open-Ended', description: 'Extended written response', icon: Edit3 }
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
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState(['open-ended'])

  const [errors, setErrors] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)

  const [showStandardsModal, setShowStandardsModal] = useState(false)
  const [standardsList, setStandardsList] = useState([])
  const [standardsSearch, setStandardsSearch] = useState('')
  const [loadingStandards, setLoadingStandards] = useState(false)

  const [showCourseModal, setShowCourseModal] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const highSchoolCourses = ['Math 1', 'Math 2', 'Algebra I', 'Geometry', 'Algebra II', 'Precalculus']


  /** Fetch Standards from Supabase */
  useEffect(() => { if (showStandardsModal) fetchStandards() }, [showStandardsModal, grade, subject, course])
  async function fetchStandards() {
    try {
      setLoadingStandards(true)
      let builder = supabase.from('standards').select('id,name,content,grade,subject')
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

  function toggleQuestionType(type) {
    setSelectedQuestionTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }


  function validateForGenerate() {
    const newErrors = {}
    if (!subject) newErrors.subject = 'Subject required'
    if (!grade) newErrors.grade = 'Grade required'
    if (!topic || !topic.trim()) newErrors.topic = 'Topic required'
    if (selectedQuestionTypes.length === 0) newErrors.questionTypes = 'Select at least one question type'
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
        course, level, questionCount,
        questionTypes: selectedQuestionTypes
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
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="space-y-3 animate-fade-in-up-1">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Create New Material
        </h1>
        <p className="text-lg text-slate-600">Generate standards-aligned educational content with AI</p>
      </div>


      {/* Content Type */}
      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up-2">
        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2 mb-3">
          <FileText className="h-6 w-6 text-indigo-600" /> Content Type
        </h2>
        <p className="text-sm text-slate-600 mb-4">Choose what kind of material to generate</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {contentTypes.map(type => {
            const Icon = type.icon
            return (
              <button key={type.value} type="button" onClick={() => setDocType(type.value)}
                className={`group text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  docType===type.value
                    ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-md scale-[1.02]'
                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${docType===type.value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'} transition-colors`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-slate-900">{type.label}</span>
                </div>
                <div className="text-sm text-slate-600">{type.description}</div>
              </button>
            )
          })}
        </div>
      </div>


      {/* Standards & Topic */}
      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up-3 relative z-40">
        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2 mb-3">
          <GraduationCap className="h-6 w-6 text-indigo-600" /> Standards & Topic
        </h2>
        <p className="text-sm text-slate-600 mb-4">Select grade level, subject, and specify your topic</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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


        {grade==='High School' && <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-slate-900">Course</label>
          <div className="flex gap-2">
            <input type="text" readOnly value={course} placeholder="Select a high school course (optional)"
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"/>
            <button type="button" onClick={()=>setShowCourseModal(true)}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm shadow-sm transition-colors">
              Select Course
            </button>
          </div>
        </div>}


        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">
            Topic <span className="text-red-500">*</span>
          </label>
          <textarea value={topic} onChange={(e)=>setTopic(e.target.value)} 
            placeholder="e.g., Adding fractions with unlike denominators, Character analysis in fiction, Photosynthesis process..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"/>
          <p className="text-xs text-slate-500">Be specific about what you want students to practice or learn</p>
          {errors.topic && <p className="text-sm text-red-600">{errors.topic}</p>}
        </div>
      </div>


      {/* Standards Selector */}
      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up-4 relative z-30">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Standards Alignment</h3>
            <p className="text-sm text-slate-600 mt-1">Optional — choose relevant educational standards</p>
          </div>
          <button type="button" onClick={()=>setShowStandardsModal(true)}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm shadow-sm transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" /> Browse Standards
          </button>
        </div>
        {standardsSelected.length===0 ? (
          <div className="text-sm text-slate-500 py-3 px-4 bg-slate-50 rounded-lg border border-slate-200">
            No standards selected yet
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Check className="h-4 w-4 text-indigo-600"/> 
              {standardsSelected.length} standard{standardsSelected.length !== 1 ? 's' : ''} selected
            </div>
            <ul className="space-y-2">
              {standardsSelected.map(s => (
                <li key={s.id} className="text-sm text-slate-700 flex items-start gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <Check className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0"/> 
                  <span className="flex-1">{s.name || s.content.slice(0,100)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>


      {/* Question Count */}
      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up-5 relative z-20">
        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2 mb-3">
          <Zap className="h-6 w-6 text-indigo-600"/> Number of Questions
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Question Count</label>
            <span className="text-2xl font-bold text-indigo-600">{questionCount}</span>
          </div>
          <input type="range" min="3" max="20" value={questionCount} onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            style={{
              background: `linear-gradient(to right, rgb(79 70 229) 0%, rgb(79 70 229) ${((questionCount - 3) / 17) * 100}%, rgb(226 232 240) ${((questionCount - 3) / 17) * 100}%, rgb(226 232 240) 100%)`
            }}/>
          <div className="flex justify-between text-xs text-slate-500">
            <span>3 questions</span>
            <span>20 questions</span>
          </div>
        </div>
      </div>


      {/* Advanced Options Dropdown */}
      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-fade-in-up-6 relative z-10">
        <button 
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-slate-900">Advanced Options</h2>
          </div>
          {showAdvanced ? (
            <ChevronUp className="h-5 w-5 text-slate-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-600" />
          )}
        </button>

        {showAdvanced && (
          <div className="px-6 pb-6 space-y-6 animate-[slideDown_0.3s_ease-out]">
            {/* Difficulty Level */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-5 w-5 text-indigo-600"/>
                <h3 className="text-lg font-semibold text-slate-900">Difficulty Level</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">Customize the challenge level for your students</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {difficultyLevels.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLevel(opt.value)}
                    className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      level===opt.value
                        ? `border-${opt.color}-600 bg-gradient-to-br from-${opt.color}-50 to-${opt.color}-100 shadow-md scale-[1.02]`
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        level===opt.value 
                          ? opt.color === 'emerald' ? 'bg-emerald-600' :
                            opt.color === 'blue' ? 'bg-blue-600' :
                            'bg-purple-600'
                          : 'bg-slate-300'
                      }`}></div>
                      <span className="font-semibold text-slate-900">{opt.label}</span>
                    </div>
                    <div className="text-sm text-slate-600">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Types */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="h-5 w-5 text-indigo-600"/>
                <h3 className="text-lg font-semibold text-slate-900">Question Types</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Select one or more question formats to include
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {questionTypes.map(type => {
                  const Icon = type.icon
                  const isSelected = selectedQuestionTypes.includes(type.value)
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => toggleQuestionType(type.value)}
                      className={`group text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-md'
                          : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-lg ${
                          isSelected 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                        } transition-colors`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-slate-900 flex-1">{type.label}</span>
                        {isSelected && <Check className="h-5 w-5 text-indigo-600" />}
                      </div>
                      <div className="text-sm text-slate-600">{type.description}</div>
                    </button>
                  )
                })}
              </div>
              {errors.questionTypes && (
                <p className="text-sm text-red-600 mt-2">{errors.questionTypes}</p>
              )}
            </div>
          </div>
        )}
      </div>


      {/* Error Message */}
      {errors.general && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium shadow-sm animate-shake">
          {errors.general}
        </div>
      )}


      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-6 animate-fade-in-up-7">
        <Button 
          type="submit" 
          disabled={isLoading || isGenerating} 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center gap-2 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isGenerating || isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin"/> 
              Generating...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5"/> 
              Generate Material
            </>
          )}
        </Button>
      </div>


      {/* Modals */}
      <Modal open={showStandardsModal} onClose={()=>setShowStandardsModal(false)} title={`Browse Standards — ${grade} ${subject}`}>
        <div className="space-y-4">
          <input value={standardsSearch} onChange={(e)=>setStandardsSearch(e.target.value)}
            placeholder="Search by keyword or standard code..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"/>
          {loadingStandards && (
            <div className="text-center py-8 text-slate-600 flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading standards...
            </div>
          )}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {standardsList
              .filter(s => !standardsSearch || 
                s.content.toLowerCase().includes(standardsSearch.toLowerCase()) || 
                (s.name||'').toLowerCase().includes(standardsSearch.toLowerCase())
              )
              .map(s => {
                const selected = standardsSelected.find(ss => ss.id===s.id)
                return (
                  <div 
                    key={s.id} 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selected
                        ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-sm'
                        : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                    }`} 
                    onClick={()=>toggleStandard(s)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-900 mb-1">
                          {s.name || s.content.slice(0,80)}
                        </div>
                        <div className="text-xs text-slate-600 line-clamp-2">
                          {s.content}
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg ${selected ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                        {selected ? (
                          <Check className="h-5 w-5 text-white"/>
                        ) : (
                          <Plus className="h-5 w-5 text-slate-400"/>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </Modal>


      <Modal open={showCourseModal} onClose={()=>setShowCourseModal(false)} title="Select High School Course">
        <div className="grid grid-cols-1 gap-3">
          {highSchoolCourses.map(c => (
            <button 
              key={c} 
              type="button" 
              onClick={()=>{setCourse(c); setShowCourseModal(false)}} 
              className="text-left px-5 py-4 border-2 border-slate-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 font-medium transition-all duration-200"
            >
              {c}
            </button>
          ))}
        </div>
      </Modal>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 1000px;
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </form>
  )
}