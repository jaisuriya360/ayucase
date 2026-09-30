export type GapStatus = 'Complete' | 'Partial' | 'Missing'

export type GapCategory =
  | 'Chief Complaint'
  | 'HPI'
  | 'Past History'
  | 'Family History'
  | 'Medication History'
  | 'Lifestyle'
  | 'Documents'

export interface CaseGapItem {
  id: string
  category: GapCategory
  status: GapStatus
  percentage: number
  summary: string
  missingDetails?: string
  interviewQuestionIndex: number // maps to relevant interview question
}

export interface CaseDNAMetric {
  id: string
  label: string
  densityScore: number // 0-100
  status: 'High' | 'Optimal' | 'Partial'
  verifiedCount: string
  description: string
  color: string
}

export interface ConstellationNodeData {
  id: string
  label: string
  category: string
  iconType: string
  detailsCount: string
  description: string
  clinicalItems: Array<{ label: string; value: string; sourceBadge?: string }>
  connectedNodeIds: string[]
}

export const CASE_GAP_CATEGORIES: CaseGapItem[] = [
  {
    id: 'gap-cc',
    category: 'Chief Complaint',
    status: 'Complete',
    percentage: 100,
    summary: 'Left-sided throbbing hemicrania with scintillating visual aura and photophobia.',
    interviewQuestionIndex: 0,
  },
  {
    id: 'gap-hpi',
    category: 'HPI',
    status: 'Complete',
    percentage: 95,
    summary: 'Subacute progressive timeline since Spring 2026. Stress and skipped meals identified as triggers.',
    interviewQuestionIndex: 1,
  },
  {
    id: 'gap-past',
    category: 'Past History',
    status: 'Complete',
    percentage: 90,
    summary: 'Optometry workup (2021) and outpatient neurology consult at Apollo (2024).',
    interviewQuestionIndex: 2,
  },
  {
    id: 'gap-family',
    category: 'Family History',
    status: 'Partial',
    percentage: 55,
    summary: 'Maternal history of throbbing cephalea documented. Paternal cardiovascular history unverified.',
    missingDetails: 'Need paternal vascular risk and sibling migraine incidence.',
    interviewQuestionIndex: 5,
  },
  {
    id: 'gap-meds',
    category: 'Medication History',
    status: 'Complete',
    percentage: 100,
    summary: 'Propranolol 40mg BID, Rizatriptan 10mg PRN, Magnesium Glycinate 400mg. Adverse sumatriptan vasospasm noted.',
    interviewQuestionIndex: 3,
  },
  {
    id: 'gap-lifestyle',
    category: 'Lifestyle',
    status: 'Complete',
    percentage: 90,
    summary: 'Circadian hydration tracking, screen fatigue mitigation, and regular sleep scheduling.',
    interviewQuestionIndex: 5,
  },
  {
    id: 'gap-docs',
    category: 'Documents',
    status: 'Partial',
    percentage: 70,
    summary: 'Brain MRI 3T and Autonomic Screen verified. 48-Hour Holter telemetry still pending upload.',
    missingDetails: 'Continuous ambulatory blood pressure telemetry not yet uploaded.',
    interviewQuestionIndex: 4,
  },
]

export const CASE_DNA_METRICS: CaseDNAMetric[] = [
  {
    id: 'dna-interview',
    label: 'Interview',
    densityScore: 96,
    status: 'Optimal',
    verifiedCount: '6/6 Questions Answered',
    description: 'Conversational voice check-in transcribed and verified.',
    color: 'emerald',
  },
  {
    id: 'dna-docs',
    label: 'Documents',
    densityScore: 88,
    status: 'Optimal',
    verifiedCount: '3 Verified Records',
    description: 'High-resolution neuroimaging, reflex screen, and prescription.',
    color: 'cyan',
  },
  {
    id: 'dna-timeline',
    label: 'Timeline',
    densityScore: 92,
    status: 'Optimal',
    verifiedCount: '6 Chronological Milestones',
    description: 'Continuous progression documented from 2019 to 2026.',
    color: 'teal',
  },
  {
    id: 'dna-history',
    label: 'History',
    densityScore: 82,
    status: 'High',
    verifiedCount: '8 Longitudinal Chapters',
    description: 'Detailed illness progression and past physician impressions.',
    color: 'indigo',
  },
  {
    id: 'dna-completeness',
    label: 'Completeness',
    densityScore: 78,
    status: 'High',
    verifiedCount: '78% Normalized Case Fidelity',
    description: 'Grounded against comprehensive clinical diagnostic schemas.',
    color: 'purple',
  },
  {
    id: 'dna-statements',
    label: 'Patient Statements',
    densityScore: 98,
    status: 'Optimal',
    verifiedCount: '12 Preserved Verbatim Quotes',
    description: 'Exact subjective symptom quotes preserved in original words.',
    color: 'rose',
  },
]

