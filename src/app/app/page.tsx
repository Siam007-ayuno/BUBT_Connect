'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Flame, MessageSquare, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, CreditCard, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { PostCard } from '@/components/voice-board/post-card'
import { FeedFilters, type FilterState } from '@/components/voice-board/feed-filters'
import { CreatePostModal } from '@/components/voice-board/create-post-modal'
import { useVoiceBoardStore } from '@/lib/voice-board-store'
import { useAuth } from '@/hooks/use-auth'
import { DEMO_USERS } from '@/lib/demo-data'
import { getInitials } from '@/lib/utils'

export default function VoiceBoardPage() {
  const { posts, votePost, toggleBookmark, addPost } = useVoiceBoardStore()
  const { profile } = useAuth()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Current active profile fallback for demo
  const activeProfile = profile || DEMO_USERS.student.profile

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    category: 'all',
    department: 'all',
    status: 'all',
    sortBy: 'trending',
  })

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      department: 'all',
      status: 'all',
      sortBy: 'trending',
    })
  }

  // Filtered & Sorted Posts
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        // Search filter
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase()
          const inTitle = post.title.toLowerCase().includes(query)
          const inBody = post.body.toLowerCase().includes(query)
          const inCategory = post.category?.name_en.toLowerCase().includes(query)
          if (!inTitle && !inBody && !inCategory) return false
        }
        // Type filter
        if (filters.type !== 'all' && post.type !== filters.type) {
          return false
        }
        // Category filter
        if (filters.category !== 'all' && post.category_id !== filters.category) {
          return false
        }
        // Department filter
        if (filters.department !== 'all') {
          if (post.department_id !== filters.department) return false
        }
        // Status filter
        if (filters.status !== 'all' && post.status !== filters.status) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        if (filters.sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        if (filters.sortBy === 'upvoted') {
          return (b.upvote_count - b.downvote_count) - (a.upvote_count - a.downvote_count)
        }
        // Trending sort: high votes + comments weighted by recency
        const scoreA = (a.upvote_count * 2 + a.comment_count * 3) + (a.is_escalated ? 15 : 0) + (a.is_pinned ? 50 : 0)
        const scoreB = (b.upvote_count * 2 + b.comment_count * 3) + (b.is_escalated ? 15 : 0) + (b.is_pinned ? 50 : 0)
        return scoreB - scoreA
      })
  }, [posts, filters])

  // Summary stats
  const totalOpen = posts.filter((p) => p.status === 'open' || p.status === 'under_review').length
  const totalInProgress = posts.filter((p) => p.status === 'in_progress').length
  const totalResolved = posts.filter((p) => p.status === 'resolved').length
  const totalEscalated = posts.filter((p) => p.is_escalated).length

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Voice Board
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-primary/10 text-primary">
              Live Feed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Democratic forum for BUBT students, faculty, and authority. Raise concerns, propose ideas, and follow issue resolution.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="font-bold text-xs gap-1.5 shadow-md shrink-0 h-10 px-4"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Active User Persona Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border bg-card shadow-xs">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-primary/30">
            <AvatarImage src={activeProfile.avatar_url || ''} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {getInitials(activeProfile.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">{activeProfile?.full_name || 'BUBTian'}</span>
              <Badge variant="outline" className="text-[10px] capitalize font-medium">
                {(activeProfile?.role || 'student').replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {activeProfile?.student_id ? `ID: ${activeProfile.student_id}` : (activeProfile?.department_id ? `Dept: ${activeProfile.department_id.replace('dept-', '').toUpperCase()}` : 'Campus Member')} • {activeProfile?.batch_id ? `${activeProfile.batch_id.replace('batch-cse-', '')}th Intake` : 'BUBT Permanent Campus'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/app/profile">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-semibold">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              <span>My Campus Profile</span>
            </Button>
          </Link>
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="sm"
            className="h-8 font-bold text-xs gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Post</span>
          </Button>
        </div>
      </div>

      {/* Community KPI Tracker Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="rounded-xl border bg-card p-3 shadow-xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <MessageSquare className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-lg font-black text-foreground block leading-tight">{posts.length}</span>
            <span className="text-[11px] text-muted-foreground">Community Posts</span>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-3 shadow-xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-lg font-black text-foreground block leading-tight">{totalOpen}</span>
            <span className="text-[11px] text-muted-foreground">Under Review</span>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-3 shadow-xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-lg font-black text-foreground block leading-tight">{totalInProgress}</span>
            <span className="text-[11px] text-muted-foreground">In Progress</span>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-3 shadow-xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-lg font-black text-foreground block leading-tight">{totalResolved}</span>
            <span className="text-[11px] text-muted-foreground">Resolved Issues</span>
          </div>
        </div>
      </div>

      {/* Feed Filters */}
      <FeedFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-xl border border-dashed bg-card/60">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-bold mb-1">No posts found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
              No Voice Board entries match your selected filters. Try clearing your search or filters.
            </p>
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs">
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onVote={votePost}
              onBookmark={toggleBookmark}
            />
          ))
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        currentProfile={activeProfile}
        existingPosts={posts}
        onPostCreated={addPost}
      />
    </div>
  )
}
