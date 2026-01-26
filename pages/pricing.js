import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles, Zap, Building2, HelpCircle, ArrowRight } from 'lucide-react'
import NavHeader from '@/components/NavHeader'
import Footer from '../components/Footer'

export default function PricingPage() {
  const [proCycle, setProCycle] = useState('yearly')

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
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Save hours of prep time every week with the intelligent workspace built specifically for educators.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-24 items-stretch">
            
            {/* FREE PLAN */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 flex flex-col transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)]">
              <div className="mb-8 p-3 bg-slate-50 w-fit rounded-2xl text-slate-400">
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Free</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900">$0</span>
              </div>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">Perfect for educators exploring AI-assisted drafting.</p>
              
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

            {/* PRO PLAN (With Integrated Toggle) */}
            <div className="relative bg-white rounded-[2.5rem] p-10 border-indigo-600 border-2 ring-8 ring-indigo-50 flex flex-col transition-all duration-500 shadow-xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg">
                Most Popular
              </div>
              
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Zap size={24} />
                </div>
                {/* IN-CARD TOGGLE */}
                <div className="bg-slate-100 p-1 rounded-xl flex">
                  <button 
                    onClick={() => setProCycle('monthly')}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${proCycle === 'monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                  > Monthly </button>
                  <button 
                    onClick={() => setProCycle('yearly')}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${proCycle === 'yearly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                  > Yearly </button>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-2">Pro</h2>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  {proCycle === 'monthly' ? '$19' : '$15'}
                </span>
                <span className="text-slate-400 font-bold text-sm">/ month</span>
              </div>
              {proCycle === 'yearly' && <p className="text-emerald-600 text-[11px] font-black uppercase tracking-widest mb-4">Billed annually ($180)</p>}
              {proCycle === 'monthly' && <div className="h-[21px] mb-4" />} {/* Spacer */}

              <ul className="space-y-4 mb-10 flex-grow">
                {['Unlimited AI generations', 'State Standards Alignment', 'Advanced PDF & DocX Export', 'Early access to new tools'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <Check size={14} className="mt-1 text-indigo-600" /> {f}
                  </li>
                ))}
              </ul>
              
              <Link href="/login" className="block text-center w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]">
                Go Pro
              </Link>
            </div>

            {/* SCHOOL PLAN */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 flex flex-col transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)]">
              <div className="mb-8 p-3 bg-slate-900 w-fit rounded-2xl text-white">
                <Building2 size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">School</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900">Custom</span>
              </div>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">Unified workspace for departments and districts.</p>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {['Shared Prompt Library', 'Admin Seat Management', 'LTI/LMS Integration', 'Priority Support'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <Check size={14} className="mt-1 text-slate-900" /> {f}
                  </li>
                ))}
              </ul>
              
              <Link href="/contact" className="block text-center w-full py-4 rounded-2xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-50 transition-all">
                Contact Sales
              </Link>
            </div>

          </div>

          {/* FAQ SECTION (Same as before) */}
          <div className="max-w-3xl mx-auto pt-12 border-t border-slate-100">
             <h3 className="text-2xl font-black text-slate-900 text-center mb-12 flex items-center justify-center gap-2">
              <HelpCircle className="text-indigo-600" /> Frequently Asked Questions
            </h3>
            <div className="space-y-8">
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
