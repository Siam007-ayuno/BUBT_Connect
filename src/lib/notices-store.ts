'use client'

import { useState, useEffect, useCallback } from 'react'
import { OfficialNotice, RoutineSlot, ExamRoutineItem, INITIAL_NOTICES, CLASS_ROUTINE_DATA, EXAM_ROUTINE_DATA } from './notices-data'

const STORAGE_KEY_NOTICES = 'bubt_official_notices_v1'
const STORAGE_KEY_READ_IDS = 'bubt_read_notice_ids_v1'

export function useNoticesStore() {
  const [notices, setNotices] = useState<OfficialNotice[]>(INITIAL_NOTICES)
  const [readNoticeIds, setReadNoticeIds] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedNotices = localStorage.getItem(STORAGE_KEY_NOTICES)
      if (savedNotices) {
        const parsed = JSON.parse(savedNotices)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotices(parsed)
        }
      }

      const savedRead = localStorage.getItem(STORAGE_KEY_READ_IDS)
      if (savedRead) {
        const parsedRead = JSON.parse(savedRead)
        if (Array.isArray(parsedRead)) {
          setReadNoticeIds(new Set(parsedRead))
        }
      }
    } catch (e) {
      console.error('Error loading notices from storage:', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save notices whenever updated
  const saveNotices = useCallback((newNotices: OfficialNotice[]) => {
    setNotices(newNotices)
    try {
      localStorage.setItem(STORAGE_KEY_NOTICES, JSON.stringify(newNotices))
    } catch (e) {
      console.error('Error saving notices:', e)
    }
  }, [])

  // Save read IDs
  const saveReadIds = useCallback((newReadIds: Set<string>) => {
    setReadNoticeIds(newReadIds)
    try {
      localStorage.setItem(STORAGE_KEY_READ_IDS, JSON.stringify(Array.from(newReadIds)))
    } catch (e) {
      console.error('Error saving read notices:', e)
    }
  }, [])

  // Mark notice as read / unread toggle
  const toggleMarkAsRead = useCallback((id: string) => {
    setReadNoticeIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      try {
        localStorage.setItem(STORAGE_KEY_READ_IDS, JSON.stringify(Array.from(next)))
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    const allIds = new Set(notices.map((n) => n.id))
    saveReadIds(allIds)
  }, [notices, saveReadIds])

  // Publish a new official notice
  const publishNotice = useCallback((input: Omit<OfficialNotice, 'id' | 'publishedAt'> & { id?: string }) => {
    const newNotice: OfficialNotice = {
      ...input,
      id: input.id || `not-${Date.now()}`,
      publishedAt: new Date().toISOString(),
    }
    const updated = [newNotice, ...notices]
    saveNotices(updated)
    return newNotice
  }, [notices, saveNotices])

  // Delete notice
  const deleteNotice = useCallback((id: string) => {
    const updated = notices.filter((n) => n.id !== id)
    saveNotices(updated)
  }, [notices, saveNotices])

  // Reset to initial demo notices
  const resetToDefault = useCallback(() => {
    saveNotices(INITIAL_NOTICES)
    saveReadIds(new Set())
  }, [saveNotices, saveReadIds])

  const unreadCount = notices.filter((n) => !readNoticeIds.has(n.id)).length

  return {
    notices,
    readNoticeIds,
    unreadCount,
    isLoaded,
    toggleMarkAsRead,
    markAllAsRead,
    publishNotice,
    deleteNotice,
    resetToDefault,
    classRoutines: CLASS_ROUTINE_DATA,
    examRoutines: EXAM_ROUTINE_DATA,
  }
}
