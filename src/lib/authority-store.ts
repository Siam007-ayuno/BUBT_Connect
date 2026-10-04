'use client'

import { useState, useEffect } from 'react'

export interface InternalNote {
  id: string
  postId: string
  authorName: string
  role: string
  text: string
  createdAt: string
}

export interface IssueAssignment {
  postId: string
  departmentName: string
  assigneeName: string
  assignedAt: string
  priority: 'normal' | 'high' | 'urgent'
}

export interface ModerationReport {
  id: string
  targetType: 'post' | 'comment'
  targetId: string
  targetTitle: string
  authorName: string
  authorId: string
  reason: 'harassment' | 'misinformation' | 'spam' | 'privacy' | 'other'
  details: string
  reportedAt: string
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed'
  actionTaken?: string
  reviewedBy?: string
}

export interface AuditLogEntry {
  id: string
  actorName: string
  actorRole: string
  action: string
  target: string
  timestamp: string
  details?: string
}

export interface OfficialPoll {
  id: string
  question: string
  description?: string
  createdBy: string
  createdAt: string
  expiresAt: string
  targetAudience: string
  isClosed: boolean
  options: {
    id: string
    text: string
    votes: number
  }[]
  totalVotes: number
  userVotedOptionId?: string | null
}

const STORAGE_KEY_INTERNAL_NOTES = 'bubt_auth_internal_notes_v1'
const STORAGE_KEY_ASSIGNMENTS = 'bubt_auth_assignments_v1'
const STORAGE_KEY_REPORTS = 'bubt_auth_reports_v1'
const STORAGE_KEY_AUDIT = 'bubt_auth_audit_v1'
const STORAGE_KEY_POLLS = 'bubt_auth_polls_v1'

const INITIAL_ASSIGNMENTS: Record<string, IssueAssignment> = {
  'post-101': {
    postId: 'post-101',
    departmentName: 'IT Infrastructure & Network Office',
    assigneeName: 'Engr. M. Kabir (Network Admin)',
    assignedAt: '2026-09-27T14:00:00Z',
    priority: 'urgent',
  },
  'post-102': {
    postId: 'post-102',
    departmentName: 'Central Library Affairs',
    assigneeName: 'Chief Librarian',
    assignedAt: '2026-09-28T10:00:00Z',
    priority: 'normal',
  },
  'post-105': {
    postId: 'post-105',
    departmentName: 'Campus Welfare & Cafeteria Committee',
    assigneeName: 'Assistant Proctor (Campus Facilities)',
    assignedAt: '2026-09-28T15:00:00Z',
    priority: 'high',
  },
}

const INITIAL_INTERNAL_NOTES: Record<string, InternalNote[]> = {
  'post-101': [
    {
      id: 'note-1',
      postId: 'post-101',
      authorName: 'Proctor Office',
      role: 'authority',
      text: 'Received multiple verbal complaints regarding Building 2 WiFi during midterms as well. Requested vendor site audit.',
      createdAt: '2026-09-27T12:00:00Z',
    },
    {
      id: 'note-2',
      postId: 'post-101',
      authorName: 'IT Section Head',
      role: 'authority',
      text: 'Vendor dispatched 2 UniFi AP replacements. Work order #WO-2026-88. Scheduled for completion by Thursday.',
      createdAt: '2026-09-28T09:30:00Z',
    },
  ],
  'post-105': [
    {
      id: 'note-3',
      postId: 'post-105',
      authorName: 'Student Welfare Chair',
      role: 'authority',
      text: 'Meeting scheduled with canteen contractor Mr. Mostafa on Sunday at 11 AM regarding unannounced price hikes.',
      createdAt: '2026-09-28T16:00:00Z',
    },
  ],
}

const INITIAL_REPORTS: ModerationReport[] = [
  {
    id: 'rep-1',
    targetType: 'comment',
    targetId: 'cmt-spam-1',
    targetTitle: 'Offensive language targeting batch mates in admission thread',
    authorName: 'Student_Temp_99',
    authorId: 'usr-flagged-1',
    reason: 'harassment',
    details: 'User posted aggressive and derogatory remarks towards juniors in the comment section.',
    reportedAt: '2026-09-28T18:30:00Z',
    status: 'pending',
  },
  {
    id: 'rep-2',
    targetType: 'post',
    targetId: 'post-rumor-1',
    targetTitle: 'False rumor claiming final exam cancellation',
    authorName: 'Unknown_Poster',
    authorId: 'usr-flagged-2',
    reason: 'misinformation',
    details: 'Post claims controller of exams postponed midterms without any official notice on annex or website.',
    reportedAt: '2026-09-29T08:15:00Z',
    status: 'pending',
  },
]

