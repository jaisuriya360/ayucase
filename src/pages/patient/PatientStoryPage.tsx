import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Quote,
  Sparkles,
  Volume2,
  User,
  Activity,
  Calendar,
  FileText,
  Clock,
  Users,
  Pill,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Dna,
  ExternalLink,
  ChevronRight,
  Share2,
  Printer,
  Info,
  ShieldAlert,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { PatientVoiceCard } from '../../components/intelligence/PatientVoiceCard'
import { CaseDNAFingerprint } from '../../components/intelligence/CaseDNAFingerprint'
import { CaseGapDetector } from '../../components/intelligence/CaseGapDetector'
import { FamilyHealthTreeGraph } from '../../components/family/FamilyHealthTreeGraph'
import { usePatient } from '../../contexts/PatientContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

export const PatientStoryPage: React.FC = () => {
  const { patient } = usePatient()
  const { speakText } = useAccessibility()
  const { t } = useLanguage()
  const { notifySuccess, notifyInfo } = useNotifications()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<string>('all')

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <PageHeader
        title={t('story.title', 'My Health Story & Case Narrative')}
        subtitle="A human-centered health chronicle synthesizing subjective lived experience with verified clinical records."
        breadcrumbs={[
          { label: t('nav.dashboard', 'Dashboard'), href: '/patient/dashboard' },
          { label: t('nav.story', 'Health Story') },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <AnimatedButton
              variant="secondary"
              size="sm"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={() => {
                notifyInfo('Print Summary', 'Generating physician-ready PDF summary...')
                window.print()
              }}
            >
              Export
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              size="sm"
              leftIcon={<Share2 className="w-4 h-4" />}
              onClick={() => {
                notifySuccess('Case Shared', 'Secure encrypted link shared with Dr. Priya Sharma.')
              }}
            >
              Share with Doctor
            </AnimatedButton>
          </div>
        }
      />

      {/* Non-Diagnostic Clinical Synthesis Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Clinical Synthesis Protocol:</strong> AyuCase preserves
          and organizes patient narrative statements and records for physician evaluation. AyuCase{' '}
          <strong>does not provide medical diagnoses or treatment recommendations</strong>. All
          clinical judgments remain solely with your licensed healthcare provider.
        </div>
      </div>

      {/* Quick Jump Section Nav Bar */}
      <GlassCard variant="default" className="p-3">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 pl-1">
            Story Sections:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
            {[
              { id: 'section-profile', label: '1. Profile' },
              { id: 'section-concern', label: '2. Concern' },
              { id: 'section-statements', label: '3. Statements' },
              { id: 'section-timeline', label: '4. Timeline' },
              { id: 'section-docs', label: '5. Documents' },
              { id: 'section-history', label: '6. History' },
              { id: 'section-family', label: '7. Family' },
              { id: 'section-meds', label: '8. Medications' },
              { id: 'section-unknown', label: '9. Unknown Zone' },
              { id: 'section-completeness', label: '10. Completeness' },
              { id: 'section-dna', label: 'Case DNA' },
              { id: 'section-gaps', label: 'Gap Detector' },
            ].map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors shrink-0 whitespace-nowrap"
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Emotional Anchor Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/30 dark:border-emerald-500/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Quote className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>The Human Experience Behind the Clinical Codes</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                Patient Centered
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              "Behind every clinical code is a human being living through pain, endurance, and quiet resilience. This chronicle bridges what Aarav feels with what the data records."
            </p>
          </div>
        </div>
        <AnimatedButton
          variant="secondary"
          size="sm"
          leftIcon={<Volume2 className="w-3.5 h-3.5 text-emerald-500" />}
          onClick={() =>
            speakText(
              "Aarav's Health Story. Recurrent migraines since 2019, managed with lifestyle adjustments and Rizatriptan. Lived experiences, verified documents, and missing years are all synthesized here."
            )
          }
        >
          Read Story Aloud
        </AnimatedButton>
      </div>

      {/* SECTION 1: PATIENT PROFILE */}
      <section id="section-profile" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            Section 1 • Patient Profile
          </h2>
        </div>

        <GlassCard variant="elevated" className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-500/20">
                {patient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {patient.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Verified Intake
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {patient.age} Yrs • {patient.gender} • Demo Record ID: {patient.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Lead Physician
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Dr. Priya Sharma, MD
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Primary Condition
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {patient.primaryCondition}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Preferred Language
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                English & Tamil (Bilingual)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Current Care Mode
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                AyuCase Standard Mode
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Consent Status
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All Permissions Active</span>
              </span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* SECTION 2: CURRENT CONCERN */}
      <section id="section-concern" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            Section 2 • Current Concern
          </h2>
        </div>

        <GlassCard variant="elevated" className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Chief Complaint
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
                Recurrent Left Hemicranial Cephalea with Scintillating Scotoma
              </h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold shrink-0">
              Pain: 8/10 at peak
            </span>
          </div>

          {/* Plain language explanation callout */}
          <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed">
              <strong>In Everyday Words:</strong> Severe one-sided headaches (migraines) preceded by flashing zig-zag visual patterns (aura), worsened by stress and bright lights.
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Severe throbbing hemicrania localized to the left fronto-orbital region, preceded by a
            15-minute scintillating visual scotoma (zig-zag patterns). Episodes average 12–14 hours
            in duration and are accompanied by intense photophobia, phonophobia, and mild autonomic
            dysregulation (cardiovagal hypo-reactivity).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <span className="text-slate-400 font-semibold block mb-0.5">Episode Frequency</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                2–3 episodes/month (Reduced with beta-blockers)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <span className="text-slate-400 font-semibold block mb-0.5">Key Triggers</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Skipped meals, high-stress sprints, bright blue light
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <span className="text-slate-400 font-semibold block mb-0.5">Alleviating Factors</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Dark quiet room, cold compression, Rizatriptan 10mg
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono text-[11px] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-500" />
              Source: Voice Interview Q1 • 23 Sep 2026
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Verified by Patient
            </span>
          </div>
        </GlassCard>
      </section>

      {/* SECTION 3: PATIENT STATEMENTS (VOICE PRESERVATION) */}
      <section id="section-statements" className="scroll-mt-24 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
              Section 3 • Patient Statements (Voice Preservation)
            </h2>
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
            title="Progression & Workday Fatigue Escalation"
            category="History of Present Illness"
            structuredItems={[
              { label: 'Chronological Start', value: 'Spring 2019 (Gradual emergence)', chip: '7 Yrs' },
              { label: 'Frequency Peak', value: '4 to 6 episodes/month in 2023', chip: 'Escalation' },
              { label: 'Functional Impact', value: '2–3 days lost productivity per month', chip: 'Moderate' },
            ]}
            patientStatement="I used to push through it with black coffee, but by 2023 I had to lie down in a pitch-black conference room during team meetings."
            sourceInfo={{
              source: 'Voice Interview',
              question: 'Q2: How long have you experienced this?',
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
      </section>

      {/* SECTION 4: MEDICAL TIMELINE */}
      <section id="section-timeline" className="scroll-mt-24 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
              Section 4 • Medical Timeline
            </h2>
          </div>
          <Link
            to="/patient/timeline"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Open Time Machine</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <GlassCard variant="elevated" className="p-6 space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Longitudinal illness progression synthesized across 6 milestone eras from 2019 to 2026.
          </p>

          <div className="relative pl-6 border-l-2 border-emerald-500/30 space-y-6">
            {[
              {
                year: '2019',
                title: 'First Episodic Tension-Type Cephalea',
                desc: 'Bilateral mild pressure logged after consecutive 12-hour programming sprints.',
              },
              {
                year: '2021',
                title: 'Visual Aura Identification & Optometry Workup',
                desc: 'First scintillating scotoma noted. Comprehensive fundus examination ruled out retinal tears.',
              },
              {
                year: '2023',
                title: 'Severe Frequency Surge (4–6 Episodes / Month)',
                desc: 'Escalation to chronic migraine criteria; brief ED visit for abortive IV hydration.',
              },
              {
                year: '2024',
                title: 'Apollo Neurology Workup & 3T Neuroimaging',
                desc: 'Formal diagnosis of Neurovascular Migraine with aura; 3T MRI confirmed normal parenchymal structure.',
              },
              {
                year: '2025',
                title: 'Autonomic Reflex Testing & Propranolol Prophylaxis',
                desc: 'Cardiovagal hypo-reactivity detected; Propranolol 40mg BID initiated with good response.',
              },
              {
                year: '2026',
                title: 'AyuCase Integrative Case Synthesis Active',
                desc: 'Onboarding with Dr. Priya Sharma; continuous biometric and narrative alignment.',
              },
            ].map((node) => (
              <div key={node.year} className="relative group">
                <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-transform" />
                <div>
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {node.year}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {node.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {node.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* SECTION 5: DOCUMENTS */}
      <section id="section-docs" className="scroll-mt-24 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
              Section 5 • Documents & Records
            </h2>
          </div>
          <Link
            to="/patient/documents"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Document Vault</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {[
            {
              name: 'Brain MRI 3T Volumetric Protocol.pdf',
              date: '24 May 2024',
              provider: 'Apollo Hospital',
              finding: 'Normal parenchyma, patent circle of Willis',
              status: 'Verified',
            },
            {
              name: 'Comprehensive Autonomic Reflex Screen.pdf',
              date: '18 Jan 2025',
              provider: 'CareLife Diagnostics',
              finding: 'Valsalva ratio 1.34, cardiovagal hypo-reactivity',
              status: 'Verified',
            },
            {
              name: 'Prescription Schedule.pdf',
              date: '12 Aug 2025',
              provider: 'Dr. Priya Sharma, MD',
              finding: 'Propranolol 40mg BID & Rizatriptan 10mg PRN',
              status: 'Active',
            },
          ].map((doc, idx) => (
            <GlassCard key={idx} variant="default" className="p-4 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {doc.date}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                    {doc.status}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
                  {doc.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Facility: {doc.provider}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  {doc.finding}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Structured Metadata Linked</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* SECTION 6: HISTORY */}
      <section id="section-history" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            Section 6 • History of Present Illness (HPI)
          </h2>
        </div>

        <GlassCard variant="elevated" className="p-6 space-y-3">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Patient Aarav Chen is a 38-year-old software architect presenting with a 7-year history of
            episodic headache attacks that evolved from infrequent stress-induced tension episodes
            (2019) into classical migraines with visual scintillating auras (2021 onwards). Attack
            frequency peaked in 2023 at 4–6 disabling hemicranial headaches monthly, precipitating an
            emergency evaluation and specialized neurology referral.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Progression Pattern
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Subacute progression with seasonal escalation during Q4 work deadlines. Marked
                improvement noted following lifestyle hydration enforcement and Propranolol.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Non-Pharmacologic Trials
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                FL-41 tinted lenses, blue-light digital dimming, strict 7.5-hour sleep scheduling, and
                magnesium glycinate supplementation.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* SECTION 7: FAMILY HISTORY */}
      <section id="section-family" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            Section 7 • Family History
          </h2>
        </div>

        <GlassCard variant="elevated" className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Maternal Lineage */}
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                  Maternal Lineage (Verified)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  Positive Migraine History
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Mother suffered from severe recurring unilateral migraines with nausea and light
                sensitivity throughout her 30s and 40s. Strongly points toward hereditary
                neurovascular and ion channel susceptibility.
              </p>
            </div>

            {/* Paternal Lineage */}
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-800 dark:text-amber-400">
                  Paternal Lineage (Unverified)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
                  Unknown Information
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Paternal cardiovascular, hypertension, and neurovascular history has NOT been provided
                by patient. Logged in the Unknown Zone for physician clarification.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Interactive Pedigree Graph Matching Case Constellation */}
        <FamilyHealthTreeGraph />
      </section>

      {/* SECTION 8: MEDICATION HISTORY */}
      <section id="section-meds" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            Section 8 • Medication History
          </h2>
        </div>

        <GlassCard variant="elevated" className="p-6 space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Active Pharmacotherapy Regimen
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                  Prophylaxis (Daily)
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  Propranolol 40mg BID
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Non-selective beta blocker. Taken twice daily with meals.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 block">
                  Acute Abortive (PRN)
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  Rizatriptan 10mg PRN
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Oral disintegrating tablet. Taken at onset of visual scotoma.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 block">
                  Nutraceutical (Nightly)
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  Magnesium Glycinate 400mg
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Taken nightly for cortical spreading depression mitigation.
                </p>
              </div>
            </div>
          </div>

          {/* Adverse Reaction Alert */}
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Prior Adverse Reaction (Sumatriptan 50mg):</strong>{' '}
              Discontinued in 2023 due to severe acute facial flushing, thoracic tightness, and
              transient vasospasm sensation. Switched to Rizatriptan with excellent tolerability.
            </div>
          </div>
        </GlassCard>
      </section>

      {/* SECTION 9: UNKNOWN INFORMATION (UNKNOWN ZONE) */}
      <section id="section-unknown" className="scroll-mt-24 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Section 9 • Unknown Information (The Unknown Zone)
            </h2>
          </div>
          <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
            Never Invent Missing Information
          </span>
        </div>

        <GlassCard variant="elevated" className="p-6 space-y-4 border-rose-500/30">
          <div className="p-3 rounded-xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="font-bold text-rose-600 dark:text-rose-400">
              The Unknown Zone Principle:
            </strong>{' '}
            AyuCase explicitly highlights clinical variables that were{' '}
            <strong>NOT provided by the patient</strong>. Under no circumstances does the system
            extrapolate, guess, or invent missing clinical history.
          </div>

          <div className="space-y-3">
            {[
              {
                title: '48-Hour Ambulatory Blood Pressure Telemetry',
                status: 'NOT PROVIDED',
                reason:
                  'Mentioned as recommended during the 2025 autonomic screen, but raw continuous ambulatory blood pressure telemetry records have not yet been provided or uploaded.',
                questionIndex: 4,
              },
              {
                title: 'Overnight Polysomnography (Sleep Architecture PSG)',
                status: 'NOT PROVIDED',
                reason:
                  'Patient reports nocturnal migraine awakenings, but objective sleep stage latency and oxygen desaturation measurements have not been provided.',
                questionIndex: 5,
              },
              {
                title: 'Paternal Cardiovascular and Cerebrovascular History',
                status: 'NOT PROVIDED',
                reason:
                  'Maternal migraine history is verified, but paternal cardiovascular risk, stroke incidence, and familial hypertension details were not answered.',
                questionIndex: 5,
              },
            ].map((gap, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-rose-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25">
                      {gap.status}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {gap.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {gap.reason}
                  </p>
                </div>

                <AnimatedButton
                  variant="secondary"
                  size="sm"
                  className="shrink-0 text-xs border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                  onClick={() =>
                    navigate('/patient/interview', {
                      state: { questionIndex: gap.questionIndex },
                    })
                  }
                >
                  Provide in Interview
                </AnimatedButton>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* SECTION 10: CASE COMPLETENESS */}
      <section id="section-completeness" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            Section 10 • Case Completeness
          </h2>
        </div>

        <GlassCard variant="elevated" className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">
                Case Synthesis Fidelity: 78%
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Normalized against international clinical neurology intake standards (ICD-11 & ICHD-3).
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-black text-sm self-start sm:self-auto">
              Clinical Grade
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 block mb-0.5">Interview Depth</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                96% (6/6 Qs)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 block mb-0.5">Diagnostic Records</span>
              <span className="font-extrabold text-cyan-600 dark:text-cyan-400 text-sm">
                88% (3 Docs)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 block mb-0.5">Timeline Continuity</span>
              <span className="font-extrabold text-teal-600 dark:text-teal-400 text-sm">
                92% (6 Milestones)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 block mb-0.5">Unknown Gaps Resolved</span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">
                65% (3 Pending)
              </span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* EMBEDDED INTELLIGENCE COMPONENT: CASE DNA (VISUAL CASE PROFILE) */}
      <section id="section-dna" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2">
          <Dna className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            Case DNA • Visual Case Profile
          </h2>
        </div>
        <CaseDNAFingerprint />
      </section>

      {/* EMBEDDED INTELLIGENCE COMPONENT: CASE GAP DETECTOR */}
      <section id="section-gaps" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            Case Gap Detector • 7 Clinical Categories
          </h2>
        </div>
        <CaseGapDetector />
      </section>
    </div>
  )
}
