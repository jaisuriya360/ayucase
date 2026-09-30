export type AppMode = 'standard' | 'elder'

export type FontSizeSetting = 'normal' | 'large' | 'xlarge'

export interface AccessibilitySettings {
  mode: AppMode
  fontSize: FontSizeSetting
  highContrast: boolean
  reduceMotion: boolean
  screenReaderOptimized: boolean
  hapticFeedback: boolean
  voiceGuidanceEnabled: boolean
  largeTouchTargets: boolean
  keyboardNavHighlights: boolean
}

export interface KeyboardShortcutItem {
  keyCombo: string
  action: string
  description: string
  category: 'global' | 'navigation' | 'reading'
}