const INITIAL_AUDIT: AuditLogEntry[] = [
  {
    id: 'aud-1',
    actorName: 'Proctor Office',
    actorRole: 'authority',
    action: 'Status Change',
    target: 'Issue #post-101',
    timestamp: '2026-09-28 02:00 PM',
    details: 'Moved status to In Progress. Assigned to IT Infrastructure.',
  },
  {
    id: 'aud-2',
    actorName: 'Super Admin',
    actorRole: 'super_admin',
    action: 'Official Response',
    target: 'Issue #post-103',
    timestamp: '2026-09-27 08:30 AM',
    details: 'Published official verification for Intra-BUBT Programming Contest.',
  },
  {
    id: 'aud-3',
    actorName: 'Proctor Office',
    actorRole: 'authority',
    action: 'Issue Assignment',
    target: 'Issue #post-105',
    timestamp: '2026-09-28 03:00 PM',
    details: 'Assigned cafeteria pricing complaint to Campus Welfare Committee.',
  },
]

const INITIAL_POLLS: OfficialPoll[] = [
  {
    id: 'poll-1',
    question: 'Should the Central Library extend study hours until 9:00 PM during Final Examination week?',
    description: 'The Proctorial Body & Library Committee are evaluating feasibility based on student demand and security logistics.',
    createdBy: 'Proctor Office & Library Committee',
    createdAt: '2026-09-25T10:00:00Z',
    expiresAt: '2026-10-05T23:59:59Z',
    targetAudience: 'All BUBT Students',
    isClosed: false,
    options: [
      { id: 'opt-1-1', text: 'Yes, absolutely needed for group studies & quiet reading', votes: 482 },
      { id: 'opt-1-2', text: 'Yes, but until 8:00 PM is sufficient', votes: 114 },
      { id: 'opt-1-3', text: 'No, current hours (up to 6:30 PM) are fine', votes: 38 },
    ],
    totalVotes: 634,
    userVotedOptionId: 'opt-1-1',
  },
  {
    id: 'poll-2',
    question: 'Preferred timing for the upcoming BUBT Intra-University Hackathon 2026',
    description: 'Organized by BUBT Innovation Hub & CSE Department.',
    createdBy: 'BUBT Innovation Hub',
    createdAt: '2026-09-22T08:00:00Z',
    expiresAt: '2026-09-28T23:59:59Z',
    targetAudience: 'Faculty of Engineering (CSE/EEE)',
    isClosed: true,
    options: [
      { id: 'opt-2-1', text: 'Friday & Saturday (Weekend 36-hour sprint)', votes: 310 },
      { id: 'opt-2-2', text: 'During Mid-Semester Break', votes: 185 },
      { id: 'opt-2-3', text: 'Post-Final Exams', votes: 94 },
    ],
    totalVotes: 589,
    userVotedOptionId: null,
  },
]

const listeners = new Set<() => void>()
function notify() {
  listeners.forEach((fn) => fn())
}

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function saveStored<T>(key: string, val: T) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(val))
    notify()
  } catch (err) {
    console.error(`Failed to save ${key}`, err)
  }
}

