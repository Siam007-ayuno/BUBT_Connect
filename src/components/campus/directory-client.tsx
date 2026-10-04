'use client'

import { useState, useMemo } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Search,
  ShieldAlert,
  Building2,
  Copy,
  Check,
  User,
  GraduationCap,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { DIRECTORY_CONTACTS, DirectoryContact } from '@/lib/campus-life-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function DirectoryClient() {
  const [selectedRole, setSelectedRole] = useState<'all' | 'emergency' | 'administration' | 'faculty'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success(`${label} copied to clipboard`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredContacts = useMemo(() => {
    return DIRECTORY_CONTACTS.filter((c) => {
      const matchRole =
        selectedRole === 'all'
          ? true
          : selectedRole === 'emergency'
          ? c.isEmergency
          : c.role === selectedRole

      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.designation.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.roomNo.toLowerCase().includes(q)

      return matchRole && matchSearch
    })
  }, [selectedRole, searchQuery])

  const emergencyContacts = DIRECTORY_CONTACTS.filter((c) => c.isEmergency)

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600/10 via-rose-500/5 to-amber-500/10 border border-red-500/20 p-5 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <Phone className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  BUBT Directory & Emergency Desk
                </h1>
                <Badge variant="destructive" className="text-xs">
                  24/7 Security
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Official contact numbers, faculty office hours, campus locations, and emergency assistance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines Strip */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 text-red-500" />
          Campus Emergency Hotlines
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {emergencyContacts.map((contact) => (
            <Card
              key={contact.id}
              className="border-red-500/30 bg-red-500/[0.03] hover:border-red-500/50 transition-all shadow-xs"
            >
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="destructive" className="text-[10px] uppercase">
                    Emergency
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {contact.roomNo}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-foreground">{contact.name}</h3>
                  <p className="text-xs text-muted-foreground">{contact.designation}</p>
                </div>

                <div className="pt-2 border-t flex items-center justify-between gap-2">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-1.5 text-xs font-bold font-mono text-red-600 dark:text-red-400 hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{contact.phone}</span>
                  </a>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => handleCopy(contact.phone, contact.id, 'Phone')}
                  >
                    {copiedId === contact.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, designation, department, room, or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs sm:text-sm"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="grid grid-cols-4 gap-1 bg-muted/60 p-1 rounded-xl border border-border sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedRole('all')}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center",
                selectedRole === 'all' ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('emergency')}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center",
                selectedRole === 'emergency' ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Emergency
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('administration')}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center",
                selectedRole === 'administration' ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Administration
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('faculty')}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center",
                selectedRole === 'faculty' ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Faculty
            </button>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card space-y-3">
          <Phone className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
          <p className="text-base font-semibold text-foreground">No contacts found</p>
          <Button
            variant="outline"
            size="sm"
            className="text-xs mt-2"
            onClick={() => {
              setSelectedRole('all')
              setSearchQuery('')
            }}
          >
            Reset Directory Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <Card
              key={contact.id}
              className="border hover:border-primary/40 transition-all bg-card shadow-xs flex flex-col justify-between"
            >
              <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[10px] capitalize font-mono">
                      {contact.role}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-amber-500" />
                      {contact.building}, {contact.roomNo}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground leading-snug">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-primary font-medium mt-0.5">
                      {contact.designation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {contact.department}
                    </p>
                  </div>

                  {contact.officeHours && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 p-2 rounded border border-border/50">
                      <Clock className="h-3 w-3 text-primary shrink-0" />
                      <span>Hours: <strong className="text-foreground">{contact.officeHours}</strong></span>
                    </div>
                  )}
                </div>

                {/* Contact actions */}
                <div className="pt-3 border-t space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-1.5 font-mono text-foreground hover:text-primary font-semibold transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>{contact.phone}</span>
                    </a>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleCopy(contact.phone, `${contact.id}-phone`, 'Phone')}
                      title="Copy phone"
                    >
                      {copiedId === `${contact.id}-phone` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground truncate max-w-[200px]"
                    >
                      <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </a>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleCopy(contact.email, `${contact.id}-email`, 'Email')}
                      title="Copy email"
                    >
                      {copiedId === `${contact.id}-email` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
