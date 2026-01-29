import React from 'react';
import Link from 'next/link';
import { Sparkles, LayoutTemplate, Download, ChevronRight, ArrowUpRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Set Requirements',
    description: 'Input grade levels and standards. Our engine handles the alignment automatically.',
    icon: LayoutTemplate,
  },
  {
    number: '02',
    title: 'Review & Adapt',
    description: 'Draft Studio generates high-fidelity resources. Review, tweak, and perfect in real-time.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Instant Export',
    description: 'Download in any format or sync directly to your LMS with a single click.',
    icon: Download,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-32 bg-[#fafafa] relative overflow-hidden">
      {/* 2026 Ambient Aura */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[140px] -z-0 animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">System Architecture</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-10">
            How it <span className="text-indigo-600 italic">works.</span>
          </h2>
        </div>

        <div className="relative">
          {/* Animated Solid Pathway Rail */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full -translate-y-1/2 -z-10 pointer-events-none">
            <svg viewBox="0 0 1200 200" className="w-full fill-none overflow-visible">
              <path 
                d="M 100 100 L 1100 100" 
                stroke="#E2E8F0" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <path 
                d="M 100 100 L 1100 100" 
                stroke="url(#grad)" 
                strokeWidth="3" 
                strokeLinecap="round"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <Link 
                key={i} 
                href="/resources" 
                className="group relative block transition-all duration-500 hover:-translate-y-3"
              >
                {/* External Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur opacity-0 group-hover:opacity-15 transition-opacity duration-700" />
                
                <div className="relative h-full p-10 bg-white border border-slate-200/60 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 overflow-hidden">
                  {/* Background Step ID */}
                  <span className="absolute -right-4 -bottom-4 text-9xl font-black text-slate-50 select-none group-hover:text-indigo-50/40 transition-colors duration-700">
                    {step.number}
                  </span>

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-slate-50 flex items-center justify-center border border-slate-100 mb-10 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                      <step.icon className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors duration-500" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {step.title}
                      </h3>
                      <ArrowUpRight className="w-6 h-6 text-slate-300 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
                    </div>

                    <p className="text-slate-500 text-lg leading-relaxed font-medium">
                      {step.description}
                    </p>

                    <div className="mt-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Service Specs <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
