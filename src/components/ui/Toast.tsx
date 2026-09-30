import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import type { ToastItem } from '../../types/ui'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

export const ToastItemView: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-cyan-500 shrink-0" />
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-l-4 border-l-emerald-500'
      case 'error':
        return 'border-l-4 border-l-rose-500'
      case 'warning':
        return 'border-l-4 border-l-amber-500'
      case 'info':
      default:
        return 'border-l-4 border-l-cyan-500'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md pointer-events-auto',
        'glass-card-elevated bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80',
        getBorderColor()
      )}
    >
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{toast.title}</h4>
        {toast.message && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotifications()

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItemView key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
