import React from 'react'
import { motion } from 'framer-motion'

export interface InterviewProgressProps {
  currentQuestionIndex: number
  totalQuestions: number
  category: string
}

export const InterviewProgress: React.FC<InterviewProgressProps> = ({
  currentQuestionIndex,
  totalQuestions,
  category,
}) => {
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
        <span>
          Question <strong className="text-slate-900 dark:text-slate-100">{currentQuestionIndex + 1}</strong> of {totalQuestions}
        </span>
        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
          {category}
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
