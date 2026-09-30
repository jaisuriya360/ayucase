import React, { useState } from 'react'
import {
  Activity,
  Sparkles,
  Clock,
  Droplet,
  HeartPulse,
  FileText,
  Edit3,
  CheckCircle2,
  Save,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Stethoscope,
  Info,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import type { ClinicalCase } from '../../types/clinicalCase'
import { cn } from '../../utils/cn'

interface CaseDetailCenterPanelProps {
  currentCase: ClinicalCase
  onEditSave: (notes: string, plan: string) => void
  onReview: () => void
  onConfirm: () => void
  onOpenSourceCitation?: (citationId: string) => void
}

export const CaseDetailCenterPanel: React.FC<CaseDetailCenterPanelProps> = ({
  currentCase,
  onEditSave,
  onReview,
  onConfirm,
  onOpenSourceCitation,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [notesInput, setNotesInput] = useState(currentCase.assessmentNotes)
  const [planInput, setPlanInput] = useState(currentCase.physicianPlan)

  const handleSave = () => {
    onEditSave(notesInput, planInput)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setNotesInput(currentCase.assessmentNotes)
    setPlanInput(currentCase.physicianPlan)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Action Bar with Edit, Review, Confirm buttons */}
      <GlassCard
        variant="elevated"
        className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-2 border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 sticky top-20 z-20 shadow-md backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
              Clinical Assessment & Synthesis
            </h3>
            <span className="text-[11px] text-slate-400">
              Case Status: <strong className="text-cyan-600 dark:text-cyan-400">{currentCase.status}</strong>
            </span>
          </div>
        </div>

        {/* Buttons: Edit, Review, Confirm */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Assessment</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCancel}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onReview}
            className="px-3.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-600 dark:text-indigo-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Review AI Synthesis</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={currentCase.isConfirmed}
            className={cn(
              'px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer',
              currentCase.isConfirmed
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
            )}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{currentCase.isConfirmed ? 'Confirmed ✓' : 'Confirm Case'}</span>
          </button>
        </div>
      </GlassCard>

      {/* Confirmation Banner if signed */}
      {currentCase.isConfirmed && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <span className="font-extrabold text-emerald-800 dark:text-emerald-300 block">
              Clinical Case Signed & Confirmed
            </span>
            <p className="text-emerald-700 dark:text-emerald-400">
              Verified by <strong>{currentCase.confirmedBy || currentCase.assignedPhysician}</strong> on{' '}
              {new Date(currentCase.confirmedAt || currentCase.lastUpdated).toLocaleString()}. Digital signature hash:{' '}
              <code className="font-mono bg-emerald-500/20 px-1 py-0.5 rounded text-[11px]">
                {currentCase.digitalSignatureHash || '0x7b4a2e8810c9'}
              </code>
            </p>
          </div>
        </div>
      )}

      {/* SECTION 1: Chief Complaint & Onset Timeline */}
      <section id="section-complaint" className="scroll-mt-36">
        <GlassCard variant="default" className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Activity className="w-4 h-4 text-cyan-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              1. Chief Complaint & History of Present Illness (HPI)
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                Verbatim Patient Statement
              </span>
              <button
                type="button"
                onClick={() => onOpenSourceCitation?.('cit-5')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>ⓘ Source: Intake Interview</span>
              </button>
            </div>
            <p className="text-sm italic font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              "{currentCase.chiefComplaint}"
            </p>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
              Symptom Trajectory & Phased Onset
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentCase.hpiStages.map((stage, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {stage.phase}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      {stage.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* SECTION 2: Medical & Surgical History */}
      <section id="section-history" className="scroll-mt-36">
        <GlassCard variant="default" className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              2. Past Medical & Surgical History
            </h3>
          </div>

          <div className="space-y-2">
            {currentCase.pastMedicalHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-xs"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* SECTION 3: Medications & Allergies */}
      <section id="section-meds" className="scroll-mt-36">
        <GlassCard variant="default" className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Droplet className="w-4 h-4 text-rose-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              3. Current Medications & Known Allergies
            </h3>
          </div>

          {/* Allergies Alert */}
          <div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block mb-1.5">
              Documented Hypersensitivities & Adverse Reactions
            </span>
            <div className="flex flex-wrap gap-2">
              {currentCase.allergies.map((allergy, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  {allergy}
                </span>
              ))}
            </div>
          </div>

          {/* Medications Table */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
              Verified Pharmacological Regimen
            </span>
            <div className="space-y-2">
              {currentCase.currentMedications.map((med, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 dark:text-slate-100">
                        {med.name}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {med.dosage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Schedule: {med.schedule}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                        med.verified
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      )}
                    >
                      {med.verified ? 'Verified Rx' : 'Self-Report'}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenSourceCitation?.(
                          med.name.toLowerCase().includes('metformin')
                            ? 'cit-1'
                            : med.name.toLowerCase().includes('lisinopril')
                            ? 'cit-2'
                            : 'cit-1'
                        )
                      }
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 cursor-pointer transition-colors"
                      title="Inspect source document"
                    >
                      <Info className="w-3 h-3" />
                      <span>ⓘ Source</span>
                    </button>
                    <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                      {med.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* SECTION 4: Family & Lifestyle Profile */}
      <section id="section-lifestyle" className="scroll-mt-36">
        <GlassCard variant="default" className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <HeartPulse className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              4. Family History & Lifestyle Telemetry
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Multigenerational Pedigree Pattern
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {currentCase.familyHistorySummary}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                Wearable & Environmental Telemetry
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {currentCase.lifestyleTelemetry}
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* SECTION 5: Physician Assessment & Plan */}
      <section id="section-assessment" className="scroll-mt-36">
        <GlassCard variant="elevated" className="p-6 space-y-5 border-2 border-cyan-500/30">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-cyan-500" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                5. Physician Clinical Assessment & Care Plan
              </h3>
            </div>
            {isEditing && (
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Editing In-Progress
              </span>
            )}
          </div>

          {/* Assessment Notes */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Practitioner Impression & Synthesis
            </span>
            {isEditing ? (
              <textarea
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-sans leading-relaxed"
                placeholder="Enter clinical impression and diagnostic rationale..."
              />
            ) : (
              <p className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {currentCase.assessmentNotes}
              </p>
            )}
          </div>

          {/* Physician Plan */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
              Treatment Protocol & Follow-Up Recommendations
            </span>
            {isEditing ? (
              <textarea
                value={planInput}
                onChange={(e) => setPlanInput(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-xs leading-relaxed"
                placeholder="Enter numbered treatment plan steps..."
              />
            ) : (
              <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                {currentCase.physicianPlan}
              </pre>
            )}
          </div>
          {/* Non-Diagnostic Safety Protocol Notice */}
          <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 dark:text-slate-200 block text-[11px]">
                Non-Diagnostic AI Synthesis Protocol Notice
              </span>
              <p className="text-[11px] leading-relaxed">
                AYUCASE organizes, structures, and links patient-reported narratives and archival medical records. AYUCASE strictly does not generate automated diagnoses or prescribe treatment recommendations. All diagnostic synthesis, clinical interpretations, and treatment plans remain solely within the professional judgment of the licensed attending physician.
              </p>
            </div>
          </div>

          {/* Footer Save actions when editing */}
          {isEditing && (
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Save Assessment</span>
              </button>
            </div>
          )}
        </GlassCard>
      </section>
    </div>
  )
}
