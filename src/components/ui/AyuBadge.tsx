import React from 'react'
import { cn } from '../../utils/cn'

export interface AyuBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'teal' | 'cyan' | 'amber' | 'rose' | 'indigo' | 'slate' | 'default'
  size?: 'sm' | 'md'
  dot?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const AyuBadge: React.FC<AyuBadgeProps> = ({
  variant = 'emerald',
  size = 'md',
  dot = false,
  icon,
  children,
  className,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
      case 'teal':
        return 'bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60'
      case 'cyan':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200/80 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800/60'
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
      case 'indigo':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60'
      case 'slate':
      case 'default':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60'
    }
  }

  const getDotStyles = () => {
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-500'
      case 'teal':
        return 'bg-teal-500'
      case 'cyan':
        return 'bg-cyan-500'
      case 'amber':
        return 'bg-amber-500'
      case 'rose':
        return 'bg-rose-500'
      case 'indigo':
        return 'bg-indigo-500'
      default:
        return 'bg-slate-400'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-[11px] px-2 py-0.5 gap-1.5 rounded-md'
      case 'md':
      default:
        return 'text-xs px-2.5 py-1 gap-1.5 rounded-lg'
    }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border shrink-0 select-none tracking-tight',
        getVariantStyles(),
        getSizeStyles(),
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', getDotStyles())} aria-hidden="true" />}
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  )
}
