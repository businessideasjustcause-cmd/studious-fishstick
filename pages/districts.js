import Link from 'next/link'
import {
  Building2,
  ShieldCheck,
  BarChart3,
  Users,
  ArrowRight,
  ClipboardCheck,
  Lock
} from 'lucide-react'
import NavHeader from '../components/NavHeader'
import Footer from '../components/Footer'

export default function DistrictsPage() {
  return (
    <div className="bg-slate-50 min-h-screen animate-fade-in-up">
      <NavHeader currentPage="districts" />

      <main className="pt-24">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in-up-1">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-slate-900 mb-6">
              District-Wide Curriculum Creation, Done Right
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Draft helps districts standardize instructional materials,
              reduce teacher workload, and maintain curriculum alignment —
              without sacrificing oversight or safety.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2"
              >
                Request a Demo <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-white border-t border-slate-200 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-slate-900 mb-12 text-center">
              Built for District Oversight
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="border border-slate-200 rounded-xl p-6">
                <ShieldCheck className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  Governance & Control
                </h3>
                <p className="text-sm text-slate-600">
                  District-level admin dashboards, role-based permissions,
                  and full visibility into usage.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-6">
                <ClipboardCheck className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  Curriculum Alignment
                </h3>
                <p className="text-sm text-slate-600">
                  Ensure all generated materials align with district-approved
                  standards and frameworks.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-6">
                <Lock className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  Security & Privacy
                </h3>
                <p className="text-sm text-slate-600">
                  No student data. No model training on district content.
                  Enterprise-grade security practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics / Outcomes */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
            <div>
              <BarChart3 className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-slate-900">↓ 60%</p>
              <p className="text-sm text-slate-600">
                Time spent creating materials
              </p>
            </div>
            <div>
              <Users className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-sm text-slate-600">
                Teacher adoption support
              </p>
            </div>
            <div>
              <Building2 className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-slate-900">1 Platform</p>
              <p className="text-sm text-slate-600">
                Across all schools
              </p>
            </div>
            <div>
              <ShieldCheck className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-slate-900">Zero</p>
              <p className="text-sm text-slate-600">
                Student data exposure
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-indigo-600 py-20 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Let’s Talk About Your District
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Schedule a walkthrough and see how Draft fits into your
            instructional strategy.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-slate-100"
          >
            Contact Sales <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      <Footer />
    </main>
  </div>
)
}