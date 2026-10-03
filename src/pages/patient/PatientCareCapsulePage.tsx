import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Clock,
  FileText,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { AyuCard } from '../../components/ui/AyuCard'
import { AyuButton } from '../../components/ui/AyuButton'
import { AyuBadge } from '../../components/ui/AyuBadge'
import { CareCapsuleCard } from '../../components/capsule/CareCapsuleCard'
import { usePatient } from '../../contexts/PatientContext'
import { useConsent } from '../../contexts/ConsentContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { getCareCapsuleData } from '../../data/careCapsuleData'

export const PatientCareCapsulePage: React.FC = () => {
  const { patient } = usePatient()
  const { permissions, witnessFictionalHash } = useConsent()
  const { t } = useLanguage()

  const capsule = getCareCapsuleData(patient, permissions, witnessFictionalHash)

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title={t('capsule.title', 'AYUCASE Care Capsule')}
        subtitle={t('capsule.subtitle', 'Self-contained, portable clinical dossier synthesizing your profile, timeline, voice statements, records, consent, and physician review.')}
        breadcrumbs={[
          { label: t('nav.dashboard', 'Dashboard'), href: '/patient/dashboard' },
          { label: t('capsule.title', 'Care Capsule') },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <AyuButton
              to="/patient/consent"
              variant="secondary"
              size="sm"
              leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            >
              {t('consent.title', 'Consent Center')}
            </AyuButton>
            <AyuButton
              to="/patient/dashboard"
              variant="ghost"
              size="sm"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              {t('nav.dashboard', 'Dashboard')}
            </AyuButton>
          </div>
        }
      />

      {/* Main Care Capsule Card */}
      <CareCapsuleCard variant="full" />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Link to="/patient/consent" className="block group">
          <AyuCard variant="interactive" padding="md" className="space-y-1.5 h-full">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Consent Control Center</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your 4 granular data permissions and view chronological audit history.
            </p>
          </AyuCard>
        </Link>

        <Link to="/patient/timeline" className="block group">
          <AyuCard variant="interactive" padding="md" className="space-y-1.5 h-full">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Health Timeline</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore your multi-year interactive medical trajectory and gap detector.
            </p>
          </AyuCard>
        </Link>

        <Link to="/patient/story" className="block group">
          <AyuCard variant="interactive" padding="md" className="space-y-1.5 h-full">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Health Story & DNA</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              View your structured Case DNA constellation and interactive family health tree.
            </p>
          </AyuCard>
        </Link>
      </div>
    </div>
  )
}
