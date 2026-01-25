import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Button from './Button'
import { LayoutDashboard, PlusCircle, History, ChevronLeft, Menu, LogOut, Lock } from 'lucide-react'

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
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef(null)

  useEffect(() => setMounted(true), [])

  // Close menu when clicking outside
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
      supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => data && setProfile(data))
        .catch(() => {})
    }
  }, [session?.user?.id])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // Clear all localStorage/sessionStorage for extra safety
    try {
      localStorage.clear()
      sessionStorage.clear()
    } catch (e) {}
    router.replace('/landing')
  }

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    return session?.user?.email?.[0]?.toUpperCase() || 'U'
  }


  useEffect(() => {
    if (mounted && !session) {
      router.replace('/landing')
    }
  }, [mounted, session, router])

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading…</div>
  if (!mounted || !session) return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* DESKTOP SIDEBAR */}
      <aside 
        className={`hidden md:flex fixed left-0 top-0 h-screen bg-white border-r flex-col z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b overflow-hidden">
          <img src="/Tutor.svg" alt="Tutor" className="w-7 h-7" />
          <span className={`ml-3 text-lg font-semibold whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            Draft
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map(item => (
            <button 
              key={item.path} 
              onClick={() => router.push(item.path)} 
              className={`w-full flex items-center h-12 rounded-lg text-sm font-medium group relative transition-colors ${
                router.pathname === item.path ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="w-12 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-5 w-5" />
              </div>
              <span className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {item.label}
              </span>

              {isCollapsed && (
                <div className="absolute left-16 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs p-2 rounded ml-2 pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer / Profile */}
        <div className="border-t p-3 space-y-2">
          <div ref={profileMenuRef} className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)} 
              className="flex items-center w-full hover:bg-gray-50 p-1 rounded-lg transition-colors"
            >
              <div className="w-12 flex-shrink-0 flex justify-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">
                  {getInitials()}
                </div>
              </div>
              <div className={`ml-1 text-left transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none w-0' : 'opacity-100 w-auto'}`}>
                <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
              </div>
            </button>

            {/* Profile Popup Menu - Now uses fixed positioning */}
            {showProfileMenu && (
              <div className="fixed bottom-20 bg-white rounded-lg shadow-lg border border-gray-200 w-48 z-[100]"
                   style={{ 
                     left: isCollapsed ? '1.5rem' : '1rem',
                   }}>
                <button 
                  onClick={() => {
                    router.push('/billing')
                    setShowProfileMenu(false)
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-indigo-700 hover:bg-indigo-50 border-b border-gray-100 rounded-t-lg font-semibold"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/></svg>
                  Billing
                </button>
                <button 
                  onClick={() => {
                    router.push('/profile')
                    setShowProfileMenu(false)
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Collapse/Expand Button */}
      <div className={`hidden md:flex fixed top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'left-20' : 'left-64'
      }`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-1 rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-100 text-gray-500 transform -translate-x-1/2"
        >
          {isCollapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}