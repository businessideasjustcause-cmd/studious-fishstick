import Link from 'next/link'
import { LifeBuoy, ShieldCheck, Scale } from 'lucide-react' // Added Scale icon

export default function LoginFooter() {
  return (
    <footer className="w-full py-6 mt-12 border-t border-slate-50 bg-[#FDFDFD]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Brand & Version */}
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">
            DraftStudio
          </span>
          <div className="h-4 w-[1px] bg-slate-200" />
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            v2.4.0
          </span>
        </div>

        {/* Center: Essential Actions */}
        <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <Link href="/contact" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
            <LifeBuoy size={12} className="text-slate-300" /> Help Desk
          </Link>
          
          {/* New Terms of Service Button */}
          <Link href="/terms" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
            <Scale size={12} className="text-slate-300" /> Terms
          </Link>

          <Link href="/privacy" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
            <ShieldCheck size={12} className="text-slate-300" /> Privacy
          </Link>
        </div>

        {/* Right Side: Legal Info */}
        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          © 2026 Draft Labs LLC
        </div>
      </div>
    </footer>
  )
}
