import React from 'react'
import { cn } from '../../utils/cn'

export interface AyuSectionProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  badge?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  headerClassName?: string
}

export const AyuSection: React.FC<AyuSectionProps> = ({
  title,
  subtitle,
  badge,
  action,
  children,
  className,
  headerClassName,
}) => {
  return (
    <section className={cn('mb-8 sm:mb-10', className)}>
      {(title || subtitle || action) && (
        <div className={cn('flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-5', headerClassName)}>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              {typeof title === 'string' ? (
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {title}
                </h2>
              ) : (
                title
              )}
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0 flex items-center gap-2 mt-2 sm:mt-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  )
}