export function useAuthorityStore() {
  const [internalNotes, setInternalNotes] = useState<Record<string, InternalNote[]>>(INITIAL_INTERNAL_NOTES)
  const [assignments, setAssignments] = useState<Record<string, IssueAssignment>>(INITIAL_ASSIGNMENTS)
  const [reports, setReports] = useState<ModerationReport[]>(INITIAL_REPORTS)
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(INITIAL_AUDIT)
  const [polls, setPolls] = useState<OfficialPoll[]>(INITIAL_POLLS)

  useEffect(() => {
    // Sync with localStorage on client mount
    setInternalNotes(getStored(STORAGE_KEY_INTERNAL_NOTES, INITIAL_INTERNAL_NOTES))
    setAssignments(getStored(STORAGE_KEY_ASSIGNMENTS, INITIAL_ASSIGNMENTS))
    setReports(getStored(STORAGE_KEY_REPORTS, INITIAL_REPORTS))
    setAuditLog(getStored(STORAGE_KEY_AUDIT, INITIAL_AUDIT))
    setPolls(getStored(STORAGE_KEY_POLLS, INITIAL_POLLS))

    const update = () => {
      setInternalNotes(getStored(STORAGE_KEY_INTERNAL_NOTES, INITIAL_INTERNAL_NOTES))
      setAssignments(getStored(STORAGE_KEY_ASSIGNMENTS, INITIAL_ASSIGNMENTS))
      setReports(getStored(STORAGE_KEY_REPORTS, INITIAL_REPORTS))
      setAuditLog(getStored(STORAGE_KEY_AUDIT, INITIAL_AUDIT))
      setPolls(getStored(STORAGE_KEY_POLLS, INITIAL_POLLS))
    }
    listeners.add(update)
    return () => {
      listeners.delete(update)
    }
  }, [])

  // Add internal private note
  const addInternalNote = (postId: string, text: string, authorName: string, role: string) => {
    const notes = getStored(STORAGE_KEY_INTERNAL_NOTES, INITIAL_INTERNAL_NOTES)
    const list = notes[postId] || []
    const newNote: InternalNote = {
      id: `note-${Date.now()}`,
      postId,
      authorName,
      role,
      text,
      createdAt: new Date().toISOString(),
    }
    notes[postId] = [newNote, ...list]
    saveStored(STORAGE_KEY_INTERNAL_NOTES, notes)

    // Append to audit log
    addAuditEntry(authorName, role, 'Added Internal Note', `Issue #${postId}`, text)
    return newNote
  }

  // Assign issue to department/staff
  const assignIssue = (
    postId: string,
    departmentName: string,
    assigneeName: string,
    priority: 'normal' | 'high' | 'urgent',
    actorName: string,
    actorRole: string
  ) => {
    const current = getStored(STORAGE_KEY_ASSIGNMENTS, INITIAL_ASSIGNMENTS)
    const updated: IssueAssignment = {
      postId,
      departmentName,
      assigneeName,
      priority,
      assignedAt: new Date().toISOString(),
    }
    current[postId] = updated
    saveStored(STORAGE_KEY_ASSIGNMENTS, current)

    addAuditEntry(
      actorName,
      actorRole,
      'Assigned Issue',
      `Issue #${postId}`,
      `Assigned to ${departmentName} (${assigneeName}) - Priority: ${priority.toUpperCase()}`
    )
  }

  // Moderation: resolve report
  const resolveReport = (
    reportId: string,
    action: 'dismiss' | 'remove' | 'warn' | 'ban',
    actorName: string,
    actorRole: string
  ) => {
    const list = getStored(STORAGE_KEY_REPORTS, INITIAL_REPORTS)
    const updated = list.map((r) => {
      if (r.id !== reportId) return r
      let status: ModerationReport['status'] = 'action_taken'
      let actionTaken = 'Content removed and author notified'
      if (action === 'dismiss') {
        status = 'dismissed'
        actionTaken = 'Dismissed as no violation'
      } else if (action === 'warn') {
        actionTaken = 'Official warning issued to user account'
      } else if (action === 'ban') {
        actionTaken = 'Account suspended for 14 days'
      }
      return {
        ...r,
        status,
        actionTaken,
        reviewedBy: actorName,
      }
    })
    saveStored(STORAGE_KEY_REPORTS, updated)

    addAuditEntry(
      actorName,
      actorRole,
      `Moderation: ${action.toUpperCase()}`,
      `Report #${reportId}`,
      `Action executed: ${action}`
    )
  }

  // Create an official poll
  const createPoll = (
    question: string,
    description: string,
    optionsList: string[],
    targetAudience: string,
    expiryDays: number,
    creatorName: string,
    creatorRole: string
  ) => {
    const list = getStored(STORAGE_KEY_POLLS, INITIAL_POLLS)
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + expiryDays)

    const newPoll: OfficialPoll = {
      id: `poll-${Date.now()}`,
      question,
      description,
      createdBy: creatorName,
      createdAt: new Date().toISOString(),
      expiresAt: expiry.toISOString(),
      targetAudience,
      isClosed: false,
      options: optionsList.map((opt, i) => ({
        id: `opt-${Date.now()}-${i}`,
        text: opt,
        votes: 0,
      })),
      totalVotes: 0,
      userVotedOptionId: null,
    }
    saveStored(STORAGE_KEY_POLLS, [newPoll, ...list])

    addAuditEntry(creatorName, creatorRole, 'Created Official Poll', `Poll: "${question}"`)
    return newPoll
  }

  // Vote on a poll
  const votePoll = (pollId: string, optionId: string) => {
    const list = getStored(STORAGE_KEY_POLLS, INITIAL_POLLS)
    const updated = list.map((p) => {
      if (p.id !== pollId) return p
      if (p.userVotedOptionId) return p // already voted

      return {
        ...p,
        userVotedOptionId: optionId,
        totalVotes: p.totalVotes + 1,
        options: p.options.map((opt) =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        ),
      }
    })
    saveStored(STORAGE_KEY_POLLS, updated)
  }

  // Toggle close poll
  const toggleClosePoll = (pollId: string, actorName: string, actorRole: string) => {
    const list = getStored(STORAGE_KEY_POLLS, INITIAL_POLLS)
    const updated = list.map((p) => {
      if (p.id !== pollId) return p
      const nextState = !p.isClosed
      addAuditEntry(
        actorName,
        actorRole,
        nextState ? 'Closed Poll' : 'Reopened Poll',
        `Poll: "${p.question}"`
      )
      return { ...p, isClosed: nextState }
    })
    saveStored(STORAGE_KEY_POLLS, updated)
  }

  // Append entry to audit log
  const addAuditEntry = (
    actorName: string,
    actorRole: string,
    action: string,
    target: string,
    details?: string
  ) => {
    const current = getStored(STORAGE_KEY_AUDIT, INITIAL_AUDIT)
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      actorName,
      actorRole,
      action,
      target,
      timestamp: new Date().toLocaleString(),
      details,
    }
    saveStored(STORAGE_KEY_AUDIT, [entry, ...current])
  }

  return {
    internalNotes,
    assignments,
    reports,
    auditLog,
    polls,
    addInternalNote,
    assignIssue,
    resolveReport,
    createPoll,
    votePoll,
    toggleClosePoll,
    addAuditEntry,
  }
}
