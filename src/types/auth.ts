export type UserRole = 'patient' | 'physician'

export interface AuthUser {
  id: string
  role: UserRole
  name: string
  email: string
  avatar?: string
  fictionalIdentifier: string // e.g. PT-DEMO-901 or MD-LIC-4482
  phoneMasked?: string
  abhaDemoId?: string // Fictional demo reference only
}

export interface AuthState {
  user: AuthUser | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface DemoProfile {
  id: string
  name: string
  role: UserRole
  roleTitle: string
  fictionalIdentifier: string
  email: string
  badgeText: string
  avatarColor: string
  description: string
  age?: number
  gender?: string
}
