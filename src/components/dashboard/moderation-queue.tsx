'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  FileText,
  History,
  Shield,
  ShieldAlert,
  Trash2,
  UserX,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { formatRelativeTime } from '@/lib/utils'
import { useAuthorityStore, type ModerationReport } from '@/lib/authority-store'

interface ModerationQueueProps {
  currentRole: string
  currentUserName: string
}

export function ModerationQueue({ currentRole, currentUserName }: ModerationQueueProps) {
  const { reports, auditLog, resolveReport } = useAuthorityStore()
  const [filter, setFilter] = useState<'pending' | 'resolved' | 'all'>('pending')

  const handleAction = (reportId: string, action: 'dismiss' | 'remove' | 'warn' | 'ban') => {
    resolveReport(reportId, action, currentUserName, currentRole)
    const labels: Record<string, string> = {
      dismiss: 'Report dismissed (No violation found)',
      remove: 'Content removed from public platform',
      warn: 'Official disciplinary warning issued to author',
      ban: 'Account suspended for guideline violations',
    }
    toast.success(labels[action])
  }

  const displayedReports = reports.filter((r) => {
    if (filter === 'pending') return r.status === 'pending'
    if (filter === 'resolved') return r.status !== 'pending'
    return true
  })

  return (
    <div className="space-y-6">
      {/* Moderation Queue Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs space-y-3 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Community Safety & Moderation Queue
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review flagged content, enforce student code of conduct, and take disciplinary actions.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border text-xs">
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                filter === 'pending'
                  ? 'bg-background text-foreground shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Pending ({reports.filter((r) => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                filter === 'resolved'
                  ? 'bg-background text-foreground shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Resolved ({reports.filter((r) => r.status !== 'pending').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-background text-foreground shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-3 pt-1">
          {displayedReports.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No reports in this view. Campus community is adhering to guidelines!
            </div>
          ) : (
            displayedReports.map((report) => {
              const isPending = report.status === 'pending'

              return (
                <div
                  key={report.id}
                  className={`p-3.5 sm:p-4 rounded-xl border text-xs space-y-3 transition-colors ${
                    isPending
                      ? 'border-destructive/30 bg-destructive/5'
                      : 'border-border bg-card/60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                        #{report.id}
                      </span>
                      <Badge variant="destructive" className="capitalize text-[10px] font-bold">
                        {report.reason}
                      </Badge>
                      <span className="text-muted-foreground">
                        Reported {report.targetType} by <strong>{report.authorName}</strong>
                      </span>
                    </div>

                    <span className="text-[10px] text-muted-foreground">
                      {formatRelativeTime(report.reportedAt)}
                    </span>
                  </div>

                  {/* Snippet / Title */}
                  <div className="p-2.5 rounded-lg bg-background border text-xs text-foreground/90 font-medium">
                    &ldquo;{report.targetTitle}&rdquo;
                  </div>

                  {/* Details */}
                  {report.details && (
                    <p className="text-xs text-muted-foreground leading-relaxed pl-1">
                      <strong>Reporter Notes:</strong> {report.details}
                    </p>
                  )}

                  {/* Resolution status / Action buttons */}
                  <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-2">
                    {isPending ? (
                      <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleAction(report.id, 'dismiss')}
                          className="text-xs text-muted-foreground hover:text-foreground h-7"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Dismiss
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleAction(report.id, 'remove')}
                          className="text-xs text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-500/10 h-7"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove Content
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleAction(report.id, 'warn')}
                          className="text-xs text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800 hover:bg-blue-500/10 h-7"
                        >
                          <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Warn User
                        </Button>
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={() => handleAction(report.id, 'ban')}
                          className="text-xs font-bold h-7"
                        >
                          <UserX className="h-3.5 w-3.5 mr-1" /> Suspend Account
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="font-semibold text-foreground">
                          {report.actionTaken}
                        </span>
                        {report.reviewedBy && (
                          <span className="text-[11px] text-muted-foreground">
                            • Handled by {report.reviewedBy}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Administrative Audit Log */}
      <div className="rounded-xl border bg-card p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Official Proctorial Audit Trail
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            Immutable administrative logs
          </span>
        </div>

        <div className="relative pl-5 border-l-2 border-primary/20 space-y-3 pt-2 text-xs">
          {auditLog.slice(0, 8).map((log) => (
            <div key={log.id} className="relative group">
              <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-primary ring-2 ring-background" />
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-foreground">{log.actorName}</span>
                  <Badge variant="outline" className="text-[9px] px-1 py-0 capitalize">
                    {log.actorRole.replace('_', ' ')}
                  </Badge>
                  <span className="font-semibold text-primary">{log.action}</span>
                  <span className="text-muted-foreground font-mono">[{log.target}]</span>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{log.timestamp}</span>
              </div>
              {log.details && (
                <p className="text-muted-foreground mt-0.5 leading-relaxed">{log.details}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
