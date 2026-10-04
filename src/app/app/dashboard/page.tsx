import { cookies } from 'next/headers'
import { DEMO_USERS } from '@/lib/demo-data'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('bubt_demo_role')?.value || 'authority'
  let profile: Profile = DEMO_USERS[demoRole]?.profile || DEMO_USERS.authority.profile

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder.supabase.co')

  if (!isPlaceholder) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) profile = data
      }
    } catch {}
  }

  return <DashboardClient serverRole={profile.role} serverProfile={profile} />
}
