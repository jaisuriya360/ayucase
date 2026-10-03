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
  ShieldCheck,
  Users,
  BriefcaseMedical,
  Sparkles,
  Settings,
  HeartPulse,
  Radio,
  Package,
  Sliders,
  X,
  Activity,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { cn } from '../../utils/cn'

export interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

interface NavGroup {
  groupLabel?: string
  items: {
    to: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
    badgeVariant?: 'emerald' | 'cyan' | 'amber' | 'indigo' | 'rose'
  }[]
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { role, user } = useAuth()
  const { t } = useLanguage()
  const { isElderMode, openA11yModal } = useAccessibility()

  // Prevent background scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && onClose) {
          onClose()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const patientGroups: NavGroup[] = [
    {
      groupLabel: 'Care Overview',
      items: [
        { to: '/patient/dashboard', label: t('nav.dashboard', 'Overview'), icon: LayoutDashboard },
        { to: '/patient/story', label: t('nav.story', 'My Health Story'), icon: BookOpen },
        { to: '/patient/timeline', label: t('nav.timeline', 'Health Timeline'), icon: Clock },
        { to: '/patient/interview', label: t('nav.interview', 'Clinical Interview'), icon: MessageSquareText },
        { to: '/patient/documents', label: t('nav.documents', 'Documents'), icon: FileText },
        { to: '/patient/capsule', label: 'Care Capsule', icon: Package, badge: 'Dossier', badgeVariant: 'emerald' },
      ],
    },
    {
      groupLabel: 'Support & Family',
      items: [
        { to: '/patient/timeline?filter=family', label: 'Family Health', icon: Users },
        {
          to: '/patient/elder',
          label: 'Elder Support',
          icon: HeartPulse,
          badge: isElderMode ? 'Active' : undefined,
          badgeVariant: 'amber',
        },
      ],
    },
    {
      groupLabel: 'Account & Autonomy',
      items: [
        { to: '/patient/consent', label: t('nav.consent', 'Consent & Privacy'), icon: ShieldCheck },
        { to: '/patient/profile', label: t('nav.profile', 'Patient Profile'), icon: UserCheck },
      ],
    },
  ]

  const physicianGroups: NavGroup[] = [
    {
      groupLabel: 'Clinical Practice',
      items: [
        { to: '/physician/dashboard', label: t('nav.physician.dashboard', 'Dashboard'), icon: LayoutDashboard },
        { to: '/physician/patients', label: t('nav.physician.patients', 'Patients'), icon: Users },
        { to: '/physician/case/CS-1082', label: t('nav.physician.case', 'Clinical Cases'), icon: BriefcaseMedical, badge: 'Active', badgeVariant: 'cyan' },
        { to: '/physician/timeline', label: t('nav.physician.timeline', 'Timeline'), icon: Clock },
        { to: '/physician/documents', label: t('nav.physician.documents', 'Documents'), icon: FileText },
      ],
    },
    {
      groupLabel: 'Clinical Intelligence',
      items: [
        { to: '/physician/intelligence', label: t('nav.physician.intelligence', 'Intelligence Suite'), icon: Sparkles, badge: 'Insights', badgeVariant: 'indigo' },
        { to: '/physician/contradictions', label: 'Contradiction Radar', icon: Radio, badge: '3 Gaps', badgeVariant: 'amber' },
      ],
    },
    {
      groupLabel: 'Preferences',
      items: [
        { to: '/physician/settings', label: t('nav.physician.settings', 'Settings & Protocols'), icon: Settings },
      ],
    },
  ]

  const navGroups = role === 'physician' ? physicianGroups : patientGroups

  const renderBadge = (badge?: string, variant?: 'emerald' | 'cyan' | 'amber' | 'indigo' | 'rose') => {
    if (!badge) return null
    const colorStyles = {
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800',
      amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
      rose: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    }[variant || 'emerald']

    return (
      <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-md border shrink-0', colorStyles)}>
        {badge}
      </span>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 overflow-y-auto">
      {/* Top: Section Header & Nav Groups */}
      <div className="space-y-6">
        {/* User Identity Context Bar */}
        <div className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {role === 'physician' ? 'Clinical Workstation' : 'Patient Health Space'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
          </div>
          {user && (
            <div className="mt-1.5 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                ID: {user.fictionalIdentifier}
              </p>
            </div>
          )}
        </div>

        {/* Grouped Navigation */}
        <nav className="space-y-5" aria-label="Sidebar navigation">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {group.groupLabel && (
                <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.groupLabel}
                </div>
              )}
              {group.items.map((link) => {
                const Icon = link.icon
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all select-none',
                        isElderMode && 'min-h-[50px] text-base font-bold',
                        isActive
                          ? 'bg-emerald-50/80 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Subtle left accent bar */}
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-emerald-600 dark:bg-emerald-400" />
                        )}

                        <div className="flex items-center gap-3 min-w-0 flex-1 pl-1">
                          <Icon
                            className={cn(
                              'w-4.5 h-4.5 shrink-0 transition-colors',
                              isActive
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                            )}
                          />
                          <span className="truncate">{link.label}</span>
                        </div>

                        {renderBadge(link.badge, link.badgeVariant)}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom: Quick Preferences & A11y Shortcut */}
      <div className="pt-4 mt-6 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
        <button
          type="button"
          onClick={openA11yModal}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="font-medium">Accessibility Controls</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Alt+A</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          'hidden lg:block w-64 shrink-0 h-[calc(100vh-65px)] sticky top-[65px]',
          'bg-white/95 dark:bg-[#070d1e]/95 backdrop-blur-md',
          'border-r border-slate-200/80 dark:border-slate-800/80 z-20'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
              aria-hidden="true"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-[#070d1e] border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                    AYUCASE
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto">
                {sidebarContent}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
