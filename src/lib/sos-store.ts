'use client'

import { useState, useEffect, useCallback } from 'react'

export interface SosAlert {
  id: string
  studentName: string
  studentId?: string
  department?: string
  batch?: string
  phone: string
  category: 'harassment' | 'medical' | 'accident' | 'security' | 'other'
  categoryLabel: string
  locationSpot: string
  description: string
  status: 'active' | 'responding' | 'resolved'
  respondersCount: number
  hasJoined: boolean
  createdAt: string
  resolvedAt?: string
}

export interface EmergencyContact {
  id: string
  title: string
  subtitle: string
  phone: string
  type: 'campus' | 'police' | 'medical' | 'ambulance' | 'helpline'
  availability: string
  description: string
}

export const BUBT_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'con-01',
    title: 'BUBT Proctor Office 24/7 Rapid Response',
    subtitle: 'Campus Security & Disciplinary Action Desk',
    phone: '+8801741129242',
    type: 'campus',
    availability: '24/7 Rapid Response',
    description: 'Immediate intervention for on-campus & campus-perimeter security, bullying, harassment, and conflicts.',
  },
  {
    id: 'con-02',
    title: 'BUBT Campus Medical Desk & First Aid',
    subtitle: 'Building 1 Ground Floor Clinic',
    phone: '+8801912345678',
    type: 'medical',
    availability: '8:00 AM - 9:00 PM (Daily)',
    description: 'On-campus doctor, emergency dressing, oxygen support, and immediate patient stabilization.',
  },
  {
    id: 'con-03',
    title: 'Mirpur Model Police Station',
    subtitle: 'Dhaka Metropolitan Police (DMP)',
    phone: '+8801713373155',
    type: 'police',
    availability: '24/7 Police Patrol',
    description: 'Jurisdictional police station covering Rupnagar, Mirpur-2, and Commerce College area.',
  },
  {
    id: 'con-04',
    title: 'National Emergency Service (999)',
    subtitle: 'Government Central Dispatch',
    phone: '999',
    type: 'police',
    availability: '24/7 Toll-free Emergency',
    description: 'Direct dispatch for Police, Fire Service, and Government Ambulance fleet.',
  },
  {
    id: 'con-05',
    title: 'Al-Markazul Islami Ambulance (Mirpur)',
    subtitle: 'Emergency Ambulance Fleet',
    phone: '+8801711818692',
    type: 'ambulance',
    availability: '24/7 Fast Transport',
    description: 'Rapid patient transport to Delta Medical, National Heart Foundation, or DMCH.',
  },
  {
    id: 'con-06',
    title: 'National Women & Children Helpline (109)',
    subtitle: 'Ministry of Women and Children Affairs',
    phone: '109',
    type: 'helpline',
    availability: '24/7 Free Helpline',
    description: 'Confidential support, legal aid, and anti-harassment emergency response.',
  },
]

export const INITIAL_SOS_ALERTS: SosAlert[] = [
  {
    id: 'sos-01',
    studentName: 'Female CSE Student',
    department: 'CSE',
    batch: '52nd Intake',
    phone: '+8801712998877',
    category: 'harassment',
    categoryLabel: '🚨 Eve-teasing & Stalking by Unknown Outsiders',
    locationSpot: 'Rupnagar Road (Near Commerce College Road Turn, Mirpur-2)',
    description: 'A group of 3 unidentified outsiders on bikes are blocking passage and making abusive remarks. Need fellow BUBT students or proctor guards.',
    status: 'active',
    respondersCount: 5,
    hasJoined: false,
    createdAt: '2026-10-04T15:45:00Z',
  },
  {
    id: 'sos-02',
    studentName: 'Samiul Karim',
    department: 'EEE',
    batch: '50th Intake',
    phone: '+8801819776655',
    category: 'accident',
    categoryLabel: '💥 Bike Accident & Leg Injury',
    locationSpot: 'Mirpur-2 Roundabout Bus Stand (Opposite Sony Square)',
    description: 'Collided with a rickshaw, bleeding from right knee and ankle sprain. Need someone to help reach Delta Hospital.',
    status: 'responding',
    respondersCount: 3,
    hasJoined: true,
    createdAt: '2026-10-04T14:30:00Z',
  },
]

