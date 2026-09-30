import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Filter,
  Download,
  RotateCcw,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { PhysicianMetricsRow } from '../../components/physician/PhysicianMetricsRow'
import { PatientQueueTable } from '../../components/physician/PatientQueueTable'
import { usePhysician } from '../../contexts/PhysicianContext'
import { useNotifications } from '../../contexts/NotificationContext'
import type { QueueFilterStatus } from '../../types/clinicalCase'

export const PhysicianPatientsPage: React.FC = () => {
  const { cases, metrics, setSelectedCaseId, resetDemoCases } = usePhysician()
  const { notifySuccess, notifyInfo } = useNotifications()
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<QueueFilterStatus>('All')

  const handleSelectCase = (caseNumber: string) => {
    setSelectedCaseId(caseNumber)
    navigate(`/physician/case/${caseNumber}`)
  }

  const handleExportData = () => {
    notifySuccess(
      'Cohort Roster Exported',
      `Generated fictional CSV export for ${cases.length} cases.`
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Patient Queue & Clinical Cohort Roster"
        subtitle="Prioritized intake directory, multi-parameter completeness metrics, and active review states across the clinical panel."
        breadcrumbs={[
          { label: 'Workstation', href: '/physician/dashboard' },
          { label: 'Patient Queue' },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <AnimatedButton
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExportData}
            >
              Export Cohort (CSV)
            </AnimatedButton>
            <AnimatedButton
              variant="secondary"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
              onClick={() => {
                resetDemoCases()
                notifyInfo('Demo State Restored', 'Reset 8 baseline clinical cases.')
              }}
            >
              Reset Demo
            </AnimatedButton>
          </div>
        }
      />

      {/* Metrics Row with Animated Counters */}
      <PhysicianMetricsRow
        metrics={metrics}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {/* Main Patient Queue Component */}
      <PatientQueueTable
        cases={cases}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onSelectCase={handleSelectCase}
        showTitle={false}
      />
    </div>
  )
}

