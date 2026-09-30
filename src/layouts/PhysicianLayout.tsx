import React, { useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Topbar } from '../components/layout/Topbar'
import { Sidebar } from '../components/layout/Sidebar'
import { useAuth } from '../contexts/AuthContext'
import { useAccessibility } from '../contexts/AccessibilityContext'
import { useLanguage } from '../contexts/LanguageContext'
import { ShieldCheck } from 'lucide-react'

export const PhysicianLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { settings, speakText, announceToScreenReader } = useAccessibility()
  const { t } = useLanguage()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  React.useEffect(() => {
    const pageName = location.pathname.split('/').pop() || 'dashboard'
    const formatted = pageName.charAt(0).toUpperCase() + pageName.slice(1)
    if (settings.voiceGuidanceEnabled) {
      speakText(`Clinical workstation: ${formatted}`)
    } else {
      announceToScreenReader(`Clinical workstation: ${formatted}`)
    }
  }, [location.pathname, settings.voiceGuidanceEnabled, speakText, announceToScreenReader])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Route Protection: If not authenticated or not physician, redirect to physician login
  if (!isAuthenticated || user?.role !== 'physician') {
    return <Navigate to="/physician/login" state={{ from: location }} replace />
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#060b18] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Accessible Skip to Content Link */}
      <a href="#main-content" className="skip-to-content">
        {t('a11y.skipToContent', 'Skip to Main Content')}
      </a>

      <Topbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Clinical Environment Badge Bar */}
      <div className="bg-slate-100 dark:bg-[#081024] text-slate-700 dark:text-slate-300 px-4 py-1.5 text-xs flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">AyuCase Clinical Workstation — Verified Practitioner Session</span>
          <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
            Logged in as {user.name} ({user.fictionalIdentifier})
          </span>
        </div>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main
          id="main-content"
          tabIndex={-1}
          aria-label="Clinical workstation content"
          className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto focus:outline-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={settings.reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={settings.reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: settings.reduceMotion ? 0 : 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
