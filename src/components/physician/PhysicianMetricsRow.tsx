import React from 'react'
import {
  BriefcaseMedical,
  Sparkles,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import type { PhysicianDashboardMetrics, QueueFilterStatus } from '../../types/clinicalCase'
import { cn } from '../../utils/cn'

interface PhysicianMetricsRowProps {
  metrics: PhysicianDashboardMetrics
  activeFilter?: QueueFilterStatus
  onSelectFilter?: (filter: QueueFilterStatus) => void
}

export const PhysicianMetricsRow: React.FC<PhysicianMetricsRowProps> = ({
  metrics,
  activeFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      id: 'All' as QueueFilterStatus,
      label: 'Total Cases',
      value: metrics.totalCases,
      subtext: 'Active patient roster',
      icon: BriefcaseMedical,
      color: 'text-slate-900 dark:text-slate-100',
      badgeBg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
      activeRing: 'border-slate-800 dark:border-slate-200 ring-2 ring-slate-400/30',
    },
    {
      id: 'New' as QueueFilterStatus,
      label: 'New Cases',
      value: metrics.newCases,
      subtext: 'Intake in last 24h',
      icon: Sparkles,
      color: 'text-cyan-600 dark:text-cyan-400',
      badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      activeRing: 'border-cyan-500 ring-2 ring-cyan-500/30',
    },
    {
      id: 'Pending' as QueueFilterStatus,
      label: 'Pending Review',
      value: metrics.pendingReview,
      subtext: 'Awaiting synthesis sign-off',
      icon: Clock,
      color: 'text-indigo-600 dark:text-indigo-400',
      badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      activeRing: 'border-indigo-500 ring-2 ring-indigo-500/30',
    },
    {
      id: 'Priority Review' as QueueFilterStatus,
      label: 'Priority Review',
      value: metrics.priorityReview,
      subtext: 'Differences & critical flags',
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      activeRing: 'border-rose-500 ring-2 ring-rose-500/30',
    },
    {
      id: 'Completed' as QueueFilterStatus,
      label: 'Completed',
      value: metrics.completed,
      subtext: 'Confirmed & signed off',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      activeRing: 'border-emerald-500 ring-2 ring-emerald-500/30',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        const isSelected = activeFilter === card.id

        return (
          <GlassCard
            key={card.id}
            variant="interactive"
            onClick={() => onSelectFilter?.(card.id)}
            className={cn(
              'p-4 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden',
              idx === 0 && 'col-span-2 sm:col-span-1',
              isSelected ? card.activeRing : 'hover:border-cyan-500/40'
            )}
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
                {card.label}
              </span>
              <div className={cn('p-1.5 rounded-lg border', card.badgeBg)}>
                <Icon className="w-3.5 h-3.5 shrink-0" />
              </div>
            </div>

            {/* Value Counter with Animated Counter */}
            <div className="my-1">
              <span className={cn('text-2xl sm:text-3xl font-black tracking-tight', card.color)}>
                <AnimatedCounter value={card.value} duration={900} />
              </span>
            </div>

            {/* Bottom info */}
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
              <span className="truncate">{card.subtext}</span>
              {isSelected && (
                <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider shrink-0">
                  Filter Active
                </span>
              )}
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}
