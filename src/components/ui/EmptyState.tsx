import React from 'react'
import { motion } from 'framer-motion'
import { FolderOpen } from 'lucide-react'
import { AnimatedButton } from './AnimatedButton'
import { cn } from '../../utils/cn'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'glass-card rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
        {icon || <FolderOpen className="w-8 h-8" />}
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-6">
          <AnimatedButton variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </AnimatedButton>
        </div>
      )}
    </motion.div>
  )
}
