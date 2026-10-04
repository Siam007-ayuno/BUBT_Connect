'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const current = theme === 'system' ? resolvedTheme : theme

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="relative h-9 w-9"
    >
      <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
    </Button>
  )
}
