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
  AlertCircle,
  AlertTriangle,
  Volume2,
  Bell,
  Clock,
  MessageSquareText,
  FileUp,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  Shield,
  Stethoscope,
  Package,
  Calendar,
  Upload,
} from 'lucide-react'
import { AyuCard, AyuCardHeader, AyuCardContent } from '../../components/ui/AyuCard'
import { AyuButton } from '../../components/ui/AyuButton'
import { AyuBadge } from '../../components/ui/AyuBadge'
import { AyuStatCard } from '../../components/ui/AyuStatCard'
import { AyuSection } from '../../components/ui/AyuSection'
import { Modal } from '../../components/ui/Modal'
import { NotificationCenter } from '../../components/dashboard/NotificationCenter'
import { usePatient } from '../../contexts/PatientContext'
import { useConsent } from '../../contexts/ConsentContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useNotifications } from '../../contexts/NotificationContext'
import type { MissingInformationItem } from '../../types/dashboard'
import { PatientElderHomePage } from './PatientElderHomePage'
import { cn } from '../../utils/cn'

const DASHBOARD_STORAGE_KEY = 'ayucase_patient_dashboard_v4'
const NOTIFS_STORAGE_KEY = 'ayucase_patient_notifications_v4'

const INITIAL_ATTENTION_ITEMS: {
  id: string
  title: string
  whatIsNeeded: string
  whyItMatters: string
  actionLabel: string
  actionRoute: string
  priority: 'high' | 'medium' | 'low'
}[] = [
  {
    id: 'att-1',
    title: 'Complete Clinical Interview',
    whatIsNeeded: 'Structured questionnaire review (Section 4: Episode Triggers)',
    whyItMatters: 'Calibrates symptom recurrence intervals for Dr. Priya Sharma before the upcoming consultation.',
    actionLabel: 'Resume Interview',
    actionRoute: '/patient/interview',
    priority: 'high',
  },
  {
    id: 'att-2',
    title: 'Upload Recent Blood Chemistry Panel',
    whatIsNeeded: 'Recent serum magnesium and metabolic panel report',
    whyItMatters: 'Verifies baseline biochemical cofactors and confirms medication tolerance markers.',
    actionLabel: 'Upload Document',
    actionRoute: '/patient/documents',
    priority: 'medium',
  },
  {
    id: 'att-3',
    title: 'Review Consent Authorization Preferences',
    whatIsNeeded: 'Verify second-opinion clinical case sharing permissions',
    whyItMatters: 'Allows neurology department review while ensuring you retain complete audit-token revocability.',
    actionLabel: 'Review Consent',
    actionRoute: '/patient/consent',
    priority: 'low',
  },
]

