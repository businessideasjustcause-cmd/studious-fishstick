import { useState, useRef, useEffect } from 'react'
import { ArrowUp, Zap } from 'lucide-react'

export default function SmartForm({ onSubmit, isLoading }) {
  const [prompt, setPrompt] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [prompt])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return
    // This calls the handleSmartGenerate function in the parent
    onSubmit({ prompt: prompt.trim() })
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`group relative bg-white rounded-[3rem] border-2 transition-all duration-700 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.06)] p-2 ${
          prompt.trim() ? 'border-orange-500 shadow-orange-100/50 scale-[1.01]' : 'border-slate-100'
        }`}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder="E.g., Create a 5th grade lesson on Roman History with a follow-up quiz..."
            className="w-full bg-transparent px-8 pt-10 pb-20 text-2xl font-medium text-slate-900 placeholder:text-slate-300 outline-none resize-none min-h-[240px] leading-snug disabled:opacity-50"
          />

          <div className="absolute bottom-6 right-6">
            <button 
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className={`p-5 rounded-[1.8rem] transition-all transform shadow-2xl ${
                prompt.trim() && !isLoading
                ? 'bg-orange-500 text-white shadow-orange-200 scale-100 active:scale-95 hover:bg-orange-600' 
                : 'bg-slate-50 text-slate-200 scale-95 pointer-events-none'
              }`}
            >
              <ArrowUp size={32} strokeWidth={3} />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
