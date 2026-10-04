'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Locale } from '@/i18n/config'

const LOCALE_KEY = 'bubt-connect-locale'

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>('en')
  
  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_KEY) as Locale | null
    if (stored && (stored === 'en' || stored === 'bn')) {
      setLocaleState(stored)
    }
  }, [])
  
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_KEY, newLocale)
    document.documentElement.lang = newLocale
  }, [])
  
  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'bn' : 'en')
  }, [locale, setLocale])
  
  return { locale, setLocale, toggleLocale }
}
