'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { 
  Bell, 
  Search, 
  PlusCircle, 
  CheckCheck, 
  CalendarDays, 
  FileText, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  Filter,
  GraduationCap,
  Building,
  RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNoticesStore } from '@/lib/notices-store'
import { OfficialNotice } from '@/lib/notices-data'
import { NoticeCard } from '@/components/notices/notice-card'
import { NoticeDetailModal } from '@/components/notices/notice-detail-modal'
import { PublishNoticeModal } from '@/components/notices/publish-notice-modal'
import { RoutineHub } from '@/components/notices/routine-hub'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface NoticesClientProps {
  userRole?: string
  userName?: string
}

const CATEGORIES = [
  { id: 'all', label: 'All Notices' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'exam', label: 'Exams' },
  { id: 'academic', label: 'Academic' },
  { id: 'scholarship', label: 'Scholarships' },
  { id: 'fees', label: 'Fees & Accounts' },
  { id: 'administrative', label: 'Admin' },
]

export function NoticesClient({ userRole = 'student', userName = 'Student' }: NoticesClientProps) {
  const searchParams = useSearchParams()
  const {
    notices,
    readNoticeIds,
    unreadCount,
    toggleMarkAsRead,
    markAllAsRead,
    publishNotice,
    deleteNotice,
    resetToDefault,
    classRoutines,
    examRoutines,
  } = useNoticesStore()

  const [activeTab, setActiveTab] = useState<'notices' | 'routines'>('notices')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [selectedNotice, setSelectedNotice] = useState<OfficialNotice | null>(null)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)

  // Check URL param for deep link reference
  useEffect(() => {
    const refParam = searchParams.get('ref')
    if (refParam && notices.length > 0) {
      const match = notices.find((n) => n.referenceNo.toLowerCase() === refParam.toLowerCase() || n.id === refParam)
      if (match) {
        setSelectedNotice(match)
      }
    }
  }, [searchParams, notices])

  const canPublish = userRole === 'authority' || userRole === 'super_admin' || userRole === 'faculty'

  // Filter notices
  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      // Category match
      const matchCategory =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'urgent'
          ? notice.isUrgent
          : notice.category === selectedCategory

      // Read filter
      const isRead = readNoticeIds.has(notice.id)
      const matchRead =
        readFilter === 'all' ? true : readFilter === 'unread' ? !isRead : isRead

      // Search match
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        notice.title.toLowerCase().includes(q) ||
        notice.content.toLowerCase().includes(q) ||
        notice.referenceNo.toLowerCase().includes(q) ||
        notice.issuingAuthority.toLowerCase().includes(q) ||
        notice.authorName.toLowerCase().includes(q)

      return matchCategory && matchRead && matchSearch
    })
  }, [notices, selectedCategory, readFilter, searchQuery, readNoticeIds])

  // Count by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: notices.length, urgent: 0 }
    notices.forEach((n) => {
      if (n.isUrgent) counts.urgent = (counts.urgent || 0) + 1
      counts[n.category] = (counts[n.category] || 0) + 1
    })
    return counts
  }, [notices])

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top University Announcement Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-teal-500/10 border border-primary/20 p-5 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 shadow-xs">
              <Image
                src="/images/bubt-logo.png"
                alt="BUBT Crest"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  BUBT Notice & Routine Hub
                </h1>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs font-semibold px-2 py-0.5">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Official circulars, exam schedules, class routines, and administrative memorandums.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs bg-background/80"
                onClick={() => {
                  markAllAsRead()
                  toast.success('All circulars marked as read')
                }}
              >
                <CheckCheck className="h-4 w-4 text-emerald-600" />
                <span>Mark All Read</span>
              </Button>
            )}

            {canPublish && (
              <Button
                size="sm"
                className="h-9 gap-1.5 text-xs font-semibold shadow-xs"
                onClick={() => setIsPublishModalOpen(true)}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Publish Notice</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Tabs: Official Notices vs Routine Hub */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="space-y-6">
        <div className="border-b border-border flex items-center justify-between">
          <TabsList className="bg-transparent h-12 p-0 gap-6 border-none">
            <TabsTrigger
              value="notices"
              className="relative h-12 rounded-none border-b-2 border-transparent px-3 text-sm font-semibold data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary transition-all flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              <span>Official Circulars</span>
              <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-normal">
                {notices.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="routines"
              className="relative h-12 rounded-none border-b-2 border-transparent px-3 text-sm font-semibold data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary transition-all flex items-center gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Routine Hub (Class & Exam)</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Fall 2026
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Official Notices Feed */}
        <TabsContent value="notices" className="space-y-5 m-0 focus-visible:outline-none">
          {/* Controls: Search, Categories, Read/Unread Filter */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notices by title, reference memo, or issuing office..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-xs sm:text-sm"
                />
              </div>

              {/* Read Filter Buttons */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border shrink-0">
                <button
                  type="button"
                  onClick={() => setReadFilter('all')}
                  className={cn(
                    "text-xs px-2.5 py-1.5 rounded-md font-medium transition-all",
                    readFilter === 'all' ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All ({notices.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReadFilter('unread')}
                  className={cn(
                    "text-xs px-2.5 py-1.5 rounded-md font-medium transition-all flex items-center gap-1",
                    readFilter === 'unread' ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  type="button"
                  onClick={() => setReadFilter('read')}
                  className={cn(
                    "text-xs px-2.5 py-1.5 rounded-md font-medium transition-all",
                    readFilter === 'read' ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Read ({notices.length - unreadCount})
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id
                const count = categoryCounts[cat.id] || 0
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full font-medium transition-all shrink-0 border flex items-center gap-1.5",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                    )}
                  >
                    <span>{cat.label}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full",
                      isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notices Feed List */}
          {filteredNotices.length === 0 ? (
            <div className="text-center py-16 border rounded-2xl bg-card space-y-3">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
              <p className="text-base font-semibold text-foreground">No circular notices match your filters</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No circulars found matching the selected category, read state, or keyword search.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setSelectedCategory('all')
                    setReadFilter('all')
                    setSearchQuery('')
                  }}
                >
                  Clear Filters
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground gap-1"
                  onClick={() => {
                    resetToDefault()
                    toast.success('Reset demo notices to official catalog')
                  }}
                >
                  <RotateCcw className="h-3 w-3" />
                  Restore Default Circulars
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  isRead={readNoticeIds.has(notice.id)}
                  onToggleRead={toggleMarkAsRead}
                  onOpenDetails={(n) => setSelectedNotice(n)}
                  onDelete={deleteNotice}
                  canManage={canPublish}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Routine Hub */}
        <TabsContent value="routines" className="m-0 focus-visible:outline-none">
          <RoutineHub classRoutines={classRoutines} examRoutines={examRoutines} />
        </TabsContent>
      </Tabs>

      {/* Official Circular Letterhead Modal */}
      <NoticeDetailModal
        notice={selectedNotice}
        isOpen={!!selectedNotice}
        onClose={() => setSelectedNotice(null)}
        isRead={selectedNotice ? readNoticeIds.has(selectedNotice.id) : false}
        onToggleRead={toggleMarkAsRead}
      />

      {/* Notice Publisher Modal */}
      <PublishNoticeModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublish={publishNotice}
        userRole={userRole}
        userName={userName}
      />
    </div>
  )
}
