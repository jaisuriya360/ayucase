import React, { useState } from 'react'
import {
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Sun,
  Moon,
  ArrowRightLeft,
  CheckCircle2,
  Heart,
  Type,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { usePatient } from '../../contexts/PatientContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

export interface ElderHeaderProps {
  className?: string
  onVoiceNavigate?: (command: string) => void
}

export const ElderHeader: React.FC<ElderHeaderProps> = ({ className, onVoiceNavigate }) => {
  const {
    isElderMode,
    toggleElderMode,
    settings,
    updateSettings,
    speakText,
    simpleViewEnabled,
    toggleSimpleView,
  } = useAccessibility()
  const { patient } = usePatient()
  const { notifyInfo } = useNotifications()

  const [isListeningVoiceNav, setIsListeningVoiceNav] = useState(false)

  const greeting = `Good day, ${patient.name.split(' ')[0]}. Everything is calm and ready for you today.`

  const handleReadAloudHeader = () => {
    speakText(
      `${greeting} You have 5 large actions below. You can talk to AyuCase, see your reports, read your health story in simple words, check your appointments, or open Family Assist.`
    )
  }

  const handleToggleVoiceNav = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      notifyInfo('Voice Navigation', 'Voice recognition is ready in visual mode. Tap any card below.')
      return
    }

    if (isListeningVoiceNav) {
      setIsListeningVoiceNav(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.lang = 'en-US'
      recognition.onstart = () => setIsListeningVoiceNav(true)
      recognition.onend = () => setIsListeningVoiceNav(false)
      recognition.onerror = () => setIsListeningVoiceNav(false)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase()
        setIsListeningVoiceNav(false)
        if (onVoiceNavigate) {
          onVoiceNavigate(transcript)
        }
      }
      recognition.start()
    } catch {
      setIsListeningVoiceNav(false)
    }
  }

  const toggleFontSize = () => {
    const next = settings.fontSize === 'xlarge' ? 'large' : 'xlarge'
    updateSettings({ fontSize: next })
    notifyInfo('Text Size Updated', next === 'xlarge' ? 'Extra Large Text activated.' : 'Large Text set.')
  }

  return (
    <GlassCard
      variant="elevated"
      className={cn(
        'p-5 sm:p-7 border-2 border-slate-900 dark:border-slate-300 shadow-md space-y-4',
        className
      )}
    >
      {/* Top Banner Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-200 dark:border-slate-800 pb-4">
        {/* Mode Indicator & High Contrast Badge */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-black tracking-wide uppercase text-emerald-800 dark:text-emerald-300">
            ELDER MODE ACTIVE
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            High Contrast
          </span>
        </div>

        {/* Accessibility Quick Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* SimpleView Toggle */}
          <button
            type="button"
            onClick={toggleSimpleView}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 transition-all flex items-center gap-1.5 select-none',
              simpleViewEnabled
                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'
            )}
            title="Convert medical terms into everyday words"
          >
            <Sparkles className="w-4 h-4" />
            <span>SimpleView: {simpleViewEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Extra Large Text Toggle */}
          <button
            type="button"
            onClick={toggleFontSize}
            className="px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 border-slate-900 dark:border-slate-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 flex items-center gap-1"
            title="Toggle Extra Large Text"
          >
            <Type className="w-4 h-4" />
            <span>Text: {settings.fontSize === 'xlarge' ? 'Extra Large' : 'Large'}</span>
          </button>

          {/* Switch to Standard Mode */}
          <button
            type="button"
            onClick={toggleElderMode}
            className="px-3 py-1.5 rounded-xl text-xs font-extrabold border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Standard View</span>
          </button>
        </div>
      </div>

      {/* Main Greeting & Voice Prompts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
            {greeting}
          </h1>
          <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-300">
            Tap any large card below, or use the speak buttons to listen.
          </p>
        </div>

        {/* Read Aloud & Voice Nav Hero Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleReadAloudHeader}
            className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base border-2 border-emerald-700 shadow-md flex items-center gap-2 transition-transform active:scale-95 min-h-[56px]"
          >
            <Volume2 className="w-5 h-5" />
            <span>Read Aloud</span>
          </button>

          <button
            type="button"
            onClick={handleToggleVoiceNav}
            className={cn(
              'px-4 py-3 rounded-2xl font-black text-sm sm:text-base border-2 shadow-md flex items-center gap-2 transition-all min-h-[56px]',
              isListeningVoiceNav
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-900 dark:border-slate-200 hover:bg-slate-50'
            )}
          >
            {isListeningVoiceNav ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            <span>{isListeningVoiceNav ? 'Listening...' : 'Voice Navigation'}</span>
          </button>
        </div>
      </div>
    </GlassCard>
  )
}
