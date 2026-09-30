import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  Printer,
  Copy,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Stethoscope,
  Volume2,
  Lock,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { CareCapsuleCard } from '../../components/capsule/CareCapsuleCard'
import { CareCapsuleModal } from '../../components/capsule/CareCapsuleModal'
import { CareCapsulePrintModal } from '../../components/capsule/CareCapsulePrintModal'
import { usePatient } from '../../contexts/PatientContext'
import { useConsent } from '../../contexts/ConsentContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { getCareCapsuleData } from '../../data/careCapsuleData'

export const PatientCareCapsulePage: React.FC = () => {
  const { patient } = usePatient()
  const { permissions, witnessFictionalHash } = useConsent()
  const { notifySuccess } = useNotifications()
  const { speakText } = useAccessibility()
  const { t } = useLanguage()

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenPrint, setIsOpenPrint] = useState(false)

  const capsule = getCareCapsuleData(patient, permissions, witnessFictionalHash)

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title={t('capsule.title', 'AyuCase Care Capsule')}
        subtitle={t('capsule.subtitle', 'Self-contained, portable clinical dossier synthesizing your profile, timeline, voice statements, records, consent, and physician review.')}
        breadcrumbs={[
          { label: t('nav.dashboard', 'Patient Dashboard'), href: '/patient/dashboard' },
          { label: t('capsule.title', 'Care Capsule') },
        ]}
        badge={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              {capsule.demoBadge}
            </span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <AnimatedButton
              to="/patient/consent"
              variant="secondary"
              size="sm"
              leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
            >
              {t('consent.title', 'Consent Center')}
            </AnimatedButton>
            <AnimatedButton
              to="/patient/dashboard"
              variant="ghost"
              size="sm"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              {t('nav.dashboard', 'Dashboard')}
            </AnimatedButton>
          </div>
        }
      />

      {/* Prominent Privacy Indicator Card */}
      <GlassCard variant="default" className="p-5 border-2 border-emerald-500/40 bg-emerald-500/5 space-y-2">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="font-extrabold text-sm text-emerald-900 dark:text-emerald-300 block">
              "Your information is shown in this prototype using fictional data."
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Prototype Notice: AyuCase is an experimental clinical intelligence prototype. It does not claim interoperability with real medical systems (e.g. ABDM, ABHA, HL7 FHIR, or hospital EHR backends). All records and demographic profiles shown are purely fictional demonstration data.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Main Care Capsule Card */}
      <CareCapsuleCard variant="full" />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Link to="/patient/consent" className="block">
          <GlassCard variant="interactive" className="p-4 space-y-1.5 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Consent Control Center</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your 4 granular data permissions and view chronological audit history.
            </p>
          </GlassCard>
        </Link>

        <Link to="/patient/timeline" className="block">
          <GlassCard variant="interactive" className="p-4 space-y-1.5 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-500" />
                <span>Health Timeline</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore your multi-year interactive medical trajectory and gap detector.
            </p>
          </GlassCard>
        </Link>

        <Link to="/patient/story" className="block">
          <GlassCard variant="interactive" className="p-4 space-y-1.5 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Health Story & DNA</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              View your structured Case DNA constellation and interactive family health tree.
            </p>
          </GlassCard>
        </Link>
      </div>

      {/* Expanded Modal */}
      <CareCapsuleModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        capsule={capsule}
        onOpenPrint={() => setIsOpenPrint(true)}
      />

      {/* Print View Modal */}
      <CareCapsulePrintModal
        isOpen={isOpenPrint}
        onClose={() => setIsOpenPrint(false)}
        capsule={capsule}
      />
    </div>
  )
}
