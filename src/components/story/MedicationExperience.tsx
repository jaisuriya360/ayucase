import React from 'react'
import { Pill, AlertTriangle } from 'lucide-react'
import { AyuCard } from '../ui/AyuCard'

export const MedicationExperience: React.FC = () => {
  return (
    <section id="section-meds" className="scroll-mt-24 space-y-3">
      <div className="flex items-center gap-2">
        <Pill className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Section 8 • Medication History & Response
        </h2>
      </div>

      <AyuCard variant="default" padding="lg" className="space-y-4">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Active Pharmacotherapy Regimen
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">
                Prophylaxis (Daily)
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                Propranolol 40mg BID
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Non-selective beta blocker. Taken twice daily with meals.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 block uppercase">
                Acute Abortive (PRN)
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                Rizatriptan 10mg PRN
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Oral disintegrating tablet. Taken at onset of visual scotoma.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 block uppercase">
                Nutraceutical (Nightly)
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                Magnesium Glycinate 400mg
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Taken nightly for cortical spreading depression mitigation.
              </p>
            </div>
          </div>
        </div>

        {/* Adverse Reaction Alert */}
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold">Prior Adverse Reaction (Sumatriptan 50mg):</strong>{' '}
            Discontinued in 2023 due to severe acute facial flushing, thoracic tightness, and
            transient vasospasm sensation. Switched to Rizatriptan with excellent tolerability.
          </div>
        </div>
      </AyuCard>
    </section>
  )
}
