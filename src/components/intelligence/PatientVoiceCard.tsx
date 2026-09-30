import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Quote,
  Sparkles,
  Info,
  Calendar,
  FileText,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  Volume2,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { cn } from '../../utils/cn'

export interface InformationSourceDetails {
  source: string // e.g., "Voice Interview" | "Uploaded Document" | "Patient Check-in"
  question?: string // e.g., "Q1: What brings you here today?"
  document?: string // e.g., "Brain MRI 3T Volumetric Protocol.pdf"
  date?: string // e.g., "23 Sep 2026"
}

export interface PatientVoiceCardProps {
  className?: string
  title: string
  category?: string
  structuredItems: Array<{ label: string; value: string; chip?: string }>
  patientStatement: string
  sourceInfo?: InformationSourceDetails
  timestamp?: string
  audioSnippetAvailable?: boolean
}

export const PatientVoiceCard: React.FC<PatientVoiceCardProps> = ({
  className,
  title,
  category,
  structuredItems,
  patientStatement,
  sourceInfo,
  timestamp = '23 Sep 2026',
  audioSnippetAvailable = true,
}) => {
  const [showSourceModal, setShowSourceModal] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const handlePlayVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(patientStatement)
      utterance.rate = 0.95
      utterance.pitch = 1.0
      utterance.onstart = () => setIsPlayingAudio(true)
      utterance.onend = () => setIsPlayingAudio(false)
      utterance.onerror = () => setIsPlayingAudio(false)
      window.speechSynthesis.speak(utterance)
    } else {
      setIsPlayingAudio(true)
      setTimeout(() => setIsPlayingAudio(false), 2500)
    }
  }

  return (
    <GlassCard
      variant="elevated"
      className={cn(
        'p-5 sm:p-6 space-y-4 border border-slate-200/90 dark:border-slate-800 transition-all hover:border-emerald-500/30',
        className
      )}
    >
      {/* Header & Principle Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
            {title}
          </h4>
          {category && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {category}
            </span>
          )}
        </div>

        {/* The Mandatory AyuCase Principle Badge */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="text-[11px] font-bold tracking-tight italic">
            "The patient's own words are never lost."
          </span>
        </div>
      </div>

      {/* Dual Preservation Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Structured Clinical Information (5 cols) */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Structured Clinical Information
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                Synthesized
              </span>
            </div>

            <dl className="space-y-2">
              {structuredItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs"
                >
                  <dt className="font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                    {item.label}
                  </dt>
                  <dd className="font-bold text-slate-900 dark:text-slate-100 sm:text-right flex items-center gap-1.5 justify-end">
                    <span>{item.value}</span>
                    {item.chip && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                        {item.chip}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Traceability button */}
          {sourceInfo && (
            <button
              type="button"
              onClick={() => setShowSourceModal(!showSourceModal)}
              className="mt-2 w-full py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500/40 bg-white/80 dark:bg-slate-800/80 text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Info className="w-3.5 h-3.5" />
                <span>Information Source & Citation</span>
              </span>
              <ChevronDown
                className={cn('w-3.5 h-3.5 transition-transform', showSourceModal && 'rotate-180')}
              />
            </button>
          )}
        </div>

        {/* Right: Original Patient Statement (6 cols) */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-500/20 dark:border-emerald-500/25 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5 text-emerald-500" />
                Original Patient Statement (Verbatim)
              </span>
              {audioSnippetAvailable && (
                <button
                  type="button"
                  onClick={handlePlayVoice}
                  className={cn(
                    'p-1 px-2 rounded-md text-[10px] font-bold flex items-center gap-1 border transition-all',
                    isPlayingAudio
                      ? 'bg-emerald-500 text-white border-emerald-600 animate-pulse'
                      : 'bg-white/80 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:border-emerald-500'
                  )}
                  title="Listen to verbatim voice transcript"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{isPlayingAudio ? 'Listening...' : 'Listen'}</span>
                </button>
              )}
            </div>

            {/* Verbatim Quote Box */}
            <div className="relative p-3.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-emerald-500/20 shadow-sm">
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic font-serif leading-relaxed">
                "{patientStatement}"
              </p>
              <div className="mt-2 text-right">
                <span className="text-[10px] font-mono font-medium text-slate-400">
                  Recorded: {timestamp} • First-Person Narrative
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Preserved unedited to retain authentic subjective nuance and clinical context.</span>
          </div>
        </div>
      </div>

      {/* Information Source Drawer (Collapsible) */}
      <AnimatePresence>
        {showSourceModal && sourceInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Source Lineage & Provenance</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                {/* Source */}
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                    Source
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {sourceInfo.source}
                  </span>
                </div>

                {/* Question */}
                {sourceInfo.question && (
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center gap-1">
                      <HelpCircle className="w-2.5 h-2.5 text-cyan-500" />
                      Question
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                      {sourceInfo.question}
                    </span>
                  </div>
                )}

                {/* Document */}
                {sourceInfo.document && (
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5 text-amber-500" />
                      Document
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                      {sourceInfo.document}
                    </span>
                  </div>
                )}

                {/* Date */}
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 text-rose-500" />
                    Date
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {sourceInfo.date || timestamp}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
