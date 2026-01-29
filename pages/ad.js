import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, FileText, Settings, ArrowRight, Bell, 
  Sparkles, Zap, History, MousePointer2, Star, 
  ShieldCheck, Search, CheckCircle, TrendingUp,
  Download, Share2, Printer, LayoutDashboard, Plus,
  FolderOpen, BarChart2, X, GraduationCap, HelpCircle
} from 'lucide-react';

/**
 * ZELIOS-STYLE MOTION ENGINE 3.0
 * Logic: Linear Cinematic Sequence (18s Loop)
 * Scenes: Hook -> Dashboard -> Create -> Standards -> Generate -> Result -> CTA
 */

const UltimateAdEngine = () => {
  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden font-sans text-slate-900 selection:bg-indigo-500/30">
      
      {/* --- CINEMATIC AMBIANCE & GRID --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[180px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] grayscale" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org d='M60 60H0V0h60v60zM1 1h58v58H1V1z' fill='%23fff' fill-rule='evenodd'/%3E%3C/svg%3E")` }} 
        />
      </div>

      {/* --- SCENE 1: THE CINEMATIC HOOK (0s - 3s) --- */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-[100] pointer-events-none px-6">
        <div className="space-y-10 text-center animate-[cinematicHook_18s_infinite]">
          <div className="inline-flex items-center gap-4 px-8 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 text-indigo-400 rounded-full text-2xl font-black uppercase tracking-[0.5em] shadow-2xl">
            <Sparkles className="w-8 h-8 animate-pulse" /> Draft Studio 2.0
          </div>
          <h1 className="text-[10vw] font-black text-white leading-[0.8] tracking-[-0.07em]">
            Invest in your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600 italic">impact.</span>
          </h1>
          <div className="flex items-center justify-center gap-6">
            <div className="flex -space-x-4">
              {[1,2,3].map(i => <div key={i} className="w-16 h-16 rounded-full border-4 border-[#050505] bg-slate-800" />)}
            </div>
            <p className="text-3xl text-slate-400 font-bold tracking-tight">Trusted by 5,000+ Educators</p>
          </div>
        </div>
      </div>

      {/* --- SCENE 2: THE PRODUCT ENVIRONMENT (3s - 15s) --- */}
      <div className="absolute inset-0 flex items-center justify-center px-10">
        <div className="relative w-full max-w-[1600px] h-[900px] animate-[appContainer_18s_infinite]">
          
          {/* THE DEVICE CHASSIS */}
          <div className="absolute inset-0 bg-white rounded-[4rem] shadow-[0_120px_250px_-50px_rgba(0,0,0,0.8)] border-[1px] border-white/10 overflow-hidden flex">
            
            {/* SIDEBAR UI (From Index.js) */}
            <div className="w-80 bg-slate-50 border-r border-slate-100 p-10 flex flex-col justify-between">
              <div className="space-y-12">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                    <Zap size={32} />
                  </div>
                  <span className="font-black text-2xl tracking-tighter">DraftStudio</span>
                </div>
                <nav className="space-y-4">
                  {[
                    { icon: LayoutDashboard, label: 'Dashboard', active: true },
                    { icon: Plus, label: 'Create New', active: false },
                    { icon: FolderOpen, label: 'Library', active: false },
                    { icon: BarChart2, label: 'Analytics', active: false },
                    { icon: Settings, label: 'Settings', active: false },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-[1.5rem] transition-all ${item.active ? 'bg-white shadow-md border border-slate-100 text-indigo-600' : 'text-slate-400'}`}>
                      <item.icon size={26} />
                      <span className="font-black text-lg tracking-tight">{item.label}</span>
                    </div>
                  ))}
                </nav>
              </div>
              <div className="p-8 bg-indigo-900 rounded-[2.5rem] text-white shadow-2xl">
                 <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-2">Saved Logic</p>
                 <p className="text-4xl font-black italic">42.5h</p>
                 <p className="text-xs font-bold opacity-60">Total Time Reclaimed</p>
              </div>
            </div>

            {/* MAIN WORKSPACE AREA */}
            <div className="flex-1 relative flex flex-col bg-white">
              
              {/* TOP NAVIGATION BAR */}
              <div className="h-24 border-b border-slate-50 flex items-center px-12 justify-between">
                <div className="flex items-center gap-4 bg-slate-100/50 px-6 py-3 rounded-2xl border border-slate-100">
                  <Search size={16} className="text-slate-400" />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">app.draftstudio.com / dashboard</span>
                </div>
                <div className="flex items-center gap-6">
                  <Bell className="text-slate-300" />
                  <div className="w-12 h-12 bg-indigo-100 rounded-full border-2 border-white shadow-sm" />
                </div>
              </div>

              {/* DYNAMIC CONTENT STAGE */}
              <div className="flex-1 relative overflow-hidden">
                
                {/* STAGE 1: THE DASHBOARD (3s - 6s) */}
                <div className="absolute inset-0 p-20 animate-[dashboardStage_18s_infinite] space-y-16">
                  <header>
                    <h2 className="text-7xl font-black tracking-tight text-slate-900">Welcome, <span className="text-indigo-600 italic">Educator.</span></h2>
                    <p className="text-2xl text-slate-400 mt-4 font-medium italic">"Every great lesson begins with a focused draft."</p>
                  </header>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="group relative overflow-hidden bg-white p-12 rounded-[3rem] border-4 border-indigo-600 shadow-2xl">
                       <div className="absolute top-0 right-0 p-8 opacity-10"><PlusCircle size={150} className="text-indigo-600" /></div>
                       <div className="relative space-y-6">
                         <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-100">
                           <PlusCircle size={40} />
                         </div>
                         <div>
                           <h3 className="text-3xl font-black mb-2">Create New Material</h3>
                           <p className="text-slate-400 text-lg font-medium">Generate AI-powered assignments in seconds.</p>
                         </div>
                       </div>
                    </div>
                    <div className="p-12 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col justify-center gap-4">
                       <History className="text-slate-300" size={40} />
                       <h3 className="text-2xl font-black text-slate-400">Library View</h3>
                       <div className="h-3 w-48 bg-slate-200 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* STAGE 2: THE CREATION MODAL (6s - 12s) */}
                <div className="absolute inset-0 z-50 flex items-center justify-center p-12 bg-slate-950/40 backdrop-blur-xl opacity-0 pointer-events-none animate-[modalStage_18s_infinite]">
                  <div className="w-full max-w-4xl bg-white rounded-[4rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative">
                    <div className="space-y-10">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="text-4xl font-black tracking-tight">Generate Draft</h3>
                          <p className="text-slate-400 font-medium">Standards-aligned curriculum generation</p>
                        </div>
                        <div className="p-4 bg-slate-100 rounded-full text-slate-400"><X size={24} /></div>
                      </div>

                      {/* Content Selection Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Worksheet', icon: FileText, active: true },
                          { label: 'Quiz', icon: HelpCircle, active: false }
                        ].map((item, i) => (
                          <div key={i} className={`p-8 rounded-[2.5rem] border-4 transition-all ${item.active ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100'}`}>
                            <item.icon className={item.active ? 'text-indigo-600' : 'text-slate-400'} size={32} />
                            <p className={`mt-4 font-black uppercase text-sm tracking-[0.2em] ${item.active ? 'text-indigo-600' : 'text-slate-400'}`}>{item.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Input Field with Logic-Triggered Typing */}
                      <div className="p-10 bg-slate-50 rounded-[2.5rem] border-2 border-slate-200 text-4xl font-black text-slate-900 flex items-center gap-4 relative overflow-hidden">
                         <span className="animate-[typingSequence_18s_infinite]">Geometric Proofs</span>
                         <span className="w-1.5 h-12 bg-indigo-600 animate-pulse" />
                      </div>

                      {/* Generate Button with Neural Progress */}
                      <div className="relative h-28 w-full bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-3xl font-black uppercase tracking-[0.4em] overflow-hidden">
                         <Zap className="mr-4 fill-indigo-400 text-indigo-400" /> 
                         <span className="animate-[genText_18s_infinite]">Generate</span>
                         <div className="absolute inset-0 bg-indigo-600 opacity-0 animate-[buttonGlow_18s_infinite]" />
                         <div className="absolute bottom-0 left-0 h-3 bg-indigo-500 w-0 animate-[aiProgress_18s_infinite]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* STAGE 3: THE RESULTING DOCUMENT (12s - 15s) */}
                <div className="absolute inset-0 p-12 bg-slate-100 flex items-center justify-center translate-y-full opacity-0 animate-[resultStage_18s_infinite]">
                  <div className="w-full max-w-4xl h-full bg-white shadow-2xl rounded-t-[3rem] p-20 space-y-12 relative overflow-hidden">
                     {/* PDF Watermark */}
                     <div className="absolute top-20 right-[-50px] rotate-45 text-[150px] font-black text-slate-50 pointer-events-none">DRAFT</div>
                     
                     <div className="border-b-[6px] border-slate-900 pb-10 flex justify-between items-end relative z-10">
                        <div>
                          <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-2">Mastery Resource</p>
                          <h3 className="text-5xl font-black text-slate-900">Geometric Proofs</h3>
                        </div>
                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                          <ShieldCheck className="text-indigo-600" size={32} />
                        </div>
                     </div>

                     <div className="space-y-10 relative z-10">
                        {[1,2,3].map(q => (
                          <div key={q} className="space-y-4">
                             <div className="flex gap-6 items-start">
                               <span className="font-black text-2xl text-slate-900">{q}.</span>
                               <div className="h-6 bg-slate-100 rounded-full w-full" />
                             </div>
                             <div className="pl-12 space-y-3">
                               <div className="h-4 bg-slate-50 rounded-full w-5/6" />
                               <div className="h-4 bg-slate-50 rounded-full w-4/6" />
                               <div className="mt-8 h-32 border-4 border-dashed border-slate-100 rounded-[2rem]" />
                             </div>
                          </div>
                        ))}
                     </div>

                     {/* Floating Control Hub */}
                     <div className="absolute -right-24 top-1/4 space-y-6">
                        {[Download, Share2, Printer].map((Icon, i) => (
                          <div key={i} className="w-20 h-20 bg-white rounded-[1.5rem] shadow-2xl flex items-center justify-center text-indigo-600 border border-slate-100 animate-[controlPop_18s_infinite]" style={{ animationDelay: `${12 + (i*0.2)}s` }}>
                            <Icon size={32} />
                          </div>
                        ))}
                     </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- LAYER 3: THE ACTION MOUSE & CLICK POOFS --- */}
      <div className="absolute z-[200] pointer-events-none animate-[mousePath_18s_infinite]">
        <div className="relative">
          <MousePointer2 className="w-20 h-20 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] fill-slate-900 rotate-[-10deg]" />
          
          {/* THE SYNCED CLICK POOF ENGINE */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
             {/* Click 1: Dashboard Create */}
             <div className="w-40 h-40 bg-indigo-500/50 rounded-full scale-0 animate-[poof_18s_infinite_4.2s]" />
             {/* Click 2: Input Field */}
             <div className="w-40 h-40 bg-indigo-500/50 rounded-full scale-0 animate-[poof_18s_infinite_6.5s]" />
             {/* Click 3: Generate Button */}
             <div className="w-48 h-48 bg-indigo-500/50 rounded-full scale-0 animate-[poof_18s_infinite_10.2s]" />
          </div>
        </div>
      </div>

      {/* --- LAYER 4: THE HARD CALL TO ACTION (15s - 18s) --- */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-[300] bg-white opacity-0 animate-[ctaScene_18s_infinite] pointer-events-none">
          <div className="max-w-4xl text-center space-y-12 px-6">
            <h2 className="text-[8vw] font-black tracking-[-0.05em] text-slate-900 leading-none">
              Start your <br /> <span className="text-indigo-600 italic underline decoration-indigo-200 decoration-[16px]">Free Trial.</span>
            </h2>
            <div className="flex flex-col items-center gap-8">
              <button className="px-24 py-10 bg-slate-900 text-white rounded-full font-black text-5xl shadow-[0_40px_100px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform flex items-center gap-6">
                Go Pro Now <ArrowRight size={56} strokeWidth={3} />
              </button>
              <div className="flex items-center gap-6 text-3xl font-bold text-slate-400 uppercase tracking-[0.4em]">
                <Star className="fill-amber-400 text-amber-400" size={40} /> 5/5 Educator Rating
              </div>
            </div>
          </div>
      </div>

      {/* --- MOTION KEYFRAME ENGINE --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Sequence Timing Control: 18s Loop */

        @keyframes cinematicHook {
          0%, 3% { opacity: 0; transform: scale(1.1) translateY(40px); filter: blur(20px); }
          6%, 22% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
          25%, 100% { opacity: 0; transform: scale(0.9) translateY(-100px); filter: blur(20px); }
        }

        @keyframes appContainer {
          0%, 25% { opacity: 0; transform: translateY(500px) scale(0.8) rotateX(15deg); }
          30%, 88% { opacity: 1; transform: translateY(0) scale(1) rotateX(0deg); }
          92%, 100% { opacity: 0; transform: translateY(-200px) scale(1.2); }
        }

        @keyframes dashboardStage {
          0%, 38% { opacity: 1; transform: translateY(0); }
          40%, 100% { opacity: 1; transform: translateY(0); } /* Remains steady, modal pops over */
        }

        @keyframes modalStage {
          0%, 38% { opacity: 0; transform: scale(0.9) translateY(50px); pointer-events: none; }
          40%, 80% { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
          82%, 100% { opacity: 0; transform: scale(1.1) translateY(-100px); }
        }

        @keyframes resultStage {
          0%, 82% { opacity: 0; transform: translateY(100%); }
          85%, 92% { opacity: 1; transform: translateY(0); }
          95%, 100% { opacity: 0; transform: translateY(-50px); }
        }

        @keyframes mousePath {
          0%, 30% { opacity: 0; transform: translate(95vw, 95vh); }
          40% { opacity: 1; transform: translate(30vw, 55vh); } /* Click Create */
          42% { transform: translate(30vw, 55vh) scale(0.8); }
          55% { transform: translate(50vw, 65vh); } /* Click Input */
          64% { transform: translate(50vw, 65vh) scale(0.8); }
          75% { transform: translate(50vw, 85vh); } /* Click Generate */
          102% { transform: translate(50vw, 85vh) scale(0.8); }
          115% { opacity: 1; transform: translate(10vw, 10vh); }
          100% { opacity: 0; }
        }

        @keyframes poof {
          0%, 1% { transform: scale(0); opacity: 1; border: 8px solid #4f46e5; }
          6% { transform: scale(3.5); opacity: 0; border: 1px solid #4f46e5; }
          7%, 100% { transform: scale(0); opacity: 0; }
        }

        @keyframes typingSequence {
          0%, 64% { width: 0; }
          74%, 100% { width: 100%; }
        }

        @keyframes aiProgress {
          0%, 102% { width: 0; }
          112% { width: 100%; }
          100% { width: 100%; }
        }

        @keyframes genText {
          0%, 102% { opacity: 1; }
          103% { opacity: 0; }
          104%, 100% { opacity: 1; }
        }

        @keyframes buttonGlow {
          41%, 43% { opacity: 0.5; }
          63%, 65% { opacity: 0.5; }
          101%, 103% { opacity: 0.5; }
          0%, 100% { opacity: 0; }
        }

        @keyframes ctaScene {
          0%, 93% { opacity: 0; transform: scale(0.9); }
          95%, 99% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; }
        }

        @keyframes controlPop {
          0%, 85% { opacity: 0; transform: translateX(50px); }
          88%, 95% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default UltimateAdEngine;
