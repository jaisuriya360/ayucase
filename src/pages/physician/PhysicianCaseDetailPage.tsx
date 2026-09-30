import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  BriefcaseMedical,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Activity,
  ArrowRight,
  Share2,
  ChevronLeft,
  Zap,
  Compass,
  History,
  Layers,
  LayoutGrid,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { ErrorState } from '../../components/ui/ErrorState'
import { CaseDetailLeftPanel } from '../../components/physician/CaseDetailLeftPanel'
import { CaseDetailCenterPanel } from '../../components/physician/CaseDetailCenterPanel'
import { CaseDetailRightPanel } from '../../components/physician/CaseDetailRightPanel'
import { SixtySecondCaseBrief } from '../../components/physician/SixtySecondCaseBrief'
import { PhysicianAttentionMap } from '../../components/physician/PhysicianAttentionMap'
import { WhatChangedDeltaView } from '../../components/physician/WhatChangedDeltaView'
import { PatientPhysicianMirrorView } from '../../components/physician/PatientPhysicianMirrorView'
import { SourceTraceabilityModal } from '../../components/physician/SourceTraceabilityModal'
import { usePhysician } from '../../contexts/PhysicianContext'
import { useNotifications } from '../../contexts/NotificationContext'
import type { CaseStatus, CasePriority, SourceCitation } from '../../types/clinicalCase'
import { formatDate } from '../../utils/formatters'
import { cn } from '../../utils/cn'

type IntelligenceViewMode = 'standard' | 'brief' | 'attention' | 'what_changed' | 'mirror'

