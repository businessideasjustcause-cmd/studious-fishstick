import Link from 'next/link'
import NavHeader from '@/components/NavHeader'
import HowItWorksSection from '@/components/HowItWorksSection'
import Footer from '@/components/Footer'
import { CheckCircle, ShieldCheck, Database, ArrowRight, Sparkles } from 'lucide-react'
import FillButton from '@/components/FillButton'
import { ArrowUpRight, Clock, Download, Users, BarChart2 } from 'lucide-react'
import Phone from '@/components/Phone'

export default function Hero() {
const words = ["Teaching.", "Growing.", "Learning.", "Impacting.", "Teaching."];

  return (
    <div className="bg-white font-sans min-h-screen selection:bg-indigo-100 selection:text-indigo-700">
      <NavHeader currentPage="home" />

      <main className="relative overflow-hidden">
        {/* Modern Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-transparent -z-10" />

        <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" /> New: Draft Studio 2.0
            </div>

    <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
      Stop Planning. <br /> 
      Start{" "}
      <span className="relative inline-flex flex-col h-[1.2em] overflow-hidden align-bottom">
        <span className="flex flex-col animate-word-roll">
          {words.map((word, i) => (
            <span 
              key={i} 
              className="text-indigo-600 italic leading-[1.2em] h-[1.2em] block"
            >
              {word}
            </span>
          ))}
        </span>
      </span>
    </h1>

            {/* Injects the keyframes safely into the document head */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes word-roll {
                0%, 15% { transform: translateY(0); }
                20%, 35% { transform: translateY(-20%); }
                40%, 55% { transform: translateY(-40%); }
                60%, 75% { transform: translateY(-60%); }
                80%, 95% { transform: translateY(-80%); }
                100% { transform: translateY(-80%); }
              }
            `}} />

            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl font-medium">
              Draft Studio helps educators instantly generate curriculum-aligned worksheets and quizzes so you can <span className="text-slate-900 font-bold decoration-indigo-200 decoration-4">reclaim your evenings.</span>
            </p>
            
            <div className="flex flex-wrap items-center gap-8">
              <FillButton 
                text="Start Free Trial" 
                onClick={() => window.location.href = '/login'} 
              />
              <Link href="/login" className="group flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 transition-all">
                View Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-slate-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Trusted by 5,000+ K-12 Educators
            </p>
          </div>

          {/* Right Image Section */}
          <div className="relative animate-in fade-in zoom-in duration-1000">
            <div className="absolute -inset-4 bg-indigo-100/50 rounded-[2rem] blur-2xl -z-10" />
            <div className="max-w-7xl mx-auto px-6 lg:px-8"><Phone /></div>
          </div>
        </section>
       
<section 
  className="review-carousel" 
  style={{ padding: '60px 0', overflow: 'hidden', background: '#4f46e5', fontFamily: 'sans-serif' }}
>
  <style jsx>{`
    .review-viewport {
      /* Smooth edge fade using linear-gradient mask */
      mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
    }

    .marquee-container {
      display: flex;
      width: max-content;
      /* Dynamic speed variable for smooth slowing */
      animation: scroll var(--speed, 40s) linear infinite;
      transition: animation-duration 0.8s ease-in-out;
    }


    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .review-card {
      width: 350px;
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin: 0 15px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
    }

    .profile {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }

    .profile img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 12px;
      object-fit: cover;
    }

    .stars {
      color: #fbbf24;
      margin-bottom: 8px;
      font-size: 1.2rem;
    }

    .review-text {
      color: #4b5563;
      line-height: 1.5;
      font-size: 0.95rem;
    }
  `}</style>

  <div className="review-viewport">
    <div className="marquee-container">
      {/* 5 unique reviews, doubled for the seamless loop effect */}
      {[1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7].map((id, index) => (
        <div className="review-card" key={index}>
          <div className="profile">
            {/* Unsplash Source: Random portrait photo for each user ID */}
            <img 
              src={`https://images.unsplash.com/photo-${id === 1 ? '1535713875002-d1d0cf377fde' : 
                    id === 2 ? '1599566150163-29194dcaad36' : 
                    id === 3 ? '1580489944761-15a19d654956' : 
                    id === 4 ? '1507003211169-0a1dd7228f2d' : 
                    id === 5 ? '1524504388940-b1c1722653e1' :
                    id === 6 ? '1544005313-94ddf0286df2' :
                    '1438761681033-6461ffad8d80'}?auto=format&fit=crop&w=150&h=150`} 
              alt="User profile" 
            />
            <strong>
              {id === 1 ? 'Alex Rivers' : 
               id === 2 ? 'Jordan Smith' : 
               id === 3 ? 'Taylor Wong' : 
               id === 4 ? 'Morgan Lee' : 
                id === 5 ? 'Riley Patel' :
                id === 6 ? 'Jamie Kim' :
               'Casey Blair'}
            </strong>
          </div>
          <div className="stars">★★★★★</div>
          <p className="review-text">
            {id === 1 ? "Draft has completely changed my Sunday nights. I used to spend hours cross-referencing Common Core standards with my lesson ideas, but now I just input my topic and the AI builds a perfectly aligned material set in seconds. It’s like having a personal curriculum specialist." : 
             id === 2 ? "What impressed me most about Draft is the 'Standards Search' feature. I can pull in NGSS standards directly while building science units using the 5E model. It doesn't just generate text; it organizes the material into logical phases like Engage and Explore that actually make sense for the classroom." :
             id === 3 ? "We use Draft to ensure consistency across our entire district. The AI ensures every piece of content—from rubrics to course maps—aligns with our professional standards and tone without requiring constant oversight. It has cut our material development time by nearly 80%." :
             id === 4 ? "Draft is a total game-changer for differentiation. With one click, I can take a standards-aligned reading passage and generate three versions: one for students below grade level, one at level, and an extension task. I finally feel like I can give every student what they need" :
              id === 5 ? "As a curriculum coordinator, Draft has been invaluable for maintaining quality and alignment across multiple schools. The AI-generated materials are consistently on point with state standards, and the ability to customize prompts means we can adapt resources for different grade levels with ease." :
              id === 7 ? "It's been a lifesaver! I can create entire units in minutes that would have taken me days before. The AI understands educational standards and creates materials that are both engaging and aligned. My students love the variety, and I love the time I save." :
             "It's just Incredible. As a special ed teacher, creating tailored resources for each student's IEP used to take forever. Now, Draft helps me generate customized worksheets and activities that meet individual goals in minutes. My students are more engaged, and I have so much more time to focus on teaching."}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

        <HowItWorksSection />

<section 
  className="relative bg-[#FDFDFD] py-5 md:py-5 overflow-hidden"
  style={{
    // The "Seamless Bleed": creates a long, natural fade into adjacent sections
    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
  }}
>
  {/* 2026 High-Fidelity Background: Orbital Glows */}
  <div className="absolute inset-0 pointer-events-none z-0">
    <div className="absolute top-[-10%] left-[5%] w-[50%] h-[50%] bg-indigo-200/20 blur-[140px] rounded-full animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-violet-100/20 blur-[120px] rounded-full" />
  </div>

  <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
    
    {/* Header: Brutalist Typography with Utility Sub-text */}
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-28">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
        </div>
        <h2 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.8] mb-8">
          Proven at <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-400 to-violet-600 italic">global scale.</span>
        </h2>
      </div>
      
      <div className="lg:mb-4">
        <p className="text-slate-500 text-lg font-medium max-w-sm leading-relaxed border-l-2 border-indigo-100 pl-6">
          Architecting institutional intelligence across <span className="text-slate-900 font-bold">450+ high-performing</span> school districts.
        </p>
      </div>
    </div>

    {/* Bento Grid: Interactive Surface Cards */}
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 auto-rows-fr">
      {[
        { 
          icon: Users, 
          value: "5,000", 
          suffix: "+",
          label: "Active Educators", 
          desc: "Teachers deploying neural drafts daily.",
          gridSpan: "lg:col-span-4",
          accent: "group-hover:bg-indigo-600"
        },
        { 
          icon: BarChart2, 
          value: "20,000", 
          suffix: "+",
          label: "Drafts Architected", 
          desc: "Proprietary Llama-3.1 pedagogical builds.",
          gridSpan: "lg:col-span-5",
          accent: "group-hover:bg-violet-600"
        },
        { 
          icon: Clock, 
          value: "100", 
          suffix: "hrs",
          label: "Efficiency Gain", 
          desc: "Saved per teacher, every semester.",
          gridSpan: "lg:col-span-3",
          accent: "group-hover:bg-slate-900"
        },
      ].map((stat, index) => (
        <Link
          key={index}
          href="/resources"
          className={`${stat.gridSpan} group relative flex flex-col justify-between rounded-[3.5rem] bg-white p-12 border border-slate-200/60 shadow-sm transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-4 overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10">
            <div className={`w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-12 transition-all duration-500 group-hover:rotate-6 ${stat.accent}`}>
              <stat.icon className="h-7 w-7 text-slate-900 group-hover:text-white transition-colors duration-500" />
            </div>
            
            <div className="flex items-baseline gap-1">
              <dd className="text-7xl md:text-8xl font-black tracking-tighter text-slate-900 group-hover:text-indigo-600 transition-all duration-700">
                {stat.value}
              </dd>
              <span className="text-2xl font-black text-indigo-400">{stat.suffix}</span>
            </div>
          </div>

          <div className="relative z-10 mt-20">
            <div className="flex items-center justify-between mb-4">
               <dt className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-indigo-600 transition-colors">
                {stat.label}
              </dt>
              <ArrowUpRight className="text-slate-300 w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <p className="text-slate-600 text-sm font-bold leading-relaxed">{stat.desc}</p>
          </div>
        </Link>
      ))}
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
