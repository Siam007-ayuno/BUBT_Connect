import { cookies } from 'next/headers'
import { DEMO_USERS } from '@/lib/demo-data'
import { ResourcesClient } from '@/components/academic/resources-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Course Resources & Question Bank | BUBT Connect',
  description: 'Past semester question banks, solved exams, slides, and lab code repositories for BUBT courses.',
}

export default async function ResourcesPage() {
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('bubt_demo_role')?.value || 'student'
  const currentUser = DEMO_USERS[demoRole] || DEMO_USERS.student

  return (
    <ResourcesClient
      userRole={demoRole}
      userName={currentUser.profile.full_name}
    />
  )
}
