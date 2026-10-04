'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  PlusCircle,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCampusLifeStore } from '@/lib/campus-life-store'
import { LostFoundItem } from '@/lib/campus-life-data'
import { PostLostFoundModal } from '@/components/campus/post-lost-found-modal'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface LostFoundClientProps {
  userRole?: string
  userName?: string
}

export function LostFoundClient({ userRole = 'student', userName = 'Student' }: LostFoundClientProps) {
  const { lostFoundItems, createLostFoundItem, updateLostFoundStatus } = useCampusLifeStore()
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)

  const filteredItems = useMemo(() => {
    return lostFoundItems.filter((item) => {
      const matchType = activeTab === 'all' || item.type === activeTab
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.contactName.toLowerCase().includes(q)

      return matchType && matchCategory && matchSearch
    })
  }, [lostFoundItems, activeTab, selectedCategory, searchQuery])

  const counts = useMemo(() => {
    return {
      all: lostFoundItems.length,
      lost: lostFoundItems.filter((i) => i.type === 'lost').length,
      found: lostFoundItems.filter((i) => i.type === 'found').length,
      recovered: lostFoundItems.filter((i) => i.status === 'claimed' || i.status === 'returned').length,
    }
  }, [lostFoundItems])

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-rose-500/10 border border-amber-500/20 p-5 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <Search className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  BUBT Lost & Found Central
                </h1>
                <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  {counts.recovered} Items Returned
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Report lost belongings, register found property, and coordinate claims through the Proctor Office.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            className="h-9 gap-1.5 text-xs font-semibold shadow-xs"
            onClick={() => setIsPostModalOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Report Item</span>
          </Button>
        </div>
      </div>

      {/* Tabs & Search Strip */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Main Type Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-muted/50 p-1 rounded-xl border border-border sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-center",
                activeTab === 'all' ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All Items ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lost')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-center flex items-center justify-center gap-1",
                activeTab === 'lost' ? "bg-red-500 text-white shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <AlertTriangle className="h-3 w-3" />
              Lost ({counts.lost})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('found')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-center flex items-center justify-center gap-1",
                activeTab === 'found' ? "bg-emerald-600 text-white shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CheckCircle2 className="h-3 w-3" />
              Found ({counts.found})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items by name, room, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {['all', 'electronics', 'id_card', 'books', 'accessories', 'clothing', 'other'].map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full font-medium transition-all shrink-0 border capitalize",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {cat.replace('_', ' ')}
              </button>
            )
          })}
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card space-y-3">
          <Search className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
          <p className="text-base font-semibold text-foreground">No lost or found items found</p>
          <Button
            variant="outline"
            size="sm"
            className="text-xs mt-2"
            onClick={() => {
              setActiveTab('all')
              setSelectedCategory('all')
              setSearchQuery('')
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isLost = item.type === 'lost'
            const isResolved = item.status === 'claimed' || item.status === 'returned'

            return (
              <Card
                key={item.id}
                className={cn(
                  "border transition-all hover:shadow-md bg-card flex flex-col justify-between overflow-hidden",
                  isResolved && "opacity-80"
                )}
              >
                <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    {/* Badge Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-bold text-xs uppercase tracking-wider",
                            isLost
                              ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          )}
                        >
                          {item.type.toUpperCase()}
                        </Badge>

                        <Badge variant="outline" className="text-[10px] capitalize">
                          {item.category.replace('_', ' ')}
                        </Badge>
                      </div>

                      {/* Status indicator */}
                      <Badge
                        variant={isResolved ? 'secondary' : 'outline'}
                        className={cn(
                          "text-[10px] font-semibold capitalize",
                          item.status === 'open' && "text-amber-600 bg-amber-500/10 border-amber-500/20",
                          item.status === 'claimed' && "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
                          item.status === 'returned' && "text-blue-600 bg-blue-500/10 border-blue-500/20"
                        )}
                      >
                        {item.status}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base text-foreground leading-snug">
                      {item.title}
                    </h3>

                    {/* Location & Date */}
                    <div className="space-y-1 text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/50">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span className="font-medium text-foreground">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>Date: {item.date}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    {/* Claim Instructions if Found */}
                    {item.claimInstructions && (
                      <div className="p-2 rounded bg-primary/5 border border-primary/20 text-[11px] text-primary space-y-0.5">
                        <strong>Claim instructions:</strong>
                        <p>{item.claimInstructions}</p>
                      </div>
                    )}
                  </div>

                  {/* Contact & Claim Action */}
                  <div className="pt-3 border-t space-y-2 mt-2">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Reported by:</span>
                        <strong className="text-foreground">{item.contactName}</strong>
                      </div>
                      {item.contactPhone && (
                        <div className="flex items-center gap-1.5 text-foreground font-mono text-[11px]">
                          <Phone className="h-3 w-3 text-primary" />
                          <span>{item.contactPhone}</span>
                        </div>
                      )}
                    </div>

                    {/* Resolve button */}
                    {!isResolved && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-7.5 gap-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30"
                        onClick={() => {
                          const nextStatus = item.type === 'lost' ? 'returned' : 'claimed'
                          updateLostFoundStatus(item.id, nextStatus)
                          toast.success(`Marked as ${nextStatus}!`)
                        }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{item.type === 'lost' ? 'I Recovered This Item' : 'Mark as Claimed / Handed Over'}</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Post Modal */}
      <PostLostFoundModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPost={createLostFoundItem}
        userRole={userRole}
        userName={userName}
      />
    </div>
  )
}
