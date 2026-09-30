import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  Compass,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  BookOpen,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { HealthTimeSlider } from '../../components/timeline/HealthTimeSlider'
import { ExplorePatientAtTime } from '../../components/timeline/ExplorePatientAtTime'
import { MissingYearsDetector } from '../../components/timeline/MissingYearsDetector'
import { TimelineNodeDetailModal } from '../../components/timeline/TimelineNodeDetailModal'
import { useNotifications } from '../../contexts/NotificationContext'
import { useLanguage } from '../../contexts/LanguageContext'
import {
  TIMELINE_YEARS,
  YEARLY_SNAPSHOTS,
  INITIAL_TIMELINE_NODES,
  INITIAL_TIMELINE_GAP,
  type TimelineYear,
  type TimelineNodeEvent,
  type TimelineGap,
} from '../../types/timeline'

const TIMELINE_STORAGE_KEY = 'ayucase_patient_timeline_v7'

export const PatientTimelinePage: React.FC = () => {
  const { notifySuccess, notifyInfo } = useNotifications()
  const { t } = useLanguage()
  const navigate = useNavigate()

  // State: Active Year for the Health Time Machine
  const [selectedYear, setSelectedYear] = useState<TimelineYear>(2026)

  // State: Timeline Node Events
  const [events, setEvents] = useState<TimelineNodeEvent[]>(() => {
    try {
      const stored = localStorage.getItem(TIMELINE_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.events) return parsed.events
      }
    } catch (e) {
      console.warn('Failed to parse timeline state from localStorage', e)
    }
    return INITIAL_TIMELINE_NODES
  })

  // State: Missing Years Gap
  const [timelineGap, setTimelineGap] = useState<TimelineGap>(() => {
    try {
      const stored = localStorage.getItem(TIMELINE_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.timelineGap) return parsed.timelineGap
      }
    } catch (e) {
      console.warn('Failed to parse gap state', e)
    }
    return INITIAL_TIMELINE_GAP
  })

  // State: Selected Node Detail Modal
  const [selectedNode, setSelectedNode] = useState<TimelineNodeEvent | null>(null)
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false)

  // Persist state in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        TIMELINE_STORAGE_KEY,
        JSON.stringify({
          events,
          timelineGap,
          lastUpdated: new Date().toISOString(),
        })
      )
    } catch (e) {
      console.warn('Failed to persist timeline state', e)
    }
  }, [events, timelineGap])

  // Resolve Missing Years Gap
  const handleResolveGap = (answerText: string) => {
    const updatedGap: TimelineGap = {
      ...timelineGap,
      isResolved: true,
      resolvedAnswer: answerText,
    }

    // Add newly discovered historical event for 2023
    const newEvent: TimelineNodeEvent = {
      id: `node-gap-resolved-${Date.now()}`,
      year: 2023,
      date: '15 Aug 2023',
      title: 'Clarified Gap: Patient At-Home Self-Management',
      category: 'statement',
      summary: 'Patient clarified managing episodes with hydration and OTC supplements during 2022–2023 gap.',
      detailedNote: `Historical intake inquiry resolved by patient: "${answerText}". Affirmed absence of hospitalizations during this period.`,
      physician: 'AyuCase AI Intake Review',
      institution: 'Self-Reported Telemetry Synthesis',
      patientStatement: answerText,
      tags: ['Historical Gap Resolved', 'Self-Reported', 'Validated 2023'],
      severity: 'normal',
    }

    setTimelineGap(updatedGap)
    setEvents((prev) => [newEvent, ...prev])
  }

  // Reset Gap Demo State
  const handleResetGap = () => {
    setTimelineGap(INITIAL_TIMELINE_GAP)
    setEvents(INITIAL_TIMELINE_NODES)
    notifyInfo('Gap State Reset', 'The 2022–2023 chronological gap has been restored for demonstration.')
  }

  const activeSnapshot = YEARLY_SNAPSHOTS[selectedYear]

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. PAGE HEADER */}
      <PageHeader
        title={t('timeline.title', 'Health Trajectory & Time Machine')}
        subtitle={t('timeline.subtitle', 'Explore your multi-year illness chronology. Move through time to inspect historical documents, consultations, and verbatim statements.')}
        breadcrumbs={[
          { label: t('nav.dashboard', 'Dashboard'), href: '/patient/dashboard' },
          { label: t('nav.timeline', 'Health Timeline') },
        ]}
        badge={
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            {t('timeline.sliderTitle', 'Time Machine Active')} • {selectedYear}
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <AnimatedButton
              variant="secondary"
              size="sm"
              leftIcon={<BookOpen className="w-4 h-4" />}
              onClick={() => navigate('/patient/story')}
              aria-label={t('nav.story', 'View Health Story')}
            >
              {t('nav.story', 'View Health Story')}
            </AnimatedButton>
          </div>
        }
      />

      {/* 2. HEALTH TIME MACHINE: DRAGGABLE HORIZONTAL SLIDER */}
      <section aria-labelledby="time-slider-heading">
        <h2 id="time-slider-heading" className="sr-only">
          Health Time Machine Slider
        </h2>
        <HealthTimeSlider
          selectedYear={selectedYear}
          onSelectYear={(yr) => setSelectedYear(yr)}
          events={events}
          onSelectNode={(node) => {
            setSelectedNode(node)
            setIsNodeModalOpen(true)
          }}
        />
      </section>

      {/* 3. MISSING YEARS DETECTOR */}
      <section aria-labelledby="gap-detector-heading">
        <h2 id="gap-detector-heading" className="sr-only">
          Missing Years Detector
        </h2>
        <MissingYearsDetector
          gap={timelineGap}
          onResolveGap={handleResolveGap}
          onResetGap={handleResetGap}
        />
      </section>

      {/* 4. EXPLORE PATIENT AT THIS TIME */}
      <section aria-labelledby="explore-time-heading">
        <h2 id="explore-time-heading" className="sr-only">
          Explore Patient at This Time
        </h2>
        <ExplorePatientAtTime
          snapshot={activeSnapshot}
          onViewDocument={(docName) => navigate('/patient/documents')}
        />
      </section>

      {/* 5. TIMELINE NODE DETAIL MODAL */}
      <TimelineNodeDetailModal
        event={selectedNode}
        isOpen={isNodeModalOpen}
        onClose={() => setIsNodeModalOpen(false)}
        onNavigateToDocument={(docName) => navigate('/patient/documents')}
      />
    </div>
  )
}
