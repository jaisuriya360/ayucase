import React, { useState } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  AlertTriangle,
  Compass,
  ArrowRight,
  Info,
  Filter,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import type { ClinicalCase, AttentionCategory } from '../../types/clinicalCase'
import { cn } from '../../utils/cn'

interface PhysicianAttentionMapProps {
  currentCase: ClinicalCase
  onSelectItem?: (section: string) => void
  onOpenSourceTraceability?: (citationId: string) => void
}

export const PhysicianAttentionMap: React.FC<PhysicianAttentionMapProps> = ({
  currentCase,
  onSelectItem,
  onOpenSourceTraceability,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AttentionCategory | 'All'>('All')

  const items = currentCase.attentionItems || []

  const categories: Array<{
    id: AttentionCategory
    label: string
    color: string
    bgLight: string
    borderColor: string
    badgeBg: string
    icon: React.ComponentType<{ className?: string }>
    summary: string
  }> = [
    {
      id: 'Confirmed',
      label: 'Confirmed',
      color: 'text-emerald-700 dark:text-emerald-400',
      bgLight: 'bg-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: CheckCircle2,
      summary: 'Cross-verified with records & laboratory diagnostics',
    },
    {
      id: 'Needs Review',
      label: 'Needs Review',
      color: 'text-indigo-700 dark:text-indigo-400',
      bgLight: 'bg-indigo-500/5',
      borderColor: 'border-indigo-500/30',
      badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      icon: AlertCircle,
      summary: 'Requires clinical evaluation or regimen titration',
    },
    {
      id: 'Incomplete',
      label: 'Incomplete',
      color: 'text-amber-700 dark:text-amber-400',
      bgLight: 'bg-amber-500/5',
      borderColor: 'border-amber-500/30',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: HelpCircle,
      summary: 'Pending diagnostic ingestion or patient telemetry sync',
    },
    {
      id: 'Information Difference',
      label: 'Information Difference',
      color: 'text-rose-700 dark:text-rose-400',
      bgLight: 'bg-rose-500/5',
      borderColor: 'border-rose-500/30',
      badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: AlertTriangle,
      summary: 'Discrepancy noted between intake narrative and clinical documents',
    },
  ]

  const filteredItems = items.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  )

  return (
    <GlassCard variant="default" className="p-6 space-y-5 border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Physician Attention Map
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase">
                Clinical Workflow Triage
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Information verification status matrix • Categorized by clinical review state without medical severity labels
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer',
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/40'
            )}
          >
            All ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.category === cat.id).length
            const isSelected = selectedCategory === cat.id

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer',
                  isSelected
                    ? cn('border-current shadow-sm', cat.badgeBg)
                    : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/40'
                )}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4 Category Summary Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const count = items.filter((i) => i.category === cat.id).length
          const Icon = cat.icon
          const isSelected = selectedCategory === cat.id

          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? 'All' : cat.id)}
              className={cn(
                'p-3.5 rounded-xl border transition-all cursor-pointer space-y-1',
                cat.bgLight,
                cat.borderColor,
                isSelected ? 'ring-2 ring-cyan-500/50 scale-[1.02]' : 'hover:scale-[1.01]'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Icon className={cn('w-4 h-4', cat.color)} />
                  <span className={cat.color}>{cat.label}</span>
                </div>
                <span className={cn('text-sm font-black', cat.color)}>{count}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {cat.summary}
              </p>
            </div>
          )
        })}
      </div>

      {/* Item List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {filteredItems.map((item) => {
          const cat = categories.find((c) => c.id === item.category)!
          const Icon = cat.icon

          return (
            <div
              key={item.id}
              className={cn(
                'p-4 rounded-xl border space-y-2 flex flex-col justify-between transition-all',
                cat.bgLight,
                cat.borderColor
              )}
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Icon className={cn('w-4 h-4 shrink-0', cat.color)} />
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h4>
                  </div>
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0', cat.badgeBg)}>
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  Section: {item.section}
                </span>
                <span className="truncate max-w-[180px] text-[10px]">
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
