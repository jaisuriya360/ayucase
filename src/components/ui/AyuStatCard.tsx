import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface AyuStatCardProps {
  label: string
  value: React.ReactNode
  unit?: string
  subtext?: string
  icon?: React.ReactNode
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    value: string
    isPositive?: boolean
  }
  status?: 'normal' | 'attention' | 'warning' | 'neutral'
  className?: string
  onClick?: () => void
}

export const AyuStatCard: React.FC<AyuStatCardProps> = ({
  label,
  value,
  unit,
  subtext,
  icon,
  trend,
  status = 'normal',
  className,
  onClick,
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'attention':
        return 'border-amber-200/80 bg-amber-50/30 dark:bg-amber-950/15 dark:border-amber-900/40'
      case 'warning':
        return 'border-rose-200/80 bg-rose-50/30 dark:bg-rose-950/15 dark:border-rose-900/40'
      case 'normal':
      default:
        return 'border-slate-200/80 bg-white dark:bg-[#0b1428] dark:border-slate-800/80'
    }
  }

  const getIconWrapperStyles = () => {
    switch (status) {
      case 'attention':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
      case 'warning':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
      case 'normal':
      default:
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        'rounded-2xl border p-5 sm:p-6 transition-all duration-200 shadow-xs',
        getStatusStyles(),
        onClick && 'cursor-pointer hover:shadow-md hover:border-emerald-500/40',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 tracking-tight">
          {label}
        </p>
        {icon && (
          <div className={cn('p-2.5 rounded-xl shrink-0 flex items-center justify-center', getIconWrapperStyles())}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5 flex-wrap">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
          {trend && (
            <span
              className={cn(
                'font-medium inline-flex items-center gap-0.5',
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
              )}
            >
              {trend.value}
            </span>
          )}
          {subtext && <span>{subtext}</span>}
        </div>
      )}
    </motion.div>
  )
}
