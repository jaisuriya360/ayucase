import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  UserCheck,
  ShieldCheck,
  MessageSquareText,
  FileText,
  BookOpen,
  Stethoscope,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import type { JourneyStage, JourneyStageId } from '../../types/dashboard'
import { GlassCard } from '../ui/GlassCard'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { cn } from '../../utils/cn'

export const DEFAULT_JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'identify',
    label: 'IDENTIFY',
    subtitle: 'Profile & Demographic Auth',
    status: 'completed',
    route: '/patient/profile',
    stepNumber: 1,
  },
  {
    id: 'consent',
    label: 'CONSENT',
    subtitle: 'Data Sharing Governance',
    status: 'completed',
    route: '/patient/consent',
    stepNumber: 2,
  },
  {
    id: 'interview',
    label: 'INTERVIEW',
    subtitle: 'Vocal Symptom Intake',
    status: 'in_progress',
    route: '/patient/interview',
    stepNumber: 3,
  },
  {
    id: 'documents',
    label: 'DOCUMENTS',
    subtitle: 'Verified Diagnostics & OCR',
    status: 'in_progress',
    route: '/patient/documents',
    stepNumber: 4,
  },
  {
    id: 'story',
    label: 'HEALTH STORY',
    subtitle: 'Narrative Phenotype Synthesis',
    status: 'in_progress',
    route: '/patient/story',
    stepNumber: 5,
  },
  {
    id: 'review',
    label: 'PHYSICIAN REVIEW',
    subtitle: 'Clinical Multi-Disciplinary Care',
    status: 'upcoming',
    route: '/patient/timeline',
    stepNumber: 6,
  },
]

export interface PatientJourneyStepperProps {
  stages?: JourneyStage[]
  className?: string
}

export const PatientJourneyStepper: React.FC<PatientJourneyStepperProps> = ({
  stages = DEFAULT_JOURNEY_STAGES,
  className,
}) => {
  const navigate = useNavigate()
  const { isElderMode } = useAccessibility()

  const getStageIcon = (id: JourneyStageId) => {
    switch (id) {
      case 'identify':
        return <UserCheck className="w-4 h-4" />
      case 'consent':
        return <ShieldCheck className="w-4 h-4" />
      case 'interview':
        return <MessageSquareText className="w-4 h-4" />
      case 'documents':
        return <FileText className="w-4 h-4" />
      case 'story':
        return <BookOpen className="w-4 h-4" />
      case 'review':
      default:
        return <Stethoscope className="w-4 h-4" />
    }
  }

  const completedCount = stages.filter((s) => s.status === 'completed').length
  const progressPercent = Math.round((completedCount / stages.length) * 100)

  return (
    <GlassCard variant="elevated" className={cn('p-6 sm:p-8', className)}>
      {/* Header with Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Interactive Patient Journey
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click any milestone to inspect or complete that phase of your care pathway.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {completedCount} of {stages.length} Milestones
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
              {progressPercent}% Complete
            </span>
          </div>

          <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Stepper Grid / Timeline */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 relative">
        {stages.map((stage, idx) => {
          const isCompleted = stage.status === 'completed'
          const isInProgress = stage.status === 'in_progress'
          const isUpcoming = stage.status === 'upcoming'

          return (
            <motion.div
              key={stage.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(stage.route)}
              className={cn(
                'relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group select-none',
                isElderMode && 'p-5 min-h-[140px]',
                isCompleted
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-500 shadow-sm'
                  : isInProgress
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500/50 hover:border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-white/50 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              )}
            >
              {/* Top: Step Number & Status Indicator */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={cn(
                      'w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center',
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isInProgress
                        ? 'bg-indigo-500 text-white animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : stage.stepNumber}
                  </span>

                  <span
                    className={cn(
                      'text-[9px] font-bold px-1.5 py-0.5 rounded uppercase',
                      isCompleted
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : isInProgress
                        ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500'
                    )}
                  >
                    {isCompleted ? 'Done' : isInProgress ? 'Active' : 'Queued'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mb-1">
                  <span className="text-emerald-500">{getStageIcon(stage.id)}</span>
                  <h4 className="font-extrabold text-xs tracking-wide">{stage.label}</h4>
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                  {stage.subtitle}
                </p>
              </div>

              {/* Click prompt arrow */}
              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                <span>Open Stage</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          )
        })}
      </div>
    </GlassCard>
  )
}
