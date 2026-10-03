import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mic,
  FileText,
  Users,
  Volume2,
  VolumeX,
  History,
  AlertTriangle,
  ArrowRight,
  Lock,
  RotateCcw,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Package,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { AyuCard } from '../../components/ui/AyuCard'
import { AyuButton } from '../../components/ui/AyuButton'
import { AyuBadge } from '../../components/ui/AyuBadge'
import { AyuStatus } from '../../components/ui/AyuStatus'
import { Modal } from '../../components/ui/Modal'
import { CareCapsuleCard } from '../../components/capsule/CareCapsuleCard'
import { useConsent } from '../../contexts/ConsentContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { usePatient } from '../../contexts/PatientContext'
import type {
  ConsentPermissionKey,
  PermissionState,
  ConsentPermissionItem,
} from '../../types/consent'
import { cn } from '../../utils/cn'

const PERMISSIONS_CONFIG: ConsentPermissionItem[] = [
  {
    key: 'voiceInterview',
    title: 'Voice Interview',
    subtitle: 'Conversational audio capture & vocal phenotype analysis',
    description:
      'Permits AYUCASE to record and transcribe your voice check-in answers, extracting symptom severity, vocal markers, and timeline descriptors for clinical review.',
    category: 'Symptom & Vocal Telemetry',
    isRequired: true,
    clinicalImpactNotice:
      'Withdrawing Voice Interview consent will disable speech recording and vocal check-ins. You will have to type all symptoms manually.',
    iconName: 'Mic',
  },
  {
    key: 'medicalDocuments',
    title: 'Medical Documents',
    subtitle: 'Diagnostic lab reports, volumetric MRI, & prescriptions',
    description:
      'Authorizes secure ingestion, OCR parsing, and clinical verification of uploaded medical documents, lab results, and imaging scans.',
    category: 'Diagnostic Records',
    isRequired: true,
    clinicalImpactNotice:
      'Withdrawing Medical Documents consent will pause automated document OCR and prevent physicians from cross-referencing your lab reports.',
    iconName: 'FileText',
  },
  {
    key: 'healthHistory',
    title: 'Health History',
    subtitle: 'Longitudinal illness chronology & condition trajectory',
    description:
      'Enables deep chronological synthesis across previous diagnoses, chronic conditions, medication changes, and historical milestone tracking.',
    category: 'Longitudinal Trajectory',
    isRequired: false,
    clinicalImpactNotice:
      'Withdrawing Health History consent limits clinical correlation models to recent visits rather than your full multi-year health trajectory.',
    iconName: 'Clock',
  },
  {
    key: 'caseSharing',
    title: 'Case Sharing',
    subtitle: 'Attending physician collaboration & care team review',
    description:
      'Allows your assigned physician Dr. Priya Sharma and multi-disciplinary clinical specialists to review your synthesized case file and telemetry alerts.',
    category: 'Care Team Collaboration',
    isRequired: false,
    clinicalImpactNotice:
      'Withdrawing Case Sharing consent halts real-time alert broadcasts to your attending physician and requires emergency override access.',
    iconName: 'Users',
  },
]

