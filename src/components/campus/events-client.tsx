'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  PlusCircle,
  Sparkles,
  Share2,
  CalendarPlus,
  Check,
  Star,
  ExternalLink,
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useCampusLifeStore } from '@/lib/campus-life-store'
import { CampusEvent } from '@/lib/campus-life-data'
import { CreateEventModal } from '@/components/campus/create-event-modal'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface EventsClientProps {
  userRole?: string
  userName?: string
}

const CATEGORIES = [
  { id: 'all', label: 'All Events' },
  { id: 'tech', label: 'Tech & Hackathons' },
  { id: 'cultural', label: 'Cultural & Music' },
  { id: 'sports', label: 'Sports Tournaments' },
  { id: 'career', label: 'Career & Alumni' },
  { id: 'academic', label: 'Seminars' },
]

export function EventsClient({ userRole = 'student', userName = 'Student' }: EventsClientProps) {
  const { events, setEventRsvp, createEvent, exportToCalendar } = useCampusLifeStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchCategory = selectedCategory === 'all' || evt.category === selectedCategory
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.venue.toLowerCase().includes(q) ||
        evt.organizerName.toLowerCase().includes(q) ||
        evt.tags.some((t) => t.toLowerCase().includes(q))

      return matchCategory && matchSearch
    })
  }, [events, selectedCategory, searchQuery])

  const handleShare = (event: CampusEvent) => {
    navigator.clipboard.writeText(`${window.location.origin}/app/events?id=${event.id}`)
    toast.success('Event invitation link copied!')
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 via-cyan-500/5 to-teal-500/10 border border-blue-500/20 p-5 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  Campus Life & Events
                </h1>
                <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                  {events.length} Upcoming
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Intra-university hackathons, club fests, tournaments, and career networking meetups.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            className="h-9 gap-1.5 text-xs font-semibold shadow-xs"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Host Event</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events by title, organizer, tags or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
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

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card space-y-3">
          <Calendar className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
          <p className="text-base font-semibold text-foreground">No events match your criteria</p>
          <p className="text-xs text-muted-foreground">Try clearing your search query or selecting "All Events"</p>
          <Button
            variant="outline"
            size="sm"
            className="text-xs mt-2"
            onClick={() => {
              setSelectedCategory('all')
              setSearchQuery('')
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((evt) => {
            const startDateFormatted = new Date(evt.startDate).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })
            const fillPercentage = evt.maxAttendees
              ? Math.min(100, Math.round((evt.currentAttendees / evt.maxAttendees) * 100))
              : 0

            return (
              <Card
                key={evt.id}
                className={cn(
                  "border transition-all hover:shadow-md bg-card flex flex-col justify-between overflow-hidden",
                  evt.isFeatured && "border-primary/40 ring-1 ring-primary/20"
                )}
              >
                <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Top badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-xs capitalize font-medium">
                          {evt.category}
                        </Badge>
                        {evt.isFeatured && (
                          <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs border-amber-500/20">
                            <Star className="h-3 w-3 fill-amber-500" />
                            Featured
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            exportToCalendar(evt)
                            toast.success('Calendar event (.ics) exported!')
                          }}
                          title="Add to Google/Apple Calendar (.ics)"
                        >
                          <CalendarPlus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => handleShare(evt)}
                          title="Share event link"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-bold text-lg text-foreground leading-snug">
                        {evt.title}
                      </h3>
                      <p className="text-xs font-medium text-primary mt-0.5">
                        Organized by: {evt.organizerName}
                      </p>
                    </div>

                    {/* Time & Venue */}
                    <div className="space-y-1.5 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/60">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-medium text-foreground">{startDateFormatted}</span>
                        <span className="opacity-40">•</span>
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span className="text-foreground">{evt.venue}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>

                    {/* Tags */}
                    {evt.tags && evt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {evt.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer: RSVP controls & capacity progress */}
                  <div className="pt-3 border-t space-y-3 mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>
                          <strong className="text-foreground">{evt.currentAttendees}</strong>
                          {evt.maxAttendees && ` / ${evt.maxAttendees}`} Attendees
                        </span>
                      </div>

                      {evt.maxAttendees && (
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {fillPercentage}% Capacity
                        </span>
                      )}
                    </div>

                    {evt.maxAttendees && (
                      <Progress value={fillPercentage} className="h-1.5" />
                    )}

                    {/* Interactive RSVP buttons */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <Button
                        type="button"
                        variant={evt.rsvpStatus === 'going' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "h-8 text-xs font-semibold gap-1",
                          evt.rsvpStatus === 'going' && "bg-emerald-600 hover:bg-emerald-700 text-white"
                        )}
                        onClick={() => {
                          setEventRsvp(evt.id, evt.rsvpStatus === 'going' ? 'not_going' : 'going')
                          toast.success(evt.rsvpStatus === 'going' ? 'RSVP updated: Not Going' : 'RSVP updated: Going!')
                        }}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Going</span>
                      </Button>

                      <Button
                        type="button"
                        variant={evt.rsvpStatus === 'interested' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "h-8 text-xs font-medium",
                          evt.rsvpStatus === 'interested' && "bg-amber-600 hover:bg-amber-700 text-white"
                        )}
                        onClick={() => {
                          setEventRsvp(evt.id, evt.rsvpStatus === 'interested' ? 'not_going' : 'interested')
                          toast.success(evt.rsvpStatus === 'interested' ? 'RSVP removed' : 'Marked as Interested')
                        }}
                      >
                        Interested
                      </Button>

                      <Button
                        type="button"
                        variant={evt.rsvpStatus === 'not_going' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEventRsvp(evt.id, 'not_going')
                          toast.info('Marked as Can\'t Go')
                        }}
                      >
                        Can't Go
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Host Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createEvent}
        userRole={userRole}
        userName={userName}
      />
    </div>
  )
}
