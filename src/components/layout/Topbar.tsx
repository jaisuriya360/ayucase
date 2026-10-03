import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  Sun,
  Moon,
  Globe,
  LogOut,
  Menu,
  X,
  Sliders,
  ChevronDown,
  User,
  Settings,
  HeartPulse,
  Eye,
  Volume2,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { AyuButton } from '../ui/AyuButton'
import { AyuBadge } from '../ui/AyuBadge'
import { cn } from '../../utils/cn'

export interface TopbarProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, role, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage, availableLanguages, t } = useLanguage()
  const { isElderMode, toggleElderMode, openA11yModal, settings, toggleVoiceGuidance } = useAccessibility()
  const { notifyInfo } = useNotifications()
  const navigate = useNavigate()

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const langMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleLogout = () => {
    setIsUserMenuOpen(false)
    logout()
    notifyInfo('Signed out', 'Session concluded.')
    navigate('/')
  }

  const portalLabel = role === 'physician' ? 'Clinical Workstation' : 'Patient Portal'

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#070d1e]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Mobile Sidebar Trigger + Logo + Portal Identity */}
        <div className="flex items-center gap-3 min-w-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="AyuCase Home">
            <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-100">
                AYUCASE
              </span>
            </div>
          </Link>

          {/* Portal Identity Badge */}
          {user && (
            <div className="hidden sm:flex items-center pl-3 border-l border-slate-200 dark:border-slate-800">
              <AyuBadge
                variant={role === 'physician' ? 'cyan' : 'emerald'}
                size="md"
                dot
              >
                {portalLabel}
              </AyuBadge>
            </div>
          )}
        </div>

        {/* Center: Discreet Demo Environment Indicator (Discreet & Calm) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
          <span>Demo Environment • Simulated Clinical Sandbox</span>
        </div>

        {/* Right: Controls & Preferences */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* ACCESSIBILITY MODAL SHORTCUT */}
          <button
            type="button"
            onClick={openA11yModal}
            className={cn(
              'h-9 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer border',
              settings.highContrast
                ? 'bg-amber-400 text-black border-black font-bold'
                : 'bg-slate-100/70 hover:bg-slate-100 dark:bg-slate-900/70 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800'
            )}
            title="Accessibility Controls (Alt + A)"
            aria-label="Open Accessibility Controls"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="hidden md:inline">Accessibility</span>
          </button>

          {/* LANGUAGE SELECTOR DROPDOWN */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="h-9 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100/70 hover:bg-slate-100 dark:bg-slate-900/70 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              aria-label="Select language"
              aria-haspopup="true"
              aria-expanded={isLangMenuOpen}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="uppercase text-xs font-semibold">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Language
                </div>
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code)
                      setIsLangMenuOpen(false)
                      notifyInfo(`Language switched to ${lang.label}`)
                    }}
                    className={cn(
                      'w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
                      language === lang.code
                        ? 'font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                        : 'text-slate-700 dark:text-slate-300'
                    )}
                  >
                    <span>{lang.nativeLabel}</span>
                    {language === lang.code && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* THEME TOGGLE */}
          <button
            type="button"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 bg-slate-100/70 hover:bg-slate-100 dark:bg-slate-900/70 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* USER ACCOUNT & PREFERENCES MENU */}
          {user ? (
            <div className="relative pl-1 sm:pl-2" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="h-9 px-2.5 sm:px-3 rounded-xl bg-slate-100/70 hover:bg-slate-100 dark:bg-slate-900/70 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                aria-label="User account and preferences"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* User Profile Summary */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                      ID: {user.fictionalIdentifier}
                    </p>
                  </div>

                  {/* Quick Toggles */}
                  <div className="space-y-0.5 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                    {/* Elder Mode Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        toggleElderMode()
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5 text-amber-500" />
                        <span>Elder Mode</span>
                      </div>
                      <span className={cn('text-[11px] font-bold px-1.5 py-0.5 rounded', isElderMode ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'text-slate-400')}>
                        {isElderMode ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    {/* Voice Guidance Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        toggleVoiceGuidance()
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-3.5 h-3.5 text-teal-500" />
                        <span>Voice Assistance</span>
                      </div>
                      <span className={cn('text-[11px] font-bold px-1.5 py-0.5 rounded', settings.voiceGuidanceEnabled ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' : 'text-slate-400')}>
                        {settings.voiceGuidanceEnabled ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    {/* Profile Link */}
                    {role === 'patient' && (
                      <Link
                        to="/patient/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Profile & Preferences</span>
                      </Link>
                    )}

                    {role === 'physician' && (
                      <Link
                        to="/physician/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Workstation Settings</span>
                      </Link>
                    )}
                  </div>

                  {/* Sign Out */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AyuButton to="/patient/login" variant="ghost" size="sm">
                Patient Portal
              </AyuButton>
              <AyuButton to="/physician/login" variant="primary" size="sm">
                Physician Portal
              </AyuButton>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
