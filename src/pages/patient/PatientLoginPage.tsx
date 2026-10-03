import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  HeartPulse,
  ArrowRight,
  Check,
  Shield,
  User,
} from 'lucide-react'
import { AyuCard } from '../../components/ui/AyuCard'
import { AyuButton } from '../../components/ui/AyuButton'
import { AyuBadge } from '../../components/ui/AyuBadge'
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
  const location = useLocation()

  const [selectedProfileId, setSelectedProfileId] = useState<string>('demo-pt-1')

  const handleLogin = async (profileId: string) => {
    const user = await loginAsPatient(profileId)
    notifySuccess(`Welcome back, ${user.name}`, 'Session established.')
    const destination = (location.state as any)?.from?.pathname || '/patient/dashboard'
    navigate(destination)
  }

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <AyuCard variant="default" padding="lg" className="shadow-xl border border-slate-200/90 dark:border-slate-800">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-3 shadow-xs">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Access your AYUCASE personal health space.
          </p>
        </div>

        {/* Profile Selection */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Select Patient Profile
          </label>

          <div className="space-y-2.5">
            {DEMO_PATIENT_PROFILES.map((profile) => {
              const isSelected = selectedProfileId === profile.id
              return (
                <div
                  key={profile.id}
                  onClick={() => setSelectedProfileId(profile.id)}
                  className={cn(
                    'p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3',
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/40'
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
                      {profile.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {profile.name}
                        </span>
                        {profile.age && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            • {profile.age}y, {profile.gender}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-sm">
                        {profile.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {profile.badgeText}
                    </span>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border flex items-center justify-center transition-colors',
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500 text-white'
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

          {/* Primary Action Button */}
          <div className="pt-3">
            <AyuButton
              variant="primary"
              size="lg"
              className="w-full text-base font-semibold"
              isLoading={isLoading}
              onClick={() => handleLogin(selectedProfileId)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Health Space
            </AyuButton>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative px-3 bg-white dark:bg-[#0b1428] text-xs text-slate-400">
            or
          </span>
        </div>

        {/* Register Footer */}
        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
          <span>New to AYUCASE? </span>
          <Link
            to="/patient/register"
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Create patient profile
          </Link>
        </div>
      </AyuCard>
    </div>
  )
}
