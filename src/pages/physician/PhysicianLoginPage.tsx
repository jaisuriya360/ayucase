import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Building2,
  Award,
} from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { DEMO_PHYSICIAN_PROFILES } from '../../data/mockProfiles'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { cn } from '../../utils/cn'

export const PhysicianLoginPage: React.FC = () => {
  const { loginAsPhysician, isLoading } = useAuth()
  const { t } = useLanguage()
  const { notifySuccess } = useNotifications()
  const navigate = useNavigate()

  const [selectedProfileId, setSelectedProfileId] = useState<string>('demo-md-1')

  const handleLogin = async (profileId: string) => {
    const user = await loginAsPhysician(profileId)
    notifySuccess(`Clinical Access Verified`, `Welcome back, ${user.name}!`)
    navigate('/physician/dashboard')
  }

  return (
    <div className="w-full">
      <GlassCard variant="elevated" className="p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-3 shadow-md shadow-indigo-500/10">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t('auth.physician.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {t('auth.physician.subtitle')}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            <span>Fictional Clinical Workstation Demo — Local Simulation</span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            {t('auth.physician.quickSelect')}
          </label>

          <div className="space-y-3">
            {DEMO_PHYSICIAN_PROFILES.map((profile) => {
              const isSelected = selectedProfileId === profile.id
              return (
                <div
                  key={profile.id}
                  onClick={() => setSelectedProfileId(profile.id)}
                  className={cn(
                    'p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3',
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
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
                      {profile.name.charAt(4) || 'D'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {profile.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono font-medium">
                          {profile.fictionalIdentifier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-sm">
                        {profile.roleTitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {profile.badgeText}
                    </span>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border flex items-center justify-center',
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500 text-white'
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

          <div className="pt-4">
            <AnimatedButton
              variant="primary"
              size="lg"
              className="w-full text-base font-bold shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500"
              isLoading={isLoading}
              onClick={() => handleLogin(selectedProfileId)}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t('auth.physician.loginBtn')}
            </AnimatedButton>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          <span>Patient wishing to review narrative? </span>
          <Link
            to="/patient/login"
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Switch to Patient Portal
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
