import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Send,
  RefreshCw,
} from 'lucide-react'
import type { TimelineGap } from '../../types/timeline'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import { Modal } from '../ui/Modal'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

export interface MissingYearsDetectorProps {
  gap: TimelineGap
  onResolveGap: (answerText: string) => void
  onResetGap?: () => void
  className?: string
}

export const MissingYearsDetector: React.FC<MissingYearsDetectorProps> = ({
  gap,
  onResolveGap,
  onResetGap,
  className,
}) => {
  const { notifySuccess, notifyInfo } = useNotifications()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [customAnswer, setCustomAnswer] = useState<string>('')

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalAnswer =
      customAnswer.trim() ||
      selectedOption ||
      gap.questions[0]?.options[0] ||
      'Managed headaches at home with OTC supplements; no emergency visits.'

    onResolveGap(finalAnswer)
    setIsModalOpen(false)
    setSelectedOption('')
    setCustomAnswer('')
    notifySuccess(
      'Chronological Gap Resolved!',
      'Historical timeline entry synthesized from patient answer and added to care records.'
    )
  }

  return (
    <>
      <GlassCard
        variant="elevated"
        className={cn(
          'p-5 sm:p-7 space-y-5 border transition-all',
          gap.isResolved
            ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10'
            : 'border-amber-500/50 bg-amber-500/5',
          className
        )}
      >
        {/* Header with Title & Information Gap Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center',
                gap.isResolved
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
              )}
            >
              {gap.isResolved ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
            </div>

            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <span>Missing Years Detector</span>
                {!gap.isResolved ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                    Information Gap
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Gap Resolved & Documented
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                AI Chronology Engine flags gaps in longitudinal telemetry to eliminate blind spots in diagnosis.
              </p>
            </div>
          </div>

          {/* Action Trigger / Reset */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {!gap.isResolved ? (
              <AnimatedButton
                variant="primary"
                size="sm"
                leftIcon={<HelpCircle className="w-4 h-4" />}
                onClick={() => setIsModalOpen(true)}
              >
                Ask Patient About This Period
              </AnimatedButton>
            ) : (
              onResetGap && (
                <button
                  type="button"
                  onClick={onResetGap}
                  className="text-xs text-slate-400 hover:text-emerald-500 flex items-center gap-1 font-semibold transition-colors"
                  title="Reset gap simulation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Gap</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Visual Year Sequence with Mandated Diagram:
            2021 ● -> 2022 ● -> 2023 -------- GAP -------- -> 2024 ● -> 2025 ● */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3 text-center sm:text-left">
            Chronological Gap Mapping Visualization
          </span>

          <div className="flex items-center justify-between sm:justify-center sm:gap-4 flex-wrap gap-y-3">
            {/* 2021 Node */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                2021
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm" />
            </div>

            <span className="text-slate-300 dark:text-slate-700 font-bold">&rarr;</span>

            {/* 2022 Node */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                2022
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm" />
            </div>

            <span className="text-slate-300 dark:text-slate-700 font-bold">&rarr;</span>

            {/* 2023 GAP Callout Segment */}
            <div
              className={cn(
                'px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all',
                gap.isResolved
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/50 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-dashed border-amber-500/60 text-amber-700 dark:text-amber-300 animate-pulse'
              )}
            >
              <span className="text-xs sm:text-sm font-black">2023</span>
              <span className="font-mono text-xs font-bold">
                {gap.isResolved ? '— RESOLVED —' : '—— GAP ——'}
              </span>
              {gap.isResolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
            </div>

            <span className="text-slate-300 dark:text-slate-700 font-bold">&rarr;</span>

            {/* 2024 Node */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                2024
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm" />
            </div>

            <span className="text-slate-300 dark:text-slate-700 font-bold">&rarr;</span>

            {/* 2025 Node */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                2025
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm" />
            </div>
          </div>
        </div>

        {/* Detailed Impact Description or Resolved Outcome */}
        {!gap.isResolved ? (
          <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                Clinical Significance of Gap:
              </span>
              {gap.impactDescription}
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                Patient Clarification Logged:
              </span>
              "{gap.resolvedAnswer}"
            </div>
          </div>
        )}
      </GlassCard>

      {/* Question Modal: Ask Patient About This Period */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Clarify 2022–2023 Health Gap"
        subtitle="Help Dr. Sharma understand your health trajectory during this unrecorded 18-month window."
        size="lg"
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Targeted AI Timeline Question</span>
            </div>
            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              "{gap.questions[0]?.prompt}"
            </p>
          </div>

          {/* Quick Clickable Options */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Most Accurate Scenario:
            </label>
            {gap.questions[0]?.options.map((opt, idx) => (
              <label
                key={idx}
                className={cn(
                  'p-3 rounded-xl border text-xs flex items-start gap-2.5 cursor-pointer transition-all',
                  selectedOption === opt
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-900 dark:text-slate-100 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                )}
              >
                <input
                  type="radio"
                  name="gap-option"
                  checked={selectedOption === opt}
                  onChange={() => setSelectedOption(opt)}
                  className="mt-0.5 text-emerald-500 focus:ring-emerald-400"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          {/* Or Type Custom Statement */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Or Describe in Your Own Words:
            </label>
            <textarea
              rows={3}
              value={customAnswer}
              onChange={(e) => setCustomAnswer(e.target.value)}
              placeholder="e.g. During 2022 and 2023, headaches were infrequent until late autumn when work stress escalated..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <AnimatedButton
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </AnimatedButton>

            <AnimatedButton
              variant="primary"
              size="sm"
              type="submit"
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              Submit & Close Gap
            </AnimatedButton>
          </div>
        </form>
      </Modal>
    </>
  )
}
