'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreatePostModal } from '@/components/voice-board/create-post-modal'
import { useVoiceBoardStore } from '@/lib/voice-board-store'
import { useAuth } from '@/hooks/use-auth'
import { DEMO_USERS } from '@/lib/demo-data'

export default function NewPostPage() {
  const router = useRouter()
  const { posts, addPost } = useVoiceBoardStore()
  const { profile } = useAuth()
  const activeProfile = profile || DEMO_USERS.student.profile

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-4">
      <Link
        href="/app"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Voice Board
      </Link>

      <CreatePostModal
        isOpen={true}
        onClose={() => router.push('/app')}
        currentProfile={activeProfile}
        existingPosts={posts}
        onPostCreated={addPost}
      />
    </div>
  )
}
