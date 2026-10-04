'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ThumbsUp,
  GraduationCap,
  MessageSquare,
  Clock,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'urgent' | 'voice_board' | 'event' | 'academic' | 'career'
  timeAgo: string
  isRead: boolean
  link: string
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Urgent Examination Circular',
    message: 'Controller of Examinations has published the Midterm Examination Schedule for Fall 2026.',
    type: 'urgent',
    timeAgo: '1 hour ago',
    isRead: false,
    link: '/app/notices',
  },
  {
    id: 'notif-2',
    title: 'Voice Board Issue Update',
    message: 'Your report "Wi-Fi Connectivity In Building 2 Labs" was marked IN PROGRESS by IT Directorate.',
    type: 'voice_board',
    timeAgo: '3 hours ago',
    isRead: false,
    link: '/app/posts/post-001',
  },
  {
    id: 'notif-3',
    title: 'Event Reminder: CodeStorm 2026',
    message: 'BUBT CodeStorm 24h Hackathon registration closes this Friday. Check team venue details.',
    type: 'event',
    timeAgo: 'Yesterday',
    isRead: true,
    link: '/app/events',
  },
  {
    id: 'notif-4',
    title: 'Study Resource Upvoted',
    message: 'Your upload "CSE 311 Question Bank (Solved)" reached 90+ upvotes in the resource vault.',
    type: 'academic',
    timeAgo: '2 days ago',
    isRead: true,
    link: '/app/resources',
  },
  {
    id: 'notif-5',
    title: 'Alumni Referral Accepted',
    message: 'Shuvo Kanti Das (Google) reviewed your profile for Software Engineer opening.',
    type: 'career',
    timeAgo: '3 days ago',
    isRead: true,
    link: '/app/alumni',
  },
]

export function NotificationsClient() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    toast.success('All notifications marked as read')
  }

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    )
  }

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.isRead : true))

  const iconConfig: Record<string, { icon: React.ElementType; color: string }> = {
    urgent: { icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
    voice_board: { icon: MessageSquare, color: 'text-blue-500 bg-blue-500/10' },
    event: { icon: Calendar, color: 'text-purple-500 bg-purple-500/10' },
    academic: { icon: ThumbsUp, color: 'text-emerald-500 bg-emerald-500/10' },
    career: { icon: GraduationCap, color: 'text-amber-500 bg-amber-500/10' },
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs font-semibold">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time university alerts, issue status resolutions, and academic updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Mark all read</span>
            </Button>
          )}

          <div className="flex rounded-lg border bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                filter === 'all' ? "bg-background shadow-xs text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                filter === 'unread' ? "bg-background shadow-xs text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card space-y-2">
          <Bell className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
          <p className="text-sm font-semibold text-foreground">No unread notifications</p>
          <p className="text-xs text-muted-foreground">You are all caught up on BUBT Connect updates.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => {
            const config = iconConfig[item.type] || iconConfig.urgent
            const Icon = config.icon

            return (
              <Card
                key={item.id}
                className={cn(
                  "border transition-all hover:border-primary/40 bg-card overflow-hidden group",
                  !item.isRead && "border-l-4 border-l-primary bg-primary/[0.02]"
                )}
              >
                <CardContent className="p-4 flex items-start gap-3.5">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", config.color)}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={item.link}
                        className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <span className="text-[11px] text-muted-foreground shrink-0">{item.timeAgo}</span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.message}
                    </p>

                    <div className="pt-1 flex items-center gap-3 text-xs">
                      <Link
                        href={item.link}
                        className="text-primary hover:underline font-medium text-[11px]"
                      >
                        View Details →
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleRead(item.id)}
                        className="text-muted-foreground hover:text-foreground text-[11px]"
                      >
                        {item.isRead ? 'Mark Unread' : 'Mark Read'}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
