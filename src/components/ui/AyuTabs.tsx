import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: React.ReactNode
}

export interface AyuTabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'pill' | 'underline'
  className?: string
}

export const AyuTabs: React.FC<AyuTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  className,
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1.5 overflow-x-auto no-scrollbar',
        variant === 'pill'
          ? 'p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800'
          : 'border-b border-slate-200 dark:border-slate-800 gap-4',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer select-none rounded-lg',
              variant === 'pill' ? 'px-3.5 py-1.5' : 'pb-3 pt-1 px-1',
              isActive
                ? variant === 'pill'
                  ? 'text-slate-900 dark:text-slate-100 font-semibold shadow-xs'
                  : 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            )}
          >
            {variant === 'pill' && isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg -z-10 shadow-xs border border-slate-200/60 dark:border-slate-700/60"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}

            {tab.icon && <span className="w-4 h-4 shrink-0 flex items-center justify-center">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && <span className="shrink-0">{tab.badge}</span>}

            {variant === 'underline' && isActive && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
