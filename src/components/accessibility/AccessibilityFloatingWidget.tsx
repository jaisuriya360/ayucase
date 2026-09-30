import React from 'react'
import { Sliders, Volume2, Square, Eye, ZapOff, SunMoon } from 'lucide-react'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { cn } from '../../utils/cn'

export const AccessibilityFloatingWidget: React.FC = () => {
  const {
    openA11yModal,
    settings,
    isElderMode,
    isSpeaking,
    stopSpeaking,
  } = useAccessibility()
  const { t } = useLanguage()

  return (
    <aside
      aria-label="Accessibility quick controls"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 print:hidden"
    >
      {/* Audio speech indicator pill if actively speaking */}
      {isSpeaking && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/90 text-white border border-cyan-500/50 shadow-lg backdrop-blur-md text-xs">
          <div className="flex items-center gap-1 text-cyan-400">
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span className="font-bold">Narrating...</span>
          </div>
          <button
            type="button"
            onClick={stopSpeaking}
            className="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors cursor-pointer"
            title="Stop narration"
            aria-label="Stop reading aloud"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Accessibility Trigger Button */}
      <button
        type="button"
        onClick={openA11yModal}
        className={cn(
          'min-h-[50px] min-w-[50px] px-3.5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer group',
          isElderMode
            ? 'bg-amber-400 text-slate-950 border-2 border-slate-950 shadow-[0_4px_0_0_#0f172a]'
            : settings.highContrast
            ? 'bg-yellow-400 text-black border-2 border-black font-extrabold'
            : 'bg-gradient-to-tr from-cyan-600 to-emerald-600 text-white border border-white/20 hover:shadow-cyan-500/25 hover:scale-105'
        )}
        aria-label={t('a11y.title', 'Accessibility Control Center') + ' (Alt+A)'}
        title="Open Accessibility Controls (Alt + A)"
      >
        <Sliders className="w-5 h-5 shrink-0 transition-transform group-hover:rotate-45" />

        <span className="hidden sm:inline font-bold">
          {t('a11y.openA11y', 'Accessibility')}
        </span>

        {/* Status Pills */}
        <div className="flex items-center gap-1">
          {isElderMode && (
            <span className="w-2 h-2 rounded-full bg-slate-950" title="Elder Mode Active" />
          )}
          {settings.highContrast && (
            <span className="text-[10px] font-mono px-1 rounded bg-black/20 text-current" title="High Contrast Active">
              AAA
            </span>
          )}
          {settings.reduceMotion && (
            <span className="text-[10px] px-1 rounded bg-black/20 text-current" title="Reduced Motion Active">
              RM
            </span>
          )}
        </div>
      </button>
    </aside>
  )
}
