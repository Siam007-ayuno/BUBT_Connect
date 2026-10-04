'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Lock,
  MessageSquare,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge, PostTypeBadge } from '@/components/ui/status-badge'
import { formatRelativeTime } from '@/lib/utils'
import { toast } from 'sonner'
import type { ExtendedPost } from '@/lib/demo-data'
import { useAuthorityStore, type IssueAssignment, type InternalNote } from '@/lib/authority-store'

interface IssueInboxProps {
  posts: ExtendedPost[]
  currentRole: string
  currentUserName: string
  onUpdatePostStatus: (postId: string, newStatus: any, note: string) => void
  onAddOfficialResponse: (postId: string, body: string) => void
}

const DEPARTMENTS_LIST = [
  'IT Infrastructure & Network Office',
  'Proctorial Body & Campus Discipline',
  'Controller of Examinations',
  'Central Library Affairs',
  'Campus Welfare & Cafeteria Committee',
  'Department of CSE Office',
  'Department of EEE Office',
  'Department of BBA Office',
  'Accounts & Finance Branch',
  'Estate & Maintenance Section',
]

export function IssueInbox({
  posts,
  currentRole,
  currentUserName,
  onUpdatePostStatus,
  onAddOfficialResponse,
}: IssueInboxProps) {
  const { internalNotes, assignments, addInternalNote, assignIssue } = useAuthorityStore()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [escalatedOnly, setEscalatedOnly] = useState(false)
  const [activePost, setActivePost] = useState<ExtendedPost | null>(null)

  // Drawer / Action form state for active post
  const [actionTab, setActionTab] = useState<'status' | 'assign' | 'internal_notes' | 'official_response'>('status')
  
  // Status transition state
  const [newStatus, setNewStatus] = useState<string>('under_review')
  const [statusNote, setStatusNote] = useState('')

  // Assignment state
  const [assignedDept, setAssignedDept] = useState(DEPARTMENTS_LIST[0])
  const [assigneeName, setAssigneeName] = useState('')
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal')

  // Internal note state
  const [internalNoteText, setInternalNoteText] = useState('')

  // Official response state
  const [officialResponseBody, setOfficialResponseBody] = useState('')

  const handleOpenActionModal = (post: ExtendedPost) => {
    setActivePost(post)
    setNewStatus(post.status)
    setStatusNote('')
    const currentAssignment = assignments[post.id]
    if (currentAssignment) {
      setAssignedDept(currentAssignment.departmentName)
      setAssigneeName(currentAssignment.assigneeName)
      setPriority(currentAssignment.priority)
    } else {
      setAssignedDept(DEPARTMENTS_LIST[0])
      setAssigneeName('')
      setPriority('normal')
    }
    setOfficialResponseBody(post.official_response?.body || '')
    setActionTab('status')
  }

  const handleCommitStatus = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePost) return
    if (!statusNote.trim()) {
      toast.error('Please enter a brief public note explaining this status change.')
      return
    }
    onUpdatePostStatus(activePost.id, newStatus as any, statusNote.trim())
    toast.success(`Status updated to ${newStatus.toUpperCase()}!`)
    setActivePost(null)
  }

  const handleCommitAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePost) return
    if (!assigneeName.trim()) {
      toast.error('Please specify the responsible officer or staff name.')
      return
    }
    assignIssue(activePost.id, assignedDept, assigneeName.trim(), priority, currentUserName, currentRole)
    toast.success(`Issue assigned to ${assignedDept} (${assigneeName})`)
    setActivePost(null)
  }

  const handleCommitInternalNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePost) return
    if (!internalNoteText.trim()) return
    addInternalNote(activePost.id, internalNoteText.trim(), currentUserName, currentRole)
    setInternalNoteText('')
    toast.success('Private internal note saved.')
  }

  const handleCommitOfficialResponse = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePost) return
    if (!officialResponseBody.trim()) {
      toast.error('Response cannot be empty.')
      return
    }
    onAddOfficialResponse(activePost.id, officialResponseBody.trim())
    toast.success('Official verified response published to public issue thread!')
    setActivePost(null)
  }

  const filtered = posts.filter((p) => {
    if (escalatedOnly && !p.is_escalated) return false
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchTitle = p.title.toLowerCase().includes(q)
      const matchBody = p.body.toLowerCase().includes(q)
      const matchCategory = p.category?.name_en.toLowerCase().includes(q)
      const matchId = p.id.toLowerCase().includes(q)
      if (!matchTitle && !matchBody && !matchCategory && !matchId) return false
    }
    return true
  })

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-card p-3 rounded-xl border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues by ID, keyword, category..."
            className="pl-9 h-9 text-xs bg-muted/30"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setEscalatedOnly(!escalatedOnly)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              escalatedOnly
                ? 'bg-red-500 text-white border-red-500 shadow-xs'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>⚡ Escalated Only</span>
          </button>

          <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
            <SelectTrigger className="h-9 text-xs w-36 bg-muted/30">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Issues Table / Cards */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Issue / Title</th>
                <th className="py-3 px-3">Type & Category</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Votes</th>
                <th className="py-3 px-3">Assigned Department</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No issues match the selected criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((post) => {
                  const assignment = assignments[post.id]
                  const notesCount = (internalNotes[post.id] || []).length

                  return (
                    <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                      {/* Title & Author */}
                      <td className="py-3 px-4 max-w-xs sm:max-w-md">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                            #{post.id}
                          </span>
                          {post.is_escalated && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400">
                              ⚡ Escalated
                            </span>
                          )}
                          {notesCount > 0 && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 flex items-center gap-0.5">
                              <Lock className="h-2.5 w-2.5" /> {notesCount} notes
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/app/posts/${post.id}`}
                          className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                          Reported by {post.is_anonymous ? 'Anonymous Student' : (post.author?.full_name || 'Member')} • {formatRelativeTime(post.created_at)}
                        </span>
                      </td>

                      {/* Type & Category */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <PostTypeBadge type={post.type} />
                          <span className="text-[10px] text-muted-foreground">
                            {post.category?.name_en || 'General'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <StatusBadge status={post.status} />
                      </td>

                      {/* Votes */}
                      <td className="py-3 px-3 whitespace-nowrap font-bold">
                        <span className={post.upvote_count >= 25 ? 'text-red-600 dark:text-red-400' : 'text-foreground'}>
                          +{post.upvote_count}
                        </span>
                      </td>

                      {/* Assignment */}
                      <td className="py-3 px-3 max-w-[180px]">
                        {assignment ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground truncate" title={assignment.departmentName}>
                              {assignment.departmentName}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">
                              👤 {assignment.assigneeName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleOpenActionModal(post)}
                          className="font-semibold text-xs h-7 gap-1"
                        >
                          <Shield className="h-3.5 w-3.5 text-primary" />
                          Resolve / Action
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Administrative Resolution Modal */}
      {activePost && (
        <Dialog open={true} onOpenChange={() => setActivePost(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                <DialogTitle className="text-base font-bold">
                  Administrative Action Desk • Issue #{activePost.id}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs">
                {activePost.title}
              </DialogDescription>
            </DialogHeader>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 border-b pb-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => setActionTab('status')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  actionTab === 'status'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                1. Transition Status
              </button>
              <button
                type="button"
                onClick={() => setActionTab('assign')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  actionTab === 'assign'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                2. Assign Department
              </button>
              <button
                type="button"
                onClick={() => setActionTab('internal_notes')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                  actionTab === 'internal_notes'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Lock className="h-3 w-3" />
                3. Private Notes ({ (internalNotes[activePost.id] || []).length })
              </button>
              <button
                type="button"
                onClick={() => setActionTab('official_response')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  actionTab === 'official_response'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                4. Official Statement
              </button>
            </div>

            {/* Tab 1: Status Transition */}
            {actionTab === 'status' && (
              <form onSubmit={handleCommitStatus} className="space-y-3.5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Change Issue Status:</label>
                    <Select value={newStatus} onValueChange={(val) => val && setNewStatus(val)}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open (Unreviewed)</SelectItem>
                        <SelectItem value="under_review">Under Review by Proctor</SelectItem>
                        <SelectItem value="in_progress">In Progress (Work Dispatched)</SelectItem>
                        <SelectItem value="resolved">Resolved (Complete)</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Responsible Officer:</label>
                    <div className="h-9 px-3 rounded-md border bg-muted/40 text-xs flex items-center font-medium">
                      {currentUserName} ({currentRole})
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">
                    Public Timeline Note (visible to all students on the issue tracker):
                  </label>
                  <Textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Work order #WO-2026-88 dispatched to Cisco vendor. Hardware delivery scheduled Thursday."
                    rows={3}
                    className="text-xs"
                    required
                  />
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setActivePost(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="font-bold">
                    Commit Status Change
                  </Button>
                </DialogFooter>
              </form>
            )}

            {/* Tab 2: Assignment */}
            {actionTab === 'assign' && (
              <form onSubmit={handleCommitAssignment} className="space-y-3.5 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Designated Department / Entity:</label>
                  <Select value={assignedDept} onValueChange={(val) => val && setAssignedDept(val)}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS_LIST.map((dept) => (
                        <SelectItem key={dept} value={dept} className="text-xs">
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Assignee / Staff Officer Name:</label>
                    <Input
                      value={assigneeName}
                      onChange={(e) => setAssigneeName(e.target.value)}
                      placeholder="e.g. Engr. M. Kabir or Assistant Proctor"
                      className="text-xs h-9"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Urgency Priority Level:</label>
                    <Select value={priority} onValueChange={(val: any) => val && setPriority(val)}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal (Routine)</SelectItem>
                        <SelectItem value="high">High (Elevated attention)</SelectItem>
                        <SelectItem value="urgent">Urgent (Immediate action)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setActivePost(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="font-bold">
                    Save Issue Assignment
                  </Button>
                </DialogFooter>
              </form>
            )}

            {/* Tab 3: Private Internal Notes */}
            {actionTab === 'internal_notes' && (
              <div className="space-y-4 pt-2">
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <Lock className="h-4 w-4 shrink-0" />
                  <span>Private notes are confidential and visible ONLY to BUBT Proctorial Authority and Admins.</span>
                </div>

                <form onSubmit={handleCommitInternalNote} className="space-y-2">
                  <Textarea
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    placeholder="Add internal investigation findings, vendor contact details, or meeting notes..."
                    rows={2}
                    className="text-xs"
                    required
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="xs" className="font-bold text-xs">
                      Add Internal Note
                    </Button>
                  </div>
                </form>

                {/* Existing internal notes */}
                <div className="space-y-2 pt-2 border-t max-h-48 overflow-y-auto">
                  {(internalNotes[activePost.id] || []).length === 0 ? (
                    <span className="text-xs text-muted-foreground italic block text-center py-2">
                      No internal notes recorded yet.
                    </span>
                  ) : (
                    (internalNotes[activePost.id] || []).map((n) => (
                      <div key={n.id} className="p-2.5 rounded-lg border bg-muted/40 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="font-bold text-foreground">
                            {n.authorName} ({n.role})
                          </span>
                          <span>{formatRelativeTime(n.createdAt)}</span>
                        </div>
                        <p className="text-foreground/90 whitespace-pre-line leading-relaxed">
                          {n.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Official Statement */}
            {actionTab === 'official_response' && (
              <form onSubmit={handleCommitOfficialResponse} className="space-y-3.5 pt-2">
                <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>
                    This response will be permanently pinned with the verified BUBT crest seal on the public thread.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Official University Statement:</label>
                  <Textarea
                    value={officialResponseBody}
                    onChange={(e) => setOfficialResponseBody(e.target.value)}
                    placeholder="Type official university stance, measures taken, and guidance for students..."
                    rows={4}
                    className="text-xs"
                    required
                  />
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setActivePost(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="font-bold">
                    Publish Official Statement
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
