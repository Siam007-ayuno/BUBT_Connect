'use client'

import * as React from 'react'

export type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'dark' | 'light'
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
})

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<'dark' | 'light'>('light')

  const applyTheme = React.useCallback(
    (targetTheme: 'dark' | 'light') => {
      if (typeof window === 'undefined') return
      const root = document.documentElement

      if (disableTransitionOnChange) {
        root.classList.add('[&_*]:!transition-none')
      }

      if (attribute === 'class') {
        root.classList.remove('light', 'dark')
        root.classList.add(targetTheme)
      } else {
        root.setAttribute(attribute, targetTheme)
      }

      setResolvedTheme(targetTheme)

      if (disableTransitionOnChange) {
        window.setTimeout(() => {
          root.classList.remove('[&_*]:!transition-none')
        }, 1)
      }
    },
    [attribute, disableTransitionOnChange]
  )

  React.useEffect(() => {
    let savedTheme: Theme = defaultTheme
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null
      if (stored && (stored === 'dark' || stored === 'light' || stored === 'system')) {
        savedTheme = stored
      }
    } catch {}

    setThemeState(savedTheme)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const getSystemTheme = () => (mediaQuery.matches ? 'dark' : 'light')

    if (savedTheme === 'system' && enableSystem) {
      applyTheme(getSystemTheme())
    } else {
      applyTheme(savedTheme === 'dark' ? 'dark' : 'light')
    }

    const handleSystemChange = () => {
      setThemeState((current) => {
        if (current === 'system' && enableSystem) {
          applyTheme(getSystemTheme())
        }
        return current
      })
    }

    mediaQuery.addEventListener('change', handleSystemChange)
    return () => mediaQuery.removeEventListener('change', handleSystemChange)
  }, [defaultTheme, enableSystem, storageKey, applyTheme])

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme)
      try {
        localStorage.setItem(storageKey, newTheme)
      } catch {}

      const isDark =
        newTheme === 'dark' ||
        (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      applyTheme(isDark ? 'dark' : 'light')
    },
    [storageKey, applyTheme]
  )

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    return {
      theme: 'system' as Theme,
      setTheme: () => {},
      resolvedTheme: 'light' as const,
    }
  }
  return context
}
