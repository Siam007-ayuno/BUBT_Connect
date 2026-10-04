'use client'

import {
  MessageSquare,
  Bell,
  Calendar,
  GraduationCap,
  Users,
  BookOpen,
  Search,
  Phone,
  BarChart3,
  User,
  Heart,
  AlertOctagon
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface SidebarNavProps {
  role?: string
}

const ITEMS = [
  { label: 'Home', icon: MessageSquare, href: '/app' },
  {
    label: 'Campus SOS',
    icon: AlertOctagon,
    href: '/app/sos',
    badge: 'Emergency',
    badgeClass: 'bg-red-500/10 text-red-600 border-red-500/20 animate-pulse',
    iconClass: 'text-red-600',
  },
  {
    label: 'Blood Donation',
    icon: Heart,
    href: '/app/blood-donation',
    badge: 'Urgent',
    badgeClass: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    iconClass: 'text-rose-600',
  },
  { label: 'Notices', icon: Bell, href: '/app/notices' },
  { label: 'Events', icon: Calendar, href: '/app/events' },
  { label: 'Alumni', icon: GraduationCap, href: '/app/alumni' },
  { label: 'Clubs', icon: Users, href: '/app/clubs' },
  { label: 'Resources', icon: BookOpen, href: '/app/resources' },
  { label: 'Lost & Found', icon: Search, href: '/app/lost-found' },
  { label: 'Directory', icon: Phone, href: '/app/directory' },
  { label: 'My Profile', icon: User, href: '/app/profile' },
]

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname()
  const showDashboard = role === 'authority' || role === 'super_admin'

  return (
    <nav className="flex flex-col gap-1 p-4 w-60 border-r border-border h-[calc(100vh-64px)] overflow-y-auto hidden lg:flex sticky top-16 bg-sidebar">
      {ITEMS.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== '/app')
        return (
          <Link key={item.href} href={item.href}>
            <span className={cn(
              "flex items-center justify-between px-3 py-2 rounded-md transition-colors text-xs font-medium",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}>
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-4.5 w-4.5", item.iconClass || "text-sidebar-foreground")} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-4 uppercase font-bold", item.badgeClass)}>
                  {item.badge}
                </Badge>
              )}
            </span>
          </Link>
        )
      })}
      
      {showDashboard && (
        <>
          <div className="h-px bg-border my-2" />
          <Link href="/app/dashboard">
            <span className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-xs font-medium",
              pathname.startsWith('/app/dashboard')
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}>
              <BarChart3 className="h-4.5 w-4.5" />
              <span>Dashboard</span>
            </span>
          </Link>
        </>
      )}
    </nav>
  )
}
