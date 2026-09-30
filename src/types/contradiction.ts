export type ReconciliationStance =
  | 'Patient Statement'
  | 'Document Record'
  | 'Needs Physician Review'
  | 'Undecided'

export type DifferenceStatus =
  | 'Needs Human Review'
  | 'Reviewed'
  | 'Still Unclear'

export type DifferenceSeverity = 'High' | 'Moderate' | 'Informational'

export interface PatientStatementSource {
  quote: string
  source: string
  timestamp: string
  questionId?: string
}

export interface DocumentRecordSource {
  title: string
  documentName: string
  page?: number | string
  excerpt: string
  provider: string
  date: string
}

export interface InformationDifference {
  id: string
  title: string
  category: string
  severity: DifferenceSeverity
  summary: string
  patientStatement: PatientStatementSource
  documentRecord: DocumentRecordSource
  currentStance: ReconciliationStance
  status: DifferenceStatus
  reviewedAt?: string
  reviewer?: string
  physicianNote?: string
}

export interface DifferenceReviewHistoryEntry {
  id: string
  differenceId: string
  differenceTitle: string
  previousStatus: DifferenceStatus
  newStatus: DifferenceStatus
  selectedStance: ReconciliationStance
  timestamp: string
  reviewer: string
  physicianNote?: string
}

export const INITIAL_INFORMATION_DIFFERENCES: InformationDifference[] = [
  {
    id: 'diff-med-01',
    title: 'Medication Adherence vs. Prescription Record',
    category: 'Pharmacotherapy',
    severity: 'High',
    summary:
      'Patient verbally reports taking zero medications, while official clinical records list active daily Propranolol and PRN Rizatriptan.',
    patientStatement: {
      quote: 'I have not taken medication.',
      source: 'Voice Interview Q4: Current Medicines',
      timestamp: '23 Sep 2026, 09:18 AM',
      questionId: 'q4',
    },
    documentRecord: {
      title: 'Active Outpatient Prescription Schedule',
      documentName: 'Prescription.pdf',
      page: 'Page 1 of 2',
      excerpt:
        'Rx: Propranolol HCl 40mg Oral Tablet — 1 tab BID with meals. Rx: Rizatriptan Benzoate 10mg ODT — 1 tab PRN at onset of migraine aura.',
      provider: 'Dr. Priya Sharma, MD (CareLife Integrative Center)',
      date: '12 Aug 2025',
    },
    currentStance: 'Needs Physician Review',
    status: 'Needs Human Review',
  },
  {
    id: 'diff-onset-02',
    title: 'Symptom Onset Timeline Discrepancy',
    category: 'Chronology',
    severity: 'Moderate',
    summary:
      'Patient recalls headache onset starting recently in late 2024, whereas previous ophthalmology and neurology consult notes verify symptoms dating back to 2019.',
    patientStatement: {
      quote: 'I have only been experiencing these headaches since last winter, maybe late 2024.',
      source: 'Voice Interview Q2: Duration & Onset',
      timestamp: '23 Sep 2026, 09:16 AM',
      questionId: 'q2',
    },
    documentRecord: {
      title: 'Specialist Ophthalmology & Optometry Consult Report',
      documentName: 'Comprehensive Autonomic Reflex Screen.pdf (Prior Records)',
      page: 'Page 3 of 4',
      excerpt:
        'Patient presented with episodic visual scintillating scotomata and unilateral throbbing cephalalgia dating back to Q2 2019 coding sprints. Fundus exam normal.',
      provider: 'Dr. Meera Nambiar, MS (Vision Care Eye Institute)',
      date: '14 Oct 2021',
    },
    currentStance: 'Needs Physician Review',
    status: 'Needs Human Review',
  },
  {
    id: 'diff-freq-03',
    title: 'Attack Frequency Perception (Occasional vs. Weekly Disabling)',
    category: 'Frequency & Severity',
    severity: 'Moderate',
    summary:
      'Patient describes headache attacks as rare occasional occurrences, whereas outpatient encounter notes document frequent 4–6 disabling monthly episodes.',
    patientStatement: {
      quote: 'It only happens maybe once every couple of months when work gets crazy.',
      source: 'Patient Narrative Check-in',
      timestamp: '23 Sep 2026, 09:20 AM',
      questionId: 'q1',
    },
    documentRecord: {
      title: 'Outpatient Neurology Clinical Impression',
      documentName: 'Brain MRI 3T Volumetric Protocol.pdf (Clinical Summary)',
      page: 'Page 2 of 2',
      excerpt:
        'Clinical History: Refractory hemicranial cephalea presenting at 4 to 6 discrete disabling episodes per month with marked autonomic hypo-reactivity.',
      provider: 'Apollo Hospital (Department of Neurosciences)',
      date: '24 May 2024',
    },
    currentStance: 'Needs Physician Review',
    status: 'Needs Human Review',
  },
]

export const INITIAL_REVIEW_HISTORY: DifferenceReviewHistoryEntry[] = [
  {
    id: 'hist-001',
    differenceId: 'diff-allergy-archive',
    differenceTitle: 'Sulfa Allergy Cross-Reactivity Report',
    previousStatus: 'Needs Human Review',
    newStatus: 'Reviewed',
    selectedStance: 'Patient Statement',
    timestamp: '15 Aug 2026, 04:30 PM',
    reviewer: 'Dr. Priya Sharma, MD',
    physicianNote:
      'Patient clarified mild gastric distress after trimethoprim-sulfamethoxazole in childhood, not an IgE-mediated anaphylaxis. Document record updated.',
  },
]
