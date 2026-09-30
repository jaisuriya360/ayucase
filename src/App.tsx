import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import { RootLayout } from './layouts/RootLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { PatientLayout } from './layouts/PatientLayout'
import { PhysicianLayout } from './layouts/PhysicianLayout'

// Public & Landing
import { LandingPage } from './pages/landing/LandingPage'

// Patient Pages
import { PatientLoginPage } from './pages/patient/PatientLoginPage'
import { PatientRegisterPage } from './pages/patient/PatientRegisterPage'
import { PatientLanguagePage } from './pages/patient/PatientLanguagePage'
import { PatientDashboardPage } from './pages/patient/PatientDashboardPage'
import { PatientInterviewPage } from './pages/patient/PatientInterviewPage'
import { PatientDocumentsPage } from './pages/patient/PatientDocumentsPage'
import { PatientTimelinePage } from './pages/patient/PatientTimelinePage'
import { PatientStoryPage } from './pages/patient/PatientStoryPage'
import { PatientProfilePage } from './pages/patient/PatientProfilePage'
import { PatientConsentPage } from './pages/patient/PatientConsentPage'
import { PatientElderHomePage } from './pages/patient/PatientElderHomePage'
import { PatientCareCapsulePage } from './pages/patient/PatientCareCapsulePage'

// Physician Pages
import { PhysicianLoginPage } from './pages/physician/PhysicianLoginPage'
import { PhysicianDashboardPage } from './pages/physician/PhysicianDashboardPage'
import { PhysicianPatientsPage } from './pages/physician/PhysicianPatientsPage'
import { PhysicianCaseDetailPage } from './pages/physician/PhysicianCaseDetailPage'
import { PhysicianTimelinePage } from './pages/physician/PhysicianTimelinePage'
import { PhysicianDocumentsPage } from './pages/physician/PhysicianDocumentsPage'
import { PhysicianIntelligencePage } from './pages/physician/PhysicianIntelligencePage'
import { PhysicianContradictionRadarPage } from './pages/physician/PhysicianContradictionRadarPage'
import { PhysicianSettingsPage } from './pages/physician/PhysicianSettingsPage'

export function App() {
  return (
    <Routes>
      {/* Public Landing Portal */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Entry & Authentication Experience */}
      <Route element={<AuthLayout />}>
        <Route path="/patient/login" element={<PatientLoginPage />} />
        <Route path="/patient/register" element={<PatientRegisterPage />} />
        <Route path="/patient/language" element={<PatientLanguagePage />} />
        <Route path="/physician/login" element={<PhysicianLoginPage />} />
      </Route>

      {/* Protected Patient Portal */}
      <Route path="/patient" element={<PatientLayout />}>
        <Route path="dashboard" element={<PatientDashboardPage />} />
        <Route path="interview" element={<PatientInterviewPage />} />
        <Route path="documents" element={<PatientDocumentsPage />} />
        <Route path="timeline" element={<PatientTimelinePage />} />
        <Route path="story" element={<PatientStoryPage />} />
        <Route path="profile" element={<PatientProfilePage />} />
        <Route path="consent" element={<PatientConsentPage />} />
        <Route path="capsule" element={<PatientCareCapsulePage />} />
        <Route path="elder" element={<PatientElderHomePage />} />
      </Route>

      {/* Protected Physician Clinical Workstation */}
      <Route path="/physician" element={<PhysicianLayout />}>
        <Route path="dashboard" element={<PhysicianDashboardPage />} />
        <Route path="patients" element={<PhysicianPatientsPage />} />
        <Route path="case/:id" element={<PhysicianCaseDetailPage />} />
        <Route path="timeline" element={<PhysicianTimelinePage />} />
        <Route path="documents" element={<PhysicianDocumentsPage />} />
        <Route path="intelligence" element={<PhysicianIntelligencePage />} />
        <Route path="contradictions" element={<PhysicianContradictionRadarPage />} />
        <Route path="radar" element={<Navigate to="/physician/contradictions" replace />} />
        <Route path="settings" element={<PhysicianSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
