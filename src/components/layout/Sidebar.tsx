import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  MessageSquareText,
  FileText,
  Clock,
  BookOpen,
  UserCheck,
  ShieldAlert,
  Users,
  BriefcaseMedical,
  Sparkles,
  Settings,
  Globe2,
  HeartPulse,
  Radio,
  Package,
  Sliders,
  X,
  Activity,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { cn } from '../../utils/cn'

export interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { role, user } = useAuth()
  const { t } = useLanguage()
  const { isElderMode, openA11yModal } = useAccessibility()

  // Prevent background scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const patientLinks: NavItem[] = [
    ...(isElderMode
      ? [{ to: '/patient/elder', label: 'Elder Home (Dedicated)', icon: HeartPulse, badge: 'Active' }]
      : [{ to: '/patient/elder', label: 'Elder Mode Experience', icon: HeartPulse }]),
    { to: '/patient/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/patient/interview', label: t('nav.interview'), icon: MessageSquareText },
    { to: '/patient/documents', label: t('nav.documents'), icon: FileText },
    { to: '/patient/timeline', label: t('nav.timeline'), icon: Clock },
    { to: '/patient/story', label: t('nav.story'), icon: BookOpen },
    { to: '/patient/profile', label: t('nav.profile'), icon: UserCheck },
    { to: '/patient/consent', label: t('nav.consent'), icon: ShieldAlert },
    { to: '/patient/capsule', label: 'Care Capsule', icon: Package, badge: 'Demo' },
    { to: '/patient/language', label: 'Language & Mode', icon: Globe2 },
  ]

  const physicianLinks: NavItem[] = [
    { to: '/physician/dashboard', label: t('nav.physician.dashboard'), icon: LayoutDashboard },
    { to: '/physician/patients', label: t('nav.physician.patients'), icon: Users },
    { to: '/physician/case/CS-1082', label: t('nav.physician.case'), icon: BriefcaseMedical, badge: 'High' },
    { to: '/physician/timeline', label: t('nav.physician.timeline'), icon: Clock },
    { to: '/physician/documents', label: t('nav.physician.documents'), icon: FileText },
    { to: '/physician/intelligence', label: t('nav.physician.intelligence'), icon: Sparkles, badge: 'AI' },
    { to: '/physician/contradictions', label: 'Contradiction Radar', icon: Radio, badge: '3' },
    { to: '/physician/settings', label: t('nav.physician.settings'), icon: Settings },
  ]

  const navLinks = role === 'physician' ? physicianLinks : patientLinks

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4">
      {/* Top: Section Header & Nav Items */}
      <div>
        <div className="px-3 py-2 mb-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {role === 'physician' ? 'Clinical Navigation' : 'Patient Journey'}
            </span>
          </div>
          {user && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {user.name} ({user.fictionalIdentifier})
            </p>
          )}
        </div>

        <nav className="space-y-1.5" aria-label="Sidebar navigation">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all',
                    isElderMode && 'min-h-[52px] text-base font-bold',
                    isActive
                      ? role === 'physician'
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm shadow-cyan-600/25 border border-cyan-500/30 font-semibold'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/20 border border-emerald-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#0c152e] hover:text-slate-900 dark:hover:text-slate-100'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-5 h-5 shrink-0', isElderMode && 'w-6 h-6')} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-white/20 text-current uppercase">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            )
          })}

          {/* Universal Accessibility Controls Trigger */}
          <button
            type="button"
            onClick={() => {
              openA11yModal()
              if (onClose) onClose()
            }}
            className={cn(
              'w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer text-left',
              isElderMode && 'min-h-[52px] text-base font-bold'
            )}
            aria-label="Open Accessibility Controls (Alt + A)"
          >
            <div className="flex items-center gap-3">
              <Sliders className={cn('w-5 h-5 shrink-0 text-cyan-500', isElderMode && 'w-6 h-6')} />
              <span>{t('a11y.openA11y', 'Accessibility')}</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Alt+A
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom: Demo Notice Card */}
      <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Fictional Healthcare Sandbox
          </p>
          <p>Local state only. No actual Aadhaar or medical records stored.</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 glass-card min-h-[calc(100vh-65px)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer with Animated Backdrop & Slide-over */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Slide-out Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-80 max-w-[85vw] h-full bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-slate-200 dark:border-slate-800"
            >
              {/* Drawer Top Header with Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-sm">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
                    AyuCase
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {sidebarContent}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
