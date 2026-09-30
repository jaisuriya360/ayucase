import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { AnimatedButton } from './AnimatedButton'
import { cn } from '../../utils/cn'

export interface ErrorStateProps {
  title?: string
  message?: string
  errorDetails?: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Health Record',
  message = 'A temporary issue occurred while rendering the clinical data. Your local storage records are intact.',
  errorDetails,
  onRetry,
  className,
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass-card border-rose-500/30 rounded-3xl p-6 sm:p-8 bg-rose-50/40 dark:bg-rose-950/20 text-center flex flex-col items-center',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/50 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-md">{message}</p>

      {onRetry && (
        <div className="mt-5">
          <AnimatedButton
            variant="secondary"
            size="md"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={onRetry}
          >
            Retry Connection
          </AnimatedButton>
        </div>
      )}

      {errorDetails && (
        <div className="mt-4 w-full max-w-md text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mx-auto"
          >
            <span>{showDetails ? 'Hide Diagnostic Info' : 'Show Diagnostic Info'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <pre className="mt-2 p-3 bg-slate-900 text-slate-200 rounded-xl text-xs overflow-x-auto font-mono">
              {errorDetails}
            </pre>
          )}
        </div>
      )}
    </motion.div>
  )
}
