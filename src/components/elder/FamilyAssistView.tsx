import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Heart,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Volume2,
  Send,
  X,
  Sparkles,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

export interface FamilyAssistViewProps {
  className?: string
  onClose?: () => void
}

export const FamilyAssistView: React.FC<FamilyAssistViewProps> = ({ className, onClose }) => {
  const { speakText, settings } = useAccessibility()
  const { notifySuccess } = useNotifications()
  const isXLarge = settings.fontSize === 'xlarge'

  const [familyNote, setFamilyNote] = useState<string>('')
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'Chloe Chen (Daughter)',
      text: 'Dad, so glad your brain scan came back clear and normal! Remember to take your evening pill with dinner. Love, Chloe.',
      time: 'Today, 8:40 AM',
    },
    {
      sender: 'Mei-Ling Chen (Mother)',
      text: 'Aarav, make sure you rest in the quiet room if the computer screen makes your eyes tired.',
      time: 'Yesterday, 6:15 PM',
    },
  ])

  const handleSendMessage = () => {
    if (!familyNote.trim()) return
    const newMsg = {
      sender: 'Chloe Chen (Daughter)',
      text: familyNote.trim(),
      time: 'Just now',
    }
    setMessages([newMsg, ...messages])
    setFamilyNote('')
    notifySuccess('Message Sent', 'Your loving note was added to Aarav’s home screen.')
    speakText('Your encouraging note has been sent.')
  }

  return (
    <GlassCard
      variant="elevated"
      className={cn(
        'p-5 sm:p-7 space-y-6 border-2 border-slate-900 dark:border-white shadow-xl',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">👨‍👩‍👧</span>
            <h3
              className={cn(
                'font-black text-slate-900 dark:text-slate-50 tracking-tight',
                isXLarge ? 'text-2xl' : 'text-xl'
              )}
            >
              Family Assist Mode
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25">
              Caregiver Guardian View
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
            Viewing Aarav Chen’s care overview as verified family member (Chloe Chen, Daughter).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              speakText(
                'Family Assist Mode. You are viewing Aarav Chen. Today, morning medicine was taken on time. The next doctor appointment is tomorrow with Dr. Priya Sharma.'
              )
            }
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5 text-xs"
          >
            <Volume2 className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Read Overview</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Guardian Vitals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 space-y-1">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
            Visit Readiness
          </span>
          <span className="text-lg font-black text-emerald-900 dark:text-emerald-100 block">
            100% Ready
          </span>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            Reports & questions prepared for Dr. Sharma
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border-2 border-sky-400 space-y-1">
          <span className="text-xs font-bold text-sky-800 dark:text-sky-300 block">
            Medication Adherence
          </span>
          <span className="text-lg font-black text-sky-900 dark:text-sky-100 block">
            Morning Taken ✓
          </span>
          <p className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">
            Propranolol 40mg logged at 8:25 AM
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 space-y-1">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
            Daily Comfort
          </span>
          <span className="text-lg font-black text-amber-900 dark:text-amber-100 block">
            Feeling Good 😊
          </span>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
            Logged today: No active headaches
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-400 space-y-1">
          <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 block">
            Next Consultation
          </span>
          <span className="text-lg font-black text-indigo-900 dark:text-indigo-100 block">
            Tomorrow, 10:30 AM
          </span>
          <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-medium">
            Dr. Priya Sharma, MD (Neurology)
          </p>
        </div>
      </div>

      {/* Messages from Family */}
      <div className="space-y-3 pt-2">
        <h4 className="font-black text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-rose-500" />
          <span>Loving Family Messages ({messages.length})</span>
        </h4>

        <div className="space-y-2.5">
          {messages.map((msg, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-900 dark:text-slate-100">{msg.sender}</span>
                <span className="text-slate-400 font-mono text-[10px]">{msg.time}</span>
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                "{msg.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Send loving message box */}
        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border-2 border-rose-400/40 space-y-2">
          <label className="text-xs font-black text-rose-900 dark:text-rose-200 block">
            Send an encouraging note to Aarav’s home screen:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={familyNote}
              onChange={(e) => setFamilyNote(e.target.value)}
              placeholder="e.g. You are doing great, Dad! Love, Chloe."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-sm font-medium focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
            />
            <AnimatedButton
              variant="primary"
              size="md"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={handleSendMessage}
            >
              Send Note
            </AnimatedButton>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
