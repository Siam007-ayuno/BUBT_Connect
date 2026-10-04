'use client'

import { MessageSquare, Bell, Calendar, GraduationCap, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Home', icon: MessageSquare, href: '/app' },
  { label: 'Notices', icon: Bell, href: '/app/notices' },
  { label: 'Events', icon: Calendar, href: '/app/events' },
  { label: 'Alumni', icon: GraduationCap, href: '/app/alumni' },
  { label: 'Profile', icon: User, href: '/app/profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border lg:hidden pb-safe">
      <div className="flex items-center justify-around h-16">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`) && tab.href !== '/app' || (tab.href === '/app' && pathname === '/app')
          return (
            <Link key={tab.href} href={tab.href} className="w-full flex-1 h-full flex flex-col items-center justify-center gap-1">
              <tab.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-[10px] font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
