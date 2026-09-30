import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
  actions?: React.ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  breadcrumbs,
  actions,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8', className)}
    >
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="opacity-50">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h1>
          {badge && <div className="inline-flex items-center">{badge}</div>}
        </div>

        {subtitle && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
