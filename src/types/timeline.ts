export type TimelineYear = 2019 | 2021 | 2023 | 2024 | 2025 | 2026

export type EventCategory =
  | 'consultation'
  | 'document'
  | 'statement'
  | 'procedure'
  | 'medication'
  | 'lifestyle'

export interface TimelineNodeEvent {
  id: string
  year: TimelineYear
  date: string
  title: string
  category: EventCategory
  summary: string
  detailedNote: string
  physician: string
  institution: string
  patientStatement?: string
  documents?: Array<{ name: string; type: string }>
  vitalsSnapshot?: { bp: string; hr: number }
  tags: string[]
  severity?: 'normal' | 'moderate' | 'critical'
}

export interface YearlyPatientSnapshot {
  year: TimelineYear
  patientAge: number
  clinicalStage: string
  primaryConditionSummary: string
  documents: Array<{ title: string; type: string; date: string; source: string }>
  consultations: Array<{ doctor: string; specialty: string; clinic: string; keyOutcome: string }>
  patientStatements: Array<{ quote: string; context: string }>
  caseEvents: Array<{ title: string; impact: string; category: string }>
  medicationState: string[]
  vitalsTrend: { hr: number; bp: string; status: string }
}

export interface TimelineGap {
  id: string
  startYear: number
  endYear: number
  label: string
  severity: 'Medium' | 'High'
  impactDescription: string
  questions: Array<{
    id: string
    prompt: string
    options: string[]
  }>
  isResolved: boolean
  resolvedAnswer?: string
}

export const TIMELINE_YEARS: TimelineYear[] = [2019, 2021, 2023, 2024, 2025, 2026]

