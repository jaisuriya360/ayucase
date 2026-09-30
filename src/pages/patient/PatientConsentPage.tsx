import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
  Printer,
  Copy,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
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
      'Permits AyuCase to record and transcribe your voice check-in answers, extracting symptom severity, vocal markers, and timeline descriptors for clinical review.',
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
      'Allows your assigned physician Dr. Elena Vance and multi-disciplinary clinical specialists to review your synthesized case file and telemetry alerts.',
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
    'Welcome to the AyuCase Consent Control Center. You have complete autonomy over your health narrative. Four granular permissions protect your rights: Voice Interview, Medical Documents, Health History, and Case Sharing. You may grant, revoke, or reset consent at any time. Your information is shown in this prototype using fictional data. All records are stored with fictional verification tokens in your browser.'

  const explanationTextTa =
    'ஆயுகேஸ் ஒப்புதல் கட்டுப்பாட்டு மையத்திற்கு நல்வரவு. உங்கள் மருத்துவத் தகவல்களை யார் பார்க்க வேண்டும் என்பதை நீங்களே முழுமையாகத் தீர்மானிக்கலாம். குரல் நேர்காணல், மருத்துவ ஆவணங்கள், உடல்நல வரலாறு மற்றும் வழக்கு பகிர்வு ஆகிய நான்கு அனுமதிகளை நீங்கள் எப்போது வேண்டுமானாலும் வழங்கலாம் அல்லது திரும்பப் பெறலாம். உங்கள் தனியுரிமை எப்போதும் பாதுகாக்கப்படுகிறது.'

  const activeExplanation = language === 'ta' ? explanationTextTa : explanationTextEn

  // "Listen to Consent Explanation" handler with SpeechSynthesis and browser fallback
  const handleListenExplanation = () => {
    if ('speechSynthesis' in window) {
      try {
        if (isSpeaking) {
          window.speechSynthesis.cancel()
          setIsSpeaking(false)
          notifyInfo('Audio Stopped', 'Consent explanation paused.')
          return
        }

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(activeExplanation)
        utterance.rate = isElderMode ? 0.85 : 0.95
        utterance.pitch = 1.0
        if (language === 'ta') {
          utterance.lang = 'ta-IN'
        } else {
          utterance.lang = 'en-US'
        }

        utterance.onstart = () => {
          setIsSpeaking(true)
          notifyInfo('Playing Audio', 'Listening to Consent Explanation.')
        }

        utterance.onend = () => {
          setIsSpeaking(false)
        }

        utterance.onerror = () => {
          setIsSpeaking(false)
          setShowExplanationModal(true)
        }

        window.speechSynthesis.speak(utterance)
        return
      } catch (err) {
        console.warn('SpeechSynthesis error, opening fallback modal', err)
      }
    }

    setShowExplanationModal(true)
  }

  // Grant Handler
  const handleGrant = (key: ConsentPermissionKey) => {
    grantPermission(key)
    notifySuccess('Consent Granted', `${getPermissionTitle(key)} permission is now Granted.`)
  }

  // Reset Handler
  const handleReset = (key: ConsentPermissionKey) => {
    resetPermission(key, 'Reset to Not Granted by patient.')
    notifyInfo('Consent Reset', `${getPermissionTitle(key)} permission is now Not Granted.`)
  }

  // Withdraw Trigger (Opens Confirmation Modal)
  const handlePromptWithdraw = (key: ConsentPermissionKey | 'ALL') => {
    setWithdrawingKey(key)
  }

  // Confirm Withdrawal
  const handleConfirmWithdraw = () => {
    if (withdrawingKey === 'ALL') {
      withdrawAll('Patient initiated bulk withdrawal.')
      notifyWarning('All Consents Withdrawn', 'All 4 data permissions have been revoked.')
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

  const getStatusBadge = (state: PermissionState) => {
    switch (state) {
      case 'Granted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('consent.granted', 'Granted')}
          </span>
        )
      case 'Revoked':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            {t('consent.revoked', 'Revoked')}
          </span>
        )
      case 'Not Granted':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5" />
            {t('consent.notGranted', 'Not Granted')}
          </span>
        )
    }
  }

  // Count active granted
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
        title={t('consent.title', 'Consent Control Center')}
        subtitle={t('consent.subtitle', 'Manage your personal illness narrative permissions, clinical document access, and case sharing with full autonomy.')}
        breadcrumbs={[
          { label: t('nav.dashboard', 'Dashboard'), href: '/patient/dashboard' },
          { label: t('consent.title', 'Consent Control Center') },
        ]}
        badge={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              Demo / Prototype Data
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
              {patient.fictionalId}
            </span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Listen to Consent Explanation Button */}
            <AnimatedButton
              variant={isSpeaking ? 'danger' : isElderMode ? 'elder' : 'secondary'}
              size={isElderMode ? 'elder' : 'md'}
              onClick={handleListenExplanation}
              leftIcon={
                isSpeaking ? (
                  <VolumeX className="w-4 h-4 animate-pulse" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                )
              }
            >
              {isSpeaking
                ? 'Stop Audio Explanation'
                : language === 'ta'
                ? 'ஒப்புதல் விளக்கத்தைக் கேட்க'
                : 'Listen to Explanation'}
            </AnimatedButton>

            {/* Continue to Patient Dashboard */}
            <AnimatedButton
              variant="primary"
              size={isElderMode ? 'elder' : 'md'}
              disabled={!isRequiredConsentGranted}
              onClick={() => {
                notifySuccess('Continuing to Dashboard', 'All required permissions are verified.')
                navigate('/patient/dashboard')
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Patient Dashboard
            </AnimatedButton>
          </div>
        }
      />

      {/* Mandatory Privacy Indicator Banner */}
      <GlassCard variant="default" className="p-5 border-2 border-emerald-500/40 bg-emerald-500/5 space-y-2">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="font-black text-sm sm:text-base text-emerald-900 dark:text-emerald-300 block">
              "Your information is shown in this prototype using fictional data."
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Prototype Notice: AyuCase is an experimental clinical intelligence prototype. It does not claim interoperability with real medical systems (ABDM, ABHA, HL7 FHIR, or hospital EHR backends). All records, diagnostic findings, and demographic profiles shown are purely fictional demonstration data stored in local browser state.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* SECTION: CARE CAPSULE (Compact Representation) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-500" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Care Capsule Dossier
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Portable Synchronized Health Package
          </span>
        </div>
        <CareCapsuleCard variant="compact" />
      </div>

      {/* Overview & Autonomy Banner */}
      <GlassCard variant="elevated" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Granular Health Narrative Permissions
                </h2>
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    {grantedCount} Granted
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {notGrantedCount} Not Granted
                  </span>
                  {revokedCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                      {revokedCount} Revoked
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                AyuCase adheres to patient data dignity. Each permission operates independently. You can grant, revoke, or reset individual permissions at any time without impacting your access to emergency care.
              </p>
            </div>
          </div>

          {/* Quick Bulk Actions: Grant All, Withdraw All, Reset All */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-center flex-wrap">
            <AnimatedButton
              variant="glass"
              size="sm"
              onClick={grantAll}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400"
            >
              Grant All
            </AnimatedButton>
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={() => handlePromptWithdraw('ALL')}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              Withdraw All
            </AnimatedButton>
            <AnimatedButton
              variant="secondary"
              size="sm"
              onClick={() => {
                resetAll('Patient initiated bulk reset of permissions to Not Granted.')
                notifyInfo('All Permissions Reset', 'All 4 permissions have been set to Not Granted.')
              }}
              className="text-xs font-bold text-slate-600 dark:text-slate-400"
            >
              Reset All
            </AnimatedButton>
          </div>
        </div>

        {/* Fictional Verification Token info */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            Fictional Proof Hash: {witnessFictionalHash}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400">
            Local Browser Storage • No Real Medical System Interop
          </span>
        </div>
      </GlassCard>

      {/* 4 Permission Cards Grid: Voice Interview, Medical Documents, Health History, Case Sharing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Granular Permission Controls</span>
          </h3>
          <span className="text-xs text-slate-400">
            {isRequiredConsentGranted ? (
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Required Consents Active
              </span>
            ) : (
              <span className="text-amber-500 font-bold flex items-center gap-1">
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
              <GlassCard
                key={item.key}
                variant={isGranted ? 'accent' : 'default'}
                className={cn(
                  'p-6 flex flex-col justify-between transition-all duration-200',
                  isElderMode && 'p-7 border-2'
                )}
              >
                <div>
                  {/* Top: Icon + State Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-11 h-11 rounded-2xl flex items-center justify-center transition-colors',
                          isGranted
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : isRevoked
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
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
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                            {item.title}
                          </h4>
                          {item.isRequired && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">{getStatusBadge(currentState)}</div>
                  </div>

                  {/* Subtitle & Description */}
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Warning on Revocation */}
                  {isRevoked && (
                    <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-500/20 text-[11px] text-rose-700 dark:text-rose-300 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{item.clinicalImpactNotice}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons: Grant Consent / Withdraw Consent / Reset */}
                <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Status: <strong className="text-slate-700 dark:text-slate-200">{currentState}</strong>
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Grant Button */}
                    {!isGranted && (
                      <AnimatedButton
                        variant={isElderMode ? 'elder' : 'primary'}
                        size={isElderMode ? 'lg' : 'sm'}
                        onClick={() => handleGrant(item.key)}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Grant
                      </AnimatedButton>
                    )}

                    {/* Revoke / Withdraw Button */}
                    {!isRevoked && (
                      <AnimatedButton
                        variant="ghost"
                        size={isElderMode ? 'lg' : 'sm'}
                        onClick={() => handlePromptWithdraw(item.key)}
                        className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs"
                      >
                        Revoke
                      </AnimatedButton>
                    )}

                    {/* Reset Button */}
                    {!isNotGranted && (
                      <button
                        type="button"
                        onClick={() => handleReset(item.key)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold transition-colors cursor-pointer"
                        title="Reset to Not Granted"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>

      {/* Consent History Timeline Section */}
      <GlassCard variant="default" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Consent History
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-medium">
              {history.length} Events
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Chips */}
            <div className="flex items-center gap-1">
              {(['All', 'Granted', 'Revoked', 'Reset'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setHistoryFilter(filter)}
                  className={cn(
                    'px-2 py-0.5 rounded-lg text-xs font-bold transition-colors cursor-pointer',
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
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-2"
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
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chronological immutable audit log of patient consent agreements, revocations, and status resets.
              </p>

              {/* Vertical Timeline */}
              <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 sm:ml-4 space-y-6 py-2">
                {filteredHistory.map((entry) => {
                  const isGrant = entry.action === 'Granted'
                  const isRevoke = entry.action === 'Revoked'

                  return (
                    <div key={entry.id} className="relative pl-6 sm:pl-8 group">
                      {/* Timeline Dot */}
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

                      <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm">
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
                                    ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                                    : isRevoke
                                    ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                                    : 'text-slate-500 font-extrabold'
                                )}
                              >
                                {entry.action}
                              </strong>
                            </span>
                          </div>

                          <span className="text-[10px] font-mono text-slate-400">
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
      </GlassCard>

      {/* Confirmation Modal for Consent Withdrawal */}
      <Modal
        isOpen={Boolean(withdrawingKey)}
        onClose={() => setWithdrawingKey(null)}
        title="Confirm Consent Withdrawal"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">
                {withdrawingKey === 'ALL'
                  ? 'Revoking All 4 Permissions'
                  : `Revoking ${getPermissionTitle(withdrawingKey as ConsentPermissionKey)}`}
              </span>
              <p className="text-xs text-rose-800 dark:text-rose-300">
                {withdrawingKey === 'ALL'
                  ? 'All automated processing, voice interview transcription, document OCR extraction, and physician sharing will pause immediately.'
                  : PERMISSIONS_CONFIG.find((p) => p.key === withdrawingKey)?.clinicalImpactNotice}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            In compliance with patient data autonomy rights, withdrawal takes effect immediately and an audit token is logged to your local consent history.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <AnimatedButton
              variant="secondary"
              size="sm"
              onClick={() => setWithdrawingKey(null)}
            >
              Cancel (Keep Consent)
            </AnimatedButton>
            <AnimatedButton
              variant="danger"
              size="sm"
              onClick={handleConfirmWithdraw}
            >
              Confirm Revocation
            </AnimatedButton>
          </div>
        </div>
      </Modal>

      {/* Fallback Text Modal if Speech Synthesis is unsupported */}
      <Modal
        isOpen={showExplanationModal}
        onClose={() => setShowExplanationModal(false)}
        title="Patient Consent Rights & Explanation"
        size="lg"
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {activeExplanation}
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              The 4 Granular Rights:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {PERMISSIONS_CONFIG.map((item) => (
                <div key={item.key} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">{item.title}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.subtitle}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <AnimatedButton
              variant="primary"
              size="sm"
              onClick={() => setShowExplanationModal(false)}
            >
              I Understand My Rights
            </AnimatedButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
