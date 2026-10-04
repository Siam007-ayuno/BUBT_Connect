'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  User,
  ShieldCheck,
  Shield,
  GraduationCap,
  Building,
  Mail,
  Calendar,
  ExternalLink,
  BookOpen
} from 'lucide-react'
import { getInitials } from '@/lib/utils'
import Link from 'next/link'
import type { Profile } from '@/lib/types'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: Profile | null
  isAnonymous?: boolean
}

export function UserProfileModal({
  isOpen,
  onClose,
  user,
  isAnonymous = false,
}: UserProfileModalProps) {
  if (isAnonymous) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-sm text-center p-6 space-y-4">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Shield className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-lg font-bold">Identity Protected</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              This post was submitted anonymously under the BUBT Connect Campus Whistleblower & Safe Voice Policy.
            </DialogDescription>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground text-left space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Privacy Assurance
            </p>
            <p className="text-[11px] leading-relaxed">
              Personal credentials and student IDs are securely masked from the public community to foster honest, constructive campus feedback.
            </p>
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={onClose}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  if (!user) return null

  const roleMeta: Record<string, { label: string; color: string }> = {
    student: { label: 'Undergraduate Student', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    faculty: { label: 'Academic Faculty', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    authority: { label: 'University Administration', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    alumni: { label: 'Graduated Alumnus', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    super_admin: { label: 'System Administrator', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  }

  const currentRole = roleMeta[user.role] || roleMeta.student

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-primary/20 via-teal-500/15 to-primary/10 p-6 border-b flex flex-col items-center text-center space-y-3">
          <Avatar className="h-20 w-20 border-2 border-background shadow-md">
            <AvatarImage src={user.avatar_url || ''} />
            <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
              {getInitials(user.full_name || 'BUBT')}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center justify-center gap-1.5">
              <DialogTitle className="text-lg font-bold text-foreground">
                {user.full_name}
              </DialogTitle>
              {user.is_verified && (
                <span title="Verified Campus Member">
                  <ShieldCheck className="h-4 w-4 text-primary fill-primary/20" />
                </span>
              )}
            </div>
            {user.full_name_bn && (
              <p className="text-xs font-serif text-muted-foreground mt-0.5">
                {user.full_name_bn}
              </p>
            )}
            <Badge variant="outline" className={`mt-2 text-xs font-semibold ${currentRole.color}`}>
              {currentRole.label}
            </Badge>
          </div>
        </div>

        {/* User Details */}
        <div className="p-5 space-y-4 text-xs">
          {/* Bio */}
          {user.bio && (
            <p className="text-muted-foreground leading-relaxed italic text-center px-2">
              "{user.bio}"
            </p>
          )}

          <div className="space-y-2 bg-muted/40 p-3 rounded-xl border border-border/60">
            {user.student_id && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Student ID:</span>
                <span className="font-mono font-bold text-foreground">{user.student_id}</span>
              </div>
            )}
            {user.department_id && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Department:</span>
                <span className="font-semibold text-foreground">
                  {user.department_id.replace('dept-', '').toUpperCase()}
                </span>
              </div>
            )}
            {user.batch_id && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Intake / Batch:</span>
                <span className="font-semibold text-foreground">
                  {user.batch_id.replace('batch-cse-', '')}th Intake
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Campus Email:</span>
              <span className="font-mono text-foreground">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Member Since:</span>
              <span className="text-foreground">
                {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>
            <Link href="/app/profile" onClick={onClose}>
              <Button size="sm" className="text-xs gap-1.5 font-semibold">
                <span>View Full Campus ID</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
