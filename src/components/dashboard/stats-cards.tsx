'use client'

import { AlertTriangle, CheckCircle2, Clock, MessageSquare, ShieldAlert, Star, TrendingUp } from 'lucide-react'
import type { ExtendedPost } from '@/lib/demo-data'
import type { ModerationReport } from '@/lib/authority-store'

interface StatsCardsProps {
  posts: ExtendedPost[]
  reports: ModerationReport[]
}

export function StatsCards({ posts, reports }: StatsCardsProps) {
  const total = posts.length
  const escalated = posts.filter((p) => p.is_escalated).length
  const inProgress = posts.filter((p) => p.status === 'in_progress').length
  const resolved = posts.filter((p) => p.status === 'resolved').length
  const pendingReports = reports.filter((r) => r.status === 'pending').length

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Total Issues */}
      <div className="rounded-xl border bg-card p-3.5 shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Total Issues</span>
          <MessageSquare className="h-4 w-4 text-blue-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-foreground">{total}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">+12% this mo</span>
        </div>
      </div>

      {/* Escalated to Authority */}
      <div className="rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 p-3.5 shadow-xs">
        <div className="flex items-center justify-between text-red-700 dark:text-red-400 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider">⚡ Escalated</span>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-red-700 dark:text-red-400">{escalated}</span>
          <span className="text-[10px] text-red-600/80 font-medium">≥25 votes</span>
        </div>
      </div>

      {/* In Progress */}
      <div className="rounded-xl border bg-card p-3.5 shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider">In Progress</span>
          <Clock className="h-4 w-4 text-amber-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-foreground">{inProgress}</span>
          <span className="text-[10px] text-muted-foreground">Active Work</span>
        </div>
      </div>

      {/* Resolution Rate */}
      <div className="rounded-xl border bg-card p-3.5 shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Resolution Rate</span>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {resolutionRate}%
          </span>
          <span className="text-[10px] text-muted-foreground">Target: 85%</span>
        </div>
      </div>

      {/* Student Satisfaction */}
      <div className="rounded-xl border bg-card p-3.5 shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Satisfaction</span>
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-foreground">4.6</span>
          <span className="text-[10px] text-muted-foreground">/ 5.0 (94 reviews)</span>
        </div>
      </div>

      {/* Moderation Pending */}
      <div className="rounded-xl border bg-card p-3.5 shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Safety Queue</span>
          <ShieldAlert className="h-4 w-4 text-purple-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-foreground">{pendingReports}</span>
          <span className="text-[10px] text-muted-foreground">Flags pending</span>
        </div>
      </div>
    </div>
  )
}
