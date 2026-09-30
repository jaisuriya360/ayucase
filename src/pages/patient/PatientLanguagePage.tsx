import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Globe,
  Eye,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Volume2,
  Sliders,
  Check,
  ShieldCheck,
} from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { AnimatedButton } from '../../components/ui/AnimatedButton'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useNotifications } from '../../contexts/NotificationContext'
import type { SupportedLanguage } from '../../types/ui'
import type { AppMode } from '../../types/accessibility'
import { cn } from '../../utils/cn'

export const PatientLanguagePage: React.FC = () => {
  const { language, setLanguage, availableLanguages, t } = useLanguage()
  const { mode, setMode, isElderMode, speakText } = useAccessibility()
  const { notifySuccess } = useNotifications()
  const navigate = useNavigate()

  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language)
  const [selectedMode, setSelectedMode] = useState<AppMode>(mode)

  const handleLanguagePick = (langCode: SupportedLanguage) => {
    setSelectedLang(langCode)
    setLanguage(langCode) // Immediate reactive switch for major UI text!
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
      `Language: ${selectedLang.toUpperCase()} | Experience: ${selectedMode.toUpperCase()} MODE`
    )
    navigate('/patient/dashboard')
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-4">
      <GlassCard variant="elevated" className="p-6 sm:p-10 space-y-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Personalized Setup
            </span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Saved to Local Storage
          </span>
        </div>

        {/* Section 1: Language Selection */}
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <Globe className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {t('lang.screenTitle')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5">
            {t('lang.screenSubtitle')}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableLanguages.map((lang) => {
              const isSelected = selectedLang === lang.code
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguagePick(lang.code)}
                  className={cn(
                    'p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24',
                    isSelected
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500/30'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500/50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'text-xs font-semibold uppercase',
                        isSelected ? 'text-emerald-100' : 'text-slate-400'
                      )}
                    >
                      {lang.label}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <span className="text-lg font-bold block">{lang.nativeLabel}</span>
                    <span
                      className={cn(
                        'text-[10px] block truncate',
                        isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                      )}
                    >
                      {lang.greeting}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Section 2: Mode Selection */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5 mb-2">
            <Sliders className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {t('mode.screenTitle')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            {t('mode.screenSubtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard Mode Card */}
            <div
              onClick={() => handleModePick('standard')}
              className={cn(
                'p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden',
                selectedMode === 'standard'
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Interactive Clinical View
                  </span>
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border flex items-center justify-center',
                      selectedMode === 'standard'
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    )}
                  >
                    {selectedMode === 'standard' && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {t('mode.standard.title')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {t('mode.standard.desc')}
                </p>

                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{t('mode.standard.feature1')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{t('mode.standard.feature2')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{t('mode.standard.feature3')}</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                Recommended for adult patients & caregivers
              </div>
            </div>

            {/* Elder Mode Card */}
            <div
              onClick={() => handleModePick('elder')}
              className={cn(
                'p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden',
                selectedMode === 'elder'
                  ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-xl shadow-amber-500/15 ring-2 ring-amber-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-amber-400/60'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black tracking-wide uppercase">
                    {t('mode.elder.badge')}
                  </span>
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border flex items-center justify-center',
                      selectedMode === 'elder'
                        ? 'border-amber-500 bg-amber-500 text-slate-950'
                        : 'border-slate-300 dark:border-slate-600'
                    )}
                  >
                    {selectedMode === 'elder' && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {t('mode.elder.title')}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      speakText('முதியோர் பயன்முறை விளக்கம். Elder mode provides high contrast and voice assistance.')
                    }}
                    className="p-1 rounded bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 hover:scale-105"
                    title="Read description aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {t('mode.elder.desc')}
                </p>

                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {t('mode.elder.feature1')}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{t('mode.elder.feature2')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{t('mode.elder.feature3')}</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-amber-200/60 dark:border-amber-900/60 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                Beyond font size: high contrast, zero clutter & voice read-aloud
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Footer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Active: <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{selectedLang}</span> |{' '}
            Mode: <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{selectedMode}</span>
          </div>

          <AnimatedButton
            variant={selectedMode === 'elder' ? 'elder' : 'primary'}
            size={selectedMode === 'elder' ? 'elder' : 'lg'}
            onClick={handleConfirm}
            className="w-full sm:w-auto shadow-lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            {t('mode.confirm')}
          </AnimatedButton>
        </div>
      </GlassCard>
    </div>
  )
}
