import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles, Zap, Building2, HelpCircle, ArrowRight, Rocket } from 'lucide-react'
import NavHeader from '@/components/NavHeader'
import Footer from '../components/Footer'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('yearly')

  return (
    <div className="bg-[#FDFDFD] min-h-screen selection:bg-indigo-100">
      <NavHeader currentPage="pricing" />

      <main className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
              Invest in your <span className="text-indigo-600 italic">impact.</span>
            </h1>
            
            {/* GLOBAL BILLING TOGGLE */}
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

          <div className="grid lg:grid-cols-3 gap-8 mb-16 items-stretch">
            
            {/* FREE PLAN */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 flex flex-col transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)]">
              <div className="mb-8 p-3 bg-slate-50 w-fit rounded-2xl text-slate-400">
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Free</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900">$0</span>
              </div>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">Perfect for exploring AI-assisted drafting.</p>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {['10 AI generations / mo', 'Basic Lesson Templates', 'Save up to 10 documents'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <Check size={14} className="mt-1 text-slate-400" /> {f}
                  </li>
                ))}
              </ul>
              
              <Link href="/login" className="block text-center w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-black transition-all">
                Start for Free
              </Link>
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
                {['Unlimited AI generations', 'State Standards Alignment', 'Advanced PDF & DocX Export', 'Early access to new tools'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <Check size={14} className="mt-1 text-indigo-600" /> {f}
                  </li>
                ))}
              </ul>
              
              <Link href="/login?redirect=/billing" className="block text-center w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]">
                Go Pro
              </Link>
            </div>

            {/* ADVANCED PLAN */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 flex flex-col transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)]">
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
                {['Everything in Pro', 'Custom AI Voice Training', 'Plagiarism Detection', 'Dedicated Resource Designer', 'Bulk Class Imports'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <Check size={14} className="mt-1 text-indigo-900" /> {f}
                  </li>
                ))}
              </ul>
              
              <Link href="/login?redirect=/billing" className="block text-center w-full py-4 rounded-2xl border-2 border-indigo-900 text-indigo-900 font-bold hover:bg-slate-50 transition-all">
                Get Advanced
              </Link>
            </div>
          </div>

          {/* SCHOOL PLAN - MOVED UNDERNEATH */}
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 mb-24 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 rounded-lg"><Building2 size={24} className="text-indigo-400" /></div>
                  <span className="text-indigo-400 font-black text-xs uppercase tracking-widest">Enterprise Solution</span>
                </div>
                <h2 className="text-3xl font-black mb-4">DraftStudio for Schools</h2>
                <p className="text-slate-400 font-medium max-w-xl">Unified workspace for departments and districts with Admin Seat Management, LTI/LMS Integration, and Priority Support.</p>
             </div>
             <Link href="/contact" className="relative z-10 flex items-center gap-3 px-8 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:scale-105 transition-all whitespace-nowrap">
                Contact Sales <ArrowRight size={20} />
             </Link>
          </div>

          {/* FAQ SECTION */}
          <div className="max-w-3xl mx-auto pt-12 border-t border-slate-100">
             <h3 className="text-2xl font-black text-slate-900 text-center mb-12 flex items-center justify-center gap-2">
              <HelpCircle className="text-indigo-600" /> Frequently Asked Questions
            </h3>
            <div className="grid gap-8">
              <div>
                <h4 className="font-bold text-slate-900 mb-2 text-lg">Can I use DraftStudio with my school's curriculum?</h4>
                <p className="text-slate-500 font-medium leading-relaxed">Yes. Our AI can be trained on your specific curriculum documents and state standards for perfectly aligned drafting.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2 text-lg">Is my data secure?</h4>
                <p className="text-slate-500 font-medium leading-relaxed">DraftStudio is COPPA and FERPA compliant. We never use your student data to train our global models.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
