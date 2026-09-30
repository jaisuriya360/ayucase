import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  BookOpen,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  Edit3,
  Stethoscope,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import type { InterviewAnswer, InterviewQuestion } from '../../types/interview'
import { Modal } from '../ui/Modal'
import { AnimatedButton } from '../ui/AnimatedButton'

export interface InterviewSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  questions: InterviewQuestion[]
  answers: Record<string, InterviewAnswer>
  onSelectQuestion: (index: number) => void
}

export const InterviewSummaryModal: React.FC<InterviewSummaryModalProps> = ({
  isOpen,
  onClose,
  questions,
  answers,
  onSelectQuestion,
}) => {
  const navigate = useNavigate()
  const answeredCount = Object.keys(answers).length
  const isAllAnswered = answeredCount === questions.length

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clinical Interview Synthesis"
      subtitle={`${answeredCount} of ${questions.length} guided conversational prompts completed`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                Narrative Phenotype Complete
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Your spoken statements have been normalized into verified clinical entities ready for Dr. Priya Sharma's review.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/30">
              100% Ingestion Confidence
            </span>
          </div>
        </div>

        {/* Answers List */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {questions.map((q, idx) => {
            const ans = answers[q.id]
            if (!ans) return null

            return (
              <div
                key={q.id}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Question {idx + 1} • {q.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      onSelectQuestion(idx)
                    }}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {q.prompt}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-500/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                      Patient's Own Words
                    </span>
                    <p className="italic text-slate-700 dark:text-slate-300">
                      "{ans.patientStatement}"
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-500/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                      {ans.structuredData.field}
                    </span>
                    <p className="font-extrabold text-slate-900 dark:text-slate-100">
                      {ans.structuredData.value}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800 gap-3 flex-wrap">
          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Review More Questions
          </AnimatedButton>

          <div className="flex items-center gap-2">
            <AnimatedButton
              variant="secondary"
              size="sm"
              leftIcon={<LayoutDashboard className="w-4 h-4" />}
              onClick={() => {
                onClose()
                navigate('/patient/dashboard')
              }}
            >
              Dashboard
            </AnimatedButton>

            <AnimatedButton
              variant="primary"
              size="sm"
              leftIcon={<BookOpen className="w-4 h-4" />}
              onClick={() => {
                onClose()
                navigate('/patient/story')
              }}
            >
              View Health Story
            </AnimatedButton>
          </div>
        </div>
      </div>
    </Modal>
  )
}
