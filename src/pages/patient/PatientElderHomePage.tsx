import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  X,
  Volume2,
  Stethoscope,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { ElderHeader } from '../../components/elder/ElderHeader'
import { ElderActionGrid } from '../../components/elder/ElderActionGrid'
import { GuidedVisitModal } from '../../components/elder/GuidedVisitModal'
import { MedicationReminderBoard } from '../../components/elder/MedicationReminderBoard'
import { ImOkayCheckin } from '../../components/elder/ImOkayCheckin'
import { FamilyAssistView } from '../../components/elder/FamilyAssistView'
import { SimpleHealthStoryView } from '../../components/elder/SimpleHealthStoryView'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useNotifications } from '../../contexts/NotificationContext'

export const PatientElderHomePage: React.FC = () => {
  const navigate = useNavigate()
  const { speakText, settings } = useAccessibility()
  const { notifyInfo } = useNotifications()

  const [activeModal, setActiveModal] = useState<
    'none' | 'guided_visit' | 'family_assist' | 'simple_story' | 'appointments'
  >('none')

  // Voice Navigation command router
  const handleVoiceNavigate = (command: string) => {
    const c = command.toLowerCase()
    if (c.includes('talk') || c.includes('visit') || c.includes('start')) {
      speakText('Opening guided visit mode.')
      setActiveModal('guided_visit')
    } else if (c.includes('report') || c.includes('scan') || c.includes('doc')) {
      speakText('Opening your medical reports.')
      navigate('/patient/documents')
    } else if (c.includes('story') || c.includes('history')) {
      speakText('Opening your health story in simple words.')
      setActiveModal('simple_story')
    } else if (c.includes('appointment') || c.includes('doctor')) {
      speakText('Opening your appointment details.')
      setActiveModal('appointments')
    } else if (c.includes('family') || c.includes('daughter') || c.includes('chloe')) {
      speakText('Opening Family Assist.')
      setActiveModal('family_assist')
    } else if (c.includes('medicine') || c.includes('pill')) {
      speakText('Scrolling to your medication reminder board.')
      const el = document.getElementById('medication-board')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else if (c.includes('okay') || c.includes('check')) {
      speakText('Scrolling to your I am okay check-in.')
      const el = document.getElementById('im-okay-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      speakText(`Heard "${command}". Please tap any large action card.`)
      notifyInfo('Voice Command', `Heard "${command}". Tap a card or speak again.`)
    }
  }

  const handleActionSelect = (
    actionId: 'talk' | 'reports' | 'story' | 'appointments' | 'family'
  ) => {
    switch (actionId) {
      case 'talk':
        setActiveModal('guided_visit')
        break
      case 'reports':
        navigate('/patient/documents')
        break
      case 'story':
        setActiveModal('simple_story')
        break
      case 'appointments':
        setActiveModal('appointments')
        break
      case 'family':
        setActiveModal('family_assist')
        break
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* 1. Elder Header with Read Aloud & Voice Nav */}
      <ElderHeader onVoiceNavigate={handleVoiceNavigate} />

      {/* 2. Five Large Actions Grid */}
      <ElderActionGrid onSelectAction={handleActionSelect} />

      {/* 3. "I'm Okay" Well-Being Check-in Interface */}
      <div id="im-okay-section" className="scroll-mt-24">
        <ImOkayCheckin />
      </div>

      {/* 4. Medication Reminder Board */}
      <div id="medication-board" className="scroll-mt-24">
        <MedicationReminderBoard />
      </div>

      {/* MODAL 1: Guided Visit Mode */}
      <GuidedVisitModal
        isOpen={activeModal === 'guided_visit'}
        onClose={() => setActiveModal('none')}
      />

      {/* MODAL 2: Simple Health Story View */}
      {activeModal === 'simple_story' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl my-6">
            <SimpleHealthStoryView onClose={() => setActiveModal('none')} />
          </div>
        </div>
      )}

      {/* MODAL 3: Family Assist View */}
      {activeModal === 'family_assist' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl my-6">
            <FamilyAssistView onClose={() => setActiveModal('none')} />
          </div>
        </div>
      )}

      {/* MODAL 4: Appointments Modal */}
      {activeModal === 'appointments' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl my-6">
            <GlassCard
              variant="elevated"
              className="p-6 sm:p-8 space-y-6 border-3 border-slate-900 dark:border-white shadow-2xl bg-white dark:bg-slate-900"
            >
              <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  <h3 className="font-black text-xl text-slate-900 dark:text-slate-100">
                    My Upcoming Appointment
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-400 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                  Confirmed Visit
                </span>
                <h4 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  Dr. Priya Sharma, MD
                </h4>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  Integrative Neurology Specialist
                </p>
                <div className="pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Tomorrow • 24 September 2026 at 10:30 AM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>AyuCare Integrative Care Suite 402</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <span className="font-black text-slate-900 dark:text-slate-100 block">
                  Questions to ask Dr. Sharma:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  <li>"Can I adjust my morning pill timing if I eat breakfast earlier?"</li>
                  <li>"Should I still rest in dark rooms when light flashing happens?"</li>
                  <li>"Are my brain scan results fully recorded?"</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  speakText(
                    'Your appointment with Dr. Priya Sharma is tomorrow at 10:30 AM at AyuCare Suite 402.'
                  )
                }}
                className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-black text-base flex items-center justify-center gap-2 min-h-[56px]"
              >
                <Volume2 className="w-5 h-5" />
                <span>Read Appointment Aloud</span>
              </button>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  )
}
