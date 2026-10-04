'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { DEMO_USERS } from '@/lib/demo-data'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder.supabase.co')

    const getDemoProfile = () => {
      if (typeof document === 'undefined') return DEMO_USERS.student.profile
      const match = document.cookie.match(/bubt_demo_role=([^;]+)/)
      const role = match ? match[1] : 'student'

      const studentAvatarMatch = document.cookie.match(/bubt_student_avatar=([^;]+)/)
      const studentBloodMatch = document.cookie.match(/bubt_student_blood_group=([^;]+)/)
      let customAvatar = studentAvatarMatch ? decodeURIComponent(studentAvatarMatch[1]) : null
      let customBlood = studentBloodMatch ? decodeURIComponent(studentBloodMatch[1]) : null

      try {
        if (!customAvatar) {
          customAvatar = localStorage.getItem('bubt_student_avatar')
        }
        if (!customBlood) {
          customBlood = localStorage.getItem('bubt_student_blood_group')
        }
      } catch {}

      if (role === 'student') {
        const studentNameMatch = document.cookie.match(/bubt_student_name=([^;]+)/)
        const studentIdMatch = document.cookie.match(/bubt_student_id=([^;]+)/)
        const studentDeptMatch = document.cookie.match(/bubt_student_dept=([^;]+)/)
        const studentBatchMatch = document.cookie.match(/bubt_student_batch=([^;]+)/)

        if (studentNameMatch) {
          const base = DEMO_USERS.student.profile
          return {
            ...base,
            full_name: decodeURIComponent(studentNameMatch[1]),
            student_id: studentIdMatch ? decodeURIComponent(studentIdMatch[1]) : base.student_id,
            department_id: studentDeptMatch ? decodeURIComponent(studentDeptMatch[1]).toLowerCase() : base.department_id,
            batch_id: studentBatchMatch ? `batch-${decodeURIComponent(studentBatchMatch[1])}` : base.batch_id,
            avatar_url: customAvatar || base.avatar_url,
            blood_group: customBlood || 'B+',
            is_verified: true,
          }
        }

        try {
          const local = localStorage.getItem('bubt_registered_profile')
          if (local) {
            const parsed = JSON.parse(local)
            if (parsed && parsed.full_name) {
              return {
                ...parsed,
                avatar_url: customAvatar || parsed.avatar_url,
                blood_group: customBlood || parsed.blood_group || 'B+',
              }
            }
          }
        } catch {}
      }

      const defaultProfile = DEMO_USERS[role]?.profile || DEMO_USERS.student.profile
      return {
        ...defaultProfile,
        avatar_url: customAvatar || defaultProfile.avatar_url,
        blood_group: customBlood || (defaultProfile as any).blood_group || 'B+',
      }
    }

    if (isPlaceholder) {
      setProfile(getDemoProfile())
      setLoading(false)
      return
    }

    const supabase = createClient()

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          setProfile(data)
        } else {
          setProfile(getDemoProfile())
        }
      } catch {
        setProfile(getDemoProfile())
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setProfile(data)
        } catch {
          setProfile(getDemoProfile())
        }
      } else {
        setProfile(getDemoProfile())
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, profile, loading }
}
