import { useState, useEffect } from 'react';
import { FileDown, X, FileText, Download, Sparkles, ChevronRight, Mail, Share2 } from 'lucide-react';

export default function ExportPopup({ onExport }) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when modal is active to prevent "underneath" movement
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-6 py-2.5 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all duration-300 font-bold text-sm shadow-xl active:scale-95"
      >
        <FileDown className="w-4 h-4" />
        Export Material
      </button>

      {/* Full-Screen Pop-up */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          
          {/* Backdrop: Glass-morphism blur */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => setIsOpen(false)} 
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            
            {/* Header Area */}
            <div className="p-8 pb-4 flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Export Material</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">Select your preferred delivery format</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all active:scale-90"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Options List */}
            <div className="p-6 space-y-3">
              <div className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Portable Documents</div>
              
              {/* Option: Questions Only */}
              <button 
                onClick={() => { onExport(false); setIsOpen(false); }}
                className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100/50 rounded-[2rem] transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                    <FileText size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-base font-black text-slate-900">PDF: Questions Only</p>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Clean classroom handout</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </button>

              {/* Option: With Answer Key */}
              <button 
                onClick={() => { onExport(true); setIsOpen(false); }}
                className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-emerald-100 hover:shadow-2xl hover:shadow-emerald-100/50 rounded-[2rem] transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-200">
                    <Sparkles size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-base font-black text-slate-900">PDF: Full Resource</p>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Includes Teacher Answer Key</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
              </button>

              <div className="h-px bg-slate-100 my-6 mx-4" />

              <div className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Cloud Integrations</div>
              
              {/* Coming Soon Placeholder */}
              <div className="flex items-center gap-5 p-5 opacity-40 grayscale pointer-events-none">
                <div className="p-4 bg-slate-200 rounded-2xl">
                  <Download size={24} className="text-slate-400" />
                </div>
                <div className="text-left">
                  <p className="text-base font-black text-slate-400 italic tracking-tight">Google Docs Sync</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Engine v2.5 required</p>
                </div>
              </div>
            </div>

            {/* Footer Status */}
            <div className="p-8 pt-2 bg-slate-50/80 border-t border-slate-100 mt-4 flex justify-center">
               <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Export Core Active</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
