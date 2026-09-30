import React, { useState } from 'react'
import {
  RotateCcw,
  Sparkles,
  RefreshCw,
  Minus,
  HelpCircle,
  ArrowRight,
  History,
  FileText,
  Clock,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import type { ClinicalCase, WhatChangedStatus } from '../../types/clinicalCase'
import { cn } from '../../utils/cn'

interface WhatChangedDeltaViewProps {
  currentCase: ClinicalCase
}

export const WhatChangedDeltaView: React.FC<WhatChangedDeltaViewProps> = ({
  currentCase,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<WhatChangedStatus | 'All'>('All')

  const deltaItems = currentCase.whatChangedItems || []

  const statusConfig: Record<
    WhatChangedStatus,
    {
      label: string
      badgeClass: string
      icon: React.ComponentType<{ className?: string }>
      accentBorder: string
    }
  > = {
    New: {
      label: 'New',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: Sparkles,
      accentBorder: 'border-l-4 border-l-emerald-500',
    },
    Updated: {
      label: 'Updated',
      badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      icon: RefreshCw,
      accentBorder: 'border-l-4 border-l-cyan-500',
    },
    Unchanged: {
      label: 'Unchanged',
      badgeClass: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      icon: Minus,
      accentBorder: 'border-l-4 border-l-slate-400',
    },
    Missing: {
      label: 'Missing',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: HelpCircle,
      accentBorder: 'border-l-4 border-l-amber-500',
    },
  }

  const filteredItems = deltaItems.filter(
    (item) => selectedFilter === 'All' || item.status === selectedFilter
  )

  const filterTabs: Array<WhatChangedStatus | 'All'> = [
    'All',
    'New',
    'Updated',
    'Unchanged',
    'Missing',
  ]

  return (
    <GlassCard variant="default" className="p-6 space-y-5 border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                What Changed?
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase">
                Longitudinal Delta Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparative analysis between prior consultations and current 2026 intake
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {filterTabs.map((tab) => {
            const count =
              tab === 'All'
                ? deltaItems.length
                : deltaItems.filter((i) => i.status === tab).length
            const isSelected = selectedFilter === tab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedFilter(tab)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer',
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                    : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/40'
                )}
              >
                <span>{tab}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Delta Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const cfg = statusConfig[item.status]
          const Icon = cfg.icon

          return (
            <div
              key={item.id}
              className={cn(
                'p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-3 transition-all',
                cfg.accentBorder
              )}
            >
              {/* Top Row: Title, Category, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {item.parameter}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1',
                      cfg.badgeClass
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{cfg.label}</span>
                  </span>
                </div>
              </div>

              {/* Side-by-Side Comparison: Previous vs Current */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Previous Information */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Previous Information (Prior Encounters)
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.previousEncounter}
                  </p>
                </div>

                {/* Current Information */}
                <div className="p-3 rounded-lg bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-300/40 dark:border-cyan-800/40 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                    Current Information (2026 Intake)
                  </span>
                  <p className="text-slate-900 dark:text-slate-100 font-bold">
                    {item.currentEncounter}
                  </p>
                </div>
              </div>

              {/* Clinical Context & Source */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {item.clinicalContext}
                </span>
                <span className="text-[10px] font-mono shrink-0">
                  {item.source}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
