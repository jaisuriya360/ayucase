import React from 'react'
import { Quote, User, CheckCircle2, Stethoscope, Sparkles } from 'lucide-react'
import { AyuCard } from '../ui/AyuCard'
import { AyuBadge } from '../ui/AyuBadge'
import type { PatientProfile } from '../../types/patient'

export interface StorySummaryProps {
  patient: PatientProfile
}

export const StorySummary: React.FC<StorySummaryProps> = ({ patient }) => {
  return (
    <div className="space-y-6">
      {/* Emotional Anchor Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
          <Quote className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              The Human Experience Behind the Clinical Codes
            </h3>
            <AyuBadge variant="emerald" size="sm">Patient Centered</AyuBadge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            "Behind every clinical diagnosis is a human being living through symptoms, adjustments, and quiet resilience. This chronicle bridges what Aarav experiences with verified medical records."
          </p>
        </div>
      </div>

      {/* Section 1: Patient Profile */}
      <section id="section-profile" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Section 1 • Patient Profile & Baseline
          </h2>
        </div>

        <AyuCard variant="default" padding="lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                {patient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                    {patient.name}
                  </h3>
                  <AyuBadge variant="emerald" size="sm">Verified Intake</AyuBadge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {patient.age} Yrs • {patient.gender} • Blood Group: {patient.bloodGroup}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Lead Neurologist
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Dr. Priya Sharma, MD
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Primary Condition
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {patient.primaryCondition}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Language
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                English & Tamil (Bilingual)
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Care Model
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                AYUCASE Active Care
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Consent Authorization
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All Grants Active</span>
              </span>
            </div>
          </div>
        </AyuCard>
      </section>
    </div>
  )
}
