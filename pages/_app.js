// /pages/_app.js
import '../global.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { Loader2 } from 'lucide-react'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // 1. Strict definition of what is a "Dashboard" page
  const protectedPages = ['/','/select', '/create/smart','/create/guided', '/materials', '/profile', '/billing', '/generate-document']
  const isProtected = protectedPages.includes(router.pathname) || router.pathname.startsWith('/materials/')
  
  // 2. Auth pages (login/signup)
  const isAuthPage = ['/login', '/signup'].includes(router.pathname)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession()
      setSession(initialSession)
      setLoading(false)

      if (!initialSession && isProtected) {
        router.push('/login')
      }
      if (initialSession && isAuthPage) {
        router.push('/')
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      if (!currentSession && isProtected) {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [isProtected, isAuthPage])

  // 3. ONLY show full-screen loader for PROTECTED pages
  // Public pages (Privacy/Terms) will skip this and render immediately
  if (loading && isProtected) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Authenticating...</p>
      </div>
    )
  }

  return <Component {...pageProps} session={session} loading={loading} />
}

export default MyApp
