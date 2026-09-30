import React from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Volume2,
  Calendar,
  Sparkles,
  CheckCircle2,
  X,
  Heart,
  ChevronRight,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { cn } from '../../utils/cn'

export interface SimpleHealthStoryViewProps {
  className?: string
  onClose?: () => void
}

export const SimpleHealthStoryView: React.FC<SimpleHealthStoryViewProps> = ({
  className,
  onClose,
}) => {
  const { speakText, settings } = useAccessibility()
  const isXLarge = settings.fontSize === 'xlarge'

  const simpleChapters = [
    {
      year: 'Spring 2019',
      title: 'When Your Headaches First Began',
      simpleStory:
        'You noticed mild tightness across your forehead after long days working on the computer. You rested with quiet breaks and thought it was everyday fatigue.',
      reflection: 'You learned to take quiet breaks away from bright computer monitors.',
    },
    {
      year: 'October 2021',
      title: 'Visiting the Eye Doctor for Flashing Lights',
      simpleStory:
        'You saw small flashing lights like camera flashes in front of your left eye. You visited Dr. Meera Nambiar for an eye check. The doctor examined your eyes carefully and confirmed your eyes and retina are completely healthy.',
      reflection: 'The doctor explained that the flashing lights were a signal from your nerves before a headache.',
    },
    {
      year: 'May 2024',
      title: 'Your Brain Scan at Apollo Hospital',
      simpleStory:
        'You visited the hospital for a high-definition brain scan. The doctor and scan showed that your brain tissue is completely healthy, clean, and normal with no blockages.',
      reflection: 'This brought great peace of mind to you and your family.',
    },
    {
      year: 'August 2025',
      title: 'Partnering with Dr. Priya Sharma & Morning Medicines',
      simpleStory:
        'You began meeting with Dr. Priya Sharma. She gave you a gentle pink tablet called Propranolol to take twice a day. This tablet protects your head and helps stop headaches before they can start.',
      reflection: 'Your headaches reduced from several times a month down to just once or twice.',
    },
    {
      year: 'Today • 2026',
      title: 'Living Well & Staying Hydrated',
      simpleStory:
        'You are doing wonderfully today. You drink plenty of water, take your morning pills with breakfast, and your doctor and family can see your great progress.',
      reflection: 'Aarav, your story is safe and preserved in your own words.',
    },
  ]

  const handleReadChapter = (chapter: (typeof simpleChapters)[0]) => {
    speakText(
      `${chapter.year}. ${chapter.title}. ${chapter.simpleStory}. Remember: ${chapter.reflection}`
    )
  }

  const handleReadAll = () => {
    const fullText = simpleChapters
      .map((c) => `${c.year}. ${c.title}. ${c.simpleStory}`)
      .join(' ')
    speakText(`Here is your health story in simple words. ${fullText}`)
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
            <span className="text-2xl">🧓</span>
            <h3
              className={cn(
                'font-black text-slate-900 dark:text-slate-50 tracking-tight',
                isXLarge ? 'text-2xl' : 'text-xl'
              )}
            >
              My Health Story (Simple Words)
            </h3>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 border border-amber-500">
              SimpleView
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
            Your journey written in clear everyday sentences. No medical jargon.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReadAll}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm border-2 border-amber-600 shadow-sm flex items-center gap-1.5"
          >
            <Volume2 className="w-4 h-4" />
            <span>Read Entire Story</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Chapters Stream */}
      <div className="space-y-4">
        {simpleChapters.map((chap, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  {chap.year}
                </span>
                <h4
                  className={cn(
                    'font-black text-slate-900 dark:text-slate-100',
                    isXLarge ? 'text-xl' : 'text-lg'
                  )}
                >
                  {chap.title}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => handleReadChapter(chap)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                title="Read this chapter aloud"
              >
                <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </button>
            </div>

            <p
              className={cn(
                'font-medium text-slate-800 dark:text-slate-200 leading-relaxed font-sans',
                isXLarge ? 'text-lg' : 'text-base'
              )}
            >
              "{chap.simpleStory}"
            </p>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{chap.reflection}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
