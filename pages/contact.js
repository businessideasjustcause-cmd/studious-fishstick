import { useState } from 'react'
import NavHeader from '../components/NavHeader'
import { Mail, ArrowRight, Building2, MessageSquare, Sparkles } from 'lucide-react'
import Dropdown from '../components/Dropdown'

export default function Contact() {
  const [orgType, setOrgType] = useState(null)

  return (
    <div className="bg-[#FDFDFD] min-h-screen font-sans selection:bg-indigo-100">
      <NavHeader currentPage="contact" />

      <main className="pt-32 pb-24 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-indigo-50/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Column: Value Proposition */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-[0.15em]">
                <Sparkles size={14} />
                Enterprise
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Scale DraftStudio <br />
                <span className="text-indigo-600">across your team.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">
                Empower your educators with site-wide AI drafting, shared prompt libraries, and advanced security.
              </p>

              <div className="space-y-6 pt-4">
                {[
                  { icon: <Building2 className="text-indigo-600" />, title: 'District-Wide Licensing', desc: 'Custom volume pricing for large-scale deployments.' },
                  { icon: <MessageSquare className="text-indigo-600" />, title: 'Priority Implementation', desc: 'Direct support to help align AI with your curriculum.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-3xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
                    <div className="shrink-0 w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Refined Form */}
            <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-right-8 duration-700">
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                    <input className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 px-5 py-4 rounded-2xl transition-all outline-none font-medium placeholder:text-slate-300" placeholder="e.g. Sarah" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                    <input className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 px-5 py-4 rounded-2xl transition-all outline-none font-medium placeholder:text-slate-300" placeholder="e.g. Chen" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                  <input className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 px-5 py-4 rounded-2xl transition-all outline-none font-medium placeholder:text-slate-300" placeholder="schen@district.edu" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organization Type</label>
                  <Dropdown
                    label="Select..."
                    options={[
                      { label: 'Public School / District', value: 'school' },
                      { label: 'Charter / Private Network', value: 'charter' },
                      { label: 'Higher Education', value: 'higher_ed' },
                    ]}
                    value={orgType}
                    onChange={setOrgType}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea rows={4} className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 px-5 py-4 rounded-2xl transition-all outline-none font-medium resize-none placeholder:text-slate-300" placeholder="How many teachers are you supporting?" />
                </div>

                <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-slate-100 mt-4 group">
                  <Mail className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                  Send Inquiry
                  <ArrowRight size={18} className="opacity-50" />
                </button>
                
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">
                  Response time: &lt; 24 hours
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
