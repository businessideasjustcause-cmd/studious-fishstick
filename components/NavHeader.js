'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Menu, X } from 'lucide-react'

export default function NavHeader({ currentPage = 'home' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for the "floating dock" look
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/schools', label: 'Schools', id: 'schools' },
    { href: '/districts', label: 'Districts', id: 'districts' },
    { href: '/pricing', label: 'Pricing', id: 'pricing' },
    { href: '/resources', label: 'Resources', id: 'resources' },
  ]

  const getCta = () => {
    switch (currentPage) {
      case 'schools': return { href: '/pricing', label: 'View Pricing' }
      case 'districts': return { href: '/contact', label: 'Contact Sales' }
      default: return { href: '/login', label: 'Get Started' }
    }
  }

  const cta = getCta()

  return (
    <div className="fixed top-0 w-full z-[100] px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
      <header 
        className={`
          max-w-7xl mx-auto h-16 flex items-center justify-between px-6 rounded-full transition-all duration-500 pointer-events-auto
          ${scrolled 
            ? 'bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/40 py-2' 
            : 'bg-transparent border-transparent py-4'}
        `}
      >
         {/* Logo Section */}
        <Link href="/landing" className="flex items-center gap-2.5 group active:scale-95 transition-transform">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-600 blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-indigo-200 p-1.5 rounded-lg group-hover:-rotate-6 transition-transform duration-300">
              <Image src="/Tutor.svg" alt="DS" width={22} height={22} className="w-5.5 h-5.5" />
            </div>
          </div>
          <span className="text-xl font-black tracking-[-0.05em] text-slate-900 uppercase">
            Draft<span className="text-indigo-600 italic">Studio</span>
          </span>
        </Link>
        
        {/* Desktop Navigation: Centered Pill */}
        <nav className="hidden md:flex items-center bg-slate-100/50 p-1 rounded-full border border-slate-200/40">
          {navItems.map((item) => (
            <Link 
              key={item.id} 
              href={item.href} 
              className={`
                px-5 py-1.5 text-[13px] font-bold transition-all rounded-full
                ${currentPage === item.id 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'}
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:block text-[13px] font-bold text-slate-500 hover:text-slate-900 px-4">
            Sign In
          </Link>
          
          <Link 
            href={cta.href} 
            className="group relative inline-flex items-center justify-center px-6 py-2.5 bg-slate-900 text-white text-[13px] font-bold rounded-full overflow-hidden transition-all hover:bg-indigo-600 active:scale-95 shadow-lg shadow-slate-200"
          >
            <span className="relative z-10 flex items-center gap-1">
              {cta.label}
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown: High-end overlay */}
      {isMenuOpen && (
        <div className="absolute top-24 left-4 right-4 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-slate-100 p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-300 pointer-events-auto">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex justify-between items-center px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest ${currentPage === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}
              >
                {item.label}
                <ChevronRight size={16} />
              </Link>
            ))}
          </div>
          <div className="mt-4 p-2 bg-slate-50 rounded-[1.8rem]">
             <Link href="/login" className="block w-full py-4 text-center text-sm font-black uppercase tracking-widest text-slate-400">Sign In</Link>
             <Link href={cta.href} className="block w-full py-4 text-center text-sm font-black uppercase tracking-widest bg-slate-900 text-white rounded-[1.4rem]">Get Started</Link>
          </div>
        </div>
      )}
    </div>
  )
}
