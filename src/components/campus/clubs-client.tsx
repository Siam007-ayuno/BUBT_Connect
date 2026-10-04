'use client'

import { useState, useMemo } from 'react'
import {
  Users,
  Search,
  Sparkles,
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCampusLifeStore } from '@/lib/campus-life-store'
import { ClubItem } from '@/lib/campus-life-data'
import { ClubDetailModal } from '@/components/campus/club-detail-modal'
import { JoinClubModal } from '@/components/campus/join-club-modal'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ClubsClientProps {
  userRole?: string
  userName?: string
}

const CATEGORIES = [
  { id: 'all', label: 'All Societies' },
  { id: 'technology', label: 'Tech & Engineering' },
  { id: 'culture', label: 'Culture & Arts' },
  { id: 'sports', label: 'Sports' },
  { id: 'leadership', label: 'Debate & Leadership' },
  { id: 'academic', label: 'Global Branches' },
]

export function ClubsClient({ userRole = 'student', userName = 'Student' }: ClubsClientProps) {
  const { clubs, joinedClubIds, toggleJoinClub } = useCampusLifeStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [recruitingOnly, setRecruitingOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClub, setSelectedClub] = useState<ClubItem | null>(null)
  const [clubToJoin, setClubToJoin] = useState<ClubItem | null>(null)

  const filteredClubs = useMemo(() => {
    return clubs.filter((c) => {
      const matchCategory = selectedCategory === 'all' || c.category === selectedCategory
      const matchRecruiting = !recruitingOnly || c.isRecruiting
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.shortCode.toLowerCase().includes(q) ||
        c.motto.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.president.toLowerCase().includes(q)

      return matchCategory && matchRecruiting && matchSearch
    })
  }, [clubs, selectedCategory, recruitingOnly, searchQuery])

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-cyan-500/10 border border-teal-500/20 p-5 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  BUBT Clubs & Student Societies
                </h1>
                <Badge variant="outline" className="text-xs bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">
                  {clubs.length} Official Clubs
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Join co-curricular organizations, participate in national competitions, and build leadership skills.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1.5 text-xs font-semibold gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>You are a member of {joinedClubIds.size} club(s)</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clubs by name, code (BITC, BRC), or motto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs sm:text-sm"
            />
          </div>

          <Button
            type="button"
            variant={recruitingOnly ? 'default' : 'outline'}
            className={cn("h-10 text-xs gap-1.5 shrink-0", recruitingOnly && "bg-emerald-600 hover:bg-emerald-700")}
            onClick={() => setRecruitingOnly(!recruitingOnly)}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Recruiting Now Only</span>
          </Button>
        </div>

        {/* Category Filter Pills */}
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

      {/* Clubs Cards Grid */}
      {filteredClubs.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card space-y-3">
          <Users className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
          <p className="text-base font-semibold text-foreground">No societies found matching your criteria</p>
          <Button
            variant="outline"
            size="sm"
            className="text-xs mt-2"
            onClick={() => {
              setSelectedCategory('all')
              setRecruitingOnly(false)
              setSearchQuery('')
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club) => {
            const isMember = joinedClubIds.has(club.id)

            return (
              <Card
                key={club.id}
                className="border transition-all hover:shadow-md hover:border-primary/40 bg-card flex flex-col justify-between overflow-hidden group cursor-pointer"
                onClick={() => setSelectedClub(club)}
              >
                <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary font-bold text-base flex items-center justify-center shrink-0 border border-primary/20">
                          {club.shortCode.slice(0, 3)}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                            {club.name}
                          </h3>
                          <Badge variant="outline" className="text-[10px] font-mono mt-0.5">
                            {club.category}
                          </Badge>
                        </div>
                      </div>

                      {club.isRecruiting && (
                        <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shrink-0">
                          Recruiting
                        </Badge>
                      )}
                    </div>

                    {/* Motto */}
                    <p className="text-xs font-serif italic text-muted-foreground line-clamp-1">
                      "{club.motto}"
                    </p>

                    {/* Excerpt */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {club.description}
                    </p>

                    {/* Stats & Leadership */}
                    <div className="pt-2 border-t space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Members:</span>
                        <strong className="text-foreground">{club.memberCount} Students</strong>
                      </div>
                      <div className="flex items-center justify-between truncate">
                        <span>President:</span>
                        <span className="text-foreground font-medium truncate max-w-[170px]">{club.president}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t flex items-center justify-between gap-2 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs gap-1 text-primary hover:text-primary p-0 h-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedClub(club)
                      }}
                    >
                      <span>Explore</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>

                    {isMember ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs px-2.5 py-1 gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Member
                      </Badge>
                    ) : club.isRecruiting ? (
                      <Button
                        size="sm"
                        className="h-8 text-xs font-semibold"
                        onClick={(e) => {
                          e.stopPropagation()
                          setClubToJoin(club)
                        }}
                      >
                        Join Society
                      </Button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">Closed</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Club Details Modal */}
      <ClubDetailModal
        club={selectedClub}
        isOpen={!!selectedClub}
        onClose={() => setSelectedClub(null)}
        isJoined={selectedClub ? joinedClubIds.has(selectedClub.id) : false}
        onOpenJoinModal={(c) => setClubToJoin(c)}
        onToggleMembership={(id) => {
          toggleJoinClub(id)
          toast.success('Membership updated!')
        }}
      />

      {/* Join Application Modal */}
      <JoinClubModal
        club={clubToJoin}
        isOpen={!!clubToJoin}
        onClose={() => setClubToJoin(null)}
        onSuccess={(id) => toggleJoinClub(id)}
        studentName={userName}
      />
    </div>
  )
}
