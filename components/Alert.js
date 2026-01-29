import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function Alert({ message, type = 'success', duration = 4000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      text: 'text-green-800',
      IconComponent: CheckCircle,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      text: 'text-red-800',
      IconComponent: AlertCircle,
    },
    info: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      icon: 'text-indigo-600',
      text: 'text-indigo-800',
      IconComponent: Info,
    },
  }

  const style = styles[type] || styles.info
  const IconComponent = style.IconComponent

  return (
    <div
      className={`fixed top-4 right-4 max-w-md ${style.bg} border ${style.border} rounded-lg p-4 shadow-lg animate-fade-in-up-1 flex items-start gap-3`}
    >
      <IconComponent className={`w-5 h-5 ${style.icon} flex-shrink-0 mt-0.5`} />
      <p className={`flex-1 ${style.text} text-sm font-medium`}>{message}</p>
      <button
        onClick={() => setIsVisible(false)}
        className={`${style.icon} hover:opacity-70 transition flex-shrink-0`}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}