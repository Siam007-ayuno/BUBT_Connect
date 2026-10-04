'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, PlayCircle, XCircle, ArrowRight, Shield, Star, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import type { ExtendedPost } from '@/lib/demo-data'

interface StatusTrackerProps {
  post: ExtendedPost
  currentRole?: string
  currentUserName?: string
  onUpdateStatus?: (newStatus: 'open' | 'under_review' | 'in_progress' | 'resolved' | 'rejected', note: string) => void
}

const STEPS = [
  { id: 'open', label: 'Open', icon: Clock },
  { id: 'under_review', label: 'Under Review', icon: PlayCircle },
  { id: 'in_progress', label: 'In Progress', icon: ArrowRight },
  { id: 'resolved', label: 'Resolved', icon: CheckCircle2 },
]

export function StatusTracker({ post, currentRole, currentUserName, onUpdateStatus }: StatusTrackerProps) {
  const isAuthorityOrAdmin = currentRole === 'authority' || currentRole === 'super_admin'
  const isRejected = post.status === 'rejected'
  
  // Status update state for authority
  const [selectedStatus, setSelectedStatus] = useState<string>(post.status)
  const [statusNote, setStatusNote] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  // Student satisfaction rating state
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [ratingComment, setRatingComment] = useState('')
  const [ratingSubmitted, setRatingSubmitted] = useState(false)

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'open': return 0
      case 'under_review': return 1
      case 'in_progress': return 2
      case 'resolved': return 3
      default: return 0
    }
  }

  const currentStepIndex = getStepIndex(post.status)

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!statusNote.trim()) {
      toast.error('Please provide a brief public note explaining this status transition.')
      return
    }
    setIsUpdating(true)
    setTimeout(() => {
      onUpdateStatus?.(selectedStatus as any, statusNote)
      setIsUpdating(false)
      setStatusNote('')
      toast.success(`Issue status updated to: ${selectedStatus.replace('_', ' ').toUpperCase()}`)
    }, 400)
  }

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a star rating.')
      return
    }
    setRatingSubmitted(true)
    toast.success('Thank you! Your feedback helps BUBT improve administration.')
  }

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-foreground">Issue Resolution Workflow</span>
          {post.is_escalated && (
            <Badge variant="destructive" className="text-[10px] animate-pulse">
              ⚡ Escalated (25+ Upvotes)
            </Badge>
          )}
        </div>
        <div>
          {isRejected ? (
            <Badge variant="destructive" className="gap-1 text-xs">
              <XCircle className="h-3 w-3" /> Rejected
            </Badge>
          ) : (
            <Badge className="capitalize text-xs font-semibold">
              {post.status.replace('_', ' ')}
            </Badge>
          )}
        </div>
      </div>

      {/* Visual Stepper */}
      {!isRejected ? (
        <div className="relative py-2">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-muted -z-0">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between relative z-10">
            {STEPS.map((step, idx) => {
              const isPassed = idx <= currentStepIndex
              const isCurrent = idx === currentStepIndex
              const Icon = step.icon

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-md font-bold'
                        : isPassed
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground border'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`text-[11px] mt-2 font-medium tracking-tight whitespace-nowrap ${
                      isCurrent
                        ? 'text-primary font-bold'
                        : isPassed
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs border border-destructive/20 flex items-center gap-2">
          <XCircle className="h-4 w-4 shrink-0" />
          <span>This issue was marked as rejected by university administration following review.</span>
        </div>
      )}

      {/* Timeline entries */}
      {post.status_timeline && post.status_timeline.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            Public History & Audit Trail:
          </span>
          <div className="relative pl-5 border-l-2 border-primary/20 space-y-3">
            {post.status_timeline.map((entry, i) => (
              <div key={i} className="relative group text-xs">
                {/* Timeline node */}
                <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-primary ring-2 ring-background" />
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-foreground">{entry.actor}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{entry.date}</span>
                </div>
                <p className="text-muted-foreground mt-0.5 leading-relaxed">{entry.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Authority Control Panel: Update status directly */}
      {isAuthorityOrAdmin && onUpdateStatus && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 p-3.5 space-y-3">
          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 text-xs font-bold">
            <Shield className="h-4 w-4" />
            <span>Authority Management: Transition Issue Status</span>
          </div>

          <form onSubmit={handleStatusSubmit} className="space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  New Status:
                </label>
                <Select value={selectedStatus} onValueChange={(val) => { if (val) setSelectedStatus(val) }}>
                  <SelectTrigger className="h-8 text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Responsible Entity:
                </label>
                <div className="h-8 px-2.5 rounded-md border bg-muted/50 text-xs flex items-center font-medium">
                  {currentUserName || 'Proctor Office & Student Affairs'}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                Public Timeline Note (visible to students):
              </label>
              <Textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="State the steps taken, work order numbers, or official updates..."
                rows={2}
                className="text-xs bg-background"
                required
              />
            </div>

            <Button type="submit" size="sm" disabled={isUpdating} className="w-full text-xs font-bold h-8">
              {isUpdating ? 'Saving Update...' : 'Commit Status Change & Notify Community'}
            </Button>
          </form>
        </div>
      )}

      {/* Student Satisfaction Rating (When post is Resolved) */}
      {post.status === 'resolved' && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Issue Resolved — Student Satisfaction Rating</span>
            </div>
            {ratingSubmitted && (
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                ✓ Feedback recorded
              </span>
            )}
          </div>

          {!ratingSubmitted ? (
            <form onSubmit={handleRatingSubmit} className="space-y-2">
              <p className="text-xs text-muted-foreground">
                How satisfied are you with the university&apos;s resolution of this issue?
              </p>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground/40'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-muted-foreground ml-2 font-medium">
                  {rating === 5 && 'Outstanding'}
                  {rating === 4 && 'Very Satisfied'}
                  {rating === 3 && 'Acceptable'}
                  {rating === 2 && 'Needs Improvement'}
                  {rating === 1 && 'Unsatisfactory'}
                </span>
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Optional comment on the resolution quality..."
                  rows={1}
                  className="text-xs bg-background"
                />
                <Button type="submit" size="sm" variant="default" className="text-xs shrink-0 self-end">
                  Submit Rating
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-xs text-muted-foreground">
              Thank you for providing your feedback ({rating}/5 Stars). This data feeds directly into the Authority Analytics dashboard.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
