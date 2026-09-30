export type FamilyRelation =
  | 'Grandparent'
  | 'Parent'
  | 'Sibling'
  | 'Patient'
  | 'Other'

export type LineageSide = 'Maternal' | 'Paternal' | 'Direct'

export interface FamilyMember {
  id: string
  name: string
  relation: FamilyRelation
  lineageSide: LineageSide
  gender: 'Female' | 'Male' | 'Other'
  age?: number
  status: 'Living' | 'Deceased' | 'Unknown'
  reportedConditions: string[]
  patientNotes: string
  sourceLabel: string
  hasMigraineHistory: boolean
  isPatient: boolean
  generation: 1 | 2 | 3 // 1: Grandparent, 2: Parent, 3: Patient/Sibling
}

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  // Generation 1: Grandparents
  {
    id: 'fam-gm-mat',
    name: 'Lin Chen',
    relation: 'Grandparent',
    lineageSide: 'Maternal',
    gender: 'Female',
    age: 84,
    status: 'Living',
    reportedConditions: ['Chronic Tension Cephalea', 'Osteoarthritis'],
    patientNotes:
      'Grandmother experienced frequent frontal headaches during seasonal transitions and weather changes. No formal aura documented.',
    sourceLabel: 'Voice Interview Q5 • Patient Account',
    hasMigraineHistory: true,
    isPatient: false,
    generation: 1,
  },
  {
    id: 'fam-gf-mat',
    name: 'Wei Chen',
    relation: 'Grandparent',
    lineageSide: 'Maternal',
    gender: 'Male',
    age: 86,
    status: 'Living',
    reportedConditions: ['Mild Presbycusis', 'No Neurological Conditions'],
    patientNotes: 'Grandfather has no documented history of recurrent headaches or neurological disease.',
    sourceLabel: 'Voice Interview Q5 • Patient Account',
    hasMigraineHistory: false,
    isPatient: false,
    generation: 1,
  },
  {
    id: 'fam-gp-pat',
    name: 'Paternal Grandparents (Unprovided)',
    relation: 'Grandparent',
    lineageSide: 'Paternal',
    gender: 'Other',
    status: 'Unknown',
    reportedConditions: ['Information Not Provided by Patient'],
    patientNotes:
      'Patient did not have medical records or clinical information regarding paternal grandparents during intake.',
    sourceLabel: 'Unknown Zone Log • Unprovided',
    hasMigraineHistory: false,
    isPatient: false,
    generation: 1,
  },

  // Generation 2: Parents
  {
    id: 'fam-mother',
    name: 'Mei-Ling Chen',
    relation: 'Parent',
    lineageSide: 'Maternal',
    gender: 'Female',
    age: 64,
    status: 'Living',
    reportedConditions: [
      'Unilateral Throbbing Migraine with Photophobia',
      'Mild Essential Hypertension',
    ],
    patientNotes:
      'Mother suffered classic migraine attacks throughout her 30s and 40s with intense nausea and light sensitivity, requiring complete dark room rest. Subsided post-menopause.',
    sourceLabel: 'Voice Interview Q5 & Intake Form',
    hasMigraineHistory: true,
    isPatient: false,
    generation: 2,
  },
  {
    id: 'fam-father',
    name: 'David Chen',
    relation: 'Parent',
    lineageSide: 'Paternal',
    gender: 'Male',
    age: 67,
    status: 'Living',
    reportedConditions: ['Essential Hypertension', 'Dyslipidemia'],
    patientNotes:
      'Father has well-managed hypertension and cholesterol. Never complained of severe headaches or migraines.',
    sourceLabel: 'Patient Intake Form',
    hasMigraineHistory: false,
    isPatient: false,
    generation: 2,
  },

  // Generation 3: Sibling & Patient
  {
    id: 'fam-patient',
    name: 'Aarav Chen',
    relation: 'Patient',
    lineageSide: 'Direct',
    gender: 'Male',
    age: 38,
    status: 'Living',
    reportedConditions: [
      'Recurrent Neurovascular Migraine with Aura',
      'Cardiovagal Dysautonomia',
    ],
    patientNotes:
      'Index Case (Proband). Severe left-sided throbbing hemicrania with scintillating scotoma and photophobia.',
    sourceLabel: 'Patient Direct Clinical Intake • Active Case',
    hasMigraineHistory: true,
    isPatient: true,
    generation: 3,
  },
  {
    id: 'fam-sister',
    name: 'Chloe Chen',
    relation: 'Sibling',
    lineageSide: 'Direct',
    gender: 'Female',
    age: 34,
    status: 'Living',
    reportedConditions: ['No Chronic Conditions Reported'],
    patientNotes:
      'Younger sister has never experienced migraines, aura sensations, or neurological complaints.',
    sourceLabel: 'Voice Interview Q5 • Patient Account',
    hasMigraineHistory: false,
    isPatient: false,
    generation: 3,
  },
]
