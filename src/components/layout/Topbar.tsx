import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  Sun,
  Moon,
  Globe,
  LogOut,
  Menu,
  X,
  Volume2,
  Eye,
  ShieldCheck,
  ChevronDown,
  Sliders,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { AnimatedButton } from '../ui/AnimatedButton'
import { cn } from '../../utils/cn'

export interface TopbarProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, role, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage, availableLanguages, t } = useLanguage()
  const { isElderMode, toggleElderMode, speakText, openA11yModal, settings } = useAccessibility()
  const { notifyInfo } = useNotifications()
  const navigate = useNavigate()

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    notifyInfo('Signed out successfully', 'You have exited the demo environment.')
    navigate('/')
  }

  const handleModeToggle = () => {
    toggleElderMode()
    const nextMode = !isElderMode ? 'Elder Mode' : 'Standard Mode'
    notifyInfo(`Switched to ${nextMode}`, !isElderMode ? 'Simplified large-button interface active.' : 'Standard clinical metrics active.')
    if (!isElderMode) {
      speakText('முதியோர் பயன்முறை இயக்கப்பட்டது. Elder Mode activated.')
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full glass-card border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Mobile trigger & Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group" aria-label="AyuCase Home">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-slate-100">
                  {t('brand.name')}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  DEMO
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center / Right: Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* ACCESSIBILITY CONTROL CENTER BUTTON */}
          <button
            type="button"
            onClick={openA11yModal}
            className={cn(
              'px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer border',
              settings.highContrast
                ? 'bg-yellow-400 text-black border-black font-extrabold'
                : 'glass-pill text-slate-700 dark:text-slate-300 hover:border-cyan-400/60'
            )}
            title="Open Accessibility Controls (Alt + A)"
            aria-label="Open Accessibility Controls (Alt + A)"
          >
            <Sliders className="w-4 h-4 text-cyan-500" />
            <span className="hidden sm:inline">{t('nav.a11y', 'A11y')}</span>
          </button>

          {/* ELDER MODE TOGGLE BUTTON */}
          <button
            type="button"
            onClick={handleModeToggle}
            className={cn(
              'px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer',
              isElderMode
                ? 'bg-amber-500 text-slate-950 border-2 border-slate-950 shadow-[0_2px_0_0_#0f172a]'
                : 'glass-pill text-slate-700 dark:text-slate-300 hover:border-amber-400/60'
            )}
            title="Toggle Elder Mode (Simplified, high-contrast, large touch targets)"
            aria-label="Toggle Elder Mode"
            aria-pressed={isElderMode}
          >
            <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden md:inline">
              {isElderMode ? 'Elder Mode: ON' : 'Elder Mode'}
            </span>
          </button>

          {/* Voice Prompt trigger if in Elder Mode or Voice Guidance active */}
          {(isElderMode || settings.voiceGuidanceEnabled) && (
            <button
              type="button"
              onClick={() => speakText('ஆயுகேஸ் குரல் வழிகாட்டி. AyuCase voice assistance active.')}
              aria-label="Play voice guidance"
              className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 hover:scale-105 transition-transform cursor-pointer"
              title="Voice Guidance"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}

          {/* LANGUAGE SELECTOR */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="glass-pill px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Change language"
              aria-haspopup="true"
              aria-expanded={isLangMenuOpen}
            >
              <Globe className="w-4 h-4 text-emerald-500" />
              <span className="uppercase font-bold text-xs">{language}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-card-elevated bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Languages (மொழிகள்)
                  </div>
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code)
                        setIsLangMenuOpen(false)
                        notifyInfo(`Language: ${lang.label} (${lang.nativeLabel})`)
                      }}
                      className={cn(
                        'w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
                        language === lang.code
                          ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                          : 'text-slate-700 dark:text-slate-300'
                      )}
                    >
                      <span>{lang.nativeLabel}</span>
                      <span className="text-xs text-slate-400">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* THEME TOGGLE */}
          <button
            type="button"
            onClick={toggleTheme}
            className="glass-pill p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {/* USER INFO & LOGOUT */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  {user.fictionalIdentifier}
                </span>
              </div>

              <AnimatedButton
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-2"
                title={t('common.logout')}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">{t('common.logout')}</span>
              </AnimatedButton>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AnimatedButton to="/patient/login" variant="ghost" size="sm">
                {t('landing.patientPortal')}
              </AnimatedButton>
              <AnimatedButton to="/physician/login" variant="primary" size="sm">
                {t('landing.physicianPortal')}
              </AnimatedButton>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
