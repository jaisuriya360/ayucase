import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  MessageSquare,
  X,
  CheckCheck,
  Trash2,
  Sparkles,
} from 'lucide-react'
import type { DashboardNotification } from '../../types/dashboard'
import { Modal } from '../ui/Modal'
import { AnimatedButton } from '../ui/AnimatedButton'
import { cn } from '../../utils/cn'

const NOTIFS_STORAGE_KEY = 'ayucase_patient_notifications_v4'

export const INITIAL_NOTIFICATIONS: DashboardNotification[] = [
  {
    id: 'notif-1',
    title: 'Interview completed',
    message: 'Your morning symptom check-in was successfully logged and ingested into narrative synthesis.',
    type: 'success',
    timestamp: '23 Sep 2026, 09:20 AM',
    isRead: false,
    category: 'interview',
    actionRoute: '/patient/interview',
    actionLabel: 'View Interview Logs',
  },
  {
    id: 'notif-2',
    title: 'Document uploaded',
    message: 'Brain MRI 3T Volumetric Protocol.pdf has been verified by clinical OCR and added to records.',
    type: 'info',
    timestamp: '23 Sep 2026, 09:18 AM',
    isRead: false,
    category: 'document',
    actionRoute: '/patient/documents',
    actionLabel: 'Inspect Document',
  },
  {
    id: 'notif-3',
    title: 'Information difference detected',
    message: 'Self-reported migraine prodrome onset preceded nocturnal wearable pulse variability spike by 45 minutes.',
    type: 'alert',
    timestamp: '23 Sep 2026, 08:45 AM',
    isRead: false,
    category: 'clinical',
    actionRoute: '/patient/timeline',
    actionLabel: 'Review Discrepancy',
  },
  {
    id: 'notif-4',
    title: 'Consent updated',
    message: 'Voice Interview and Medical Documents permissions successfully affirmed in the Consent Center.',
    type: 'success',
    timestamp: '23 Sep 2026, 08:30 AM',
    isRead: true,
    category: 'consent',
    actionRoute: '/patient/consent',
    actionLabel: 'View Consent Center',
  },
]

export interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  onNavigate?: (route: string) => void
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<DashboardNotification[]>(() => {
    try {
      const stored = localStorage.getItem(NOTIFS_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as DashboardNotification[]
      }
    } catch (e) {
      console.warn('Failed to parse notifications from localStorage', e)
    }
    return INITIAL_NOTIFICATIONS
  })

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'clinical'>('all')

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(notifications))
    } catch (e) {
      console.warn('Failed to save notifications to localStorage', e)
    }
  }, [notifications])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead
    if (activeTab === 'clinical') return n.category === 'clinical'
    return true
  })

  const getNotifIcon = (type: DashboardNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
      case 'info':
      default:
        return <Sparkles className="w-5 h-5 text-cyan-500 shrink-0" />
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notification Center"
      subtitle={`${unreadCount} unread clinical updates and activity alerts`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Controls Bar: Tabs & Mark All */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                activeTab === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                activeTab === 'unread'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('clinical')}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                activeTab === 'clinical'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              Clinical Alerts
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={markAllAsRead}
              className="px-2.5 py-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 font-semibold"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="px-2.5 py-1 text-slate-400 hover:text-rose-500 flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No notifications to display in this view.
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={cn(
                  'p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 group',
                  n.isRead
                    ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    : 'bg-white dark:bg-slate-900 border-emerald-500/40 dark:border-emerald-500/30 shadow-sm'
                )}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5">{getNotifIcon(n.type)}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={cn(
                          'text-sm font-bold',
                          n.isRead
                            ? 'text-slate-700 dark:text-slate-300'
                            : 'text-slate-900 dark:text-slate-100'
                        )}
                      >
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {n.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {n.message}
                    </p>

                    {n.actionRoute && onNavigate && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(n.id)
                          onClose()
                          onNavigate(n.actionRoute!)
                        }}
                        className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{n.actionLabel || 'View details'} &rarr;</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}
