import React, { useState } from 'react'
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
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import { CareCapsuleModal } from './CareCapsuleModal'
import { CareCapsulePrintModal } from './CareCapsulePrintModal'
import { usePatient } from '../../contexts/PatientContext'
import { useConsent } from '../../contexts/ConsentContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { getCareCapsuleData } from '../../data/careCapsuleData'
import { cn } from '../../utils/cn'

interface CareCapsuleCardProps {
  className?: string
  variant?: 'compact' | 'full'
}

export const CareCapsuleCard: React.FC<CareCapsuleCardProps> = ({
  className,
  variant = 'compact',
}) => {
  const { patient } = usePatient()
  const { permissions, witnessFictionalHash } = useConsent()
  const { notifySuccess } = useNotifications()
  const { speakText } = useAccessibility()
  const { t } = useLanguage()

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenPrint, setIsOpenPrint] = useState(false)

  const capsule = getCareCapsuleData(patient, permissions, witnessFictionalHash)

  const grantedCount = Object.values(permissions).filter((p) => p === 'Granted').length

  const handleCopySummary = () => {
    const text = `=== AYUCASE CARE CAPSULE ===
Status: ${capsule.demoBadge}
Privacy Indicator: ${capsule.privacyIndicator}
${capsule.interoperabilityDisclaimer}

[PATIENT PROFILE]
Name: ${capsule.patientProfile.name} (ID: ${capsule.patientProfile.fictionalId})
Condition: ${capsule.patientProfile.primaryCondition}
Attending: ${capsule.patientProfile.attendingPhysician}

[CONSENT STATUS]
- Voice Interview: ${capsule.consentStatus.permissions.voiceInterview}
- Medical Documents: ${capsule.consentStatus.permissions.medicalDocuments}
- Health History: ${capsule.consentStatus.permissions.healthHistory}
- Case Sharing: ${capsule.consentStatus.permissions.caseSharing}
Witness Hash: ${capsule.consentStatus.witnessHash}

[TIMELINE HIGHLIGHTS]
${capsule.timeline.map((t) => `• ${t.year}: ${t.title}`).join('\n')}

[PATIENT STATEMENTS]
${capsule.patientStatements.map((s) => `• "${s.quote}"`).join('\n')}

[DOCUMENTS]
${capsule.documents.map((d) => `• ${d.title} (${d.status})`).join('\n')}

[MISSING INFORMATION]
${capsule.missingInformation.map((m) => `• ${m.parameter}: ${m.impact}`).join('\n')}

[PHYSICIAN REVIEW]
Attending: ${capsule.physicianReview.attendingPhysician}
Status: ${capsule.physicianReview.reviewStatus}
Signature Hash: ${capsule.physicianReview.electronicSignatureHash}
==================================================`

    navigator.clipboard.writeText(text)
    notifySuccess('Demo Summary Copied', 'Care Capsule text summary copied to clipboard.')
  }

  const handleReadAloud = () => {
    const speech = `AyuCase Care Capsule for ${capsule.patientProfile.name}. Fictional demonstration record. Condition: ${capsule.patientProfile.primaryCondition}. Review status: ${capsule.physicianReview.reviewStatus}. Your information is shown in this prototype using fictional data.`
    speakText(speech)
  }

  return (
    <>
      <GlassCard
        variant="elevated"
        className={cn(
          'p-5 sm:p-6 relative overflow-hidden border-2 border-emerald-500/40 bg-gradient-to-br from-white/95 via-emerald-500/5 to-cyan-500/5 dark:from-slate-900/95 dark:via-emerald-950/20 dark:to-cyan-950/20 shadow-xl',
          className
        )}
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-4">
          {/* Top Row: Title, Badges, Privacy Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 shrink-0">
                <Package className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-base text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>{t('capsule.title', 'CARE CAPSULE')}</span>
                  </h3>
                  {/* Mandated Label */}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    {capsule.demoBadge}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {capsule.capsuleId} • Unified Clinical Record Package
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={handleReadAloud}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Listen to Capsule Overview"
                aria-label="Listen to Capsule Overview"
              >
                <Volume2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </button>
              <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                {capsule.physicianReview.reviewStatus} ✓
              </span>
            </div>
          </div>

          {/* Mandated Privacy Indicator Pill */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-extrabold text-emerald-800 dark:text-emerald-300 block">
                {capsule.privacyIndicator}
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                {capsule.interoperabilityDisclaimer}
              </p>
            </div>
          </div>

          {/* Compact 7-Parameter Telemetry Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* 1. Patient Profile */}
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-0.5">
              <span className="text-[9px] font-bold uppercase text-slate-400 block">{t('capsule.patientProfile', 'Profile')}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                {capsule.patientProfile.name}
              </span>
              <span className="text-[10px] text-slate-500">{capsule.patientProfile.age}y • {capsule.patientProfile.bloodGroup}</span>
            </div>

            {/* 2. Timeline */}
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-0.5">
              <span className="text-[9px] font-bold uppercase text-slate-400 block">{t('capsule.timeline', 'Timeline')}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                {capsule.timeline.length} Milestones
              </span>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">2021 &rarr; 2026</span>
            </div>

            {/* 3. Patient Statements */}
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-0.5">
              <span className="text-[9px] font-bold uppercase text-slate-400 block">{t('capsule.patientStatements', 'Statements')}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                {capsule.patientStatements.length} Quotes
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Voice Ingested</span>
            </div>

            {/* 4. Documents */}
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-0.5">
              <span className="text-[9px] font-bold uppercase text-slate-400 block">{t('capsule.documents', 'Documents')}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                {capsule.documents.length} Clinical Files
              </span>
              <span className="text-[10px] text-slate-500">100% Extracted</span>
            </div>

            {/* 5. Consent Status */}
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-0.5">
              <span className="text-[9px] font-bold uppercase text-slate-400 block">{t('capsule.consentStatus', 'Consent')}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                {grantedCount} of 4 Granted
              </span>
              <span className="text-[10px] font-mono text-slate-400 truncate block">{capsule.consentStatus.witnessHash}</span>
            </div>

            {/* 6. Missing Info */}
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-0.5">
              <span className="text-[9px] font-bold uppercase text-amber-500 block">{t('capsule.missingInformation', 'Missing Info')}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                {capsule.missingInformation.length} Parameters
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400">Unknown Zone</span>
            </div>

            {/* 7. Physician Review */}
            <div className="col-span-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-0.5">
              <span className="text-[9px] font-bold uppercase text-indigo-500 block">{t('capsule.physicianReviewStatus', 'Physician Review')}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                {capsule.physicianReview.attendingPhysician}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Signature: {capsule.physicianReview.electronicSignatureHash}
              </span>
            </div>
          </div>

          {/* Action Toolbar: Open Capsule, Print-style View, Copy Demo Summary */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                aria-label={t('capsule.copy', 'Copy Demo Summary')}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{t('capsule.copy', 'Copy Demo Summary')}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOpenPrint(true)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                aria-label={t('capsule.print', 'Print-style View')}
              >
                <Printer className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{t('capsule.print', 'Print-style View')}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsOpenModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
              aria-label={t('capsule.open', 'Open Capsule')}
            >
              <Package className="w-4 h-4" />
              <span>{t('capsule.open', 'Open Capsule')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </GlassCard>

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
    </>
  )
}
