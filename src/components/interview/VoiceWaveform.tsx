import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, Volume2, Sparkles, Radio } from 'lucide-react'
import { cn } from '../../utils/cn'

export type WaveformState = 'idle' | 'listening' | 'speaking' | 'processing'

export interface VoiceWaveformProps {
  state: WaveformState
  className?: string
  barCount?: number
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  state,
  className,
  barCount = 32,
}) => {
  const [randomDeltas, setRandomDeltas] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => Math.random())
  )

  useEffect(() => {
    if (state === 'listening' || state === 'speaking') {
      const interval = setInterval(() => {
        setRandomDeltas(Array.from({ length: barCount }, () => Math.random()))
      }, 100)
      return () => clearInterval(interval)
    } else {
      // Idle or processing static pattern
      setRandomDeltas(
        Array.from({ length: barCount }, (_, i) => {
          const center = barCount / 2
          const dist = Math.abs(i - center) / center
          return Math.max(0.15, 1 - dist * 0.7)
        })
      )
    }
  }, [state, barCount])

  // Get bar height based on state
  const getBarHeight = (index: number) => {
    const delta = randomDeltas[index] || 0.5
    switch (state) {
      case 'listening': {
        // High energetic jitter (30% to 98%)
        const base = Math.sin((index / barCount) * Math.PI) * 0.5 + 0.4
        return Math.min(100, Math.max(20, (base * delta + 0.2) * 100))
      }
      case 'speaking': {
        // Rhythmic wave
        const wave = Math.sin((index / 4) + Date.now() / 200) * 0.35 + 0.5
        return Math.min(85, Math.max(25, wave * 100))
      }
      case 'processing': {
        // Shimmering ripple
        const ripple = (Math.sin(index * 0.5) + 1) * 0.25 + 0.25
        return ripple * 100
      }
      case 'idle':
      default: {
        // Gentle resting pulse
        const distFromCenter = Math.abs(index - barCount / 2) / (barCount / 2)
        const base = Math.max(0.15, 0.45 - distFromCenter * 0.3)
        return base * 100
      }
    }
  }

  const getStatusBadge = () => {
    switch (state) {
      case 'listening':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-rose-500 animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>Listening to Vocal Descriptors...</span>
          </span>
        )
      case 'speaking':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            <span>Speech Synthesis Aloud</span>
          </span>
        )
      case 'processing':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Transcribing & Synthesizing Entities...</span>
          </span>
        )
      case 'idle':
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Input Ready • Click Mic to Speak</span>
          </span>
        )
    }
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3 w-full', className)}>
      {/* Waveform Visualization Track with Dynamic State Glow */}
      <div
        className={cn(
          'flex items-center justify-center gap-0.5 sm:gap-1.5 h-20 w-full max-w-lg px-2 sm:px-4 rounded-2xl border backdrop-blur-sm overflow-hidden transition-all duration-300 relative',
          state === 'listening'
            ? 'bg-rose-500/5 dark:bg-rose-950/30 border-rose-500/30 shadow-[0_0_24px_rgba(244,63,94,0.18)]'
            : state === 'speaking'
            ? 'bg-cyan-500/5 dark:bg-cyan-950/30 border-cyan-500/30 shadow-[0_0_24px_rgba(6,182,212,0.18)]'
            : state === 'processing'
            ? 'bg-indigo-500/5 dark:bg-indigo-950/30 border-indigo-500/30 shadow-[0_0_24px_rgba(99,102,241,0.18)]'
            : 'bg-slate-900/5 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-800/60'
        )}
      >
        {Array.from({ length: barCount }).map((_, i) => {
          const height = getBarHeight(i)

          return (
            <motion.div
              key={i}
              className={cn(
                'w-[3px] sm:w-1.5 rounded-full transition-all duration-100 shrink-0',
                state === 'listening'
                  ? 'bg-gradient-to-t from-rose-500 via-amber-400 to-emerald-400'
                  : state === 'speaking'
                  ? 'bg-gradient-to-t from-cyan-500 via-teal-400 to-emerald-400'
                  : state === 'processing'
                  ? 'bg-gradient-to-t from-indigo-500 via-purple-400 to-cyan-400'
                  : 'bg-slate-300 dark:bg-slate-700/60'
              )}
              style={{ height: `${height}%` }}
            />
          )
        })}
      </div>

      {/* Audio State Telemetry Badge */}
      <div className="flex items-center justify-center gap-3">
        {getStatusBadge()}
        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
          44.1 kHz • Vocal Band
        </span>
      </div>
    </div>
  )
}
