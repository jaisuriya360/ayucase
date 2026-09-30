import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import type { AppMode, AccessibilitySettings, FontSizeSetting } from '../types/accessibility'
import { SIMPLE_VIEW_MAPPINGS } from '../types/elder'

interface AccessibilityContextType {
  mode: AppMode
  isElderMode: boolean
  setMode: (mode: AppMode) => void
  toggleElderMode: () => void
  settings: AccessibilitySettings
  updateSettings: (partial: Partial<AccessibilitySettings>) => void
  setFontSize: (fontSize: FontSizeSetting) => void
  toggleHighContrast: () => void
  toggleReduceMotion: () => void
  toggleVoiceGuidance: () => void
  toggleLargeTouchTargets: () => void
  toggleScreenReaderOptimized: () => void
  resetAccessibilityDefaults: () => void
  speakText: (text: string, force?: boolean) => void
  stopSpeaking: () => void
  isSpeaking: boolean
  currentSpokenText: string | null
  announceToScreenReader: (message: string) => void
  liveAnnouncement: string
  simpleViewEnabled: boolean
  toggleSimpleView: () => void
  simplifyText: (text: string) => string
  isA11yModalOpen: boolean
  openA11yModal: () => void
  closeA11yModal: () => void
  toggleA11yModal: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

const MODE_STORAGE_KEY = 'ayucase_app_mode'
const A11Y_STORAGE_KEY = 'ayucase_accessibility_settings'

export const DEFAULT_A11Y_SETTINGS: AccessibilitySettings = {
  mode: 'standard',
  fontSize: 'normal',
  highContrast: false,
  reduceMotion: false,
  screenReaderOptimized: false,
  hapticFeedback: true,
  voiceGuidanceEnabled: false,
  largeTouchTargets: false,
  keyboardNavHighlights: true,
}

export const ELDER_A11Y_PRESET: Partial<AccessibilitySettings> = {
  mode: 'elder',
  fontSize: 'large',
  highContrast: true,
  reduceMotion: true,
  voiceGuidanceEnabled: true,
  largeTouchTargets: true,
  screenReaderOptimized: true,
  keyboardNavHighlights: true,
}

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<AccessibilitySettings>(() => {
    try {
      const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as AppMode | null
      const savedSettings = localStorage.getItem(A11Y_STORAGE_KEY)
      const parsed = savedSettings ? JSON.parse(savedSettings) : {}
      const mode: AppMode = savedMode === 'elder' ? 'elder' : 'standard'

      if (mode === 'elder') {
        return {
          ...DEFAULT_A11Y_SETTINGS,
          ...parsed,
          ...ELDER_A11Y_PRESET,
          mode: 'elder',
        }
      }

      return {
        ...DEFAULT_A11Y_SETTINGS,
        ...parsed,
        mode: 'standard',
      }
    } catch {
      return DEFAULT_A11Y_SETTINGS
    }
  })

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentSpokenText, setCurrentSpokenText] = useState<string | null>(null)
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('')
  const [isA11yModalOpen, setIsA11yModalOpen] = useState(false)
  const [simpleViewEnabled, setSimpleViewEnabled] = useState<boolean>(true)

  const isElderMode = settings.mode === 'elder'

  // Apply DOM attributes & classes for CSS selection
  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    // Font size
    root.setAttribute('data-font-size', settings.fontSize)
    root.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge')
    root.classList.add(`font-size-${settings.fontSize}`)

    // High Contrast
    root.setAttribute('data-high-contrast', String(settings.highContrast))
    root.classList.toggle('high-contrast', settings.highContrast)
    body.classList.toggle('high-contrast', settings.highContrast)

    // Reduced Motion
    root.setAttribute('data-reduced-motion', String(settings.reduceMotion))
    root.classList.toggle('reduced-motion', settings.reduceMotion)
    body.classList.toggle('reduced-motion', settings.reduceMotion)

    // Large Touch Targets
    root.setAttribute('data-touch-targets', settings.largeTouchTargets ? 'large' : 'normal')
    root.classList.toggle('large-touch-targets', settings.largeTouchTargets)
    body.classList.toggle('large-touch-targets', settings.largeTouchTargets)

    // Elder Mode
    root.setAttribute('data-mode', settings.mode)
    root.classList.toggle('elder-mode', isElderMode)
    body.classList.toggle('elder-mode', isElderMode)

    // Persist
    localStorage.setItem(MODE_STORAGE_KEY, settings.mode)
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings))
  }, [settings, isElderMode])

  // Screen reader announcer
  const announceToScreenReader = useCallback((message: string) => {
    setLiveAnnouncement(message)
  }, [])

  // Text Simplifier
  const simplifyText = useCallback(
    (text: string): string => {
      if (!simpleViewEnabled) return text
      let simplified = text
      Object.entries(SIMPLE_VIEW_MAPPINGS).forEach(([technical, friendly]) => {
        simplified = simplified.split(technical).join(friendly)
      })
      return simplified
    },
    [simpleViewEnabled]
  )

  // Speech Synthesis Helper
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setCurrentSpokenText(null)
  }, [])

  const speakText = useCallback(
    (text: string, force = false) => {
      // If voice guidance is disabled and not forced, announce to screen reader only
      if (!settings.voiceGuidanceEnabled && !force && !isElderMode) {
        announceToScreenReader(text)
        return
      }

      if (!('speechSynthesis' in window)) {
        announceToScreenReader(text)
        return
      }

      try {
        window.speechSynthesis.cancel()
        const plainText = simplifyText(text)
        const utterance = new SpeechSynthesisUtterance(plainText)
        speechRef.current = utterance

        // Slower, clearer pace for comfort
        utterance.rate = isElderMode ? 0.85 : 0.95
        utterance.pitch = 1.0

        // Attempt to find Tamil or Indian English voice if appropriate
        const voices = window.speechSynthesis.getVoices()
        const matchVoice = voices.find(
          (v) =>
            v.lang.startsWith('ta') ||
            v.lang.startsWith('hi') ||
            v.lang.includes('IN') ||
            v.name.includes('India')
        )
        if (matchVoice) {
          utterance.voice = matchVoice
        }

        utterance.onstart = () => {
          setIsSpeaking(true)
          setCurrentSpokenText(plainText)
        }

        utterance.onend = () => {
          setIsSpeaking(false)
          setCurrentSpokenText(null)
        }

        utterance.onerror = () => {
          setIsSpeaking(false)
          setCurrentSpokenText(null)
        }

        window.speechSynthesis.speak(utterance)
        announceToScreenReader(plainText)
      } catch (e) {
        console.warn('Speech synthesis error', e)
        announceToScreenReader(text)
      }
    },
    [settings.voiceGuidanceEnabled, isElderMode, simplifyText, announceToScreenReader]
  )

  // Mode Setter
  const setMode = useCallback(
    (newMode: AppMode) => {
      setSettingsState((prev) => {
        if (newMode === 'elder') {
          // Requirement: "Ensure Elder Mode automatically uses accessibility-friendly settings."
          return {
            ...prev,
            ...ELDER_A11Y_PRESET,
            mode: 'elder',
            fontSize: prev.fontSize === 'xlarge' ? 'xlarge' : 'large',
          }
        }
        return {
          ...prev,
          mode: 'standard',
        }
      })
      announceToScreenReader(
        newMode === 'elder'
          ? 'Switched to Elder Mode. High contrast, large text, and voice assistance activated.'
          : 'Switched to Standard Mode.'
      )
    },
    [announceToScreenReader]
  )

  const toggleElderMode = useCallback(() => {
    setMode(settings.mode === 'elder' ? 'standard' : 'elder')
  }, [settings.mode, setMode])

  const updateSettings = useCallback((partial: Partial<AccessibilitySettings>) => {
    setSettingsState((prev) => ({ ...prev, ...partial }))
  }, [])

  const setFontSize = useCallback(
    (fontSize: FontSizeSetting) => {
      updateSettings({ fontSize })
      announceToScreenReader(`Font size adjusted to ${fontSize}`)
    },
    [updateSettings, announceToScreenReader]
  )

  const toggleHighContrast = useCallback(() => {
    setSettingsState((prev) => {
      const next = !prev.highContrast
      announceToScreenReader(next ? 'High Contrast Mode Enabled' : 'High Contrast Mode Disabled')
      return { ...prev, highContrast: next }
    })
  }, [announceToScreenReader])

  const toggleReduceMotion = useCallback(() => {
    setSettingsState((prev) => {
      const next = !prev.reduceMotion
      announceToScreenReader(
        next
          ? 'Reduced Motion Enabled. 3D tilt, parallax, and floating animations paused.'
          : 'Reduced Motion Disabled'
      )
      return { ...prev, reduceMotion: next }
    })
  }, [announceToScreenReader])

  const toggleVoiceGuidance = useCallback(() => {
    setSettingsState((prev) => {
      const next = !prev.voiceGuidanceEnabled
      announceToScreenReader(
        next ? 'Voice Guidance Enabled. Audible narration active.' : 'Voice Guidance Disabled'
      )
      if (next) {
        speakText('Voice guidance is now active. Audio narration will guide your actions.', true)
      } else {
        stopSpeaking()
      }
      return { ...prev, voiceGuidanceEnabled: next }
    })
  }, [announceToScreenReader, speakText, stopSpeaking])

  const toggleLargeTouchTargets = useCallback(() => {
    setSettingsState((prev) => {
      const next = !prev.largeTouchTargets
      announceToScreenReader(
        next
          ? 'Large Touch Targets Enabled. Buttons enlarged to minimum 48px.'
          : 'Standard Touch Targets'
      )
      return { ...prev, largeTouchTargets: next }
    })
  }, [announceToScreenReader])

  const toggleScreenReaderOptimized = useCallback(() => {
    setSettingsState((prev) => {
      const next = !prev.screenReaderOptimized
      announceToScreenReader(
        next
          ? 'Screen Reader Optimizations Enabled. Detailed ARIA landmark descriptions active.'
          : 'Standard Screen Reader Support'
      )
      return { ...prev, screenReaderOptimized: next }
    })
  }, [announceToScreenReader])

  const resetAccessibilityDefaults = useCallback(() => {
    setSettingsState(DEFAULT_A11Y_SETTINGS)
    stopSpeaking()
    announceToScreenReader('All accessibility preferences restored to default standard settings.')
  }, [stopSpeaking, announceToScreenReader])

  const toggleSimpleView = useCallback(() => {
    setSimpleViewEnabled((prev) => !prev)
  }, [])

  const openA11yModal = useCallback(() => setIsA11yModalOpen(true), [])
  const closeA11yModal = useCallback(() => setIsA11yModalOpen(false), [])
  const toggleA11yModal = useCallback(() => setIsA11yModalOpen((prev) => !prev), [])

  // Universal Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when actively typing in an input/textarea
      const target = e.target as HTMLElement
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)

      if (e.key === 'Escape') {
        if (isA11yModalOpen) {
          setIsA11yModalOpen(false)
        }
        return
      }

      // Alt key combinations
      if (e.altKey && !isInput) {
        const key = e.key.toLowerCase()
        if (key === 'a') {
          e.preventDefault()
          toggleA11yModal()
        } else if (key === 'e') {
          e.preventDefault()
          toggleElderMode()
        } else if (key === 'v') {
          e.preventDefault()
          toggleVoiceGuidance()
        } else if (key === 'c') {
          e.preventDefault()
          toggleHighContrast()
        } else if (key === 'm') {
          e.preventDefault()
          toggleReduceMotion()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    isA11yModalOpen,
    toggleA11yModal,
    toggleElderMode,
    toggleVoiceGuidance,
    toggleHighContrast,
    toggleReduceMotion,
  ])

  return (
    <AccessibilityContext.Provider
      value={{
        mode: settings.mode,
        isElderMode,
        setMode,
        toggleElderMode,
        settings,
        updateSettings,
        setFontSize,
        toggleHighContrast,
        toggleReduceMotion,
        toggleVoiceGuidance,
        toggleLargeTouchTargets,
        toggleScreenReaderOptimized,
        resetAccessibilityDefaults,
        speakText,
        stopSpeaking,
        isSpeaking,
        currentSpokenText,
        announceToScreenReader,
        liveAnnouncement,
        simpleViewEnabled,
        toggleSimpleView,
        simplifyText,
        isA11yModalOpen,
        openA11yModal,
        closeA11yModal,
        toggleA11yModal,
      }}
    >
      {children}
      {/* Offscreen ARIA Live Region for Screen Readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveAnnouncement}
      </div>
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
