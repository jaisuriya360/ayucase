import React from 'react'
import {
  User,
  Shield,
  Phone,
  Droplet,
  AlertTriangle,
  Pill,
  Heart,
  Eye,
  Sliders,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { usePatient } from '../../contexts/PatientContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useLanguage } from '../../contexts/LanguageContext'

export const PatientProfilePage: React.FC = () => {
  const { patient } = usePatient()
  const { mode, toggleElderMode, isElderMode } = useAccessibility()
  const { language } = useLanguage()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Patient Identity & Clinical Profile"
        subtitle="Manage personal health identifiers, allergy disclosures, emergency contacts, and accessibility mode."
        breadcrumbs={[
          { label: 'Dashboard', href: '/patient/dashboard' },
          { label: 'Profile' },
        ]}
      />

      {/* Main Identity Card */}
      <GlassCard variant="elevated" className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-emerald-500/20">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                {patient.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold border border-emerald-500/20">
                  {patient.fictionalId}
                </span>
                <span className="text-xs text-slate-400">
                  {patient.age} years • {patient.gender}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Blood Group
            </span>
            <span className="text-lg font-black text-rose-600 dark:text-rose-400">
              {patient.bloodGroup}
            </span>
          </div>
        </div>

        {/* Contact and Emergency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Contact Number (Masked)
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500" />
              {patient.contactMasked}
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Emergency Contact
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              {patient.emergencyContact}
            </span>
          </div>
        </div>

        {/* Allergies and Medications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4" />
              Documented Allergies
            </span>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-500/20 text-xs font-bold"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 flex items-center gap-1.5 mb-2">
              <Pill className="w-4 h-4" />
              Current Medications
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {patient.currentMedications.map((med) => (
                <li key={med} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>{med}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* Experience & Accessibility Mode Card */}
      <GlassCard variant="default" className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Experience Mode: {mode.toUpperCase()}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg">
              Elder Mode enables high contrast, 58px+ touch buttons, reduced visual complexity, and voice synthesis support.
            </p>
          </div>

          <AnimatedButton
            variant={isElderMode ? 'elder' : 'secondary'}
            size="md"
            onClick={toggleElderMode}
          >
            {isElderMode ? 'Switch to Standard Mode' : 'Switch to Elder Mode'}
          </AnimatedButton>
        </div>
      </GlassCard>
    </div>
  )
}
