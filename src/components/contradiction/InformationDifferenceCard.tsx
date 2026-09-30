import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  FileText,
  Quote,
  CheckCircle2,
  Clock,
  HelpCircle,
  Volume2,
  Calendar,
  User,
  ShieldAlert,
  ArrowRight,
  Info,
  Check,
  Send,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import {
  type InformationDifference,
  type ReconciliationStance,
  type DifferenceStatus,
} from '../../types/contradiction'
import { cn } from '../../utils/cn'

export interface InformationDifferenceCardProps {
  className?: string
  difference: InformationDifference
  onUpdateStance?: (id: string, stance: ReconciliationStance) => void
  onMarkStatus?: (id: string, status: DifferenceStatus, physicianNote?: string) => void
}

export const InformationDifferenceCard: React.FC<InformationDifferenceCardProps> = ({
  className,
  difference,
  onUpdateStance,
  onMarkStatus,
}) => {
  const [physicianNote, setPhysicianNote] = useState<string>(difference.physicianNote || '')
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false)

  const handlePlayVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.onstart = () => setIsPlayingAudio(true)
      utterance.onend = () => setIsPlayingAudio(false)
      utterance.onerror = () => setIsPlayingAudio(false)
      window.speechSynthesis.speak(utterance)
    } else {
      setIsPlayingAudio(true)
      setTimeout(() => setIsPlayingAudio(false), 2000)
    }
  }

  const handleStanceChange = (stance: ReconciliationStance) => {
    if (onUpdateStance) {
      onUpdateStance(difference.id, stance)
    }
  }

  const handleAction = (newStatus: DifferenceStatus) => {
    if (onMarkStatus) {
      onMarkStatus(difference.id, newStatus, physicianNote)
    }
  }

  return (
    <GlassCard
      variant="elevated"
      className={cn(
        'p-5 sm:p-7 space-y-6 border transition-all',
        difference.status === 'Needs Human Review'
          ? 'border-amber-500/40 bg-white/80 dark:bg-slate-900/80 shadow-lg shadow-amber-500/5'
          : difference.status === 'Reviewed'
          ? 'border-emerald-500/40 bg-white/80 dark:bg-slate-900/80'
          : 'border-rose-500/40 bg-white/80 dark:bg-slate-900/80',
        className
      )}
    >
      {/* ⚠ INFORMATION DIFFERENCE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-black tracking-wide uppercase">
              <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>⚠ INFORMATION DIFFERENCE</span>
            </span>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {difference.category}
            </span>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {difference.severity} Divergence
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
            {difference.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {difference.summary}
          </p>
        </div>

        {/* Current Status Pill */}
        <div className="self-start sm:self-center shrink-0">
          <div
            className={cn(
              'px-3.5 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5',
              difference.status === 'Needs Human Review'
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 animate-pulse'
                : difference.status === 'Reviewed'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
            )}
          >
            {difference.status === 'Needs Human Review' && <Clock className="w-3.5 h-3.5" />}
            {difference.status === 'Reviewed' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {difference.status === 'Still Unclear' && <HelpCircle className="w-3.5 h-3.5" />}
            <span>{difference.status}</span>
          </div>
        </div>
      </div>

      {/* Mandatory Non-Judgment Banner */}
      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <span className="leading-snug">
          <strong>Information Consistency Rule:</strong> AyuCase displays conflicting data sources
          side-by-side with equal parity. <strong>The system does NOT decide which is correct.</strong>{' '}
          This feature audits evidence consistency and does NOT provide a medical diagnosis.
        </span>
      </div>

      {/* SIDE-BY-SIDE COMPARISON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source 1: Patient Statement */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border-2 border-amber-500/30 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Quote className="w-4 h-4 text-amber-500" />
                <span>PATIENT INTERVIEW</span>
              </span>

              <button
                type="button"
                onClick={() => handlePlayVoice(difference.patientStatement.quote)}
                className={cn(
                  'px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border transition-colors',
                  isPlayingAudio
                    ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                    : 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:border-amber-500'
                )}
                title="Listen to statement"
              >
                <Volume2 className="w-3 h-3" />
                <span>{isPlayingAudio ? 'Listening...' : 'Listen'}</span>
              </button>
            </div>

            {/* Verbatim Quote Bubble */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/20 shadow-sm">
              <p className="text-sm font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                "{difference.patientStatement.quote}"
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-500/20 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-amber-700 dark:text-amber-400 truncate">
              {difference.patientStatement.source}
            </span>
            <span className="font-mono text-[10px] shrink-0">
              {difference.patientStatement.timestamp}
            </span>
          </div>
        </div>

        {/* Source 2: Document Record */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-950/20 border-2 border-cyan-500/30 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-500" />
                <span>DOCUMENT RECORD</span>
              </span>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25">
                {difference.documentRecord.page || 'Verified Record'}
              </span>
            </div>

            {/* Document Excerpt Box */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-cyan-500/20 shadow-sm space-y-1.5">
              <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span className="truncate">{difference.documentRecord.title}</span>
              </div>
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                "{difference.documentRecord.excerpt}"
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-cyan-500/20 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-cyan-700 dark:text-cyan-400 truncate">
              {difference.documentRecord.documentName}
            </span>
            <span className="font-mono text-[10px] shrink-0">
              {difference.documentRecord.date}
            </span>
          </div>
        </div>
      </div>

      {/* RECONCILIATION OPTIONS */}
      <div className="space-y-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Reconciliation Stance (Select Working Focus):
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Current: <strong className="text-slate-700 dark:text-slate-200">{difference.currentStance}</strong>
          </span>
        </div>

        {/* 3 Mandated Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              stance: 'Patient Statement' as ReconciliationStance,
              label: 'Patient Statement',
              desc: "Prioritize patient's latest spoken update / verbal account",
            },
            {
              stance: 'Document Record' as ReconciliationStance,
              label: 'Document Record',
              desc: 'Prioritize verified medical record & prescription text',
            },
            {
              stance: 'Needs Physician Review' as ReconciliationStance,
              label: 'Needs Physician Review',
              desc: 'Flag for in-person clarification during live consultation',
            },
          ].map((opt) => {
            const isSelected = difference.currentStance === opt.stance

            return (
              <button
                key={opt.stance}
                type="button"
                onClick={() => handleStanceChange(opt.stance)}
                className={cn(
                  'p-3 rounded-xl border text-left transition-all select-none',
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-slate-400'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {opt.label}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {opt.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* PHYSICIAN RECONCILIATION & ACTION BAR */}
      <div className="space-y-3 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Physician Reconciliation Note & Follow-up Plan:
          </label>
          <input
            type="text"
            value={physicianNote}
            onChange={(e) => setPhysicianNote(e.target.value)}
            placeholder="e.g., Inquire if patient stopped taking Propranolol due to side effects, or never filled the script."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Action Buttons: Reviewed vs Still Unclear */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 self-start sm:self-center">
            <User className="w-3.5 h-3.5" />
            <span>Audited by Dr. Priya Sharma, MD (Attending Lead)</span>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <AnimatedButton
              variant="secondary"
              size="sm"
              leftIcon={<HelpCircle className="w-4 h-4 text-amber-500" />}
              onClick={() => handleAction('Still Unclear')}
            >
              Mark as Still Unclear
            </AnimatedButton>

            <AnimatedButton
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => handleAction('Reviewed')}
            >
              Mark as Reviewed
            </AnimatedButton>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
