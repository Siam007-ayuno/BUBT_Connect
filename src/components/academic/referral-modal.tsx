'use client'

import { useState } from 'react'
import { Briefcase, Send, FileText, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { JobPosting } from '@/lib/academic-data'
import { toast } from 'sonner'

interface ReferralModalProps {
  job: JobPosting | null
  isOpen: boolean
  onClose: () => void
  onRequestReferral: (jobId: string) => void
  studentName?: string
}

export function ReferralModal({
  job,
  isOpen,
  onClose,
  onRequestReferral,
  studentName = 'Tanvir Hossain',
}: ReferralModalProps) {
  const [name, setName] = useState(studentName)
  const [resumeUrl, setResumeUrl] = useState('https://github.com/tanvirhossain/cv.pdf')
  const [portfolioUrl, setPortfolioUrl] = useState('https://tanvir.dev')
  const [pitch, setPitch] = useState('')

  if (!job) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !resumeUrl.trim()) {
      toast.error('Please provide your name and resume URL')
      return
    }

    onRequestReferral(job.id)
    toast.success(`Referral request sent to ${job.postedByAlumniName} at ${job.company}!`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Request Alumni Referral</DialogTitle>
              <DialogDescription className="text-xs">
                Request internal referral for <strong>{job.title}</strong> at <strong>{job.company}</strong>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="ref-name" className="text-xs font-semibold">Your Full Name</Label>
            <Input
              id="ref-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ref-resume" className="text-xs font-semibold">Resume / CV Link (Google Drive / GitHub)</Label>
            <Input
              id="ref-resume"
              placeholder="https://drive.google.com/file/..."
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ref-portfolio" className="text-xs font-semibold">Portfolio / GitHub Profile</Label>
            <Input
              id="ref-portfolio"
              placeholder="https://github.com/..."
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ref-pitch" className="text-xs font-semibold">Elevator Pitch to Alumni</Label>
            <Textarea
              id="ref-pitch"
              rows={3}
              placeholder="Highlight your top projects, CGPA, and why you are a strong fit for this team..."
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              Submit Referral Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
