import React from 'react'
import { Activity, Sparkles, Info } from 'lucide-react'
import { AyuCard } from '../ui/AyuCard'
import { AyuBadge } from '../ui/AyuBadge'

export const EpisodeAnalysis: React.FC = () => {
  return (
    <section id="section-concern" className="scroll-mt-24 space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Section 2 • Current Concern & Episode Analysis
        </h2>
      </div>

      <AyuCard variant="default" padding="lg" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
              Chief Complaint
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              Recurrent Left Hemicranial Cephalea with Scintillating Scotoma
            </h3>
          </div>
          <AyuBadge variant="rose" size="md">
            Pain: 8/10 at peak
          </AyuBadge>
        </div>

        {/* Plain language explanation callout */}
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed">
            <strong className="font-semibold">In Everyday Words:</strong> Severe one-sided headaches (migraines) preceded by flashing zig-zag visual patterns (aura), worsened by stress and bright screens.
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Severe throbbing hemicrania localized to the left fronto-orbital region, preceded by a
          15-minute scintillating visual scotoma (zig-zag patterns). Episodes average 12–14 hours
          in duration and are accompanied by intense photophobia, phonophobia, and mild autonomic
          dysregulation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold block mb-0.5">Episode Frequency</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              2–3 episodes/month (Reduced with beta-blockers)
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold block mb-0.5">Key Triggers</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Skipped meals, high-stress sprints, bright blue light
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold block mb-0.5">Alleviating Factors</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Dark quiet room, cold compression, Rizatriptan 10mg
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono text-[11px] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-500" />
            Source: Voice Interview Q1 • 23 Sep 2026
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            Verified by Patient
          </span>
        </div>
      </AyuCard>
    </section>
  )
}
