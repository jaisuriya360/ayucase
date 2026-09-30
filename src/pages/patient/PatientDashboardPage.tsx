import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HeartPulse,
  Activity,
  FileText,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Volume2,
  Bell,
  Clock,
  MessageSquareText,
  FileUp,
  CheckCircle2,
  RefreshCw,
  Layers,
  ChevronRight,
  ShieldAlert,
  Calendar,
  User,
  Check,
  HelpCircle,
  Stethoscope,
  Package,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { Modal } from '../../components/ui/Modal'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import { PatientJourneyStepper } from '../../components/dashboard/PatientJourneyStepper'
import { NotificationCenter } from '../../components/dashboard/NotificationCenter'
import { CareCapsuleCard } from '../../components/capsule/CareCapsuleCard'
import { usePatient } from '../../contexts/PatientContext'
import { useConsent } from '../../contexts/ConsentContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useNotifications } from '../../contexts/NotificationContext'
import type { MissingInformationItem, DashboardMetrics } from '../../types/dashboard'
import { PatientElderHomePage } from './PatientElderHomePage'
import { cn } from '../../utils/cn'

const DASHBOARD_STORAGE_KEY = 'ayucase_patient_dashboard_v4'
const NOTIFS_STORAGE_KEY = 'ayucase_patient_notifications_v4'

const INITIAL_MISSING_ITEMS: MissingInformationItem[] = [
  {
    id: 'gap-1',
    title: '48-Hour Ambulatory Blood Pressure Telemetry',
    field: 'Hemodynamic Variability',
    category: 'Cardiovascular / Autonomic',
    priority: 'High',
    impactDescription:
      'Required to differentiate nocturnal autonomic spikes from vascular migraine prodromes in narrative phenotype.',
    actionLabel: 'Sync Wearable / Upload Telemetry',
    actionRoute: '/patient/documents',
  },
  {
    id: 'gap-2',
    title: 'Maternal Family History of Vasospastic Cephalea',
    field: 'Hereditary Channelopathy Risk',
    category: 'Genetics / Family History',
    priority: 'Medium',
    impactDescription:
      'Needed to calibrate familial channelopathy risk weighting in AI diagnostic synthesis for Dr. Sharma.',
    actionLabel: 'Answer in Interview',
    actionRoute: '/patient/interview',
  },
  {
    id: 'gap-3',
    title: 'Fasting Serum Magnesium & Vitamin D3 Lab Panel',
    field: 'Biochemical Modulation',
    category: 'Biochemistry',
    priority: 'Low',
    impactDescription:
      'Identifies biochemical co-factors modulating cortical spreading depression threshold.',
    actionLabel: 'Upload Lab Report',
    actionRoute: '/patient/documents',
  },
]

