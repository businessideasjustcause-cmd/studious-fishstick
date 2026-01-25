// components/Card.tsx
export default function Card({ icon: Icon, title, text, highlighted }) {
  return (
    <div className={`rounded-xl border p-6 text-center transition hover:shadow-lg ${highlighted ? 'border-indigo-600 shadow-xl scale-[1.03]' : 'border-slate-200'}`}>
      <Icon className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  )
}