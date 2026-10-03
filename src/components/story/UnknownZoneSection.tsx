import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HelpCircle, ArrowRight } from 'lucide-react'
import { AyuCard } from '../ui/AyuCard'
import { AyuButton } from '../ui/AyuButton'
import { AyuBadge } from '../ui/AyuBadge'

export const UnknownZoneSection: React.FC = () => {
  const navigate = useNavigate()

  const gaps = [
    {
      title: '48-Hour Ambulatory Blood Pressure Telemetry',
      status: 'NOT PROVIDED',
      reason:
        'Mentioned as recommended during the 2025 autonomic screen, but raw continuous ambulatory blood pressure telemetry records have not yet been provided or uploaded.',
      questionIndex: 4,
    },
    {
      title: 'Overnight Polysomnography (Sleep Architecture PSG)',
      status: 'NOT PROVIDED',
      reason:
        'Patient reports nocturnal migraine awakenings, but objective sleep stage latency and oxygen desaturation measurements have not been provided.',
      questionIndex: 5,
    },
    {
      title: 'Paternal Cardiovascular and Cerebrovascular History',
      status: 'NOT PROVIDED',
      reason:
        'Maternal migraine history is verified, but paternal cardiovascular risk, stroke incidence, and familial hypertension details were not answered.',
      questionIndex: 5,
    },
  ]

  return (
    <section id="section-unknown" className="scroll-mt-24 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
            Section 9 • Unknown Information (The Unknown Zone)
          </h2>
        </div>
        <AyuBadge variant="rose" size="sm">
          Never Invent Missing Information
        </AyuBadge>
      </div>

      <AyuCard variant="danger" padding="lg" className="space-y-4">
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="font-semibold text-rose-700 dark:text-rose-400">
            The Unknown Zone Principle:
          </strong>{' '}
          AYUCASE explicitly highlights clinical variables that were{' '}
          <span className="font-semibold">NOT provided by the patient</span>. Under no circumstances does the system
          extrapolate, guess, or invent missing clinical history.
        </div>

        <div className="space-y-3">
          {gaps.map((gap, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AyuBadge variant="rose" size="sm">
                    {gap.status}
                  </AyuBadge>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {gap.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {gap.reason}
                </p>
              </div>

              <AyuButton
                variant="secondary"
                size="sm"
                className="shrink-0 text-xs text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() =>
                  navigate('/patient/interview', {
                    state: { questionIndex: gap.questionIndex },
                  })
                }
              >
                Provide in Interview
              </AyuButton>
            </div>
          ))}
        </div>
      </AyuCard>
    </section>
  )
}
