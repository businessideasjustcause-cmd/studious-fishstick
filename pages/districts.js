import Link from 'next/link'
import {
  Building2,
  ShieldCheck,
  BarChart3,
  Users,
  ArrowRight,
  ClipboardCheck,
  Lock,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react'
import NavHeader from '../components/NavHeader'
import Footer from '../components/Footer'

export default function DistrictsPage() {
  return (
    <div className="bg-[#FDFDFD] min-h-screen selection:bg-indigo-100">
      <NavHeader currentPage="districts" />

      <main className="pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 relative overflow-hidden">
          {/* Decorative radial glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-[0.15em] mb-6">
              <Building2 size={14} />
              Enterprise Solutions
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8">
              Standardize Excellence. <br />
              <span className="text-indigo-600 italic">Simplify Teaching.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-10 max-w-2xl">
              DraftStudio empowers districts to align instructional materials at scale while giving teachers hours of their week back.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 flex items-center gap-3 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
              >
                Request a Demo <ArrowRight size={20} />
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-lg transition-all"
              >
                Pricing Plans
              </Link>
            </div>
          </div>
        </section>

        {/* Bento Grid: Trust & Oversight */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Built for Institutional Oversight</h2>
            <p className="text-slate-500 font-medium">Enterprise-grade tools for administrators who value precision.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="md:col-span-2 group bg-white border border-slate-100 rounded-[2.5rem] p-10 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] transition-all duration-500 relative overflow-hidden">
               <div className="relative z-10">
                <ShieldCheck className="w-12 h-12 text-indigo-600 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-black text-slate-900 mb-3">Governance & Control</h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-md">
                  Centralized admin dashboards with role-based permissions. Manage school-wide licensing, monitor adoption rates, and audit AI-generated content in real-time.
                </p>
               </div>
               <div className="absolute bottom-[-20%] right-[-10%] opacity-5 group-hover:opacity-10 transition-opacity">
                  <ShieldCheck size={300} />
               </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between">
              <div>
                <Lock className="w-12 h-12 text-indigo-400 mb-6" />
                <h3 className="text-2xl font-bold mb-3">Zero-Data Retention</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Enterprise-grade security. We do not store student data, and your district's proprietary content is never used to train global models.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">FERPA & COPPA COMPLIANT</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-10 group">
              <ClipboardCheck className="w-12 h-12 text-indigo-600 mb-6 group-hover:rotate-12 transition-transform" />
              <h3 className="text-2xl font-black text-slate-900 mb-3">State Standards Alignment</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Automate alignment with NGSS, Common Core, or state-specific frameworks. Ensure 100% consistency across every classroom.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <Globe className="w-12 h-12 text-indigo-600 mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-3">Seamless Integrations</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  DraftStudio fits into your existing ecosystem. We support LTI 1.3, Canvas, Google Classroom, and Schoology integrations for a friction-less teacher experience.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 max-w-[240px]">
                 {['LMS', 'SSO', 'SIS', 'API'].map(tag => (
                   <span key={tag} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-widest">{tag}</span>
                 ))}
              </div>
            </div>
          </div>
        </section>

        {/* Impact Numbers */}
        <section className="bg-white py-32 border-y border-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: 'Efficiency Gain', val: '60%', icon: <Zap size={18}/> },
                { label: 'Teacher Support', val: '100%', icon: <Users size={18}/> },
                { label: 'District Oversight', val: 'Full', icon: <Building2 size={18}/> },
                { label: 'Security Risk', val: 'Zero', icon: <Lock size={18}/> },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl mb-2">
                    {stat.icon}
                  </div>
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Card */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="relative bg-indigo-600 rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-2xl shadow-indigo-200">
             {/* Abstract background shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 blur-[60px] rounded-full -translate-x-1/4 translate-y-1/4" />
            
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                Ready to transform your instructional strategy?
              </h2>
              <p className="text-indigo-100 text-lg font-medium mb-10">
                Join 50+ forward-thinking districts already scaling their curriculum with DraftStudio.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all shadow-lg active:scale-[0.98] flex items-center gap-2"
                >
                  Schedule Implementation Call <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      <Footer />
    </main>
  </div>
)
}
