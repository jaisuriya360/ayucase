import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  Stethoscope,
  Activity,
  Pill,
  CheckCircle2,
} from 'lucide-react'
import {
  TIMELINE_YEARS,
  type TimelineYear,
  type TimelineNodeEvent,
} from '../../types/timeline'
import { GlassCard } from '../ui/GlassCard'
import { cn } from '../../utils/cn'

export interface HealthTimeSliderProps {
  selectedYear: TimelineYear
  onSelectYear: (year: TimelineYear) => void
  events: TimelineNodeEvent[]
  onSelectNode: (event: TimelineNodeEvent) => void
  className?: string
}

export const HealthTimeSlider: React.FC<HealthTimeSliderProps> = ({
  selectedYear,
  onSelectYear,
  events,
  onSelectNode,
  className,
}) => {
  const currentIndex = TIMELINE_YEARS.indexOf(selectedYear)

  const handlePrevYear = () => {
    if (currentIndex > 0) {
      onSelectYear(TIMELINE_YEARS[currentIndex - 1])
    }
  }

  const handleNextYear = () => {
    if (currentIndex < TIMELINE_YEARS.length - 1) {
      onSelectYear(TIMELINE_YEARS[currentIndex + 1])
    }
  }

  const getNodeIcon = (category: TimelineNodeEvent['category']) => {
    switch (category) {
      case 'consultation':
        return <Stethoscope className="w-3.5 h-3.5" />
      case 'document':
        return <FileText className="w-3.5 h-3.5" />
      case 'medication':
        return <Pill className="w-3.5 h-3.5" />
      case 'procedure':
        return <Activity className="w-3.5 h-3.5" />
      case 'statement':
      default:
        return <Sparkles className="w-3.5 h-3.5" />
    }
  }

  return (
    <GlassCard variant="elevated" className={cn('p-5 sm:p-7 space-y-6', className)}>
      {/* Header with Title & Step Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-500 animate-spin-slow" />
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              Health Time Machine
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Interactive Longitudinal Axis
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Drag the time slider or click a milestone to explore Aarav Chen's historical consultations, scans, and statements.
          </p>
        </div>

        {/* Step Buttons & Current Year Tag */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={handlePrevYear}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Step Back in Time"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm shadow-md shadow-emerald-500/20 min-w-[90px] text-center">
            {selectedYear}
          </div>

          <button
            type="button"
            disabled={currentIndex === TIMELINE_YEARS.length - 1}
            onClick={handleNextYear}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Step Forward in Time"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Slider Track - Horizontal scrollable on small mobile */}
      <div className="relative py-4 sm:py-8 px-1 sm:px-6 overflow-x-auto scrollbar-none snap-x">
        <div className="min-w-[440px] sm:min-w-0 relative py-4">
          {/* Connecting Axis Rail */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800">
            {/* Active progress fill */}
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 shadow-sm"
              initial={false}
              animate={{
                width: `${(currentIndex / (TIMELINE_YEARS.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Milestone Nodes Along Axis */}
          <div className="relative flex items-center justify-between z-10">
            {TIMELINE_YEARS.map((year, index) => {
              const isSelected = year === selectedYear
              const isPast = index <= currentIndex
              const matchingEvents = events.filter((e) => e.year === year)

              return (
                <div
                  key={year}
                  className="flex flex-col items-center cursor-pointer select-none group snap-center"
                  onClick={() => onSelectYear(year)}
                >
                  {/* Year Node Button / Thumb */}
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-black text-xs transition-all relative',
                      isSelected
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/40 ring-4 ring-emerald-500/20 scale-110'
                        : isPast
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-500/50'
                        : 'bg-white dark:bg-slate-900 text-slate-400 border-2 border-slate-300 dark:border-slate-700'
                    )}
                  >
                    <span>{year.toString().slice(-2)}'</span>

                    {/* Pulsing ring on selected year */}
                    {isSelected && (
                      <span className="absolute -inset-1 rounded-2xl border-2 border-emerald-400 animate-ping opacity-30" />
                    )}
                  </motion.div>

                  {/* Full Year Label Below */}
                  <span
                    className={cn(
                      'text-xs font-black mt-2.5 transition-colors',
                      isSelected
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                    )}
                  >
                    {year}
                  </span>

                  {/* Event count indicator chip */}
                  {matchingEvents.length > 0 && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {matchingEvents.length} {matchingEvents.length === 1 ? 'event' : 'events'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Clickable Event Nodes Banner for Selected Year */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Milestones in {selectedYear}</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 sm:hidden">
              Swipe horizontally &rarr;
            </span>
            <span className="text-[11px] text-slate-400">
              {events.filter((e) => e.year === selectedYear).length} Recorded Milestones
            </span>
          </div>
        </div>

        {/* Horizontal scroll cards container on mobile; responsive grid on sm+ */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-none">
          {events
            .filter((e) => e.year === selectedYear)
            .map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectNode(event)}
                className="w-[82vw] max-w-[310px] shrink-0 sm:w-auto snap-center sm:shrink p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  {getNodeIcon(event.category)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {event.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {event.date}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {event.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 sm:line-clamp-1 mt-0.5">
                    {event.summary}
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </GlassCard>
  )
}
