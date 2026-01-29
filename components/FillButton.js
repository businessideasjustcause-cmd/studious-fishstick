import { ArrowRight } from 'lucide-react'

export default function FillButton({ text, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="group relative px-12 py-5 bg-transparent border-2 border-slate-900 text-slate-900 rounded-full font-black text-sm uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 hover:text-white"
    >
      {/* The Liquid Fill Layer */}
      <div className="absolute inset-0 translate-y-[101%] bg-slate-900 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
      
      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-3">
        {text}
        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
      </span>
    </button>
  )
}
