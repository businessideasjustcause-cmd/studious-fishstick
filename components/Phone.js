import { Smartphone, CheckCircle, Sparkles, Zap, Shield } from 'lucide-react'

export default function Phone() {
  return (
    <div className="relative h-[600px] flex items-center justify-center group [perspective:2000px]">
      {/* Hyper-realistic Ambient Glow */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-200/30 blur-[120px] rounded-full group-hover:bg-indigo-300/40 transition-all duration-1000" />
      
      {/* 3D Device Frame with Metallic Sheen */}
      <div className="relative w-[310px] h-[630px] bg-slate-900 rounded-[3.5rem] p-[10px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] rotate-[-8deg] group-hover:rotate-0 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-visible">
        
        {/* Inner Border (Metallic Edge) */}
        <div className="absolute inset-0 rounded-[3.5rem] border-[1px] border-white/10 pointer-events-none" />

        {/* Screen Container */}
        <div className="relative h-full w-full bg-white rounded-[2.8rem] overflow-hidden shadow-inner">
          
          {/* Glass Glare Effect */}
          <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-tr from-white/20 to-transparent z-20 pointer-events-none" />

          {/* Dynamic Island */}
          <div className="absolute top-0 w-full h-10 flex justify-center items-center z-30">
            <div className="w-28 h-7 bg-slate-900 rounded-full flex items-center justify-end px-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="p-6 pt-16 h-full bg-slate-50 space-y-6">
            {/* App Header Tag */}
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-indigo-600 rounded-full text-[8px] font-black text-white uppercase tracking-widest">
                AI Active
              </div>
            </div>

            {/* Main Action Card */}
            <div className="bg-white p-5 rounded-3xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                   <Sparkles className="text-indigo-600" size={20} />
                </div>
                <div className="space-y-1.5">
                  <div className="w-20 h-2 bg-slate-200 rounded-full" />
                  <div className="w-12 h-2 bg-slate-100 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-2 bg-slate-50 rounded-full" />
                <div className="w-full h-2 bg-slate-50 rounded-full" />
                <div className="w-2/3 h-2 bg-slate-50 rounded-full" />
              </div>
            </div>

            {/* Grid UI Elements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="h-28 bg-white rounded-[2rem] border border-slate-100 p-4 flex flex-col justify-between">
                <Zap size={16} className="text-amber-400 fill-amber-400" />
                <div className="w-full h-2 bg-slate-100 rounded-full" />
              </div>
              <div className="h-28 bg-slate-900 rounded-[2rem] p-4 flex flex-col justify-between">
                <Shield size={16} className="text-indigo-400" />
                <div className="w-10 h-2 bg-slate-700 rounded-full" />
              </div>
            </div>

            {/* Neural Button */}
            <div className="absolute bottom-8 left-6 right-6 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-lg shadow-indigo-100">
              Generate Draft
            </div>
          </div>
        </div>

        {/* Floating External Notification (Breaks the frame for depth) */}
        <div className="absolute -right-16 top-1/4 bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-4 animate-bounce-slow z-40">
          <div className="bg-emerald-100 p-2 rounded-xl flex items-center justify-center shadow-inner">
            <CheckCircle className="text-emerald-600 w-6 h-6" />
          </div>
          <div className="pr-4">
            <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Verified</p>
            <p className="text-[10px] text-slate-500 font-bold">Standard Aligned</p>
          </div>
        </div>
      </div>
    </div>
  )
}
