import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white/50 backdrop-blur-sm py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Branding */}
        <div className="group cursor-default">
          <span className="font-black text-2xl tracking-tighter text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
            DraftStudio<span className="text-indigo-600">.</span>
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-indigo-600 transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-indigo-600 transition-colors">
            Contact Support
          </Link>
          <Link href="/pricing" className="hover:text-indigo-600 transition-colors">
            Pricing
          </Link>
        </div>

        {/* Legal & Version */}
        <div className="flex flex-col items-center md:items-end gap-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            © 2026 Draft Labs LLC
          </span>
          <span className="text-[9px] font-black text-indigo-600/40 uppercase tracking-[0.3em]">
            v2.4.0-Stable
          </span>
        </div>
      </div>
    </footer>
  )
}
