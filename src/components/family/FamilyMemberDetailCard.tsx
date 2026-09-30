import React from 'react'
import { motion } from 'framer-motion'
import {
  User,
  HeartPulse,
  Activity,
  Edit3,
  Trash2,
  X,
  Info,
  ShieldAlert,
  Sparkles,
  Calendar,
  Quote,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import { type FamilyMember } from '../../types/familyTree'
import { cn } from '../../utils/cn'

export interface FamilyMemberDetailCardProps {
  className?: string
  member: FamilyMember
  onEdit?: (member: FamilyMember) => void
  onRemove?: (id: string) => void
  onClose?: () => void
}

export const FamilyMemberDetailCard: React.FC<FamilyMemberDetailCardProps> = ({
  className,
  member,
  onEdit,
  onRemove,
  onClose,
}) => {
  return (
    <GlassCard
      variant="elevated"
      className={cn(
        'p-5 sm:p-6 space-y-4 border border-slate-200/90 dark:border-slate-800 transition-all shadow-xl relative',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-md',
              member.isPatient
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                : member.hasMigraineHistory
                ? 'bg-gradient-to-br from-rose-500 to-amber-500 text-white'
                : 'bg-gradient-to-br from-slate-700 to-slate-900 text-slate-100'
            )}
          >
            {member.name.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100">
                {member.name}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {member.relation}
              </span>
              {member.lineageSide !== 'Direct' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  {member.lineageSide}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {member.gender} • {member.age ? `${member.age} Yrs` : 'Age Unspecified'} • Status: {member.status}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close card"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mandatory Non-Inferential Genetic Notice */}
      <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <span className="leading-snug">
          <strong>Clinical Principle:</strong> Patient-reported family history for pedigree
          context. <strong>AyuCase does NOT infer genetic risks</strong>, calculate hereditary risk
          scores, or predict familial disease transmission.
        </span>
      </div>

      {/* Reported Health Conditions */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Reported Health Conditions ({member.reportedConditions.length})
        </span>

        <div className="flex flex-wrap gap-1.5">
          {member.reportedConditions.map((cond, idx) => (
            <span
              key={idx}
              className={cn(
                'text-xs px-2.5 py-1 rounded-xl font-medium border',
                cond.toLowerCase().includes('migraine') || cond.toLowerCase().includes('cephalea')
                  ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              )}
            >
              {cond}
            </span>
          ))}
        </div>
      </div>

      {/* Verbatim Patient Notes */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
          <Quote className="w-3 h-3 text-emerald-500" />
          Patient Narrative Regarding Relative
        </span>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs font-serif italic text-slate-700 dark:text-slate-300 leading-relaxed">
          "{member.patientNotes || 'No additional narrative remarks provided.'}"
        </div>
      </div>

      {/* Provenance Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
          Source: {member.sourceLabel}
        </span>
      </div>

      {/* Actions (Edit / Remove for non-index patients) */}
      {!member.isPatient && (
        <div className="flex items-center justify-end gap-2 pt-1">
          {onRemove && (
            <AnimatedButton
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => onRemove(member.id)}
            >
              Remove
            </AnimatedButton>
          )}

          {onEdit && (
            <AnimatedButton
              variant="secondary"
              size="sm"
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              onClick={() => onEdit(member)}
            >
              Edit Member
            </AnimatedButton>
          )}
        </div>
      )}
    </GlassCard>
  )
}
