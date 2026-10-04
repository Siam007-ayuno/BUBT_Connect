'use client'

import { Search, Bell, Menu, AlertOctagon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { RoleSwitcher } from '@/components/role-switcher'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn, getInitials } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SidebarNav } from './sidebar-nav'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/lib/types'

interface HeaderProps {
  profile: Profile
}

export function Header({ profile }: HeaderProps) {
  const router = useRouter()
  const initials = getInitials(profile?.full_name)

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur border-b border-border h-16 flex items-center justify-between px-3 lg:px-6 shadow-xs">
      {/* Left: Mobile Drawer Trigger + Brand & Crest */}
      <div className="flex items-center gap-2 lg:gap-3 shrink-0">
        <Sheet>
          <SheetTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "lg:hidden shrink-0 h-9 w-9")}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 pt-16">
            <SidebarNav role={profile.role} />
          </SheetContent>
        </Sheet>
        
        <Link href="/app" className="flex items-center gap-2.5 group">
          <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-white p-0.5 border border-primary/20 shadow-xs group-hover:scale-105 transition-transform">
            <Image
              src="/images/bubt-logo.png"
              alt="BUBT Logo Crest"
              fill
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-primary tracking-tight">
                BUBT <span className="text-foreground">Connect</span>
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-bangla font-semibold tracking-wide hidden sm:block">
              জ্ঞানই শক্তি • Knowledge is Power
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search problems, suggestions, notices, courses..." 
            className="w-full bg-muted/60 pl-9 rounded-full border-border/60 focus-visible:ring-primary/40 text-xs h-9" 
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Quick SOS Trigger Button */}
        <Link
          href="/app/sos"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/10 text-red-600 hover:bg-red-600/20 border border-red-500/30 text-xs font-extrabold transition-colors shadow-2xs"
          title="Campus Emergency SOS Network"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span className="tracking-wide">SOS</span>
        </Link>

        {/* Role Switcher for live role switching */}
        <RoleSwitcher currentRole={profile.role} />

        {/* Language Switcher */}
        <LanguageToggle />

        {/* Notifications */}
        <Link 
          href="/app/notifications"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "relative h-9 w-9")}
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
        </Link>

        {/* Dark Mode */}
        <ThemeToggle />
        
        {/* User Avatar Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-9 w-9 rounded-full ml-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Avatar className="h-9 w-9 border border-border shadow-xs">
              <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || 'User'} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">{profile.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {profile.student_id ? `ID: ${profile.student_id}` : profile.role.toUpperCase()}
                </p>
                <div className="pt-0.5">
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium capitalize bg-primary/10 text-primary">
                    {profile.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/app/profile')} className="cursor-pointer text-xs">
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/app/profile/settings')} className="cursor-pointer text-xs">
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => {
                document.cookie = 'bubt_demo_role=; path=/; max-age=0'
                router.push('/login')
              }} 
              className="text-destructive focus:bg-destructive/10 cursor-pointer text-xs"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
