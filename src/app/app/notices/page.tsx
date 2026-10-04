import { cookies } from 'next/headers'
import { DEMO_USERS } from '@/lib/demo-data'
import { NoticesClient } from '@/components/notices/notices-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Notice Board & Routine Hub | BUBT Connect',
  description: 'Official Bangladesh University of Business and Technology circulars, exam timetables, and class routines.',
}

export default async function NoticesPage() {
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('bubt_demo_role')?.value || 'student'
  const currentUser = DEMO_USERS[demoRole] || DEMO_USERS.student

  return (
    <NoticesClient
      userRole={demoRole}
      userName={currentUser.profile.full_name}
    />
  )
}