export const YEARLY_SNAPSHOTS: Record<TimelineYear, YearlyPatientSnapshot> = {
  2019: {
    year: 2019,
    patientAge: 31,
    clinicalStage: 'Early Prodromal / Pre-diagnosis',
    primaryConditionSummary: 'Intermittent tension-type cephalea dismissed as occupational screen fatigue.',
    documents: [
      {
        title: 'Annual Occupational Health Clearance.pdf',
        type: 'Discharge Summary',
        date: '2019-11-14',
        source: 'Apex Tech Wellness Clinic',
      },
    ],
    consultations: [
      {
        doctor: 'Dr. S. Ramanathan, MBBS',
        specialty: 'General Practice',
        clinic: 'Apex Corporate Health Center',
        keyOutcome: 'Prescribed rest, ergonomic display filters, and over-the-counter paracetamol.',
      },
    ],
    patientStatements: [
      {
        quote: 'I felt mild forehead tightness after 12-hour coding sprints, but thought everyone had that.',
        context: 'Initial symptom awareness',
      },
    ],
    caseEvents: [
      {
        title: 'First Logged Episodic Headache',
        impact: 'Attributed to eye strain; no neurovascular workup initiated.',
        category: 'Symptom Onset',
      },
    ],
    medicationState: ['Paracetamol 500mg PRN'],
    vitalsTrend: { hr: 68, bp: '116/74 mmHg', status: 'Optimal Baseline' },
  },
  2021: {
    year: 2021,
    patientAge: 33,
    clinicalStage: 'Aura Emergence & Vasomotor Sensitization',
    primaryConditionSummary: 'Onset of classical visual scintillations preceding unilateral throbbing pain.',
    documents: [
      {
        title: 'Optometry & Fundus Examination.pdf',
        type: 'Imaging',
        date: '2021-04-18',
        source: 'Vision Care Eye Institute',
      },
      {
        title: 'Routine Hematology & Thyroid Panel.pdf',
        type: 'Lab Report',
        date: '2021-08-22',
        source: 'City Diagnostic Labs',
      },
    ],
    consultations: [
      {
        doctor: 'Dr. Meera Nambiar, MS (Ophthalmology)',
        specialty: 'Ophthalmology',
        clinic: 'Vision Care Eye Institute',
        keyOutcome: 'Fundoscopy normal. No papilledema. Referred to neurology for migraine aura evaluation.',
      },
    ],
    patientStatements: [
      {
        quote: 'I saw shimmering zigzag lines in my peripheral vision for 30 minutes before the severe nausea struck.',
        context: 'First experienced visual aura',
      },
      {
        quote: 'Bright sunlight or missed meals started triggering episodes like clockwork.',
        context: 'Trigger pattern emergence',
      },
    ],
    caseEvents: [
      {
        title: 'Documented Visual Scintillating Scotoma',
        impact: 'Clinical transition from tension headache to classical migraine phenotype.',
        category: 'Pathophysiology',
      },
      {
        title: 'Dietary & Fasting Trigger Discovery',
        impact: 'Patient begins manual symptom diary.',
        category: 'Behavioral',
      },
    ],
    medicationState: ['Naproxen 500mg (Acute abortive)'],
    vitalsTrend: { hr: 72, bp: '118/76 mmHg', status: 'Normotensive' },
  },
  2023: {
    year: 2023,
    patientAge: 35,
    clinicalStage: 'Chronification & Autonomic Escalation (Historical Gap Period)',
    primaryConditionSummary: 'Escalation to 4-6 monthly debilitating episodes with cardiovagal flushing.',
    documents: [
      {
        title: 'Preliminary Cervical X-Ray.pdf',
        type: 'Imaging',
        date: '2023-03-10',
        source: 'Metro Orthopedic Center',
      },
    ],
    consultations: [
      {
        doctor: 'Dr. A. Verma, MD',
        specialty: 'Internal Medicine',
        clinic: 'CareLife Multispecialty Hospital',
        keyOutcome: 'Trial of Sumatriptan 50mg with partial response and chest tightness side effect.',
      },
    ],
    patientStatements: [
      {
        quote: 'The pain started throbbing into my left cheek and neck. Painkillers barely took the edge off.',
        context: 'Severe episode progression',
      },
    ],
    caseEvents: [
      {
        title: 'Sumatriptan Adverse Vasospasm Event',
        impact: 'Discontinued triptan monotherapy due to autonomic flushing.',
        category: 'Pharmacology',
      },
    ],
    medicationState: ['Sumatriptan 50mg (Trial discontinued)'],
    vitalsTrend: { hr: 78, bp: '122/80 mmHg', status: 'Mild Labile Variation' },
  },
  2024: {
    year: 2024,
    patientAge: 36,
    clinicalStage: 'Specialist Referral & Baseline Neuroimaging',
    primaryConditionSummary: 'Comprehensive tertiary neurology workup confirming migraine with autonomic features.',
    documents: [
      {
        title: 'Initial Outpatient Neurological Summary.pdf',
        type: 'Discharge Summary',
        date: '2024-06-12',
        source: 'Apollo Neurology Department',
      },
    ],
    consultations: [
      {
        doctor: 'Dr. Kumar, MD, DM (Neurology)',
        specialty: 'Neurology',
        clinic: 'Apollo Hospital',
        keyOutcome: 'Established diagnosis of migraine with autonomic features. Recommended 3T Brain MRI and lifestyle modification.',
      },
    ],
    patientStatements: [
      {
        quote: 'Dr. Kumar was the first to explain that the neck stiffness and eye throbbing were connected.',
        context: 'Specialist validation',
      },
    ],
    caseEvents: [
      {
        title: 'Formal Neurological Diagnosis Established',
        impact: 'Shifted from symptomatic analgesics to proactive neurological care plan.',
        category: 'Diagnostic Workup',
      },
    ],
    medicationState: ['Propranolol 20mg daily (Initial titration)'],
    vitalsTrend: { hr: 70, bp: '118/76 mmHg', status: 'Controlled' },
  },
  2025: {
    year: 2025,
    patientAge: 37,
    clinicalStage: 'Prophylaxis Optimization & Telemetry Tracking',
    primaryConditionSummary: 'Titration of beta-blocker prophylaxis with wearable heart rate variability tracking.',
    documents: [
      {
        title: 'Comprehensive Autonomic Reflex Screen.pdf',
        type: 'Lab Report',
        date: '2025-07-18',
        source: 'NeuroVascular Analytics Lab',
      },
    ],
    consultations: [
      {
        doctor: 'Dr. Elena Vance, MD',
        specialty: 'Autonomic Neurology',
        clinic: 'AyuCare Integrative Neuro Clinic',
        keyOutcome: 'Titrated Propranolol to 40mg BID. Added Magnesium Glycinate 400mg nightly.',
      },
    ],
    patientStatements: [
      {
        quote: 'My attack frequency dropped from 6 per month down to 2 after regular prophylaxis.',
        context: 'Treatment response milestone',
      },
    ],
    caseEvents: [
      {
        title: '50% Episode Reduction Milestone',
        impact: 'Achieved sustained therapeutic response with circadian hydration schedule.',
        category: 'Therapeutic Success',
      },
    ],
    medicationState: ['Propranolol 40mg BID', 'Magnesium Glycinate 400mg'],
    vitalsTrend: { hr: 72, bp: '116/74 mmHg', status: 'Stable Autonomic Rhythm' },
  },
  2026: {
    year: 2026,
    patientAge: 38,
    clinicalStage: 'Current State: High-Resolution Synthesis & Integrative Care',
    primaryConditionSummary: 'Recurrent Autonomic Migraine & Dysautonomia managed with multi-disciplinary care.',
    documents: [
      {
        title: 'Brain MRI 3T Volumetric Protocol.pdf',
        type: 'Imaging',
        date: '2026-07-04',
        source: 'AyuCare Advanced Diagnostics',
      },
      {
        title: 'Prescription.pdf',
        type: 'Prescription',
        date: '2026-08-15',
        source: 'Dr. Elena Vance Clinic',
      },
    ],
    consultations: [
      {
        doctor: 'Dr. Priya Sharma, MD',
        specialty: 'Integrative Neurology',
        clinic: 'AyuCare Multi-Disciplinary Center',
        keyOutcome: 'Active care lead. Synchronizing wearable telemetry with patient narrative phenotype.',
      },
    ],
    patientStatements: [
      {
        quote: 'Recording my journey in AyuCase made me realize how much stress and skipped meals triggered the cascade.',
        context: 'Active narrative synthesis',
      },
    ],
    caseEvents: [
      {
        title: 'AyuCase Multi-Disciplinary Onboarding',
        impact: '78% Case Completeness with digital consent and voice interview logged.',
        category: 'Active Care',
      },
    ],
    medicationState: [
      'Propranolol 40mg BID',
      'Magnesium Glycinate 400mg nightly',
      'Rizatriptan 10mg PRN',
    ],
    vitalsTrend: { hr: 74, bp: '118/78 mmHg', status: 'Normal Sinus Cadence' },
  },
}

