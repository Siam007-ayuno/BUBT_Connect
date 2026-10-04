'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SafeAttachmentImage } from '@/components/voice-board/safe-attachment-image'
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Bookmark,
  Share2,
  Flag,
  Shield,
  ShieldCheck,
  Lightbulb,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge, PostTypeBadge } from '@/components/ui/status-badge'
import { ReportModal } from '@/components/voice-board/report-modal'
import { UserProfileModal } from '@/components/voice-board/user-profile-modal'
import { formatRelativeTime, getInitials } from '@/lib/utils'
import { toast } from 'sonner'
import type { ExtendedPost } from '@/lib/demo-data'

interface PostCardProps {
  post: ExtendedPost
  onVote?: (postId: string, direction: 1 | -1) => void
  onBookmark?: (postId: string) => void
}

export function PostCard({ post, onVote, onBookmark }: PostCardProps) {
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/app/posts/${post.id}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!', {
      description: 'You can now share this issue with fellow BUBTians.',
    })
  }

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onBookmark?.(post.id)
    toast.success(post.isBookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks')
  }

  const isAnonymous = post.is_anonymous
  const authorName = isAnonymous ? 'Anonymous Student' : (post.author?.full_name || 'Community Member')
  const authorSub = isAnonymous
    ? 'Identity protected'
    : (post.author?.role ? `${post.author.role.toUpperCase()} • ${post.department?.code || 'BUBT'}` : 'BUBT')

  return (
    <>
      <article className={`rounded-xl border bg-card p-4 sm:p-5 shadow-xs transition-all hover:border-primary/40 relative group ${
        post.is_pinned ? 'border-primary/50 bg-primary/2' : ''
      }`}>
        {/* Pinned / Escalated Ribbons */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
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

        {/* Post Title */}
        <Link href={`/app/posts/${post.id}`} className="block group-hover:text-primary transition-colors">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-snug mb-2">
            {post.title}
          </h2>
        </Link>

        {/* Post Body Snippet */}
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-3.5 whitespace-pre-line">
          {post.body}
        </p>

        {/* "How could the university improve this?" Advice box */}
        {post.improvement_suggestion && (
          <div className="mb-3.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-0.5">
                Proposed Improvement Suggestion:
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
          />
        )}

        {/* Official Response Callout (if present) */}
        {post.official_response && (
          <div className="mb-3.5 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="relative h-5 w-5 rounded-full bg-white p-0.5 border border-primary/30 shrink-0">
                <Image src="/images/bubt-logo.png" alt="BUBT Crest" fill className="object-contain" />
              </div>
              <span className="font-bold text-primary">{post.official_response.author_name}</span>
              <span className="text-[10px] text-primary/80 bg-primary/10 px-1.5 py-0.2 rounded font-semibold">
                Official Response
              </span>
            </div>
            <p className="text-muted-foreground line-clamp-2 leading-relaxed">
              &ldquo;{post.official_response.body}&rdquo;
            </p>
          </div>
        )}

        {/* Author Info & Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t text-xs">
          
          {/* Author */}
          <div
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsProfileModalOpen(true)
            }}
            className="flex items-center gap-2 cursor-pointer group/author transition-opacity hover:opacity-85"
            title={isAnonymous ? "Click to view anonymity protection" : `View ${authorName}'s Profile`}
          >
            <Avatar className="h-7 w-7 border group-hover/author:border-primary transition-colors">
              <AvatarImage src={isAnonymous ? '' : (post.author?.avatar_url || '')} />
              <AvatarFallback className={`text-xs font-bold ${isAnonymous ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                {isAnonymous ? '?' : getInitials(authorName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground group-hover/author:text-primary transition-colors">{authorName}</span>
                {isAnonymous ? (
                  <span title="Anonymous identity protected">
                    <Shield className="h-3 w-3 text-muted-foreground" />
                  </span>
                ) : (
                  (post.author?.role === 'authority' || post.author?.role === 'faculty') && (
                    <span title="Verified Staff">
                      <ShieldCheck className="h-3 w-3 text-primary" />
                    </span>
                  )
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {authorSub} • {formatRelativeTime(post.created_at)}
              </span>
            </div>
          </div>

          {/* Upvote & Action Controls */}
          <div className="flex items-center gap-2">
            {/* Voting Component */}
            <div className="flex items-center rounded-lg bg-muted/50 border p-0.5">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onVote?.(post.id, 1)
                }}
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
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onVote?.(post.id, -1)
                }}
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

            {/* Comments Count Button */}
            <Link
              href={`/app/posts/${post.id}`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors text-xs"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{post.comment_count}</span>
            </Link>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={handleBookmarkClick}
              className={`p-1.5 rounded-lg border transition-colors ${
                post.isBookmarked
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
              title="Bookmark Post"
            >
              <Bookmark className={`h-3.5 w-3.5 ${post.isBookmarked ? 'fill-primary' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-lg border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Share Link"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>

            {/* Report Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsReportOpen(true)
              }}
              className="p-1.5 rounded-lg border bg-muted/40 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
              title="Report Content"
            >
              <Flag className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </article>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        itemType="post"
        itemId={post.id}
        itemTitle={post.title}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={post.author || null}
        isAnonymous={isAnonymous}
      />
    </>
  )
}
