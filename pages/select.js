import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { 
  Sparkles, 
  ListChecks, 
  ArrowRight, 
  Zap, 
  LayoutTemplate, 
  MousePointer2,
  Wand2
} from 'lucide-react'

export default function CreateSelect({ session, loading }) {
  const router = useRouter()

  return (
    <Layout session={session} loading={loading}>
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Header Area */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full mb-6">
            <Wand2 size={14} className="text-slate-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Creation Engine v2.4</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
            How would you like to <span className="text-indigo-600">Draft?</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto italic">
            "Choose your workflow. Draft handles the heavy lifting."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Guided Mode (DraftStudio Blue) */}
          <button 
            onClick={() => router.push('/create/guided')}
            className="group relative flex flex-col text-left bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-indigo-100 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/50 blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-200 group-hover:scale-110 transition-transform">
                <ListChecks className="text-white" size={32} />
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Guided Mode</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Perfect for structured materials. Follow our step-by-step form to define standards, topics, and objectives.
              </p>

              <div className="space-y-3 mb-10">
                {['Form-style creation', 'Standards alignment', 'Teacher-controlled focus'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-2 text-indigo-600 font-black uppercase tracking-[0.2em] text-xs">
                Build Step-by-Step <ArrowRight size={16} />
              </div>
            </div>
          </button>

         {/* Card 2: Smart Mode (Coming Soon) */}
<button 
  disabled // Disable interaction
  className="group relative flex flex-col text-left bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] cursor-not-allowed overflow-hidden"
>
  {/* Coming Soon Badge */}
  <div className="absolute top-8 right-8 z-20">
    <div className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full border border-orange-200">
       <span className="text-[10px] font-black uppercase tracking-widest">Coming Soon</span>
    </div>
  </div>

  {/* Grayscale Overlay for the content */}
  <div className="grayscale opacity-60 flex flex-col h-full">
    {/* Background Accent */}
    <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50/50 blur-[60px] -translate-y-1/2 translate-x-1/2" />
    
    <div className="relative z-10 flex flex-col h-full">
      <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-orange-100">
        <Zap className="text-white fill-white" size={32} />
      </div>
      
      <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Smart Mode</h2>
      <p className="text-slate-500 font-medium leading-relaxed mb-8">
        Neural-first drafting. Type a single sentence and let Draft Studio create the entire document for you.
      </p>

      <div className="space-y-3 mb-10">
        {['Prompt-to-Document', 'Neural architecture', 'Infinite creativity'].map((item) => (
          <div key={item} className="flex items-center gap-3 text-xs font-bold text-slate-300 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
            {item}
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2 text-slate-400 font-black uppercase tracking-[0.2em] text-xs">
        Under Development <Sparkles size={16} />
      </div>
    </div>
  </div>
</button>


        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button 
            onClick={() => router.back()}
            className="text-[10px] font-black text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-[0.3em] flex items-center justify-center gap-2 mx-auto"
          >
            <LayoutTemplate size={14} /> Return to Dashboard
          </button>
        </div>
      </div>
    </Layout>
  )
}
