import React, { createContext, useContext, useState, useEffect } from 'react'
import type {
  ConsentPermissionKey,
  PermissionState,
  ConsentHistoryEntry,
  ConsentCenterState,
} from '../types/consent'
import { useAuth } from './AuthContext'

interface ConsentContextType {
  permissions: Record<ConsentPermissionKey, PermissionState>
  history: ConsentHistoryEntry[]
  grantPermission: (key: ConsentPermissionKey) => void
  withdrawPermission: (key: ConsentPermissionKey, reason?: string) => void
  resetPermission: (key: ConsentPermissionKey, reason?: string) => void
  setPermissionState: (key: ConsentPermissionKey, state: PermissionState, reason?: string) => void
  grantAll: () => void
  withdrawAll: (reason?: string) => void
  resetAll: (reason?: string) => void
  isRequiredConsentGranted: boolean
  isConsentComplete: boolean
  lastUpdated: string
  witnessFictionalHash: string
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined)

const CONSENT_STORAGE_KEY = 'ayucase_consent_center_v3'

// Initial pre-populated history milestones mandated by Phase 3
const INITIAL_HISTORY: ConsentHistoryEntry[] = [
  {
    id: 'ch-init-1',
    date: '23 Sep 2026',
    permissionKey: 'voiceInterview',
    permissionTitle: 'Voice Interview',
    action: 'Granted',
    timestamp: '2026-09-23T09:15:00Z',
    actor: 'Patient (Self)',
    hash: '0x8F4B...99A1',
    notes: 'Granted during guided vocal symptom check-in setup.',
  },
  {
    id: 'ch-init-2',
    date: '23 Sep 2026',
    permissionKey: 'medicalDocuments',
    permissionTitle: 'Medical Documents',
    action: 'Granted',
    timestamp: '2026-09-23T09:16:30Z',
    actor: 'Patient (Self)',
    hash: '0x3C7E...41D0',
    notes: 'Authorized diagnostic report parsing and OCR verification.',
  },
]

const DEFAULT_STATE: ConsentCenterState = {
  permissions: {
    voiceInterview: 'Granted',
    medicalDocuments: 'Granted',
    healthHistory: 'Not Granted',
    caseSharing: 'Not Granted',
  },
  history: INITIAL_HISTORY,
  lastUpdated: '2026-09-23T09:16:30Z',
  witnessFictionalHash: '0x8F4B...99A1',
}

