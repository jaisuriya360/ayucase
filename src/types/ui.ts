export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number // ms
}

export interface ModalConfig {
  isOpen: boolean
  title?: string
  content?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  onClose?: () => void
}

export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml'

export interface LanguageOption {
  code: SupportedLanguage
  label: string
  nativeLabel: string
  greeting: string
}
