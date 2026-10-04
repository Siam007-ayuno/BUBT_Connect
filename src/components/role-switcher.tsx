'use client'

import { useState } from 'react'
import { DEMO_USERS } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Shield, GraduationCap, Users, BookOpen, Crown, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

const ICONS: Record<string, React.ElementType> = {
  student: Users,
  faculty: BookOpen,
  authority: Shield,
  alumni: GraduationCap,
  super_admin: Crown,
}

interface RoleSwitcherProps {
  currentRole: string
}

export function RoleSwitcher({ currentRole }: RoleSwitcherProps) {
  const [role, setRole] = useState(currentRole)

  const handleRoleChange = (newRole: string) => {
    document.cookie = `bubt_demo_role=${newRole}; path=/; max-age=86400`
    setRole(newRole)
    const userLabel = DEMO_USERS[newRole]?.label || newRole
    toast.success(`Switched persona to: ${userLabel}`)

    // If on /app/dashboard and switching to student/faculty/alumni, redirect to /app (Voice Board)
    if (
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith('/app/dashboard') &&
      newRole !== 'authority' &&
      newRole !== 'super_admin'
    ) {
      window.location.href = '/app'
    } else {
      window.location.reload()
    }
  }

  const CurrentIcon = ICONS[role] || Users

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 cursor-pointer">
        <CurrentIcon className="h-3.5 w-3.5" />
        <span className="capitalize">{role.replace('_', ' ')}</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Switch Demo Persona
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(DEMO_USERS).map(([key, data]) => {
          const Icon = ICONS[key] || Users
          const isSelected = key === role
          const customName = typeof document !== 'undefined' && key === 'student'
            ? document.cookie.match(/bubt_student_name=([^;]+)/)?.[1]
            : null
          const itemLabel = customName ? `${decodeURIComponent(customName)} (Student)` : data.label
          const itemDesc = customName ? 'Verified BUBT Student Persona' : data.description

          return (
            <DropdownMenuItem
              key={key}
              onClick={() => handleRoleChange(key)}
              className="flex items-start gap-2.5 py-2 cursor-pointer"
            >
              <div
                className={`p-1.5 rounded-md ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold flex items-center gap-1.5">
                  {itemLabel}
                  {isSelected && (
                    <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.2 rounded font-bold">
                      Active
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-muted-foreground line-clamp-1">
                  {itemDesc}
                </span>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
