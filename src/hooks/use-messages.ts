'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from './use-locale'
import enMessages from '@/i18n/messages/en.json'

type Messages = typeof enMessages
type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string ? (T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : K) : never }[keyof T]
  : never

export type MessageKey = NestedKeyOf<Messages>

export function useMessages() {
  const { locale } = useLocale()
  const [messages, setMessages] = useState<Messages>(enMessages)
  
  useEffect(() => {
    if (locale === 'bn') {
      import('@/i18n/messages/bn.json').then(mod => setMessages(mod.default as Messages))
    } else {
      setMessages(enMessages)
    }
  }, [locale])
  
  const t = useCallback((key: string): string => {
    const keys = key.split('.')
    let result: unknown = messages
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Record<string, unknown>)[k]
      } else {
        return key
      }
    }
    return typeof result === 'string' ? result : key
  }, [messages])
  
  return { t, messages, locale }
}
