import React from 'react'
import { CheckCircle2, Dna, ShieldAlert } from 'lucide-react'
import { AyuCard } from '../ui/AyuCard'
import { AyuBadge } from '../ui/AyuBadge'
import { CaseDNAFingerprint } from '../intelligence/CaseDNAFingerprint'
import { CaseGapDetector } from '../intelligence/CaseGapDetector'

export const CaseCompletenessSection: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Section 10: Case Completeness */}
      <section id="section-completeness" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Section 10 • Case Completeness & Fidelity
          </h2>
        </div>

        <AyuCard variant="default" padding="lg" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                Case Synthesis Fidelity: 78%
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Normalized against international clinical neurology intake standards (ICD-11 & ICHD-3).
              </p>
            </div>
            <AyuBadge variant="emerald" size="md">
              Clinical Grade
            </AyuBadge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Interview Depth</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                96% (6/6 Qs)
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Diagnostic Records</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">
                88% (3 Docs)
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Timeline Continuity</span>
              <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">
                92% (6 Milestones)
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Unknown Gaps Resolved</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                65% (3 Pending)
              </span>
            </div>
          </div>
        </AyuCard>
      </section>

      {/* Embedded Intelligence: Case DNA */}
      <section id="section-dna" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2">
          <Dna className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Case DNA • Visual Case Profile
          </h2>
        </div>
        <CaseDNAFingerprint />
      </section>

      {/* Embedded Intelligence: Case Gap Detector */}
      <section id="section-gaps" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Case Gap Detector • 7 Clinical Categories
          </h2>
        </div>
        <CaseGapDetector />
      </section>
    </div>
  )
}
