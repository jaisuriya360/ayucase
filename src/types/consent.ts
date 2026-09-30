export type ConsentPermissionKey =
  | 'voiceInterview'
  | 'medicalDocuments'
  | 'healthHistory'
  | 'caseSharing'

export type PermissionState = 'Not Granted' | 'Granted' | 'Revoked'

export interface ConsentPermissionItem {
  key: ConsentPermissionKey
  title: string
  subtitle: string
  description: string
  category: string
  isRequired: boolean
  clinicalImpactNotice: string
  iconName: 'Mic' | 'FileText' | 'Clock' | 'Users'
}

export interface ConsentHistoryEntry {
  id: string
  date: string // e.g. '23 Sep 2026'
  permissionKey: ConsentPermissionKey
  permissionTitle: string
  action: 'Granted' | 'Revoked' | 'Reset'
  timestamp: string // ISO string
  actor: string // e.g. 'Patient (Aarav Chen)'
  hash: string // fictional verification token
  notes?: string
}

export interface ConsentCenterState {
  permissions: Record<ConsentPermissionKey, PermissionState>
  history: ConsentHistoryEntry[]
  lastUpdated: string
  witnessFictionalHash: string
}
