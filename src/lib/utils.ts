import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatDate(date: string | Date, fmt: string = 'PPP'): string {
  return format(new Date(date), fmt)
}

export function getInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') return 'BU'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return 'BU'
  return parts
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'BU'
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'open': return 'bg-secondary text-secondary-foreground'
    case 'under_review': return 'bg-warning text-warning-foreground'
    case 'in_progress': return 'bg-info text-info-foreground'
    case 'resolved': return 'bg-success text-success-foreground'
    case 'rejected': return 'bg-destructive text-destructive-foreground'
    default: return 'bg-muted text-muted-foreground'
  }
}

export function getPostTypeColor(type: string): string {
  switch (type) {
    case 'problem': return 'bg-destructive/10 text-destructive border-destructive/20'
    case 'suggestion': return 'bg-warning/10 text-warning-foreground border-warning/20'
    case 'question': return 'bg-info/10 text-info border-info/20'
    case 'discussion': return 'bg-secondary text-secondary-foreground border-secondary'
    default: return 'bg-muted text-muted-foreground'
  }
}
