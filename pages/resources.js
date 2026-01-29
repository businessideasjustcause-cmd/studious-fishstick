'use client'

import React, { useEffect, useState } from 'react'
import NavHeader from '../components/NavHeader'
import Footer from '../components/Footer'
import Link from 'next/link'
import { 
  Sparkles, Zap, ShieldCheck, ChevronRight, 
  Layers, ArrowUpRight, Globe, Cpu, Search, 
  FileText, BarChart3, Users2, Database, Check
} from 'lucide-react'

const products = [
  {
    title: "Neural Architect",
    tagline: "Curriculum Engineering",
    description: "Our core engine for automated instructional design. It doesn't just 'write text'—it constructs logical learning sequences based on proven pedagogical frameworks.",
    features: [
      "Automated Bloom's Taxonomy alignment for all objectives",
      "Dynamic 5E Model (Engage, Explore, Explain, Elaborate, Evaluate) generation",
      "Cross-curricular thematic linking for interdisciplinary units",
      "Universal Design for Learning (UDL) scaffolding built-in"
    ],
    icon: <Cpu className="w-6 h-6 text-indigo-600" />,
    stats: "Llama-3.1 Fine-Tuned",
    gridSpan: "lg:col-span-7",
    bg: "bg-white"
  },
  {
    title: "SyncDrive",
    tagline: "LMS Interoperability",
    description: "Enterprise-grade data bridges that eliminate manual entry and ensure your materials live where your students learn.",
    features: [
      "Native Canvas & Blackboard LTI 1.3 integration",
      "Google Classroom 'Classroom Share' API connectivity",
      "Automated file conversion (PDF, DOCX, Canvas Export)",
      "Direct-to-Drive cloud storage syncing"
    ],
    icon: <Globe className="w-6 h-6 text-emerald-600" />,
    stats: "LTI 1.3 Compliant",
    gridSpan: "lg:col-span-5",
    bg: "bg-slate-900 text-white"
  },
  {
    title: "Standards Engine",
    tagline: "Regulatory Alignment",
    description: "Real-time mapping of every resource to specific state and national requirements.",
    features: [
      "Common Core (ELA/Math) & NGSS (Science) full database",
      "State-specific standards (TEKS, CPALMS, etc.) updated weekly",
      "Gaps analysis reporting for curriculum coverage",
      "Automated standard-tagging for easy library searching"
    ],
    icon: <Database className="w-6 h-6 text-blue-600" />,
    stats: "All 50 States",
    gridSpan: "lg:col-span-5",
    bg: "bg-white"
  },
  {
    title: "Collaborate Pro",
    tagline: "Institutional Memory",
    description: "A centralized workspace for departments and districts to standardize their instructional quality.",
    features: [
      "Shared department folders with granular permissioning",
      "Peer-review workflows for curriculum approval",
      "Version control for iterative unit improvement",
      "District-wide rubric and assessment bank"
    ],
    icon: <Users2 className="w-6 h-6 text-purple-600" />,
    stats: "Multi-User Sync",
    gridSpan: "lg:col-span-7",
    bg: "bg-white"
  }
]

export default function ResourcePage() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => setIsVisible(true), []);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <NavHeader currentPage="resources" />

      <main className="relative pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* --- ACADEMIC HERO --- */}
          <div className={`mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-8">
              Instructional <br /> 
              <span className="text-indigo-600">Infrastructure.</span>
            </h1>
            <p className="max-w-3xl text-slate-600 text-xl font-medium leading-relaxed">
              DraftStudio provides the technical layer for curriculum development, 
              ensuring that every resource is [pedagogically sound](https://www.instructionaldesign.org), 
              [standard-aligned](https://www.corestandards.org), and classroom-ready.
            </p>
          </div>

          {/* --- TECHNICAL SPECS GRID --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-32">
            {products.map((product, i) => (
              <div 
                key={i} 
                className={`${product.gridSpan} ${product.bg} border border-slate-200 rounded-[2.5rem] p-10 flex flex-col justify-between transition-all duration-500 hover:shadow-xl`}
              >
                <div>
                  <div className="flex items-center justify-between mb-10">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900">
                      {product.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                      {product.stats}
                    </span>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">{product.tagline}</h3>
                    <h4 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">{product.title}</h4>
                    <p className="text-slate-600 font-medium leading-relaxed mb-8">
                      {product.description}
                    </p>
                  </div>

                  {/* FEATURE LIST: The "Serious" Detail */}
                  <ul className="space-y-4 mb-8">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                   <button className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 group">
                      Technical Documentation <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- SECURITY & COMPLIANCE FOOTER --- */}
          <div className="bg-white border border-slate-200 rounded-[3rem] p-12 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <ShieldCheck className="w-12 h-12 text-indigo-600 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Enterprise Compliance</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                We adhere to strict data privacy standards including [FERPA](https://studentprivacy.ed.gov) 
                and [COPPA](https://www.ftc.gov) 
                to ensure that student data is never used for model training.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Encryption</p>
                 <p className="text-sm font-bold text-slate-900">AES-256 Bit</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard</p>
                 <p className="text-sm font-bold text-slate-900">SOC2 Type II</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
