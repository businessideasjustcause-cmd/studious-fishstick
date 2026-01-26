import Link from 'next/link'
import NavHeader from '@/components/NavHeader'
import HowItWorksSection from '@/components/HowItWorksSection'
import Footer from '@/components/Footer'
import { FileText, Clock, Download, CheckCircle, Users, BarChart2, ArrowRight, Sparkles } from 'lucide-react'

export default function Landing() {
  return (
    <div className="bg-white font-sans min-h-screen selection:bg-indigo-100 selection:text-indigo-700">
      <NavHeader currentPage="home" />

      <main className="relative overflow-hidden">
        {/* Modern Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-transparent -z-10" />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" /> New: Draft Studio 2.0
            </div>
            <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
              Create Standards-Aligned Materials <span className="text-indigo-600">in Seconds.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Draft Studio helps educators instantly generate curriculum-aligned worksheets and quizzes so you can reclaim your evenings.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="px-8 py-4 border border-slate-200 rounded-full font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                View Demo
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Trusted by 5,000+ K-12 Educators
            </p>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000">
            <div className="absolute -inset-4 bg-indigo-100/50 rounded-[2rem] blur-2xl -z-10" />
            <img 
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f" 
              alt="Teacher classroom" 
              className="rounded-2xl shadow-2xl border-4 border-white w-full object-cover aspect-[4/3]" 
            />
            <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-5 flex gap-4 animate-bounce-slow">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <CheckCircle className="text-emerald-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Standards Aligned</p>
                <p className="text-xs text-slate-500 font-medium">Common Core & TEKS</p>
              </div>
            </div>
          </div>
        </section>

       {/* Features Bento Grid */}
<section className="py-10 bg-white">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <div className="text-center mb-16">
      <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-3 inline-block">
        Features
      </span>
      <h2 className="text-5xl font-extrabold text-slate-950 mb-4 tracking-tighter">
        Everything Teachers Need
      </h2>
      <p className="text-slate-600 text-xl max-w-2xl mx-auto">
        Designed by educators, for educators. High-quality materials, minus the manual labor.
      </p>
    </div>

    {/* Bento Grid Container */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { icon: FileText, title: "Standards Aligned", text: "Every prompt is cross-referenced with regional curriculum maps.", color: "text-blue-600" },
        { icon: Clock, title: "Save 10+ Hours", text: "Reclaim your weekends. Planning that used to take hours now takes clicks.", color: "text-blue-600" },
        { icon: Download, title: "Export Anywhere", text: "Seamlessly move content to Google Classroom, Canvas, or PDF.", color: "text-blue-600" },
        { icon: CheckCircle, title: "Smart Keys", text: "Answer keys generated automatically for every single worksheet.", color: "text-blue-600" },
      ].map((feature, index) => (
        <div key={index} className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300">
          <div className={`inline-flex p-4 rounded-2xl bg-slate-100 ${feature.color} mb-6`}>
            <feature.icon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-slate-950 mb-3 tracking-tight">
            {feature.title}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {feature.text}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>


        <HowItWorksSection />

{/* Stats */}
<section className="bg-white py-12 sm:py-16">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <div className="mx-auto max-w-2xl lg:max-w-none">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {[
          { icon: Users, value: "5,000+", label: "Teachers Using Platform" },
          { icon: BarChart2, value: "20,000+", label: "Materials Created" },
          { icon: Clock, value: "100+ hrs", label: "Saved Weekly" },
        ].map((stat, index) => (
          <div
            key={index}
            className="flex flex-col gap-y-3 rounded-3xl bg-indigo-50 p-8 text-center border border-indigo-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white"
          >
            <div className="mx-auto rounded-full bg-indigo-100 p-4">
              <stat.icon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
            </div>
            <dt className="text-sm font-semibold leading-6 text-indigo-950">{stat.label}</dt>
            <dd className="order-first text-5xl font-extrabold tracking-tight text-indigo-950">
              {stat.value}
            </dd>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


 {/* Enhanced CTA Section */}
<section className="max-w-6xl mx-auto my-24 px-6 lg:px-8">
  <div className="bg-slate-950 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl border border-slate-800">
    {/* Subtle Background Glow/Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-slate-950" />
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />

    {/* Content */}
    <div className="relative z-10">
      <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-300 mb-6 border border-indigo-500/20">
        Trusted by 10,000+ Teachers
      </span>
      <h2 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tighter leading-tight">
        Stop Planning. <br className="hidden lg:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-300">Start Teaching.</span>
      </h2>
      <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
        Join thousands of educators who have simplified their workflow, eliminated burnout, and found joy in teaching again with Draft Studio.
      </p> 
      
      <Link href="/login" className="px-10 py-4 bg-white text-slate-950 rounded-full font-semibold hover:bg-slate-200 transition-all text-lg inline-flex items-center gap-2 shadow-lg hover:shadow-indigo-500/20">
        Get Started for Free
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.5a.75.75 0 010 1.08l-5.5 5.5a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
        </svg>
      </Link>
    </div>
  </div>
</section>



      <Footer />
    </main>
  </div>
)
}
function Feature({ icon: Icon, title, text }) {
  return (
    <div className="group bg-white border border-slate-200 rounded-3xl p-8 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <h3 className="font-bold text-xl text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{text}</p>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-5xl font-black text-white mb-2 tracking-tight">{value}</p>
      <p className="text-indigo-200 font-medium uppercase tracking-widest text-xs">{label}</p>
    </div>
  )
}
