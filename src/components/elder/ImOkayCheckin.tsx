import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, CheckCircle2, AlertCircle, Phone, Volume2, ShieldAlert } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

export interface ImOkayCheckinProps {
  className?: string
}

export const ImOkayCheckin: React.FC<ImOkayCheckinProps> = ({ className }) => {
  const { speakText, settings } = useAccessibility()
  const { notifySuccess, notifyInfo } = useNotifications()
  const isXLarge = settings.fontSize === 'xlarge'

  const [lastCheckin, setLastCheckin] = useState<{
    status: 'good' | 'mild' | 'unwell'
    label: string
    time: string
  }>({
    status: 'good',
    label: 'I Feel Good Today',
    time: 'Today at 9:00 AM',
  })

  const handleSelectCheckin = (status: 'good' | 'mild' | 'unwell', label: string) => {
    const timeStr = `Today at ${new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`

    setLastCheckin({ status, label, time: timeStr })

    if (status === 'good') {
      speakText('Wonderful. We logged that you are feeling good today.')
      notifySuccess('Check-in Saved', 'Shared with family: You are feeling well today.')
    } else if (status === 'mild') {
      speakText('Thank you for letting us know. Please rest your eyes and drink plenty of water.')
      notifyInfo('Check-in Saved', 'Logged: Mild discomfort. Take it easy today.')
    } else {
      speakText(
        'We have logged that you are unwell. Please rest in a dark room. Your family assist and care team have been informed.'
      )
      notifyInfo('Check-in Saved', 'Logged: Unwell. If this is severe, please call your clinic.')
    }
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
            <span className="text-2xl">💚</span>
            <h3
              className={cn(
                'font-black text-slate-900 dark:text-slate-50 tracking-tight',
                isXLarge ? 'text-2xl' : 'text-xl'
              )}
            >
              "I'm Okay" Daily Comfort Check-in
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
            Let your loved ones and Dr. Priya Sharma know how you are feeling with one easy tap.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 self-start sm:self-auto">
          Logged: {lastCheckin.time}
        </span>
      </div>

      {/* Mandatory Non-Emergency Notice */}
      <div className="p-3.5 rounded-xl bg-amber-500/15 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <strong className="font-bold">Important Safety Notice:</strong> This daily check-in is
          for routine comfort monitoring and family communication.{' '}
          <strong>This is NOT an emergency medical system.</strong> If you ever experience severe
          chest pain, breathing trouble, or an acute medical emergency, call 112 or your emergency
          services immediately.
        </div>
      </div>

      {/* 3 Large Tap Targets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Good */}
        <button
          type="button"
          onClick={() => handleSelectCheckin('good', 'I Feel Good Today')}
          className={cn(
            'p-5 rounded-2xl border-3 text-center transition-transform active:scale-95 space-y-2 select-none min-h-[110px] flex flex-col items-center justify-center',
            lastCheckin.status === 'good'
              ? 'bg-emerald-600 text-white border-slate-900 dark:border-white shadow-lg'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-400 hover:border-emerald-600'
          )}
        >
          <span className="text-3xl">😊</span>
          <h4 className="font-black text-base sm:text-lg leading-tight">I Feel Good Today</h4>
          <span className="text-xs font-bold opacity-90">No headache or nausea</span>
        </button>

        {/* Mild */}
        <button
          type="button"
          onClick={() => handleSelectCheckin('mild', 'I Have Mild Discomfort')}
          className={cn(
            'p-5 rounded-2xl border-3 text-center transition-transform active:scale-95 space-y-2 select-none min-h-[110px] flex flex-col items-center justify-center',
            lastCheckin.status === 'mild'
              ? 'bg-amber-500 text-slate-950 border-slate-900 dark:border-white shadow-lg'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-400 hover:border-amber-600'
          )}
        >
          <span className="text-3xl">😐</span>
          <h4 className="font-black text-base sm:text-lg leading-tight">Mild Discomfort</h4>
          <span className="text-xs font-bold opacity-90">Resting eyes, drinking water</span>
        </button>

        {/* Unwell */}
        <button
          type="button"
          onClick={() => handleSelectCheckin('unwell', "I'm Not Feeling Well")}
          className={cn(
            'p-5 rounded-2xl border-3 text-center transition-transform active:scale-95 space-y-2 select-none min-h-[110px] flex flex-col items-center justify-center',
            lastCheckin.status === 'unwell'
              ? 'bg-rose-600 text-white border-slate-900 dark:border-white shadow-lg'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-400 hover:border-rose-600'
          )}
        >
          <span className="text-3xl">🤒</span>
          <h4 className="font-black text-base sm:text-lg leading-tight">Not Feeling Well</h4>
          <span className="text-xs font-bold opacity-90">Throbbing headache active</span>
        </button>
      </div>
    </GlassCard>
  )
}
