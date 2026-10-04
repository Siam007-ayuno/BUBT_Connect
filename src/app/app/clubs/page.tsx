import { cookies } from 'next/headers'
import { DEMO_USERS } from '@/lib/demo-data'
import { ClubsClient } from '@/components/campus/clubs-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Clubs & Student Societies | BUBT Connect',
  description: 'Explore and join university clubs, societies, and chapters at BUBT.',
}

export default async function ClubsPage() {
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('bubt_demo_role')?.value || 'student'
  const currentUser = DEMO_USERS[demoRole] || DEMO_USERS.student

  return (
    <ClubsClient
      userRole={demoRole}
      userName={currentUser.profile.full_name}
    />
  )
}
