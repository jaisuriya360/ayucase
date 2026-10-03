import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { InterviewHeader } from '../../components/interview/InterviewHeader'
import { InterviewProgress } from '../../components/interview/InterviewProgress'
import { QuestionCard } from '../../components/interview/QuestionCard'
import { VoiceControls } from '../../components/interview/VoiceControls'
import { AnswerEditor } from '../../components/interview/AnswerEditor'
import { InterviewNavigation } from '../../components/interview/InterviewNavigation'
import { VoiceToStructurePipeline, type PipelineStage } from '../../components/interview/VoiceToStructurePipeline'
import type { WaveformState } from '../../components/interview/VoiceWaveform'
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

const INTERVIEW_STORAGE_KEY = 'ayucase_patient_interview_v5'

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
  const { speakText } = useAccessibility()
  const { language } = useLanguage()
  const { notifySuccess, notifyInfo } = useNotifications()
  const location = useLocation()

  // Navigation & Questions State
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(() => {
    if (location.state && typeof location.state.questionIndex === 'number') {
      return Math.max(0, Math.min(location.state.questionIndex, INTERVIEW_QUESTIONS.length - 1))
    }
    return 0
  })

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

  // Voice & Pipeline State
  const [waveformState, setWaveformState] = useState<WaveformState>('idle')
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle')
  const [streamingTranscript, setStreamingTranscript] = useState<string>('')
  const [isListening, setIsListening] = useState<boolean>(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true)

  // Type Mode State
  const [isTypeMode, setIsTypeMode] = useState<boolean>(false)
  const [typedInput, setTypedInput] = useState<string>('')

  // Summary Modal State
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false)

  const recognitionRef = useRef<any>(null)

  const currentQ: InterviewQuestion = INTERVIEW_QUESTIONS[activeQuestionIndex]
  const currentAnswer: InterviewAnswer | undefined = answers[currentQ.id]
  const answeredCount = Object.keys(answers).length

  // Persist answers
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

  // Web Speech Recognition
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
    }, 800)
  }

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

    // Acoustic simulation fallback
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
    }, 260)
  }

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
      }, 400)
    }, 350)
  }

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
      {/* 1. Header with Breadcrumb and Summary action */}
      <InterviewHeader
        answeredCount={answeredCount}
        totalQuestions={INTERVIEW_QUESTIONS.length}
        onOpenSummary={() => setIsSummaryOpen(true)}
      />

      {/* 2. Progress Stepper Bar */}
      <InterviewProgress
        currentQuestionIndex={activeQuestionIndex}
        totalQuestions={INTERVIEW_QUESTIONS.length}
        category={currentQ.category}
      />

      {/* 3. Question Card & Controls */}
      <QuestionCard
        question={currentQ}
        isTypeMode={isTypeMode}
        onToggleTypeMode={() => setIsTypeMode(!isTypeMode)}
        onReplayQuestion={handleReplayQuestion}
      >
        {!isTypeMode ? (
          <VoiceControls
            question={currentQ}
            isListening={isListening}
            waveformState={waveformState}
            onStartListening={startListening}
            onStopListening={stopListening}
            onSelectSampleResponse={handleSelectSampleResponse}
          />
        ) : (
          <AnswerEditor
            typedInput={typedInput}
            onChange={setTypedInput}
            onSubmit={handleSubmitTyped}
          />
        )}
      </QuestionCard>

      {/* 4. Voice to Structure Processing Pipeline */}
      <VoiceToStructurePipeline
        currentStage={pipelineStage}
        transcribingWord={streamingTranscript}
      />

      {/* 5. Extracted Structured Information & Patient's Own Words */}
      {currentAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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

      {/* 6. Bottom Navigation Controls */}
      <InterviewNavigation
        currentIndex={activeQuestionIndex}
        totalQuestions={INTERVIEW_QUESTIONS.length}
        hasAnswer={!!currentAnswer}
        onPrevious={handlePrevQuestion}
        onNext={handleNextQuestion}
      />

      {/* 7. Summary Modal */}
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
