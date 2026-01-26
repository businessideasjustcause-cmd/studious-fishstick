import Layout from '../components/Layout'
import NavHeader from '../components/NavHeader'
import Footer from '../components/Footer'
import { Shield, Lock, EyeOff, Scale, Mail, FileCheck } from 'lucide-react'

export default function PrivacyPage({ session, loading }) {
  const sections = [
    { id: 'ai', title: 'AI & Training', icon: <Shield size={18} /> },
    { id: 'compliance', title: 'Compliance Framework', icon: <FileCheck size={18} /> },
  ]

  // Content shared between both views
  const content = (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-16">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
          Privacy & <span className="text-indigo-600">Trust.</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed">
          DraftStudio is designed to support educator workflows while maintaining strict data alignment with school district requirements.
        </p>
        <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Last Updated: January 26, 2026
        </p>
      </div>

      <div className="space-y-12">
        <section className="p-8 md:p-12 bg-slate-900 rounded-[3rem] text-white">
          <h2 className="text-2xl font-black mb-4">AI Data Integrity</h2>
          <p className="text-slate-300 leading-relaxed">
            We do not use educator-generated content or school prompts to train our global models. 
            Data is processed in a private context for your specific workspace.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900">Regulatory Alignment</h2>
          <div className="grid gap-4">
            <div className="p-6 border border-slate-100 rounded-[2rem] bg-white shadow-sm">
              <h4 className="font-black text-slate-900 mb-1">FERPA Alignment</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                DraftStudio operates as a "School Official" under 34 CFR § 99.31(a)(1) for the purpose of handling instructional materials.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  // If NOT logged in: Render clean page with top header
  if (!session) {
    return (
      <div className="bg-[#FDFDFD] min-h-screen">
        <NavHeader session={null} currentPage="privacy" />
        <main className="pt-20">{content}</main>
        <Footer />
      </div>
    )
  }

  // If logged in: Render inside Layout (Sidebar) but NO NavHeader
  // because the Sidebar usually handles navigation for logged-in users.
  return (
    <Layout session={session} loading={loading}>
      <main className="py-10">{content}</main>
    </Layout>
  )
}
