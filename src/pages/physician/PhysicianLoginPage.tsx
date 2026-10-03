import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Stethoscope,
  ArrowRight,
  Check,
  Building2,
} from 'lucide-react'
import { AyuCard } from '../../components/ui/AyuCard'
import { AyuButton } from '../../components/ui/AyuButton'
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
  const location = useLocation()

  const [selectedProfileId, setSelectedProfileId] = useState<string>('demo-md-1')

  const handleLogin = async (profileId: string) => {
    const user = await loginAsPhysician(profileId)
    notifySuccess('Clinical Workstation Ready', `Welcome back, ${user.name}`)
    const destination = (location.state as any)?.from?.pathname || '/physician/dashboard'
    navigate(destination)
  }

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <AyuCard variant="default" padding="lg" className="shadow-xl border border-slate-200/90 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-cyan-400 mx-auto mb-3 shadow-xs">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Clinical Workstation
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Access patient narratives, contradiction radars, and clinical cases.
          </p>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Select Physician Account
          </label>

          <div className="space-y-2.5">
            {DEMO_PHYSICIAN_PROFILES.map((profile) => {
              const isSelected = selectedProfileId === profile.id
              return (
                <div
                  key={profile.id}
                  onClick={() => setSelectedProfileId(profile.id)}
                  className={cn(
                    'p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3',
                    isSelected
                      ? 'bg-teal-50/70 dark:bg-teal-950/30 border-teal-500/80 shadow-xs ring-1 ring-teal-500/40'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
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
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-sm">
                        {profile.roleTitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {profile.badgeText}
                    </span>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border flex items-center justify-center transition-colors',
                        isSelected
                          ? 'border-teal-500 bg-teal-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-3">
            <AyuButton
              variant="primary"
              size="lg"
              className="w-full text-base font-semibold"
              isLoading={isLoading}
              onClick={() => handleLogin(selectedProfileId)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Enter Workstation
            </AyuButton>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-600 dark:text-slate-400">
          <span>Patient wishing to review narrative? </span>
          <Link
            to="/patient/login"
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Switch to Patient Portal
          </Link>
        </div>
      </AyuCard>
    </div>
  )
}
