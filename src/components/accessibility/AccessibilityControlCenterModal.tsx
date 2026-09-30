import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Eye,
  Sliders,
  Type,
  SunMoon,
  ZapOff,
  Volume2,
  VolumeX,
  Touchpad,
  Keyboard,
  Globe,
  RotateCcw,
  Check,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck,
  Play,
  Square,
  CornerDownRight,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { AnimatedButton } from '../ui/AnimatedButton'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useNotifications } from '../../contexts/NotificationContext'
import type { FontSizeSetting } from '../../types/accessibility'
import type { SupportedLanguage } from '../../types/ui'
import { cn } from '../../utils/cn'

export const AccessibilityControlCenterModal: React.FC = () => {
  const {
    isA11yModalOpen,
    closeA11yModal,
    settings,
    setFontSize,
    toggleHighContrast,
    toggleReduceMotion,
    toggleVoiceGuidance,
    toggleLargeTouchTargets,
    toggleScreenReaderOptimized,
    resetAccessibilityDefaults,
    setMode,
    isElderMode,
    speakText,
    stopSpeaking,
    isSpeaking,
  } = useAccessibility()

  const { language, setLanguage, availableLanguages, t } = useLanguage()
  const { notifyInfo, notifySuccess } = useNotifications()

  const [activeTab, setActiveTab] = useState<'visual' | 'motion' | 'audio' | 'language' | 'keyboard'>('visual')

  if (!isA11yModalOpen) return null

  const handleLanguageChange = (langCode: SupportedLanguage) => {
    setLanguage(langCode)
    const targetLang = availableLanguages.find((l) => l.code === langCode)
    notifySuccess('Language Updated', `Active language set to ${targetLang?.label || langCode}`)
    if (settings.voiceGuidanceEnabled) {
      speakText(targetLang?.greeting || 'Language updated')
    }
  }

  const handleTestVoice = () => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      speakText(t('a11y.voiceTestingText', 'AyuCase accessibility is active. All clinical narratives adapt dynamically to your comfort.'))
    }
  }

  const handleReset = () => {
    resetAccessibilityDefaults()
    notifyInfo('Settings Reset', 'Restored standard accessibility preferences.')
  }

  const fontOptions: { id: FontSizeSetting; label: string; preview: string; percent: string }[] = [
    { id: 'normal', label: t('a11y.fontNormal', 'Normal'), preview: 'Sample clinical text', percent: '100%' },
    { id: 'large', label: t('a11y.fontLarge', 'Large'), preview: 'Sample clinical text', percent: '115%' },
    { id: 'xlarge', label: t('a11y.fontXLarge', 'Extra Large'), preview: 'Sample clinical text', percent: '130%' },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-modal-title"
      aria-describedby="a11y-modal-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
    >
      <div
        className="fixed inset-0"
        onClick={closeA11yModal}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl my-auto rounded-3xl bg-white dark:bg-[#0c152e] border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden z-10"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#081024]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-white shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="a11y-modal-title" className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {t('a11y.title', 'Accessibility Control Center')}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  WCAG AAA
                </span>
              </div>
              <p id="a11y-modal-description" className="text-xs text-slate-500 dark:text-slate-400">
                {t('a11y.subtitle', 'Personalize your visual, audio, motion, and interaction comfort')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title={t('a11y.resetDefaults', 'Reset to Standard Settings')}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('common.reset', 'Reset')}</span>
            </button>
            <button
              type="button"
              onClick={closeA11yModal}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={t('common.close', 'Close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/60 overflow-x-auto">
          {[
            { id: 'visual', label: 'Visual & Font', icon: Type },
            { id: 'motion', label: 'Motion & Contrast', icon: ZapOff },
            { id: 'audio', label: 'Voice Guidance', icon: Volume2 },
            { id: 'language', label: 'Language (மொழி)', icon: Globe },
            { id: 'keyboard', label: 'Shortcuts', icon: Keyboard },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer',
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                )}
                role="tab"
                aria-selected={isActive}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Body */}
        <div className="p-5 max-h-[62vh] overflow-y-auto space-y-6">
          {/* TAB 1: VISUAL & FONT SIZE */}
          {activeTab === 'visual' && (
            <div className="space-y-6">
              {/* Elder Mode Banner callout */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                      Elder Mode Adaptive Integration
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
                      {t('a11y.elderModeSync', 'Elder Mode automatically activates large font, high contrast, reduced motion, and generous touch targets.')}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMode(isElderMode ? 'standard' : 'elder')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0',
                    isElderMode
                      ? 'bg-amber-500 text-slate-950 border-2 border-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                  )}
                >
                  {isElderMode ? 'Elder Mode: Active' : 'Enable Elder Mode'}
                </button>
              </div>

              {/* Font Size Selection */}
              <div>
                <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
                  <Type className="w-4 h-4 text-cyan-500" />
                  <span>{t('a11y.fontSize', 'Font Size')}</span>
                  <span className="text-xs font-normal text-slate-400">
                    (Normal, Large, Extra Large)
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {fontOptions.map((opt) => {
                    const isSelected = settings.fontSize === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFontSize(opt.id)}
                        className={cn(
                          'p-4 rounded-2xl text-left border-2 transition-all cursor-pointer relative',
                          isSelected
                            ? 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/40 text-slate-900 dark:text-slate-100 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                        )}
                        aria-pressed={isSelected}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {opt.percent}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                          )}
                        </div>
                        <div className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                          {opt.label}
                        </div>
                        <p
                          className={cn(
                            'text-slate-500 dark:text-slate-400 mt-1',
                            opt.id === 'normal' && 'text-sm',
                            opt.id === 'large' && 'text-base font-medium',
                            opt.id === 'xlarge' && 'text-lg font-semibold'
                          )}
                        >
                          {opt.preview}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Large Touch Targets */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Touchpad className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {t('a11y.largeTouchTargets', 'Large Touch Targets')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('a11y.largeTouchTargetsDesc', 'Expands interactive buttons and inputs to 48px+ for effortless tapping')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleLargeTouchTargets}
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors relative cursor-pointer',
                    settings.largeTouchTargets ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
                  )}
                  aria-pressed={settings.largeTouchTargets}
                  aria-label="Toggle large touch targets"
                >
                  <span
                    className={cn(
                      'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-md',
                      settings.largeTouchTargets ? 'left-6.5' : 'left-0.5'
                    )}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MOTION & CONTRAST */}
          {activeTab === 'motion' && (
            <div className="space-y-4">
              {/* High Contrast */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <SunMoon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {t('a11y.highContrast', 'High Contrast')}
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        7:1 AAA
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                      {t('a11y.highContrastDesc', 'WCAG AAA pure contrast with stark dark/light backdrops and solid borders')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleHighContrast}
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0',
                    settings.highContrast ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                  )}
                  aria-pressed={settings.highContrast}
                  aria-label="Toggle high contrast"
                >
                  <span
                    className={cn(
                      'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-md',
                      settings.highContrast ? 'left-6.5' : 'left-0.5'
                    )}
                  />
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ZapOff className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {t('a11y.reduceMotion', 'Reduced Motion')}
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Zero Tilt / Float
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                      {t('a11y.reduceMotionDesc', 'Disables 3D tilt, parallax drift, floating animations, and page transitions')}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        ✓ 3D Tilts Flattened
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        ✓ Constellation Orbits Static
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        ✓ Instant Page Switching
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleReduceMotion}
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0',
                    settings.reduceMotion ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'
                  )}
                  aria-pressed={settings.reduceMotion}
                  aria-label="Toggle reduced motion"
                >
                  <span
                    className={cn(
                      'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-md',
                      settings.reduceMotion ? 'left-6.5' : 'left-0.5'
                    )}
                  />
                </button>
              </div>

              {/* Screen Reader Friendly Controls */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {t('a11y.screenReader', 'Screen Reader Friendly')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                      {t('a11y.screenReaderDesc', 'Enhanced semantic landmarks, live status regions, and table headers')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleScreenReaderOptimized}
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0',
                    settings.screenReaderOptimized ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  )}
                  aria-pressed={settings.screenReaderOptimized}
                  aria-label="Toggle screen reader optimizations"
                >
                  <span
                    className={cn(
                      'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-md',
                      settings.screenReaderOptimized ? 'left-6.5' : 'left-0.5'
                    )}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIO & VOICE GUIDANCE */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {t('a11y.voiceGuidance', 'Voice Guidance')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                      {t('a11y.voiceGuidanceDesc', 'Audible page announcements, spoken button cues, and assistive speech')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleVoiceGuidance}
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0',
                    settings.voiceGuidanceEnabled ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
                  )}
                  aria-pressed={settings.voiceGuidanceEnabled}
                  aria-label="Toggle voice guidance"
                >
                  <span
                    className={cn(
                      'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-md',
                      settings.voiceGuidanceEnabled ? 'left-6.5' : 'left-0.5'
                    )}
                  />
                </button>
              </div>

              {/* Voice Test Box */}
              <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      Interactive Voice Demonstration
                    </span>
                  </div>
                  {isSpeaking && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                      Speaking...
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                  "{t('a11y.voiceTestingText', 'AyuCase accessibility is active. All clinical narratives adapt dynamically to your comfort.')}"
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <AnimatedButton
                    size="sm"
                    variant={isSpeaking ? 'danger' : 'primary'}
                    onClick={handleTestVoice}
                    className="flex items-center gap-2 text-xs"
                  >
                    {isSpeaking ? (
                      <>
                        <Square className="w-3.5 h-3.5" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>{t('a11y.testVoice', 'Test Voice Guidance')}</span>
                      </>
                    )}
                  </AnimatedButton>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LANGUAGE SELECTION */}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {t('lang.screenTitle', 'Choose Your Preferred Language')}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {t('lang.screenSubtitle', 'Full multilingual interface available in English, Tamil, Hindi, Telugu, Kannada, and Malayalam.')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableLanguages.map((lang) => {
                    const isSelected = language === lang.code
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageChange(lang.code)}
                        className={cn(
                          'p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex items-center justify-between',
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-slate-900 dark:text-slate-100 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                        )}
                        aria-pressed={isSelected}
                      >
                        <div>
                          <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                            {lang.nativeLabel}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {lang.label} ({lang.code.toUpperCase()})
                          </div>
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                            {lang.greeting}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KEYBOARD NAVIGATION */}
          {activeTab === 'keyboard' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Keyboard className="w-4 h-4 text-cyan-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t('a11y.keyboardGuideTitle', 'Active Keyboard Shortcuts')}
                </h4>
              </div>

              <div className="space-y-2">
                {[
                  { keys: ['Alt', 'A'], action: 'Open / Close Accessibility Center' },
                  { keys: ['Alt', 'E'], action: 'Toggle Elder Mode' },
                  { keys: ['Alt', 'V'], action: 'Toggle Voice Guidance' },
                  { keys: ['Alt', 'C'], action: 'Toggle High Contrast (WCAG AAA)' },
                  { keys: ['Alt', 'M'], action: 'Toggle Reduced Motion' },
                  { keys: ['Tab'], action: 'Navigate between interactive controls' },
                  { keys: ['Shift', 'Tab'], action: 'Navigate backwards' },
                  { keys: ['Esc'], action: 'Close dialogs, menus, and modals' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {item.action}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-[11px] text-slate-900 dark:text-slate-100 shadow-sm"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Skip to Content notice */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>
                  Pressing <strong>Tab</strong> at page top reveals the high-contrast "Skip to Main Content" button.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>Settings automatically persist in your local browser profile.</span>
          </div>

          <AnimatedButton
            variant="primary"
            size="sm"
            onClick={closeA11yModal}
            className="w-full sm:w-auto px-5"
          >
            {t('common.continue', 'Done & Save Preferences')}
          </AnimatedButton>
        </div>
      </motion.div>
    </div>
  )
}
