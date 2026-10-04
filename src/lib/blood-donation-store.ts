'use client'

import { useState, useEffect, useCallback } from 'react'

export interface BloodRequest {
  id: string
  patientName: string
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  bagsNeeded: number
  hospitalName: string
  hospitalLocation: string // e.g. Mirpur-1, Mirpur-2, Dhaka Medical
  urgency: 'critical' | 'within_24h' | 'routine'
  reason: string
  contactNumber: string
  requesterName: string
  requesterRole: string
  requesterBatch?: string
  dateNeeded: string
  status: 'open' | 'fulfilled' | 'cancelled'
  pledgesCount: number
  createdAt: string
}

export interface BloodDonor {
  id: string
  fullName: string
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  department: string
  batch: string
  phone: string
  lastDonationDate?: string
  isAvailable: boolean
  location: string
}

export const INITIAL_BLOOD_REQUESTS: BloodRequest[] = [
  {
    id: 'req-01',
    patientName: 'Mrs. Rokeya Begum (Mother of CSE Student)',
    bloodGroup: 'B+',
    bagsNeeded: 2,
    hospitalName: 'Delta Medical College & Hospital',
    hospitalLocation: 'Mirpur-1, Dhaka',
    urgency: 'critical',
    reason: 'Emergency General Surgery. Hemoglobin level dropped below 7.0.',
    contactNumber: '+8801712345678',
    requesterName: 'Tanvir Ahmed',
    requesterRole: 'Student (CSE 50th Intake)',
    requesterBatch: '50th',
    dateNeeded: 'Immediate / Today',
    status: 'open',
    pledgesCount: 1,
    createdAt: '2026-10-04T12:00:00Z',
  },
  {
    id: 'req-02',
    patientName: 'Arafat Hossain (Thalassemia Child)',
    bloodGroup: 'O-',
    bagsNeeded: 1,
    hospitalName: 'National Heart Foundation Hospital',
    hospitalLocation: 'Mirpur-2, Dhaka (Near BUBT)',
    urgency: 'critical',
    reason: 'Monthly mandatory blood transfusion for thalassemia patient.',
    contactNumber: '+8801819876543',
    requesterName: 'Farhana Kabir',
    requesterRole: 'Student (BBA 48th Intake)',
    requesterBatch: '48th',
    dateNeeded: 'Within 12 Hours',
    status: 'open',
    pledgesCount: 2,
    createdAt: '2026-10-04T09:30:00Z',
  },
  {
    id: 'req-03',
    patientName: 'Sultana Razia',
    bloodGroup: 'A+',
    bagsNeeded: 1,
    hospitalName: 'Ibn Sina Diagnostic & Consultation Center',
    hospitalLocation: 'Mirpur-10 Roundabout, Dhaka',
    urgency: 'within_24h',
    reason: 'Emergency Cesarean delivery scheduled tomorrow morning.',
    contactNumber: '+8801912987654',
    requesterName: 'Dr. M. M. Rahman',
    requesterRole: 'Faculty (Dept of CSE)',
    dateNeeded: 'Tomorrow 9:00 AM',
    status: 'open',
    pledgesCount: 3,
    createdAt: '2026-10-03T16:00:00Z',
  },
  {
    id: 'req-04',
    patientName: 'Kawsar Mahmud (Accident Victim)',
    bloodGroup: 'AB+',
    bagsNeeded: 2,
    hospitalName: 'Dhaka Medical College Hospital',
    hospitalLocation: 'Bakshibazar, Dhaka',
    urgency: 'within_24h',
    reason: 'Orthopedic surgical repair following road accident on Mirpur road.',
    contactNumber: '+8801612349876',
    requesterName: 'Alumni Association Desk',
    requesterRole: 'BUBT Alumni Member',
    dateNeeded: 'Tonight / Early Morning',
    status: 'open',
    pledgesCount: 1,
    createdAt: '2026-10-03T11:20:00Z',
  },
]

export const INITIAL_BLOOD_DONORS: BloodDonor[] = [
  {
    id: 'donor-01',
    fullName: 'SAIF SIAM',
    bloodGroup: 'B+',
    department: 'CSE',
    batch: '54th Intake',
    phone: '+8801700000000',
    lastDonationDate: '4 months ago',
    isAvailable: true,
    location: 'Mirpur-2 / Rupnagar',
  },
  {
    id: 'donor-02',
    fullName: 'Tanvir Ahmed',
    bloodGroup: 'O+',
    department: 'CSE',
    batch: '50th Intake',
    phone: '+8801712345678',
    lastDonationDate: '5 months ago',
    isAvailable: true,
    location: 'Mirpur-1',
  },
  {
    id: 'donor-03',
    fullName: 'Nusrat Jahan',
    bloodGroup: 'A+',
    department: 'EEE',
    batch: '49th Intake',
    phone: '+8801819876543',
    lastDonationDate: '6 months ago',
    isAvailable: true,
    location: 'Rupnagar R/A',
  },
  {
    id: 'donor-04',
    fullName: 'Mahmudul Hasan',
    bloodGroup: 'O-',
    department: 'BBA',
    batch: '52nd Intake',
    phone: '+8801911223344',
    lastDonationDate: '3 months ago',
    isAvailable: true,
    location: 'Mirpur-10',
  },
  {
    id: 'donor-05',
    fullName: 'Zubair Hossain',
    bloodGroup: 'AB+',
    department: 'Law',
    batch: '47th Intake',
    phone: '+8801511223344',
    lastDonationDate: '7 months ago',
    isAvailable: true,
    location: 'Pallabi, Mirpur-12',
  },
]

