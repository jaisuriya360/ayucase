import React from 'react'
import { motion } from 'framer-motion'
import { Mic, Square } from 'lucide-react'
import { VoiceWaveform, type WaveformState } from './VoiceWaveform'
import { AyuButton } from '../ui/AyuButton'
import type { InterviewQuestion, StructuredEntity } from '../../types/interview'
import { cn } from '../../utils/cn'

export interface VoiceControlsProps {
  question: InterviewQuestion
  isListening: boolean
  waveformState: WaveformState
  onStartListening: () => void
  onStopListening: () => void
  onSelectSampleResponse: (statement: string, structured: StructuredEntity) => void
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  question,
  isListening,
  waveformState,
  onStartListening,
  onStopListening,
  onSelectSampleResponse,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-6 space-y-6">
      {/* Animated Voice Waveform */}
      <VoiceWaveform state={waveformState} barCount={32} />

      {/* Center Microphone Button */}
      <div className="relative flex items-center justify-center">
        {isListening && (
          <>
            <motion.div
              className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-rose-500/40"
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-rose-500/20"
              animate={{ scale: [1, 1.45, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
          </>
        )}

        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={isListening ? onStopListening : onStartListening}
          className={cn(
            'w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer relative z-10',
            isListening
              ? 'bg-rose-600 text-white shadow-rose-500/30'
              : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40'
          )}
          aria-label={isListening ? 'Stop listening' : 'Start speaking'}
        >
          {isListening ? (
            <Square className="w-8 h-8 fill-current" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </motion.button>
      </div>

      {/* Primary Action Button */}
      <div>
        {!isListening ? (
          <AyuButton
            variant="primary"
            size="md"
            leftIcon={<Mic className="w-4 h-4" />}
            onClick={onStartListening}
          >
            Start Speaking
          </AyuButton>
        ) : (
          <AyuButton
            variant="destructive"
            size="md"
            leftIcon={<Square className="w-4 h-4 fill-current" />}
            onClick={onStopListening}
          >
            Stop & Process Speech
          </AyuButton>
        )}
      </div>

      {/* Quick Demo Response Chips for Testing & Accessibility */}
      <div className="w-full max-w-xl pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2.5">
          Quick Demo Voice Statements (Simulated Intake)
        </span>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {question.sampleResponses.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectSampleResponse(sample.statement, sample.structured)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-800 border border-slate-200/80 dark:border-slate-800 transition-all text-left cursor-pointer"
            >
              "{sample.statement.slice(0, 42)}..."
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
