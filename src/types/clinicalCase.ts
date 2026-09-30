export type CasePriority = 'Low' | 'Medium' | 'High' | 'Critical'
export type CaseStatus = 'Triage' | 'Active Review' | 'Synthesized' | 'Completed'
export type QueueFilterStatus = 'All' | 'New' | 'Pending' | 'Priority Review' | 'Completed'

export type InformationStatus =
  | 'Differences Detected'
  | 'Verified'
  | 'Gaps Identified'
  | 'Ready for Physician'
  | 'Pending Records'

export interface DiagnosticInsight {
  id: string
  title: string
  category: 'Correlation' | 'Risk Factor' | 'Drug Interaction' | 'Chronology'
  confidenceScore: number // e.g. 0.94
  summary: string
  suggestedAction: string
}

export interface MedicationItem {
  name: string
  dosage: string
  schedule: string
  verified: boolean
  source: string
}

export interface CaseDocumentItem {
  id: string
  name: string
  type: string
  date: string
  pages: number
  status: 'Verified' | 'Processing'
}

export interface CaseTimelineEvent {
  year: string
  date: string
  title: string
  description: string
  type: 'Consultation' | 'Document' | 'Diagnosis' | 'Admission'
}

export interface CaseContradictionItem {
  title: string
  statement: string
  documentRecord: string
  status: 'Needs Review' | 'Resolved'
}

export interface CaseUnknownItem {
  title: string
  category: string
  impact: string
}

export type AttentionCategory =
  | 'Confirmed'
  | 'Needs Review'
  | 'Incomplete'
  | 'Information Difference'

export interface AttentionItem {
  id: string
  title: string
  category: AttentionCategory
  description: string
  section: string
  source: string
}

export type WhatChangedStatus = 'New' | 'Updated' | 'Unchanged' | 'Missing'

export interface CaseDeltaItem {
  id: string
  category: 'Medication' | 'Telemetry' | 'Imaging' | 'Symptom' | 'Lab' | 'History'
  parameter: string
  previousEncounter: string
  currentEncounter: string
  status: WhatChangedStatus
  clinicalContext: string
  source: string
}

export interface SourceCitation {
  id: string
  title: string
  value: string
  documentName: string
  documentId?: string
  pageNumber?: number
  lineOrSection?: string
  snippet: string
  date: string
  verificationStatus: 'Verified' | 'Self-Report' | 'Derived'
  confidenceScore: number
}

export interface ClinicalCase {
  id: string
  fictionalCaseNumber: string
  patientId: string
  patientName: string
  patientAge: number
  patientGender: string
  bloodGroup: string
  primaryCondition: string
  avatarColor: string
  chiefComplaint: string
  diagnosisSummary: string
  priority: CasePriority
  status: CaseStatus
  queueStatus: 'New' | 'Pending' | 'Priority Review' | 'Completed'
  completeness: number // 0 - 100
  informationStatus: InformationStatus
  lastUpdated: string
  assignedPhysician: string
  insights: DiagnosticInsight[]

  // Structured Case Fields
  hpiStages: Array<{ phase: string; description: string; duration: string }>
  pastMedicalHistory: string[]
  allergies: string[]
  currentMedications: MedicationItem[]
  familyHistorySummary: string
  lifestyleTelemetry: string
  assessmentNotes: string
  physicianPlan: string

  // Confirmation & Review State
  isConfirmed: boolean
  confirmedAt?: string
  confirmedBy?: string
  digitalSignatureHash?: string

  // Intelligence items
  unknownItems: CaseUnknownItem[]
  contradictions: CaseContradictionItem[]
  documents: CaseDocumentItem[]
  timelineEvents: CaseTimelineEvent[]

  // Phase 13 Case Intelligence Upgrades
  attentionItems?: AttentionItem[]
  whatChangedItems?: CaseDeltaItem[]
  sourceCitations?: SourceCitation[]
  previousConsultations?: Array<{
    date: string
    provider: string
    clinic: string
    summary: string
  }>
}

export interface PhysicianDashboardMetrics {
  totalCases: number
  newCases: number
  pendingReview: number
  priorityReview: number
  completed: number
}
