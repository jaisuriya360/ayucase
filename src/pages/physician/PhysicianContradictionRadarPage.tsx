import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Radio,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Printer,
  History,
  Info,
  ShieldCheck,
  Filter,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { RadarScanWidget } from '../../components/contradiction/RadarScanWidget'
import { InformationDifferenceCard } from '../../components/contradiction/InformationDifferenceCard'
import { ReviewedDifferenceHistory } from '../../components/contradiction/ReviewedDifferenceHistory'
import {
  INITIAL_INFORMATION_DIFFERENCES,
  INITIAL_REVIEW_HISTORY,
  type InformationDifference,
  type DifferenceReviewHistoryEntry,
  type DifferenceStatus,
  type ReconciliationStance,
} from '../../types/contradiction'
import { useNotifications } from '../../contexts/NotificationContext'

const CONTRADICTIONS_STORAGE_KEY = 'ayucase_contradictions_v9'
const HISTORY_STORAGE_KEY = 'ayucase_contradiction_history_v9'

export const PhysicianContradictionRadarPage: React.FC = () => {
  const { notifySuccess, notifyInfo } = useNotifications()

  // Differences State with LocalStorage Persistence
  const [differences, setDifferences] = useState<InformationDifference[]>(() => {
    try {
      const stored = localStorage.getItem(CONTRADICTIONS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.warn('Failed to parse contradictions from localStorage', e)
    }
    return INITIAL_INFORMATION_DIFFERENCES
  })

  // History State with LocalStorage Persistence
  const [history, setHistory] = useState<DifferenceReviewHistoryEntry[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) return parsed
      }
    } catch (e) {
      console.warn('Failed to parse contradiction history from localStorage', e)
    }
    return INITIAL_REVIEW_HISTORY
  })

  // Selected difference ID for focused view
  const [selectedDifferenceId, setSelectedDifferenceId] = useState<string>(differences[0]?.id || '')

  // Filter tab
  const [filterTab, setFilterTab] = useState<'all' | 'needs_review' | 'reviewed' | 'unclear' | 'history'>(
    'all'
  )

  // Persist differences & history
  useEffect(() => {
    try {
      localStorage.setItem(CONTRADICTIONS_STORAGE_KEY, JSON.stringify(differences))
    } catch (e) {
      console.warn('Failed to persist contradictions', e)
    }
  }, [differences])

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
    } catch (e) {
      console.warn('Failed to persist contradiction history', e)
    }
  }, [history])

  // Handle Stance Update
  const handleUpdateStance = (id: string, stance: ReconciliationStance) => {
    setDifferences((prev) =>
      prev.map((d) => (d.id === id ? { ...d, currentStance: stance } : d))
    )
    notifyInfo('Stance Updated', `Working focus set to "${stance}".`)
  }

  // Handle Status Update (Reviewed or Still Unclear)
  const handleMarkStatus = (
    id: string,
    newStatus: DifferenceStatus,
    physicianNote?: string
  ) => {
    const target = differences.find((d) => d.id === id)
    if (!target) return

    const previousStatus = target.status
    const timestamp = new Date().toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    // Update difference item
    setDifferences((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: newStatus,
              physicianNote: physicianNote || d.physicianNote,
              reviewedAt: timestamp,
              reviewer: 'Dr. Priya Sharma, MD',
            }
          : d
      )
    )

    // Add entry to History
    const historyEntry: DifferenceReviewHistoryEntry = {
      id: `hist-${Date.now()}`,
      differenceId: target.id,
      differenceTitle: target.title,
      previousStatus,
      newStatus,
      selectedStance: target.currentStance,
      timestamp,
      reviewer: 'Dr. Priya Sharma, MD',
      physicianNote: physicianNote || 'Audited during pre-consultation intelligence review.',
    }

    setHistory((prev) => [historyEntry, ...prev])

    if (newStatus === 'Reviewed') {
      notifySuccess('Difference Reviewed', `"${target.title}" marked as Reviewed.`)
    } else {
      notifyInfo('Flagged as Unclear', `"${target.title}" flagged for live consultation review.`)
    }
  }

  // Reset to initial demo state
  const handleReset = () => {
    setDifferences(INITIAL_INFORMATION_DIFFERENCES)
    setHistory(INITIAL_REVIEW_HISTORY)
    notifyInfo('Radar Reset', 'Contradiction radar reset to initial clinical baseline.')
  }

  // Filtered differences
  const filteredDifferences = differences.filter((d) => {
    if (filterTab === 'needs_review') return d.status === 'Needs Human Review'
    if (filterTab === 'reviewed') return d.status === 'Reviewed'
    if (filterTab === 'unclear') return d.status === 'Still Unclear'
    return true
  })

  return (
    <div className="space-y-7 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title="Contradiction Radar"
        subtitle="Active cross-validation of patient verbal statements against diagnostic records to identify information divergence."
        breadcrumbs={[
          { label: 'Workstation', href: '/physician/dashboard' },
          { label: 'Intelligence', href: '/physician/intelligence' },
          { label: 'Contradiction Radar' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <AnimatedButton
              variant="secondary"
              size="md"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={handleReset}
            >
              Reset Radar
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              size="md"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={() => {
                notifyInfo('Exporting Report', 'Generating contradiction audit report...')
                window.print()
              }}
            >
              Export Report
            </AnimatedButton>
          </div>
        }
      />

      {/* Mandatory Non-Diagnostic / Information Consistency Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm">
            Clinical Safety Notice • Information Consistency Protocol:
          </p>
          <p className="leading-relaxed">
            The Contradiction Radar detects variance between subjective patient statements and
            official medical records. <strong>This feature is about information consistency, NOT medical diagnosis.</strong> The system presents both sources side by side and{' '}
            <strong>does not decide which is correct</strong>. Resolution is reserved for clinical judgment by the attending physician.
          </p>
        </div>
      </div>

      {/* Interactive Radar Sweep HUD */}
      <RadarScanWidget
        differences={differences}
        selectedDifferenceId={selectedDifferenceId}
        onSelectDifference={(id) => {
          setSelectedDifferenceId(id)
          setFilterTab('all')
          const el = document.getElementById(`diff-card-${id}`)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }}
      />

      {/* Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </span>

          {[
            { id: 'all', label: `All (${differences.length})` },
            {
              id: 'needs_review',
              label: `Needs Human Review (${differences.filter((d) => d.status === 'Needs Human Review').length})`,
            },
            {
              id: 'reviewed',
              label: `Reviewed (${differences.filter((d) => d.status === 'Reviewed').length})`,
            },
            {
              id: 'unclear',
              label: `Still Unclear (${differences.filter((d) => d.status === 'Still Unclear').length})`,
            },
            { id: 'history', label: `History Log (${history.length})` },
          ].map((tab) => {
            const isActive = filterTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <span className="text-xs text-slate-400 self-end sm:self-auto font-mono">
          Patient: Aarav Chen (PT-DEMO-9042)
        </span>
      </div>

      {/* Main Differences Stream */}
      {filterTab !== 'history' && (
        <div className="space-y-6">
          {filteredDifferences.length === 0 ? (
            <GlassCard variant="default" className="p-8 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                No Differences in this View
              </h4>
              <p className="text-xs text-slate-500">
                Switch filters above to inspect all active or reviewed information discrepancies.
              </p>
            </GlassCard>
          ) : (
            filteredDifferences.map((diff) => (
              <div key={diff.id} id={`diff-card-${diff.id}`}>
                <InformationDifferenceCard
                  difference={diff}
                  onUpdateStance={handleUpdateStance}
                  onMarkStatus={handleMarkStatus}
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* History Log Section */}
      {(filterTab === 'all' || filterTab === 'history') && (
        <div className="space-y-4 pt-4">
          <ReviewedDifferenceHistory
            history={history}
            onClearHistory={() => {
              setHistory([])
              notifyInfo('History Cleared', 'Reviewed differences log cleared.')
            }}
          />
        </div>
      )}
    </div>
  )
}
