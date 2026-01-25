import Link from 'next/link'
import {
  Users,
  ShieldCheck,
  BarChart3,
  FolderLock,
  ArrowRight,
} from 'lucide-react'
import NavHeader from '../components/NavHeader'

export default function SchoolsPage() {
  return (
    <div className="bg-slate-50 min-h-screen animate-fade-in-up">
      <NavHeader currentPage="schools" />

      <main className="pt-24">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Draft for Schools
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Give your teachers powerful AI tools while maintaining
              consistency, oversight, and control.
            </p>
            <div className="flex gap-4">
              <Link
                href="/pricing"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2"
              >
                Get School Access <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
              >
                Back to Home
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">Safe & Controlled AI</p>
                  <p className="text-sm text-slate-600">
                    No prompt misuse. No student access. Teacher-only generation.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FolderLock className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">Shared School Library</p>
                  <p className="text-sm text-slate-600">
                    Reuse approved materials across grade levels and subjects.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <BarChart3 className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">Usage & Insights</p>
                  <p className="text-sm text-slate-600">
                    See adoption, usage, and material creation across staff.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white border-t border-slate-200 py-20 animate-fade-in-up-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-center text-slate-900 mb-12">
              Built for School-Wide Use
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <Users className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  Teacher Accounts
                </h3>
                <p className="text-sm text-slate-600">
                  Unlimited teachers under one school license.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <ShieldCheck className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  Admin Control
                </h3>
                <p className="text-sm text-slate-600">
                  Control access, view usage, and manage content standards.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <FolderLock className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  Standards Alignment
                </h3>
                <p className="text-sm text-slate-600">
                  Ensure all materials align to approved curriculum standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-indigo-600 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Bring Draft to Your School
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Empower teachers while keeping administrators in control.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-slate-100"
          >
            See School Pricing <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-6 flex justify-between text-sm text-slate-500">
            <span>Draft</span>
            <span>Built for educators</span>
          </div>
        </footer>
      </main>
    </div>
  )
}