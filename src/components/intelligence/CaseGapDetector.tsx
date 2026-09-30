import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { CASE_GAP_CATEGORIES, type CaseGapItem } from '../../types/intelligence'
import { GlassCard } from '../ui/GlassCard'
import { cn } from '../../utils/cn'

export interface CaseGapDetectorProps {
  className?: string
  gaps?: CaseGapItem[]
}

export const CaseGapDetector: React.FC<CaseGapDetectorProps> = ({
  className,
  gaps = CASE_GAP_CATEGORIES,
}) => {
  const navigate = useNavigate()

  const completedCount = gaps.filter((g) => g.status === 'Complete').length
  const partialCount = gaps.filter((g) => g.status === 'Partial').length
  const missingCount = gaps.filter((g) => g.status === 'Missing').length

  const handleGapClick = (gap: CaseGapItem) => {
    // If not complete, navigate to the relevant interview question
    if (gap.status !== 'Complete') {
      navigate('/patient/interview', {
        state: { questionIndex: gap.interviewQuestionIndex, fromGap: gap.category },
      })
    }
  }

  const getStatusBadge = (status: CaseGapItem['status']) => {
    switch (status) {
      case 'Complete':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Complete</span>
          </span>
        )
      case 'Partial':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>Partial</span>
          </span>
        )
      case 'Missing':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Missing</span>
          </span>
        )
    }
  }

  return (
    <GlassCard variant="elevated" className={cn('p-5 sm:p-7 space-y-5', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-500" />
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              Case Gap Detector
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time audit across 7 clinical history categories. Click any partial or missing item to answer in the interview.
          </p>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {completedCount} Complete
          </span>
          {partialCount > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              {partialCount} Partial
            </span>
          )}
          {missingCount > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {missingCount} Missing
            </span>
          )}
        </div>
      </div>

      {/* 7 Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {gaps.map((gap) => {
          const isActionable = gap.status !== 'Complete'

          return (
            <motion.div
              key={gap.id}
              whileHover={isActionable ? { scale: 1.015, y: -2 } : {}}
              onClick={() => handleGapClick(gap)}
              className={cn(
                'p-4 rounded-2xl border transition-all flex flex-col justify-between select-none',
                isActionable
                  ? 'cursor-pointer border-amber-500/40 bg-amber-500/5 hover:border-amber-500 hover:shadow-md'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {gap.category}
                  </h4>
                  {getStatusBadge(gap.status)}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {gap.summary}
                </p>

                {gap.missingDetails && (
                  <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 mt-2 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    Gap: {gap.missingDetails}
                  </p>
                )}
              </div>

              {isActionable && (
                <div className="mt-3.5 pt-2 border-t border-amber-500/20 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                  <span>Answer in Interview (Q{gap.interviewQuestionIndex + 1})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </GlassCard>
  )
}
