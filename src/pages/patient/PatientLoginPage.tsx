import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HeartPulse,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { DEMO_PATIENT_PROFILES } from '../../data/mockProfiles'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

export const PatientLoginPage: React.FC = () => {
  const { loginAsPatient, isLoading } = useAuth()
  const { t } = useLanguage()
  const { notifySuccess } = useNotifications()
  const navigate = useNavigate()

  const [selectedProfileId, setSelectedProfileId] = useState<string>('demo-pt-1')
  const [customId, setCustomId] = useState<string>('')

  const handleLogin = async (profileId: string) => {
    const user = await loginAsPatient(profileId)
    notifySuccess(`Welcome, ${user.name}!`, 'Demo patient session started.')
    // As instructed by Phase 2: After patient login -> Language Selection
    navigate('/patient/language')
  }

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = await loginAsPatient(selectedProfileId)
    notifySuccess(`Welcome, ${user.name}!`, 'Demo session verified.')
    navigate('/patient/language')
  }

  return (
    <div className="w-full">
      <GlassCard variant="elevated" className="p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-3 shadow-md shadow-emerald-500/10">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t('auth.patient.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {t('auth.patient.subtitle')}
          </p>

          {/* Privacy reassurance pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Fictional Sandbox — Zero Real Aadhaar/ABHA Data Requested</span>
          </div>
        </div>

        {/* Quick Demo Profiles Grid */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            {t('auth.patient.quickSelect')}
          </label>

          <div className="space-y-2.5">
            {DEMO_PATIENT_PROFILES.map((profile) => {
              const isSelected = selectedProfileId === profile.id
              return (
                <div
                  key={profile.id}
                  onClick={() => setSelectedProfileId(profile.id)}
                  className={cn(
                    'p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3',
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0',
                        profile.avatarColor
                      )}
                    >
                      {profile.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {profile.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono font-medium">
                          {profile.fictionalIdentifier}
                        </span>
                        {profile.age && (
                          <span className="text-xs text-slate-400">
                            ({profile.age}y, {profile.gender})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-sm">
                        {profile.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {profile.badgeText}
                    </span>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border flex items-center justify-center',
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      )}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action button */}
          <div className="pt-4">
            <AnimatedButton
              variant="primary"
              size="lg"
              className="w-full text-base font-bold shadow-lg shadow-emerald-500/20"
              isLoading={isLoading}
              onClick={() => handleLogin(selectedProfileId)}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t('auth.patient.loginBtn')}
            </AnimatedButton>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative px-3 bg-white dark:bg-slate-900 text-xs text-slate-400 font-medium">
            Demo Registration
          </span>
        </div>

        {/* Register footer */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          <span>{t('auth.patient.noAccount')} </span>
          <Link
            to="/patient/register"
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {t('auth.patient.registerLink')}
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
