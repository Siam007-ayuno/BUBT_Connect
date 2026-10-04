'use client'

import { useState } from 'react'
import { GraduationCap, Calendar, Clock, Send, CheckCircle2 } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlumniProfile } from '@/lib/academic-data'
import { toast } from 'sonner'

interface MentorshipModalProps {
  alumnus: AlumniProfile | null
  isOpen: boolean
  onClose: () => void
  onBook: (alumniId: string) => void
  studentName?: string
}

export function MentorshipModal({
  alumnus,
  isOpen,
  onClose,
  onBook,
  studentName = 'Tanvir Hossain',
}: MentorshipModalProps) {
  const [name, setName] = useState(studentName)
  const [topic, setTopic] = useState('Career Guidance & Mock Interview')
  const [preferredDate, setPreferredDate] = useState('2026-10-18')
  const [notes, setNotes] = useState('')

  if (!alumnus) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onBook(alumnus.id)
    toast.success(`Mentorship session requested with ${alumnus.fullName}! You will receive a calendar invite via email.`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Book 1-on-1 Mentorship</DialogTitle>
              <DialogDescription className="text-xs">
                Connect with {alumnus.fullName} ({alumnus.currentRole} at {alumnus.currentCompany})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="mentee-name" className="text-xs font-semibold">Your Full Name</Label>
            <Input
              id="mentee-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Discussion Topic</Label>
            <Select value={topic} onValueChange={(val) => val && setTopic(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {alumnus.mentorshipTopics.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
                <SelectItem value="Career Guidance & Mock Interview">Career Guidance & Mock Interview</SelectItem>
                <SelectItem value="Resume & Portfolio Feedback">Resume & Portfolio Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mentorship-date" className="text-xs font-semibold">Preferred Date</Label>
            <Input
              id="mentorship-date"
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mentorship-notes" className="text-xs font-semibold">What would you like to focus on?</Label>
            <Textarea
              id="mentorship-notes"
              rows={3}
              placeholder="e.g. I am preparing for frontend/backend interviews and would love feedback on my portfolio..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
