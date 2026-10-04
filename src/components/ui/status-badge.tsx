import { Badge } from '@/components/ui/badge'
import { cn, getStatusColor, getPostTypeColor } from '@/lib/utils'

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return <Badge className={cn('text-xs', getStatusColor(status))}>{label}</Badge>
}

export function PostTypeBadge({ type }: { type: string }) {
  const label = type.charAt(0).toUpperCase() + type.slice(1)
  return <Badge variant="outline" className={cn('text-xs', getPostTypeColor(type))}>{label}</Badge>
}
