import Layout from '../components/Layout'
import { CreditCard, Zap, Receipt, ArrowUpRight, Check, ShieldCheck } from 'lucide-react'

export default function Billing({ session, loading: appLoading }) {
  if (appLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  )
  
  if (!session) return null

  const handleManageBilling = () => {
    // In 2026, you would typically link to your Stripe Customer Portal URL here
    // window.location.href = process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL
    alert('Redirecting to Stripe Secure Portal...')
  }

  return (
    <Layout session={session} loading={appLoading}>
      <div className="max-w-5xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Billing & Plans</h1>
          <p className="text-slate-500 font-medium mt-2">Manage your subscription and review your billing history.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Current Plan Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[60px] rounded-full" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Current Plan</span>
                </div>
                
                <h2 className="text-5xl font-black text-slate-900 mb-2">Free Tier</h2>
                <p className="text-slate-500 font-medium mb-8">Perfect for getting started with smart drafting.</p>
                
                <div className="space-y-3 mb-8">
                  {['3 Projects included', 'Basic AI templates', 'Community Support'].map((feat) => (
                    <div key={feat} className="flex items-center gap-3 text-slate-600 font-medium">
                      <div className="flex-shrink-0 w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      {feat}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => alert('Upgrade flow initiated')}
                  className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:-translate-y-0.5 transition-all shadow-xl shadow-indigo-100"
                >
                  Upgrade to Pro
                  <Zap size={18} className="fill-white group-hover:animate-pulse" />
                </button>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-dashed border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                    <CreditCard className="text-slate-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Payment Method</h3>
                    <p className="text-sm text-slate-500">No card connected</p>
                  </div>
                </div>
                <button className="text-sm font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">
                  Add Card
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Billing Quick Actions & History */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Link Card */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
              <ShieldCheck className="text-indigo-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Secure Billing</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                All transactions are encrypted and processed via Stripe. We never store your card details on our servers.
              </p>
              <button 
                onClick={handleManageBilling}
                className="w-full flex items-center justify-center gap-2 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-bold transition-colors text-sm"
              >
                Customer Portal <ArrowUpRight size={16} />
              </button>
            </div>

            {/* Invoices Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Receipt className="text-slate-400" size={20} />
                <h3 className="font-bold text-slate-900">Recent Invoices</h3>
              </div>
              
              <div className="space-y-4">
                {/* Empty State */}
                <div className="py-6 text-center">
                  <p className="text-slate-400 text-sm font-medium italic">No payment history yet.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Support Footer */}
        <p className="mt-12 text-center text-xs text-slate-400 font-medium">
          Have questions about your bill? <a href="mailto:support@draftstudio.com" className="text-indigo-600 font-bold hover:underline">Contact Support</a>
        </p>
      </div>
    </Layout>
  )
}
