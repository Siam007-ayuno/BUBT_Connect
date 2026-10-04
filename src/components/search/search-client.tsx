'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  MessageSquare,
  Bell,
  Calendar,
  Users,
  BookOpen,
  Phone,
  ArrowRight,
  Filter,
  Sparkles
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useVoiceBoardStore } from '@/lib/voice-board-store'
import { INITIAL_NOTICES } from '@/lib/notices-data'
import { INITIAL_EVENTS, INITIAL_CLUBS, DIRECTORY_CONTACTS } from '@/lib/campus-life-data'
import { INITIAL_RESOURCES } from '@/lib/academic-data'
import { cn } from '@/lib/utils'

export function SearchClient() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | 'posts' | 'notices' | 'events' | 'clubs' | 'resources' | 'directory'>('all')
  const { posts } = useVoiceBoardStore()

  const q = query.toLowerCase().trim()

  const matchingPosts = useMemo(() => {
    if (!q) return []
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        p.category?.name_en?.toLowerCase().includes(q)
    ).map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: `${p.category?.name_en || 'Discussion'} • ${p.type.toUpperCase()} • ${p.upvote_count} upvotes`,
      link: `/app/posts/${p.id}`,
      type: 'Post',
      icon: MessageSquare,
      color: 'text-blue-500 bg-blue-500/10',
    }))
  }, [posts, q])

  const matchingNotices = useMemo(() => {
    if (!q) return []
    return INITIAL_NOTICES.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.referenceNo.toLowerCase().includes(q) ||
        n.issuingAuthority.toLowerCase().includes(q)
    ).map((n) => ({
      id: n.id,
      title: n.title,
      subtitle: `Ref: ${n.referenceNo} • ${n.issuingAuthority}`,
      link: `/app/notices?ref=${encodeURIComponent(n.referenceNo)}`,
      type: 'Official Circular',
      icon: Bell,
      color: 'text-purple-500 bg-purple-500/10',
    }))
  }, [q])

  const matchingEvents = useMemo(() => {
    if (!q) return []
    return INITIAL_EVENTS.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.organizerName.toLowerCase().includes(q)
    ).map((e) => ({
      id: e.id,
      title: e.title,
      subtitle: `${e.time} • ${e.venue} • Organized by ${e.organizerName}`,
      link: `/app/events`,
      type: 'Event',
      icon: Calendar,
      color: 'text-amber-500 bg-amber-500/10',
    }))
  }, [q])

  const matchingClubs = useMemo(() => {
    if (!q) return []
    return INITIAL_CLUBS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.shortCode.toLowerCase().includes(q) ||
        c.motto.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    ).map((c) => ({
      id: c.id,
      title: `${c.name} (${c.shortCode})`,
      subtitle: `"${c.motto}" • ${c.memberCount} Members`,
      link: `/app/clubs`,
      type: 'Club',
      icon: Users,
      color: 'text-emerald-500 bg-emerald-500/10',
    }))
  }, [q])

  const matchingResources = useMemo(() => {
    if (!q) return []
    return INITIAL_RESOURCES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.courseCode.toLowerCase().includes(q) ||
        r.courseTitle.toLowerCase().includes(q)
    ).map((r) => ({
      id: r.id,
      title: `${r.courseCode}: ${r.title}`,
      subtitle: `${r.courseTitle} • ${r.department} • ${r.fileFormat}`,
      link: `/app/resources`,
      type: 'Academic Resource',
      icon: BookOpen,
      color: 'text-indigo-500 bg-indigo-500/10',
    }))
  }, [q])

  const matchingContacts = useMemo(() => {
    if (!q) return []
    return DIRECTORY_CONTACTS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.designation.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q)
    ).map((d) => ({
      id: d.id,
      title: d.name,
      subtitle: `${d.designation} • ${d.department} • ${d.phone}`,
      link: `/app/directory`,
      type: 'Directory',
      icon: Phone,
      color: 'text-red-500 bg-red-500/10',
    }))
  }, [q])

  const allResults = useMemo(() => {
    const list = []
    if (category === 'all' || category === 'posts') list.push(...matchingPosts)
    if (category === 'all' || category === 'notices') list.push(...matchingNotices)
    if (category === 'all' || category === 'events') list.push(...matchingEvents)
    if (category === 'all' || category === 'clubs') list.push(...matchingClubs)
    if (category === 'all' || category === 'resources') list.push(...matchingResources)
    if (category === 'all' || category === 'directory') list.push(...matchingContacts)
    return list
  }, [category, matchingPosts, matchingNotices, matchingEvents, matchingClubs, matchingResources, matchingContacts])

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Search Header & Input */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Campus Search</h1>
        <p className="text-xs text-muted-foreground">
          Instant search across voice issues, official circulars, exam routines, club societies, course resources, and campus directory.
        </p>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Type anything (e.g. 'Wi-Fi', 'CSE 311', 'Midterm', 'Proctor', 'BITC')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 text-sm sm:text-base rounded-xl shadow-xs"
            autoFocus
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'posts', label: 'Voice Board' },
            { id: 'notices', label: 'Circulars' },
            { id: 'events', label: 'Events' },
            { id: 'clubs', label: 'Societies' },
            { id: 'resources', label: 'Resources' },
            { id: 'directory', label: 'Directory' },
          ].map((cat) => {
            const isSelected = category === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id as any)}
                className={cn(
                  "px-3 py-1.5 rounded-full font-medium transition-all shrink-0 border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results View */}
      {!q ? (
        <div className="p-8 rounded-2xl border bg-muted/20 text-center space-y-3">
          <Sparkles className="h-8 w-8 text-primary mx-auto opacity-60" />
          <h3 className="font-semibold text-sm text-foreground">Search BUBT Connect Knowledge Base</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Try searching for upcoming exams, course codes like CSE 311, campus clubs, transport routes, or emergency contacts.
          </p>
        </div>
      ) : allResults.length === 0 ? (
        <div className="p-8 rounded-2xl border bg-card text-center space-y-2">
          <p className="font-semibold text-sm text-foreground">No matches found for "{query}"</p>
          <p className="text-xs text-muted-foreground">Try broadening your search or choosing "All Results".</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Found <strong className="text-foreground">{allResults.length}</strong> results</span>
          </div>

          <div className="space-y-2">
            {allResults.map((item, idx) => {
              const Icon = item.icon
              return (
                <Link key={idx} href={item.link}>
                  <Card className="border hover:border-primary/50 transition-all bg-card shadow-xs group cursor-pointer mb-2">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", item.color)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                              {item.title}
                            </h4>
                            <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
                              {item.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
