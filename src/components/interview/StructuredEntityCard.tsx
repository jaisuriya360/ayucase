import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Quote,
  Sparkles,
  Edit3,
  Check,
  X,
  Volume2,
  Tag,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react'
import type { InterviewAnswer } from '../../types/interview'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { cn } from '../../utils/cn'

export interface StructuredEntityCardProps {
  answer: InterviewAnswer
  onUpdateAnswer?: (updated: InterviewAnswer) => void
  className?: string
}

export const StructuredEntityCard: React.FC<StructuredEntityCardProps> = ({
  answer,
  onUpdateAnswer,
  className,
}) => {
  const { speakText } = useAccessibility()
  const [isEditing, setIsEditing] = useState(false)
  const [editStatement, setEditStatement] = useState(answer.patientStatement)
  const [editFieldValue, setEditFieldValue] = useState(answer.structuredData.value)

  const handleSaveEdit = () => {
    if (!onUpdateAnswer) return
    onUpdateAnswer({
      ...answer,
      patientStatement: editStatement,
      structuredData: {
        ...answer.structuredData,
        value: editFieldValue,
      },
      isEdited: true,
      recordedAt: new Date().toISOString(),
    })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditStatement(answer.patientStatement)
    setEditFieldValue(answer.structuredData.value)
    setIsEditing(false)
  }

  return (
    <GlassCard variant="elevated" className={cn('p-5 sm:p-6 space-y-5', className)}>
      {/* Header with Title & Action Controls */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Verified Clinical Ingestion</span>
              {answer.isEdited && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  Edited
                </span>
              )}
            </h3>
            <span className="text-[11px] text-slate-400">
              Confidence Score: {answer.structuredData.confidence}% • Schema Normalized
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              speakText(
                `Patient statement: ${answer.patientStatement}. Extracted clinical entity: ${answer.structuredData.field}, ${answer.structuredData.value}.`
              )
            }
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Read back statement and structure"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Answer</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: PATIENT'S OWN WORDS */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5 text-indigo-500" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Patient's Own Words
            </h4>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 relative">
            {!isEditing ? (
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
                "{answer.patientStatement}"
              </p>
            ) : (
              <textarea
                rows={3}
                value={editStatement}
                onChange={(e) => setEditStatement(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Edit verbatim patient statement..."
              />
            )}
            <div className="mt-2.5 pt-2 border-t border-indigo-500/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Mode: {answer.inputMode.toUpperCase()}</span>
              <span>Preserved verbatim</span>
            </div>
          </div>
        </div>

        {/* Right Column: STRUCTURED INFORMATION */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Structured Information
            </h4>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                {answer.structuredData.field}
              </span>

              {!isEditing ? (
                <p className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 leading-snug">
                  {answer.structuredData.value}
                </p>
              ) : (
                <input
                  type="text"
                  value={editFieldValue}
                  onChange={(e) => setEditFieldValue(e.target.value)}
                  className="w-full p-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Edit structured entity value..."
                />
              )}
            </div>

            {/* Clinical Tags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {answer.structuredData.clinicalTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                >
                  #{tag}
                </span>
              ))}
              <span className="text-[10px] text-slate-400 ml-auto font-mono">
                {answer.structuredData.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
