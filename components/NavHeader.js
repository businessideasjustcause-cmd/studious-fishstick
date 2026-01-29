'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NavHeader({ currentPage = 'home' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: '/schools', label: 'For Schools', id: 'schools' },
    { href: '/districts', label: 'For Districts', id: 'districts' },
    { href: '/pricing', label: 'Pricing', id: 'pricing' },
  ]

  const getCtaButton = () => {
    switch (currentPage) {
      case 'schools': return { href: '/pricing', label: 'View Pricing' }
      case 'districts': return { href: '/contact', label: 'Contact Sales' }
      default: return { href: '/login', label: 'Get Started' }
    }
  }

  const cta = getCtaButton()

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
                
        {/* Logo: Upgraded to font-black and tracking-tighter */}
        <Link href="/landing" className="flex items-center gap-3 group transition-all active:scale-95">
          <div className="bg-indigo-50 p-2 rounded-xl group-hover:bg-indigo-100 group-hover:rotate-6 transition-all duration-500">
            <Image src="/Tutor.svg" alt="DraftStudio" width={28} height={28} className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black tracking-[-0.06em] text-slate-900 uppercase">
            Draft<span className="text-indigo-600 italic">Studio</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.id} 
              href={item.href} 
              className={`text-sm font-medium transition-colors relative py-1 group ${currentPage === item.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform origin-left transition-transform duration-300 ${currentPage === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </Link>
          ))}
        </nav>

        {/* Action Area */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          
          {/* Blue CTA Button */}
          <Link 
            href={cta.href} 
            className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 active:scale-95"
          >
            {cta.label}
          </Link>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium ${currentPage === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-50">
            <Link href="/login" className="block px-4 py-3 text-base font-medium text-slate-600">
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
