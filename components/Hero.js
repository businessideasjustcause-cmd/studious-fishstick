// components/Hero.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero({ title, description, ctaPrimary, ctaSecondary, image, badge }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-5xl font-bold text-slate-900 mb-6">{title}</h1>
        <p className="text-lg text-slate-600 mb-8">{description}</p>

        <div className="flex gap-4">
          {ctaPrimary && (
            <Link href={ctaPrimary.href} className="px-8 py-3 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 flex items-center gap-2">
              {ctaPrimary.label} {ctaPrimary.icon && <ctaPrimary.icon className="w-4 h-4" />}
            </Link>
          )}
          {ctaSecondary && (
            <Link href={ctaSecondary.href} className="px-8 py-3 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50">
              {ctaSecondary.label}
            </Link>
          )}
        </div>
      </div>

      <div className="relative">
        <img src={image.src} alt={image.alt} className="rounded-xl shadow-lg w-full object-cover aspect-[4/3]" />
        {badge && (
          <div className="absolute -bottom-4 -left-4 bg-white border border-slate-200 rounded-lg shadow p-4 flex gap-3">
            <badge.icon className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">{badge.title}</p>
              <p className="text-xs text-slate-500">{badge.subtitle}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}