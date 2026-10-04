import { cookies } from 'next/headers'
import { DEMO_USERS } from '@/lib/demo-data'
import { AlumniClient } from '@/components/academic/alumni-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Alumni Network & Career Corner | BUBT Connect',
  description: 'Connect with global BUBT alumni across top tech companies, request job referrals, and book mentorship.',
}

export default async function AlumniPage() {
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('bubt_demo_role')?.value || 'student'
  const currentUser = DEMO_USERS[demoRole] || DEMO_USERS.student

  return (
    <AlumniClient
      userRole={demoRole}
      userName={currentUser.profile.full_name}
    />
  )
}
