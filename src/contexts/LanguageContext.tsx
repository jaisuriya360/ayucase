import React, { createContext, useContext, useState, useEffect } from 'react'
import type { SupportedLanguage, LanguageOption } from '../types/ui'
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/mockTranslations'

interface LanguageContextType {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
  t: (key: string, fallback?: string) => string
  availableLanguages: LanguageOption[]
  currentLanguageDetails: LanguageOption
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_STORAGE_KEY = 'ayucase_language'

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved
      }
    } catch {
      // Fallback
    }
    return 'en'
  })

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    } catch {
      // Ignore storage errors
    }
    try {
      document.documentElement.lang = language
    } catch {
      // Ignore
    }
  }, [language])

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang)
  }

  const t = (key: string, fallback?: string): string => {
    const currentDict = TRANSLATIONS[language]
    if (currentDict && currentDict[key]) {
      return currentDict[key]
    }
    // Fallback to English
    const enDict = TRANSLATIONS['en']
    if (enDict && enDict[key]) {
      return enDict[key]
    }
    return fallback || key
  }

  const currentLanguageDetails =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0]

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages: SUPPORTED_LANGUAGES,
        currentLanguageDetails,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
