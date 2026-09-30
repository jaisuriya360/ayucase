import React, { createContext, useContext, useState, useEffect } from 'react'
import type { PatientProfile, VitalSigns, MedicalTimelineEvent, DocumentItem } from '../types/patient'
import { MOCK_PATIENT_PROFILES, DEFAULT_PATIENT } from '../data/mockPatient'
import { useAuth } from './AuthContext'

interface PatientContextType {
  patient: PatientProfile
  setPatient: (patient: PatientProfile) => void
  updateVitals: (vitals: Partial<VitalSigns>) => void
  addTimelineEvent: (event: Omit<MedicalTimelineEvent, 'id'>) => void
  addDocument: (doc: Omit<DocumentItem, 'id'>) => void
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [patient, setPatient] = useState<PatientProfile>(() => {
    if (user && user.role === 'patient' && MOCK_PATIENT_PROFILES[user.id]) {
      return MOCK_PATIENT_PROFILES[user.id]
    }
    return DEFAULT_PATIENT
  })

  // Sync when authenticated patient changes
  useEffect(() => {
    if (user && user.role === 'patient') {
      if (MOCK_PATIENT_PROFILES[user.id]) {
        setPatient(MOCK_PATIENT_PROFILES[user.id])
      } else {
        // Fallback for custom registered demo user
        setPatient({
          ...DEFAULT_PATIENT,
          id: user.id,
          name: user.name,
          fictionalId: user.fictionalIdentifier,
          contactMasked: user.phoneMasked || '+91 9876X-XXXX5',
        })
      }
    }
  }, [user])

  const updateVitals = (newVitals: Partial<VitalSigns>) => {
    setPatient((prev) => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        ...newVitals,
        recordedAt: new Date().toISOString(),
      },
    }))
  }

  const addTimelineEvent = (eventData: Omit<MedicalTimelineEvent, 'id'>) => {
    const newEvent: MedicalTimelineEvent = {
      ...eventData,
      id: `tl-${Date.now()}`,
    }
    setPatient((prev) => ({
      ...prev,
      timeline: [newEvent, ...prev.timeline],
    }))
  }

  const addDocument = (docData: Omit<DocumentItem, 'id'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
    }
    setPatient((prev) => ({
      ...prev,
      documents: [newDoc, ...prev.documents],
    }))
  }

  return (
    <PatientContext.Provider
      value={{
        patient,
        setPatient,
        updateVitals,
        addTimelineEvent,
        addDocument,
      }}
    >
      {children}
    </PatientContext.Provider>
  )
}

export const usePatient = () => {
  const context = useContext(PatientContext)
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider')
  }
  return context
}
