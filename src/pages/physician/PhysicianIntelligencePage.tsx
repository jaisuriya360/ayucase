import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Brain,
  Cpu,
  Activity,
  CheckCircle2,
  RefreshCw,
  Dna,
  ShieldAlert,
  HelpCircle,
  FileText,
  Clock,
  Quote,
  ShieldCheck,
  Info,
  Layers,
  ArrowRight,
  ExternalLink,
  Stethoscope,
  Radio,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { CaseConstellationGraph } from '../../components/intelligence/CaseConstellationGraph'
import { CaseDNAFingerprint } from '../../components/intelligence/CaseDNAFingerprint'
import { CaseGapDetector } from '../../components/intelligence/CaseGapDetector'
import { PatientVoiceCard } from '../../components/intelligence/PatientVoiceCard'
import { usePhysician } from '../../contexts/PhysicianContext'
import { useNotifications } from '../../contexts/NotificationContext'

export const PhysicianIntelligencePage: React.FC = () => {
  const { selectedCase, physician } = usePhysician()
  const { notifySuccess, notifyInfo } = useNotifications()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'constellation' | 'dna' | 'gaps' | 'voice' | 'unknown'>(
    'constellation'
  )

  return (
    <div className="space-y-7 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title="Case Intelligence & Clinical Synthesis"
        subtitle="Holistic case graph, biometric case DNA, and patient voice preservation for clinical decision support."
        breadcrumbs={[
          { label: 'Workstation', href: '/physician/dashboard' },
          { label: 'Intelligence' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <AnimatedButton
              to="/patient/story"
              variant="secondary"
              size="md"
              leftIcon={<FileText className="w-4 h-4" />}
            >
              View Patient Story
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              size="md"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={() => {
                notifySuccess(
                  'Case Synthesis Refreshed',
                  'Synthesized 12 patient statements, 3 clinical documents, and 6 timeline eras.'
                )
              }}
            >
              Re-Synthesize Case
            </AnimatedButton>
          </div>
        }
      />

      {/* Mandatory Non-Diagnostic Clinical Safety Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            Physician Clinical Decision Support Notice • Non-Diagnostic Protocol:
          </p>
          <p className="leading-relaxed">
            AyuCase aggregates, aligns, and structures subjective patient narratives and validated
            clinical documents into relational intelligence. <strong>AyuCase does not provide automated diagnoses, clinical prescriptions, or treatment recommendations</strong>. Diagnostic determination and care planning are reserved exclusively to licensed attending physicians.
          </p>
        </div>
      </div>

      {/* Active Case Patient Banner */}
      <GlassCard variant="elevated" className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-md">
            AC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100">
                Aarav Chen
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                PT-DEMO-9042
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Active Case
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              38 Yrs • Male • Primary Indication: Recurrent Neurovascular Migraine with Aura & Dysautonomia
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Attending Physician
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Dr. Priya Sharma, MD
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'constellation', label: '5. Case Constellation Graph', icon: Sparkles },
          { id: 'dna', label: '4. Visual Case Profile (DNA)', icon: Dna },
          { id: 'gaps', label: '2. Case Gap Detector', icon: ShieldAlert },
          { id: 'voice', label: '7. Patient Voice Preservation', icon: Quote },
          { id: 'unknown', label: '3. Unknown Zone Audit', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: CASE CONSTELLATION GRAPH */}
      {activeTab === 'constellation' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <CaseConstellationGraph />
        </motion.div>
      )}

      {/* TAB 2: VISUAL CASE PROFILE (CASE DNA) */}
      {activeTab === 'dna' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <CaseDNAFingerprint />
        </motion.div>
      )}

      {/* TAB 3: CASE GAP DETECTOR */}
      {activeTab === 'gaps' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <CaseGapDetector />
        </motion.div>
      )}

      {/* TAB 4: PATIENT VOICE PRESERVATION */}
      {activeTab === 'voice' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Quote className="w-4 h-4 text-emerald-500" />
                <span>Patient Voice Preservation & Traceability Matrix</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Side-by-side presentation of structured clinical parameters against untouched patient verbatim statements.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 italic">
              "The patient's own words are never lost."
            </span>
          </div>

          <div className="space-y-4">
            <PatientVoiceCard
              title="Aura Sensation & Acute Episode Intensity"
              category="Chief Complaint"
              structuredItems={[
                { label: 'Phenotype', value: 'Throbbing left fronto-orbital hemicrania', chip: 'Severe' },
                { label: 'Aura Duration', value: '15–20 minutes before onset', chip: 'Scintillating' },
                { label: 'Peak Pain Duration', value: '14 hours continuous', chip: 'Unremitting' },
                { label: 'Sensory Sensitivity', value: 'Photophobia & Phonophobia', chip: 'Marked' },
              ]}
              patientStatement="It felt like a flashbulb exploding behind my left eye, lasting 14 hours straight. I could barely open the blinds without excruciating throbbing."
              sourceInfo={{
                source: 'Voice Interview',
                question: 'Q1: What brings you here today?',
                date: '23 Sep 2026',
              }}
            />

            <PatientVoiceCard
              title="Medication Response & Adverse Trial Reaction"
              category="Pharmacotherapy"
              structuredItems={[
                { label: 'Current Prophylaxis', value: 'Propranolol 40mg BID', chip: 'Effective' },
                { label: 'Acute Abortive', value: 'Rizatriptan 10mg PRN', chip: 'Good Tolerance' },
                { label: 'Discontinued Agent', value: 'Sumatriptan 50mg (Chest flushing & tight throat)', chip: 'Adverse' },
              ]}
              patientStatement="Sumatriptan made my chest feel uncomfortably tight and flushed my face crimson. Dr. Kumar switched me to Rizatriptan which works much better without that tightness."
              sourceInfo={{
                source: 'Medical Document & Interview',
                document: 'Prescription Schedule & Outpatient Notes',
                question: 'Q4: Are you currently taking any medicines?',
                date: '23 Sep 2026',
              }}
            />
          </div>
        </motion.div>
      )}

      {/* TAB 5: UNKNOWN ZONE AUDIT */}
      {activeTab === 'unknown' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <GlassCard variant="elevated" className="p-6 space-y-4 border-rose-500/30">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-rose-500" />
                  <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">
                    The Unknown Zone • Clinical Gap Inventory
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Parameters explicitly NOT provided by the patient. Never assumed or hallucinated.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold">
                3 Explicit Gaps
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: '48-Hour Ambulatory Blood Pressure Telemetry Log',
                  status: 'NOT PROVIDED',
                  detail:
                    'Recommended during 2025 autonomic assessment to evaluate orthostatic fluctuations. Raw continuous telemetry document not uploaded.',
                  clinicalRelevance:
                    'Assess for nocturnal non-dipping or baroreflex sensitivity deficit.',
                },
                {
                  title: 'Overnight Polysomnography (Sleep Architecture PSG)',
                  status: 'NOT PROVIDED',
                  detail:
                    'Patient self-reports frequent nocturnal awakenings coincident with migraine onset, but objective PSG has not been conducted.',
                  clinicalRelevance:
                    'Evaluate for REM-related cluster variant or nocturnal hypoxemia.',
                },
                {
                  title: 'Paternal Cardiovascular and Cerebrovascular History',
                  status: 'NOT PROVIDED',
                  detail:
                    'Maternal migraine history verified positive. Paternal stroke, aneurysm, and hypertensive history remain unprovided.',
                  clinicalRelevance:
                    'Evaluate familial CAD and hereditary arteriopathy risks.',
                },
              ].map((gap, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-rose-500/25 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>{gap.title}</span>
                    </h4>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25">
                      {gap.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {gap.detail}
                  </p>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Physician Clarification Target:
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {gap.clinicalRelevance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Contradiction Radar Quick Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-sm text-slate-900 dark:text-slate-100">
                Contradiction Radar: 3 Discrepancies Detected
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
                Needs Human Review
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Identified divergence between patient verbal account ("I have not taken medication") and Prescription.pdf.
            </p>
          </div>
        </div>

        <AnimatedButton
          to="/physician/contradictions"
          variant="secondary"
          size="sm"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Launch Radar
        </AnimatedButton>
      </div>

      {/* Cross-Link to Health Story */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-sm text-slate-900 dark:text-slate-100">
              Inspect Patient-Facing Narrative Story
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review all 10 longitudinal chapters and verified document links as presented to Aarav Chen.
            </p>
          </div>
        </div>

        <AnimatedButton
          to="/patient/story"
          variant="primary"
          size="sm"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Open Patient Story
        </AnimatedButton>
      </div>
    </div>
  )
}