const STORAGE_KEY_REQUESTS = 'bubt_blood_requests_v1'
const STORAGE_KEY_DONORS = 'bubt_blood_donors_v1'
const STORAGE_KEY_MY_PLEDGES = 'bubt_my_blood_pledges_v1'

const listeners = new Set<() => void>()
function notify() {
  listeners.forEach((fn) => fn())
}

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function useBloodDonationStore() {
  const [requests, setRequests] = useState<BloodRequest[]>(INITIAL_BLOOD_REQUESTS)
  const [donors, setDonors] = useState<BloodDonor[]>(INITIAL_BLOOD_DONORS)
  const [pledgedRequestIds, setPledgedRequestIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setRequests(getStored(STORAGE_KEY_REQUESTS, INITIAL_BLOOD_REQUESTS))
    setDonors(getStored(STORAGE_KEY_DONORS, INITIAL_BLOOD_DONORS))
    const savedPledges = getStored<string[]>(STORAGE_KEY_MY_PLEDGES, [])
    setPledgedRequestIds(new Set(savedPledges))

    const update = () => {
      setRequests(getStored(STORAGE_KEY_REQUESTS, INITIAL_BLOOD_REQUESTS))
      setDonors(getStored(STORAGE_KEY_DONORS, INITIAL_BLOOD_DONORS))
      const p = getStored<string[]>(STORAGE_KEY_MY_PLEDGES, [])
      setPledgedRequestIds(new Set(p))
    }
    listeners.add(update)
    return () => {
      listeners.delete(update)
    }
  }, [])

  const saveRequests = useCallback((updated: BloodRequest[]) => {
    setRequests(updated)
    try {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(updated))
      notify()
    } catch (e) {
      console.error(e)
    }
  }, [])

  const saveDonors = useCallback((updated: BloodDonor[]) => {
    setDonors(updated)
    try {
      localStorage.setItem(STORAGE_KEY_DONORS, JSON.stringify(updated))
      notify()
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Create new urgent blood request
  const addBloodRequest = useCallback((
    newReq: Omit<BloodRequest, 'id' | 'pledgesCount' | 'status' | 'createdAt'>
  ) => {
    const created: BloodRequest = {
      ...newReq,
      id: `req-${Date.now()}`,
      status: 'open',
      pledgesCount: 0,
      createdAt: new Date().toISOString(),
    }
    const current = getStored(STORAGE_KEY_REQUESTS, INITIAL_BLOOD_REQUESTS)
    const updated = [created, ...current]
    saveRequests(updated)
    return created
  }, [saveRequests])

  // Pledge donation for a request
  const pledgeDonation = useCallback((requestId: string) => {
    const currentPledges = getStored<string[]>(STORAGE_KEY_MY_PLEDGES, [])
    const nextSet = new Set(currentPledges)
    const isPledged = nextSet.has(requestId)

    if (isPledged) {
      nextSet.delete(requestId)
    } else {
      nextSet.add(requestId)
    }

    try {
      localStorage.setItem(STORAGE_KEY_MY_PLEDGES, JSON.stringify(Array.from(nextSet)))
      setPledgedRequestIds(nextSet)
    } catch (e) {
      console.error(e)
    }

    const currentRequests = getStored(STORAGE_KEY_REQUESTS, INITIAL_BLOOD_REQUESTS)
    const updated = currentRequests.map((r: BloodRequest) => {
      if (r.id !== requestId) return r
      return {
        ...r,
        pledgesCount: Math.max(0, r.pledgesCount + (isPledged ? -1 : 1)),
      }
    })
    saveRequests(updated)
  }, [saveRequests])

  // Register as voluntary donor
  const registerDonor = useCallback((donorInput: Omit<BloodDonor, 'id'>) => {
    const newDonor: BloodDonor = {
      ...donorInput,
      id: `donor-${Date.now()}`,
    }
    const current = getStored(STORAGE_KEY_DONORS, INITIAL_BLOOD_DONORS)
    const updated = [newDonor, ...current]
    saveDonors(updated)
    return newDonor
  }, [saveDonors])

  return {
    requests,
    donors,
    pledgedRequestIds,
    addBloodRequest,
    pledgeDonation,
    registerDonor,
  }
}
