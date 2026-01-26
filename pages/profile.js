import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Loginfooter from '../components/Loginfooter'
import { getUserProfile, fetchUserDocuments } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { 
  User, Mail, Shield, Key, Calendar, Loader2, 
  CheckCircle2, AlertCircle, BookOpen, GraduationCap, 
  Settings2, Trash2, Zap, LayoutDashboard 
} from 'lucide-react'

export default function Profile({ session, loading: appLoading }) {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ count: 0, hours: 0 })
  
  const [newPassword, setNewPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [status, setStatus] = useState({ type: null, message: '' })

  useEffect(() => {
    if (!appLoading && !session) router.push('/landing')
  }, [session, appLoading, router])

  useEffect(() => {
    if (session?.user?.id) {
      loadProfile()
      loadStats()
    }
  }, [session?.user?.id])

  const loadProfile = async () => {
    setLoading(true)
    const { data } = await getUserProfile(session.user.id)
    if (data) setProfile(data)
    setLoading(false)
  }

  const loadStats = async () => {
    const { data } = await fetchUserDocuments(session.user.id)
    if (data) {
      setStats({ count: data.length, hours: (data.length * 1.5).toFixed(1) })
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setChangingPassword(true)
    setStatus({ type: null, message: '' })
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setStatus({ type: 'error', message: error.message })
    else {
      setStatus({ type: 'success', message: 'Password updated successfully!' })
      setNewPassword('')
    }
    setChangingPassword(false)
  }

  return (
    <Layout session={session} loading={appLoading}>
      <div className="max-w-6xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Profile</h1>
            <p className="text-slate-500 font-medium mt-2">Manage your workspace identity and preferences.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push('/')} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-600">
               <LayoutDashboard size={20} />
            </button>
            <div className="px-5 py-2 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 flex items-center gap-2">
              <Shield size={16} />
              {profile?.role?.toUpperCase() || 'EDUCATOR'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Identity & Stats */}
          <div className="lg:col-span-4 space-y-6">
            {/* Identity Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                <User size={120} />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-6">
                  <User size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1 truncate">{session?.user?.email?.split('@')[0]}</h3>
                <p className="text-sm font-bold text-slate-400 mb-6">{session?.user?.email}</p>
                
                <div className="space-y-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                    <Calendar size={16} className="text-indigo-500" />
                    Joined {new Date(session?.user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                    <Mail size={16} className="text-indigo-500" />
                    Email Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Card */}
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
               <Zap size={80} className="absolute -bottom-4 -right-4 opacity-20" />
               <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-4">Productivity Stats</h4>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-3xl font-black">{stats.count}</p>
                    <p className="text-[10px] font-bold text-indigo-100 uppercase">Materials Created</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black">{stats.hours}h</p>
                    <p className="text-[10px] font-bold text-indigo-100 uppercase">Time Saved</p>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Settings & Security */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Preferences Section */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Settings2 size={20}/></div>
                <h2 className="text-2xl font-black text-slate-900">Work Preferences</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Grade</label>
                  <div className="w-full px-5 py-4 bg-slate-50 rounded-2xl flex items-center gap-3 text-slate-600 font-bold">
                    <GraduationCap size={18} className="text-slate-400" /> Grade {profile?.default_grade || 'Not set'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Subject</label>
                  <div className="w-full px-5 py-4 bg-slate-50 rounded-2xl flex items-center gap-3 text-slate-600 font-bold">
                    <BookOpen size={18} className="text-slate-400" /> {profile?.subject || 'Not set'}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Key size={20}/></div>
                <h2 className="text-2xl font-black text-slate-900">Security</h2>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Update Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter 6+ characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl text-slate-900 transition-all outline-none font-semibold"
                  />
                </div>

                {status.message && (
                  <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in zoom-in-95 ${
                    status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={changingPassword || newPassword.length < 6}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all active:scale-[0.98] disabled:opacity-30 flex items-center justify-center"
                >
                  {changingPassword ? <Loader2 className="animate-spin" /> : 'Update Security Credentials'}
                </button>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="p-8 bg-rose-50/50 rounded-[2.5rem] border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h4 className="text-rose-900 font-black text-lg">Danger Zone</h4>
                <p className="text-rose-600 text-xs font-semibold">Deleting your account will permanently remove all {stats.count} saved materials.</p>
              </div>
              <button 
                onClick={() => confirm("Are you sure you want to delete your DraftStudio account? This cannot be undone.")}
                className="px-6 py-3 border-2 border-rose-200 text-rose-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      <Loginfooter />
    </Layout>
  )
}
