'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Users, Sparkles, Send } from 'lucide-react'
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
import { CampusEvent } from '@/lib/campus-life-data'
import { toast } from 'sonner'

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (event: Omit<CampusEvent, 'id' | 'currentAttendees'>) => void
  userRole?: string
  userName?: string
}

export function CreateEventModal({
  isOpen,
  onClose,
  onCreate,
  userRole = 'student',
  userName = 'Campus Organizer',
}: CreateEventModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<CampusEvent['category']>('tech')
  const [clubName, setClubName] = useState('BUBT IT Club')
  const [venue, setVenue] = useState('Auditorium, Building 2')
  const [date, setDate] = useState('2026-11-15')
  const [time, setTime] = useState('10:00 AM - 04:00 PM')
  const [maxAttendees, setMaxAttendees] = useState(250)
  const [tagsInput, setTagsInput] = useState('Workshop, AI, Tech')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      toast.error('Please enter event title and description')
      return
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    onCreate({
      title: title.trim(),
      description: description.trim(),
      category,
      organizerName: clubName || userName,
      clubName: clubName || undefined,
      startDate: new Date(`${date}T10:00:00Z`).toISOString(),
      endDate: new Date(`${date}T16:00:00Z`).toISOString(),
      time,
      venue,
      maxAttendees,
      tags: tags.length > 0 ? tags : ['CampusEvent'],
      isFeatured: false,
    })

    toast.success('Campus event created successfully!')
    setTitle('')
    setDescription('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Host Campus Event</DialogTitle>
              <DialogDescription className="text-xs">
                Announce club activities, tech fests, seminars, and sports tournaments.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="evt-title" className="text-xs font-semibold">
              Event Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="evt-title"
              placeholder="e.g. BUBT National Tech Summit 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category</Label>
              <Select value={category} onValueChange={(val: any) => val && setCategory(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology & Coding</SelectItem>
                  <SelectItem value="cultural">Cultural & Arts</SelectItem>
                  <SelectItem value="sports">Sports Tournament</SelectItem>
                  <SelectItem value="career">Career & Job Fair</SelectItem>
                  <SelectItem value="academic">Academic & Seminar</SelectItem>
                  <SelectItem value="workshop">Skill Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Hosting Organization / Club</Label>
              <Select value={clubName} onValueChange={(val) => val && setClubName(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUBT IT Club">BUBT IT Club</SelectItem>
                  <SelectItem value="BUBT Robotics Club">BUBT Robotics Club</SelectItem>
                  <SelectItem value="IEEE BUBT Student Branch">IEEE BUBT Student Branch</SelectItem>
                  <SelectItem value="BUBT Cultural Club">BUBT Cultural Club</SelectItem>
                  <SelectItem value="BUBT Sports Club">BUBT Sports Club</SelectItem>
                  <SelectItem value="BUBT Debating Club">BUBT Debating Club</SelectItem>
                  <SelectItem value="Department of CSE">Department of CSE</SelectItem>
                  <SelectItem value="Student Affairs">Student Affairs Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="evt-date" className="text-xs font-semibold">Date</Label>
              <Input
                id="evt-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="evt-time" className="text-xs font-semibold">Time Slot</Label>
              <Input
                id="evt-time"
                placeholder="10:00 AM - 04:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="evt-venue" className="text-xs font-semibold">Campus Venue</Label>
              <Input
                id="evt-venue"
                placeholder="Auditorium, Building 2"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="evt-capacity" className="text-xs font-semibold">Max Capacity</Label>
              <Input
                id="evt-capacity"
                type="number"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(Number(e.target.value))}
                min={10}
                max={2000}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="evt-desc" className="text-xs font-semibold">
              Event Description & Schedule <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="evt-desc"
              rows={4}
              placeholder="Outline the schedule, eligibility, registration details, and guest speakers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="evt-tags" className="text-xs font-semibold">Tags (comma separated)</Label>
            <Input
              id="evt-tags"
              placeholder="Hackathon, Tech, Robotics, BUBT"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              Publish Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
