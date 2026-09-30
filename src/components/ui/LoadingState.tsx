import React from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface LoadingStateProps {
  message?: string
  subMessage?: string
  fullScreen?: boolean
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Synthesizing clinical data...',
  subMessage = 'Connecting to secure local state',
  fullScreen = false,
  className,
}) => {
  const content = (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="relative mb-5">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl"
        />
        <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">{message}</h3>
      {subMessage && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">{subMessage}</p>
      )}

      {/* Shimmer bar */}
      <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-4 overflow-hidden relative">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1/2 h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
        />
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center w-full">
        {content}
      </div>
    )
  }

  return content
}
