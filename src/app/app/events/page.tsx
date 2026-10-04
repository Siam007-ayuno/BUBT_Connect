import { cookies } from 'next/headers'
import { DEMO_USERS } from '@/lib/demo-data'
import { EventsClient } from '@/components/campus/events-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Campus Events & Schedules | BUBT Connect',
  description: 'Explore upcoming hackathons, fests, club activities, and seminars at BUBT.',
}

export default async function EventsPage() {
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('bubt_demo_role')?.value || 'student'
  const currentUser = DEMO_USERS[demoRole] || DEMO_USERS.student

  return (
    <EventsClient
      userRole={demoRole}
      userName={currentUser.profile.full_name}
    />
  )
}
