import { Badge } from '@/components/ui/badge'
import { Shield, GraduationCap, Users, BookOpen, Crown } from 'lucide-react'
import type { UserRole } from '@/lib/types'
import { cn } from '@/lib/utils'

const roleConfig: Record<string, { icon: React.ElementType; className: string; label: string }> = {
  student: { icon: Users, className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Student' },
  faculty: { icon: BookOpen, className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', label: 'Faculty' },
  authority: { icon: Shield, className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'Authority' },
  alumni: { icon: GraduationCap, className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Alumni' },
  super_admin: { icon: Crown, className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Super Admin' },
}

export function RoleBadge({ role }: { role: string }) {
  const config = roleConfig[role] || roleConfig.student
  const Icon = config.icon
  return (
    <Badge variant="secondary" className={cn('gap-1 text-xs', config.className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}
