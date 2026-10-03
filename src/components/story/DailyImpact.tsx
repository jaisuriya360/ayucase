import React from 'react'
import { BookOpen } from 'lucide-react'
import { AyuCard } from '../ui/AyuCard'

export const DailyImpact: React.FC = () => {
  return (
    <section id="section-history" className="scroll-mt-24 space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Section 6 • History of Present Illness (HPI) & Progression
        </h2>
      </div>

      <AyuCard variant="default" padding="lg" className="space-y-4">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Patient Aarav Chen is a 38-year-old software architect presenting with a 7-year history of
          episodic headache attacks that evolved from infrequent stress-induced tension episodes
          (2019) into classical migraines with visual scintillating auras (2021 onwards). Attack
          frequency peaked in 2023 at 4–6 disabling hemicranial headaches monthly, precipitating an
          emergency evaluation and specialized neurology referral.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
              Progression Pattern
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Subacute progression with seasonal escalation during Q4 work deadlines. Marked
              improvement noted following lifestyle hydration enforcement and Propranolol.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
              Non-Pharmacologic Trials
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              FL-41 tinted lenses, blue-light digital dimming, strict 7.5-hour sleep scheduling, and
              magnesium glycinate supplementation.
            </p>
          </div>
        </div>
      </AyuCard>
    </section>
  )
}
