import * as React from 'react'
import { settingsRepo } from '@/lib/db'
import type { ThemeMode } from '@/lib/types'

interface ThemeContextValue {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function applyThemeClass(theme: ThemeMode) {
  const root = document.documentElement
  const isDark =
    theme === 'dark' ||
    (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  root.classList.toggle('dark', isDark)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemeMode>('auto')
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    settingsRepo.get().then((settings) => {
      setThemeState(settings.theme)
      applyThemeClass(settings.theme)
      setLoaded(true)
    })
  }, [])

  React.useEffect(() => {
    if (theme !== 'auto') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => applyThemeClass('auto')
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [theme])

  const setTheme = React.useCallback((next: ThemeMode) => {
    setThemeState(next)
    applyThemeClass(next)
    settingsRepo.get().then((settings) => {
      settingsRepo.put({ ...settings, theme: next })
    })
  }, [])

  if (!loaded) return null

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme трябва да се използва в ThemeProvider')
  return ctx
}
