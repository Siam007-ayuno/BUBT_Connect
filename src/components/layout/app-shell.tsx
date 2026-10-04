'use client'

import { Header } from './header'
import { SidebarNav } from './sidebar-nav'
import { BottomNav } from './bottom-nav'
import type { Profile } from '@/lib/types'

interface AppShellProps {
  children: React.ReactNode
  profile: Profile
}

export function AppShell({ children, profile }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header profile={profile} />
      
      <div className="flex flex-1">
        <SidebarNav role={profile.role} />
        
        <main className="flex-1 pb-16 lg:pb-0 relative flex flex-col max-w-5xl mx-auto w-full px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
