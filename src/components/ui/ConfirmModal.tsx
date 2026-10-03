import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { AyuButton } from './AyuButton'
import { cn } from '../../utils/cn'

export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      case 'info':
        return <Info className="w-5 h-5 text-teal-600 dark:text-teal-400" />
      case 'danger':
      default:
        return <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
    }
  }

  const getIconContainerStyle = () => {
    switch (variant) {
      case 'warning':
        return 'bg-amber-100 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
      case 'info':
        return 'bg-teal-100 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800'
      case 'danger':
      default:
        return 'bg-rose-100 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Dialog Card */}
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-desc"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative w-full max-w-md z-10 rounded-2xl p-6',
              'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl'
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={cn('p-2.5 rounded-xl border shrink-0', getIconContainerStyle())}>
                  {getIcon()}
                </div>
                <div>
                  <h3
                    id="confirm-modal-title"
                    className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100"
                  >
                    {title}
                  </h3>
                  <p
                    id="confirm-modal-desc"
                    className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed"
                  >
                    {description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <AyuButton variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
                {cancelText}
              </AyuButton>
              <AyuButton
                variant={variant === 'danger' ? 'destructive' : 'primary'}
                size="md"
                onClick={onConfirm}
                isLoading={isLoading}
              >
                {confirmText}
              </AyuButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
