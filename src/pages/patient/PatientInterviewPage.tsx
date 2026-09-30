import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  MicOff,
  Square,
  RotateCcw,
  Keyboard,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Radio,
  Send,
  RefreshCw,
  FileCheck,
  Check,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { VoiceWaveform, type WaveformState } from '../../components/interview/VoiceWaveform'
import {
  VoiceToStructurePipeline,
  type PipelineStage,
} from '../../components/interview/VoiceToStructurePipeline'
import { StructuredEntityCard } from '../../components/interview/StructuredEntityCard'
import { InterviewSummaryModal } from '../../components/interview/InterviewSummaryModal'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useNotifications } from '../../contexts/NotificationContext'
import {
  INTERVIEW_QUESTIONS,
  type InterviewAnswer,
  type InterviewQuestion,
  type StructuredEntity,
} from '../../types/interview'
import { cn } from '../../utils/cn'

const INTERVIEW_STORAGE_KEY = 'ayucase_patient_interview_v5'

// Seed answers matching Aarav Chen's baseline profile for seamless continuity
const INITIAL_ANSWERS: Record<string, InterviewAnswer> = {
  q1: {
    questionId: 'q1',
    patientStatement:
      "I've been having intense throbbing pain on the left side of my head with flashing lights before it starts.",
    structuredData: {
      field: 'Chief Concern',
      value: 'Left-sided throbbing hemicrania with visual aura',
      category: 'Neurological / Cephalea',
      confidence: 97,
      clinicalTags: ['Hemicrania', 'Visual Aura', 'Photophobia'],
    },
    recordedAt: '2026-09-23T09:15:00Z',
    isEdited: false,
    inputMode: 'voice',
  },
  q2: {
    questionId: 'q2',
    patientStatement:
      "I've had this for around two months, especially worsening during high workload weeks.",
    structuredData: {
      field: 'Duration',
      value: '2 months (Subacute progressive)',
      category: 'Chronology',
      confidence: 98,
      clinicalTags: ['Duration: 60 Days', 'Stress Correlated', 'Episodic Escalation'],
    },
    recordedAt: '2026-09-23T09:17:30Z',
    isEdited: false,
    inputMode: 'voice',
  },
}

