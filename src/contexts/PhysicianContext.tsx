import React, { createContext, useContext, useState, useEffect } from 'react'
import type { PhysicianProfile } from '../types/physician'
import type {
  ClinicalCase,
  CaseStatus,
  CasePriority,
  PhysicianDashboardMetrics,
} from '../types/clinicalCase'
import { MOCK_PHYSICIANS, DEFAULT_PHYSICIAN } from '../data/mockPhysician'
import { MOCK_CLINICAL_CASES } from '../data/mockCases'
import { useAuth } from './AuthContext'

const PHYSICIAN_CASES_STORAGE_KEY = 'ayucase_physician_cases_v12'

interface PhysicianContextType {
  physician: PhysicianProfile
  cases: ClinicalCase[]
  selectedCase: ClinicalCase | null
  metrics: PhysicianDashboardMetrics
  setSelectedCaseId: (id: string) => void
  updateCaseStatus: (caseId: string, status: CaseStatus) => void
  updateCaseAssessment: (caseId: string, notes: string, plan: string) => void
  updateCasePriority: (caseId: string, priority: CasePriority) => void
  confirmCase: (caseId: string) => void
  reviewCase: (caseId: string) => void
  resetDemoCases: () => void
}

const PhysicianContext = createContext<PhysicianContextType | undefined>(undefined)

export const PhysicianProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [physician, setPhysician] = useState<PhysicianProfile>(() => {
    if (user && user.role === 'physician' && MOCK_PHYSICIANS[user.id]) {
      return MOCK_PHYSICIANS[user.id]
    }
    return DEFAULT_PHYSICIAN
  })

  const [cases, setCases] = useState<ClinicalCase[]>(() => {
    try {
      const stored = localStorage.getItem(PHYSICIAN_CASES_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (e) {
      console.warn('Failed to parse physician cases from localStorage', e)
    }
    return MOCK_CLINICAL_CASES
  })

  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-1082')

  useEffect(() => {
    if (user && user.role === 'physician' && MOCK_PHYSICIANS[user.id]) {
      setPhysician(MOCK_PHYSICIANS[user.id])
    }
  }, [user])

  // Persist cases on update
  useEffect(() => {
    try {
      localStorage.setItem(PHYSICIAN_CASES_STORAGE_KEY, JSON.stringify(cases))
    } catch (e) {
      console.warn('Failed to persist physician cases', e)
    }
  }, [cases])

  const selectedCase =
    cases.find((c) => c.id === selectedCaseId || c.fictionalCaseNumber === selectedCaseId) || cases[0]

  const updateCaseStatus = (caseId: string, status: CaseStatus) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId || c.fictionalCaseNumber === caseId) {
          let queueStatus = c.queueStatus
          if (status === 'Completed') queueStatus = 'Completed'
          else if (status === 'Active Review') queueStatus = 'Priority Review'
          else if (status === 'Synthesized') queueStatus = 'Pending'
          return { ...c, status, queueStatus, lastUpdated: new Date().toISOString() }
        }
        return c
      })
    )
  }

  const updateCaseAssessment = (caseId: string, notes: string, plan: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId || c.fictionalCaseNumber === caseId) {
          return {
            ...c,
            assessmentNotes: notes,
            physicianPlan: plan,
            lastUpdated: new Date().toISOString(),
          }
        }
        return c
      })
    )
  }

  const updateCasePriority = (caseId: string, priority: CasePriority) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId || c.fictionalCaseNumber === caseId) {
          const queueStatus =
            priority === 'High' || priority === 'Critical' ? 'Priority Review' : c.queueStatus
          return { ...c, priority, queueStatus, lastUpdated: new Date().toISOString() }
        }
        return c
      })
    )
  }

  const confirmCase = (caseId: string) => {
    const timestamp = new Date().toISOString()
    const mockHash = '0x' + Math.random().toString(16).substring(2, 10) + Date.now().toString(16).substring(4)
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId || c.fictionalCaseNumber === caseId) {
          return {
            ...c,
            status: 'Completed',
            queueStatus: 'Completed',
            isConfirmed: true,
            confirmedAt: timestamp,
            confirmedBy: physician.name,
            digitalSignatureHash: mockHash,
            lastUpdated: timestamp,
          }
        }
        return c
      })
    )
  }

  const reviewCase = (caseId: string) => {
    const timestamp = new Date().toISOString()
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId || c.fictionalCaseNumber === caseId) {
          return {
            ...c,
            status: 'Active Review',
            queueStatus: 'Pending',
            lastUpdated: timestamp,
          }
        }
        return c
      })
    )
  }

  const resetDemoCases = () => {
    setCases(MOCK_CLINICAL_CASES)
    localStorage.removeItem(PHYSICIAN_CASES_STORAGE_KEY)
  }

  // Calculate dynamic metrics
  const metrics: PhysicianDashboardMetrics = {
    totalCases: cases.length,
    newCases: cases.filter((c) => c.queueStatus === 'New').length,
    pendingReview: cases.filter((c) => c.queueStatus === 'Pending').length,
    priorityReview: cases.filter((c) => c.queueStatus === 'Priority Review').length,
    completed: cases.filter((c) => c.queueStatus === 'Completed').length,
  }

  return (
    <PhysicianContext.Provider
      value={{
        physician,
        cases,
        selectedCase,
        metrics,
        setSelectedCaseId,
        updateCaseStatus,
        updateCaseAssessment,
        updateCasePriority,
        confirmCase,
        reviewCase,
        resetDemoCases,
      }}
    >
      {children}
    </PhysicianContext.Provider>
  )
}

export const usePhysician = () => {
  const context = useContext(PhysicianContext)
  if (!context) {
    throw new Error('usePhysician must be used within a PhysicianProvider')
  }
  return context
}
