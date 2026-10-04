'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { AlertTriangle, ShieldCheck } from 'lucide-react'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  itemType: 'post' | 'comment'
  itemId: string
  itemTitle?: string
}

const REPORT_REASONS = [
  { id: 'harassment', label: 'Harassment, bullying, or hate speech' },
  { id: 'misinformation', label: 'Misinformation or false university claims' },
  { id: 'spam', label: 'Spam, advertisement, or repetitive content' },
  { id: 'privacy', label: 'Violation of personal privacy or doxxing' },
  { id: 'other', label: 'Other violation of BUBT community guidelines' },
]

export function ReportModal({ isOpen, onClose, itemType, itemId, itemTitle }: ReportModalProps) {
  const [reason, setReason] = useState('harassment')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success('Report submitted successfully to the BUBT Proctor Office', {
        description: 'Our moderation team will review this within 24 hours.',
        icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />,
      })
      setDetails('')
      onClose()
    }, 600)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Report {itemType === 'post' ? 'Post' : 'Comment'}</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Help maintain a safe and respectful environment for the BUBT community. Reports are reviewed by university administrators.
          </DialogDescription>
        </DialogHeader>

        {itemTitle && (
          <div className="p-2.5 rounded-lg bg-muted/60 text-xs font-medium border text-foreground/80 line-clamp-2">
            &ldquo;{itemTitle}&rdquo;
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Select violation reason:</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
              {REPORT_REASONS.map((r) => (
                <div key={r.id} className="flex items-center space-x-2 text-xs">
                  <RadioGroupItem value={r.id} id={r.id} />
                  <Label htmlFor={r.id} className="font-normal text-xs cursor-pointer">
                    {r.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="details" className="text-xs font-semibold">
              Additional context (optional):
            </Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide any context that helps moderators understand the issue..."
              rows={3}
              className="text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
