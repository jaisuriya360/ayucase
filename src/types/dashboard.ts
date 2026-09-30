export type JourneyStageId =
  | 'identify'
  | 'consent'
  | 'interview'
  | 'documents'
  | 'story'
  | 'review'

export type StageStatus = 'completed' | 'in_progress' | 'upcoming'

export interface JourneyStage {
  id: JourneyStageId
  label: string
  subtitle: string
  status: StageStatus
  route: string
  stepNumber: number
}

export type NotificationType = 'success' | 'info' | 'warning' | 'alert'

export interface DashboardNotification {
  id: string
  title: string
  message: string
  type: NotificationType
  timestamp: string
  isRead: boolean
  category: 'interview' | 'document' | 'clinical' | 'consent'
  actionRoute?: string
  actionLabel?: string
}

export interface MissingInformationItem {
  id: string
  title: string
  field: string
  category: string
  priority: 'High' | 'Medium' | 'Low'
  impactDescription: string
  actionLabel: string
  actionRoute: string
}

export interface DashboardMetrics {
  caseCompletenessPercent: number
  knownInfoCount: number
  unknownZoneCount: number
  pendingActionsCount: number
}
