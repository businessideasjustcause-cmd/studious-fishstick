import Layout from '../components/Layout'
import NavHeader from '../components/NavHeader'
import Footer from '../components/Footer'
import { Gavel, ShieldAlert, FileText, Scale } from 'lucide-react'

export default function TermsPage({ session, loading }) {
  
  // Shared Terms Content Component
  const content = (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-16">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
          Terms of <span className="text-indigo-600">Service.</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed">
          These terms govern the use of the DraftStudio workspace and the intellectual property rights associated with AI-generated educational materials.
        </p>
        <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Last Updated: January 28, 2026
        </p>
      </div>

      <div className="space-y-12">
        {/* IP Section */}
        <section className="p-8 md:p-12 bg-slate-900 rounded-[3rem] text-white">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="text-indigo-400" />
            <h2 className="text-2xl font-black">Ownership & IP</h2>
          </div>
          <p className="text-slate-300 leading-relaxed font-medium">
            Users retain full ownership of all prompts and curriculum data uploaded. DraftStudio assigns all rights to the generated AI output to the user for instructional use.
          </p>
        </section>

        {/* Acceptable Use */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
             Acceptable Use
          </h2>
          <div className="grid gap-4">
            <div className="p-6 border border-slate-100 rounded-[2rem] bg-white shadow-sm flex items-start gap-4">
              <ShieldAlert className="text-amber-500 shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-black text-slate-900 mb-1">Academic Integrity</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  DraftStudio is an instructional aid for educators. Use of this service to circumvent school-specific academic integrity policies is strictly prohibited.
                </p>
              </div>
            </div>
            

            
            <div className="p-6 border border-slate-100 rounded-[2rem] bg-white shadow-sm flex items-start gap-4">
              <FileText className="text-indigo-600 shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-black text-slate-900 mb-1">AI Accuracy</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  AI-generated content may contain inaccuracies. Educators are responsible for reviewing and verifying all materials before classroom distribution.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  // --- LOGGED OUT VIEW ---
  if (!session) {
    return (
      <div className="bg-[#FDFDFD] min-h-screen">
        <NavHeader session={null} currentPage="terms" />
        <main className="pt-20">{content}</main>
        <Footer />
      </div>
    )
  }

  // --- LOGGED IN VIEW ---
  // Renders within the Layout (Sidebar) container
  // NavHeader is omitted to prevent the "double header" look
  return (
    <Layout session={session} loading={loading}>
      <main className="py-10">{content}</main>
    </Layout>
  )
}