export const ConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()

  const [state, setState] = useState<ConsentCenterState>(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as ConsentCenterState
      }
    } catch (e) {
      console.warn('Failed to load consent center state from localStorage', e)
    }
    return DEFAULT_STATE
  })

  useEffect(() => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.warn('Failed to persist consent center state', e)
    }
  }, [state])

  const getPermissionTitle = (key: ConsentPermissionKey): string => {
    switch (key) {
      case 'voiceInterview':
        return 'Voice Interview'
      case 'medicalDocuments':
        return 'Medical Documents'
      case 'healthHistory':
        return 'Health History'
      case 'caseSharing':
        return 'Case Sharing'
    }
  }

  const createHistoryEntry = (
    key: ConsentPermissionKey,
    action: 'Granted' | 'Revoked' | 'Reset',
    notes?: string
  ): ConsentHistoryEntry => {
    const now = new Date()
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(now)

    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase()

    return {
      id: `ch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: formattedDate,
      permissionKey: key,
      permissionTitle: getPermissionTitle(key),
      action,
      timestamp: now.toISOString(),
      actor: user ? `Patient (${user.name})` : 'Patient (Self)',
      hash: `0x${randomHex}...DEMO`,
      notes: notes || (action === 'Granted' ? 'Consent affirmed digitally.' : 'Consent withdrawn by patient.'),
    }
  }

  const grantPermission = (key: ConsentPermissionKey) => {
    const entry = createHistoryEntry(key, 'Granted')
    setState((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: 'Granted',
      },
      history: [entry, ...prev.history],
      lastUpdated: new Date().toISOString(),
      witnessFictionalHash: entry.hash,
    }))
  }

  const withdrawPermission = (key: ConsentPermissionKey, reason?: string) => {
    const entry = createHistoryEntry(key, 'Revoked', reason)
    setState((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: 'Revoked',
      },
      history: [entry, ...prev.history],
      lastUpdated: new Date().toISOString(),
      witnessFictionalHash: entry.hash,
    }))
  }

  const resetPermission = (key: ConsentPermissionKey, reason?: string) => {
    const entry = createHistoryEntry(key, 'Reset', reason || 'Permission reset to Not Granted.')
    setState((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: 'Not Granted',
      },
      history: [entry, ...prev.history],
      lastUpdated: new Date().toISOString(),
      witnessFictionalHash: entry.hash,
    }))
  }

  const setPermissionState = (key: ConsentPermissionKey, permState: PermissionState, reason?: string) => {
    if (permState === 'Granted') {
      grantPermission(key)
    } else if (permState === 'Revoked') {
      withdrawPermission(key, reason)
    } else {
      resetPermission(key, reason)
    }
  }

  const grantAll = () => {
    const keys: ConsentPermissionKey[] = [
      'voiceInterview',
      'medicalDocuments',
      'healthHistory',
      'caseSharing',
    ]
    const newEntries = keys
      .filter((k) => state.permissions[k] !== 'Granted')
      .map((k) => createHistoryEntry(k, 'Granted', 'Bulk consent granted.'))

    setState((prev) => ({
      ...prev,
      permissions: {
        voiceInterview: 'Granted',
        medicalDocuments: 'Granted',
        healthHistory: 'Granted',
        caseSharing: 'Granted',
      },
      history: [...newEntries, ...prev.history],
      lastUpdated: new Date().toISOString(),
      witnessFictionalHash: newEntries[0]?.hash || prev.witnessFictionalHash,
    }))
  }

  const withdrawAll = (reason?: string) => {
    const keys: ConsentPermissionKey[] = [
      'voiceInterview',
      'medicalDocuments',
      'healthHistory',
      'caseSharing',
    ]
    const newEntries = keys
      .filter((k) => state.permissions[k] === 'Granted')
      .map((k) => createHistoryEntry(k, 'Revoked', reason || 'Bulk consent withdrawn.'))

    setState((prev) => ({
      ...prev,
      permissions: {
        voiceInterview: 'Revoked',
        medicalDocuments: 'Revoked',
        healthHistory: 'Revoked',
        caseSharing: 'Revoked',
      },
      history: [...newEntries, ...prev.history],
      lastUpdated: new Date().toISOString(),
      witnessFictionalHash: newEntries[0]?.hash || prev.witnessFictionalHash,
    }))
  }

  const resetAll = (reason?: string) => {
    const keys: ConsentPermissionKey[] = [
      'voiceInterview',
      'medicalDocuments',
      'healthHistory',
      'caseSharing',
    ]
    const newEntries = keys.map((k) =>
      createHistoryEntry(k, 'Reset', reason || 'Bulk reset of permissions to Not Granted.')
    )

    setState((prev) => ({
      ...prev,
      permissions: {
        voiceInterview: 'Not Granted',
        medicalDocuments: 'Not Granted',
        healthHistory: 'Not Granted',
        caseSharing: 'Not Granted',
      },
      history: [...newEntries, ...prev.history],
      lastUpdated: new Date().toISOString(),
      witnessFictionalHash: newEntries[0]?.hash || prev.witnessFictionalHash,
    }))
  }

  // Required consents check: Voice Interview and Medical Documents (or any 2 granted)
  const isRequiredConsentGranted =
    state.permissions.voiceInterview === 'Granted' &&
    state.permissions.medicalDocuments === 'Granted'

  return (
    <ConsentContext.Provider
      value={{
        permissions: state.permissions,
        history: state.history,
        grantPermission,
        withdrawPermission,
        resetPermission,
        setPermissionState,
        grantAll,
        withdrawAll,
        resetAll,
        isRequiredConsentGranted,
        isConsentComplete: isRequiredConsentGranted,
        lastUpdated: state.lastUpdated,
        witnessFictionalHash: state.witnessFictionalHash,
      }}
    >
      {children}
    </ConsentContext.Provider>
  )
}

export const useConsent = () => {
  const context = useContext(ConsentContext)
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider')
  }
  return context
}
