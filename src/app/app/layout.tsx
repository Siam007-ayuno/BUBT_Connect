import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AppShell } from '@/components/layout/app-shell'
import { DEMO_USERS } from '@/lib/demo-data'
import type { Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder.supabase.co')
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('bubt_demo_role')?.value || 'student'
  const customStudentName = cookieStore.get('bubt_student_name')?.value
  const customStudentId = cookieStore.get('bubt_student_id')?.value
  const customStudentDept = cookieStore.get('bubt_student_dept')?.value
  const customStudentBatch = cookieStore.get('bubt_student_batch')?.value

  let profile: Profile | null = null

  if (isPlaceholder) {
    const base = DEMO_USERS[demoRole]?.profile || DEMO_USERS.student.profile
    if (demoRole === 'student' && customStudentName) {
      profile = {
        ...base,
        full_name: decodeURIComponent(customStudentName),
        student_id: customStudentId ? decodeURIComponent(customStudentId) : base.student_id,
        department_id: customStudentDept ? decodeURIComponent(customStudentDept).toLowerCase() : base.department_id,
        batch_id: customStudentBatch ? `batch-${decodeURIComponent(customStudentBatch)}` : base.batch_id,
        is_verified: true,
      }
    } else {
      profile = base
    }
  } else {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        redirect('/login')
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      profile = data
    } catch {
      profile = DEMO_USERS[demoRole]?.profile || DEMO_USERS.student.profile
    }
  }

  if (!profile) {
    redirect('/login')
  }

  return <AppShell profile={profile}>{children}</AppShell>
}
