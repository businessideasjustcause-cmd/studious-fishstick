import Link from 'next/link'
import NavHeader from '../components/NavHeader'
import {
  FileText,
  Clock,
  Download,
  CheckCircle,
  Users,
  BarChart2,
} from 'lucide-react'

export default function Landing() {
  return (
    <div className="bg-slate-50 font-sans min-h-screen">
      {/* Top Header */}
      <NavHeader currentPage="home" />

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid md:grid-cols-2 gap-12 items-center animate-fade-in-up-1">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Create Classroom Materials in Seconds
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Draft uses AI to generate curriculum-aligned worksheets, quizzes, and lessons — so teachers stop wasting nights planning.
            </p>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-8 py-3 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
              >
                Start Free
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border border-slate-300 rounded font-semibold hover:bg-slate-50"
              >
                Sign In
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">Built for K-12 educators</p>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
              alt="Teacher classroom"
              className="rounded-xl shadow-lg w-full object-cover aspect-[4/3]"
            />
            <div className="absolute -bottom-4 -left-4 bg-white border border-slate-200 rounded-lg shadow p-4 flex gap-3">
              <CheckCircle className="text-emerald-600 w-6 h-6" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Standards Aligned</p>
                <p className="text-xs text-slate-500">Common Core & beyond</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white border-y border-slate-200 py-20 animate-fade-in-up-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                Everything Teachers Need
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Classroom-ready materials, generated instantly.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <Feature icon={FileText} title="Standards Aligned" text="Automatically aligned worksheets and quizzes." />
              <Feature icon={Clock} title="Save Time" text="Hours of prep reduced to seconds." />
              <Feature icon={Download} title="Export Anywhere" text="PDF, print, or Google Docs." />
              <Feature icon={CheckCircle} title="Answer Keys" text="Every material includes solutions." />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-indigo-50 py-20 animate-fade-in-up-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 text-center gap-6">
            <Stat icon={Users} value="5,000+" label="Teachers" />
            <Stat icon={BarChart2} value="20,000+" label="Materials Created" />
            <Stat icon={Clock} value="100+ hrs" label="Saved Weekly" />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-indigo-600 py-20 text-center animate-fade-in-up-4">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Stop Planning. Start Teaching.
          </h2>
          <p className="text-indigo-100 mb-8">
            Draft gives teachers their time back.
          </p>
          <Link
            href="/login"
            className="px-10 py-3 bg-white text-indigo-600 rounded font-semibold hover:bg-slate-100"
          >
            Get Started
          </Link>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-8 animate-fade-in-up-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between">
            <span className="font-semibold text-slate-900">Draft</span>
            <span className="text-sm text-slate-500">Built for educators</span>
          </div>
        </footer>
      </main>
    </div>
  )
}

/* ================= COMPONENTS ================= */

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition">
      <Icon className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  )
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div>
      <Icon className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  )
}