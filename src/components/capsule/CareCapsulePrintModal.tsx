import React from 'react'
import {
  Printer,
  X,
  Copy,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Lock,
} from 'lucide-react'
import { Modal } from '../ui/Modal'
import { AnimatedButton } from '../ui/AnimatedButton'
import type { CareCapsuleData } from '../../types/careCapsule'
import { useNotifications } from '../../contexts/NotificationContext'

interface CareCapsulePrintModalProps {
  isOpen: boolean
  onClose: () => void
  capsule: CareCapsuleData
}

export const CareCapsulePrintModal: React.FC<CareCapsulePrintModalProps> = ({
  isOpen,
  onClose,
  capsule,
}) => {
  const { notifySuccess } = useNotifications()

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = () => {
    const text = `=== AYUCASE CARE CAPSULE ===
Status: ${capsule.demoBadge}
Privacy Indicator: ${capsule.privacyIndicator}
${capsule.interoperabilityDisclaimer}

[PATIENT PROFILE]
Name: ${capsule.patientProfile.name}
ID: ${capsule.patientProfile.fictionalId}
Age/Gender: ${capsule.patientProfile.age}y / ${capsule.patientProfile.gender}
Blood Group: ${capsule.patientProfile.bloodGroup}
Primary Condition: ${capsule.patientProfile.primaryCondition}
Attending Physician: ${capsule.patientProfile.attendingPhysician}

[CONSENT STATUS]
- Voice Interview: ${capsule.consentStatus.permissions.voiceInterview}
- Medical Documents: ${capsule.consentStatus.permissions.medicalDocuments}
- Health History: ${capsule.consentStatus.permissions.healthHistory}
- Case Sharing: ${capsule.consentStatus.permissions.caseSharing}
Witness Hash: ${capsule.consentStatus.witnessHash}

[TIMELINE HIGHLIGHTS]
${capsule.timeline.map((t) => `• ${t.year} (${t.date}): ${t.title} - ${t.description}`).join('\n')}

[PATIENT STATEMENTS]
${capsule.patientStatements.map((s) => `• "${s.quote}" [${s.context}]`).join('\n')}

[DOCUMENTS]
${capsule.documents.map((d) => `• ${d.title} (${d.category}, ${d.pages} pages, ${d.status})`).join('\n')}

[MISSING INFORMATION]
${capsule.missingInformation.map((m) => `• ${m.parameter} (${m.status}): ${m.impact}`).join('\n')}

[PHYSICIAN REVIEW STATUS]
Attending: ${capsule.physicianReview.attendingPhysician} (${capsule.physicianReview.specialty})
Status: ${capsule.physicianReview.reviewStatus}
Signature Hash: ${capsule.physicianReview.electronicSignatureHash}
Impression: ${capsule.physicianReview.clinicalImpressionSummary}
==================================================`

    navigator.clipboard.writeText(text)
    notifySuccess('Demo Summary Copied', 'Formatted Care Capsule summary copied to clipboard.')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Print-Style Medical Summary Preview"
      size="xl"
    >
      <div className="space-y-4">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Formatted for 8.5" x 11" Clean Clinical Print
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Summary</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Paper Document Sheet */}
        <div
          id="care-capsule-print-sheet"
          className="p-8 sm:p-10 rounded-2xl bg-white text-slate-900 border-2 border-slate-300 shadow-xl space-y-6 font-sans text-xs print:p-0 print:border-none print:shadow-none"
        >
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-950 uppercase">
                  AYUCASE CARE CAPSULE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  {capsule.demoBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Consolidated Patient Health Record & Privacy Control Dossier
              </p>
            </div>

            <div className="text-right sm:text-right font-mono text-[10px] text-slate-500 space-y-0.5">
              <div>CAPSULE ID: <strong>{capsule.capsuleId}</strong></div>
              <div>DATE: {new Date(capsule.generatedAt).toLocaleDateString('en-GB')}</div>
              <div>PROOF: {capsule.consentStatus.witnessHash}</div>
            </div>
          </div>

          {/* Mandatory Privacy & Interoperability Disclaimers */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PRIVACY & PROTOTYPE NOTICE</span>
            </div>
            <p className="font-semibold text-emerald-900">
              "{capsule.privacyIndicator}"
            </p>
            <p className="text-slate-500">
              {capsule.interoperabilityDisclaimer}
            </p>
          </div>

          {/* Section 1: Patient Profile */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              1. Patient Demographics & Profile
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">Patient Name</span>
                <span className="font-bold text-slate-900">{capsule.patientProfile.name}</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">Fictional ID / Age / Sex</span>
                <span className="font-bold text-slate-900">
                  {capsule.patientProfile.fictionalId} • {capsule.patientProfile.age}y • {capsule.patientProfile.gender}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">Blood Group</span>
                <span className="font-bold text-slate-900">{capsule.patientProfile.bloodGroup}</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">Attending Clinician</span>
                <span className="font-bold text-slate-900">{capsule.patientProfile.attendingPhysician}</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] space-y-1">
              <div>
                <strong>Primary Clinical Concern:</strong> {capsule.patientProfile.primaryCondition}
              </div>
              <div>
                <strong>Active Pharmacological Regimen:</strong>{' '}
                {capsule.patientProfile.currentMedications.join(' • ')}
              </div>
              <div>
                <strong>Documented Hypersensitivities:</strong>{' '}
                {capsule.patientProfile.allergies.join(', ')}
              </div>
            </div>
          </div>

          {/* Section 2: Consent Status Matrix */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              2. Granular Consent Status Matrix
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
              {(
                [
                  { key: 'voiceInterview', label: 'Voice Interview' },
                  { key: 'medicalDocuments', label: 'Medical Documents' },
                  { key: 'healthHistory', label: 'Health History' },
                  { key: 'caseSharing', label: 'Case Sharing' },
                ] as const
              ).map(({ key, label }) => {
                const state = capsule.consentStatus.permissions[key]
                const isGranted = state === 'Granted'
                const isRevoked = state === 'Revoked'

                return (
                  <div
                    key={key}
                    className={`p-2.5 rounded border ${
                      isGranted
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : isRevoked
                        ? 'bg-rose-50 border-rose-300 text-rose-900'
                        : 'bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="font-bold block text-[11px]">{label}</span>
                    <span className="font-black text-[10px] mt-1 inline-block uppercase">
                      {state}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section 3: Timeline Highlights */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              3. Chronological Trajectory Highlights
            </h3>
            <div className="space-y-1.5 text-[11px]">
              {capsule.timeline.map((item) => (
                <div key={item.id} className="p-2 rounded bg-slate-50 border border-slate-200 flex items-start gap-2">
                  <span className="font-black font-mono text-cyan-800 shrink-0 w-12">{item.year}</span>
                  <div>
                    <span className="font-bold text-slate-900">{item.title}</span>
                    <span className="text-slate-500 text-[10px] ml-2">({item.date})</span>
                    <p className="text-slate-600 text-[10px] mt-0.5 leading-snug">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Patient Statements */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              4. Verbatim Patient Statements (Voice Intake Extracts)
            </h3>
            <div className="space-y-1.5 text-[11px]">
              {capsule.patientStatements.map((stmt) => (
                <div key={stmt.id} className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">{stmt.context}</span>
                  <p className="font-medium italic text-slate-900 mt-0.5">"{stmt.quote}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Documents */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              5. Ingested & Verified Clinical Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
              {capsule.documents.map((doc) => (
                <div key={doc.id} className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block truncate max-w-[200px]">{doc.title}</span>
                    <span className="text-slate-500 text-[9px]">{doc.category} • {doc.pages} pages • {doc.date}</span>
                  </div>
                  <span className="font-mono text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded text-[9px]">
                    {doc.status} ({doc.extractionScore}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Missing Information */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              6. Known Gaps & Missing Information (Unknown Zone)
            </h3>
            <div className="space-y-1 text-[10px]">
              {capsule.missingInformation.map((item) => (
                <div key={item.id} className="p-1.5 rounded bg-amber-50/60 border border-amber-200 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900">{item.parameter}</span>
                    <p className="text-slate-600 text-[9px] leading-tight">{item.impact}</p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 shrink-0">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Physician Review Status & Digital Signature */}
          <div className="pt-2 border-t-2 border-slate-900 space-y-2 text-[11px]">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              7. Attending Physician Review & Electronic Sign-off
            </h3>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-300 space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <strong>Clinician:</strong> {capsule.physicianReview.attendingPhysician} ({capsule.physicianReview.specialty})
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 self-start sm:self-auto">
                  Status: {capsule.physicianReview.reviewStatus}
                </span>
              </div>
              <p className="text-slate-700 text-[10px] leading-relaxed italic">
                "{capsule.physicianReview.clinicalImpressionSummary}"
              </p>
              <div className="pt-1 text-[9px] font-mono text-slate-500 flex justify-between">
                <span>Electronic Signature Token: {capsule.physicianReview.electronicSignatureHash}</span>
                <span>Verified: {capsule.physicianReview.lastReviewedDate}</span>
              </div>
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className="border-t border-slate-200 pt-3 text-center text-[9px] text-slate-400 font-mono">
            Generated by AyuCase Clinical Intelligence Platform • Fictional Demo Instance • Not for Diagnostic Use
          </div>
        </div>
      </div>
    </Modal>
  )
}
