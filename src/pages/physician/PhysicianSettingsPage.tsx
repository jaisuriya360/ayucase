import React, { useState } from 'react'
import { Settings, Shield, Bell, User, Hospital, CheckCircle2, Volume2, RefreshCw, Save } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { usePhysician } from '../../contexts/PhysicianContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

export const PhysicianSettingsPage: React.FC = () => {
  const { physician } = usePhysician()
  const { notifySuccess, notifyInfo } = useNotifications()

  const [pushEnabled, setPushEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState('30s')

  const handleSave = () => {
    notifySuccess('Preferences Saved', 'Clinical workstation configuration updated.')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Practitioner Settings & Workstation Configuration"
        subtitle="Manage clinical verification credentials, notification thresholds, and hospital affiliations."
        breadcrumbs={[
          { label: 'Workstation', href: '/physician/dashboard' },
          { label: 'Settings' },
        ]}
      />

      <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            Practitioner Identity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Clinical license and hospital registry affiliation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={physician.name}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Registration #</label>
              <input
                type="text"
                disabled
                value={physician.registrationNumber}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm font-mono text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Specialty</label>
              <input
                type="text"
                disabled
                value={physician.specialty}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Hospital</label>
              <input
                type="text"
                disabled
                value={physician.hospitalAffiliation}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Clinical Triage Alerts Settings */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            Telemetry & Notification Thresholds
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-500" />
                <span>High Priority Alert Push</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Notify instantly when autonomic dip or telemetry anomaly exceeds clinical threshold.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !pushEnabled
                setPushEnabled(next)
                notifyInfo('Notification Updated', `High priority alerts ${next ? 'enabled' : 'paused'}.`)
              }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer',
                pushEnabled
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent'
              )}
            >
              {pushEnabled ? 'Enabled ✓' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-500" />
                <span>Critical Telemetry Sound Cue</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Play subtle auditory ping when priority review case enters intake queue.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled
                setSoundEnabled(next)
                notifyInfo('Audio Alerts', `Sound cues ${next ? 'enabled' : 'muted'}.`)
              }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer',
                soundEnabled
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent'
              )}
            >
              {soundEnabled ? 'Enabled ✓' : 'Muted'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-indigo-500" />
                <span>Queue Polling Frequency</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Background synchronization frequency for patient document ingestion.
              </p>
            </div>
            <select
              value={refreshInterval}
              onChange={(e) => {
                setRefreshInterval(e.target.value)
                notifyInfo('Polling Updated', `Queue refresh interval set to ${e.target.value}.`)
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="15s">15 Seconds (Rapid)</option>
              <option value="30s">30 Seconds (Default)</option>
              <option value="60s">60 Seconds</option>
              <option value="Manual">Manual Only</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex justify-end">
          <AnimatedButton
            variant="primary"
            size="md"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSave}
          >
            Save Preferences
          </AnimatedButton>
        </div>
      </GlassCard>
    </div>
  )
}