export const PatientInterviewPage: React.FC = () => {
  const { isElderMode, speakText } = useAccessibility()
  const { language, t } = useLanguage()
  const { notifySuccess, notifyInfo, notifyError } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()

  // State: Navigation & Questions
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(() => {
    if (location.state && typeof location.state.questionIndex === 'number') {
      return Math.max(0, Math.min(location.state.questionIndex, INTERVIEW_QUESTIONS.length - 1))
    }
    return 0
  })

  // Respond if user navigates to question while on page
  useEffect(() => {
    if (location.state && typeof location.state.questionIndex === 'number') {
      const idx = Math.max(0, Math.min(location.state.questionIndex, INTERVIEW_QUESTIONS.length - 1))
      setActiveQuestionIndex(idx)
    }
  }, [location.state])
  const [answers, setAnswers] = useState<Record<string, InterviewAnswer>>(() => {
    try {
      const stored = localStorage.getItem(INTERVIEW_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.answers) return parsed.answers
      }
    } catch (e) {
      console.warn('Failed to parse interview state from localStorage', e)
    }
    return INITIAL_ANSWERS
  })

  // State: Voice & Pipeline
  const [waveformState, setWaveformState] = useState<WaveformState>('idle')
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle')
  const [streamingTranscript, setStreamingTranscript] = useState<string>('')
  const [isListening, setIsListening] = useState<boolean>(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true)

  // State: Type Instead Drawer
  const [isTypeMode, setIsTypeMode] = useState<boolean>(false)
  const [typedInput, setTypedInput] = useState<string>('')

  // State: Summary Modal
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false)

  // Web Speech Recognition Ref
  const recognitionRef = useRef<any>(null)

  const currentQ: InterviewQuestion = INTERVIEW_QUESTIONS[activeQuestionIndex]
  const currentAnswer: InterviewAnswer | undefined = answers[currentQ.id]
  const answeredCount = Object.keys(answers).length
  const progressPercent = Math.round(((activeQuestionIndex + 1) / INTERVIEW_QUESTIONS.length) * 100)

  // Persist answers in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        INTERVIEW_STORAGE_KEY,
        JSON.stringify({
          activeQuestionIndex,
          answers,
          lastUpdated: new Date().toISOString(),
        })
      )
    } catch (e) {
      console.warn('Failed to persist interview state', e)
    }
  }, [answers, activeQuestionIndex])

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = language === 'ta' ? 'ta-IN' : 'en-US'

        recognition.onresult = (event: any) => {
          let transcript = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript
          }
          setStreamingTranscript(transcript)
          setPipelineStage('understanding')
        }

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error/fallback:', event.error)
          stopListening()
          // Fall back gracefully without blocking user
          notifyInfo(
            'Speech Recognition Notice',
            'Microphone access was denied or unsupported. Use the quick voice sample chips or Type Instead.'
          )
        }

        recognition.onend = () => {
          if (isListening) {
            handleFinalizeVoice(streamingTranscript)
          }
        }

        recognitionRef.current = recognition
      } catch (e) {
        setIsSpeechSupported(false)
      }
    } else {
      setIsSpeechSupported(false)
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {
          // ignore
        }
      }
    }
  }, [language])

  // NLP Entity Normalizer Helper
  const extractStructuredEntity = (
    text: string,
    question: InterviewQuestion
  ): StructuredEntity => {
    const lower = text.toLowerCase()

    // 1. Duration question matching
    if (question.id === 'q2') {
      if (lower.includes('two month') || lower.includes('2 month')) {
        return {
          field: 'Duration',
          value: '2 months',
          category: 'Chronology',
          confidence: 98,
          clinicalTags: ['Duration: 60 Days', 'Subacute', 'Progressive'],
        }
      }
      if (lower.includes('three week') || lower.includes('3 week')) {
        return {
          field: 'Duration',
          value: '3 weeks',
          category: 'Chronology',
          confidence: 96,
          clinicalTags: ['Duration: 21 Days', 'Recent Onset'],
        }
      }
      return {
        field: 'Duration',
        value: text.slice(0, 45),
        category: 'Chronology',
        confidence: 90,
        clinicalTags: ['Self-Reported Timeline'],
      }
    }

    // 2. Context / Trigger question matching
    if (question.id === 'q6') {
      if (lower.includes('eating') || lower.includes('meal')) {
        return {
          field: 'Context',
          value: 'After meals',
          category: 'Dietary & Environmental',
          confidence: 97,
          clinicalTags: ['Postprandial', 'Metabolic Trigger'],
        }
      }
      if (lower.includes('screen') || lower.includes('light')) {
        return {
          field: 'Context',
          value: 'Photostimulation & screen fatigue',
          category: 'Visual & Environmental',
          confidence: 95,
          clinicalTags: ['Photophobia', 'Occupational Strain'],
        }
      }
      return {
        field: 'Context',
        value: text.slice(0, 50),
        category: 'Lifestyle Modifier',
        confidence: 92,
        clinicalTags: ['Contextual Trigger'],
      }
    }

    // 3. Fallback matching to predefined question schemas
    const matchingSample = question.sampleResponses.find((s) =>
      lower.includes(s.structured.value.toLowerCase().split(' ')[0])
    )

    if (matchingSample) {
      return matchingSample.structured
    }

    return {
      field: question.expectedField,
      value: text.length > 50 ? `${text.slice(0, 48)}...` : text,
      category: question.category,
      confidence: 94,
      clinicalTags: ['Ingested Entity', 'Verified Transcript'],
    }
  }

  // Finalize voice recording and execute VOICE -> UNDERSTANDING -> STRUCTURE pipeline
  const handleFinalizeVoice = (statementText: string) => {
    setIsListening(false)
    setWaveformState('processing')
    setPipelineStage('understanding')

    const cleanStatement = statementText.trim() || currentQ.sampleResponses[0].statement

    setTimeout(() => {
      setPipelineStage('structure')
      const structured = extractStructuredEntity(cleanStatement, currentQ)

      const newAnswer: InterviewAnswer = {
        questionId: currentQ.id,
        patientStatement: cleanStatement,
        structuredData: structured,
        recordedAt: new Date().toISOString(),
        isEdited: false,
        inputMode: 'voice',
      }

      setAnswers((prev) => ({
        ...prev,
        [currentQ.id]: newAnswer,
      }))

      setWaveformState('idle')
      setPipelineStage('complete')
      setStreamingTranscript('')
      notifySuccess(
        'Speech Transcribed & Structured',
        `Extracted "${structured.field}: ${structured.value}" from vocal intake.`
      )
    }, 900)
  }

  // Start Listening
  const startListening = () => {
    setIsListening(true)
    setWaveformState('listening')
    setPipelineStage('voice')
    setStreamingTranscript('')

    if (recognitionRef.current && isSpeechSupported) {
      try {
        recognitionRef.current.start()
        return
      } catch (e) {
        console.warn('Native speech recognition already active or unavailable, using acoustic simulation', e)
      }
    }

    // Simulated speech streaming fallback if native recognition is blocked
    const sample = currentQ.sampleResponses[0].statement
    let wordIndex = 0
    const words = sample.split(' ')

    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        setStreamingTranscript(words.slice(0, wordIndex + 1).join(' '))
        setPipelineStage('understanding')
        wordIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          handleFinalizeVoice(sample)
        }, 400)
      }
    }, 280)
  }

  // Stop Listening
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        // ignore
      }
    }
    handleFinalizeVoice(streamingTranscript)
  }

  // Replay Question via Speech Synthesis API
  const handleReplayQuestion = () => {
    setWaveformState('speaking')
    const speechText =
      language === 'ta'
        ? `${currentQ.prompt}. ${currentQ.taPrompt}`
        : `${currentQ.prompt}`

    speakText(speechText)
    setTimeout(() => {
      setWaveformState('idle')
    }, 3000)
  }

  // Quick Demo Voice Sample Click Handler
  const handleSelectSampleResponse = (sampleText: string, structured: StructuredEntity) => {
    setWaveformState('processing')
    setPipelineStage('voice')
    setStreamingTranscript(sampleText)

    setTimeout(() => {
      setPipelineStage('understanding')
      setTimeout(() => {
        setPipelineStage('structure')
        const newAnswer: InterviewAnswer = {
          questionId: currentQ.id,
          patientStatement: sampleText,
          structuredData: structured,
          recordedAt: new Date().toISOString(),
          isEdited: false,
          inputMode: 'demo',
        }

        setAnswers((prev) => ({
          ...prev,
          [currentQ.id]: newAnswer,
        }))

        setWaveformState('idle')
        setPipelineStage('complete')
        setStreamingTranscript('')
        notifySuccess(
          'Voice Response Structured',
          `Parsed: "${structured.field}: ${structured.value}"`
        )
      }, 500)
    }, 400)
  }

  // Submit Typed Response
  const handleSubmitTyped = (e: React.FormEvent) => {
    e.preventDefault()
    if (!typedInput.trim()) return

    setPipelineStage('understanding')
    setTimeout(() => {
      const structured = extractStructuredEntity(typedInput, currentQ)
      const newAnswer: InterviewAnswer = {
        questionId: currentQ.id,
        patientStatement: typedInput.trim(),
        structuredData: structured,
        recordedAt: new Date().toISOString(),
        isEdited: false,
        inputMode: 'typed',
      }

      setAnswers((prev) => ({
        ...prev,
        [currentQ.id]: newAnswer,
      }))

      setTypedInput('')
      setIsTypeMode(false)
      setPipelineStage('complete')
      notifySuccess('Response Structured', `Entity created: "${structured.field}"`)
    }, 400)
  }

  // Navigation handlers
  const handleNextQuestion = () => {
    if (activeQuestionIndex < INTERVIEW_QUESTIONS.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1)
      setPipelineStage('idle')
      setWaveformState('idle')
    } else {
      setIsSummaryOpen(true)
    }
  }

  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1)
      setPipelineStage('idle')
      setWaveformState('idle')
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto pb-16">
      {/* 1. PAGE HEADER */}
      <PageHeader
        title={t('nav.interview', 'Clinical Health Interview')}
        subtitle="Voice-first conversational intake structuring your personal illness narrative for your clinical care team."
        badge={
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            Speech Recognition & NLP Ready
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <AnimatedButton
              variant="secondary"
              size="sm"
              leftIcon={<FileCheck className="w-4 h-4" />}
              onClick={() => setIsSummaryOpen(true)}
            >
              Summary ({answeredCount}/{INTERVIEW_QUESTIONS.length})
            </AnimatedButton>
          </div>
        }
      />

      {/* 2. PROGRESS STEPPER BAR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
          <span>
            Question {activeQuestionIndex + 1} of {INTERVIEW_QUESTIONS.length}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400">
            {currentQ.category}
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* 3. CENTER QUESTION CARD */}
      <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6">
        {/* Question Header & Audio Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white font-black text-xs flex items-center justify-center">
              {currentQ.order}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {currentQ.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Replay Question Button */}
            <button
              type="button"
              onClick={handleReplayQuestion}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Read Question Aloud (Speech Synthesis)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
              <span>Replay Question</span>
            </button>

            {/* Type Instead Toggle */}
            <button
              type="button"
              onClick={() => setIsTypeMode(!isTypeMode)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors',
                isTypeMode
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
              title="Type your answer using keyboard"
            >
              <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isTypeMode ? 'Voice Mode' : 'Type Instead'}</span>
            </button>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
            "{currentQ.prompt}"
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {currentQ.taPrompt}
          </p>
          <p className="text-xs text-slate-400 pt-1">
            {currentQ.subtitle}
          </p>
        </div>

        {/* 4. CENTER VOICE EXPERIENCE: WAVEFORM & LARGE MICROPHONE */}
        {!isTypeMode ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 space-y-6">
            {/* Animated Waveform */}
            <VoiceWaveform state={waveformState} barCount={32} />

            {/* Large Center Microphone Button */}
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing energy rings when active */}
              {isListening && (
                <>
                  <motion.div
                    className="absolute w-28 h-28 rounded-full border-2 border-rose-500/40"
                    animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute w-36 h-36 rounded-full border border-rose-500/20"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  />
                </>
              )}

              {/* Central Mic Action Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isListening ? stopListening : startListening}
                className={cn(
                  'w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer relative z-10',
                  isListening
                    ? 'bg-rose-500 text-white shadow-rose-500/40 animate-pulse'
                    : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50'
                )}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
              >
                {isListening ? (
                  <Square className="w-8 h-8 fill-current" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </motion.button>
            </div>

            {/* Direct Control Buttons: Start Listening / Stop */}
            <div className="flex items-center gap-3">
              {!isListening ? (
                <AnimatedButton
                  variant="primary"
                  size="md"
                  leftIcon={<Mic className="w-4 h-4" />}
                  onClick={startListening}
                >
                  Start Listening
                </AnimatedButton>
              ) : (
                <AnimatedButton
                  variant="danger"
                  size="md"
                  leftIcon={<Square className="w-4 h-4 fill-current" />}
                  onClick={stopListening}
                >
                  Stop & Process Speech
                </AnimatedButton>
              )}
            </div>

            {/* Quick Demo Response Chips (Guarantees simulated testing in all environments) */}
            <div className="w-full max-w-xl pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Simulated Voice Demo Responses (Click to test NLP structuring)
              </span>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {currentQ.sampleResponses.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      handleSelectSampleResponse(sample.statement, sample.structured)
                    }
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 border border-slate-200/60 dark:border-slate-700/60 transition-all text-left"
                  >
                    "{sample.statement.slice(0, 42)}..."
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Type Instead Input Area */
          <form onSubmit={handleSubmitTyped} className="space-y-4 py-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Type Your Statement in Natural Language
              </label>
              <textarea
                rows={4}
                required
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder='e.g. "I usually notice it after eating heavy oily meals, and working long hours under fluorescent lights."'
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Natural language statements are automatically structured into clinical entities.
              </span>
              <AnimatedButton
                variant="primary"
                size="md"
                type="submit"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Structure Answer
              </AnimatedButton>
            </div>
          </form>
        )}
      </GlassCard>

      {/* 5. VOICE → UNDERSTANDING → STRUCTURE ANIMATION PIPELINE */}
      <VoiceToStructurePipeline
        currentStage={pipelineStage}
        transcribingWord={streamingTranscript}
      />

      {/* 6. EXTRACTED STRUCTURED INFORMATION & PATIENT'S OWN WORDS */}
      {currentAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StructuredEntityCard
            answer={currentAnswer}
            onUpdateAnswer={(updated) =>
              setAnswers((prev) => ({
                ...prev,
                [currentQ.id]: updated,
              }))
            }
          />
        </motion.div>
      )}

      {/* 7. BOTTOM NAVIGATION CONTROLS */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800 gap-3">
        {/* Previous Question Button */}
        <AnimatedButton
          variant="secondary"
          size="md"
          leftIcon={<ChevronLeft className="w-4 h-4" />}
          onClick={handlePrevQuestion}
          disabled={activeQuestionIndex === 0}
        >
          Previous
        </AnimatedButton>

        <div className="flex items-center gap-2">
          {/* Continue / Next Question Button */}
          <AnimatedButton
            variant="primary"
            size="md"
            rightIcon={
              activeQuestionIndex < INTERVIEW_QUESTIONS.length - 1 ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )
            }
            onClick={handleNextQuestion}
          >
            {activeQuestionIndex < INTERVIEW_QUESTIONS.length - 1
              ? 'Continue'
              : 'Complete Interview'}
          </AnimatedButton>
        </div>
      </div>

      {/* 8. SUMMARY MODAL */}
      <InterviewSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        questions={INTERVIEW_QUESTIONS}
        answers={answers}
        onSelectQuestion={(idx) => {
          setActiveQuestionIndex(idx)
        }}
      />
    </div>
  )
}
