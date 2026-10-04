'use client'

import {
  Users,
  Award,
  Calendar,
  Mail,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  UserCheck,
  CheckCircle2
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClubItem } from '@/lib/campus-life-data'

interface ClubDetailModalProps {
  club: ClubItem | null
  isOpen: boolean
  onClose: () => void
  isJoined: boolean
  onOpenJoinModal: (club: ClubItem) => void
  onToggleMembership: (clubId: string) => void
}

export function ClubDetailModal({
  club,
  isOpen,
  onClose,
  isJoined,
  onOpenJoinModal,
  onToggleMembership,
}: ClubDetailModalProps) {
  if (!club) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogTitle className="sr-only">{club.name}</DialogTitle>
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-teal-500/10 p-6 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground font-black text-xl flex items-center justify-center shadow-md">
                {club.shortCode.slice(0, 3)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{club.name}</h2>
                  <Badge variant="outline" className="text-xs uppercase font-mono">
                    {club.category}
                  </Badge>
                </div>
                <p className="text-xs italic text-muted-foreground mt-0.5 font-serif">
                  "{club.motto}"
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Est. {club.establishedYear}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {club.memberCount} Registered Members
                  </span>
                </div>
              </div>
            </div>

            {/* Join / Status CTA */}
            <div>
              {isJoined ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                  onClick={() => onToggleMembership(club.id)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Member (Leave)</span>
                </Button>
              ) : club.isRecruiting ? (
                <Button
                  size="sm"
                  className="gap-1.5 bg-primary text-primary-foreground shadow-sm"
                  onClick={() => {
                    onClose()
                    onOpenJoinModal(club)
                  }}
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Apply to Join</span>
                </Button>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Recruitment Closed
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Recruitment Notice Banner */}
          {club.isRecruiting && (
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  <strong>Fall 2026 Membership Drive Open!</strong> Apply before {club.recruitmentDeadline || 'end of semester'}.
                </span>
              </div>
              {!isJoined && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs bg-emerald-600 text-white hover:bg-emerald-700 border-none shrink-0"
                  onClick={() => {
                    onClose()
                    onOpenJoinModal(club)
                  }}
                >
                  Apply Now
                </Button>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">About the Society</h4>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {club.description}
            </p>
          </div>

          {/* Leadership & Advisory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-primary" /> Faculty Advisor
              </span>
              <p className="text-sm font-bold text-foreground">{club.advisor}</p>
              <p className="text-xs text-muted-foreground">Bangladesh University of Business and Technology</p>
            </div>

            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Club President
              </span>
              <p className="text-sm font-bold text-foreground">{club.president}</p>
              <p className="text-xs text-muted-foreground">Executive Committee Lead</p>
            </div>
          </div>

          {/* Executive Committee Panel */}
          {club.executives && club.executives.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Executive Committee Panel
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {club.executives.map((exec, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border bg-card text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{exec.name}</p>
                      <p className="text-muted-foreground text-[11px]">{exec.designation}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {exec.intake}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>Official Inquiries: <strong className="text-foreground">{club.contactEmail}</strong></span>
            </div>

            {club.facebookPage && (
              <a
                href={club.facebookPage}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                <span>Community Facebook Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
