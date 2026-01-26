import Link from 'next/link'
import { Check } from 'lucide-react'
import NavHeader from '@/components/NavHeader'
import Footer from '../components/Footer'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For individual teachers testing Draft',
    features: [
      'Limited AI generations',
      'Basic worksheets & quizzes',
      'Save up to 10 documents',
    ],
  },
  {
    name: 'Pro',
    price: '$19 / month',
    description: 'For serious teachers',
    features: [
      'Unlimited AI generations',
      'All content types',
      'Standards-aligned outputs',
      'Export to PDF',
    ],
    highlighted: true,
  },
  {
    name: 'School',
    price: 'Custom',
    description: 'For schools & teams',
    features: [
      'Shared library',
      'Admin dashboard',
      'Usage analytics',
      'Priority support',
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <NavHeader currentPage="pricing" />

      {/* Content */}
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up-1">
          <h1 className="text-4xl font-bold text-slate-900 text-center mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-center text-slate-600 mb-12">
            No contracts. Cancel anytime.
          </p>

          <div className="grid md:grid-cols-3 gap-8 animate-fade-in-up-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border bg-white p-8 ${
                  plan.highlighted
                    ? 'border-indigo-600 shadow-xl scale-[1.03]'
                    : 'border-slate-200'
                }`}
              >
                <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                <p className="text-3xl font-bold mb-4">{plan.price}</p>
                <p className="text-slate-600 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-indigo-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className="block text-center w-full py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  )
  }