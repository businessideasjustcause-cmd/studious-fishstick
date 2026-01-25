import Link from 'next/link'
import Image from 'next/image'

export default function NavHeader({ currentPage = 'home' }) {
  const navItems = [
    { href: '/schools', label: 'For Schools', id: 'schools' },
    { href: '/districts', label: 'For Districts', id: 'districts' },
    { href: '/pricing', label: 'Pricing', id: 'pricing' },
  ]

  const getCtaButton = () => {
    switch (currentPage) {
      case 'schools':
        return { href: '/pricing', label: 'View Pricing' }
      case 'districts':
        return { href: '/contact', label: 'Contact Sales' }
      case 'pricing':
        return { href: '/login', label: 'Get Started' }
      default:
        return { href: '/login', label: 'Get Started' }
    }
  }

  const cta = getCtaButton()

  return (
    <header className="bg-white border-b border-slate-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Tutor.svg" alt="Draft" width={28} height={28} />
          <span className="text-xl font-bold text-slate-900">Draft</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={
                currentPage === item.id
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <Link
          href={cta.href}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
        >
          {cta.label}
        </Link>
      </div>
    </header>
  )
}