import React, { useState } from 'react'
import {
  Package,
  Printer,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  Volume2,
  ChevronRight,
  Sparkles,
  Lock,
  User,
  Stethoscope,
  MessageSquareQuote,
  HelpCircle,
} from 'lucide-react'
import { AyuCard } from '../ui/AyuCard'
import { AyuButton } from '../ui/AyuButton'
import { AyuBadge } from '../ui/AyuBadge'
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

  const handleShareExport = () => {
    const text = `=== AYUCASE CARE CAPSULE ===
Patient: ${capsule.patientProfile.name} (ID: ${capsule.patientProfile.fictionalId})
Condition: ${capsule.patientProfile.primaryCondition}
Attending: ${capsule.patientProfile.attendingPhysician}
Verification Hash: ${capsule.consentStatus.witnessHash}
Status: Clinical Review Verified
==================================================`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      notifySuccess('Care Capsule Exported', 'Secure capsule summary copied to clipboard.')
    }
  }

  const handleReadAloud = () => {
    const speech = `AYUCASE Care Capsule for ${capsule.patientProfile.name}. Unified portable clinical record. Primary condition: ${capsule.patientProfile.primaryCondition}. Review status: ${capsule.physicianReview.reviewStatus}.`
    speakText(speech)
  }

  const sections = [
    { label: 'Patient Profile', icon: User, value: capsule.patientProfile.name, status: 'Verified' },
    { label: 'Health Timeline', icon: Clock, value: `${capsule.timeline.length} Milestones`, status: '2019–2026' },
    { label: 'Clinical Documents', icon: FileText, value: `${capsule.documents.length} Records`, status: 'OCR Parsed' },
    { label: 'Voice Story', icon: MessageSquareQuote, value: `${capsule.patientStatements.length} Statements`, status: 'Transcribed' },
    { label: 'Consent Status', icon: ShieldCheck, value: 'Active Autonomy', status: 'Cryptographic' },
    { label: 'Clinical Review', icon: Stethoscope, value: capsule.physicianReview.reviewStatus, status: 'Dr. Priya Sharma' },
  ]

  return (
    <>
      <AyuCard
        variant="default"
        padding="lg"
        className={cn(
          'relative overflow-hidden border-2 border-emerald-500/30 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/20 dark:from-slate-900 dark:via-emerald-950/20 dark:to-teal-950/20',
          className
        )}
      >
        <div className="space-y-5">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                    AYUCASE Care Capsule
                  </h3>
                  <AyuBadge variant="emerald" size="sm">
                    Complete Health Summary
                  </AyuBadge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Unified portable clinical dossier synthesizing your complete health narrative.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={handleReadAloud}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Listen to Capsule Overview"
                aria-label="Listen to Capsule Overview"
              >
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>
          </div>

          {/* 6 Key Structured Pillar Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sections.map((sec, idx) => {
              const Icon = sec.icon
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{sec.label}</span>
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {sec.value}
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium block">
                    {sec.status}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Dossier ID: {capsule.capsuleId}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <AyuButton
                variant="primary"
                size="sm"
                onClick={() => setIsOpenModal(true)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Open Capsule
              </AyuButton>
              <AyuButton
                variant="secondary"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => setIsOpenPrint(true)}
              >
                Print
              </AyuButton>
              <AyuButton
                variant="secondary"
                size="sm"
                leftIcon={<Share2 className="w-4 h-4" />}
                onClick={handleShareExport}
              >
                Share / Export
              </AyuButton>
            </div>
          </div>
        </div>
      </AyuCard>

      {/* Expanded Modal with Progressive Disclosure Tabs */}
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
