import Link from 'next/link'
import {
  Users,
  ShieldCheck,
  BarChart3,
  FolderLock,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react'
import NavHeader from '../components/NavHeader'
import Footer from '../components/Footer'

export default function SchoolsPage() {
  return (
    <div className="bg-[#FDFDFD] min-h-screen selection:bg-indigo-100">
      <NavHeader currentPage="schools" />

      <main className="pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 relative overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-50/50 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <div className="grid lg:grid-cols-12 gap-16 items-center relative z-10">
            <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Sparkles size={12} />
                Institutional Tier
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8">
                The Operating System for <span className="text-indigo-600">Modern Schools.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-xl">
                DraftStudio for Schools provides a unified, secure workspace where teachers generate high-quality curriculum and administrators maintain complete oversight.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/pricing"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 flex items-center gap-3 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
                >
                  Get School Access <ArrowRight size={20} />
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-lg transition-all"
                >
                  Contact Sales
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-slate-100 p-8 md:p-10 space-y-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Zap className="text-indigo-600" size={20} fill="currentColor" />
                  School Highlights
                </h3>
                {[
                  { 
                    icon: <ShieldCheck className="text-emerald-500" />, 
                    title: 'Safe & Controlled AI', 
                    desc: 'Role-based access ensures only staff can generate content.' 
                  },
                  { 
                    icon: <FolderLock className="text-indigo-500" />, 
                    title: 'Shared Material Library', 
                    desc: 'Collaborate on approved worksheets across departments.' 
                  },
                  { 
                    icon: <BarChart3 className="text-blue-500" />, 
                    title: 'Usage Analytics', 
                    desc: 'Monitor adoption and productivity metrics in one dashboard.' 
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm tracking-tight">{item.title}</p>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="bg-white py-32 border-y border-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Built for School-Wide Deployment</h2>
              <p className="text-slate-500 font-medium leading-relaxed text-lg">Every feature is designed to bridge the gap between AI innovation and institutional requirements.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="w-10 h-10 text-indigo-600 mb-6" />,
                  title: 'Unlimited Staff Seats',
                  desc: 'One flat fee covers all your teachers, TAs, and administrators. No per-seat friction.'
                },
                {
                  icon: <ShieldCheck className="w-10 h-10 text-indigo-600 mb-6" />,
                  title: 'Admin Command Center',
                  desc: 'Standardize prompt outputs and ensure all generated materials meet district quality benchmarks.'
                },
                {
                  icon: <CheckCircle2 className="w-10 h-10 text-indigo-600 mb-6" />,
                  title: 'Standards Compliance',
                  desc: 'Enable state-specific standards alignment for every document created on the platform.'
                }
              ].map((feature, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 p-10 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-500 group">
                  {feature.icon}
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-slate-200">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                Ready to empower your staff?
              </h2>
              <p className="text-slate-400 text-lg font-medium mb-10 max-w-2xl mx-auto">
                Join hundreds of schools currently using DraftStudio to reclaim thousands of hours of teacher time.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
              >
                See School Pricing <ArrowRight size={22} />
              </Link>
              <p className="mt-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">
                Fast Setup &bull; FERPA Compliant &bull; 24/7 Support
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
