import type { ConsentPermissionKey, PermissionState } from './consent'

export interface CapsulePatientProfile {
  id: string
  fictionalId: string
  name: string
  age: number
  gender: string
  bloodGroup: string
  contactMasked: string
  emergencyContact: string
  primaryCondition: string
  allergies: string[]
  currentMedications: string[]
  attendingPhysician: string
}

export interface CapsuleTimelineEvent {
  id: string
  year: string
  date: string
  title: string
  category: string
  description: string
  status: 'Completed' | 'Ongoing' | 'Scheduled'
}

export interface CapsuleStatement {
  id: string
  quote: string
  context: string
  timestamp: string
  modality: 'Voice Recording' | 'Typed Input' | 'Elder Assist'
  verified: boolean
}

export interface CapsuleDocument {
  id: string
  title: string
  category: string
  date: string
  pages: number
  status: 'Verified' | 'Processing'
  extractionScore: number
}

export interface CapsuleConsentStatus {
  permissions: Record<ConsentPermissionKey, PermissionState>
  witnessHash: string
  lastUpdated: string
}

export interface CapsuleMissingItem {
  id: string
  parameter: string
  category: string
  impact: string
  status: 'Pending Patient Sync' | 'Unrecorded'
}

export interface CapsulePhysicianReview {
  reviewStatus: 'Formally Confirmed' | 'Active Review' | 'Pending Review'
  attendingPhysician: string
  specialty: string
  lastReviewedDate: string
  electronicSignatureHash: string
  clinicalImpressionSummary: string
}

export interface CareCapsuleData {
  capsuleId: string
  generatedAt: string
  demoBadge: 'Demo / Prototype Data'
  privacyIndicator: 'Your information is shown in this prototype using fictional data.'
  interoperabilityDisclaimer: 'Notice: AyuCase prototype does not claim interoperability with real medical systems (ABDM, ABHA, or EHR backends).'
  patientProfile: CapsulePatientProfile
  timeline: CapsuleTimelineEvent[]
  patientStatements: CapsuleStatement[]
  documents: CapsuleDocument[]
  consentStatus: CapsuleConsentStatus
  missingInformation: CapsuleMissingItem[]
  physicianReview: CapsulePhysicianReview
}
