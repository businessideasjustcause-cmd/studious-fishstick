import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Mail, Lock, Sparkles, AlertCircle } from 'lucide-react'
// Removed Framer Motion import
import { supabase } from '../lib/supabase'
// Import your CSS module
// import styles from '../styles/Login.module.css'; 

// NOTE: You need a CSS file for this to work. 
// For demonstration, the required CSS is included below the code block.

export default function Login({ session, loading }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [isMounted, setIsMounted] = useState(false) // State to trigger animation

  useEffect(() => {
    if (!loading && session) {
      router.push('/')
    }
  }, [session, loading, router])

  // Trigger the entrance animation after component mounts
  useEffect(() => {
    // A slight delay can make the effect more reliable after initial render
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50); 

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)

    if (!email || !password) {
      setError('Email and password are required')
      setSubmitting(false)
      return
    }

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/`, },
      })
      if (error) { setError(error.message) }
      else {
        setMessage('Account created. Check your email to verify.')
        setEmail(''); setPassword('')
      }
      setSubmitting(false)
      return
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setSubmitting(false)
      return
    }

    if (!data.user.email_confirmed_at) {
      // You'll need to complete the rest of your handleSubmit logic here
      // await supabase.auth.resendVerification... 
    }
  }
  
  // Define base classes and animation class
  const formClasses = `bg-white p-8 rounded-xl shadow-lg w-full max-w-md transition-opacity transition-transform duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
  const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  const buttonClasses = "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
      {/* Apply formClasses with conditional animation styles */}
      <div className={formClasses}> 
        <div className="text-center">
          <Sparkles className="mx-auto h-12 w-auto text-indigo-600" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create an account' : 'Sign in to your account'}
          </h2>
        </div>

        {message && (
          <div className="mt-4 flex items-center p-3 text-sm text-green-700 bg-green-100 rounded-lg">
            <AlertCircle className="mr-3 h-5 w-5" />
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            <AlertCircle className="mr-3 h-5 w-5" />
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`pl-10 ${inputClasses}`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative mt-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`pl-10 ${inputClasses}`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className={buttonClasses}
            >
              {submitting ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}