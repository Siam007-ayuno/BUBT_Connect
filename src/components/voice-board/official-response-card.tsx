'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShieldCheck, MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { formatRelativeTime } from '@/lib/utils'

interface OfficialResponseProps {
  response?: {
    id: string
    author_name: string
    author_role: string
    avatar_url: string
    body: string
    created_at: string
  } | null
  currentRole?: string
  currentUserName?: string
  onPostOfficialResponse?: (body: string) => void
}

export function OfficialResponseCard({
  response,
  currentRole,
  currentUserName,
  onPostOfficialResponse,
}: OfficialResponseProps) {
  const isAuthorityOrFaculty = currentRole === 'authority' || currentRole === 'super_admin' || currentRole === 'faculty'
  const [isEditing, setIsEditing] = useState(false)
  const [responseBody, setResponseBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!responseBody.trim()) {
      toast.error('Response body cannot be empty.')
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      onPostOfficialResponse?.(responseBody)
      setIsSubmitting(false)
      setIsEditing(false)
      setResponseBody('')
      toast.success('Official university response published successfully!')
    }, 400)
  }

  if (!response && !isAuthorityOrFaculty) {
    return null
  }

  return (
    <div className="space-y-3">
      {response ? (
        <div className="relative overflow-hidden rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-4 sm:p-5 shadow-xs">
          {/* Top Seal Badge */}
          <div className="flex items-center justify-between gap-2 border-b border-primary/20 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative h-7 w-7 rounded-full bg-white p-0.5 border border-primary/30 shadow-xs shrink-0">
                <Image
                  src="/images/bubt-logo.png"
                  alt="BUBT Crest"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-primary sm:text-sm">
                    {response.author_name}
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-primary-foreground">
                    <ShieldCheck className="h-3 w-3" /> VERIFIED OFFICIAL
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground capitalize">
                  {response.author_role.replace('_', ' ')} • {formatRelativeTime(response.created_at)}
                </span>
              </div>
            </div>

            {isAuthorityOrFaculty && !isEditing && (
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  setResponseBody(response.body)
                  setIsEditing(true)
                }}
                className="text-xs h-7"
              >
                Update Response
              </Button>
            )}
          </div>

          {/* Response Text */}
          <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-line leading-relaxed font-normal">
            {response.body}
          </p>
        </div>
      ) : (
        isAuthorityOrFaculty && !isEditing && (
          <div className="p-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground">
                As a verified {currentRole}, you can provide an authoritative resolution or statement for this post.
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-xs shrink-0 font-semibold gap-1.5"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Provide Official Response
            </Button>
          </div>
        )
      )}

      {/* Editor Form for Authority */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl border-2 border-primary/40 bg-card space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Post Official Statement on behalf of BUBT
            </span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setIsEditing(false)}
              className="text-xs text-muted-foreground"
            >
              Cancel
            </Button>
          </div>

          <Textarea
            value={responseBody}
            onChange={(e) => setResponseBody(e.target.value)}
            placeholder="Type official university stance, actions taken, or schedule for resolution..."
            rows={4}
            className="text-xs bg-background"
            required
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>This response will be pinned and highlighted with the verified BUBT crest seal.</span>
            <Button type="submit" size="sm" disabled={isSubmitting} className="font-bold text-xs gap-1.5">
              <Send className="h-3.5 w-3.5" />
              {isSubmitting ? 'Publishing...' : 'Publish Official Response'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