export const PatientDashboardPage: React.FC = () => {
  const { patient, addDocument } = usePatient()
  const { permissions, witnessFictionalHash } = useConsent()
  const { isElderMode, speakText } = useAccessibility()
  const { t } = useLanguage()
  const { notifySuccess, notifyInfo } = useNotifications()
  const navigate = useNavigate()

  // Notification Modal
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(2)

  // Document Upload Quick Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadDocName, setUploadDocName] = useState('')
  const [uploadDocCategory, setUploadDocCategory] = useState<
    'Discharge Summary' | 'Lab Report' | 'Imaging' | 'Prescription' | 'Consent'
  >('Lab Report')
  const [isUploading, setIsUploading] = useState(false)

  // Attention Items state
  const [attentionItems, setAttentionItems] = useState(INITIAL_ATTENTION_ITEMS)
  const [dismissedItems, setDismissedItems] = useState<string[]>([])

  // Calculate dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // Elder Mode delegate
  if (isElderMode) {
    return <PatientElderHomePage />
  }

  const activeAttentionItems = attentionItems.filter((item) => !dismissedItems.includes(item.id))

  const handleDismissAttention = (id: string) => {
    setDismissedItems((prev) => [...prev, id])
    notifySuccess('Item Handled', 'Attention list updated.')
  }

  const handleQuickUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadDocName.trim()) return

    setIsUploading(true)
    setTimeout(() => {
      addDocument({
        title: uploadDocName.endsWith('.pdf') ? uploadDocName : `${uploadDocName}.pdf`,
        category: uploadDocCategory,
        date: new Date().toISOString().split('T')[0],
        fileSize: '2.8 MB',
        provider: 'Diagnostic Ingestion Sandbox',
        status: 'Verified',
      })

      // Resolve blood report item if open
      if (!dismissedItems.includes('att-2')) {
        setDismissedItems((prev) => [...prev, 'att-2'])
      }

      setIsUploading(false)
      setIsUploadModalOpen(false)
      setUploadDocName('')
      notifySuccess('Document Uploaded', `${uploadDocName} was added to your clinical record.`)
    }, 800)
  }

  return (
    <div className="space-y-8 sm:space-y-10 max-w-7xl mx-auto pb-16">
      {/* =========================================================================
          SECTION 1 — PATIENT WELCOME (Large, calm, confident)
          ========================================================================= */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0b1428] border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Health record: Up to date
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Last updated: Today, 10:42 AM
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {getGreeting()}, {patient.name.split(' ')[0]}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Here's your synthesized health overview. Your record is actively mirrored with Dr. Priya Sharma's clinical workstation.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <AyuButton
            variant="secondary"
            size="md"
            leftIcon={<Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            onClick={() =>
              speakText(
                `Good morning ${patient.name}. Your health record is up to date. You have ${activeAttentionItems.length} items needing your attention today.`
              )
            }
            title="Read summary aloud"
          >
            Listen
          </AyuButton>

          <button
            type="button"
            onClick={() => setIsNotifOpen(true)}
            className="relative h-9.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2 cursor-pointer"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold hidden sm:inline">Alerts</span>
            {unreadNotifCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadNotifCount}
              </span>
            )}
          </button>

          <AyuButton
            to="/patient/interview"
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Resume Interview
          </AyuButton>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — IMPORTANT HEALTH SNAPSHOT (Generous vitals, not tiny)
          ========================================================================= */}
      <section aria-labelledby="vitals-heading">
        <h2 id="vitals-heading" className="sr-only">
          Important Health Snapshot
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <AyuStatCard
            label="Heart Rate"
            value={patient.vitals.heartRate}
            unit="BPM"
            subtext="Resting • Normal Sinus"
            icon={<HeartPulse className="w-5 h-5" />}
            trend={{ direction: 'neutral', value: 'Steady vs yesterday', isPositive: true }}
            status="normal"
          />

          <AyuStatCard
            label="Blood Pressure"
            value={`${patient.vitals.bloodPressureSys} / ${patient.vitals.bloodPressureDia}`}
            unit="mmHg"
            subtext="Optimal • Within Target"
            icon={<Activity className="w-5 h-5" />}
            trend={{ direction: 'down', value: '-2 mmHg variation', isPositive: true }}
            status="normal"
          />

          <AyuStatCard
            label="Oxygen Saturation (SpO₂)"
            value={patient.vitals.spO2}
            unit="%"
            subtext="Normal Arterial Oxygenation"
            icon={<ShieldCheck className="w-5 h-5" />}
            trend={{ direction: 'neutral', value: 'Room air', isPositive: true }}
            status="normal"
          />

          <AyuStatCard
            label="Last Clinical Check"
            value="Today"
            unit="10:42 AM"
            subtext="Synchronized with Dr. Priya Sharma"
            icon={<Stethoscope className="w-5 h-5" />}
            trend={{ direction: 'neutral', value: 'Dr. Priya Sharma (Neurology)', isPositive: true }}
            status="normal"
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — YOUR CARE JOURNEY (Clean, linear stepper)
          ========================================================================= */}
      <AyuSection
        title="Your Care Journey"
        subtitle="Follow the progress of your health narrative as it moves through clinical review."
      >
        <AyuCard variant="default" padding="lg">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {[
              { step: '01', title: 'Profile', desc: 'Demographics & Vitals', status: 'completed' },
              { step: '02', title: 'Health Story', desc: 'Lived Narrative', status: 'completed' },
              { step: '03', title: 'Documents', desc: 'Reports & Scans', status: 'completed' },
              { step: '04', title: 'Clinical Interview', desc: 'Trigger Inquiries', status: 'current' },
              { step: '05', title: 'Physician Review', desc: 'Dr. Sharma Synthesis', status: 'upcoming' },
            ].map((stage, idx, arr) => {
              const isCurrent = stage.status === 'current'
              const isCompleted = stage.status === 'completed'

              return (
                <div key={stage.step} className="flex flex-col justify-between relative group">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors',
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                            ? 'bg-teal-600 text-white ring-4 ring-teal-500/20 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      )}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stage.step}
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="hidden sm:block h-0.5 flex-1 bg-slate-200 dark:bg-slate-800" />
                    )}
                  </div>

                  <div>
                    <span
                      className={cn(
                        'text-sm font-bold block',
                        isCurrent
                          ? 'text-teal-700 dark:text-teal-300'
                          : isCompleted
                            ? 'text-slate-900 dark:text-slate-100'
                            : 'text-slate-400 dark:text-slate-500'
                      )}
                    >
                      {stage.title}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      {stage.desc}
                    </span>
                  </div>

                  {isCurrent && (
                    <div className="mt-2.5">
                      <span className="inline-block text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                        In Progress
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </AyuCard>
      </AyuSection>

      {/* =========================================================================
          SECTION 4 — WHAT NEEDS YOUR ATTENTION (Actionable & clear)
          ========================================================================= */}
      <AyuSection
        title={
          <div className="flex items-center gap-2">
            <span>What Needs Your Attention</span>
            <AyuBadge variant="amber" size="md">
              {activeAttentionItems.length} Action{activeAttentionItems.length !== 1 ? 's' : ''}
            </AyuBadge>
          </div>
        }
        subtitle="Resolving these clinical inquiries ensures Dr. Sharma has complete data before your appointment."
      >
        {activeAttentionItems.length === 0 ? (
          <AyuCard variant="highlight" padding="md" className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">
              All attention items resolved! Your case completeness is currently optimal.
            </p>
          </AyuCard>
        ) : (
          <div className="space-y-3">
            {activeAttentionItems.map((item) => (
              <AyuCard
                key={item.id}
                variant="default"
                padding="md"
                className="hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h3>
                      <AyuBadge
                        variant={item.priority === 'high' ? 'rose' : item.priority === 'medium' ? 'amber' : 'slate'}
                        size="sm"
                      >
                        {item.priority.toUpperCase()} PRIORITY
                      </AyuBadge>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                      <span className="text-slate-500 dark:text-slate-400">Needed: </span>
                      {item.whatIsNeeded}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Why it matters: </span>
                      {item.whyItMatters}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <AyuButton
                      variant="primary"
                      size="sm"
                      to={item.actionRoute}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      {item.actionLabel}
                    </AyuButton>
                    <AyuButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismissAttention(item.id)}
                    >
                      Mark Done
                    </AyuButton>
                  </div>
                </div>
              </AyuCard>
            ))}
          </div>
        )}
      </AyuSection>

      {/* =========================================================================
          SECTION 5 — QUICK ACTIONS (Four large, prominent cards)
          ========================================================================= */}
      <AyuSection
        title="Quick Actions"
        subtitle="Manage your health story, upload laboratory results, explore chronological records, or view your portable dossier."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Action 1: Tell Your Story */}
          <AyuCard
            variant="interactive"
            padding="lg"
            onClick={() => navigate('/patient/story')}
            className="flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                Tell Your Story
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Describe your symptoms, daily impact, and medication experiences in your own words.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Open Health Story</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </AyuCard>

          {/* Action 2: Upload Document */}
          <AyuCard
            variant="interactive"
            padding="lg"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                Upload Document
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Add lab reports, discharge summaries, or imaging scans with automated OCR verification.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
              <span>Upload Report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </AyuCard>

          {/* Action 3: View Timeline */}
          <AyuCard
            variant="interactive"
            padding="lg"
            onClick={() => navigate('/patient/timeline')}
            className="flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                View Timeline
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Navigate past hospital visits, symptom clusters, and medication changes chronologically.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              <span>Explore Timeline</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </AyuCard>

          {/* Action 4: Care Capsule */}
          <AyuCard
            variant="interactive"
            padding="lg"
            onClick={() => navigate('/patient/capsule')}
            className="flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                Care Capsule
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Generate, export, or print a verifiable complete health summary dossier for referrals.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Access Capsule</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </AyuCard>
        </div>
      </AyuSection>

      {/* =========================================================================
          SECTION 6 — RECENT ACTIVITY (Clean, uncluttered stream)
          ========================================================================= */}
      <AyuSection
        title="Recent Activity"
        subtitle="Chronological audit log of your patient health space updates."
        action={
          <AyuButton to="/patient/timeline" variant="ghost" size="sm">
            View All History →
          </AyuButton>
        }
      >
        <AyuCard variant="default" padding="none">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <MessageSquareText className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    Clinical interview updated
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Added Episode 4 symptoms & environmental trigger context
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-400 shrink-0">
                Today, 09:15 AM
              </span>
            </div>

            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    Blood report uploaded
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fasting Metabolic & Electrolyte Panel • Verified by OCR
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-400 shrink-0">
                Yesterday
              </span>
            </div>

            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    Consent preference changed
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Case sharing granted to Dr. Priya Sharma with cryptographic proof
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-400 shrink-0">
                2 days ago
              </span>
            </div>
          </div>
        </AyuCard>
      </AyuSection>

      {/* Quick Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Medical Document"
        subtitle="Add a laboratory report, imaging scan, or discharge summary to your health record."
      >
        <form onSubmit={handleQuickUpload} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 block mb-1.5">
              Document Name
            </label>
            <input
              type="text"
              required
              value={uploadDocName}
              onChange={(e) => setUploadDocName(e.target.value)}
              placeholder="e.g. Brain MRI T2 Contrast Study.pdf"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 block mb-1.5">
              Category
            </label>
            <select
              value={uploadDocCategory}
              onChange={(e) => setUploadDocCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Lab Report">Lab Report</option>
              <option value="Imaging">Imaging / Radiology</option>
              <option value="Discharge Summary">Discharge Summary</option>
              <option value="Prescription">Prescription</option>
              <option value="Consent">Consent Form</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <AyuButton variant="secondary" size="md" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </AyuButton>
            <AyuButton variant="primary" size="md" type="submit" isLoading={isUploading}>
              Upload Document
            </AyuButton>
          </div>
        </form>
      </Modal>

      {/* Notification Center Modal */}
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </div>
  )
}
