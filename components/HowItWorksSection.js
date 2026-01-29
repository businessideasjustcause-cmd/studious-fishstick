import React from 'react';
import { Sparkles, LayoutTemplate, Download, ChevronRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Set Requirements',
    description: 'Input grade levels and standards. Our engine handles the alignment automatically.',
    icon: <LayoutTemplate className="w-6 h-6 text-indigo-500" />,
    color: 'blue'
  },
  {
    number: '02',
    title: 'Review & Adapt',
    description: 'Draft Studio generates high-fidelity resources. Review, tweak, and perfect in real-time.',
    icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
    color: 'indigo'
  },
  {
    number: '03',
    title: 'Instant Export',
    description: 'Download in any format or sync directly to your LMS with a single click.',
    icon: <Download className="w-6 h-6 text-indigo-500" />,
    color: 'purple'
  },
];

const HowItWorks = () => {
  return (
    <section className="py-32 bg-[#fafafa] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[120px] -z-0" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">The Workflow</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
            How it <span className="text-indigo-600 italic">works.</span>
          </h2>
        </div>

        <div className="relative">
          {/* The Path Pathway */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full -translate-y-1/2 -z-10 pointer-events-none">
            <svg viewBox="0 0 1200 200" className="w-full fill-none overflow-visible">
              <path 
                d="M 50 100 C 250 100 350 200 600 100 C 850 0 950 100 1150 100" 
                stroke="url(#grad)" 
                strokeWidth="2" 
                strokeDasharray="10 15"
                className="animate-path-flow"
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
              <div key={i} className="group relative">
                {/* Glow Effect on Hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-0 group-hover:opacity-10 transition duration-500" />
                
                <div className="relative h-full p-10 bg-white border border-slate-200/60 rounded-[2rem] shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                  {/* Subtle Number Background */}
                  <span className="absolute -right-4 -bottom-4 text-9xl font-black text-slate-50 select-none group-hover:text-indigo-50/50 transition-colors duration-500">
                    {step.number}
                  </span>

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-8 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-500">
                      {React.cloneElement(step.icon, { 
                        className: "w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-500" 
                      })}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      {step.title}
                      <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
                    </h3>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
