import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Mail, Lock, Sparkles, AlertCircle, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react'
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FDFDFD]">
      {/* Subtle Background Elements (Soft Indigo Glows) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className={`relative w-full max-w-[440px] transition-all duration-700 ease-out 
        ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-100 mb-6">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">DraftStudio</h1>
          <p className="text-slate-500 mt-2 font-medium">The intelligent workspace for educators.</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          {message && (
            <div className="mb-6 flex items-center p-4 text-sm text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="font-semibold">{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center p-4 text-sm text-rose-700 bg-rose-50 rounded-2xl border border-rose-100 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input
                  type="email"
                  required
                  placeholder="name@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center py-4 px-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {submitting ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    {isSignUp ? 'Get Started' : 'Continue'} 
                    <ArrowRight size={20} strokeWidth={3} />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Footer info */}
        <p className="mt-10 text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Draft Studio &bull; 2026
        </p>
      </div>
    </div>
  )
}
