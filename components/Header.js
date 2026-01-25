// components/Header.tsx
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Tutor.svg" alt="Draft" width={32} height={32} />
          <span className="text-2xl font-bold text-slate-900">Draft</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="/schools" className="font-medium text-slate-600 hover:text-indigo-600 transition">
            For Schools
          </Link>
          <Link href="/districts" className="font-medium text-slate-600 hover:text-indigo-600 transition">
            For Districts
          </Link>
          <Link href="/pricing" className="font-medium text-slate-600 hover:text-indigo-600 transition">
            Pricing
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-50">
            Log In
          </Link>
          <Link href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}