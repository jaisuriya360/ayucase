import React from 'react'
import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from './ThemeContext'
import { LanguageProvider } from './LanguageContext'
import { AccessibilityProvider, useAccessibility } from './AccessibilityContext'
import { AuthProvider } from './AuthContext'
import { PatientProvider } from './PatientContext'
import { PhysicianProvider } from './PhysicianContext'
import { NotificationProvider } from './NotificationContext'
import { ConsentProvider } from './ConsentContext'
import { ToastContainer } from '../components/ui/Toast'
import { AccessibilityControlCenterModal } from '../components/accessibility/AccessibilityControlCenterModal'
import { AccessibilityFloatingWidget } from '../components/accessibility/AccessibilityFloatingWidget'

const MotionAndA11yLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useAccessibility()

  return (
    <MotionConfig reducedMotion={settings.reduceMotion ? 'always' : 'user'}>
      {children}
      <AccessibilityControlCenterModal />
      <AccessibilityFloatingWidget />
      <ToastContainer />
    </MotionConfig>
  )
}

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <AccessibilityProvider>
            <AuthProvider>
              <PatientProvider>
                <PhysicianProvider>
                  <ConsentProvider>
                    <MotionAndA11yLayer>
                      {children}
                    </MotionAndA11yLayer>
                  </ConsentProvider>
                </PhysicianProvider>
              </PatientProvider>
            </AuthProvider>
          </AccessibilityProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
