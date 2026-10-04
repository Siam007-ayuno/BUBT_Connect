'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SafeAttachmentImage } from '@/components/voice-board/safe-attachment-image'
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Bookmark,
  Share2,
  Flag,
  Shield,
  ShieldCheck,
  Lightbulb,
  Sparkles,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge, PostTypeBadge } from '@/components/ui/status-badge'
import { StatusTracker } from '@/components/voice-board/status-tracker'
import { OfficialResponseCard } from '@/components/voice-board/official-response-card'
import { CommentsSection } from '@/components/voice-board/comments-section'
import { ReportModal } from '@/components/voice-board/report-modal'
import { UserProfileModal } from '@/components/voice-board/user-profile-modal'
import { useVoiceBoardStore } from '@/lib/voice-board-store'
import { useAuth } from '@/hooks/use-auth'
import { DEMO_USERS } from '@/lib/demo-data'
import { formatRelativeTime, getInitials } from '@/lib/utils'
import { toast } from 'sonner'
import { useState } from 'react'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const {
    posts,
    commentsMap,
    votePost,
    toggleBookmark,
    updatePostStatus,
    addOfficialResponse,
    addComment,
    voteComment,
  } = useVoiceBoardStore()

  const { profile } = useAuth()
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  // Current active profile
  const activeProfile = profile || DEMO_USERS.student.profile
  const currentRole = activeProfile?.role || 'student'
  const currentUserName = activeProfile?.full_name || 'Member'

  const post = posts.find((p) => p.id === postId)
  const comments = commentsMap[postId] || []

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Post Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested Voice Board post could not be found or may have been deleted.
        </p>
        <Link href="/app">
          <Button variant="outline" size="sm" className="text-xs">
            Back to Voice Board
          </Button>
        </Link>
      </div>
    )
  }

  const isAnonymous = post.is_anonymous
  const authorName = isAnonymous ? 'Anonymous Student' : (post.author?.full_name || 'Community Member')
  const authorSub = isAnonymous
    ? 'Identity protected'
    : (post.author?.role ? `${post.author.role.toUpperCase()} • ${post.department?.code || 'BUBT'}` : 'BUBT')

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const handleBookmark = () => {
    toggleBookmark(post.id)
    toast.success(post.isBookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b pb-3">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Voice Board
        </Link>
        <span className="text-xs text-muted-foreground">
          Issue ID: #{post.id}
        </span>
      </div>

      {/* Main Post Card */}
      <article className="rounded-xl border bg-card p-5 sm:p-6 shadow-xs space-y-5">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <PostTypeBadge type={post.type} />
            {post.category && (
              <Badge variant="outline" className="text-xs bg-muted/50 border-border/80 text-foreground font-normal">
                {post.category.name_en}
              </Badge>
            )}
            <StatusBadge status={post.status} />
          </div>

          <div className="flex items-center gap-1.5">
            {post.is_escalated && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900 animate-pulse">
                ⚡ Escalated (25+ Upvotes)
              </span>
            )}
            {post.is_pinned && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                📌 Pinned
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground leading-snug">
          {post.title}
        </h1>

        {/* Author row */}
        <div className="flex items-center justify-between gap-3 py-3 border-y text-xs">
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2.5 cursor-pointer group/author transition-opacity hover:opacity-85"
            title={isAnonymous ? "Click to view anonymity protection" : `View ${authorName}'s Profile`}
          >
            <Avatar className="h-8 w-8 border group-hover/author:border-primary transition-colors">
              <AvatarImage src={isAnonymous ? '' : (post.author?.avatar_url || '')} />
              <AvatarFallback className={`text-xs font-bold ${isAnonymous ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                {isAnonymous ? '?' : getInitials(authorName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-bold text-foreground text-sm group-hover/author:text-primary transition-colors">{authorName}</span>
                {isAnonymous ? (
                  <span title="Anonymous identity protected">
                    <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                ) : (
                  (post.author?.role === 'authority' || post.author?.role === 'faculty') && (
                    <span title="Verified Staff">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    </span>
                  )
                )}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {authorSub} • {formatRelativeTime(post.created_at)}
              </span>
            </div>
          </div>

          {/* Voting + Bookmark Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-muted/60 border p-0.5">
              <button
                type="button"
                onClick={() => votePost(post.id, 1)}
                className={`p-1.5 rounded-md transition-colors ${
                  post.userVote === 1
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title="Upvote"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <span className={`px-2 text-xs font-bold ${
                post.userVote === 1 ? 'text-primary' : post.userVote === -1 ? 'text-destructive' : 'text-foreground'
              }`}>
                {post.upvote_count - post.downvote_count}
              </span>
              <button
                type="button"
                onClick={() => votePost(post.id, -1)}
                className={`p-1.5 rounded-md transition-colors ${
                  post.userVote === -1
                    ? 'bg-destructive text-destructive-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title="Downvote"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleBookmark}
              className={`p-1.5 rounded-lg border transition-colors ${
                post.isBookmarked
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
              title="Bookmark Post"
            >
              <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-primary' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-lg border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Share Link"
            >
              <Share2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="p-1.5 rounded-lg border bg-muted/40 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
              title="Report Content"
            >
              <Flag className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Post Full Body */}
        <div className="text-sm sm:text-base text-foreground/90 whitespace-pre-line leading-relaxed">
          {post.body}
        </div>

        {/* Constructive Advice Box */}
        {post.improvement_suggestion && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-950 dark:text-amber-200 flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">
                Author&apos;s Recommendation for University Improvement:
              </span>
              <p className="leading-relaxed">{post.improvement_suggestion}</p>
            </div>
          </div>
        )}

        {/* Attached Image Preview */}
        {post.attachments && post.attachments.length > 0 && (
          <SafeAttachmentImage
            url={post.attachments[0].url}
            alt={post.title}
            containerClassName="rounded-xl overflow-hidden border max-h-96 relative aspect-video bg-muted shadow-xs"
            className="object-contain w-full h-full bg-black/5"
          />
        )}
      </article>

      {/* Official Response Component */}
      <OfficialResponseCard
        response={post.official_response}
        currentRole={currentRole}
        currentUserName={currentUserName}
        onPostOfficialResponse={(body) => {
          addOfficialResponse(
            post.id,
            body,
            currentUserName,
            currentRole,
            activeProfile?.avatar_url || '/images/bubt-logo.png'
          )
        }}
      />

      {/* Issue Status Tracker & Public Timeline */}
      <StatusTracker
        post={post}
        currentRole={currentRole}
        currentUserName={currentUserName}
        onUpdateStatus={(newStatus, note) => {
          updatePostStatus(post.id, newStatus, currentUserName, note)
        }}
      />

      {/* Comments & Replies */}
      <CommentsSection
        postId={post.id}
        comments={comments}
        currentRole={currentRole}
        currentProfile={activeProfile}
        onAddComment={(body, parentId, isAnonymous, isOfficial) => {
          addComment(post.id, body, activeProfile as any, parentId, isAnonymous, isOfficial)
        }}
        onVoteComment={(commentId) => {
          voteComment(post.id, commentId)
        }}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        itemType="post"
        itemId={post.id}
        itemTitle={post.title}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={post.author || null}
        isAnonymous={isAnonymous}
      />
    </div>
  )
}
