import React from 'react'
import { motion } from 'framer-motion'
import { Mic, BrainCircuit, Database, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '../../utils/cn'

export type PipelineStage = 'voice' | 'understanding' | 'structure' | 'complete' | 'idle'

export interface VoiceToStructurePipelineProps {
  currentStage: PipelineStage
  className?: string
  transcribingWord?: string
}

export const VoiceToStructurePipeline: React.FC<VoiceToStructurePipelineProps> = ({
  currentStage,
  className,
  transcribingWord,
}) => {
  const stages = [
    {
      id: 'voice',
      label: 'VOICE',
      sublabel: 'Acoustic Audio Capture',
      icon: Mic,
      color: 'rose',
    },
    {
      id: 'understanding',
      label: 'UNDERSTANDING',
      sublabel: 'NLP Entity Parsing',
      icon: BrainCircuit,
      color: 'indigo',
    },
    {
      id: 'structure',
      label: 'STRUCTURE',
      sublabel: 'Clinical Schema Extraction',
      icon: Database,
      color: 'emerald',
    },
  ]

  const getStageIndex = (stage: PipelineStage): number => {
    switch (stage) {
      case 'voice':
        return 0
      case 'understanding':
        return 1
      case 'structure':
        return 2
      case 'complete':
        return 3
      case 'idle':
      default:
        return -1
    }
  }

  const activeIdx = getStageIndex(currentStage)

  return (
    <div className={cn('p-4 sm:p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            AyuCase Transformation Pipeline
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          VOICE &rarr; UNDERSTANDING &rarr; STRUCTURE
        </span>
      </div>

      {/* Stepper Pathway */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon
          const isActive = idx === activeIdx
          const isPassed = activeIdx > idx || currentStage === 'complete'

          return (
            <div key={stage.id} className="relative flex flex-col items-center text-center">
              {/* Node Icon Box */}
              <div
                className={cn(
                  'w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative z-10',
                  isActive
                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30 scale-110'
                    : isPassed
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 border border-slate-200 dark:border-slate-700/60'
                )}
              >
                {isPassed && !isActive ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Icon className={cn('w-5 h-5', isActive && 'animate-pulse')} />
                )}

                {/* Pulsing ring when active */}
                {isActive && (
                  <span className="absolute -inset-1 rounded-2xl border-2 border-emerald-400 animate-ping opacity-30" />
                )}
              </div>

              {/* Labels */}
              <span
                className={cn(
                  'text-xs font-black tracking-wider uppercase mt-2 transition-colors',
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isPassed
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400'
                )}
              >
                {stage.label}
              </span>

              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline leading-tight mt-0.5">
                {stage.sublabel}
              </span>
            </div>
          )
        })}
      </div>

      {/* Dynamic Telemetry ticker during streaming */}
      {transcribingWord && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">Streaming vocal tokens:</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold truncate max-w-xs">
            "{transcribingWord}"
          </span>
        </motion.div>
      )}
    </div>
  )
}
