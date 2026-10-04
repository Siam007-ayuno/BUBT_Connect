import { cookies } from 'next/headers'
import { DEMO_USERS } from '@/lib/demo-data'
import { ProfileClient } from '@/components/academic/profile-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Digital Student Profile & Campus Pass | BUBT Connect',
  description: 'Digital Student ID Card, academic transcript, and personal activity log at BUBT.',
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('bubt_demo_role')?.value || 'student'
  const customStudentName = cookieStore.get('bubt_student_name')?.value
  const customStudentId = cookieStore.get('bubt_student_id')?.value
  const customStudentDept = cookieStore.get('bubt_student_dept')?.value
  const customStudentBatch = cookieStore.get('bubt_student_batch')?.value
  const customStudentAvatar = cookieStore.get('bubt_student_avatar')?.value
  const customBloodGroup = cookieStore.get('bubt_student_blood_group')?.value

  let profile = (DEMO_USERS[demoRole] || DEMO_USERS.student).profile

  if (demoRole === 'student' && customStudentName) {
    profile = {
      ...profile,
      full_name: decodeURIComponent(customStudentName),
      student_id: customStudentId ? decodeURIComponent(customStudentId) : profile.student_id,
      department_id: customStudentDept ? decodeURIComponent(customStudentDept).toLowerCase() : profile.department_id,
      batch_id: customStudentBatch ? `batch-${decodeURIComponent(customStudentBatch)}` : profile.batch_id,
      avatar_url: customStudentAvatar ? decodeURIComponent(customStudentAvatar) : profile.avatar_url,
      blood_group: customBloodGroup ? decodeURIComponent(customBloodGroup) : 'B+',
      is_verified: true,
    }
  } else {
    profile = {
      ...profile,
      avatar_url: customStudentAvatar ? decodeURIComponent(customStudentAvatar) : profile.avatar_url,
      blood_group: customBloodGroup ? decodeURIComponent(customBloodGroup) : (profile as any).blood_group || 'B+',
    }
  }

  return (
    <ProfileClient
      currentRole={demoRole}
      profile={profile}
    />
  )
}