export const PhysicianCaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const {
    cases,
    updateCaseStatus,
    updateCasePriority,
    updateCaseAssessment,
    reviewCase,
    confirmCase,
  } = usePhysician()
  const { notifySuccess, notifyInfo } = useNotifications()
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState<string>('section-complaint')
  const [activeViewMode, setActiveViewMode] = useState<IntelligenceViewMode>('standard')
  const [selectedCitation, setSelectedCitation] = useState<SourceCitation | null>(null)
  const [mobilePanelTab, setMobilePanelTab] = useState<'center' | 'left' | 'right' | 'all'>('center')

  // Match by id or fictional case number
  const currentCase =
    cases.find((c) => c.fictionalCaseNumber === id || c.id === id) || (id ? undefined : cases[0])

  if (!currentCase) {
    return (
      <div className="py-12 max-w-xl mx-auto">
        <ErrorState
          title="Clinical Case Not Found"
          message={`Unable to locate clinical case with ID "${id}". It may have been completed or removed.`}
          onRetry={() => navigate('/physician/patients')}
        />
      </div>
    )
  }

  const handleStatusChange = (newStatus: CaseStatus) => {
    updateCaseStatus(currentCase.id, newStatus)
    notifySuccess('Status Updated', `Case ${currentCase.fictionalCaseNumber} set to "${newStatus}"`)
  }

  const handlePriorityChange = (newPriority: CasePriority) => {
    updateCasePriority(currentCase.id, newPriority)
    notifyInfo('Priority Adjusted', `Clinical priority updated to "${newPriority}"`)
  }

  const handleEditSave = (notes: string, plan: string) => {
    updateCaseAssessment(currentCase.id, notes, plan)
    notifySuccess('Assessment Saved', 'Clinical impression and plan updated successfully.')
  }

  const handleReview = () => {
    reviewCase(currentCase.id)
    notifySuccess(
      'AI Synthesis Reviewed',
      `Case ${currentCase.fictionalCaseNumber} verified against medical documents and marked as Active Review.`
    )
  }

  const handleConfirm = () => {
    confirmCase(currentCase.id)
    notifySuccess(
      'Case Formally Confirmed',
      `Physician sign-off complete. Signed with electronic hash and marked as Completed.`
    )
  }

  const handleSectionScroll = (sectionId: string) => {
    setActiveSection(sectionId)
    setActiveViewMode('standard')
    setMobilePanelTab('center')
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleOpenSourceCitation = (citationId: string) => {
    const found = currentCase.sourceCitations?.find((c) => c.id === citationId)
    if (found) {
      setSelectedCitation(found)
    } else if (currentCase.sourceCitations && currentCase.sourceCitations.length > 0) {
      setSelectedCitation(currentCase.sourceCitations[0])
    } else {
      setSelectedCitation({
        id: citationId,
        title: 'Verbatim Intake Extract',
        value: currentCase.chiefComplaint,
        documentName: 'Patient_Intake_Transcript_2026.pdf',
        pageNumber: 1,
        lineOrSection: 'Section 1.2',
        date: formatDate(currentCase.lastUpdated),
        snippet: `Documented clinical statement: "${currentCase.chiefComplaint}"`,
        confidenceScore: 0.98,
        verificationStatus: 'Verified',
      })
    }
  }

  const navigationTabs: Array<{
    id: IntelligenceViewMode
    label: string
    shortLabel: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
    color: string
  }> = [
    {
      id: 'standard',
      label: 'Structured Case View',
      shortLabel: 'Structured Case',
      icon: LayoutGrid,
      color: 'text-slate-600 dark:text-slate-300',
    },
    {
      id: 'brief',
      label: '60-Second Brief',
      shortLabel: '60-Sec Brief',
      icon: Zap,
      badge: 'Flash',
      color: 'text-amber-500',
    },
    {
      id: 'attention',
      label: 'Attention Map',
      shortLabel: 'Attention Map',
      icon: Compass,
      badge: `${currentCase.attentionItems?.length || 4}`,
      color: 'text-cyan-500',
    },
    {
      id: 'what_changed',
      label: 'What Changed?',
      shortLabel: 'What Changed',
      icon: History,
      badge: `${currentCase.whatChangedItems?.length || 5}`,
      color: 'text-indigo-500',
    },
    {
      id: 'mirror',
      label: 'Patient–Physician Case Mirror',
      shortLabel: 'Case Mirror',
      icon: Layers,
      badge: 'Voice',
      color: 'text-emerald-500',
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title={`Clinical Case ${currentCase.fictionalCaseNumber} — ${currentCase.patientName}`}
        subtitle={`Intake trajectory synthesized on ${formatDate(currentCase.lastUpdated)} • Primary: ${currentCase.primaryCondition}`}
        breadcrumbs={[
          { label: 'Workstation', href: '/physician/dashboard' },
          { label: 'Patient Queue', href: '/physician/patients' },
          { label: currentCase.fictionalCaseNumber },
        ]}
        badge={
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                currentCase.priority === 'Critical' || currentCase.priority === 'High'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
              }`}
            >
              {currentCase.priority} Priority
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {currentCase.status}
            </span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <AnimatedButton
              to="/physician/patients"
              variant="secondary"
              size="sm"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Back to Queue
            </AnimatedButton>
          </div>
        }
      />

      {/* Case Intelligence Navigation Toolbar */}
      <GlassCard
        variant="elevated"
        className="p-2 sm:p-2.5 flex items-center justify-between gap-2 overflow-x-auto border-2 border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm"
      >
        <div className="flex items-center gap-1.5 min-w-max">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeViewMode === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveViewMode(tab.id)}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer select-none',
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-white' : tab.color)} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{tab.shortLabel}</span>
                {tab.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Source Citation Trigger Quick Button */}
        <button
          type="button"
          onClick={() => handleOpenSourceCitation('cit-1')}
          className="px-3 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="hidden md:inline">Source Inspector</span>
          <span className="md:hidden">Sources</span>
        </button>
      </GlassCard>

      {/* DYNAMIC CASE INTELLIGENCE WORKSPACE */}

      {/* MODE 1: 60-Second Case Brief */}
      {activeViewMode === 'brief' && (
        <div className="space-y-4 animate-fadeIn">
          <SixtySecondCaseBrief
            currentCase={currentCase}
            onClose={() => setActiveViewMode('standard')}
            onNavigateSection={handleSectionScroll}
          />
        </div>
      )}

      {/* MODE 2: Physician Attention Map */}
      {activeViewMode === 'attention' && (
        <div className="space-y-4 animate-fadeIn">
          <PhysicianAttentionMap
            currentCase={currentCase}
            onSelectItem={handleSectionScroll}
            onOpenSourceTraceability={handleOpenSourceCitation}
          />
        </div>
      )}

      {/* MODE 3: What Changed? Longitudinal Delta View */}
      {activeViewMode === 'what_changed' && (
        <div className="space-y-4 animate-fadeIn">
          <WhatChangedDeltaView currentCase={currentCase} />
        </div>
      )}

      {/* MODE 4: Patient–Physician Case Mirror */}
      {activeViewMode === 'mirror' && (
        <div className="space-y-4 animate-fadeIn">
          <PatientPhysicianMirrorView
            currentCase={currentCase}
            onOpenSource={handleOpenSourceCitation}
          />
        </div>
      )}

      {/* MODE 0 (DEFAULT): Standard Patient Case View */}
      {activeViewMode === 'standard' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Mobile Workstation Panel Switcher (< lg screens only) */}
          <div className="lg:hidden flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setMobilePanelTab('center')}
              className={cn(
                'flex-1 min-w-[105px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all',
                mobilePanelTab === 'center'
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Structured Case</span>
            </button>
            <button
              type="button"
              onClick={() => setMobilePanelTab('left')}
              className={cn(
                'flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all',
                mobilePanelTab === 'left'
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient & Nav</span>
            </button>
            <button
              type="button"
              onClick={() => setMobilePanelTab('right')}
              className={cn(
                'flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all',
                mobilePanelTab === 'right'
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intelligence</span>
            </button>
            <button
              type="button"
              onClick={() => setMobilePanelTab('all')}
              className={cn(
                'py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all shrink-0',
                mobilePanelTab === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-800'
              )}
              title="Show all columns stacked"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Patient Info, Case Status, Navigation (3 cols) */}
            <div
              className={cn(
                'lg:col-span-3 space-y-4',
                mobilePanelTab !== 'left' && mobilePanelTab !== 'all' && 'hidden lg:block'
              )}
            >
              <CaseDetailLeftPanel
                currentCase={currentCase}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                activeSection={activeSection}
                onSectionClick={handleSectionScroll}
              />
            </div>

            {/* CENTER COLUMN: Structured Case (6 cols) */}
            <div
              className={cn(
                'lg:col-span-6 space-y-6',
                mobilePanelTab !== 'center' && mobilePanelTab !== 'all' && 'hidden lg:block'
              )}
            >
              <CaseDetailCenterPanel
                currentCase={currentCase}
                onEditSave={handleEditSave}
                onReview={handleReview}
                onConfirm={handleConfirm}
                onOpenSourceCitation={handleOpenSourceCitation}
              />
            </div>

            {/* RIGHT COLUMN: Case Intelligence (3 cols) */}
            <div
              className={cn(
                'lg:col-span-3 space-y-4',
                mobilePanelTab !== 'right' && mobilePanelTab !== 'all' && 'hidden lg:block'
              )}
            >
              <CaseDetailRightPanel
                currentCase={currentCase}
                onSelectIntelligenceView={(view) => setActiveViewMode(view)}
                onOpenSourceCitation={handleOpenSourceCitation}
              />
            </div>
          </div>
        </div>
      )}

      {/* Source Document Traceability Modal */}
      <SourceTraceabilityModal
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
      />
    </div>
  )
}
