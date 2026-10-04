import { cookies } from 'next/headers'
import { DEMO_USERS } from '@/lib/demo-data'
import { LostFoundClient } from '@/components/campus/lost-found-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Campus Lost & Found | BUBT Connect',
  description: 'Report lost belongings, register found property, and coordinate claims at BUBT.',
}

export default async function LostFoundPage() {
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('bubt_demo_role')?.value || 'student'
  const currentUser = DEMO_USERS[demoRole] || DEMO_USERS.student

  return (
    <LostFoundClient
      userRole={demoRole}
      userName={currentUser.profile.full_name}
    />
  )
}
