import React from 'react'
import { Quote } from 'lucide-react'
import { PatientVoiceCard } from '../intelligence/PatientVoiceCard'

export const PatientVoicePreservation: React.FC = () => {
  return (
    <section id="section-statements" className="scroll-mt-24 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Quote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Section 3 • Patient Statements (Voice Preservation)
          </h2>
        </div>
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 italic">
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
  )
}
