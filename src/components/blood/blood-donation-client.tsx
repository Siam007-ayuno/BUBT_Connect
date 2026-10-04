'use client'

import { useState } from 'react'
import {
  Heart,
  Droplet,
  Phone,
  MapPin,
  Clock,
  PlusCircle,
  AlertTriangle,
  Search,
  CheckCircle2,
  Share2,
  Users,
  Shield,
  Activity,
  Calendar,
  Sparkles,
  Info,
  UserCheck
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
import {
  useBloodDonationStore,
  BloodRequest,
  BloodDonor
} from '@/lib/blood-donation-store'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const
type BloodGroupFilter = typeof BLOOD_GROUPS[number]

export function BloodDonationClient() {
  const { profile } = useAuth()
  const {
    requests,
    donors,
    pledgedRequestIds,
    addBloodRequest,
    pledgeDonation,
    registerDonor,
  } = useBloodDonationStore()

  const [activeTab, setActiveTab] = useState<'requests' | 'donors' | 'guide'>('requests')
  const [selectedGroup, setSelectedGroup] = useState<BloodGroupFilter>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'critical' | 'within_24h'>('all')

  // Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [reqPatientName, setReqPatientName] = useState('')
  const [reqBloodGroup, setReqBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('B+')
  const [reqBagsNeeded, setReqBagsNeeded] = useState('1')
  const [reqHospitalName, setReqHospitalName] = useState('')
  const [reqHospitalLocation, setReqHospitalLocation] = useState('Mirpur-2, Dhaka (Near BUBT)')
  const [reqUrgency, setReqUrgency] = useState<'critical' | 'within_24h' | 'routine'>('critical')
  const [reqReason, setReqReason] = useState('')
  const [reqContactNumber, setReqContactNumber] = useState(profile?.phone || '')
  const [reqDateNeeded, setReqDateNeeded] = useState('Immediate / Today')

  // Donor Modal State
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false)
  const [donorName, setDonorName] = useState(profile?.full_name || '')
  const [donorBloodGroup, setDonorBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('B+')
  const [donorDept, setDonorDept] = useState(profile?.department_id?.replace('dept-', '').toUpperCase() || 'CSE')
  const [donorBatch, setDonorBatch] = useState(profile?.batch_id?.replace('batch-cse-', '').replace('batch-', '') || '54th')
  const [donorPhone, setDonorPhone] = useState(profile?.phone || '')
  const [donorLocation, setDonorLocation] = useState('Mirpur-2, Rupnagar (Campus Area)')
  const [donorLastDate, setDonorLastDate] = useState('Over 4 months ago')

  // Filtered blood requests
  const filteredRequests = requests.filter((r) => {
    const matchesGroup = selectedGroup === 'All' || r.bloodGroup === selectedGroup
    const matchesUrgency = urgencyFilter === 'all' || r.urgency === urgencyFilter
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hospitalLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGroup && matchesUrgency && matchesSearch
  })

  // Filtered donors
  const filteredDonors = donors.filter((d) => {
    const matchesGroup = selectedGroup === 'All' || d.bloodGroup === selectedGroup
    const matchesSearch =
      d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGroup && matchesSearch
  })

  // Submit Blood Request
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reqPatientName.trim() || !reqHospitalName.trim() || !reqContactNumber.trim()) {
      toast.error('Please fill in patient name, hospital, and contact number')
      return
    }

    addBloodRequest({
      patientName: reqPatientName.trim(),
      bloodGroup: reqBloodGroup,
      bagsNeeded: parseInt(reqBagsNeeded) || 1,
      hospitalName: reqHospitalName.trim(),
      hospitalLocation: reqHospitalLocation.trim(),
      urgency: reqUrgency,
      reason: reqReason.trim() || 'Medical emergency requiring urgent transfusion.',
      contactNumber: reqContactNumber.trim(),
      requesterName: profile?.full_name || 'BUBT Student',
      requesterRole: profile ? `${profile.role} (${profile.department_id ? profile.department_id.replace('dept-', '').toUpperCase() : 'CSE'})` : 'Student',
      requesterBatch: profile?.batch_id ? profile.batch_id.replace('batch-cse-', '').replace('batch-', '') : '54th',
      dateNeeded: reqDateNeeded,
    })

    toast.success('Urgent blood request posted to the campus network!')
    setIsRequestModalOpen(false)
    setReqPatientName('')
    setReqHospitalName('')
    setReqReason('')
  }

  // Submit Donor Registration
  const handleRegisterDonor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!donorName.trim() || !donorPhone.trim()) {
      toast.error('Please provide your name and phone number')
      return
    }

    registerDonor({
      fullName: donorName.trim(),
      bloodGroup: donorBloodGroup,
      department: donorDept.trim(),
      batch: donorBatch.trim(),
      phone: donorPhone.trim(),
      location: donorLocation.trim(),
      lastDonationDate: donorLastDate.trim(),
      isAvailable: true,
    })

    toast.success('Registered successfully as a voluntary BUBT blood donor! Thank you!')
    setIsDonorModalOpen(false)
  }

  const handleShare = (req: BloodRequest) => {
    const text = `🚨 URGENT BLOOD NEEDED (${req.bloodGroup})\nPatient: ${req.patientName}\nHospital: ${req.hospitalName} (${req.hospitalLocation})\nBags: ${req.bagsNeeded} | Date: ${req.dateNeeded}\nContact: ${req.contactNumber}\nVerified on BUBT Connect Blood Wing.`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      toast.success('Blood request copied to clipboard! Share on WhatsApp, Messenger or Facebook.')
    }
  }

  const criticalCount = requests.filter((r) => r.urgency === 'critical').length

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 md:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider">
              <Heart className="h-3.5 w-3.5 fill-white" />
              BUBT Voluntary Blood Donation Wing
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Donate Blood, Save a Life
            </h1>
            <p className="text-white/90 text-xs md:text-sm leading-relaxed">
              Connect BUBT students, faculty, and alumni with critical blood recipients across Mirpur and Dhaka hospitals. Every single drop counts.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-red-600 hover:bg-white/90 shadow-md font-bold gap-2 text-xs md:text-sm h-11"
              onClick={() => setIsRequestModalOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Post Blood Request
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 font-bold gap-2 text-xs md:text-sm h-11 bg-transparent"
              onClick={() => setIsDonorModalOpen(true)}
            >
              <UserCheck className="h-4 w-4" />
              Join as Donor
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/20 text-white">
          <div>
            <span className="text-[11px] text-white/80 block">Active Requests</span>
            <span className="text-2xl font-black">{requests.length}</span>
            {criticalCount > 0 && (
              <span className="text-[10px] text-amber-200 block font-semibold animate-pulse">
                • {criticalCount} Critical Emergency
              </span>
            )}
          </div>
          <div>
            <span className="text-[11px] text-white/80 block">Registered Donors</span>
            <span className="text-2xl font-black">{donors.length}+</span>
            <span className="text-[10px] text-emerald-200 block font-semibold">BUBT Students & Staff</span>
          </div>
          <div>
            <span className="text-[11px] text-white/80 block">Community Pledges</span>
            <span className="text-2xl font-black">
              {requests.reduce((acc, curr) => acc + curr.pledgesCount, 0)}
            </span>
            <span className="text-[10px] text-white/80 block">Donors ready to go</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'requests' ? 'default' : 'ghost'}
              size="sm"
              className={cn("text-xs font-semibold gap-1.5", activeTab === 'requests' && "bg-red-600 hover:bg-red-700")}
              onClick={() => setActiveTab('requests')}
            >
              <Droplet className="h-3.5 w-3.5" />
              <span>Urgent Requests ({requests.length})</span>
            </Button>
            <Button
              variant={activeTab === 'donors' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs font-semibold gap-1.5"
              onClick={() => setActiveTab('donors')}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Voluntary Donors ({donors.length})</span>
            </Button>
            <Button
              variant={activeTab === 'guide' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs font-semibold gap-1.5"
              onClick={() => setActiveTab('guide')}
            >
              <Info className="h-3.5 w-3.5" />
              <span>Compatibility & FAQ</span>
            </Button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospital, patient, area..."
              className="pl-8 text-xs h-9"
            />
          </div>
        </div>

        {/* Blood Group Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-muted-foreground mr-1 shrink-0">Blood Group:</span>
          {BLOOD_GROUPS.map((bg) => {
            const isSelected = selectedGroup === bg
            return (
              <button
                key={bg}
                type="button"
                onClick={() => setSelectedGroup(bg)}
                className={cn(
                  "px-3 py-1.5 rounded-full font-bold transition-all shrink-0",
                  isSelected
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-muted hover:bg-muted/80 text-foreground border border-border/60"
                )}
              >
                {bg}
              </button>
            )
          })}
        </div>
      </div>

      {/* TAB 1: URGENT BLOOD REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <Droplet className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <h3 className="font-bold text-sm text-foreground">No blood requests match your filter</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No active requests found for blood group {selectedGroup}. If you know someone in need, post a request right away.
              </p>
              <Button
                size="sm"
                className="mt-4 bg-red-600 hover:bg-red-700 text-xs gap-1.5"
                onClick={() => setIsRequestModalOpen(true)}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Post Request Now
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests.map((req) => {
                const isPledged = pledgedRequestIds.has(req.id)
                const isCritical = req.urgency === 'critical'

                return (
                  <Card
                    key={req.id}
                    className={cn(
                      "relative overflow-hidden border transition-all hover:shadow-md",
                      isCritical ? "border-red-500/40 bg-gradient-to-br from-red-500/[0.04] to-background" : "bg-card"
                    )}
                  >
                    {/* Top Urgency Header */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Large Blood Group Badge */}
                          <div className={cn(
                            "h-14 w-14 rounded-2xl flex flex-col items-center justify-center font-black text-xl shrink-0 shadow-md",
                            isCritical ? "bg-red-600 text-white animate-pulse" : "bg-red-500/10 text-red-600 border border-red-500/20"
                          )}>
                            <span>{req.bloodGroup}</span>
                            <span className="text-[9px] font-normal uppercase leading-none opacity-90">
                              {req.bagsNeeded} {req.bagsNeeded > 1 ? 'Bags' : 'Bag'}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-base text-foreground leading-tight">
                                {req.patientName}
                              </h3>
                              <Badge
                                variant={isCritical ? "destructive" : "secondary"}
                                className={cn("text-[10px] font-semibold", isCritical && "animate-pulse")}
                              >
                                {isCritical ? "🚨 Critical Emergency" : "Within 24 Hours"}
                              </Badge>
                            </div>

                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-primary shrink-0" />
                              <strong className="text-foreground">{req.hospitalName}</strong> — {req.hospitalLocation}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Medical Reason */}
                      <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/50">
                        <strong className="text-foreground">Condition:</strong> {req.reason}
                      </p>

                      {/* Requester Info & Time Needed */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/60">
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Needed By:</span>
                          <span className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {req.dateNeeded}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Requested By:</span>
                          <span className="font-medium text-foreground truncate block">
                            {req.requesterName} ({req.requesterBatch || 'BUBT'})
                          </span>
                        </div>
                      </div>

                      {/* Actions: Call, Pledge, Share */}
                      <div className="flex items-center justify-between gap-2 pt-2">
                        {/* Call Button */}
                        <a
                          href={`tel:${req.contactNumber}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>Call: {req.contactNumber}</span>
                        </a>

                        {/* Pledge Donation */}
                        <Button
                          type="button"
                          variant={isPledged ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "h-9 text-xs gap-1.5 font-bold transition-all",
                            isPledged
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "border-red-500/30 text-red-600 hover:bg-red-500/10"
                          )}
                          onClick={() => {
                            pledgeDonation(req.id)
                            if (!isPledged) {
                              toast.success('Thank you! You pledged to donate. Please reach out to the contact number.')
                            } else {
                              toast.info('Pledge cancelled.')
                            }
                          }}
                        >
                          <Heart className={cn("h-3.5 w-3.5", isPledged && "fill-white")} />
                          <span>{isPledged ? 'Pledged' : 'I Can Donate'}</span>
                          <Badge variant="secondary" className="ml-0.5 text-[10px] px-1 py-0 h-4">
                            {req.pledgesCount}
                          </Badge>
                        </Button>

                        {/* Share */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-foreground"
                          onClick={() => handleShare(req)}
                          title="Share request"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VOLUNTARY DONORS DIRECTORY */}
      {activeTab === 'donors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-muted/40 p-4 rounded-xl border">
            <div>
              <h3 className="font-bold text-sm text-foreground">BUBT Student & Staff Donor Directory</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Reach out to registered campus donors who are ready to respond to urgent blood calls.
              </p>
            </div>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-xs gap-1.5 shrink-0"
              onClick={() => setIsDonorModalOpen(true)}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Register as Donor
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {filteredDonors.map((donor) => (
              <Card key={donor.id} className="p-4 border bg-card hover:shadow-xs transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{donor.fullName}</h4>
                      {donor.isAvailable && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500" title="Ready to donate" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Dept. of {donor.department} • {donor.batch} Intake
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      {donor.location}
                    </p>
                  </div>

                  <div className="h-11 w-11 rounded-xl bg-red-500/10 text-red-600 border border-red-500/20 flex items-center justify-center font-black text-sm shrink-0">
                    {donorBloodGroup === donor.bloodGroup ? donor.bloodGroup : donor.bloodGroup}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs">
                  <span className="text-[10px] text-muted-foreground">
                    Last donated: <strong className="text-foreground">{donor.lastDonationDate || 'First time'}</strong>
                  </span>
                  <a
                    href={`tel:${donor.phone}`}
                    className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 text-xs"
                  >
                    <Phone className="h-3 w-3" />
                    Call Donor
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BLOOD COMPATIBILITY & FAQ */}
      {activeTab === 'guide' && (
        <div className="space-y-4">
          <Card className="p-6 border bg-card space-y-4">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-600" />
              Blood Transfusion Compatibility Matrix
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="p-2.5 font-bold">Recipient Blood Type</th>
                    <th className="p-2.5 font-bold">Can Receive Red Blood Cells From</th>
                    <th className="p-2.5 font-bold">Special Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-muted-foreground">
                  <tr>
                    <td className="p-2.5 font-bold text-red-600">O- (Negative)</td>
                    <td className="p-2.5">O- only</td>
                    <td className="p-2.5">Universal Red Cell Donor (can donate to anyone)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-red-600">O+ (Positive)</td>
                    <td className="p-2.5">O+, O-</td>
                    <td className="p-2.5">Most common blood type in Bangladesh (~31%)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-red-600">A+ (Positive)</td>
                    <td className="p-2.5">A+, A-, O+, O-</td>
                    <td className="p-2.5">Second most common blood type (~26%)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-red-600">B+ (Positive)</td>
                    <td className="p-2.5">B+, B-, O+, O-</td>
                    <td className="p-2.5">Very common in South Asia (~33%)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-red-600">AB+ (Positive)</td>
                    <td className="p-2.5">All Types (A, B, AB, O both + and -)</td>
                    <td className="p-2.5">Universal Recipient (can receive from anyone)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t space-y-2">
              <h4 className="font-bold text-sm text-foreground">Donor Eligibility Checklist:</h4>
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                <li>Age must be between 18 and 60 years.</li>
                <li>Weight must be at least 48 kg (for males) and 45 kg (for females).</li>
                <li>Hemoglobin level must be at least 12.5 g/dL.</li>
                <li>Minimum interval between donations is 4 months (120 days).</li>
                <li>Must be free from active infectious diseases (Hepatitis B/C, Malaria, HIV).</li>
              </ul>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 1: POST URGENT BLOOD REQUEST */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-red-600">
              <Droplet className="h-5 w-5 fill-red-600" />
              Post Urgent Blood Request
            </DialogTitle>
            <DialogDescription className="text-xs">
              Broadcast an immediate blood need to the entire BUBT community and registered student donors.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRequest} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Patient Name & Relationship *</Label>
              <Input
                value={reqPatientName}
                onChange={(e) => setReqPatientName(e.target.value)}
                placeholder="e.g. Mrs. Salma (Mother of CSE Student)"
                required
                className="text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Required Blood Group *</Label>
                <Select
                  value={reqBloodGroup}
                  onValueChange={(val: any) => setReqBloodGroup(val)}
                >
                  <SelectTrigger className="text-xs h-9 font-bold text-red-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.filter((g) => g !== 'All').map((bg) => (
                      <SelectItem key={bg} value={bg} className="font-bold">
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Bags Needed *</Label>
                <Select value={reqBagsNeeded} onValueChange={(val: any) => setReqBagsNeeded(val || '1')}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bag</SelectItem>
                    <SelectItem value="2">2 Bags</SelectItem>
                    <SelectItem value="3">3 Bags</SelectItem>
                    <SelectItem value="4">4 Bags</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Hospital Name *</Label>
                <Input
                  value={reqHospitalName}
                  onChange={(e) => setReqHospitalName(e.target.value)}
                  placeholder="e.g. Delta Medical College Hospital"
                  required
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Hospital Location *</Label>
                <Input
                  value={reqHospitalLocation}
                  onChange={(e) => setReqHospitalLocation(e.target.value)}
                  placeholder="e.g. Mirpur-1 / Mirpur-2 / DMCH"
                  required
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Urgency Level *</Label>
                <Select
                  value={reqUrgency}
                  onValueChange={(val: any) => setReqUrgency(val)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">🚨 Critical / Immediate</SelectItem>
                    <SelectItem value="within_24h">⏰ Within 24 Hours</SelectItem>
                    <SelectItem value="routine">📅 Scheduled / Routine</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Date & Time Needed *</Label>
                <Input
                  value={reqDateNeeded}
                  onChange={(e) => setReqDateNeeded(e.target.value)}
                  placeholder="e.g. Immediate / Today 4:00 PM"
                  required
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Emergency Contact Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={reqContactNumber}
                  onChange={(e) => setReqContactNumber(e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                  required
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Medical Reason / Notes</Label>
              <Textarea
                value={reqReason}
                onChange={(e) => setReqReason(e.target.value)}
                placeholder="e.g. Emergency cesarean surgery, hemoglobin dropped below 7.5..."
                className="text-xs h-18 resize-none"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsRequestModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-bold gap-1.5"
              >
                <Droplet className="h-4 w-4 fill-white" />
                Broadcast Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: REGISTER AS VOLUNTARY DONOR */}
      <Dialog open={isDonorModalOpen} onOpenChange={setIsDonorModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-emerald-600" />
              Join BUBT Voluntary Donors
            </DialogTitle>
            <DialogDescription className="text-xs">
              Make yourself discoverable to fellow BUBTians during critical medical emergencies.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegisterDonor} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                required
                className="text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Your Blood Group *</Label>
                <Select
                  value={donorBloodGroup}
                  onValueChange={(val: any) => setDonorBloodGroup(val)}
                >
                  <SelectTrigger className="text-xs h-9 font-bold text-red-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.filter((g) => g !== 'All').map((bg) => (
                      <SelectItem key={bg} value={bg} className="font-bold">
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department *</Label>
                <Input
                  value={donorDept}
                  onChange={(e) => setDonorDept(e.target.value)}
                  placeholder="e.g. CSE / EEE / BBA"
                  required
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Intake / Batch</Label>
                <Input
                  value={donorBatch}
                  onChange={(e) => setDonorBatch(e.target.value)}
                  placeholder="e.g. 54th"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Phone Number *</Label>
                <Input
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                  required
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Campus / Living Area</Label>
              <Input
                value={donorLocation}
                onChange={(e) => setDonorLocation(e.target.value)}
                placeholder="e.g. Mirpur-2 / Rupnagar / Pallabi"
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Last Donated Date</Label>
              <Input
                value={donorLastDate}
                onChange={(e) => setDonorLastDate(e.target.value)}
                placeholder="e.g. 3 months ago / Never donated"
                className="text-xs h-9"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsDonorModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                Register as Donor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
