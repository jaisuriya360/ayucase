import React from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { AyuButton } from '../ui/AyuButton'

export interface InterviewNavigationProps {
  currentIndex: number
  totalQuestions: number
  hasAnswer: boolean
  onPrevious: () => void
  onNext: () => void
}

export const InterviewNavigation: React.FC<InterviewNavigationProps> = ({
  currentIndex,
  totalQuestions,
  hasAnswer,
  onPrevious,
  onNext,
}) => {
  const isLastQuestion = currentIndex >= totalQuestions - 1

  return (
    <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800 gap-3">
      {/* Previous Button */}
      <AyuButton
        variant="secondary"
        size="md"
        leftIcon={<ChevronLeft className="w-4 h-4" />}
        onClick={onPrevious}
        disabled={currentIndex === 0}
      >
        Previous
      </AyuButton>

      {/* Continue or Complete */}
      <AyuButton
        variant="primary"
        size="md"
        rightIcon={
          isLastQuestion ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )
        }
        onClick={onNext}
      >
        {isLastQuestion ? 'Complete Interview' : 'Continue'}
      </AyuButton>
    </div>
  )
}
