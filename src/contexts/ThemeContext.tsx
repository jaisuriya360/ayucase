import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'ayucase_theme'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved
      }
    } catch {
      // Fallback if localStorage is inaccessible
    }
    return 'light' // Default clean medical light theme, easily toggleable
  })

  const [isDark, setIsDark] = useState<boolean>(false)

  useEffect(() => {
    try {
      const root = document.documentElement
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const computeIsDark = () => {
        if (theme === 'dark') return true
        if (theme === 'light') return false
        return mediaQuery?.matches ?? false
      }

      const darkActive = computeIsDark()
      setIsDark(darkActive)

      if (darkActive) {
        root.classList.add('dark')
        root.setAttribute('data-theme', 'dark')
      } else {
        root.classList.remove('dark')
        root.setAttribute('data-theme', 'light')
      }

      const handleChange = () => {
        if (theme === 'system') {
          const matches = mediaQuery?.matches ?? false
          setIsDark(matches)
          if (matches) {
            root.classList.add('dark')
            root.setAttribute('data-theme', 'dark')
          } else {
            root.classList.remove('dark')
            root.setAttribute('data-theme', 'light')
          }
        }
      }

      mediaQuery?.addEventListener?.('change', handleChange)
      return () => mediaQuery?.removeEventListener?.('change', handleChange)
    } catch {
      // Fallback
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch {
      // Ignore storage errors
    }
  }

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
