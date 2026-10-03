import React from 'react'
import { Radio, FileCheck } from 'lucide-react'
import { PageHeader } from '../ui/PageHeader'
import { AyuButton } from '../ui/AyuButton'
import { AyuBadge } from '../ui/AyuBadge'

export interface InterviewHeaderProps {
  answeredCount: number
  totalQuestions: number
  onOpenSummary: () => void
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  answeredCount,
  totalQuestions,
  onOpenSummary,
}) => {
  return (
    <PageHeader
      title="Clinical Health Interview"
      subtitle="Voice-first conversational intake structuring your personal illness narrative for your clinical care team."
      badge={
        <AyuBadge variant="emerald" size="sm" icon={<Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />}>
          Speech Recognition & NLP Ready
        </AyuBadge>
      }
      actions={
        <AyuButton
          variant="secondary"
          size="sm"
          leftIcon={<FileCheck className="w-4 h-4" />}
          onClick={onOpenSummary}
        >
          Summary ({answeredCount}/{totalQuestions})
        </AyuButton>
      }
    />
  )
}
