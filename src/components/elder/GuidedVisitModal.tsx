import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileCheck,
  Stethoscope,
  Pill,
  Heart,
  ChevronRight,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import { GUIDED_VISIT_STEPS, type GuidedVisitStep } from '../../types/elder'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

export interface GuidedVisitModalProps {
  isOpen: boolean
  onClose: () => void
  initialStepIndex?: number
}

export const GuidedVisitModal: React.FC<GuidedVisitModalProps> = ({
  isOpen,
  onClose,
  initialStepIndex = 0,
}) => {
  const { speakText, settings } = useAccessibility()
  const { notifySuccess } = useNotifications()

  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex)
  const [selectedResponse, setSelectedResponse] = useState<string>('')
  const [isListeningVoice, setIsListeningVoice] = useState(false)

  const currentStep = GUIDED_VISIT_STEPS[currentStepIndex] || GUIDED_VISIT_STEPS[0]
  const isLastStep = currentStepIndex === GUIDED_VISIT_STEPS.length - 1
  const isXLarge = settings.fontSize === 'xlarge'

  // Play audio prompt when step changes
  useEffect(() => {
    if (isOpen && currentStep) {
      speakText(`${currentStep.title}. ${currentStep.subtitle}. ${currentStep.audioPrompt}`)
    }
  }, [currentStepIndex, isOpen])

  if (!isOpen) return null

  const handleNext = () => {
    if (isLastStep) {
      notifySuccess('Visit Ready', 'Your guided visit is complete and ready for Dr. Priya Sharma!')
      onClose()
    } else {
      setCurrentStepIndex((prev) => Math.min(prev + 1, GUIDED_VISIT_STEPS.length - 1))
    }
  }

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleToggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    if (isListeningVoice) {
      setIsListeningVoice(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.lang = 'en-US'
      recognition.onstart = () => setIsListeningVoice(true)
      recognition.onend = () => setIsListeningVoice(false)
      recognition.onerror = () => setIsListeningVoice(false)
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript
        setSelectedResponse(text)
        setIsListeningVoice(false)
      }
      recognition.start()
    } catch {
      setIsListeningVoice(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl my-6"
      >
        <GlassCard
          variant="elevated"
          className="p-6 sm:p-8 space-y-6 border-3 border-slate-900 dark:border-white shadow-2xl bg-white dark:bg-slate-900"
        >
          {/* Top Bar: Progress & Close */}
          <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black px-3 py-1 rounded-full bg-emerald-600 text-white">
                Step {currentStep.stepNumber} of 6
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
                Guided Visit Mode
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  speakText(`${currentStep.title}. ${currentStep.subtitle}. ${currentStep.audioPrompt}`)
                }
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 font-bold flex items-center gap-1.5 text-xs"
                title="Read instructions aloud"
              >
                <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Read Aloud</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                title="Exit Guided Visit"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep.stepNumber / 6) * 100}%` }}
            />
          </div>

          {/* Step Content */}
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <h2
                className={cn(
                  'font-black text-slate-900 dark:text-slate-50 tracking-tight leading-tight',
                  isXLarge ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                )}
              >
                {currentStep.title}
              </h2>
              <p className="text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {currentStep.subtitle}
              </p>
            </div>

            {/* Audio Prompt Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/30 space-y-2">
              <p
                className={cn(
                  'font-medium text-slate-800 dark:text-slate-200 leading-relaxed',
                  isXLarge ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                )}
              >
                "{currentStep.audioPrompt}"
              </p>
            </div>

            {/* Step-Specific Interactive Views */}
            {currentStep.stepNumber === 1 && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <p className="font-bold text-base text-slate-900 dark:text-slate-100">
                  You are in good hands, Aarav.
                </p>
                <p>
                  We have prepared your visit for Dr. Priya Sharma. Tap "Continue" below to answer a few quick questions or review your medicines.
                </p>
              </div>
            )}

            {currentStep.stepNumber === 2 && (
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-800 dark:text-slate-200 block">
                  Select how you are feeling, or speak into the microphone:
                </label>

                {currentStep.sampleOptions && (
                  <div className="grid grid-cols-1 gap-2">
                    {currentStep.sampleOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedResponse(opt)}
                        className={cn(
                          'p-4 rounded-2xl border-2 text-left font-bold text-base transition-all select-none',
                          selectedResponse === opt
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Voice Input Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleToggleVoiceInput}
                    className={cn(
                      'w-full py-3 px-4 rounded-2xl border-2 font-black text-base flex items-center justify-center gap-2 transition-all min-h-[56px]',
                      isListeningVoice
                        ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700'
                    )}
                  >
                    {isListeningVoice ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    <span>{isListeningVoice ? 'Listening... Speak now' : 'Or Tap to Speak Your Symptoms'}</span>
                  </button>
                </div>
              </div>
            )}

            {currentStep.stepNumber === 3 && (
              <div className="space-y-2">
                {[
                  { name: 'Brain MRI Scan 3T', facility: 'Apollo Hospital', status: 'Healthy & Normal' },
                  { name: 'Autonomic Reflex Screen', facility: 'CareLife Clinic', status: 'Checked' },
                  { name: 'Prescription Schedule', facility: 'Dr. Priya Sharma', status: 'Active' },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{doc.name}</h4>
                      <p className="text-xs text-slate-500">{doc.facility}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {currentStep.stepNumber === 4 && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-500/30 space-y-1">
                  <h4 className="font-black text-base text-amber-900 dark:text-amber-200">
                    Daily Medicine: Propranolol 40mg
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Take 1 round pink pill in the morning and 1 before bed.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedResponse('yes')}
                    className={cn(
                      'p-4 rounded-2xl border-2 font-black text-base text-center transition-all min-h-[64px]',
                      selectedResponse === 'yes'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                    )}
                  >
                    ✓ Yes, Taken
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedResponse('no')}
                    className={cn(
                      'p-4 rounded-2xl border-2 font-black text-base text-center transition-all min-h-[64px]',
                      selectedResponse === 'no'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-amber-500'
                    )}
                  >
                    Not Yet
                  </button>
                </div>
              </div>
            )}

            {currentStep.stepNumber === 5 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 space-y-2 text-sm leading-relaxed">
                <div className="flex items-center gap-2 font-black text-slate-900 dark:text-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Everything is Ready for Your Doctor:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  <li>Your main concern: Left-side throbbing headache with flashing lights.</li>
                  <li>Your brain scan is healthy and on file.</li>
                  <li>Your daily medicines are tracked and verified.</li>
                  <li>Your exact words are saved so nothing is lost.</li>
                </ul>
              </div>
            )}

            {currentStep.stepNumber === 6 && (
              <div className="p-6 rounded-2xl bg-emerald-600 text-white text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h3 className="text-xl sm:text-2xl font-black">You are All Set!</h3>
                <p className="text-sm sm:text-base text-white/90 max-w-md mx-auto">
                  Dr. Priya Sharma will review your story before your consultation. We will remind you 30 minutes prior.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t-2 border-slate-200 dark:border-slate-800">
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={handlePrev}
              className={cn(
                'px-5 py-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all flex items-center gap-2 min-h-[56px]',
                currentStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed border-slate-300 text-slate-400'
                  : 'border-slate-900 dark:border-slate-200 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base sm:text-lg border-2 border-emerald-700 shadow-md flex items-center gap-2 transition-transform active:scale-95 min-h-[56px]"
            >
              <span>{isLastStep ? 'Finish Guided Visit' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
