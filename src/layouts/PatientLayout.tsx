import React, { useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Topbar } from '../components/layout/Topbar'
import { Sidebar } from '../components/layout/Sidebar'
import { useAuth } from '../contexts/AuthContext'
import { useAccessibility } from '../contexts/AccessibilityContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Eye, Volume2 } from 'lucide-react'

export const PatientLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isElderMode, toggleElderMode, speakText, settings, announceToScreenReader } = useAccessibility()
  const { t } = useLanguage()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Voice guidance announcement on route transition
  React.useEffect(() => {
    const pageName = location.pathname.split('/').pop() || 'dashboard'
    const formatted = pageName.charAt(0).toUpperCase() + pageName.slice(1)
    if (settings.voiceGuidanceEnabled) {
      speakText(`Navigated to ${formatted}`)
    } else {
      announceToScreenReader(`Navigated to ${formatted}`)
    }
  }, [location.pathname, settings.voiceGuidanceEnabled, speakText, announceToScreenReader])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Route Protection: If not authenticated or not patient, redirect to patient login
  if (!isAuthenticated || user?.role !== 'patient') {
    return <Navigate to="/patient/login" state={{ from: location }} replace />
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

      {/* Elder Mode Notification Bar */}
      {isElderMode && (
        <div className="bg-amber-400 dark:bg-amber-500 text-slate-950 px-4 py-2 text-xs sm:text-sm font-bold flex items-center justify-between border-b-2 border-slate-950">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 shrink-0" />
            <span>{t('elder.banner')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => speakText(t('elder.banner'))}
              className="p-1 rounded bg-black/10 hover:bg-black/20 cursor-pointer"
              title="Read banner"
              aria-label="Read banner aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleElderMode}
              className="underline hover:text-slate-800 ml-2 cursor-pointer font-bold"
            >
              {t('elder.switchToStandard')}
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main
          id="main-content"
          tabIndex={-1}
          aria-label="Patient workspace content"
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
