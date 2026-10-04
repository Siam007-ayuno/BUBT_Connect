'use client'

import { useState } from 'react'
import {
  AlertOctagon,
  ShieldAlert,
  Phone,
  PhoneCall,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Ambulance,
  Shield,
  LifeBuoy,
  Flame,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  HeartHandshake
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSosStore, SosAlert } from '@/lib/sos-store'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const PRESET_LOCATIONS = [
  'BUBT Main Gate 1 (Rupnagar Road)',
  'Building 1 Lobby & Ground Floor',
  'Building 2 Front & Cafeteria Yard',
  'Commerce College Road Turn (Mirpur-2)',
  'Rupnagar Residential Area Road 2',
  'Mirpur-2 Bus Stand / Roundabout',
  'National Heart Foundation Area',
  'Other / Off-Campus Spot',
]

const CATEGORY_MAP: Record<string, { label: string; icon: any; color: string }> = {
  harassment: {
    label: '🚨 Eve-teasing & Stalking by Outsiders',
    icon: AlertTriangle,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  medical: {
    label: '🚑 Sudden Medical Collapse / Unconscious',
    icon: Ambulance,
    color: 'text-red-500 bg-red-500/10 border-red-500/20',
  },
  accident: {
    label: '🩸 Road Accident / Severe Physical Injury',
    icon: ShieldAlert,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  },
  security: {
    label: '🛡️ Mugging / Extortion / Physical Threat',
    icon: AlertOctagon,
    color: 'text-red-600 bg-red-600/10 border-red-600/20',
  },
  other: {
    label: '⚠️ Other Urgent Distress / Immediate Help',
    icon: LifeBuoy,
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  },
}

export function SosClient() {
  const { profile } = useAuth()
  const {
    alerts,
    contacts,
    activeAlertCount,
    triggerSos,
    respondToSos,
    resolveSos,
  } = useSosStore()

  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false)
  const [category, setCategory] = useState<'harassment' | 'medical' | 'accident' | 'security' | 'other'>('harassment')
  const [locationSpot, setLocationSpot] = useState(PRESET_LOCATIONS[0])
  const [customLocation, setCustomLocation] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved'>('all')

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (filterStatus === 'active') return alert.status === 'active' || alert.status === 'responding'
    if (filterStatus === 'resolved') return alert.status === 'resolved'
    return true
  })

  // Submit SOS trigger
  const handleTriggerSos = (e: React.FormEvent) => {
    e.preventDefault()
    const resolvedLocation = locationSpot === 'Other / Off-Campus Spot'
      ? (customLocation.trim() || 'Near BUBT Campus')
      : locationSpot

    if (!description.trim() || !phone.trim()) {
      toast.error('Please provide a brief description and your phone number')
      return
    }

    const catMeta = CATEGORY_MAP[category]

    triggerSos({
      studentName: profile?.full_name || 'BUBT Student',
      studentId: profile?.student_id || undefined,
      department: profile?.department_id ? profile.department_id.replace('dept-', '').toUpperCase() : 'CSE',
      batch: profile?.batch_id ? `${profile.batch_id.replace('batch-cse-', '').replace('batch-', '')}th Intake` : '54th Intake',
      phone: phone.trim(),
      category,
      categoryLabel: catMeta.label,
      locationSpot: resolvedLocation,
      description: description.trim(),
    })

    toast.error('🚨 SOS DISTRESS BEACON SENT! BUBT Proctor desk & community alerted.', {
      duration: 6000,
    })
    setIsTriggerModalOpen(false)
    setDescription('')
    setCustomLocation('')
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Emergency Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white p-6 md:p-8 shadow-xl border border-red-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider">
              <span className="h-2.5 w-2.5 rounded-full bg-white animate-ping" />
              <span>BUBT Rapid Student Safety & SOS Network</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              In Danger or Facing Harassment?
            </h1>
            <p className="text-white/90 text-xs md:text-sm leading-relaxed">
              Immediate distress beacon dispatch. Directly alerts the BUBT Proctor Rapid Response Unit, campus security outposts, and nearby fellow students to stand with you.
            </p>
          </div>

          {/* Big Trigger SOS Button */}
          <div className="shrink-0 flex flex-col items-center">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-white/90 font-black text-sm md:text-base h-14 px-8 rounded-xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 gap-3 border-2 border-red-200"
              onClick={() => setIsTriggerModalOpen(true)}
            >
              <AlertOctagon className="h-6 w-6 text-red-600 animate-pulse" />
              <span>TRIGGER SOS DISTRESS</span>
            </Button>
            <span className="text-[11px] text-white/80 font-medium mt-1.5 flex items-center gap-1">
              <Radio className="h-3 w-3 animate-pulse text-amber-300" />
              1-Tap Proctor & Community Alert
            </span>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/20 text-white text-xs">
          <div>
            <span className="text-[11px] text-white/70 block">Proctor Response Desk</span>
            <span className="font-bold text-sm text-emerald-300 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> 24/7 Active on Duty
            </span>
          </div>
          <div>
            <span className="text-[11px] text-white/70 block">Active Distress Calls</span>
            <span className="font-bold text-sm">
              {activeAlertCount > 0 ? (
                <span className="text-amber-300 font-extrabold animate-pulse">
                  {activeAlertCount} Open Beacon{activeAlertCount > 1 ? 's' : ''}
                </span>
              ) : (
                '0 Current Emergencies'
              )}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-white/70 block">Campus Security Patrol</span>
            <span className="font-bold text-sm">Gates 1, 2 & Rupnagar Road</span>
          </div>
          <div>
            <span className="text-[11px] text-white/70 block">National Emergency Line</span>
            <span className="font-bold text-sm text-amber-200">Dial 999 Anytime</span>
          </div>
        </div>
      </div>

      {/* Emergency Hotline Quick Dial Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-primary" />
            Direct Campus & Emergency Hotlines (Instant Dial)
          </h2>
          <span className="text-xs text-muted-foreground hidden sm:block">Click any card to dial immediately</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {contacts.map((contact) => (
            <a
              key={contact.id}
              href={`tel:${contact.phone}`}
              className="p-4 rounded-xl border bg-card hover:border-red-500/50 hover:bg-muted/30 transition-all group flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {contact.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{contact.subtitle}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0 text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                    {contact.availability}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2">
                  {contact.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-red-600 dark:text-red-400">
                  {contact.phone}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                  <Phone className="h-3.5 w-3.5" />
                  Call Now
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Live Campus Distress Alerts Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-600 animate-pulse" />
              Live Campus Distress Alerts ({filteredAlerts.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Real-time student alerts. Stand by your fellow BUBTians if you are close by.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs h-8"
              onClick={() => setFilterStatus('all')}
            >
              All Alerts
            </Button>
            <Button
              variant={filterStatus === 'active' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs h-8 text-red-600 font-semibold"
              onClick={() => setFilterStatus('active')}
            >
              Active Only
            </Button>
            <Button
              variant={filterStatus === 'resolved' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs h-8"
              onClick={() => setFilterStatus('resolved')}
            >
              Resolved
            </Button>
          </div>
        </div>

        {filteredAlerts.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h3 className="font-bold text-sm text-foreground">No Active Distress Signals</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Campus area is calm and all previous alerts have been resolved. If you or someone nearby needs help, trigger an SOS immediately.
            </p>
          </Card>
        ) : (
          <div className="space-y-3.5">
            {filteredAlerts.map((alert) => {
              const isActive = alert.status === 'active' || alert.status === 'responding'
              const catMeta = CATEGORY_MAP[alert.category] || CATEGORY_MAP.other

              return (
                <Card
                  key={alert.id}
                  className={cn(
                    "relative overflow-hidden border transition-all",
                    isActive
                      ? "border-red-500/50 bg-gradient-to-r from-red-500/[0.05] via-transparent to-background shadow-md"
                      : "bg-card opacity-80"
                  )}
                >
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold border", catMeta.color)}>
                            {alert.categoryLabel}
                          </span>
                          <Badge
                            variant={isActive ? "destructive" : "secondary"}
                            className="text-[10px] font-semibold"
                          >
                            {alert.status === 'active' ? '🚨 Active Distress' : alert.status === 'responding' ? '👥 Responders En Route' : '✅ Resolved'}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-foreground">{alert.studentName}</span>
                          <span className="text-muted-foreground">• Dept. of {alert.department || 'CSE'} ({alert.batch || 'Campus Member'})</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-semibold pt-0.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>Spot: {alert.locationSpot}</span>
                        </div>
                      </div>

                      {/* Responders Count Badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="p-2 rounded-xl bg-muted/60 border text-center">
                          <span className="text-xs font-black text-foreground block">
                            {alert.respondersCount}
                          </span>
                          <span className="text-[9px] text-muted-foreground uppercase leading-none block">
                            Responding
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Alert Description */}
                    <p className="text-xs text-foreground bg-muted/30 p-3 rounded-lg border border-border/60 leading-relaxed font-medium">
                      {alert.description}
                    </p>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/60">
                      <div className="flex items-center gap-2">
                        {/* Direct Call to Student */}
                        <a
                          href={`tel:${alert.phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>Call: {alert.phone}</span>
                        </a>

                        {/* Join / Respond to SOS */}
                        {isActive && (
                          <Button
                            type="button"
                            variant={alert.hasJoined ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "text-xs gap-1.5 font-bold h-8",
                              alert.hasJoined
                                ? "bg-primary text-primary-foreground"
                                : "border-primary/40 text-primary hover:bg-primary/10"
                            )}
                            onClick={() => {
                              respondToSos(alert.id)
                              if (!alert.hasJoined) {
                                toast.success("Thank you! You marked yourself as a responder en route.")
                              }
                            }}
                          >
                            <HeartHandshake className="h-3.5 w-3.5" />
                            <span>{alert.hasJoined ? "I'm Helping" : 'I Am Coming to Help'}</span>
                          </Button>
                        )}
                      </div>

                      {/* Resolve Button (for proctor or creator) */}
                      {isActive && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-emerald-600 h-8"
                          onClick={() => {
                            resolveSos(alert.id)
                            toast.success('Alert marked as resolved.')
                          }}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Safety Protocol Card */}
      <Card className="p-5 border bg-muted/20 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          BUBT Campus Safety Quick Protocols
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-muted-foreground">
          <div className="p-3 rounded-lg border bg-background space-y-1">
            <h4 className="font-bold text-foreground">1. In Case of Eve-teasing / Stalking</h4>
            <p>Do not confront violently alone. Move toward Gate 1 or nearest tea stall with BUBT students and call the Proctor Desk immediately.</p>
          </div>
          <div className="p-3 rounded-lg border bg-background space-y-1">
            <h4 className="font-bold text-foreground">2. Physical Injury / Fainting</h4>
            <p>BUBT First Aid Clinic is on Building 1 Ground Floor. For critical transport, call Al-Markazul Ambulance Mirpur (+8801711818692).</p>
          </div>
          <div className="p-3 rounded-lg border bg-background space-y-1">
            <h4 className="font-bold text-foreground">3. Night Walking in Rupnagar</h4>
            <p>Avoid isolated dark alleyways behind Building 2 after 8:30 PM. Walk in groups toward the main Commerce College road.</p>
          </div>
        </div>
      </Card>

      {/* TRIGGER SOS MODAL */}
      <Dialog open={isTriggerModalOpen} onOpenChange={setIsTriggerModalOpen}>
        <DialogContent className="sm:max-w-lg border-red-500/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-red-600">
              <AlertOctagon className="h-5 w-5 fill-red-600 text-white" />
              Trigger Campus Emergency Distress (SOS)
            </DialogTitle>
            <DialogDescription className="text-xs">
              This will broadcast an urgent emergency alert to the BUBT Proctor Rapid Response Unit and active students nearby.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTriggerSos} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Select Nature of Emergency *</Label>
              <Select
                value={category}
                onValueChange={(val: any) => setCategory(val)}
              >
                <SelectTrigger className="text-xs h-9 font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="harassment">🚨 Eve-teasing & Stalking by Outsiders</SelectItem>
                  <SelectItem value="medical">🚑 Sudden Medical Collapse / Unconscious</SelectItem>
                  <SelectItem value="accident">🩸 Road Accident / Severe Physical Injury</SelectItem>
                  <SelectItem value="security">🛡️ Mugging / Threat / Extortion by Outsiders</SelectItem>
                  <SelectItem value="other">⚠️ Other Urgent Distress / Immediate Help</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Your Exact Location Spot *</Label>
              <Select
                value={locationSpot}
                onValueChange={(val: any) => setLocationSpot(val || PRESET_LOCATIONS[0])}
              >
                <SelectTrigger className="text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {locationSpot === 'Other / Off-Campus Spot' && (
                <Input
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Specify exact spot (e.g. Near Mirpur-2 Dutch Bangla ATM)"
                  required
                  className="text-xs h-9 mt-1.5"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Emergency Phone Number to Reach You *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                  required
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">What is happening? Describe immediately *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 2 outsiders on bikes blocking way and harassing female students, need immediate support or proctor guards..."
                required
                className="text-xs h-20 resize-none"
              />
            </div>

            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
              <p className="font-bold flex items-center gap-1.5">
                <Radio className="h-4 w-4 animate-pulse" />
                Emergency Beacon
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Proctor Rapid Response Team (+8801741129242) will receive immediate dispatch. Use only for genuine distress.
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsTriggerModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold gap-2 px-5"
              >
                <AlertOctagon className="h-4 w-4 fill-white" />
                BROADCAST SOS NOW
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
