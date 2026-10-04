'use client'

import { useState, useMemo } from 'react'
import {
  GraduationCap,
  Briefcase,
  Search,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  MessageSquare,
  Users,
  Clock,
  Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useAcademicStore } from '@/lib/academic-store'
import { AlumniProfile, JobPosting } from '@/lib/academic-data'
import { MentorshipModal } from '@/components/academic/mentorship-modal'
import { ReferralModal } from '@/components/academic/referral-modal'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AlumniClientProps {
  userRole?: string
  userName?: string
}

export function AlumniClient({ userRole = 'student', userName = 'Student' }: AlumniClientProps) {
  const { alumni, jobs, appliedJobIds, bookedMentorIds, requestReferral, bookMentorship } = useAcademicStore()
  const [activeTab, setActiveTab] = useState<'directory' | 'jobs'>('directory')
  const [searchQuery, setSearchQuery] = useState('')
  const [mentorshipOnly, setMentorshipOnly] = useState(false)
  const [selectedAlumnus, setSelectedAlumnus] = useState<AlumniProfile | null>(null)
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)

  // Filter alumni
  const filteredAlumni = useMemo(() => {
    return alumni.filter((alm) => {
      const matchMentorship = !mentorshipOnly || alm.isAvailableForMentorship
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        alm.fullName.toLowerCase().includes(q) ||
        alm.currentCompany.toLowerCase().includes(q) ||
        alm.currentRole.toLowerCase().includes(q) ||
        alm.department.toLowerCase().includes(q) ||
        alm.intake.toLowerCase().includes(q) ||
        alm.mentorshipTopics.some((t) => t.toLowerCase().includes(q))

      return matchMentorship && matchSearch
    })
  }, [alumni, mentorshipOnly, searchQuery])

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.companyLocation.toLowerCase().includes(q) ||
        job.postedByAlumniName.toLowerCase().includes(q) ||
        job.departmentTarget.some((d) => d.toLowerCase().includes(q))

      return matchSearch
    })
  }, [jobs, searchQuery])

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 p-5 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <GraduationCap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  BUBT Alumni Network & Career Corner
                </h1>
                <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  Global Alumni
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Connect with BUBT graduates across Google, bKash, Brain Station 23, and unlock direct job referrals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1.5 text-xs font-semibold gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-primary" />
              <span>{jobs.length} Active Alumni Openings</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* View Switcher: Directory vs Jobs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-muted/40 p-1.5 rounded-xl border border-border">
        <div className="grid grid-cols-2 gap-1 w-full sm:w-auto">
          <Button
            type="button"
            variant={activeTab === 'directory' ? 'default' : 'ghost'}
            className={cn(
              "h-10 text-xs sm:text-sm font-medium rounded-lg gap-2",
              activeTab === 'directory' && "shadow-sm"
            )}
            onClick={() => setActiveTab('directory')}
          >
            <GraduationCap className="h-4 w-4" />
            Alumni Directory ({alumni.length})
          </Button>

          <Button
            type="button"
            variant={activeTab === 'jobs' ? 'default' : 'ghost'}
            className={cn(
              "h-10 text-xs sm:text-sm font-medium rounded-lg gap-2",
              activeTab === 'jobs' && "shadow-sm"
            )}
            onClick={() => setActiveTab('jobs')}
          >
            <Briefcase className="h-4 w-4" />
            Jobs & Internships ({jobs.length})
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={activeTab === 'directory' ? "Search alumni, company, or topic..." : "Search jobs, roles, or company..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8.5 h-9 text-xs"
          />
        </div>
      </div>

      {/* TAB 1: Alumni Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Showing <strong className="text-foreground">{filteredAlumni.length}</strong> alumni profiles
            </span>

            <Button
              type="button"
              variant={mentorshipOnly ? 'default' : 'outline'}
              size="sm"
              className={cn("h-8 text-xs gap-1.5", mentorshipOnly && "bg-emerald-600 hover:bg-emerald-700")}
              onClick={() => setMentorshipOnly(!mentorshipOnly)}
            >
              <Sparkles className="h-3 w-3" />
              <span>Open for Mentorship Only</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAlumni.map((alm) => {
              const isBooked = bookedMentorIds.has(alm.id)

              return (
                <Card
                  key={alm.id}
                  className="border hover:border-emerald-500/40 transition-all bg-card flex flex-col justify-between shadow-xs"
                >
                  <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Header: Name, Intake, Company */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-lg flex items-center justify-center shrink-0 border border-emerald-500/20">
                            {alm.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-foreground leading-snug">
                              {alm.fullName}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {alm.department} • <span className="font-medium text-foreground">{alm.intake}</span> (Grad: {alm.graduatingYear})
                            </p>
                          </div>
                        </div>

                        {alm.isAvailableForMentorship && (
                          <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shrink-0">
                            Mentor
                          </Badge>
                        )}
                      </div>

                      {/* Current Company & Role */}
                      <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-foreground font-semibold">
                          <Building2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{alm.currentRole}</span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                          <span>{alm.currentCompany}</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {alm.location}
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {alm.bio}
                      </p>

                      {/* Mentorship topics */}
                      {alm.mentorshipTopics.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Can Mentor On:</span>
                          <div className="flex flex-wrap gap-1">
                            {alm.mentorshipTopics.map((topic) => (
                              <span
                                key={topic}
                                className="text-[10px] bg-primary/5 text-primary border border-primary/20 px-2 py-0.5 rounded-md"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t flex items-center justify-between gap-2 mt-2">
                      {alm.linkedinUrl ? (
                        <a
                          href={alm.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-medium transition-colors"
                        >
                          <span>LinkedIn Profile</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span />
                      )}

                      {alm.isAvailableForMentorship ? (
                        isBooked ? (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs px-2.5 py-1 gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Session Requested
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            className="h-8 text-xs font-semibold gap-1.5"
                            onClick={() => setSelectedAlumnus(alm)}
                          >
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Book Mentorship</span>
                          </Button>
                        )
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Mentorship unavailable</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Jobs & Internships */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{filteredJobs.length}</strong> active job & internship listings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => {
              const hasApplied = appliedJobIds.has(job.id)

              return (
                <Card
                  key={job.id}
                  className="border hover:border-primary/40 transition-all bg-card flex flex-col justify-between shadow-xs"
                >
                  <CardContent className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-mono">
                            {job.jobType}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {job.experienceLevel}
                          </Badge>
                        </div>

                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Deadline: {job.deadline}
                        </span>
                      </div>

                      {/* Title & Company */}
                      <div>
                        <h3 className="font-bold text-base text-foreground leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-xs text-primary font-medium mt-0.5">
                          {job.company} • <span className="text-muted-foreground">{job.companyLocation}</span>
                        </p>
                      </div>

                      {/* Salary */}
                      {job.salaryRange && (
                        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md inline-block">
                          Salary: {job.salaryRange}
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {job.description}
                      </p>

                      {/* Requirements */}
                      <div className="space-y-1 text-xs">
                        <span className="font-semibold text-muted-foreground text-[11px] uppercase">Requirements:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-[11px]">
                          {job.requirements.slice(0, 3).map((req, idx) => (
                            <li key={idx} className="line-clamp-1">{req}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Posted By Alumnus */}
                      <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs flex items-center justify-between">
                        <div>
                          <span className="text-muted-foreground text-[11px]">Posted by verified Alumnus:</span>
                          <p className="font-semibold text-foreground">{job.postedByAlumniName} ({job.postedByAlumniIntake})</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                          Direct Referral
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t flex items-center justify-between gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Target: {job.departmentTarget.join(', ')}
                      </span>

                      {hasApplied ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs px-2.5 py-1 gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Referral Requested
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          className="h-8 text-xs font-semibold gap-1.5"
                          onClick={() => setSelectedJob(job)}
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Request Referral</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Mentorship Booking Modal */}
      <MentorshipModal
        alumnus={selectedAlumnus}
        isOpen={!!selectedAlumnus}
        onClose={() => setSelectedAlumnus(null)}
        onBook={bookMentorship}
        studentName={userName}
      />

      {/* Referral Request Modal */}
      <ReferralModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onRequestReferral={requestReferral}
        studentName={userName}
      />
    </div>
  )
}
