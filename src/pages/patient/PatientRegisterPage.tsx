import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useNotifications } from '../../contexts/NotificationContext'

export const PatientRegisterPage: React.FC = () => {
  const { registerPatient, isLoading } = useAuth()
  const { t } = useLanguage()
  const { notifySuccess } = useNotifications()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: 'Kavitha Ramachandran',
    age: 45,
    gender: 'Female',
    condition: 'Chronic Cervical Spondylosis and Sleep Disruption',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = await registerPatient(formData)
    notifySuccess(`Demo Profile Created`, `Registered as ${user.name} (${user.fictionalIdentifier})`)
    // As per Phase 2: After patient login -> Language Selection
    navigate('/patient/language')
  }

  return (
    <div className="w-full">
      <GlassCard variant="elevated" className="p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto mb-3 shadow-md shadow-teal-500/10">
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t('auth.register.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {t('auth.register.subtitle')}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
            <span>Fictional Sandbox — No Real Personal Identity Stored</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              {t('auth.register.name')}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Ananya Rao"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('auth.register.age')}
              </label>
              <input
                type="number"
                min={1}
                max={120}
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('auth.register.gender')}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              {t('auth.register.condition')}
            </label>
            <input
              type="text"
              required
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Migraine, Hypertension, Joint Pain"
            />
          </div>

          <div className="pt-4">
            <AnimatedButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-lg shadow-emerald-500/20"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t('auth.register.submit')}
            </AnimatedButton>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <span>Already have a demo record? </span>
          <Link
            to="/patient/login"
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Back to Demo Login
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
