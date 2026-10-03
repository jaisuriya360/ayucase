import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Globe,
  Check,
  ArrowRight,
  ShieldCheck,
  Eye,
  Sliders,
  Volume2,
} from 'lucide-react'
import { AyuCard } from '../../components/ui/AyuCard'
import { AyuButton } from '../../components/ui/AyuButton'
import { AyuBadge } from '../../components/ui/AyuBadge'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useNotifications } from '../../contexts/NotificationContext'
import type { SupportedLanguage } from '../../types/ui'
import type { AppMode } from '../../types/accessibility'
import { cn } from '../../utils/cn'

export const PatientLanguagePage: React.FC = () => {
  const { language, setLanguage, availableLanguages, t } = useLanguage()
  const { mode, setMode, speakText } = useAccessibility()
  const { notifySuccess } = useNotifications()
  const navigate = useNavigate()

  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language)
  const [selectedMode, setSelectedMode] = useState<AppMode>(mode)

  const handleLanguagePick = (langCode: SupportedLanguage) => {
    setSelectedLang(langCode)
    setLanguage(langCode)
  }

  const handleModePick = (appMode: AppMode) => {
    setSelectedMode(appMode)
    setMode(appMode)
    if (appMode === 'elder') {
      speakText('முதியோர் பயன்முறை தேர்ந்தெடுக்கப்பட்டது. Elder Mode selected.')
    }
  }

  const handleConfirm = () => {
    setLanguage(selectedLang)
    setMode(selectedMode)
    notifySuccess(
      'Preferences Saved',
      `Language: ${selectedLang.toUpperCase()} | Mode: ${selectedMode.toUpperCase()}`
    )
    navigate('/patient/dashboard')
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-6 sm:py-10">
      <AyuCard variant="default" padding="lg" className="shadow-xl border border-slate-200/90 dark:border-slate-800 space-y-8">
        {/* Onboarding Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 dark:border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <AyuBadge variant="emerald" size="sm">Step 1 of 2</AyuBadge>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Patient Setup
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Select Your Preferred Language
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Choose the language for your clinical interview, timeline, and health story.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Saved Locally</span>
          </div>
        </div>

        {/* Large Selectable Language Cards */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {availableLanguages.map((lang) => {
              const isSelected = selectedLang === lang.code
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguagePick(lang.code)}
                  className={cn(
                    'p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[110px] relative select-none',
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  )}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {lang.label}
                    </span>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0',
                        isSelected
                          ? 'border-emerald-500 bg-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-xl font-bold text-slate-900 dark:text-slate-100 block">
                      {lang.nativeLabel}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      {lang.greeting}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Experience Mode Option (Standard vs Elder Mode) */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Experience Mode
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select standard interactive view or simplified high-contrast Elder Mode.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div
              onClick={() => handleModePick('standard')}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3',
                selectedMode === 'standard'
                  ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-400 dark:border-slate-600 ring-2 ring-slate-400/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              )}
            >
              <div className="min-w-0">
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Standard Interface
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Complete interactive clinical graphs and vitals.
                </p>
              </div>
              <div
                className={cn(
                  'w-5 h-5 rounded-full border flex items-center justify-center shrink-0',
                  selectedMode === 'standard'
                    ? 'border-emerald-500 bg-emerald-600 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                )}
              >
                {selectedMode === 'standard' && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>

            <div
              onClick={() => handleModePick('elder')}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3',
                selectedMode === 'elder'
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400/60'
              )}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Elder Mode
                  </p>
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Large touch targets, high contrast, and voice assistance.
                </p>
              </div>
              <div
                className={cn(
                  'w-5 h-5 rounded-full border flex items-center justify-center shrink-0',
                  selectedMode === 'elder'
                    ? 'border-amber-500 bg-amber-500 text-slate-950 font-bold'
                    : 'border-slate-300 dark:border-slate-600'
                )}
              >
                {selectedMode === 'elder' && <Check className="w-3 h-3 text-slate-950" />}
              </div>
            </div>
          </div>
        </div>

        {/* Clear Primary Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Selected: <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">{selectedLang}</span> ({selectedMode} mode)
          </div>

          <AyuButton
            variant={selectedMode === 'elder' ? 'elder' : 'primary'}
            size={selectedMode === 'elder' ? 'elder' : 'lg'}
            onClick={handleConfirm}
            className="w-full sm:w-auto"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to your dashboard
          </AyuButton>
        </div>
      </AyuCard>
    </div>
  )
}
