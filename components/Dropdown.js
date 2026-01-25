import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select option',
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-2 border border-slate-300 rounded-lg bg-white hover:border-slate-400"
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400'}>
          {value
            ? options.find(o => o.value === value)?.label
            : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}