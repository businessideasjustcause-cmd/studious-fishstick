export default function Footer() {
  return (
    <footer className="border-t border-slate-100 py-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="font-bold text-2xl tracking-tighter text-slate-900">Draft Studio.</span>
        <div className="flex gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-indigo-600">Privacy</a>
          <a href="#" className="hover:text-indigo-600">Terms</a>
          <a href="contact" className="hover:text-indigo-600">Contact</a>
        </div>
        <span className="text-sm text-slate-400">© 2026 Draft Labs LLC.</span>
      </div>
    </footer>
  )
}
