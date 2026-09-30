import React from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Activity,
  HeartPulse,
  Phone,
  Droplet,
  Globe2,
  FileText,
  Sparkles,
  Layers,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import type { ClinicalCase, CaseStatus, CasePriority } from '../../types/clinicalCase'
import { cn } from '../../utils/cn'

interface CaseDetailLeftPanelProps {
  currentCase: ClinicalCase
  onStatusChange: (status: CaseStatus) => void
  onPriorityChange: (priority: CasePriority) => void
  activeSection: string
  onSectionClick: (sectionId: string) => void
}

export const CaseDetailLeftPanel: React.FC<CaseDetailLeftPanelProps> = ({
  currentCase,
  onStatusChange,
  onPriorityChange,
  activeSection,
  onSectionClick,
}) => {
  const statuses: CaseStatus[] = ['Triage', 'Active Review', 'Synthesized', 'Completed']
  const priorities: CasePriority[] = ['Low', 'Medium', 'High', 'Critical']

  const navItems = [
    { id: 'section-complaint', label: 'Chief Complaint & HPI', icon: Activity },
    { id: 'section-history', label: 'Medical & Surgical History', icon: Clock },
    { id: 'section-meds', label: 'Medications & Allergies', icon: Droplet },
    { id: 'section-lifestyle', label: 'Family & Lifestyle Telemetry', icon: HeartPulse },
    { id: 'section-assessment', label: 'Physician Assessment & Plan', icon: FileText },
  ]

  return (
    <div className="space-y-4">
      {/* Back to Queue Button */}
      <Link
        to="/physician/patients"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors px-2 py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Patient Queue</span>
      </Link>

      {/* 1. Patient Demographics Card */}
      <GlassCard variant="elevated" className="p-5 space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md',
              currentCase.avatarColor
            )}
          >
            {currentCase.patientName.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 truncate">
              {currentCase.patientName}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-[11px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {currentCase.fictionalCaseNumber}
              </span>
              <span className="text-xs text-slate-400">
                {currentCase.patientAge}y • {currentCase.patientGender}
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Info Matrix */}
        <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200/80 dark:border-slate-800/80 pt-3">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-[10px] text-slate-400 block font-semibold">Blood Group</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {currentCase.bloodGroup}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-[10px] text-slate-400 block font-semibold">Completeness</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {currentCase.completeness}%
            </span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Primary Condition
          </span>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
            {currentCase.primaryCondition}
          </p>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 border-t border-slate-200/80 dark:border-slate-800/80 pt-2.5">
          <div className="flex items-center justify-between">
            <span>Assigned Physician:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {currentCase.assignedPhysician}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Information Status:</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">
              {currentCase.informationStatus}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* 2. Case Status & Priority Control */}
      <GlassCard variant="default" className="p-4 space-y-3 border border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
            Clinical Review State
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {statuses.map((s) => {
              const isActive = currentCase.status === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatusChange(s)}
                  className={cn(
                    'py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center border cursor-pointer',
                    isActive
                      ? 'bg-cyan-500 text-white border-cyan-600 shadow-sm'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/40'
                  )}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
            Priority Tier
          </span>
          <div className="grid grid-cols-4 gap-1">
            {priorities.map((p) => {
              const isActive = currentCase.priority === p
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPriorityChange(p)}
                  className={cn(
                    'py-1 rounded-md text-[11px] font-bold transition-all text-center border cursor-pointer',
                    isActive
                      ? p === 'Critical' || p === 'High'
                        ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 shadow-sm'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  )}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </div>
      </GlassCard>

      {/* 3. Section Navigation */}
      <GlassCard variant="default" className="p-4 space-y-1 border border-slate-200 dark:border-slate-800">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
          Structured Case Navigation
        </span>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isCurrent = activeSection === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer',
                  isCurrent
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </GlassCard>
    </div>
  )
}
