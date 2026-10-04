'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INITIAL_CATEGORIES, INITIAL_DEPARTMENTS, type ExtendedPost } from '@/lib/demo-data'
import { Shield, Lightbulb, AlertCircle, Sparkles, Image as ImageIcon, CheckCircle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  currentProfile: any
  existingPosts: ExtendedPost[]
  onPostCreated: (post: any) => void
}

export function CreatePostModal({
  isOpen,
  onClose,
  currentProfile,
  existingPosts,
  onPostCreated,
}: CreatePostModalProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [type, setType] = useState<'problem' | 'suggestion' | 'question' | 'discussion'>('problem')
  const [categoryId, setCategoryId] = useState('cat-wifi')
  const [departmentId, setDepartmentId] = useState<string>('all')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [improvementSuggestion, setImprovementSuggestion] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Real-time duplicate / similar posts detection
  const similarPosts = useMemo(() => {
    if (!title.trim() || title.trim().length < 4) return []
    const words = title.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
    return existingPosts
      .filter((post) => {
        const postTitle = post.title.toLowerCase()
        const matchCount = words.filter((w) => postTitle.includes(w)).length
        return matchCount >= 2 || (words.length === 1 && postTitle.includes(words[0]))
      })
      .slice(0, 3)
  }, [title, existingPosts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || title.length < 5) {
      toast.error('Title must be at least 5 characters long.')
      return
    }
    if (!body.trim() || body.length < 10) {
      toast.error('Body must be at least 10 characters long.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      const selectedCategory = INITIAL_CATEGORIES.find((c) => c.id === categoryId)
      const selectedDepartment = departmentId === 'all' ? null : INITIAL_DEPARTMENTS.find((d) => d.id === departmentId)

      const attachments = attachmentUrl.trim()
        ? [{ url: attachmentUrl.trim(), type: 'image/jpeg', name: 'attachment.jpg', size: 100000 }]
        : []

      const created = onPostCreated({
        title: title.trim(),
        body: body.trim(),
        type,
        category_id: categoryId,
        department_id: departmentId === 'all' ? null : departmentId,
        is_anonymous: isAnonymous,
        improvement_suggestion: improvementSuggestion.trim() || null,
        status: 'open',
        author_id: currentProfile?.id || 'demo-usr',
        attachments,
        author: isAnonymous ? null : currentProfile,
        category: selectedCategory,
        department: selectedDepartment,
      })

      setIsSubmitting(false)
      toast.success(
        isAnonymous
          ? 'Anonymous post created! Your identity is hidden from the public.'
          : 'Post published successfully to the Voice Board!'
      )
      // Reset form
      setTitle('')
      setBody('')
      setImprovementSuggestion('')
      setAttachmentUrl('')
      setIsAnonymous(false)
      const createdPost = created as any
      if (createdPost?.id) {
        router.push(`/app/posts/${createdPost.id}`)
      }
    }, 400)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <DialogTitle className="text-lg">Create New Voice Board Post</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Share problems, propose ideas, ask academic questions, or discuss campus affairs openly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Post Type Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Post Type:</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'problem', label: '⚠️ Problem', desc: 'Report an issue' },
                { id: 'suggestion', label: '💡 Suggestion', desc: 'Propose an idea' },
                { id: 'question', label: '❓ Question', desc: 'Ask community' },
                { id: 'discussion', label: '💬 Discussion', desc: 'General topic' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    type === t.id
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                      : 'border-border bg-card hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <span className="block text-xs font-bold text-foreground">{t.label}</span>
                  <span className="text-[10px] text-muted-foreground">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category & Department selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-semibold">
                Category:
              </Label>
              <Select value={categoryId} onValueChange={(val) => { if (val) setCategoryId(val) }}>
                <SelectTrigger id="category" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INITIAL_CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">
                      {c.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="department" className="text-xs font-semibold">
                Target Department:
              </Label>
              <Select value={departmentId} onValueChange={(val) => { if (val) setDepartmentId(val) }}>
                <SelectTrigger id="department" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    Campus-wide (All Departments)
                  </SelectItem>
                  {INITIAL_DEPARTMENTS.map((d) => (
                    <SelectItem key={d.id} value={d.id} className="text-xs">
                      {d.code} - {d.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">
              Post Title:
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken projector in Room 402 or Library air conditioning issue"
              className="text-xs h-9"
              required
            />
          </div>

          {/* Real-time Similar Posts Warning / Suggestions */}
          {similarPosts.length > 0 && (
            <div className="p-3 rounded-lg border border-amber-300 bg-amber-50/70 dark:bg-amber-950/30 text-xs space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Similar existing posts found — consider upvoting instead of duplicating:</span>
              </div>
              <div className="space-y-1 pl-5">
                {similarPosts.map((sp) => (
                  <Link
                    key={sp.id}
                    href={`/app/posts/${sp.id}`}
                    target="_blank"
                    className="block font-medium text-amber-900 dark:text-amber-200 hover:underline truncate"
                  >
                    • {sp.title} <span className="text-[10px] text-muted-foreground">({sp.upvote_count} votes, {sp.status})</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Body Textarea */}
          <div className="space-y-1.5">
            <Label htmlFor="body" className="text-xs font-semibold">
              Description & Details:
            </Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Explain the background, specific location/building, time, or what happened..."
              rows={4}
              className="text-xs resize-y"
              required
            />
          </div>

          {/* "How could the university improve this?" Advice Field */}
          {type === 'problem' && (
            <div className="space-y-1.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Label htmlFor="improvement" className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                How could the university improve this? (Constructive Advice)
              </Label>
              <Textarea
                id="improvement"
                value={improvementSuggestion}
                onChange={(e) => setImprovementSuggestion(e.target.value)}
                placeholder="Give constructive recommendations (e.g. adjust schedule, replace hardware, add signage)..."
                rows={2}
                className="text-xs bg-background"
              />
            </div>
          )}

          {/* Attach Image / Document URL */}
          <div className="space-y-1.5">
            <Label htmlFor="attachment" className="text-xs font-semibold flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
              Image URL attachment (optional):
            </Label>
            <Input
              id="attachment"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or paste image URL"
              className="text-xs h-8"
            />
          </div>

          {/* Anonymous Posting Toggle */}
          <div className="rounded-xl border p-3 bg-muted/30 flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <Label htmlFor="anonymous-switch" className="text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Post Anonymously
              </Label>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Your name, avatar, and student ID will be hidden from everyone in the community. (Only university moderators can access it in cases of severe abuse or hate speech).
              </p>
            </div>
            <Switch
              id="anonymous-switch"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="font-bold">
              {isSubmitting ? 'Publishing Post...' : 'Publish to Voice Board'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
