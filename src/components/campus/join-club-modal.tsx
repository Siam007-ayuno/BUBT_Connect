'use client'

import { useState } from 'react'
import { UserCheck, Send, CheckCircle2 } from 'lucide-react'
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
import { ClubItem } from '@/lib/campus-life-data'
import { toast } from 'sonner'

interface JoinClubModalProps {
  club: ClubItem | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (clubId: string) => void
  studentName?: string
}

export function JoinClubModal({
  club,
  isOpen,
  onClose,
  onSuccess,
  studentName = 'Tanvir Hossain',
}: JoinClubModalProps) {
  const [name, setName] = useState(studentName)
  const [studentId, setStudentId] = useState('22235103045')
  const [intake, setIntake] = useState('50th Intake')
  const [department, setDepartment] = useState('CSE')
  const [statement, setStatement] = useState('')

  if (!club) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !studentId.trim()) {
      toast.error('Please fill in your name and student ID')
      return
    }

    onSuccess(club.id)
    toast.success(`Application submitted to ${club.shortCode}! You are now an active member.`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Membership Application</DialogTitle>
              <DialogDescription className="text-xs">
                Apply to join {club.name} ({club.shortCode})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="applicant-name" className="text-xs font-semibold">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="applicant-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="applicant-id" className="text-xs font-semibold">
                Student ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="applicant-id"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="22235103045"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="applicant-intake" className="text-xs font-semibold">
                Intake / Batch
              </Label>
              <Input
                id="applicant-intake"
                value={intake}
                onChange={(e) => setIntake(e.target.value)}
                placeholder="50th Intake"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Department</Label>
            <Select value={department} onValueChange={(val) => val && setDepartment(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                <SelectItem value="EEE">Electrical & Electronic Engineering</SelectItem>
                <SelectItem value="BBA">Business Administration</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Law">Law & Human Rights</SelectItem>
                <SelectItem value="Civil">Civil Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="applicant-statement" className="text-xs font-semibold">
              Interests & Motivation
            </Label>
            <Textarea
              id="applicant-statement"
              rows={3}
              placeholder="Why would you like to join this club and what skills do you bring?"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
