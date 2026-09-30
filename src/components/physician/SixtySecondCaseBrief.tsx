import React from 'react'
import {
  Zap,
  Activity,
  Calendar,
  FileText,
  Clock,
  HelpCircle,
  AlertTriangle,
  Volume2,
  X,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import type { ClinicalCase } from '../../types/clinicalCase'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { formatDate } from '../../utils/formatters'

interface SixtySecondCaseBriefProps {
  currentCase: ClinicalCase
  onClose?: () => void
  onNavigateSection?: (sectionId: string) => void
}

export const SixtySecondCaseBrief: React.FC<SixtySecondCaseBriefProps> = ({
  currentCase,
  onClose,
  onNavigateSection,
}) => {
  const { speakText } = useAccessibility()

  const handleReadAloud = () => {
    const text = `60-Second Brief for ${currentCase.patientName}. Current concern: ${currentCase.chiefComplaint}. Synthesis shows ${currentCase.diagnosisSummary}. Previous consultations include outpatient neurology and emergency department. Recent documents include normal 3T brain MRI. Missing items: 48-hour ambulatory blood pressure telemetry. Two items require clinical review.`
    speakText(text)
  }

  return (
    <GlassCard
      variant="elevated"
      className="p-6 space-y-6 border-2 border-amber-500/40 dark:border-amber-400/40 bg-white/95 dark:bg-slate-900/95 shadow-2xl relative overflow-hidden"
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">
                60-Second Case Brief
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                Pre-Consultation Flash
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Essential clinical intelligence synthesized for immediate practitioner orientation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReadAloud}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Read summary aloud"
          >
            <Volume2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Read Brief</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 6-Card Executive Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* 1. CURRENT CONCERN */}
        <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-2 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-300 font-extrabold uppercase tracking-wider text-[11px]">
              <Activity className="w-4 h-4 text-cyan-500" />
              <span>1. Current Concern</span>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed italic">
              "{currentCase.chiefComplaint}"
            </p>
          </div>
          <div className="pt-2 border-t border-cyan-500/10 text-[11px] text-slate-500 dark:text-slate-400">
            <strong>Diagnosis Summary:</strong> {currentCase.diagnosisSummary}
          </div>
        </div>

        {/* 2. PREVIOUS CONSULTATIONS */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>2. Previous Consultations</span>
            </div>
            <div className="space-y-2">
              {(currentCase.previousConsultations || []).slice(0, 2).map((c, i) => (
                <div key={i} className="text-[11px] leading-snug">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{c.provider}</span>
                    <span className="text-slate-400 font-normal">{c.date}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 truncate">{c.summary}</p>
                </div>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block pt-1">
            {currentCase.previousConsultations?.length || 0} documented prior encounters
          </span>
        </div>

        {/* 3. RECENT DOCUMENTS */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>3. Recent Documents</span>
            </div>
            <div className="space-y-1.5">
              {currentCase.documents.slice(0, 2).map((d) => (
                <div key={d.id} className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                    {d.name}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 block pt-1">
            Total {currentCase.documents.length} verified clinical records
          </span>
        </div>

        {/* 4. TIMELINE HIGHLIGHTS */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>4. Timeline Highlights</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {currentCase.timelineEvents.slice(-2).map((evt, i) => (
                <div key={i} className="flex items-baseline gap-1.5">
                  <span className="font-black text-cyan-600 dark:text-cyan-400 shrink-0">
                    {evt.year}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                    {evt.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 block pt-1">
            Illness trajectory spanned over 5 years
          </span>
        </div>

        {/* 5. MISSING INFORMATION */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-extrabold uppercase tracking-wider text-[11px]">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>5. Missing Information ({currentCase.unknownItems.length})</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300 list-disc list-inside">
              {currentCase.unknownItems.length === 0 ? (
                <li className="text-emerald-600">Zero critical missing parameters</li>
              ) : (
                currentCase.unknownItems.map((u, i) => (
                  <li key={i} className="truncate">
                    {u.title}
                  </li>
                ))
              )}
            </ul>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block pt-1">
            Awaiting patient telemetry sync
          </span>
        </div>

        {/* 6. ITEMS REQUIRING REVIEW */}
        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-extrabold uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>6. Items Requiring Review</span>
            </div>
            <div className="space-y-1 text-[11px]">
              {currentCase.contradictions.map((c, i) => (
                <div key={i} className="text-slate-800 dark:text-slate-200">
                  <span className="font-bold block text-rose-600 dark:text-rose-400 truncate">
                    ⚠ {c.title}
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 line-clamp-1">{c.statement}</p>
                </div>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold block pt-1">
            Human clinical judgment required
          </span>
        </div>
      </div>
    </GlassCard>
  )
}
