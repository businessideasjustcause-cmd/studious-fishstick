import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, Shield, Scale } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Login({ session, loading }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (!loading && session) router.push('/')
  }, [session, loading, router])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/` },
      })
      if (error) setError(error.message)
      else {
        setMessage('Check your inbox to verify your account.')
        setEmail(''); setPassword('')
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) setError(signInError.message)
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAFA] selection:bg-indigo-100 selection:text-indigo-900">
      {/* 2026 Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/20 blur-[120px] rounded-full" />
      </div>

      <div className={`relative w-full max-w-[460px] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] 
        ${isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
        
        {/* Logo & Header */}
        <div className="text-center mb-12">
          {/* Logo updated to use tutor.svg */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2.2rem] bg-white shadow-2xl shadow-indigo-100/50 mb-6 group transition-all hover:scale-105">
            <img 
              src="/Tutor.svg" 
              alt="DraftStudio Logo" 
              className="w-12 h-12 object-contain group-hover:rotate-3 transition-transform duration-500" 
            />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">DraftStudio</h1>
          <p className="text-slate-500 mt-3 font-medium text-lg italic">"Every great lesson begins with a focused draft."</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
          
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isSignUp ? 'Join Studio' : 'Sign In'}
            </h2>
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="px-4 py-1.5 rounded-full bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            >
              {isSignUp ? 'Have Account?' : 'New Here?'}
            </button>
          </div>

          {message && (
            <div className="mb-8 flex items-center p-5 text-sm text-emerald-700 bg-emerald-50/50 rounded-[1.5rem] border border-emerald-100/50 animate-in zoom-in-95 duration-300">
              <CheckCircle2 className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="font-bold">{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-8 flex items-center p-5 text-sm text-rose-700 bg-rose-50/50 rounded-[1.5rem] border border-rose-100/50 animate-in shake-in">
              <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Institutional Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  required
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none font-bold"
                />
              </div>
            </div>

            <div className="pt-4">
              {/* Restored Indigo-600 Blue Buttons */}
              <button
                type="submit"
                disabled={submitting}
                className="group w-full flex items-center justify-center py-5 px-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {submitting ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center gap-3 tracking-tight">
                    {isSignUp ? 'Create Workspace' : 'Enter Studio'} 
                    <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Integrated Terms & Privacy Policy */}
          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
            <Link href="/terms" className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 hover:text-indigo-500 transition-colors uppercase tracking-widest">
              <Scale size={12} /> Terms
            </Link>
            <div className="w-1 h-1 bg-slate-200 rounded-full" />
            <Link href="/privacy" className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 hover:text-indigo-500 transition-colors uppercase tracking-widest">
              <Shield size={12} /> Privacy
            </Link>
          </div>
        </div>
        
        <p className="mt-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
          Powered by Draft Labs &bull; 2026
        </p>
      </div>
    </div>
  )
}
