'use client'

import { useState } from 'react'
import { MessageSquare, ThumbsUp, CornerDownRight, Shield, ShieldCheck, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { formatRelativeTime, getInitials } from '@/lib/utils'
import { toast } from 'sonner'
import type { ExtendedComment } from '@/lib/demo-data'
import { UserProfileModal } from '@/components/voice-board/user-profile-modal'

interface CommentsSectionProps {
  postId: string
  comments: ExtendedComment[]
  currentRole: string
  currentProfile: any
  onAddComment: (body: string, parentId: string | null, isAnonymous: boolean, isOfficial: boolean) => void
  onVoteComment: (commentId: string) => void
}

export function CommentsSection({
  postId,
  comments,
  currentRole,
  currentProfile,
  onAddComment,
  onVoteComment,
}: CommentsSectionProps) {
  const [commentBody, setCommentBody] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isOfficial, setIsOfficial] = useState(false)
  const [replyToId, setReplyToId] = useState<string | null>(null)
  const [replyBody, setReplyBody] = useState('')
  const [replyAnonymous, setReplyAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{ user: any; isAnonymous: boolean } | null>(null)

  const canPostOfficial = currentRole === 'authority' || currentRole === 'super_admin' || currentRole === 'faculty'

  const handleSubmitMainComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentBody.trim()) {
      toast.error('Comment cannot be empty.')
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      onAddComment(commentBody, null, isAnonymous, isOfficial)
      setCommentBody('')
      setIsSubmitting(false)
      toast.success(isAnonymous ? 'Anonymous comment posted' : 'Comment posted')
    }, 300)
  }

  const handleSubmitReply = (parentId: string) => {
    if (!replyBody.trim()) {
      toast.error('Reply cannot be empty.')
      return
    }
    onAddComment(replyBody, parentId, replyAnonymous, false)
    setReplyBody('')
    setReplyToId(null)
    toast.success('Reply submitted')
  }

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h3 className="font-bold text-sm sm:text-base">
            Discussion & Community Replies ({comments.length})
          </h3>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          Follows BUBT Community Guidelines
        </span>
      </div>

      {/* Main Add Comment Box */}
      <form onSubmit={handleSubmitMainComment} className="space-y-3 bg-muted/30 p-3.5 rounded-xl border">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7 border">
            <AvatarImage src={isAnonymous ? '' : (currentProfile?.avatar_url || '')} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
              {isAnonymous ? '?' : getInitials(currentProfile?.full_name || 'User')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">
              {isAnonymous ? 'Anonymous Community Member' : currentProfile?.full_name}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize">
              {isAnonymous ? 'Hidden identity' : currentRole.replace('_', ' ')}
            </span>
          </div>
        </div>

        <Textarea
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          placeholder="Share your perspective, solution, or constructive opinion on this topic..."
          rows={3}
          className="text-xs bg-background resize-y"
          required
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-4">
            {/* Anonymous Toggle */}
            <div className="flex items-center space-x-1.5">
              <Switch
                id="anon-comment"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                className="scale-75"
              />
              <Label htmlFor="anon-comment" className="text-xs cursor-pointer text-muted-foreground">
                Comment anonymously
              </Label>
            </div>

            {/* Official Badge Toggle for Authority/Faculty */}
            {canPostOfficial && (
              <div className="flex items-center space-x-1.5">
                <Switch
                  id="official-comment"
                  checked={isOfficial}
                  onCheckedChange={setIsOfficial}
                  className="scale-75"
                />
                <Label htmlFor="official-comment" className="text-xs font-semibold text-primary cursor-pointer">
                  Mark as Official
                </Label>
              </div>
            )}
          </div>

          <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs font-bold px-4 h-8">
            {isSubmitting ? 'Posting...' : 'Post Reply'}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-1">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-xs">
            No community replies yet. Be the first to join the conversation!
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3.5 rounded-xl border text-xs space-y-2.5 transition-colors ${
                comment.is_official_response
                  ? 'border-primary/40 bg-primary/5'
                  : 'bg-card border-border/80'
              }`}
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between">
                <div
                  onClick={() => setSelectedUser({ user: comment.author || null, isAnonymous: comment.is_anonymous })}
                  className="flex items-center gap-2 cursor-pointer group/comment-author hover:opacity-85 transition-opacity"
                  title={comment.is_anonymous ? "Anonymous author protected" : `View ${comment.author?.full_name || 'User'}'s Profile`}
                >
                  <Avatar className="h-6 w-6 border group-hover/comment-author:border-primary transition-colors">
                    <AvatarImage src={comment.is_anonymous ? '' : (comment.author?.avatar_url || '')} />
                    <AvatarFallback className="text-[10px] bg-muted font-bold">
                      {comment.is_anonymous ? '?' : getInitials(comment.author?.full_name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-foreground group-hover/comment-author:text-primary transition-colors">
                      {comment.is_anonymous ? 'Anonymous Member' : (comment.author?.full_name || 'User')}
                    </span>
                    {comment.is_anonymous ? (
                      <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
                        <Shield className="h-2.5 w-2.5" /> Anon
                      </span>
                    ) : (
                      comment.author?.role && (
                        <span className="text-[10px] text-muted-foreground capitalize">
                          ({comment.author.role.replace('_', ' ')})
                        </span>
                      )
                    )}
                    {comment.is_official_response && (
                      <Badge className="text-[9px] px-1 py-0 h-4 bg-primary text-primary-foreground font-bold">
                        <ShieldCheck className="h-2.5 w-2.5 mr-0.5" /> Official
                      </Badge>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {formatRelativeTime(comment.created_at)}
                </span>
              </div>

              {/* Comment Body */}
              <p className="text-foreground/90 whitespace-pre-line leading-relaxed pl-8">
                {comment.body}
              </p>

              {/* Comment Actions */}
              <div className="flex items-center justify-between pl-8 pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onVoteComment(comment.id)}
                    className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                      comment.userVote === 1
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span>{comment.upvote_count}</span>
                  </button>

                  <button
                    onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium"
                  >
                    <CornerDownRight className="h-3 w-3" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>

              {/* Nested Reply Form */}
              {replyToId === comment.id && (
                <div className="mt-3 pl-8 space-y-2 border-t pt-3">
                  <Textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder={`Reply to ${comment.is_anonymous ? 'Anonymous' : comment.author?.full_name}...`}
                    rows={2}
                    className="text-xs bg-background"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Switch
                        id={`anon-reply-${comment.id}`}
                        checked={replyAnonymous}
                        onCheckedChange={setReplyAnonymous}
                        className="scale-75"
                      />
                      <Label htmlFor={`anon-reply-${comment.id}`} className="text-[11px] text-muted-foreground cursor-pointer">
                        Reply anonymously
                      </Label>
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => setReplyToId(null)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="xs"
                        onClick={() => handleSubmitReply(comment.id)}
                        className="text-xs font-bold"
                      >
                        Submit Reply
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Nested Replies Rendering */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="pl-8 pt-2 space-y-2 border-l-2 border-primary/20 ml-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="p-2.5 rounded-lg bg-muted/40 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          {reply.is_anonymous ? 'Anonymous Member' : (reply.author?.full_name || 'User')}
                          {reply.is_anonymous && (
                            <span className="text-[9px] text-muted-foreground font-normal">(Anon)</span>
                          )}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatRelativeTime(reply.created_at)}
                        </span>
                      </div>
                      <p className="text-foreground/90 whitespace-pre-line leading-relaxed">
                        {reply.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Author Profile Modal */}
      <UserProfileModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser?.user || null}
        isAnonymous={selectedUser?.isAnonymous}
      />
    </div>
  )
}
