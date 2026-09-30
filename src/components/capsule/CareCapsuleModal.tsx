import React, { useState } from 'react'
import {
  Package,
  Printer,
  Copy,
  User,
  Clock,
  MessageSquareText,
  FileText,
  ShieldCheck,
  HelpCircle,
  Stethoscope,
  Volume2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lock,
  Sparkles,
  Info,
} from 'lucide-react'
import { Modal } from '../ui/Modal'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import type { CareCapsuleData } from '../../types/careCapsule'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

interface CareCapsuleModalProps {
  isOpen: boolean
  onClose: () => void
  capsule: CareCapsuleData
  onOpenPrint: () => void
}

type CapsuleTab =
  | 'overview'
  | 'profile'
  | 'timeline'
  | 'statements'
  | 'documents'
  | 'consent'
  | 'missing'
  | 'physician'

export const CareCapsuleModal: React.FC<CareCapsuleModalProps> = ({
  isOpen,
  onClose,
  capsule,
  onOpenPrint,
}) => {
  const { speakText } = useAccessibility()
  const { notifySuccess } = useNotifications()
  const [activeTab, setActiveTab] = useState<CapsuleTab>('overview')

  if (!isOpen) return null

  const handleReadSummary = () => {
    const speech = `Care Capsule for ${capsule.patientProfile.name}. Fictional identifier ${capsule.patientProfile.fictionalId}. Primary condition: ${capsule.patientProfile.primaryCondition}. Attending physician: ${capsule.patientProfile.attendingPhysician}. Four consent permissions are configured with cryptographic witness hash. All data shown is purely fictional prototype demonstration data.`
    speakText(speech)
  }

  const handleCopySummary = () => {
    const text = `=== AYUCASE CARE CAPSULE ===
Status: ${capsule.demoBadge}
Privacy Indicator: ${capsule.privacyIndicator}
${capsule.interoperabilityDisclaimer}

[PATIENT PROFILE]
Name: ${capsule.patientProfile.name} (ID: ${capsule.patientProfile.fictionalId})
Age/Gender: ${capsule.patientProfile.age}y / ${capsule.patientProfile.gender}
Condition: ${capsule.patientProfile.primaryCondition}
Attending Physician: ${capsule.patientProfile.attendingPhysician}

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
${capsule.documents.map((d) => `• ${d.title} (${d.status}, ${d.extractionScore}% match)`).join('\n')}

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

  const tabs: Array<{
    id: CapsuleTab
    label: string
    icon: React.ComponentType<{ className?: string }>
    count?: number
  }> = [
    { id: 'overview', label: 'Capsule Overview', icon: Package },
    { id: 'profile', label: 'Patient Profile', icon: User },
    { id: 'timeline', label: 'Timeline', icon: Clock, count: capsule.timeline.length },
    { id: 'statements', label: 'Statements', icon: MessageSquareText, count: capsule.patientStatements.length },
    { id: 'documents', label: 'Documents', icon: FileText, count: capsule.documents.length },
    { id: 'consent', label: 'Consent Status', icon: ShieldCheck },
    { id: 'missing', label: 'Missing Info', icon: HelpCircle, count: capsule.missingInformation.length },
    { id: 'physician', label: 'Physician Review', icon: Stethoscope },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AyuCase Care Capsule — Complete Record Inspection"
      size="xl"
    >
      <div className="space-y-5 text-xs sm:text-sm">
        {/* Top Header Card with Privacy Indicator & Actions */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 border-2 border-emerald-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Package className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    Care Capsule: {capsule.patientProfile.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    {capsule.demoBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  ID: {capsule.patientProfile.fictionalId} • Generated: {new Date(capsule.generatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
              <button
                type="button"
                onClick={handleReadSummary}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Listen to Capsule Speech Summary"
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="hidden sm:inline">Read Aloud</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Demo Summary</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose()
                  onOpenPrint()
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print-style View</span>
              </button>
            </div>
          </div>

          {/* Mandatory Privacy Indicator Banner */}
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-extrabold text-emerald-800 dark:text-emerald-300 block">
                {capsule.privacyIndicator}
              </span>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                {capsule.interoperabilityDisclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 select-none',
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                      isActive
                        ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Quick 7-Item Grid Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div
                onClick={() => setActiveTab('profile')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors space-y-1"
              >
                <span className="text-[10px] font-bold uppercase text-slate-400 block">1. Profile</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                  {capsule.patientProfile.name}
                </span>
                <span className="text-[11px] text-slate-500">{capsule.patientProfile.age}y • {capsule.patientProfile.bloodGroup}</span>
              </div>

              <div
                onClick={() => setActiveTab('timeline')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors space-y-1"
              >
                <span className="text-[10px] font-bold uppercase text-slate-400 block">2. Timeline</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                  {capsule.timeline.length} Milestones
                </span>
                <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">2021 &rarr; 2026</span>
              </div>

              <div
                onClick={() => setActiveTab('statements')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors space-y-1"
              >
                <span className="text-[10px] font-bold uppercase text-slate-400 block">3. Statements</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                  {capsule.patientStatements.length} Audio Extracts
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Verbatim Quotes</span>
              </div>

              <div
                onClick={() => setActiveTab('documents')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors space-y-1"
              >
                <span className="text-[10px] font-bold uppercase text-slate-400 block">4. Documents</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                  {capsule.documents.length} Records
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">100% Verified</span>
              </div>

              <div
                onClick={() => setActiveTab('consent')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors space-y-1"
              >
                <span className="text-[10px] font-bold uppercase text-slate-400 block">5. Consent</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                  {capsule.consentStatus.permissions.voiceInterview === 'Granted' ? 'Active ✓' : 'Partial'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{capsule.consentStatus.witnessHash}</span>
              </div>

              <div
                onClick={() => setActiveTab('missing')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors space-y-1"
              >
                <span className="text-[10px] font-bold uppercase text-amber-500 block">6. Unknown Zone</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                  {capsule.missingInformation.length} Missing Gaps
                </span>
                <span className="text-[11px] text-amber-600">Pending Telemetry</span>
              </div>

              <div
                onClick={() => setActiveTab('physician')}
                className="col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors space-y-1"
              >
                <span className="text-[10px] font-bold uppercase text-indigo-500 block">7. Review Status</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                  {capsule.physicianReview.reviewStatus}
                </span>
                <span className="text-[11px] text-slate-500 truncate block">
                  {capsule.physicianReview.attendingPhysician}
                </span>
              </div>
            </div>

            {/* Synthesis Card */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                Executive Care Capsule Synthesis
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                This Care Capsule serves as an encrypted, self-contained summary of patient {capsule.patientProfile.name}'s ongoing evaluation for {capsule.patientProfile.primaryCondition}. It aggregates granular patient consent state, multi-year chronological milestones, verbatim voice statements, verified radiology/pathology documents, and formal attending sign-off.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: PATIENT PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Full Name</span>
                <p className="font-bold text-slate-900 dark:text-slate-100">{capsule.patientProfile.name}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Fictional Demo Identifier</span>
                <p className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{capsule.patientProfile.fictionalId}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Age & Gender</span>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {capsule.patientProfile.age} years • {capsule.patientProfile.gender}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Blood Group</span>
                <p className="font-bold text-slate-900 dark:text-slate-100">{capsule.patientProfile.bloodGroup}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Primary Clinical Condition</span>
              <p className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{capsule.patientProfile.primaryCondition}</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <div><strong>Medications:</strong> {capsule.patientProfile.currentMedications.join(' • ')}</div>
                <div><strong>Allergies:</strong> {capsule.patientProfile.allergies.join(', ')}</div>
                <div><strong>Attending:</strong> {capsule.patientProfile.attendingPhysician}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-3 animate-fadeIn">
            {capsule.timeline.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3"
              >
                <div className="w-12 text-center shrink-0">
                  <span className="font-black text-cyan-600 dark:text-cyan-400 font-mono text-sm block">
                    {item.year}
                  </span>
                  <span className="text-[9px] text-slate-400">{item.date}</span>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-slate-900 dark:text-slate-100">{item.title}</h5>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: STATEMENTS */}
        {activeTab === 'statements' && (
          <div className="space-y-3 animate-fadeIn">
            {capsule.patientStatements.map((stmt) => (
              <div
                key={stmt.id}
                className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold text-cyan-700 dark:text-cyan-300 uppercase">{stmt.context}</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Verified {stmt.modality}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium italic text-slate-900 dark:text-slate-100">
                  "{stmt.quote}"
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
            {capsule.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                    {doc.title}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    {doc.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{doc.category} • {doc.pages} pages • {doc.date}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>Extraction Score</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{doc.extractionScore}% Match</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: CONSENT STATUS */}
        {activeTab === 'consent' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  { key: 'voiceInterview', label: 'Voice Interview', desc: 'Allows spoken symptom capture and speech synthesis.' },
                  { key: 'medicalDocuments', label: 'Medical Documents', desc: 'Authorizes mock OCR parsing and document structuring.' },
                  { key: 'healthHistory', label: 'Health History', desc: 'Enables longitudinal multi-year health trajectory models.' },
                  { key: 'caseSharing', label: 'Case Sharing', desc: 'Allows clinical team collaboration and case mirroring.' },
                ] as const
              ).map(({ key, label, desc }) => {
                const state = capsule.consentStatus.permissions[key]
                const isGranted = state === 'Granted'
                const isRevoked = state === 'Revoked'

                return (
                  <div
                    key={key}
                    className={cn(
                      'p-4 rounded-xl border space-y-1.5',
                      isGranted
                        ? 'bg-emerald-500/5 border-emerald-500/30'
                        : isRevoked
                        ? 'bg-rose-500/5 border-rose-500/30'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{label}</span>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                          isGranted
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : isRevoked
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        )}
                      >
                        {state}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{desc}</p>
                  </div>
                )
              })}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Cryptographic Witness Proof:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                {capsule.consentStatus.witnessHash}
              </span>
            </div>
          </div>
        )}

        {/* TAB 7: MISSING INFORMATION */}
        {activeTab === 'missing' && (
          <div className="space-y-3 animate-fadeIn">
            {capsule.missingInformation.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.parameter}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{item.impact}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 8: PHYSICIAN REVIEW */}
        {activeTab === 'physician' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {capsule.physicianReview.attendingPhysician}
                  </h4>
                  <p className="text-xs text-slate-400">{capsule.physicianReview.specialty}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {capsule.physicianReview.reviewStatus} ✓
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "{capsule.physicianReview.clinicalImpressionSummary}"
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>Signature Token: {capsule.physicianReview.electronicSignatureHash}</span>
                <span>Date: {capsule.physicianReview.lastReviewedDate}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Close Button */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono">
            AyuCase v2.0 • Care Capsule Engine
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Close Capsule
          </button>
        </div>
      </div>
    </Modal>
  )
}