export const CONSTELLATION_NODES: Record<string, ConstellationNodeData> = {
  patient: {
    id: 'patient',
    label: 'PATIENT',
    category: 'Central Core',
    iconType: 'user',
    detailsCount: 'PT-DEMO-9042',
    description: 'Aarav Chen • 38 Yrs • Primary Neurovascular Migraine & Dysautonomia',
    clinicalItems: [
      { label: 'Patient Name', value: 'Aarav Chen (Male, 38 Yrs)' },
      { label: 'Primary Condition', value: 'Recurrent Autonomic Migraine & Vasospasm' },
      { label: 'Care Lead', value: 'Dr. Priya Sharma, MD (Neurology)' },
      { label: 'Core Principle', value: "The patient's own words are never lost." },
    ],
    connectedNodeIds: [
      'statements',
      'documents',
      'timeline',
      'consultations',
      'history',
      'family',
      'medications',
      'unknown',
    ],
  },
  statements: {
    id: 'statements',
    label: 'Patient Statements',
    category: 'Subjective Narrative',
    iconType: 'quote',
    detailsCount: '12 Quotes Preserved',
    description: 'Direct verbatim statements detailing lived migraine sensation and aura.',
    clinicalItems: [
      {
        label: 'Aura Description',
        value: '"It felt like a flashbulb exploding behind my left eye, lasting 14 hours straight."',
        sourceBadge: 'Voice Interview Q1 • 23 Sep 2026',
      },
      {
        label: 'Trigger Discovery',
        value: '"Recording my journey made me realize how much stress and skipped meals triggered the cascade."',
        sourceBadge: 'Voice Interview Q6 • 23 Sep 2026',
      },
      {
        label: 'Workplace Onset',
        value: '"I felt mild forehead tightness after 12-hour coding sprints, but thought everyone had that."',
        sourceBadge: 'Timeline Archive • 2019',
      },
    ],
    connectedNodeIds: ['patient', 'history', 'timeline'],
  },
  documents: {
    id: 'documents',
    label: 'Documents',
    category: 'Diagnostic Records',
    iconType: 'file',
    detailsCount: '3 Verified Files',
    description: 'Structural neuroimaging, autonomic reflex battery, and prescriptions.',
    clinicalItems: [
      {
        label: 'Brain MRI 3T Protocol',
        value: 'Normal parenchymal architecture, patent circle of Willis.',
        sourceBadge: 'Brain MRI 3T Volumetric Protocol.pdf • Page 1',
      },
      {
        label: 'Autonomic Reflex Screen',
        value: 'Borderline Valsalva ratio 1.34 with cardiovagal hypo-reactivity.',
        sourceBadge: 'Comprehensive Autonomic Reflex Screen.pdf • Page 2',
      },
      {
        label: 'Prescription Schedule',
        value: 'Propranolol 40mg BID & Rizatriptan 10mg PRN titration.',
        sourceBadge: 'Prescription.pdf • Page 1',
      },
    ],
    connectedNodeIds: ['patient', 'timeline', 'medications'],
  },
  timeline: {
    id: 'timeline',
    label: 'Timeline',
    category: 'Chronological Axis',
    iconType: 'clock',
    detailsCount: '2019 – 2026 (7 Yrs)',
    description: 'Longitudinal illness trajectory spanning 6 major milestone eras.',
    clinicalItems: [
      { label: '2019 Milestone', value: 'First tension-type cephalea logged after prolonged coding sprints.' },
      { label: '2021 Milestone', value: 'Visual scintillating scotoma identified; optometry consultation.' },
      { label: '2024 Milestone', value: 'Specialist referral to Apollo Neurology; formal diagnosis.' },
      { label: '2026 Active', value: 'AyuCase integrative care onboarding with Dr. Priya Sharma.' },
    ],
    connectedNodeIds: ['patient', 'statements', 'documents', 'consultations'],
  },
  consultations: {
    id: 'consultations',
    label: 'Consultations',
    category: 'Physician Encounters',
    iconType: 'stethoscope',
    detailsCount: '4 Specialists Seen',
    description: 'Multi-disciplinary evaluations spanning primary care, ophthalmology, and neurology.',
    clinicalItems: [
      { label: 'Current Neurologist', value: 'Dr. Priya Sharma, MD (AyuCare Integrative Center, 2026)' },
      { label: 'Autonomic Specialist', value: 'Dr. Elena Vance, MD (Autonomic Neurology, 2025)' },
      { label: 'Tertiary Neurology', value: 'Dr. Kumar, MD, DM (Apollo Hospital, 2024)' },
      { label: 'Ophthalmology', value: 'Dr. Meera Nambiar, MS (Vision Care Eye Institute, 2021)' },
    ],
    connectedNodeIds: ['patient', 'timeline', 'documents'],
  },
  history: {
    id: 'history',
    label: 'History',
    category: 'Clinical Chronology',
    iconType: 'book',
    detailsCount: 'HPI & Progression',
    description: 'Longitudinal History of Present Illness from episodic to chronic migraine.',
    clinicalItems: [
      { label: 'Onset', value: 'Gradual subacute onset starting in early 2019.' },
      { label: 'Frequency Progression', value: 'Escalated from 1 episode quarterly to 4-6 monthly in 2023.' },
      { label: 'Current State', value: 'Reduced to 2 manageable monthly episodes with beta-blockade.' },
    ],
    connectedNodeIds: ['patient', 'statements', 'timeline'],
  },
  family: {
    id: 'family',
    label: 'Family History',
    category: 'Genetics / Hereditary',
    iconType: 'users',
    detailsCount: 'Partial (Maternal Verified)',
    description: 'Hereditary channelopathy and neurovascular predisposition markers.',
    clinicalItems: [
      { label: 'Maternal Lineage', value: 'Mother suffered recurrent throbbing migraines with photophobia.' },
      { label: 'Paternal Lineage', value: 'Unverified (Paternal cardiovascular history not provided).' },
      { label: 'Clinical Note', value: 'Supports familial hemiplegic/vasospastic channelopathy risk.' },
    ],
    connectedNodeIds: ['patient', 'history', 'unknown'],
  },
  medications: {
    id: 'medications',
    label: 'Medication History',
    category: 'Pharmacotherapy',
    iconType: 'pill',
    detailsCount: '3 Active Prescriptions',
    description: 'Current prophylactic regimen, abortive triptans, and past adverse trials.',
    clinicalItems: [
      {
        label: 'Prophylaxis',
        value: 'Propranolol 40mg twice daily with meals (Continuous since Aug 2025).',
        sourceBadge: 'Prescription.pdf • Page 1',
      },
      {
        label: 'Abortive',
        value: 'Rizatriptan 10mg PRN taken at onset of visual scotoma.',
        sourceBadge: 'Prescription.pdf • Page 2',
      },
      {
        label: 'Nutraceutical',
        value: 'Magnesium Glycinate 400mg nightly for cortical threshold elevation.',
        sourceBadge: 'Prescription.pdf • Page 2',
      },
      {
        label: 'Past Adverse Trial',
        value: 'Sumatriptan 50mg (2023) - discontinued due to facial flushing and chest tightness.',
        sourceBadge: 'Consultation Note • CareLife Hospital',
      },
    ],
    connectedNodeIds: ['patient', 'documents'],
  },
  unknown: {
    id: 'unknown',
    label: 'Unknown Information',
    category: 'Unknown Zone',
    iconType: 'alert',
    detailsCount: '3 Information Gaps',
    description: 'Information explicitly NOT provided by patient. Never invented or assumed.',
    clinicalItems: [
      {
        label: 'Continuous Telemetry',
        value: 'NOT PROVIDED: 48-Hour Ambulatory Blood Pressure Telemetry Log.',
      },
      {
        label: 'Sleep Polysomnography',
        value: 'NOT PROVIDED: Overnight sleep architecture and nocturnal desaturation.',
      },
      {
        label: 'Paternal Family History',
        value: 'NOT PROVIDED: Paternal cardiovascular and vascular cephalea history.',
      },
    ],
    connectedNodeIds: ['patient', 'family'],
  },
}
