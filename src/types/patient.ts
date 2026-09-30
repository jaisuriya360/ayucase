export interface VitalSigns {
  heartRate: number
  bloodPressureSys: number
  bloodPressureDia: number
  spO2: number
  temperature: number
  recordedAt: string
}

export interface MedicalTimelineEvent {
  id: string
  title: string
  date: string
  category: 'clinical' | 'medication' | 'lab' | 'narrative' | 'procedure'
  description: string
  physicianNote?: string
  status: 'completed' | 'ongoing' | 'scheduled'
  tags: string[]
}

export interface DocumentItem {
  id: string
  title: string
  category: 'Discharge Summary' | 'Lab Report' | 'Imaging' | 'Prescription' | 'Consent'
  date: string
  fileSize: string
  provider: string
  status: 'Verified' | 'Pending Review'
}

export interface NarrativeStoryChapter {
  id: string
  title: string
  period: string
  summary: string
  symptomsReported: string[]
  lifestyleFactors: string[]
  patientVoiceQuote: string
}

export interface PatientProfile {
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
  vitals: VitalSigns
  timeline: MedicalTimelineEvent[]
  documents: DocumentItem[]
  storyChapters: NarrativeStoryChapter[]
}
