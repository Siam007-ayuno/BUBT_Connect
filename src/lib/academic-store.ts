'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  AcademicResource,
  AlumniProfile,
  JobPosting,
  INITIAL_RESOURCES,
  INITIAL_ALUMNI,
  INITIAL_JOBS,
} from './academic-data'

const STORAGE_KEY_RESOURCES = 'bubt_academic_resources_v1'
const STORAGE_KEY_UPVOTED_RES = 'bubt_upvoted_resources_v1'
const STORAGE_KEY_JOBS = 'bubt_job_postings_v1'
const STORAGE_KEY_APPLIED_JOBS = 'bubt_applied_jobs_v1'
const STORAGE_KEY_BOOKED_MENTORS = 'bubt_booked_mentors_v1'

export function useAcademicStore() {
  const [resources, setResources] = useState<AcademicResource[]>(INITIAL_RESOURCES)
  const [upvotedResourceIds, setUpvotedResourceIds] = useState<Set<string>>(new Set())
  const [alumni] = useState<AlumniProfile[]>(INITIAL_ALUMNI)
  const [jobs, setJobs] = useState<JobPosting[]>(INITIAL_JOBS)
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set())
  const [bookedMentorIds, setBookedMentorIds] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage
  useEffect(() => {
    try {
      const savedRes = localStorage.getItem(STORAGE_KEY_RESOURCES)
      if (savedRes) {
        const parsed = JSON.parse(savedRes)
        if (Array.isArray(parsed) && parsed.length > 0) setResources(parsed)
      }

      const savedUpvotes = localStorage.getItem(STORAGE_KEY_UPVOTED_RES)
      if (savedUpvotes) {
        const parsed = JSON.parse(savedUpvotes)
        if (Array.isArray(parsed)) setUpvotedResourceIds(new Set(parsed))
      }

      const savedJobs = localStorage.getItem(STORAGE_KEY_JOBS)
      if (savedJobs) {
        const parsed = JSON.parse(savedJobs)
        if (Array.isArray(parsed) && parsed.length > 0) setJobs(parsed)
      }

      const savedApplied = localStorage.getItem(STORAGE_KEY_APPLIED_JOBS)
      if (savedApplied) {
        const parsed = JSON.parse(savedApplied)
        if (Array.isArray(parsed)) setAppliedJobIds(new Set(parsed))
      }

      const savedMentors = localStorage.getItem(STORAGE_KEY_BOOKED_MENTORS)
      if (savedMentors) {
        const parsed = JSON.parse(savedMentors)
        if (Array.isArray(parsed)) setBookedMentorIds(new Set(parsed))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save resources
  const saveResources = useCallback((newRes: AcademicResource[]) => {
    setResources(newRes)
    try {
      localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(newRes))
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Toggle upvote resource
  const toggleUpvoteResource = useCallback((id: string) => {
    setUpvotedResourceIds((prev) => {
      const next = new Set(prev)
      const isUpvoted = next.has(id)
      if (isUpvoted) {
        next.delete(id)
      } else {
        next.add(id)
      }

      setResources((prevRes) =>
        prevRes.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + (isUpvoted ? -1 : 1) } : r))
      )

      try {
        localStorage.setItem(STORAGE_KEY_UPVOTED_RES, JSON.stringify(Array.from(next)))
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }, [])

  // Download resource
  const downloadResource = useCallback((resource: AcademicResource) => {
    const updated = resources.map((r) =>
      r.id === resource.id ? { ...r, downloadCount: r.downloadCount + 1 } : r
    )
    saveResources(updated)

    if (resource.downloadUrl && resource.downloadUrl !== '#') {
      const a = document.createElement('a')
      a.href = resource.downloadUrl
      a.download = `${resource.courseCode}_${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}.${resource.fileFormat.toLowerCase()}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      return
    }

    // Trigger university archive file download
    const dummyContent = `BANGLADESH UNIVERSITY OF BUSINESS & TECHNOLOGY (BUBT)\nACADEMIC RESOURCE ARCHIVE\n==========================================\nTitle: ${resource.title}\nCourse: ${resource.courseCode} - ${resource.courseTitle}\nDepartment: ${resource.department}\nUploaded By: ${resource.authorName} (${resource.authorRole})\nFormat: ${resource.fileFormat}\nSize: ${resource.fileSize}\n==========================================\nOfficial Academic Content verified by BUBT Connect Repository.`
    const blob = new Blob([dummyContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resource.courseCode}_${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}.${resource.fileFormat.toLowerCase()}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [resources, saveResources])

  // Upload new resource
  const uploadResource = useCallback((resInput: Omit<AcademicResource, 'id' | 'downloadCount' | 'upvotes' | 'uploadDate'>) => {
    const newRes: AcademicResource = {
      ...resInput,
      id: `res-${Date.now()}`,
      downloadCount: 0,
      upvotes: 1,
      uploadDate: new Date().toISOString().split('T')[0],
    }
    saveResources([newRes, ...resources])
    return newRes
  }, [resources, saveResources])

  // Post new job
  const postJob = useCallback((jobInput: Omit<JobPosting, 'id'>) => {
    const newJob: JobPosting = {
      ...jobInput,
      id: `job-${Date.now()}`,
    }
    const updated = [newJob, ...jobs]
    setJobs(updated)
    try {
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
    return newJob
  }, [jobs])

  // Apply / Request Referral
  const requestReferral = useCallback((jobId: string) => {
    setAppliedJobIds((prev) => {
      const next = new Set(prev).add(jobId)
      try {
        localStorage.setItem(STORAGE_KEY_APPLIED_JOBS, JSON.stringify(Array.from(next)))
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }, [])

  // Book mentorship
  const bookMentorship = useCallback((alumniId: string) => {
    setBookedMentorIds((prev) => {
      const next = new Set(prev).add(alumniId)
      try {
        localStorage.setItem(STORAGE_KEY_BOOKED_MENTORS, JSON.stringify(Array.from(next)))
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }, [])

  return {
    resources,
    upvotedResourceIds,
    alumni,
    jobs,
    appliedJobIds,
    bookedMentorIds,
    isLoaded,
    toggleUpvoteResource,
    downloadResource,
    uploadResource,
    postJob,
    requestReferral,
    bookMentorship,
  }
}
