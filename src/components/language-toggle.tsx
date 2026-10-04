'use client'

import { Button } from '@/components/ui/button'
import { useLocale } from '@/hooks/use-locale'
import { Languages } from 'lucide-react'

export function LanguageToggle() {
  const { locale, toggleLocale } = useLocale()
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="gap-1.5 text-xs font-medium"
      aria-label={locale === 'en' ? 'Switch to Bangla' : 'Switch to English'}
    >
      <Languages className="h-4 w-4" />
      {locale === 'en' ? 'বাং' : 'EN'}
    </Button>
  )
}
