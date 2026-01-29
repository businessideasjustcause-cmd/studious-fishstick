'use client'

import { useState } from 'react'
import { CheckCircle, Sparkles, Zap, Shield, Fingerprint, ChevronRight } from 'lucide-react'

export default function Phone() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    setIsHovered(true)
    const rect = e.currentTarget.getBoundingClientRect()
    // Calculate rotation based on mouse position relative to center
    const x = (e.clientY - rect.top) / rect.height - 0.5
    const y = (e.clientX - rect.left) / rect.width - 0.5
    setRotate({ x: x * -55, y: y * 55 })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div 
      className="relative h-[700px] flex items-center justify-center [perspective:2000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Ambient Glow */}
      <div 
        className={`absolute w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full transition-all duration-1000 ${isHovered ? 'opacity-100 scale-110' : 'opacity-40 scale-100'}`}
      />
      
      {/* Main Device Frame */}
      <div 
        className="relative w-[320px] h-[650px] bg-slate-950 rounded-[4rem] p-[12px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border border-white/5"
        style={{ 
          // Default: -25deg rotation. Hover: Dynamic 3D rotation.
          transform: isHovered 
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.05)` 
            : `rotateY(-25deg) rotateX(5deg) scale(0.95)`,
          transformStyle: 'preserve-3d'
        }}
      >
        
        {/* Inner Screen */}
        <div className="relative h-full w-full bg-slate-50 rounded-[3.2rem] overflow-hidden shadow-inner group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#e0e7ff_0%,transparent_50%)] opacity-50" />

          {/* Dynamic Island */}
          <div className="absolute top-0 w-full h-12 flex justify-center items-center z-50">
            <div className={`h-7 bg-slate-950 rounded-full flex items-center justify-between px-4 transition-all duration-500 ${isHovered ? 'w-40' : 'w-28'}`}>
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-[7px] font-black text-white/40 uppercase tracking-widest">Neural v2</div>
            </div>
          </div>

          {/* App Content */}
          <div className="p-6 pt-20 h-full flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                 <img src="/Tutor.svg" size={1} className="text-indigo-600" />
              </div>
              <div className="h-2 w-12 bg-slate-200 rounded-full" />
            </div>

            {/* Smart Card */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-600 rounded-xl">
                   <Sparkles className="text-white" size={16} />
                </div>
                <div className="font-black text-[9px] text-slate-900 uppercase tracking-widest">Drafting...</div>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 w-full bg-slate-100 rounded-full animate-pulse" />
                <div className="h-1.5 w-4/5 bg-slate-100 rounded-full animate-pulse delay-75" />
              </div>
            </div>

            {/* Micro Modules */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-600 p-5 rounded-[2rem] text-white flex flex-col justify-between h-32 shadow-lg shadow-indigo-200/50">
                <Zap size={20} className="fill-white" />
                <span className="text-[8px] font-black uppercase tracking-widest leading-tight">Guided<br/>Mode</span>
              </div>
              <div className="bg-white border border-slate-100 p-5 rounded-[2rem] flex flex-col justify-between h-32">
                <Shield size={20} className="text-indigo-600" />
                <div className="h-1 w-8 bg-slate-100 rounded-full" />
              </div>
            </div>

            {/* CTA */}
            <div className="mt-auto h-14 bg-slate-900 rounded-[2rem] flex items-center justify-center gap-3 text-white text-[9px] font-black uppercase tracking-[0.25em] transition-all hover:bg-indigo-600 shadow-xl shadow-slate-200">
              Generate <ChevronRight size={12} />
            </div>
          </div>
        </div>

        {/* Floating Notification */}
        <div 
          className="absolute -right-20 top-1/3 bg-white/90 backdrop-blur-2xl border border-white p-5 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] flex items-center gap-4 animate-float-slow transition-all duration-700"
          style={{ 
            transform: isHovered 
              ? `translateZ(60px) rotateY(${rotate.y * -0.5}deg)` 
              : `translateZ(20px) rotateY(15deg)`,
          }}
        >
          <div className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
            <CheckCircle className="text-white" size={24} />
          </div>
          <div className="pr-6">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Aligned</h4>
            <p className="text-[9px] text-slate-400 font-bold">NGSS</p>
             <p className="text-[9px] text-slate-400 font-bold">Common Core</p>
          </div>
        </div>
      </div>
    </div>
  )
}
