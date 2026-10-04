'use client'

import { useState } from 'react'
import { PlusCircle, FileText, Send, AlertCircle, Building2, UploadCloud, Check } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OfficialNotice } from '@/lib/notices-data'
import { toast } from 'sonner'

interface PublishNoticeModalProps {
  isOpen: boolean
  onClose: () => void
  onPublish: (notice: Omit<OfficialNotice, 'id' | 'publishedAt'>) => void
  userRole?: string
  userName?: string
}

const AUTHORITIES = [
  'Office of the Registrar',
  'Office of the Controller of Examinations',
  'Proctorial Body & Disciplinary Committee',
  'Office of Accounts & Finance',
  'Department of Computer Science & Engineering',
  'Department of Electrical & Electronic Engineering',
  'Department of Business Administration',
  'Department of English',
  'Department of Law',
  'Campus Estate & Transport Directorate',
]

const DEPARTMENTS = [
  { id: 'all', label: 'All Departments' },
  { id: 'dept-cse', label: 'CSE' },
  { id: 'dept-eee', label: 'EEE' },
  { id: 'dept-bba', label: 'BBA / MBA' },
  { id: 'dept-eng', label: 'English' },
  { id: 'dept-law', label: 'Law' },
  { id: 'dept-civil', label: 'Civil Engg' },
  { id: 'dept-textile', label: 'Textile Engg' },
]

export function PublishNoticeModal({
  isOpen,
  onClose,
  onPublish,
  userRole = 'authority',
  userName = 'Administrative Officer',
}: PublishNoticeModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<OfficialNotice['category']>('academic')
  const [issuingAuthority, setIssuingAuthority] = useState(AUTHORITIES[0])
  const [authorName, setAuthorName] = useState(userName || 'Registrar Office')
  const [selectedDepts, setSelectedDepts] = useState<string[]>(['all'])
  const [isUrgent, setIsUrgent] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [attachmentName, setAttachmentName] = useState('')
  const [attachmentSize, setAttachmentSize] = useState('350 KB')

  // Generate reference number preview
  const deptShort = issuingAuthority.includes('Registrar') ? 'REG' :
    issuingAuthority.includes('Examinations') ? 'COE' :
    issuingAuthority.includes('Proctorial') ? 'PROCT' :
    issuingAuthority.includes('CSE') ? 'CSE' : 'ADMIN'
  const autoRefNo = `BUBT/${deptShort}/2026/CIR-${Math.floor(100 + Math.random() * 900)}`
  const [referenceNo, setReferenceNo] = useState(autoRefNo)

  const toggleDept = (deptId: string) => {
    if (deptId === 'all') {
      setSelectedDepts(['all'])
      return
    }
    const filtered = selectedDepts.filter((d) => d !== 'all')
    if (filtered.includes(deptId)) {
      const next = filtered.filter((d) => d !== deptId)
      setSelectedDepts(next.length === 0 ? ['all'] : next)
    } else {
      setSelectedDepts([...filtered, deptId])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter a circular title and content')
      return
    }

    onPublish({
      title: title.trim(),
      content: content.trim(),
      category,
      issuingAuthority,
      authorName: authorName.trim() || 'Issuing Authority',
      authorRole: userRole,
      targetDepartments: selectedDepts,
      isUrgent,
      isPinned,
      referenceNo: referenceNo.trim() || autoRefNo,
      attachmentName: attachmentName.trim() || undefined,
      attachmentSize: attachmentName.trim() ? attachmentSize : undefined,
      attachmentUrl: attachmentName.trim() ? 'https://www.bubt.edu.bd/uploads/sample.pdf' : undefined,
    })

    toast.success('Official University Circular published successfully!')
    // Reset
    setTitle('')
    setContent('')
    setAttachmentName('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Publish Official University Notice</DialogTitle>
              <DialogDescription className="text-xs">
                Broadcast official circulars to students, faculty, and departments across BUBT Connect.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Circular Title */}
          <div className="space-y-1.5">
            <Label htmlFor="notice-title" className="text-xs font-semibold">
              Circular Subject / Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="notice-title"
              placeholder="e.g. Schedule of Make-Up Classes & Remedial Lab Sessions"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Issuing Authority & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Issuing Office / Authority</Label>
              <Select value={issuingAuthority} onValueChange={(val) => { if (val) setIssuingAuthority(val) }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUTHORITIES.map((auth) => (
                    <SelectItem key={auth} value={auth}>
                      {auth}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Notice Category</Label>
              <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic Circular</SelectItem>
                  <SelectItem value="exam">Examination Routine / Notice</SelectItem>
                  <SelectItem value="fees">Accounts, Tuition & Dues</SelectItem>
                  <SelectItem value="scholarship">Scholarships & Waivers</SelectItem>
                  <SelectItem value="urgent">Urgent Proctorial Order</SelectItem>
                  <SelectItem value="administrative">General Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reference Memo No. & Signatory Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ref-no" className="text-xs font-semibold">Official Memo Reference No.</Label>
              <Input
                id="ref-no"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="BUBT/REG/2026/CIR-101"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="author-name" className="text-xs font-semibold">Signatory Officer Name</Label>
              <Input
                id="author-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Dr. Harun-Or-Rashid, Registrar"
              />
            </div>
          </div>

          {/* Target Audience Departments */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Target Departments</Label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {DEPARTMENTS.map((dept) => {
                const isSelected = selectedDepts.includes(dept.id)
                return (
                  <button
                    type="button"
                    key={dept.id}
                    onClick={() => toggleDept(dept.id)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary font-medium'
                        : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                    }`}
                  >
                    {dept.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notice Content / Directives */}
          <div className="space-y-1.5">
            <Label htmlFor="notice-content" className="text-xs font-semibold">
              Official Directives / Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="notice-content"
              rows={5}
              placeholder="State the formal circular instructions clearly, including dates, requirements, and deadlines..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="text-sm font-sans"
            />
          </div>

          {/* Attachment upload simulation */}
          <div className="space-y-1.5 border rounded-lg p-3 bg-muted/20">
            <Label htmlFor="attachment-input" className="text-xs font-semibold flex items-center gap-1.5">
              <UploadCloud className="h-4 w-4 text-primary" />
              Attach Official Document (PDF / Circular Scan)
            </Label>
            <div className="flex gap-2 pt-1">
              <Input
                id="attachment-input"
                placeholder="e.g. Midterm_Schedule_Signed.pdf"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                className="text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 text-xs"
                onClick={() => {
                  setAttachmentName('Official_Circular_Signed_Fall2026.pdf')
                  toast.info('Sample PDF attached')
                }}
              >
                Sample File
              </Button>
            </div>
          </div>

          {/* Toggles: Urgent & Pinned */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t">
            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-card">
              <div className="space-y-0.5">
                <Label htmlFor="urgent-toggle" className="text-xs font-semibold text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Mark as High Priority
                </Label>
                <p className="text-[10px] text-muted-foreground">Pulsing red alert banner on top</p>
              </div>
              <Switch id="urgent-toggle" checked={isUrgent} onCheckedChange={setIsUrgent} />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-card">
              <div className="space-y-0.5">
                <Label htmlFor="pin-toggle" className="text-xs font-semibold">
                  Pin to Top of Notice Board
                </Label>
                <p className="text-[10px] text-muted-foreground">Stays on top of chronological feed</p>
              </div>
              <Switch id="pin-toggle" checked={isPinned} onCheckedChange={setIsPinned} />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              Publish Circular
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