export const PatientConsentPage: React.FC = () => {
  const {
    permissions,
    history,
    grantPermission,
    withdrawPermission,
    resetPermission,
    grantAll,
    withdrawAll,
    resetAll,
    isRequiredConsentGranted,
    witnessFictionalHash,
  } = useConsent()

  const { t, language } = useLanguage()
  const { notifySuccess, notifyWarning, notifyInfo } = useNotifications()
  const { isElderMode } = useAccessibility()
  const { patient } = usePatient()
  const navigate = useNavigate()

  // Modals & UI States
  const [withdrawingKey, setWithdrawingKey] = useState<ConsentPermissionKey | 'ALL' | null>(null)
  const [isHistoryExpanded, setIsHistoryExpanded] = useState<boolean>(true)
  const [historyFilter, setHistoryFilter] = useState<'All' | 'Granted' | 'Revoked' | 'Reset'>('All')
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [showExplanationModal, setShowExplanationModal] = useState<boolean>(false)

  // Speech synthesis explanation text
  const explanationTextEn =
    'Welcome to the AYUCASE Consent Control Center. You have complete autonomy over your health narrative. Four granular permissions protect your rights: Voice Interview, Medical Documents, Health History, and Case Sharing. You may grant, revoke, or reset consent at any time.'

  const explanationTextTa =
    'ஆயுகேஸ் ஒப்புதல் கட்டுப்பாட்டு மையத்திற்கு நல்வரவு. உங்கள் மருத்துவத் தகவல்களை யார் பார்க்க வேண்டும் என்பதை நீங்களே முழுமையாகத் தீர்மானிக்கலாம். குரல் நேர்காணல், மருத்துவ ஆவணங்கள், உடல்நல வரலாறு மற்றும் வழக்கு பகிர்வு ஆகிய நான்கு அனுமதிகளை நீங்கள் எப்போது வேண்டுமானாலும் வழங்கலாம் அல்லது திரும்பப் பெறலாம்.'

  const activeExplanation = language === 'ta' ? explanationTextTa : explanationTextEn

  const handleListenExplanation = () => {
    if ('speechSynthesis' in window) {
      try {
        if (isSpeaking) {
          window.speechSynthesis.cancel()
          setIsSpeaking(false)
          notifyInfo('Audio Stopped', 'Consent explanation paused.')
        } else {
          window.speechSynthesis.cancel()
          const utterance = new SpeechSynthesisUtterance(activeExplanation)
          utterance.lang = language === 'ta' ? 'ta-IN' : 'en-US'
          utterance.rate = 0.95
          utterance.onend = () => setIsSpeaking(false)
          utterance.onerror = () => setIsSpeaking(false)
          window.speechSynthesis.speak(utterance)
          setIsSpeaking(true)
          notifyInfo('Playing Audio', 'Reading consent autonomy explanation aloud.')
        }
      } catch (e) {
        setShowExplanationModal(true)
      }
    } else {
      setShowExplanationModal(true)
    }
  }

  const handleGrant = (key: ConsentPermissionKey) => {
    grantPermission(key)
    notifySuccess('Consent Granted', `${getPermissionTitle(key)} permission is now active.`)
  }

  const handleReset = (key: ConsentPermissionKey) => {
    resetPermission(key, 'Patient reset permission to Not Granted.')
    notifyInfo('Consent Reset', `${getPermissionTitle(key)} set to Not Granted.`)
  }

  const handlePromptWithdraw = (key: ConsentPermissionKey | 'ALL') => {
    setWithdrawingKey(key)
  }

  const handleConfirmWithdraw = () => {
    if (withdrawingKey === 'ALL') {
      withdrawAll('Patient initiated bulk withdrawal of all permissions.')
      notifyWarning('All Consents Revoked', 'All 4 permissions have been withdrawn.')
    } else if (withdrawingKey) {
      withdrawPermission(withdrawingKey, 'Patient initiated consent revocation.')
      notifyWarning('Consent Withdrawn', `${getPermissionTitle(withdrawingKey)} permission revoked.`)
    }
    setWithdrawingKey(null)
  }

  const getPermissionTitle = (key: ConsentPermissionKey): string => {
    return PERMISSIONS_CONFIG.find((p) => p.key === key)?.title || key
  }

  const getPermissionIcon = (name: string) => {
    switch (name) {
      case 'Mic':
        return <Mic className="w-5 h-5" />
      case 'FileText':
        return <FileText className="w-5 h-5" />
      case 'Clock':
        return <Clock className="w-5 h-5" />
      case 'Users':
      default:
        return <Users className="w-5 h-5" />
    }
  }

  const renderStatusBadge = (state: PermissionState) => {
    switch (state) {
      case 'Granted':
        return (
          <AyuBadge variant="emerald" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            ✓ Granted
          </AyuBadge>
        )
      case 'Revoked':
        return (
          <AyuBadge variant="rose" size="sm" icon={<AlertCircle className="w-3.5 h-3.5" />}>
            ⊘ Withdrawn
          </AyuBadge>
        )
      case 'Not Granted':
      default:
        return (
          <AyuBadge variant="slate" size="sm" icon={<Clock className="w-3.5 h-3.5" />}>
            × Not Granted
          </AyuBadge>
        )
    }
  }

  const grantedCount = Object.values(permissions).filter((s) => s === 'Granted').length
  const revokedCount = Object.values(permissions).filter((s) => s === 'Revoked').length
  const notGrantedCount = Object.values(permissions).filter((s) => s === 'Not Granted').length

  const filteredHistory = history.filter(
    (entry) => historyFilter === 'All' || entry.action === historyFilter
  )

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title={t('consent.title', 'Consent & Autonomy Control Center')}
        subtitle={t('consent.subtitle', 'Manage your illness narrative permissions, clinical document access, and care team sharing with complete autonomy.')}
        breadcrumbs={[
          { label: t('nav.dashboard', 'Dashboard'), href: '/patient/dashboard' },
          { label: t('consent.title', 'Consent') },
        ]}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <AyuButton
              variant={isSpeaking ? 'destructive' : isElderMode ? 'elder' : 'secondary'}
              size="sm"
              onClick={handleListenExplanation}
              leftIcon={
                isSpeaking ? (
                  <VolumeX className="w-4 h-4 animate-pulse" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )
              }
            >
              {isSpeaking
                ? 'Stop Audio'
                : language === 'ta'
                ? 'ஒப்புதல் விளக்கம்'
                : 'Listen to Rights'}
            </AyuButton>

            <AyuButton
              variant="primary"
              size="sm"
              disabled={!isRequiredConsentGranted}
              onClick={() => {
                notifySuccess('Continuing to Dashboard', 'All required permissions are verified.')
                navigate('/patient/dashboard')
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Patient Dashboard
            </AyuButton>
          </div>
        }
      />

      {/* Patient Autonomy Notice */}
      <AyuCard variant="default" padding="md" className="border-l-4 border-l-emerald-600">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
              Patient Data Dignity & Sovereignty
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
              You maintain sovereign ownership of your health narrative. Permissions operate on a strict least-privilege basis and can be modified or revoked at any time. Revocation is instantaneous and cryptographically logged to your audit timeline.
            </p>
          </div>
        </div>
      </AyuCard>

      {/* Overview & Autonomy Controls */}
      <AyuCard variant="default" padding="lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Granular Health Narrative Permissions
                </h2>
                <div className="flex items-center gap-1.5">
                  <AyuBadge variant="emerald" size="sm">
                    {grantedCount} Granted
                  </AyuBadge>
                  <AyuBadge variant="slate" size="sm">
                    {notGrantedCount} Not Granted
                  </AyuBadge>
                  {revokedCount > 0 && (
                    <AyuBadge variant="rose" size="sm">
                      {revokedCount} Withdrawn
                    </AyuBadge>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Each permission operates independently. You can grant, revoke, or reset individual permissions at any time without impacting your access to emergency care.
              </p>
            </div>
          </div>

          {/* Quick Bulk Actions */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-center flex-wrap">
            <AyuButton
              variant="secondary"
              size="sm"
              onClick={grantAll}
            >
              Grant All
            </AyuButton>
            <AyuButton
              variant="ghost"
              size="sm"
              onClick={() => handlePromptWithdraw('ALL')}
              className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              Withdraw All
            </AyuButton>
            <AyuButton
              variant="secondary"
              size="sm"
              onClick={() => {
                resetAll('Patient initiated bulk reset of permissions to Not Granted.')
                notifyInfo('All Permissions Reset', 'All 4 permissions have been set to Not Granted.')
              }}
            >
              Reset All
            </AyuButton>
          </div>
        </div>

        {/* Verification Token Info */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            Consent Witness Hash: {witnessFictionalHash}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-slate-400">
            Encrypted Local Audit Ledger
          </span>
        </div>
      </AyuCard>

      {/* 4 Permission Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Granular Permission Controls</span>
          </h3>
          <span className="text-xs text-slate-500">
            {isRequiredConsentGranted ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Required Consents Active
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Voice Interview & Documents Required
              </span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERMISSIONS_CONFIG.map((item) => {
            const currentState = permissions[item.key]
            const isGranted = currentState === 'Granted'
            const isRevoked = currentState === 'Revoked'
            const isNotGranted = currentState === 'Not Granted'

            return (
              <AyuCard
                key={item.key}
                variant={isGranted ? 'highlight' : 'default'}
                padding="lg"
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-11 h-11 rounded-xl flex items-center justify-center transition-colors',
                          isGranted
                            ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                            : isRevoked
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        )}
                      >
                        {getPermissionIcon(item.iconName)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                            {item.title}
                          </h4>
                          {item.isRequired && (
                            <AyuBadge variant="amber" size="sm">
                              Required
                            </AyuBadge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">{renderStatusBadge(currentState)}</div>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {item.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  {isRevoked && (
                    <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                      <span>{item.clinicalImpactNotice}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">
                    Status: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{currentState}</strong>
                  </span>

                  <div className="flex items-center gap-2 flex-wrap">
                    {!isGranted && (
                      <AyuButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleGrant(item.key)}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Grant
                      </AyuButton>
                    )}

                    {!isRevoked && (
                      <AyuButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePromptWithdraw(item.key)}
                        className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        Withdraw
                      </AyuButton>
                    )}

                    {!isNotGranted && (
                      <AyuButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReset(item.key)}
                      >
                        Reset
                      </AyuButton>
                    )}
                  </div>
                </div>
              </AyuCard>
            )
          })}
        </div>
      </div>

      {/* Consent History Timeline */}
      <AyuCard variant="default" padding="lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Consent History Audit Log
            </h3>
            <AyuBadge variant="indigo" size="sm">
              {history.length} Events
            </AyuBadge>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {(['All', 'Granted', 'Revoked', 'Reset'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setHistoryFilter(filter)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                    historyFilter === filter
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <span>{isHistoryExpanded ? 'Collapse' : 'Expand'}</span>
              {isHistoryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isHistoryExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4 overflow-hidden"
            >
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Chronological immutable audit log of patient consent agreements, revocations, and status resets.
              </p>

              <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 sm:ml-4 space-y-5 py-2">
                {filteredHistory.map((entry) => {
                  const isGrant = entry.action === 'Granted'
                  const isRevoke = entry.action === 'Revoked'

                  return (
                    <div key={entry.id} className="relative pl-6 sm:pl-8 group">
                      <div
                        className={cn(
                          'absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 transition-transform group-hover:scale-125',
                          isGrant
                            ? 'bg-emerald-500'
                            : isRevoke
                            ? 'bg-rose-500'
                            : 'bg-slate-400'
                        )}
                      />

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {entry.date}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              {entry.permissionTitle} —{' '}
                              <strong
                                className={cn(
                                  isGrant
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : isRevoke
                                    ? 'text-rose-600 dark:text-rose-400'
                                    : 'text-slate-500'
                                )}
                              >
                                {entry.action}
                              </strong>
                            </span>
                          </div>

                          <span className="text-[11px] font-mono text-slate-400">
                            Token: {entry.hash}
                          </span>
                        </div>

                        {entry.notes && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AyuCard>

      {/* Confirmation Modal for Consent Withdrawal */}
      <Modal
        isOpen={Boolean(withdrawingKey)}
        onClose={() => setWithdrawingKey(null)}
        title="Confirm Consent Withdrawal"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-rose-950 dark:text-rose-200 block">
                {withdrawingKey === 'ALL'
                  ? 'Withdrawing All 4 Permissions'
                  : `Withdrawing ${getPermissionTitle(withdrawingKey as ConsentPermissionKey)}`}
              </span>
              <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                {withdrawingKey === 'ALL'
                  ? 'All automated processing, voice interview transcription, document OCR extraction, and physician sharing will pause immediately.'
                  : PERMISSIONS_CONFIG.find((p) => p.key === withdrawingKey)?.clinicalImpactNotice}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            In compliance with patient data autonomy rights, withdrawal takes effect immediately and an audit token is logged to your local consent history.
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <AyuButton
              variant="secondary"
              size="sm"
              onClick={() => setWithdrawingKey(null)}
            >
              Cancel (Keep Consent)
            </AyuButton>
            <AyuButton
              variant="destructive"
              size="sm"
              onClick={handleConfirmWithdraw}
            >
              Confirm Withdrawal
            </AyuButton>
          </div>
        </div>
      </Modal>

      {/* Fallback Text Modal for Rights Explanation */}
      <Modal
        isOpen={showExplanationModal}
        onClose={() => setShowExplanationModal(false)}
        title="Patient Consent Rights & Explanation"
        size="lg"
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {activeExplanation}
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              The 4 Granular Rights:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {PERMISSIONS_CONFIG.map((item) => (
                <div key={item.key} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">{item.title}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.subtitle}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <AyuButton
              variant="primary"
              size="sm"
              onClick={() => setShowExplanationModal(false)}
            >
              I Understand My Rights
            </AyuButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
