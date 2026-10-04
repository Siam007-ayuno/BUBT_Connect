'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CampusEvent,
  ClubItem,
  LostFoundItem,
  DirectoryContact,
  INITIAL_EVENTS,
  INITIAL_CLUBS,
  INITIAL_LOST_FOUND,
  DIRECTORY_CONTACTS,
} from './campus-life-data'

const STORAGE_KEY_EVENTS = 'bubt_campus_events_v1'
const STORAGE_KEY_CLUBS_JOINED = 'bubt_clubs_joined_v1'
const STORAGE_KEY_LOST_FOUND = 'bubt_lost_found_v1'

export function useCampusLifeStore() {
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS)
  const [clubs, setClubs] = useState<ClubItem[]>(INITIAL_CLUBS)
  const [joinedClubIds, setJoinedClubIds] = useState<Set<string>>(new Set(['club-itc']))
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(INITIAL_LOST_FOUND)
  const [contacts] = useState<DirectoryContact[]>(DIRECTORY_CONTACTS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage
  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem(STORAGE_KEY_EVENTS)
      if (savedEvents) {
        const parsed = JSON.parse(savedEvents)
        if (Array.isArray(parsed) && parsed.length > 0) setEvents(parsed)
      }

      const savedJoined = localStorage.getItem(STORAGE_KEY_CLUBS_JOINED)
      if (savedJoined) {
        const parsedJoined = JSON.parse(savedJoined)
        if (Array.isArray(parsedJoined)) setJoinedClubIds(new Set(parsedJoined))
      }

      const savedLF = localStorage.getItem(STORAGE_KEY_LOST_FOUND)
      if (savedLF) {
        const parsedLF = JSON.parse(savedLF)
        if (Array.isArray(parsedLF) && parsedLF.length > 0) setLostFoundItems(parsedLF)
      }
    } catch (e) {
      console.error('Error loading campus life data:', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save events
  const saveEvents = useCallback((newEvents: CampusEvent[]) => {
    setEvents(newEvents)
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(newEvents))
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Save lost found
  const saveLostFound = useCallback((newItems: LostFoundItem[]) => {
    setLostFoundItems(newItems)
    try {
      localStorage.setItem(STORAGE_KEY_LOST_FOUND, JSON.stringify(newItems))
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Event RSVP toggle
  const setEventRsvp = useCallback((eventId: string, status: 'going' | 'interested' | 'not_going') => {
    const updated = events.map((evt) => {
      if (evt.id !== eventId) return evt

      const prevStatus = evt.rsvpStatus
      let diff = 0
      if (status === 'going' && prevStatus !== 'going') diff = 1
      else if (prevStatus === 'going' && status !== 'going') diff = -1

      return {
        ...evt,
        rsvpStatus: status,
        currentAttendees: Math.max(0, evt.currentAttendees + diff),
      }
    })
    saveEvents(updated)
  }, [events, saveEvents])

  // Add new Event
  const createEvent = useCallback((eventInput: Omit<CampusEvent, 'id' | 'currentAttendees'>) => {
    const newEvt: CampusEvent = {
      ...eventInput,
      id: `evt-${Date.now()}`,
      currentAttendees: 1,
      rsvpStatus: 'going',
    }
    saveEvents([newEvt, ...events])
    return newEvt
  }, [events, saveEvents])

  // Join club toggle
  const toggleJoinClub = useCallback((clubId: string) => {
    setJoinedClubIds((prev) => {
      const next = new Set(prev)
      if (next.has(clubId)) {
        next.delete(clubId)
      } else {
        next.add(clubId)
      }
      try {
        localStorage.setItem(STORAGE_KEY_CLUBS_JOINED, JSON.stringify(Array.from(next)))
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }, [])

  // Add Lost & Found item
  const createLostFoundItem = useCallback((itemInput: Omit<LostFoundItem, 'id' | 'date' | 'status'>) => {
    const newItem: LostFoundItem = {
      ...itemInput,
      id: `lf-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'open',
    }
    saveLostFound([newItem, ...lostFoundItems])
    return newItem
  }, [lostFoundItems, saveLostFound])

  // Update item status
  const updateLostFoundStatus = useCallback((id: string, status: 'open' | 'claimed' | 'returned') => {
    const updated = lostFoundItems.map((item) => (item.id === id ? { ...item, status } : item))
    saveLostFound(updated)
  }, [lostFoundItems, saveLostFound])

  // Export event to .ics file
  const exportToCalendar = useCallback((event: CampusEvent) => {
    const formatIcsDate = (isoStr: string) => {
      const d = new Date(isoStr)
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BUBT Connect//Campus Events//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}@bubt.edu.bd`,
      `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
      `DTSTART:${formatIcsDate(event.startDate)}`,
      `DTEND:${formatIcsDate(event.endDate || event.startDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.venue} - BUBT Permanent Campus`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  return {
    events,
    clubs,
    joinedClubIds,
    lostFoundItems,
    contacts,
    isLoaded,
    setEventRsvp,
    createEvent,
    toggleJoinClub,
    createLostFoundItem,
    updateLostFoundStatus,
    exportToCalendar,
  }
}
