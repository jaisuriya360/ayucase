import React from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Cpu,
  Binary,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { cn } from '../../utils/cn'

export interface DocumentStoryPipelineProps {
  documentCount: number
  activeStage?: 'document' | 'processing' | 'structuring' | 'story'
  className?: string
}

export const DocumentStoryPipeline: React.FC<DocumentStoryPipelineProps> = ({
  documentCount = 3,
  activeStage = 'story',
  className,
}) => {
  // Dynamic metrics derived from verified documents count
  const eventsCount = Math.max(4, documentCount * 4)
  const timelineEntriesCount = Math.max(3, documentCount * 2 + 1)

  const stages = [
    {
      id: 'document',
      label: 'DOCUMENT',
      subtitle: 'Raw PDF / JPG / PNG Records',
      icon: FileText,
      countLabel: `${documentCount} Documents`,
      color: 'cyan',
    },
    {
      id: 'processing',
      label: 'PROCESSING',
      subtitle: 'Simulated Ingestion & Tokenizing',
      icon: Cpu,
      countLabel: `${eventsCount} Extracted Signals`,
      color: 'indigo',
    },
    {
      id: 'structuring',
      label: 'STRUCTURING',
      subtitle: 'Clinical Schema Normalization',
      icon: Binary,
      countLabel: `${timelineEntriesCount} Timeline Entries`,
      color: 'teal',
    },
    {
      id: 'story',
      label: 'HEALTH STORY',
      subtitle: 'Unified Illness Narrative',
      icon: BookOpen,
      countLabel: '1 Structured Story',
      color: 'emerald',
    },
  ]

  return (
    <GlassCard variant="elevated" className={cn('p-5 sm:p-7 space-y-6', className)}>
      {/* Header & Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              Document &rarr; Health Story Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            How uploaded medical diagnostics synthesize into your longitudinal personal health story.
          </p>
        </div>

        {/* Disclaimer Chip */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
          <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
          <span>Frontend Mock Extraction • Local Sandbox</span>
        </div>
      </div>

      {/* 4-Stage Animated Pipeline */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon
          const isCurrent = stage.id === activeStage

          return (
            <motion.div
              key={stage.id}
              whileHover={{ scale: 1.02, y: -2 }}
              className={cn(
                'p-4 rounded-2xl border transition-all flex flex-col justify-between relative group select-none',
                isCurrent
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              )}
            >
              {/* Connector Arrow (between columns on desktop) */}
              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
                      isCurrent
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase font-mono">
                    Step {idx + 1}
                  </span>
                </div>

                <h4 className="font-black text-sm tracking-wide text-slate-900 dark:text-slate-100">
                  {stage.label}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  {stage.subtitle}
                </p>
              </div>

              {/* Metric Tag */}
              <div className="mt-4 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {stage.countLabel}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Big Visual Metric Bar: 3 Documents -> 12 Events -> 7 Timeline Entries -> 1 Structured Story */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Synthesis Multiplier:
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center text-center">
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs sm:text-sm font-extrabold text-cyan-600 dark:text-cyan-400">
              {documentCount} Documents
            </span>
          </div>

          <span className="text-slate-400 font-bold">&rarr;</span>

          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs sm:text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
              {eventsCount} Events
            </span>
          </div>

          <span className="text-slate-400 font-bold">&rarr;</span>

          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs sm:text-sm font-extrabold text-teal-600 dark:text-teal-400">
              {timelineEntriesCount} Timeline Entries
            </span>
          </div>

          <span className="text-slate-400 font-bold">&rarr;</span>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/20">
            1 Structured Story
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
