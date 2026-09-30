import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Pill,
  CheckCircle2,
  Clock,
  Volume2,
  Sun,
  Moon,
  Sparkles,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { ELDER_MEDICATIONS, type ElderMedicationReminder } from '../../types/elder'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

const MEDS_STORAGE_KEY = 'ayucase_elder_meds_v11'

export interface MedicationReminderBoardProps {
  className?: string
}

export const MedicationReminderBoard: React.FC<MedicationReminderBoardProps> = ({ className }) => {
  const { speakText, settings } = useAccessibility()
  const { notifySuccess, notifyInfo } = useNotifications()
  const isXLarge = settings.fontSize === 'xlarge'

  const [medications, setMedications] = useState<ElderMedicationReminder[]>(() => {
    try {
      const stored = localStorage.getItem(MEDS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.warn('Failed to parse elder medications', e)
    }
    return ELDER_MEDICATIONS
  })

  useEffect(() => {
    try {
      localStorage.setItem(MEDS_STORAGE_KEY, JSON.stringify(medications))
    } catch (e) {
      console.warn('Failed to persist elder medications', e)
    }
  }, [medications])

  const handleToggleTaken = (id: string) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextTaken = !m.isTakenToday
          if (nextTaken) {
            speakText(`Thank you. You have taken your ${m.name}.`)
            notifySuccess('Medicine Taken', `Logged: ${m.name} taken at ${timeStr}.`)
          }
          return {
            ...m,
            isTakenToday: nextTaken,
            takenAt: nextTaken ? timeStr : undefined,
          }
        }
        return m
      })
    )
  }

  const handleReadMed = (med: ElderMedicationReminder) => {
    speakText(
      `${med.timeOfDay}. ${med.name}. ${med.dosage}. ${med.instructions}. ${
        med.isTakenToday ? 'You have already taken this today.' : 'This is due today.'
      }`
    )
  }

  return (
    <GlassCard
      variant="elevated"
      className={cn(
        'p-5 sm:p-7 space-y-5 border-2 border-slate-900 dark:border-white shadow-xl',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">💊</span>
            <h3
              className={cn(
                'font-black text-slate-900 dark:text-slate-50 tracking-tight',
                isXLarge ? 'text-2xl' : 'text-xl'
              )}
            >
              Medication Reminder Board
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
            Fictional demo medicines scheduled for your safety. Tap "I Took This" after taking your pills.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMedications(ELDER_MEDICATIONS)
            notifyInfo('Medicines Reset', 'Medication checklist reset for today.')
          }}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Day</span>
        </button>
      </div>

      {/* Medication Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medications.map((med) => {
          return (
            <div
              key={med.id}
              className={cn(
                'p-5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3',
                med.isTakenToday
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-slate-500'
              )}
            >
              {/* Card Header: Time of day & Read Aloud */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600">
                      {med.timeOfDay}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {med.timeLabel}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleReadMed(med)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                    title="Read instructions aloud"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </button>
                </div>

                <h4
                  className={cn(
                    'font-black text-slate-900 dark:text-slate-100',
                    isXLarge ? 'text-xl' : 'text-lg'
                  )}
                >
                  {med.name}
                </h4>

                <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {med.dosage}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {med.instructions}
                </p>
              </div>

              {/* Action Button: I Took This */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleTaken(med.id)}
                  className={cn(
                    'w-full py-3 px-4 rounded-xl font-black text-sm sm:text-base border-2 transition-transform active:scale-95 flex items-center justify-center gap-2 min-h-[52px]',
                    med.isTakenToday
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-900 dark:border-white hover:bg-slate-100'
                  )}
                >
                  {med.isTakenToday ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>✓ Taken Today ({med.takenAt})</span>
                    </>
                  ) : (
                    <>
                      <Pill className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span>I Took This Medicine</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
