import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, Save, AlertCircle, Sparkles } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import {
  type FamilyMember,
  type FamilyRelation,
  type LineageSide,
} from '../../types/familyTree'

export interface FamilyMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (member: Partial<FamilyMember>) => void
  initialMember?: FamilyMember | null
}

const COMMON_CONDITIONS = [
  'Migraine with Aura',
  'Tension Headache',
  'Hypertension',
  'Asthma',
  'Allergies',
  'Cardiovascular Disease',
  'Diabetes Mellitus',
  'None Reported',
]

export const FamilyMemberModal: React.FC<FamilyMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMember,
}) => {
  const isEditing = Boolean(initialMember)

  const [name, setName] = useState('')
  const [relation, setRelation] = useState<FamilyRelation>('Sibling')
  const [lineageSide, setLineageSide] = useState<LineageSide>('Maternal')
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female')
  const [age, setAge] = useState<string>('')
  const [status, setStatus] = useState<'Living' | 'Deceased' | 'Unknown'>('Living')
  const [reportedConditions, setReportedConditions] = useState<string[]>([])
  const [customCondition, setCustomCondition] = useState('')
  const [patientNotes, setPatientNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialMember) {
      setName(initialMember.name)
      setRelation(initialMember.relation)
      setLineageSide(initialMember.lineageSide)
      setGender(initialMember.gender)
      setAge(initialMember.age ? String(initialMember.age) : '')
      setStatus(initialMember.status)
      setReportedConditions(initialMember.reportedConditions || [])
      setPatientNotes(initialMember.patientNotes || '')
    } else {
      setName('')
      setRelation('Sibling')
      setLineageSide('Maternal')
      setGender('Female')
      setAge('')
      setStatus('Living')
      setReportedConditions([])
      setPatientNotes('')
    }
    setError(null)
  }, [initialMember, isOpen])

  if (!isOpen) return null

  const handleToggleCondition = (cond: string) => {
    if (reportedConditions.includes(cond)) {
      setReportedConditions(reportedConditions.filter((c) => c !== cond))
    } else {
      setReportedConditions([...reportedConditions, cond])
    }
  }

  const handleAddCustomCondition = () => {
    if (!customCondition.trim()) return
    if (!reportedConditions.includes(customCondition.trim())) {
      setReportedConditions([...reportedConditions, customCondition.trim()])
    }
    setCustomCondition('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter a name for the family member.')
      return
    }

    const hasMigraine = reportedConditions.some(
      (c) => c.toLowerCase().includes('migraine') || c.toLowerCase().includes('cephalea')
    )

    const generation =
      relation === 'Grandparent'
        ? 1
        : relation === 'Parent'
        ? 2
        : 3

    onSave({
      id: initialMember?.id || `fam-${Date.now()}`,
      name: name.trim(),
      relation,
      lineageSide,
      gender,
      age: age ? parseInt(age, 10) : undefined,
      status,
      reportedConditions:
        reportedConditions.length > 0 ? reportedConditions : ['No Specific Conditions Reported'],
      patientNotes: patientNotes.trim() || 'Patient-reported during family history intake.',
      sourceLabel: 'Patient Intake • Direct Verbal Account',
      hasMigraineHistory: hasMigraine,
      isPatient: false,
      generation,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-xl my-8"
      >
        <GlassCard variant="elevated" className="p-6 sm:p-7 space-y-5 border-slate-700 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100">
                  {isEditing ? 'Edit Family Member' : 'Add Family Member'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Patient-provided relative history for pedigree documentation.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Name & Relation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Full Name / Identifier *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Lin Chen or Maternal Aunt"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Relation *</label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value as FamilyRelation)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 text-xs"
                >
                  <option value="Grandparent">Grandparent</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other Relative</option>
                </select>
              </div>
            </div>

            {/* Lineage & Gender & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Lineage</label>
                <select
                  value={lineageSide}
                  onChange={(e) => setLineageSide(e.target.value as LineageSide)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
                >
                  <option value="Maternal">Maternal</option>
                  <option value="Paternal">Paternal</option>
                  <option value="Direct">Direct / Sibling</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g., 64"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
            </div>

            {/* Reported Conditions Quick Select Chips */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Reported Health Conditions:
              </label>

              <div className="flex flex-wrap gap-1.5">
                {COMMON_CONDITIONS.map((cond) => {
                  const isChecked = reportedConditions.includes(cond)
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => handleToggleCondition(cond)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        isChecked
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {cond}
                    </button>
                  )
                })}
              </div>

              {/* Custom condition input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddCustomCondition()
                    }
                  }}
                  placeholder="Add other reported condition..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCustomCondition}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Patient Notes */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Patient Narrative & Subjective Remarks:
              </label>
              <textarea
                rows={2}
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                placeholder="Describe any symptoms, onset age, or triggers reported by patient..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 text-xs resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800">
              <AnimatedButton variant="ghost" size="sm" onClick={onClose} type="button">
                Cancel
              </AnimatedButton>
              <AnimatedButton
                variant="primary"
                size="sm"
                type="submit"
                leftIcon={<Save className="w-4 h-4" />}
              >
                {isEditing ? 'Save Changes' : 'Add to Family Tree'}
              </AnimatedButton>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  )
}
