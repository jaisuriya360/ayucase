import React from 'react'
import { RotateCcw, Keyboard, Mic } from 'lucide-react'
import type { InterviewQuestion } from '../../types/interview'
import { AyuCard } from '../ui/AyuCard'
import { AyuButton } from '../ui/AyuButton'
import { AyuBadge } from '../ui/AyuBadge'

export interface QuestionCardProps {
  question: InterviewQuestion
  isTypeMode: boolean
  onToggleTypeMode: () => void
  onReplayQuestion: () => void
  children?: React.ReactNode
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isTypeMode,
  onToggleTypeMode,
  onReplayQuestion,
  children,
}) => {
  return (
    <AyuCard variant="default" padding="lg" className="space-y-6">
      {/* Question Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
            {question.order}
          </span>
          <AyuBadge variant="emerald" size="sm">
            {question.category}
          </AyuBadge>
        </div>

        <div className="flex items-center gap-2">
          {/* Replay Question Button */}
          <AyuButton
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
            onClick={onReplayQuestion}
            title="Read Question Aloud (Speech Synthesis)"
          >
            Replay Question
          </AyuButton>

          {/* Mode Switcher */}
          <AyuButton
            variant={isTypeMode ? 'primary' : 'secondary'}
            size="sm"
            leftIcon={isTypeMode ? <Mic className="w-3.5 h-3.5" /> : <Keyboard className="w-3.5 h-3.5 text-indigo-500" />}
            onClick={onToggleTypeMode}
            title={isTypeMode ? 'Switch to Voice input' : 'Switch to keyboard typing'}
          >
            {isTypeMode ? 'Voice Mode' : 'Type Instead'}
          </AyuButton>
        </div>
      </div>

      {/* Question Prompts */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
          "{question.prompt}"
        </h2>
        {question.taPrompt && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {question.taPrompt}
          </p>
        )}
        {question.subtitle && (
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 pt-1">
            {question.subtitle}
          </p>
        )}
      </div>

      {/* Interactive Input Area (Voice controls or Answer editor) */}
      <div className="pt-2">
        {children}
      </div>
    </AyuCard>
  )
}
