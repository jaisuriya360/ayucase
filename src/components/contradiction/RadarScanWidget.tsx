import React from 'react'
import { motion } from 'framer-motion'
import { Radio, AlertTriangle, ShieldCheck, Sparkles, Activity } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { type InformationDifference } from '../../types/contradiction'
import { cn } from '../../utils/cn'

export interface RadarScanWidgetProps {
  className?: string
  differences: InformationDifference[]
  selectedDifferenceId?: string
  onSelectDifference?: (id: string) => void
}

export const RadarScanWidget: React.FC<RadarScanWidgetProps> = ({
  className,
  differences,
  selectedDifferenceId,
  onSelectDifference,
}) => {
  let reduceMotion = false
  try {
    const a11y = useAccessibility()
    reduceMotion = a11y.settings.reduceMotion
  } catch {
    // fallback
  }

  const needsReviewCount = differences.filter((d) => d.status === 'Needs Human Review').length
  const reviewedCount = differences.filter((d) => d.status === 'Reviewed').length
  const unclearCount = differences.filter((d) => d.status === 'Still Unclear').length

  // Blip relative coordinates on 300x300 radar disk
  const blipPositions: Record<string, { x: number; y: number; angle: number; distance: number }> = {
    'diff-med-01': { x: 195, y: 95, angle: 45, distance: 75 }, // High priority top right
    'diff-onset-02': { x: 90, y: 190, angle: 220, distance: 65 }, // Left bottom
    'diff-freq-03': { x: 215, y: 205, angle: 310, distance: 85 }, // Right bottom
  }

  return (
    <GlassCard variant="elevated" className={cn('p-5 sm:p-6 space-y-5 relative overflow-hidden', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100">
                Contradiction Radar Sweep
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                Active Detection
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cross-validating patient narrative statements against documentary evidence.
            </p>
          </div>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            {needsReviewCount} Needs Human Review
          </span>
          {reviewedCount > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {reviewedCount} Reviewed
            </span>
          )}
          {unclearCount > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              {unclearCount} Still Unclear
            </span>
          )}
        </div>
      </div>

      {/* Radar Canvas & Discrepancy Stream */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Radar Circular Sweep Disk (5 cols) */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-slate-950 border-2 border-amber-500/40 shadow-xl shadow-amber-500/10 flex items-center justify-center overflow-hidden">
            {/* Concentric rings */}
            <div className="absolute w-16 h-16 rounded-full border border-amber-500/20 pointer-events-none" />
            <div className="absolute w-32 h-32 rounded-full border border-amber-500/25 pointer-events-none" />
            <div className="absolute w-48 h-48 rounded-full border border-amber-500/25 pointer-events-none" />
            <div className="absolute w-60 h-60 rounded-full border border-dashed border-amber-500/30 pointer-events-none" />

            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-amber-500/20 pointer-events-none" />
            <div className="absolute h-full w-[1px] bg-amber-500/20 pointer-events-none" />

            {/* Radar Rotating Sweep Beam */}
            <div
              className="absolute inset-0 origin-center pointer-events-none"
              style={{
                background:
                  'conic-gradient(from 0deg, rgba(245, 158, 11, 0.35) 0deg, rgba(245, 158, 11, 0.05) 60deg, transparent 90deg, transparent 360deg)',
                animation: reduceMotion ? 'none' : 'spin-slow 6s linear infinite',
              }}
            />

            {/* Center Core */}
            <div className="relative z-10 w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-md shadow-amber-500/50" />

            {/* Discrepancy Blips */}
            {differences.map((diff) => {
              const pos = blipPositions[diff.id] || { x: 140, y: 80 }
              const isSelected = diff.id === selectedDifferenceId
              const isReviewed = diff.status === 'Reviewed'

              return (
                <div
                  key={diff.id}
                  onClick={() => onSelectDifference && onSelectDifference(diff.id)}
                  style={{
                    left: `${(pos.x / 300) * 100}%`,
                    top: `${(pos.y / 300) * 100}%`,
                  }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  title={`${diff.title} • ${diff.status}`}
                >
                  {/* Blip Ping Animation */}
                  <span
                    className={cn(
                      'absolute -inset-2 rounded-full animate-ping opacity-75',
                      isReviewed
                        ? 'bg-emerald-400'
                        : isSelected
                        ? 'bg-rose-500'
                        : 'bg-amber-400'
                    )}
                  />

                  {/* Blip Core */}
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center text-[8px] font-black',
                      isReviewed
                        ? 'bg-emerald-500 border-white text-white'
                        : isSelected
                        ? 'bg-rose-500 border-white text-white scale-125 shadow-lg shadow-rose-500/50'
                        : 'bg-amber-500 border-white text-slate-900 hover:scale-110'
                    )}
                  >
                    !
                  </div>

                  {/* Blip Tooltip Label on Hover */}
                  <div className="hidden group-hover:block absolute left-5 top-0 z-30 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold text-white whitespace-nowrap shadow-lg">
                    {diff.title}
                  </div>
                </div>
              )
            })}

            {/* Sweep Status HUD Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-400/80 uppercase tracking-widest pointer-events-none">
              RADAR ACTIVE • 360°
            </div>
          </div>
        </div>

        {/* Discrepancy Stream / Quick Target Selector (7 cols) */}
        <div className="md:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
              Active Discrepancy Vector Queue ({differences.length})
            </span>
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
              Click to jump & resolve
            </span>
          </div>

          <div className="space-y-2">
            {differences.map((diff) => {
              const isSelected = diff.id === selectedDifferenceId
              const isReviewed = diff.status === 'Reviewed'

              return (
                <div
                  key={diff.id}
                  onClick={() => onSelectDifference && onSelectDifference(diff.id)}
                  className={cn(
                    'p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3',
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-slate-400'
                  )}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                        {diff.category}
                      </span>
                      <span
                        className={cn(
                          'text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border',
                          diff.status === 'Needs Human Review'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25'
                            : diff.status === 'Reviewed'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25'
                        )}
                      >
                        {diff.status}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {diff.title}
                    </h4>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {diff.currentStance}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