export const INITIAL_TIMELINE_NODES: TimelineNodeEvent[] = [
  {
    id: 'node-2019-1',
    year: 2019,
    date: '14 Nov 2019',
    title: 'First Episodic Cephalea Logged',
    category: 'statement',
    summary: 'Initial workplace headache episode after prolonged software sprints.',
    detailedNote:
      'Patient reported bilateral temporal tightness lasting 8 hours. Relieved by rest and hydration. No neurovascular workup performed at this time.',
    physician: 'Dr. S. Ramanathan, MBBS',
    institution: 'Apex Tech Wellness Clinic',
    patientStatement: 'I felt mild forehead tightness after 12-hour coding sprints, but thought everyone had that.',
    tags: ['Early Prodrome', 'Tension-type', 'Workplace Strain'],
    severity: 'normal',
  },
  {
    id: 'node-2021-1',
    date: '18 Apr 2021',
    year: 2021,
    title: 'Visual Aura & Ophthalmological Consult',
    category: 'procedure',
    summary: 'First documented scintillating scotoma lasting 30 minutes with photophobia.',
    detailedNote:
      'Fundoscopic examination was completely unremarkable. No elevated intracranial pressure. Classical migraine with visual aura identified.',
    physician: 'Dr. Meera Nambiar, MS',
    institution: 'Vision Care Eye Institute',
    documents: [{ name: 'Optometry & Fundus Examination.pdf', type: 'Imaging' }],
    patientStatement: 'I saw shimmering zigzag lines in my peripheral vision for 30 minutes before the severe nausea struck.',
    tags: ['Visual Aura', 'Scintillating Scotoma', 'Fundoscopy'],
    severity: 'moderate',
  },
  {
    id: 'node-2023-1',
    year: 2023,
    date: '10 Mar 2023',
    title: 'Triptan Trial & Vasomotor Flushing',
    category: 'medication',
    summary: 'Trial of Sumatriptan 50mg with transient chest tightness and facial flush.',
    detailedNote:
      'Patient experienced significant autonomic vasodilation and palpitations following Sumatriptan. Discontinued in favor of preventative beta-blockade.',
    physician: 'Dr. A. Verma, MD',
    institution: 'CareLife Hospital',
    patientStatement: 'The pain started throbbing into my left cheek and neck. Painkillers barely took the edge off.',
    tags: ['Sumatriptan', 'Vasospasm', 'Adverse Reaction'],
    severity: 'moderate',
  },
  {
    id: 'node-2024-1',
    year: 2024,
    date: '12 Jun 2024',
    title: 'Formal Neurological Outpatient Consultation',
    category: 'consultation',
    summary: 'Comprehensive clinical evaluation by Dr. Kumar at Apollo Neurology.',
    detailedNote:
      'Established diagnosis of primary neurovascular migraine with autonomic dysregulation. Ordered baseline structural neuroimaging and reflex battery.',
    physician: 'Dr. Kumar, MD, DM',
    institution: 'Apollo Hospital',
    documents: [{ name: 'Initial Outpatient Neurological Summary.pdf', type: 'Discharge Summary' }],
    patientStatement: 'Dr. Kumar was the first to explain that the neck stiffness and eye throbbing were connected.',
    tags: ['Neurology', 'Diagnostic Workup', 'Apollo'],
    severity: 'normal',
  },
  {
    id: 'node-2025-1',
    year: 2025,
    date: '18 Jul 2025',
    title: 'Autonomic Reflex Screen & Prophylaxis Shift',
    category: 'document',
    summary: 'Quantitative Sudomotor and cardiovagal reflex screen at NeuroVascular Analytics.',
    detailedNote:
      'Demonstrated mild adrenergic hyper-responsiveness. Propranolol titrated to 40mg BID resulting in 50% reduction in attack frequency.',
    physician: 'Dr. Elena Vance, MD',
    institution: 'NeuroVascular Analytics Lab',
    documents: [{ name: 'Comprehensive Autonomic Reflex Screen.pdf', type: 'Lab Report' }],
    patientStatement: 'My attack frequency dropped from 6 per month down to 2 after regular prophylaxis.',
    tags: ['Autonomic Battery', 'Propranolol', 'Remission'],
    severity: 'normal',
  },
  {
    id: 'node-2026-1',
    year: 2026,
    date: '04 Jul 2026',
    title: 'High-Resolution 3T Brain MRI with Contrast',
    category: 'procedure',
    summary: 'Neuroimaging confirms intact intracranial vasculature and normal parenchyma.',
    detailedNote:
      'High-resolution volumetric sequences demonstrated no intracranial lesions, demyelination, or aneurysm. Verified primary cephalea status.',
    physician: 'Dr. Rajesh Nair, MD (Neuroradiology)',
    institution: 'AyuCare Advanced Diagnostics',
    documents: [{ name: 'Brain MRI 3T Volumetric Protocol.pdf', type: 'Imaging' }],
    tags: ['Neuroimaging', '3T MRI', 'Verified Normal'],
    severity: 'normal',
  },
]

export const INITIAL_TIMELINE_GAP: TimelineGap = {
  id: 'gap-2022-2023',
  startYear: 2022,
  endYear: 2023,
  label: '2022 - 2023 Information Gap',
  severity: 'High',
  impactDescription:
    '18-month gap in autonomic telemetry and prophylactic treatment response. Missing records between early aura onset in 2021 and formal specialist evaluation in 2024.',
  questions: [
    {
      id: 'gq-1',
      prompt: 'During 2022–2023, did you visit any general physician or emergency center for acute migraine episodes?',
      options: [
        'Yes, visited an emergency urgent care once for IV hydration and analgesics.',
        'No formal doctor visits, managed at home with OTC paracetamol.',
        'Consulted an ayurvedic practitioner for herbal teas and stress relief.',
      ],
    },
    {
      id: 'gq-2',
      prompt: 'Were you taking any daily supplements or unrecorded medications during this period?',
      options: [
        'Started over-the-counter Magnesium supplements and Vitamin B2 (Riboflavin).',
        'Only took temporary painkillers when headaches occurred.',
        'Tried alternative herbal formulations without prescription.',
      ],
    },
  ],
  isResolved: false,
}
