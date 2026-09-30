import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Stethoscope,
  Quote,
  Activity,
  User,
  HeartPulse,
  Pill,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react'
import type { YearlyPatientSnapshot } from '../../types/timeline'
import { GlassCard } from '../ui/GlassCard'
import { cn } from '../../utils/cn'

export interface ExplorePatientAtTimeProps {
  snapshot: YearlyPatientSnapshot
  className?: string
  onViewDocument?: (docTitle: string) => void
}

export const ExplorePatientAtTime: React.FC<ExplorePatientAtTimeProps> = ({
  snapshot,
  className,
  onViewDocument,
}) => {
  return (
    <GlassCard variant="elevated" className={cn('p-5 sm:p-7 space-y-6', className)}>
      {/* Header with Year, Patient Age & Stage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight">
              Explore Patient at This Time ({snapshot.year})
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Synchronized clinical state, diagnostic files, and patient quotes reconstructed for this specific era.
          </p>
        </div>

        {/* Demographic & Stage Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Aarav Chen • Age {snapshot.patientAge}
          </span>
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {snapshot.clinicalStage}
          </span>
        </div>
      </div>

      {/* Baseline Clinical Telemetry Strip for that Year */}
      <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2.5">
          <HeartPulse className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">
              Vitals Baseline
            </span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              {snapshot.vitalsTrend.hr} BPM • {snapshot.vitalsTrend.bp}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Pill className="w-4 h-4 text-indigo-500 shrink-0" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">
              Active Prescriptions
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
              {snapshot.medicationState.join(', ') || 'None recorded'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">
              Clinical Trajectory
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {snapshot.vitalsTrend.status}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Core Dimensions Grid: Documents, Consultations, Patient Statements, Case Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Dimension 1: DOCUMENTS */}
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Documents on File ({snapshot.documents.length})</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Era: {snapshot.year}
              </span>
            </div>

            <div className="space-y-2">
              {snapshot.documents.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 italic">
                  No diagnostic scans or laboratory reports recorded during {snapshot.year}.
                </p>
              ) : (
                snapshot.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between gap-2"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {doc.type} • {doc.source}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {doc.date}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <span className="text-[11px] text-slate-400 pt-2 block border-t border-slate-200/40 dark:border-slate-800/40">
            Validated against historical health filing registry.
          </span>
        </div>

        {/* Dimension 2: CONSULTATIONS */}
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4" />
                <span>Specialist Consultations ({snapshot.consultations.length})</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Era: {snapshot.year}
              </span>
            </div>

            <div className="space-y-2">
              {snapshot.consultations.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 italic">
                  No physician evaluations documented during {snapshot.year}.
                </p>
              ) : (
                snapshot.consultations.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {c.doctor}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {c.specialty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {c.clinic}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic pt-0.5">
                      "{c.keyOutcome}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <span className="text-[11px] text-slate-400 pt-2 block border-t border-slate-200/40 dark:border-slate-800/40">
            Extracted from clinical summaries and discharge files.
          </span>
        </div>

        {/* Dimension 3: PATIENT STATEMENTS */}
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Quote className="w-4 h-4" />
                <span>Patient Statements in {snapshot.year}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Verbatim Quotes
              </span>
            </div>

            <div className="space-y-2">
              {snapshot.patientStatements.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 italic">
                  No recorded patient quotes or voice reflections from this period.
                </p>
              ) : (
                snapshot.patientStatements.map((stmt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 space-y-1"
                  >
                    <p className="text-xs italic text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      "{stmt.quote}"
                    </p>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block pt-1">
                      Context: {stmt.context}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <span className="text-[11px] text-slate-400 pt-2 block border-t border-slate-200/40 dark:border-slate-800/40">
            Preserved directly from voice interviews and diary reflections.
          </span>
        </div>

        {/* Dimension 4: CASE EVENTS */}
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                <span>Key Case Events ({snapshot.caseEvents.length})</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Trajectory
              </span>
            </div>

            <div className="space-y-2">
              {snapshot.caseEvents.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 italic">
                  No significant case milestones logged in {snapshot.year}.
                </p>
              ) : (
                snapshot.caseEvents.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {ev.title}
                      </span>
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                        {ev.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {ev.impact}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <span className="text-[11px] text-slate-400 pt-2 block border-t border-slate-200/40 dark:border-slate-800/40">
            Synthesized into longitudinal clinical care plan.
          </span>
        </div>
      </div>
    </GlassCard>
  )
}