export const PatientDashboardPage: React.FC = () => {
  const { patient, addDocument } = usePatient()
  const { permissions, witnessFictionalHash } = useConsent()
  const { isElderMode, speakText } = useAccessibility()
  const { t } = useLanguage()
  const { notifySuccess, notifyInfo } = useNotifications()
  const navigate = useNavigate()

  // Notification Center Modal state
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(3)

  // Document Upload Quick Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadDocName, setUploadDocName] = useState('')
  const [uploadDocCategory, setUploadDocCategory] = useState<
    'Discharge Summary' | 'Lab Report' | 'Imaging' | 'Prescription' | 'Consent'
  >('Imaging')
  const [isUploading, setIsUploading] = useState(false)

  // Dashboard Metrics & Missing Information state (persisted)
  const [missingItems, setMissingItems] = useState<MissingInformationItem[]>(() => {
    try {
      const stored = localStorage.getItem(DASHBOARD_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.missingItems) return parsed.missingItems
      }
    } catch (e) {
      console.warn('Failed to parse dashboard data from localStorage', e)
    }
    return INITIAL_MISSING_ITEMS
  })

  const [resolvedItemIds, setResolvedItemIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(DASHBOARD_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.resolvedItemIds) return parsed.resolvedItemIds
      }
    } catch (e) {
      console.warn('Failed to parse resolved gaps from localStorage', e)
    }
    return []
  })

  // Recalculate metrics dynamically based on resolved gaps
  const resolvedCount = resolvedItemIds.length
  const caseCompleteness = Math.min(100, 78 + resolvedCount * 7) // Base 78% + 7% per gap resolved
  const knownInfoCount = 14 + resolvedCount
  const unknownZoneCount = Math.max(0, 3 - resolvedCount)
  const pendingActionsCount = Math.max(0, 2 - (resolvedCount > 0 ? 1 : 0))

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        DASHBOARD_STORAGE_KEY,
        JSON.stringify({
          missingItems,
          resolvedItemIds,
          metrics: {
            caseCompletenessPercent: caseCompleteness,
            knownInfoCount,
            unknownZoneCount,
            pendingActionsCount,
          },
        })
      )
    } catch (e) {
      console.warn('Failed to persist dashboard data', e)
    }
  }, [missingItems, resolvedItemIds, caseCompleteness, knownInfoCount, unknownZoneCount, pendingActionsCount])

  // Sync unread notification count from localStorage
  useEffect(() => {
    try {
      const storedNotifs = localStorage.getItem(NOTIFS_STORAGE_KEY)
      if (storedNotifs) {
        const notifs = JSON.parse(storedNotifs)
        const unread = notifs.filter((n: any) => !n.isRead).length
        setUnreadNotifCount(unread)
      }
    } catch (e) {
      // ignore
    }
  }, [isNotifOpen])

  // Resolve a clinical gap
  const handleResolveGap = (gap: MissingInformationItem) => {
    if (resolvedItemIds.includes(gap.id)) return
    const updatedResolved = [...resolvedItemIds, gap.id]
    setResolvedItemIds(updatedResolved)
    setMissingItems((prev) => prev.filter((item) => item.id !== gap.id))
    notifySuccess(
      'Clinical Gap Resolved!',
      `Added "${gap.title}" into known parameters. Case completeness raised to ${Math.min(100, 78 + updatedResolved.length * 7)}%.`
    )
  }

  // Reset Demo Gaps
  const handleResetGaps = () => {
    setResolvedItemIds([])
    setMissingItems(INITIAL_MISSING_ITEMS)
    notifyInfo('Demo State Restored', 'All 3 baseline clinical gaps have been reset.')
  }

  // Handle Quick Document Upload
  const handleQuickUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadDocName.trim()) return

    setIsUploading(true)
    setTimeout(() => {
      addDocument({
        title: uploadDocName.endsWith('.pdf') ? uploadDocName : `${uploadDocName}.pdf`,
        category: uploadDocCategory,
        date: new Date().toISOString().split('T')[0],
        fileSize: '3.4 MB',
        provider: 'AyuCare Diagnostic Ingestion',
        status: 'Verified',
      })

      // If gap 1 was unresolved, resolve it
      if (!resolvedItemIds.includes('gap-1')) {
        handleResolveGap(INITIAL_MISSING_ITEMS[0])
      }

      setIsUploading(false)
      setIsUploadModalOpen(false)
      setUploadDocName('')
      notifySuccess(
        'Document Processed & Verified',
        'Clinical OCR and terminology extraction completed successfully.'
      )
    }, 1000)
  }

  // PHASE 11: Transform the entire experience when Elder Mode is enabled
  if (isElderMode) {
    return <PatientElderHomePage />
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. WELCOME MESSAGE & PAGE HEADER */}
      <PageHeader
        title={`Welcome back, ${patient.name}`}
        subtitle={`Your AyuCase health narrative is ${caseCompleteness}% synthesized. Review recent milestone events or resolve clinical gaps.`}
        badge={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {patient.fictionalId}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {patient.primaryCondition}
            </span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Listen Button for Accessibility */}
            <AnimatedButton
              variant={isElderMode ? 'elder' : 'secondary'}
              size={isElderMode ? 'md' : 'sm'}
              leftIcon={<Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              onClick={() =>
                speakText(
                  `Welcome back ${patient.name}. Your case completeness is currently at ${caseCompleteness} percent. You have ${unknownZoneCount} clinical gaps and ${pendingActionsCount} pending actions. Primary condition: ${patient.primaryCondition}.`
                )
              }
              title="Listen to dashboard overview"
            >
              {isElderMode ? 'Listen (கேட்க)' : 'Listen'}
            </AnimatedButton>

            {/* Notification Center Trigger Button */}
            <button
              type="button"
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm group"
              aria-label="Open Notification Center"
              title="Notification Center"
            >
              <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 transition-colors" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce shadow-md">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Quick Action: Start/Continue Interview */}
            <AnimatedButton
              to="/patient/interview"
              variant="primary"
              size={isElderMode ? 'md' : 'sm'}
              leftIcon={<MessageSquareText className="w-4 h-4" />}
            >
              Continue Interview
            </AnimatedButton>
          </div>
        }
      />

      {/* 2. PATIENT PROFILE SNAPSHOT CARD */}
      <GlassCard variant="elevated" className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar, Name & Demographics */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
              {patient.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {patient.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {patient.age} Yrs • {patient.gender}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  Blood Group: {patient.bloodGroup}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                Chief Concern:{' '}
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {patient.primaryCondition}
                </span>
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-500" />
                  Dr. Priya Sharma, MD (Neurology)
                </span>
                <span>•</span>
                <span>Contact: {patient.contactMasked}</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Vitals Pill Strip */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200/80 dark:border-slate-800">
            <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center min-w-[75px]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Heart</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {patient.vitals.heartRate} <span className="text-[10px] font-normal text-slate-400">BPM</span>
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center min-w-[75px]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">BP</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {patient.vitals.bloodPressureSys}/{patient.vitals.bloodPressureDia}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center min-w-[75px]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">SpO2</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {patient.vitals.spO2}%
              </span>
            </div>

            <AnimatedButton to="/patient/profile" variant="ghost" size="sm" className="text-xs">
              <span>View Full Profile</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </AnimatedButton>
          </div>
        </div>
      </GlassCard>

      {/* 3. INTERACTIVE PATIENT JOURNEY STEPPER */}
      <section aria-labelledby="patient-journey-heading">
        <h2 id="patient-journey-heading" className="sr-only">
          Patient Journey Stages
        </h2>
        <PatientJourneyStepper />
      </section>

      {/* 4. ANIMATED COUNTERS METRICS ROW */}
      <section aria-labelledby="clinical-metrics-heading">
        <div className="flex items-center justify-between mb-3">
          <h2
            id="clinical-metrics-heading"
            className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>Case Synthesis Metrics & Readiness</span>
          </h2>
          {resolvedCount > 0 && (
            <button
              type="button"
              onClick={handleResetGaps}
              className="text-xs text-slate-400 hover:text-emerald-500 flex items-center gap-1 font-semibold transition-colors"
              title="Reset simulation parameters"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo State</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Case Completeness */}
          <GlassCard variant="default" className="p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Case Completeness
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                {caseCompleteness >= 85 ? 'Optimal' : 'High'}
              </span>
            </div>

            <div className="flex items-baseline gap-1 my-1">
              <AnimatedCounter
                value={caseCompleteness}
                suffix="%"
                className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${caseCompleteness}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block font-medium">
              Narrative phenotype clarity score
            </span>
          </GlassCard>

          {/* Card 2: Known Information */}
          <GlassCard variant="default" className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Known Information
              </span>
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-1">
              <AnimatedCounter
                value={knownInfoCount}
                className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100"
              />
              <span className="text-xs font-bold text-slate-400">Verified Markers</span>
            </div>

            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 block font-medium">
              Validated clinical observations & tests
            </span>
          </GlassCard>

          {/* Card 3: Unknown Zone */}
          <GlassCard
            variant={unknownZoneCount > 0 ? 'interactive' : 'default'}
            onClick={() => {
              const el = document.getElementById('missing-information-section')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className={cn(
              'p-5 transition-all',
              unknownZoneCount > 0 &&
                'border-amber-500/40 bg-amber-500/5 hover:border-amber-500'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                Unknown Zone
              </span>
              <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertCircle className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-1">
              <AnimatedCounter
                value={unknownZoneCount}
                className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400"
              />
              <span className="text-xs font-bold text-slate-400">Actionable Gaps</span>
            </div>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 block font-medium flex items-center gap-1">
              <span>Inspect clinical gaps</span>
              <ArrowRight className="w-3 h-3 text-amber-500" />
            </span>
          </GlassCard>

          {/* Card 4: Pending Actions */}
          <GlassCard variant="default" className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Pending Actions
              </span>
              <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-1">
              <AnimatedCounter
                value={pendingActionsCount}
                className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400"
              />
              <span className="text-xs font-bold text-slate-400">Tasks Queue</span>
            </div>

            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-2 block font-medium">
              Review discrepancy & intake sync
            </span>
          </GlassCard>
        </div>
      </section>

      {/* CARE CAPSULE SECTION */}
      <section aria-labelledby="care-capsule-heading" className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2
            id="care-capsule-heading"
            className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2"
          >
            <Package className="w-4 h-4 text-emerald-500" />
            <span>Care Capsule</span>
          </h2>
          <Link
            to="/patient/capsule"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Full View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <CareCapsuleCard variant="compact" />
      </section>

      {/* 5. QUICK ACTIONS TOOLBAR */}
      <section aria-labelledby="quick-actions-heading">
        <h2
          id="quick-actions-heading"
          className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>Quick Clinical Actions</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Action 1: Continue Interview */}
          <GlassCard
            variant="interactive"
            onClick={() => navigate('/patient/interview')}
            className="p-4 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Continue Interview
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Log symptoms & aura triggers
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
          </GlassCard>

          {/* Action 2: Upload Document */}
          <GlassCard
            variant="interactive"
            onClick={() => setIsUploadModalOpen(true)}
            className="p-4 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Upload Document
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Add MRI, lab report, or Rx
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-cyan-500 transition-all" />
          </GlassCard>

          {/* Action 3: View Health Story */}
          <GlassCard
            variant="interactive"
            onClick={() => navigate('/patient/story')}
            className="p-4 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  View Health Story
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Read synthesized narrative
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-500 transition-all" />
          </GlassCard>

          {/* Action 4: View Timeline */}
          <GlassCard
            variant="interactive"
            onClick={() => navigate('/patient/timeline')}
            className="p-4 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  View Timeline
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Chronology & appointments
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-teal-500 transition-all" />
          </GlassCard>
        </div>
      </section>

      {/* 6. MISSING INFORMATION & UNKNOWN ZONE SECTION */}
      <section id="missing-information-section" aria-labelledby="missing-info-heading">
        <GlassCard variant="elevated" className="p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2
                  id="missing-info-heading"
                  className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight"
                >
                  Missing Information — Unknown Zone
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Resolving these gaps directly enhances narrative phenotype fidelity for Dr. Sharma's upcoming clinical review.
              </p>
            </div>

            <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 self-start sm:self-auto">
              {unknownZoneCount} Remaining Gaps
            </span>
          </div>

          {missingItems.length === 0 ? (
            <div className="text-center py-10 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/20 p-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                All Known Clinical Gaps Resolved!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Your medical narrative and objective diagnostics are in total alignment. Dr. Sharma has high-fidelity data for synthesis.
              </p>
              <button
                type="button"
                onClick={handleResetGaps}
                className="mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Reset Demo Gaps to Re-test
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {missingItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-amber-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-extrabold uppercase',
                          item.priority === 'High'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            : item.priority === 'Medium'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        )}
                      >
                        {item.priority} Priority
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {item.category} • {item.field}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.impactDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <AnimatedButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleResolveGap(item)}
                      className="text-xs whitespace-nowrap"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Resolve Gap (+7%)
                    </AnimatedButton>
                    <button
                      type="button"
                      onClick={() => navigate(item.actionRoute)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={item.actionLabel}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </section>

      {/* 7. CORE MODULE SNAPSHOTS (2x2 GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module A: Consent Status Snapshot */}
        <GlassCard variant="default" className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Consent Governance
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Hash: {witnessFictionalHash.slice(0, 10)}...
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Your data sovereignty is cryptographically witnessed. You hold sole authority to grant or revoke sharing.
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Voice Interview
                </span>
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded',
                    permissions.voiceInterview === 'Granted'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  )}
                >
                  {permissions.voiceInterview}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Medical Documents
                </span>
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded',
                    permissions.medicalDocuments === 'Granted'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  )}
                >
                  {permissions.medicalDocuments}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Health History
                </span>
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded',
                    permissions.healthHistory === 'Granted'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  )}
                >
                  {permissions.healthHistory}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Case Sharing
                </span>
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded',
                    permissions.caseSharing === 'Granted'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  )}
                >
                  {permissions.caseSharing}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/patient/consent"
            className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-3 border-t border-slate-200/80 dark:border-slate-800 hover:underline"
          >
            <span>Open Consent Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </GlassCard>

        {/* Module B: Interview Progress Snapshot */}
        <GlassCard variant="default" className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquareText className="w-5 h-5 text-indigo-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  AI Symptom Interview
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 uppercase">
                Active Session
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-500/20 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                Last Logged Intake • 23 Sep 2026, 09:20 AM
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                "Patient reported morning prodrome with scintillating visual aura and left orbital pressure after skipping breakfast."
              </p>
            </div>

            <div className="space-y-1.5 mb-4">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                Extracted Clinical Phenotypes:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Left Retro-orbital
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Scintillating Scotoma
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Circadian Vasospasm
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/patient/interview"
            className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-3 border-t border-slate-200/80 dark:border-slate-800 hover:underline"
          >
            <span>Resume Symptom Check-In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </GlassCard>

        {/* Module C: Verified Documents Snapshot */}
        <GlassCard variant="default" className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Verified Records ({patient.documents.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Add Record</span>
              </button>
            </div>

            <div className="space-y-2.5 mb-4">
              {patient.documents.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-cyan-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {doc.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {doc.category} • {doc.date}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/patient/documents"
            className="flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400 pt-3 border-t border-slate-200/80 dark:border-slate-800 hover:underline"
          >
            <span>Explore All Diagnostic Files</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </GlassCard>

        {/* Module D: Health Story Narrative Snapshot */}
        <GlassCard variant="default" className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Health Story Excerpt
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                Chapter 2 of 2
              </span>
            </div>

            {patient.storyChapters && patient.storyChapters[1] ? (
              <div className="space-y-3 mb-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {patient.storyChapters[1].title} ({patient.storyChapters[1].period})
                </h4>
                <blockquote className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border-l-4 border-indigo-500 text-xs italic text-slate-700 dark:text-slate-300">
                  {patient.storyChapters[1].patientVoiceQuote}
                </blockquote>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {patient.storyChapters[1].summary}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6">
                Narrative chapter synthesis in progress. Complete symptom check-in to generate chapter 1.
              </p>
            )}
          </div>

          <Link
            to="/patient/story"
            className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-3 border-t border-slate-200/80 dark:border-slate-800 hover:underline"
          >
            <span>Read Complete Illness Narrative</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </GlassCard>
      </div>

      {/* 8. NOTIFICATION CENTER MODAL */}
      <NotificationCenter
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onNavigate={(route) => navigate(route)}
      />

      {/* 9. QUICK DOCUMENT UPLOAD MODAL */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Diagnostic Record"
        subtitle="Supported formats: PDF, DICOM, CSV, PNG (Clinical OCR enabled)"
        size="md"
      >
        <form onSubmit={handleQuickUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Document Name / Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 48-Hour Holter Telemetry Log.csv"
              value={uploadDocName}
              onChange={(e) => setUploadDocName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={uploadDocCategory}
              onChange={(e) =>
                setUploadDocCategory(
                  e.target.value as 'Discharge Summary' | 'Lab Report' | 'Imaging' | 'Prescription' | 'Consent'
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Imaging">Imaging (MRI, CT, X-Ray)</option>
              <option value="Lab Report">Lab Report (Blood, Serum, Telemetry)</option>
              <option value="Discharge Summary">Discharge Summary / Clinical Note</option>
              <option value="Prescription">Prescription / Medication Plan</option>
              <option value="Consent">Consent Record</option>
            </select>
          </div>

          <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center bg-slate-50/50 dark:bg-slate-800/30">
            <FileUp className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              Simulated Ingestion & Clinical OCR Sandbox
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Files are parsed locally and verified against simulated clinical schemas.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <AnimatedButton
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isUploading}
            >
              Upload & Verify
            </AnimatedButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
