'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  User,
  GraduationCap,
  Building,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Award,
  BookOpen,
  Sparkles,
  Phone,
  Mail,
  Heart,
  Camera,
  Edit3,
  Upload,
  Check,
  X,
  Droplet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Profile } from '@/lib/types'
import { DEMO_USERS } from '@/lib/demo-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { getInitials } from '@/lib/utils'

interface ProfileClientProps {
  currentRole: string
  profile: Profile
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

export function ProfileClient({ currentRole, profile: initialProfile }: ProfileClientProps) {
  const { profile: authProfile } = useAuth()
  const baseProfile = (authProfile && authProfile.role === currentRole ? authProfile : null) || initialProfile

  const [activeTab, setActiveTab] = useState<'id_card' | 'academic' | 'activity'>('id_card')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Local editable states
  const [avatarUrl, setAvatarUrl] = useState<string>(baseProfile.avatar_url || '')
  const [bloodGroup, setBloodGroup] = useState<string>((baseProfile as any).blood_group || 'B+')
  const [phone, setPhone] = useState<string>(baseProfile.phone || '+8801712000000')

  // Modal draft states
  const [draftAvatarUrl, setDraftAvatarUrl] = useState<string>(avatarUrl)
  const [draftBloodGroup, setDraftBloodGroup] = useState<string>(bloodGroup)
  const [draftPhone, setDraftPhone] = useState<string>(phone)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync from localStorage if present
  useEffect(() => {
    try {
      const savedAvatar = localStorage.getItem('bubt_student_avatar')
      if (savedAvatar) setAvatarUrl(savedAvatar)
      const savedBlood = localStorage.getItem('bubt_student_blood_group')
      if (savedBlood) setBloodGroup(savedBlood)
      const savedPhone = localStorage.getItem('bubt_student_phone')
      if (savedPhone) setPhone(savedPhone)
    } catch {}
  }, [])

  // Open modal and pre-fill draft
  const handleOpenEdit = () => {
    setDraftAvatarUrl(avatarUrl)
    setDraftBloodGroup(bloodGroup)
    setDraftPhone(phone)
    setIsEditModalOpen(true)
  }

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, or WEBP)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setDraftAvatarUrl(result)
      toast.success('Photo uploaded! Preview updated.')
    }
    reader.readAsDataURL(file)
  }

  // Save changes
  const handleSaveChanges = () => {
    setAvatarUrl(draftAvatarUrl)
    setBloodGroup(draftBloodGroup)
    setPhone(draftPhone)

    try {
      // Save in localStorage
      if (draftAvatarUrl) {
        localStorage.setItem('bubt_student_avatar', draftAvatarUrl)
      } else {
        localStorage.removeItem('bubt_student_avatar')
      }
      localStorage.setItem('bubt_student_blood_group', draftBloodGroup)
      localStorage.setItem('bubt_student_phone', draftPhone)

      // Also update stored registered profile object
      const stored = localStorage.getItem('bubt_registered_profile')
      if (stored) {
        const parsed = JSON.parse(stored)
        parsed.avatar_url = draftAvatarUrl
        parsed.blood_group = draftBloodGroup
        parsed.phone = draftPhone
        localStorage.setItem('bubt_registered_profile', JSON.stringify(parsed))
      }

      // Set cookies for SSR sync (limit cookie size: if dataURL is very large, cookie handles blood_group directly)
      document.cookie = `bubt_student_blood_group=${encodeURIComponent(draftBloodGroup)}; path=/; max-age=31536000`
      document.cookie = `bubt_student_phone=${encodeURIComponent(draftPhone)}; path=/; max-age=31536000`
      
      // If draftAvatarUrl is a reasonable URL (not a giant 5MB base64), cookie it
      if (draftAvatarUrl && draftAvatarUrl.length < 3000) {
        document.cookie = `bubt_student_avatar=${encodeURIComponent(draftAvatarUrl)}; path=/; max-age=31536000`
      }
    } catch (err) {
      console.error(err)
    }

    setIsEditModalOpen(false)
    toast.success('Profile Picture & Blood Group updated successfully!')
  }

  const roleMeta: Record<string, { title: string; badge: string; color: string }> = {
    student: { title: 'Undergraduate Student', badge: 'Regular Student', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    faculty: { title: 'Faculty Member', badge: 'Academic Faculty', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    authority: { title: 'University Administration', badge: 'Proctorial Authority', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    alumni: { title: 'Graduated Alumni', badge: 'Verified Alumnus', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    super_admin: { title: 'System Administrator', badge: 'Super Admin', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  }

  const currentMeta = roleMeta[currentRole] || roleMeta.student

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-teal-500/5 to-blue-500/10 border border-primary/20 p-5 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* DP Avatar with Click-to-Edit */}
            <div 
              onClick={handleOpenEdit}
              className="relative group cursor-pointer h-16 w-16 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-primary/30"
              title="Click to edit Profile Picture (DP)"
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={baseProfile.full_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-primary text-primary-foreground font-bold text-2xl flex items-center justify-center">
                  {getInitials(baseProfile.full_name)}
                </div>
              )}
              {/* Hover Camera Overlay */}
              <div className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5" />
                <span className="text-[9px] font-medium mt-0.5">Edit DP</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  {baseProfile.full_name}
                </h1>
                <Badge variant="outline" className={cn("text-xs font-semibold capitalize", currentMeta.color)}>
                  {currentRole.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                {baseProfile.department_id ? `Department of ${baseProfile.department_id.replace('dept-', '').toUpperCase()}` : 'Campus Member'} • {baseProfile.batch_id ? `${baseProfile.batch_id.replace('batch-cse-', '').replace('batch-', '')}th Intake` : 'BUBT Permanent Campus'}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-medium text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                  <Heart className="h-3 w-3 fill-red-500" />
                  Blood: {bloodGroup}
                </span>
                {baseProfile.student_id && (
                  <span className="font-mono bg-muted/60 px-2 py-0.5 rounded-full border border-border">
                    ID: {baseProfile.student_id}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Edit Profile & Pass Button (Print option removed as requested) */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-xs bg-background/80 hover:bg-background border-primary/30 text-foreground shadow-xs font-medium"
              onClick={handleOpenEdit}
            >
              <Edit3 className="h-3.5 w-3.5 text-primary" />
              <span>Edit DP & Blood Group</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b pb-2">
        <Button
          type="button"
          variant={activeTab === 'id_card' ? 'default' : 'ghost'}
          size="sm"
          className="text-xs font-semibold gap-1.5"
          onClick={() => setActiveTab('id_card')}
        >
          <CreditCard className="h-3.5 w-3.5" />
          <span>Digital Campus ID Card</span>
        </Button>
        <Button
          type="button"
          variant={activeTab === 'academic' ? 'default' : 'ghost'}
          size="sm"
          className="text-xs font-semibold gap-1.5"
          onClick={() => setActiveTab('academic')}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Academic Transcript</span>
        </Button>
      </div>

      {/* TAB 1: Digital Smart Campus ID Card */}
      {activeTab === 'id_card' && (
        <div className="space-y-6">
          <div className="flex justify-center p-2 sm:p-6">
            {/* Authentic BUBT Student ID Card Layout */}
            <div className="w-full max-w-md rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-card via-card to-primary/[0.04] p-6 shadow-xl relative overflow-hidden space-y-5">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/bubt-logo.png"
                    alt="BUBT Crest"
                    width={44}
                    height={44}
                    className="object-contain"
                  />
                  <div>
                    <h3 className="font-black text-sm text-primary uppercase tracking-tight leading-none">
                      Bangladesh University of Business and Technology
                    </h3>
                    <p className="text-[10px] italic text-muted-foreground font-serif mt-0.5">
                      জ্ঞানই শক্তি — Knowledge is Power
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Body: Photo, Info */}
              <div className="flex gap-4 items-center">
                {/* Official Student Photo Frame with Direct Click-to-Edit */}
                <div 
                  onClick={handleOpenEdit}
                  className="h-28 w-24 rounded-xl border-2 border-primary/30 flex flex-col items-center justify-center shrink-0 shadow-inner relative overflow-hidden bg-muted group cursor-pointer"
                  title="Click to change Student Photo"
                >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={baseProfile.full_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-center">
                      <Camera className="h-8 w-8 text-primary/70 group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-[9px] font-bold text-primary uppercase">Add Photo</span>
                    </div>
                  )}
                  {/* Photo Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-center p-1">
                    <Camera className="h-4 w-4 mb-0.5" />
                    <span className="text-[9px] font-semibold">Change DP</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs flex-1">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Full Name</span>
                    <p className="font-bold text-base text-foreground leading-tight">{baseProfile.full_name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Student / ID No.</span>
                    <p className="font-mono font-bold text-sm text-primary tracking-wider">{baseProfile.student_id || '21224103001'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Program</span>
                      <p className="font-semibold text-foreground">{baseProfile.department_id ? `B.Sc. ${baseProfile.department_id.replace('dept-', '').toUpperCase()}` : 'B.Sc. CSE'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Intake</span>
                      <p className="font-semibold text-foreground">{baseProfile.batch_id ? `${baseProfile.batch_id.replace('batch-cse-', '').replace('batch-', '')}th` : '54th'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Blood Group, Barcode / QR & Turnstile Pass */}
              <div className="pt-3 border-t flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-500 fill-red-500" /> Blood Group
                  </span>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-base text-red-600 dark:text-red-400 leading-none">{bloodGroup}</p>
                    <button
                      type="button"
                      onClick={handleOpenEdit}
                      className="text-[10px] text-primary hover:underline font-medium"
                    >
                      (Edit)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-muted/70 border border-border">
                    <QrCode className="h-8 w-8 text-foreground" />
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-tight text-right">
                    <p className="font-semibold text-foreground">Turnstile Pass</p>
                    <p>Valid Fall 2026</p>
                  </div>
                </div>
              </div>

              {/* Holographic Watermark Band */}
              <div className="bg-gradient-to-r from-primary/20 via-teal-500/20 to-primary/20 -mx-6 -mb-6 p-2 text-center text-[10px] font-mono text-primary font-bold uppercase tracking-widest border-t border-primary/20">
                Official BUBT Smart Digital Campus Pass
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Academic Transcript Summary */}
      {activeTab === 'academic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 border bg-card text-center space-y-1">
              <span className="text-xs text-muted-foreground">Cumulative GPA</span>
              <p className="text-3xl font-black text-primary">3.82</p>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                Top 5% of Intake
              </Badge>
            </Card>

            <Card className="p-4 border bg-card text-center space-y-1">
              <span className="text-xs text-muted-foreground">Completed Credits</span>
              <p className="text-3xl font-black text-foreground">84 / 148</p>
              <span className="text-[11px] text-muted-foreground">57% Degree Progress</span>
            </Card>

            <Card className="p-4 border bg-card text-center space-y-1">
              <span className="text-xs text-muted-foreground">Current Semester</span>
              <p className="text-3xl font-black text-foreground">Fall 2026</p>
              <span className="text-[11px] text-muted-foreground">Level 3, Term 1</span>
            </Card>
          </div>

          <Card className="border bg-card">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-bold text-sm text-foreground">Fall 2026 Registered Courses</h3>
              <div className="space-y-2 text-xs">
                {[
                  { code: 'CSE 311', name: 'Database Management Systems', credits: 3.0, status: 'Enrolled' },
                  { code: 'CSE 312', name: 'Database Systems Lab', credits: 1.5, status: 'Enrolled' },
                  { code: 'CSE 323', name: 'Operating Systems & System Programming', credits: 3.0, status: 'Enrolled' },
                  { code: 'CSE 324', name: 'Operating Systems Lab', credits: 1.5, status: 'Enrolled' },
                  { code: 'CSE 315', name: 'Software Engineering & Methodologies', credits: 3.0, status: 'Enrolled' },
                  { code: 'MAT 205', name: 'Linear Algebra & Complex Variables', credits: 3.0, status: 'Enrolled' },
                ].map((course) => (
                  <div key={course.code} className="p-2.5 rounded-lg border bg-muted/30 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-primary mr-2">{course.code}</span>
                      <span className="font-medium text-foreground">{course.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span>{course.credits} Credits</span>
                      <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Profile Picture & Blood Group Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Edit3 className="h-5 w-5 text-primary" />
              Edit Profile Picture (DP) & Blood Group
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update your photo and verified blood group. These changes immediately update your Digital Campus Pass and campus directory.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* DP (Profile Picture) Section */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Official Profile Picture / DP
              </Label>
              
              <div className="flex items-center gap-4 p-3.5 rounded-xl border bg-muted/30">
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-primary/40 shrink-0 bg-background shadow-xs">
                  {draftAvatarUrl ? (
                    <Image
                      src={draftAvatarUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center">
                      {getInitials(baseProfile.full_name)}
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="default"
                      className="h-8 text-xs gap-1.5"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload New Photo
                    </Button>

                    {draftAvatarUrl && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => setDraftAvatarUrl('')}
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    JPG, PNG, or WEBP up to 5MB. Clear face portrait recommended for campus security turnstiles.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            {/* Blood Group Selector Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                  Select Blood Group
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  Current: <strong className="text-red-600 dark:text-red-400 font-bold">{draftBloodGroup}</strong>
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map((bg) => {
                  const isSelected = draftBloodGroup === bg
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setDraftBloodGroup(bg)}
                      className={cn(
                        "h-12 rounded-xl border flex flex-col items-center justify-center transition-all font-bold text-sm",
                        isSelected
                          ? "bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-400/50 scale-[1.02]"
                          : "bg-background hover:bg-muted/60 border-border text-foreground"
                      )}
                    >
                      <span className="flex items-center gap-1">
                        <Droplet className={cn("h-3.5 w-3.5", isSelected ? "fill-white" : "text-red-500")} />
                        {bg}
                      </span>
                      <span className={cn("text-[9px] font-normal", isSelected ? "text-white/90" : "text-muted-foreground")}>
                        {bg === 'O-' ? 'Universal Donor' : bg === 'AB+' ? 'Universal Recipient' : 'Rhesus Match'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Emergency Contact Phone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={draftPhone}
                  onChange={(e) => setDraftPhone(e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                  className="pl-9 text-xs h-9"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Used for voluntary blood alerts and campus emergency verification.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="gap-1.5"
              onClick={handleSaveChanges}
            >
              <Check className="h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
