import { useState } from 'react'
import Layout from '@/components/Layout'
import { ArrowRight, Check, Sparkles, Zap, Building2, Rocket, Settings, X, CreditCard, Receipt, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function Billing({ session, loading: appLoading }) {
  const [billingCycle, setBillingCycle] = useState('yearly')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [testerCode, setTesterCode] = useState('')

  if (appLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  )

  if (!session) return null

  const handleManageBilling = () => alert('Redirecting to Stripe Secure Portal...')
  
  const handleTesterSubmit = (e) => {
    e.preventDefault()
    alert(`Processing code: ${testerCode}`)
    setIsModalOpen(false)
    setTesterCode('')
  }

  return (
    <Layout session={session} loading={appLoading}>
      <main className="pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/30 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
              Invest in your <span className="text-indigo-600 italic">impact.</span>
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="w-14 h-8 bg-slate-200 rounded-full p-1 relative transition-colors duration-300 focus:outline-none"
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>Yearly</span>
                <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Save 20%</span>
              </div>
            </div>
          </div>

          {/* MAIN 3-COLUMN PRICING GRID */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16 items-stretch">
            {/* FREE PLAN */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 flex flex-col transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] relative">
               <div className="absolute top-4 right-4 px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full">Active</div>
              <div className="mb-8 p-3 bg-slate-50 w-fit rounded-2xl text-slate-400">
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Free</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900">$0</span>
              </div>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">Perfect for exploring AI-assisted drafting.</p>
              <ul className="space-y-4 mb-10 flex-grow">
                {['10 AI generations / mo', 'Basic Lesson Templates', 'Save 10 documents'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <Check size={14} className="mt-1 text-slate-400" /> {f}
                  </li>
                ))}
              </ul>
              <button disabled className="w-full py-4 rounded-2xl bg-slate-100 text-slate-400 font-bold cursor-not-allowed">
                Current Plan
              </button>
            </div>

            {/* PRO PLAN */}
            <div className="relative bg-white rounded-[2.5rem] p-10 border-indigo-600 border-2 ring-8 ring-indigo-50 flex flex-col transition-all duration-500 shadow-xl scale-105 z-20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg">
                Most Popular
              </div>
              <div className="mb-8 p-3 bg-indigo-50 rounded-2xl text-indigo-600 w-fit">
                <Zap size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Pro</h2>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  {billingCycle === 'monthly' ? '$19' : '$15'}
                </span>
                <span className="text-slate-400 font-bold text-sm">/ month</span>
              </div>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">Everything you need to master your prep.</p>
              <ul className="space-y-4 mb-10 flex-grow">
                {['Unlimited AI generations', 'State Standards Alignment', 'Advanced Export'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <Check size={14} className="mt-1 text-indigo-600" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => alert('Upgrading to Pro...')} className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]">
                Go Pro
              </button>
            </div>

            {/* ADVANCED PLAN */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 flex flex-col transition-all duration-500 hover:shadow-[0_30_60px_rgba(0,0,0,0.04)]">
              <div className="mb-8 p-3 bg-indigo-900 w-fit rounded-2xl text-white">
                <Rocket size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Advanced</h2>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  {billingCycle === 'monthly' ? '$29' : '$25'}
                </span>
                <span className="text-slate-400 font-bold text-sm">/ month</span>
              </div>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">For educators who need ultimate power.</p>
              <ul className="space-y-4 mb-10 flex-grow">
                {['Everything in Pro', 'Custom AI Training', 'Plagiarism Detection', 'Bulk Imports'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <Check size={14} className="mt-1 text-indigo-900" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => alert('Upgrading to Advanced...')} className="w-full py-4 rounded-2xl border-2 border-indigo-900 text-indigo-900 font-bold hover:bg-slate-50 transition-all">
                Get Advanced
              </button>
            </div>
          </div>

          {/* BILLING HISTORY & PORTAL SECTION (Moved to bottom) */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Payment Method</p>
                  <p className="text-lg font-bold text-slate-900 italic">No card on file</p>
                </div>
              </div>
              <button className="text-indigo-600 font-black text-sm uppercase hover:underline">Add Card</button>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
               <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-white/10 rounded-2xl text-indigo-400">
                  <Receipt size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Invoices & Portal</p>
                  <p className="text-lg font-bold">Secure Billing Access</p>
                </div>
              </div>
              <button onClick={handleManageBilling} className="relative z-10 flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-bold transition-all text-sm">
                Customer Portal <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          {/* SCHOOL PLAN */}
          <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 mb-24 flex flex-col md:flex-row items-center justify-between gap-8 text-slate-900 relative border border-slate-200">
             <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-600 rounded-lg"><Building2 size={24} className="text-white" /></div>
                  <span className="text-indigo-600 font-black text-xs uppercase tracking-widest">Enterprise Solution</span>
                </div>
                <h2 className="text-3xl font-black mb-2">DraftStudio for Schools</h2>
                <p className="text-slate-500 font-medium max-w-xl">Unified workspace for departments and districts. Contact us for bulk licensing.</p>
             </div>
               <Link href="/contact" className="relative z-10 flex items-center gap-3 px-8 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:scale-105 transition-all whitespace-nowrap">
                Contact Sales <ArrowRight size={20} />
             </Link>
          </div>
        </div>

        {/* Floating Settings Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 p-4 bg-white border border-slate-200 rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all text-slate-600 z-40"
        >
          <Settings size={24} />
        </button>

        {/* Tester Code Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Tester Codes</h3>
              <p className="text-slate-500 text-sm mb-6">Enter a valid developer or beta access code below.</p>
              <form onSubmit={handleTesterSubmit} className="space-y-4">
                <input 
                  type="text" 
                  value={testerCode}
                  onChange={(e) => setTesterCode(e.target.value)}
                  placeholder="Ex: BETA-2026"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  autoFocus
                />
                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">
                  Submit Code
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </Layout>
  )
}
