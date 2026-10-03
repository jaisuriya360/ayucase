import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface AyuCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'interactive' | 'highlight' | 'warning' | 'danger' | 'elder' | 'glass' | 'solid' | 'accent' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export const AyuCard: React.FC<AyuCardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'interactive':
        return cn(
          'bg-white dark:bg-[#0b1428] border border-slate-200/90 dark:border-slate-800/80',
          'hover:border-emerald-500/40 dark:hover:border-teal-500/40',
          'shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.995]',
          'transition-all duration-200 cursor-pointer'
        )
      case 'highlight':
        return cn(
          'bg-emerald-50/60 dark:bg-emerald-950/20',
          'border border-emerald-200 dark:border-emerald-800/50',
          'shadow-xs'
        )
      case 'warning':
        return cn(
          'bg-amber-50/60 dark:bg-amber-950/20',
          'border border-amber-200 dark:border-amber-800/50',
          'shadow-xs'
        )
      case 'danger':
        return cn(
          'bg-rose-50/60 dark:bg-rose-950/20',
          'border border-rose-200 dark:border-rose-800/50',
          'shadow-xs'
        )
      case 'glass':
        return 'ayu-card-glass'
      case 'elevated':
        return cn(
          'bg-white dark:bg-[#0c162e] border border-slate-200 dark:border-slate-800',
          'shadow-lg dark:shadow-2xl'
        )
      case 'accent':
        return cn(
          'bg-white dark:bg-[#0b1428] border border-slate-200/90 dark:border-slate-800/80',
          'border-l-4 border-l-emerald-600 dark:border-l-teal-500 shadow-xs'
        )
      case 'elder':
        return cn(
          'bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-200 shadow-md'
        )
      case 'solid':
      case 'default':
      default:
        return cn(
          'bg-white dark:bg-[#0b1428] border border-slate-200/80 dark:border-slate-800/70',
          'shadow-xs'
        )
    }
  }

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return 'p-0'
      case 'sm':
        return 'p-4'
      case 'lg':
        return 'p-6 sm:p-8'
      case 'md':
      default:
        return 'p-5 sm:p-6'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-2xl relative overflow-hidden',
        getVariantStyles(),
        getPaddingStyles(),
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const AyuCardHeader: React.FC<{
  title?: React.ReactNode
  subtitle?: React.ReactNode
  badge?: React.ReactNode
  action?: React.ReactNode
  className?: string
  children?: React.ReactNode
}> = ({ title, subtitle, badge, action, className, children }) => {
  return (
    <div className={cn('flex items-start justify-between gap-3 mb-4', className)}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          {typeof title === 'string' ? (
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </h3>
          ) : (
            title
          )}
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      {children}
    </div>
  )
}

export const AyuCardContent: React.FC<{
  className?: string
  children: React.ReactNode
}> = ({ className, children }) => {
  return <div className={cn('text-sm text-slate-700 dark:text-slate-300', className)}>{children}</div>
}

export const AyuCardFooter: React.FC<{
  className?: string
  children: React.ReactNode
}> = ({ className, children }) => {
  return (
    <div className={cn('mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 flex-wrap', className)}>
      {children}
    </div>
  )
}

// Compatibility export
export { AyuCard as GlassCard }
