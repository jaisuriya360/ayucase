import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Users,
  BriefcaseMedical,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Radio,
  Share2,
  Activity,
  Layers,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { PhysicianMetricsRow } from '../../components/physician/PhysicianMetricsRow'
import { PatientQueueTable } from '../../components/physician/PatientQueueTable'
import { usePhysician } from '../../contexts/PhysicianContext'
import { useLanguage } from '../../contexts/LanguageContext'
import type { QueueFilterStatus } from '../../types/clinicalCase'

export const PhysicianDashboardPage: React.FC = () => {
  const { physician, cases, metrics, setSelectedCaseId } = usePhysician()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<QueueFilterStatus>('All')

  const handleSelectCase = (caseNumber: string) => {
    setSelectedCaseId(caseNumber)
    navigate(`/physician/case/${caseNumber}`)
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Header with Practitioner Demographics */}
      <PageHeader
        title={`Clinical Workstation — ${physician.name}`}
        subtitle={`${physician.title} • ${physician.hospitalAffiliation}`}
        breadcrumbs={[
          { label: t('nav.physician.dashboard', 'Clinical Dashboard') },
        ]}
        badge={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {physician.registrationNumber}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Clinical Intake
            </span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <AnimatedButton
              to="/physician/contradictions"
              variant="secondary"
              size="sm"
              leftIcon={<Radio className="w-4 h-4 text-amber-500" />}
            >
              Contradiction Radar
            </AnimatedButton>
            <AnimatedButton
              to="/physician/patients"
              variant="primary"
              size="sm"
              leftIcon={<Users className="w-4 h-4" />}
            >
              Patient Roster
            </AnimatedButton>
          </div>
        }
      />

      {/* 2. Dashboard Metrics with Animated Counters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
            Clinical Triage Metrics
          </span>
          <span className="text-xs text-slate-400">Click any metric card to filter patient queue</span>
        </div>
        <PhysicianMetricsRow
          metrics={metrics}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />
      </div>

      {/* 3. Patient Queue Table with Columns & Search */}
      <div className="pt-2">
        <PatientQueueTable
          cases={cases}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onSelectCase={handleSelectCase}
        />
      </div>

      {/* 4. Quick Clinical Intelligence Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <GlassCard
          variant="interactive"
          onClick={() => navigate('/physician/contradictions')}
          className="p-5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Contradiction Radar
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cross-source information discrepancy detection between interview & records
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
        </GlassCard>

        <GlassCard
          variant="interactive"
          onClick={() => navigate('/physician/intelligence')}
          className="p-5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Case Constellation
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive 3D graph connecting symptoms, documents, timeline & phenotypes
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
        </GlassCard>

        <GlassCard
          variant="interactive"
          onClick={() => navigate('/physician/timeline')}
          className="p-5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Health Time Machine
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive multi-year chronological slider and information gap detector
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
        </GlassCard>
      </div>
    </div>
  )
}