const STORAGE_KEY_SOS_ALERTS = 'bubt_sos_alerts_v1'
const STORAGE_KEY_MY_SOS_RESPONSES = 'bubt_my_sos_responses_v1'

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

export function useSosStore() {
  const [alerts, setAlerts] = useState<SosAlert[]>(INITIAL_SOS_ALERTS)
  const [myRespondedIds, setMyRespondedIds] = useState<Set<string>>(new Set(['sos-02']))

  useEffect(() => {
    setAlerts(getStored(STORAGE_KEY_SOS_ALERTS, INITIAL_SOS_ALERTS))
    const saved = getStored<string[]>(STORAGE_KEY_MY_SOS_RESPONSES, ['sos-02'])
    setMyRespondedIds(new Set(saved))

    const update = () => {
      setAlerts(getStored(STORAGE_KEY_SOS_ALERTS, INITIAL_SOS_ALERTS))
      const s = getStored<string[]>(STORAGE_KEY_MY_SOS_RESPONSES, ['sos-02'])
      setMyRespondedIds(new Set(s))
    }
    listeners.add(update)
    return () => {
      listeners.delete(update)
    }
  }, [])

  const saveAlerts = useCallback((updated: SosAlert[]) => {
    setAlerts(updated)
    try {
      localStorage.setItem(STORAGE_KEY_SOS_ALERTS, JSON.stringify(updated))
      notify()
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Trigger New SOS
  const triggerSos = useCallback((alertInput: Omit<SosAlert, 'id' | 'status' | 'respondersCount' | 'hasJoined' | 'createdAt'>) => {
    const newAlert: SosAlert = {
      ...alertInput,
      id: `sos-${Date.now()}`,
      status: 'active',
      respondersCount: 1,
      hasJoined: false,
      createdAt: new Date().toISOString(),
    }
    const current = getStored(STORAGE_KEY_SOS_ALERTS, INITIAL_SOS_ALERTS)
    const updated = [newAlert, ...current]
    saveAlerts(updated)
    return newAlert
  }, [saveAlerts])

  // Respond to SOS: "I Am Coming to Help"
  const toggleRespondToSos = useCallback((alertId: string) => {
    const currentResponded = getStored<string[]>(STORAGE_KEY_MY_SOS_RESPONSES, [])
    const nextSet = new Set(currentResponded)
    const isResponding = nextSet.has(alertId)

    if (isResponding) {
      nextSet.delete(alertId)
    } else {
      nextSet.add(alertId)
    }

    try {
      localStorage.setItem(STORAGE_KEY_MY_SOS_RESPONSES, JSON.stringify(Array.from(nextSet)))
      setMyRespondedIds(nextSet)
    } catch (e) {
      console.error(e)
    }

    const currentAlerts = getStored(STORAGE_KEY_SOS_ALERTS, INITIAL_SOS_ALERTS)
    const updated = currentAlerts.map((a: SosAlert) => {
      if (a.id !== alertId) return a
      const nextStatus: 'active' | 'responding' | 'resolved' = !isResponding
        ? 'responding'
        : (a.respondersCount <= 1 ? 'active' : 'responding')
      return {
        ...a,
        respondersCount: Math.max(0, a.respondersCount + (isResponding ? -1 : 1)),
        status: nextStatus,
      }
    })
    saveAlerts(updated)
  }, [saveAlerts])

  // Mark SOS as Resolved
  const resolveSos = useCallback((alertId: string) => {
    const currentAlerts = getStored(STORAGE_KEY_SOS_ALERTS, INITIAL_SOS_ALERTS)
    const updated: SosAlert[] = currentAlerts.map((a: SosAlert) => {
      if (a.id !== alertId) return a
      return {
        ...a,
        status: 'resolved' as const,
        resolvedAt: new Date().toISOString(),
      }
    })
    saveAlerts(updated)
  }, [saveAlerts])

  const activeAlertCount = alerts.filter((a) => a.status === 'active' || a.status === 'responding').length

  return {
    alerts,
    contacts: BUBT_EMERGENCY_CONTACTS,
    myRespondedIds,
    activeAlertCount,
    triggerSos,
    toggleRespondToSos,
    respondToSos: toggleRespondToSos,
    resolveSos,
  }
}
