'use client'

import { Search, SlidersHorizontal, Flame, Clock, TrendingUp, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INITIAL_CATEGORIES, INITIAL_DEPARTMENTS } from '@/lib/demo-data'

export interface FilterState {
  search: string
  type: string
  category: string
  department: string
  status: string
  sortBy: 'trending' | 'newest' | 'upvoted'
}

interface FeedFiltersProps {
  filters: FilterState
  onChange: (updated: Partial<FilterState>) => void
  onReset: () => void
}

const POST_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'problem', label: '⚠️ Problems' },
  { value: 'suggestion', label: '💡 Suggestions' },
  { value: 'question', label: '❓ Questions' },
  { value: 'discussion', label: '💬 Discussions' },
]

const STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
]

export function FeedFilters({ filters, onChange, onReset }: FeedFiltersProps) {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.department !== 'all' ||
    filters.status !== 'all'

  return (
    <div className="space-y-3.5 bg-card border rounded-xl p-3.5 sm:p-4 shadow-xs">
      {/* Top Search Bar & Sort Toggle */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search problems, questions, suggestions..."
            className="pl-9 h-9 text-xs bg-muted/40"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: '' })}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort By Toggle */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border shrink-0">
          <button
            type="button"
            onClick={() => onChange({ sortBy: 'trending' })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              filters.sortBy === 'trending'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span>Trending</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ sortBy: 'newest' })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              filters.sortBy === 'newest'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            <span>Newest</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ sortBy: 'upvoted' })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              filters.sortBy === 'upvoted'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span>Most Voted</span>
          </button>
        </div>
      </div>

      {/* Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {POST_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => onChange({ type: t.value })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              filters.type === t.value
                ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
                : 'bg-muted/30 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Secondary Dropdown Selectors: Category, Department, Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t">
        {/* Category Select */}
        <div>
          <Select value={filters.category} onValueChange={(val) => onChange({ category: val ?? 'all' })}>
            <SelectTrigger className="h-8 text-xs bg-muted/30">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories (13)</SelectItem>
              {INITIAL_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Department Select */}
        <div>
          <Select value={filters.department} onValueChange={(val) => onChange({ department: val ?? 'all' })}>
            <SelectTrigger className="h-8 text-xs bg-muted/30">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Campus-wide (All Depts)</SelectItem>
              {INITIAL_DEPARTMENTS.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.code} - {dept.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Issue Status Select */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Select value={filters.status} onValueChange={(val) => onChange({ status: val ?? 'all' })}>
              <SelectTrigger className="h-8 text-xs bg-muted/30">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="xs"
              onClick={onReset}
              className="text-xs text-destructive hover:bg-destructive/10 shrink-0 h-8 px-2"
              title="Reset all filters"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
