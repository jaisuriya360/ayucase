import React from 'react'
import { Users } from 'lucide-react'
import { AyuCard } from '../ui/AyuCard'
import { AyuBadge } from '../ui/AyuBadge'
import { FamilyHealthTreeGraph } from '../family/FamilyHealthTreeGraph'

export const FamilyHistorySection: React.FC = () => {
  return (
    <section id="section-family" className="scroll-mt-24 space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Section 7 • Family History & Lineage
        </h2>
      </div>

      <AyuCard variant="default" padding="lg" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Maternal Lineage */}
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Maternal Lineage (Verified)
              </span>
              <AyuBadge variant="emerald" size="sm">
                Positive Migraine History
              </AyuBadge>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Mother suffered from severe recurring unilateral migraines with nausea and light
              sensitivity throughout her 30s and 40s. Strongly points toward hereditary
              neurovascular and ion channel susceptibility.
            </p>
          </div>

          {/* Paternal Lineage */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Paternal Lineage (Unverified)
              </span>
              <AyuBadge variant="amber" size="sm">
                Unknown Information
              </AyuBadge>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Paternal cardiovascular, hypertension, and neurovascular history has NOT been provided
              by patient. Logged in the Unknown Zone for physician clarification.
            </p>
          </div>
        </div>
      </AyuCard>

      {/* Interactive Pedigree Graph */}
      <FamilyHealthTreeGraph />
    </section>
  )
}
