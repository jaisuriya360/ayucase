import React from 'react'
import { motion } from 'framer-motion'
import {
  Mic,
  FileText,
  BookOpen,
  Calendar,
  Users,
  Volume2,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { cn } from '../../utils/cn'

export interface ElderActionGridProps {
  className?: string
  onSelectAction: (actionId: 'talk' | 'reports' | 'story' | 'appointments' | 'family') => void
}

export const ElderActionGrid: React.FC<ElderActionGridProps> = ({
  className,
  onSelectAction,
}) => {
  const { speakText, settings } = useAccessibility()
  const { language } = useLanguage()
  const isXLarge = settings.fontSize === 'xlarge'
  const isTa = language === 'ta'

  const actions = [
    {
      id: 'talk' as const,
      iconEmoji: '🎙',
      title: isTa ? 'ஆயுகேஸிடம் பேசுங்கள்' : 'TALK TO AYUCASE',
      subtitle: isTa
        ? 'உங்கள் உடல்நிலையை எளிய தமிழில் குரல் மூலம் பகிருங்கள். தலைவலி மற்றும் உடல் சோர்வு எவ்வாறு உள்ளது?'
        : 'Start your friendly voice check-in. Tell us how your head and body feel.',
      badge: isTa ? 'குரல் நேர்காணல்' : 'Step-by-Step Voice',
      colorClass: 'bg-emerald-600 dark:bg-emerald-700 text-white border-slate-900 dark:border-white',
      accentColor: 'border-emerald-600',
    },
    {
      id: 'reports' as const,
      iconEmoji: '📄',
      title: isTa ? 'எனது அறிக்கைகள்' : 'MY REPORTS',
      subtitle: isTa
        ? 'உங்கள் 3 சரிபார்க்கப்பட்ட ஸ்கேன் மற்றும் மருத்துவர் மருந்துக் குறிப்புகளை எளிய தமிழில் பாருங்கள்.'
        : 'View your 3 verified scans and doctor prescriptions in plain words.',
      badge: isTa ? '3 ஆவணங்கள் தயார்' : '3 Records Ready',
      colorClass: 'bg-sky-700 dark:bg-sky-800 text-white border-slate-900 dark:border-white',
      accentColor: 'border-sky-600',
    },
    {
      id: 'story' as const,
      iconEmoji: '🧓',
      title: isTa ? 'எனது உடல்நலக் கதை' : 'MY HEALTH STORY',
      subtitle: isTa
        ? '2019 முதல் இன்று வரையிலான உங்கள் மருத்துவப் பயணம் எளிய தமிழில், கடினமான வார்த்தைகள் இல்லாமல்.'
        : 'Read your journey from 2019 to today in everyday words with no medical jargon.',
      badge: isTa ? 'எளிய வாசிப்பு' : 'Easy Reading',
      colorClass: 'bg-amber-600 dark:bg-amber-700 text-white border-slate-900 dark:border-white',
      accentColor: 'border-amber-600',
    },
    {
      id: 'appointments' as const,
      iconEmoji: '📅',
      title: isTa ? 'எனது சந்திப்புகள்' : 'MY APPOINTMENTS',
      subtitle: isTa
        ? 'மருத்துவர் பிரியா சர்மாவுடனான உங்கள் சந்திப்பு விவரங்கள் மற்றும் மருத்துவரிடம் கேட்க வேண்டிய கேள்விகள்.'
        : 'Check your schedule with Dr. Priya Sharma and questions to ask your doctor.',
      badge: isTa ? 'அடுத்தது: செப் 24' : 'Next: 24 Sep',
      colorClass: 'bg-indigo-700 dark:bg-indigo-800 text-white border-slate-900 dark:border-white',
      accentColor: 'border-indigo-600',
    },
    {
      id: 'family' as const,
      iconEmoji: '👨‍👩‍👧',
      title: isTa ? 'குடும்ப உதவி' : 'FAMILY ASSIST',
      subtitle: isTa
        ? 'உங்கள் மகள் குளோயி சென் மற்றும் குடும்பத்தினர் நீங்கள் நலமாக இருப்பதை அறிய உதவுங்கள்.'
        : 'Let your daughter Chloe Chen and loved ones see how well you are doing.',
      badge: isTa ? 'குடும்ப இணைப்பு' : 'Family Connected',
      colorClass: 'bg-rose-700 dark:bg-rose-800 text-white border-slate-900 dark:border-white',
      accentColor: 'border-rose-600',
    },
  ]

  const handleReadCard = (e: React.MouseEvent, title: string, subtitle: string) => {
    e.stopPropagation()
    speakText(`${title}. ${subtitle}`)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
          What would you like to do?
        </h2>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          5 Large Actions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((act, index) => (
          <div
            key={act.id}
            onClick={() => onSelectAction(act.id)}
            className={cn(
              'p-6 sm:p-7 rounded-3xl border-3 shadow-lg cursor-pointer transition-transform active:scale-[0.98] flex flex-col justify-between select-none relative overflow-hidden group min-h-[140px]',
              act.colorClass,
              index === 0 && 'md:col-span-2' // "TALK TO AYUCASE" spans full width for primary voice emphasis
            )}
          >
            {/* Top row: Emoji & Title & Read button */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">{act.iconEmoji}</span>
                  <div>
                    <h3
                      className={cn(
                        'font-black tracking-tight text-white leading-tight',
                        isXLarge ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                      )}
                    >
                      {act.title}
                    </h3>
                    <span className="inline-block mt-0.5 text-xs font-black px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                      {act.badge}
                    </span>
                  </div>
                </div>

                {/* Read Aloud Button */}
                <button
                  type="button"
                  onClick={(e) => handleReadCard(e, act.title, act.subtitle)}
                  className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-transform active:scale-90 shrink-0"
                  title="Listen to this action"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>

              {/* Subtitle in plain language */}
              <p
                className={cn(
                  'text-white/90 font-medium leading-relaxed pt-1',
                  isXLarge ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                )}
              >
                {act.subtitle}
              </p>
            </div>

            {/* Bottom prompt strip */}
            <div className="mt-4 pt-3 border-t border-white/25 flex items-center justify-between font-black text-sm text-white">
              <span>Tap to Open</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
