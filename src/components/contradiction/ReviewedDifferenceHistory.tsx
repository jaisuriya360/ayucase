import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  History,
  CheckCircle2,
  Clock,
  HelpCircle,
  User,
  ArrowRight,
  ShieldCheck,
  FileText,
  RotateCcw,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { type DifferenceReviewHistoryEntry } from '../../types/contradiction'
import { cn } from '../../utils/cn'

export interface ReviewedDifferenceHistoryProps {
  className?: string
  history: DifferenceReviewHistoryEntry[]
  onClearHistory?: () => void
}

export const ReviewedDifferenceHistory: React.FC<ReviewedDifferenceHistoryProps> = ({
  className,
  history,
  onClearHistory,
}) => {
  return (
    <GlassCard variant="elevated" className={cn('p-5 sm:p-7 space-y-5', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100">
                History of Reviewed Differences
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                Audit Trail ({history.length})
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Permanent immutable chronological log of reconciliation decisions and clinical rationale.
            </p>
          </div>
        </div>

        {onClearHistory && history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-xs font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors self-start sm:self-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset History</span>
          </button>
        )}
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
          <History className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No Differences Reviewed Yet
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Differences reviewed or marked as still unclear will be recorded in this chronological audit log.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {history.map((entry, index) => {
              const isReviewed = entry.newStatus === 'Reviewed'

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5"
                >
                  {/* Top Bar: Title & Status Transition */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {entry.differenceTitle}
                    </h4>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {entry.previousStatus}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span
                        className={cn(
                          'text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1',
                          isReviewed
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25'
                        )}
                      >
                        {isReviewed ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <HelpCircle className="w-3 h-3" />
                        )}
                        <span>{entry.newStatus}</span>
                      </span>
                    </div>
                  </div>

                  {/* Stance & Practitioner Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        Selected Stance:
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                        {entry.selectedStance}
                      </span>
                    </div>

                    <span>•</span>

                    <div className="flex items-center gap-1 text-[11px]">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{entry.reviewer}</span>
                    </div>

                    <span>•</span>

                    <div className="font-mono text-[11px] text-slate-400">
                      {entry.timestamp}
                    </div>
                  </div>

                  {/* Physician Notes */}
                  {entry.physicianNote && (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Attending Physician Note:
                      </span>
                      <p className="italic leading-relaxed font-sans">
                        "{entry.physicianNote}"
                      </p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </GlassCard>
  )
}
