import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { LayoutDashboard, PlusCircle, History, ChevronLeft, Menu, LogOut, Lock, X, CreditCard } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/create', label: 'Create New', icon: PlusCircle },
  { path: '/materials', label: 'My Materials', icon: History },
]

export default function Layout({ children, session, loading }) {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef(null)

  useEffect(() => setMounted(true), [])

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setShowProfileMenu(false)
  }, [router.pathname])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (session?.user?.id) {
      supabase.from('profiles').select('*').eq('id', session.user.id).single()
        .then(({ data }) => data && setProfile(data))
        .catch(() => {})
    }
  }, [session?.user?.id])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    sessionStorage.clear()
    router.replace('/landing')
  }

  const getInitials = () => {
    if (profile?.full_name) return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    return session?.user?.email?.[0]?.toUpperCase() || 'U'
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-medium text-gray-500">Loading your space...</p>
    </div>
  )
  
  if (!mounted || !session) return null

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* MOBILE TOP NAV */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <img src="/Tutor.svg" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-slate-900">Draft</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
      </header>

      {/* MOBILE OVERLAY MENU */}
      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <aside className={`absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 flex justify-end">
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map(item => (
              <button key={item.path} onClick={() => router.push(item.path)} className={`w-full flex items-center gap-4 p-4 rounded-xl font-medium transition-all ${router.pathname === item.path ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">{getInitials()}</div>
              <div>
                <p className="text-sm font-bold text-slate-900">{profile?.full_name || 'User'}</p>
                <p className="text-xs text-slate-500">{session?.user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </aside>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex-col z-30 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="h-20 flex items-center px-6 overflow-hidden">
          <img src="/Tutor.svg" alt="Tutor" className="w-8 h-8 min-w-[32px]" />
          <span className={`ml-4 text-xl font-bold text-slate-900 transition-all duration-300 ${isCollapsed ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>Draft</span>
        </div>

        <nav className="flex-1 px-3 space-y-1.5 mt-4">
          {navItems.map(item => {
            const isActive = router.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center h-12 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <div className="w-14 flex items-center justify-center flex-shrink-0">
                  <item.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                </div>
                <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
                  {item.label}
                </span>
                {isCollapsed && (
                  <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all origin-left bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-md ml-2 pointer-events-none z-50 whitespace-nowrap shadow-xl">
                    {item.label}
                  </div>
                )}
              </button>
            )
          })}
        </nav>

        {/* PROFILE SECTION */}
        <div className="p-3 mb-4">
          <div ref={profileMenuRef} className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center w-full p-2 rounded-xl transition-all duration-200 ${showProfileMenu ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0">
                {getInitials()}
              </div>
              <div className={`ml-3 text-left transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
                <p className="text-xs font-bold text-slate-900 truncate uppercase tracking-wider">{profile?.full_name || 'User'}</p>
                <p className="text-[10px] text-slate-500 truncate">{session?.user?.email}</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className={`fixed bottom-20 bg-white rounded-2xl shadow-2xl border border-slate-100 w-56 z-[100] p-1.5 transition-all animate-in fade-in slide-in-from-bottom-2`} style={{ left: isCollapsed ? '1.5rem' : '1rem' }}>
                <button onClick={() => router.push('/billing')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors">
                  <CreditCard className="h-4 w-4" /> Billing
                </button>
                <button onClick={() => router.push('/profile')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                  <Lock className="h-4 w-4" /> Security
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* DESKTOP COLLAPSE TOGGLE */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`hidden md:flex fixed top-10 z-40 transition-all duration-500 bg-white border border-slate-200 shadow-sm p-1.5 rounded-full text-slate-400 hover:text-indigo-600 hover:border-indigo-200 group ${isCollapsed ? 'left-20' : 'left-64'} -translate-x-1/2`}
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} pt-16 md:pt-0`}>
        <div className="max-w-5xl mx-auto px-6 py-8 md:py-12">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
