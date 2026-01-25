import '../global.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setSession(data.session)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // ✅ Correct way to unsubscribe
    return () => subscription?.unsubscribe?.()
  }, [])

  // Pages that require authentication and should use Layout
  const authenticatedPages = ['/', '/create', '/materials', '/profile', '/generate-document', '/materials/[id]']
  const shouldUseLayout = authenticatedPages.includes(router.pathname)


  return <Component {...pageProps} session={session} loading={loading} />
}

export default MyApp