'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Circle, 
  Share2, 
  AlertTriangle, 
  Pin, 
  Calendar, 
  Building2, 
  ExternalLink,
  Trash2
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { OfficialNotice } from '@/lib/notices-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface NoticeCardProps {
  notice: OfficialNotice
  isRead: boolean
  onToggleRead: (id: string) => void
  onOpenDetails: (notice: OfficialNotice) => void
  onDelete?: (id: string) => void
  canManage?: boolean
}

export function NoticeCard({
  notice,
  isRead,
  onToggleRead,
  onOpenDetails,
  onDelete,
  canManage = false,
}: NoticeCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/app/notices?ref=${encodeURIComponent(notice.referenceNo)}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Notice circular link copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const categoryConfig: Record<string, { label: string; color: string; border: string }> = {
    urgent: { label: 'Urgent Circular', color: 'bg-red-500/10 text-red-600 dark:text-red-400', border: 'border-red-500/30' },
    exam: { label: 'Exam Schedule', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' },
    academic: { label: 'Academic Notice', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
    scholarship: { label: 'Scholarship & Waiver', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' },
    fees: { label: 'Accounts & Dues', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' },
    administrative: { label: 'Administrative', color: 'bg-slate-500/10 text-slate-700 dark:text-slate-300', border: 'border-slate-500/30' },
  }

  const currentCategory = categoryConfig[notice.category] || categoryConfig.administrative

  const formattedDate = new Date(notice.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Card 
      onClick={() => onOpenDetails(notice)}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md border relative overflow-hidden group",
        !isRead ? "bg-card border-l-4 border-l-primary shadow-sm" : "bg-card/75 opacity-95",
        notice.isUrgent && "border-l-4 border-l-red-500 dark:border-l-red-600 bg-red-500/[0.02]"
      )}
    >
      {/* Urgent top stripe */}
      {notice.isUrgent && (
        <div className="bg-red-500 text-white text-[11px] font-semibold tracking-wider px-3 py-0.5 flex items-center justify-between uppercase">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
            <span>High Priority Circular</span>
          </div>
          <span className="font-mono opacity-90">{notice.referenceNo}</span>
        </div>
      )}

      <CardContent className={cn("p-5 space-y-3.5", notice.isUrgent && "pt-3.5")}>
        {/* Header badges and meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("font-medium", currentCategory.color, currentCategory.border)}>
              {currentCategory.label}
            </Badge>

            {notice.isPinned && (
              <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
                <Pin className="h-3 w-3" />
                Pinned
              </Badge>
            )}

            {!notice.isUrgent && (
              <span className="font-mono text-muted-foreground text-[11px] bg-muted/60 px-2 py-0.5 rounded">
                Ref: {notice.referenceNo}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>

            {/* Read status toggle button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation()
                onToggleRead(notice.id)
                toast.success(isRead ? 'Marked as unread' : 'Marked as read')
              }}
              title={isRead ? 'Mark as unread' : 'Mark as read'}
            >
              {isRead ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Read
                </span>
              ) : (
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Circle className="h-3.5 w-3.5 fill-primary" />
                  Unread
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Title */}
        <h3 className={cn(
          "text-base md:text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary leading-snug",
          !isRead && "font-bold"
        )}>
          {notice.title}
        </h3>

        {/* Excerpt preview */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed whitespace-pre-line">
          {notice.content}
        </p>

        {/* Footer meta: Issuing Office, Target Depts & Attachment */}
        <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="font-medium text-foreground">{notice.issuingAuthority}</span>
              <span className="mx-1.5 opacity-40">•</span>
              <span>Target: {notice.targetDepartments.includes('all') ? 'All Students & Faculty' : notice.targetDepartments.join(', ').toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notice.attachmentName && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted text-foreground text-xs font-medium border border-border">
                <FileText className="h-3.5 w-3.5 text-red-500" />
                <span className="max-w-[130px] truncate">{notice.attachmentName}</span>
                {notice.attachmentSize && (
                  <span className="text-muted-foreground text-[10px]">({notice.attachmentSize})</span>
                )}
              </span>
            )}

            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onOpenDetails(notice)
              }}
            >
              <span>View Circular</span>
              <ExternalLink className="h-3.5 w-3.5 ml-0.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleCopy}
              title="Copy Notice Link"
            >
              <Share2 className="h-3.5 w-3.5" />
            </Button>

            {canManage && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Are you sure you want to delete this official circular?')) {
                    onDelete(notice.id)
                    toast.success('Notice removed')
                  }
                }}
                title="Delete circular"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
