import { DirectoryClient } from '@/components/campus/directory-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Campus Directory & Emergency Desk | BUBT Connect',
  description: 'Find contact numbers for faculty, university administrative offices, and campus emergency hotlines.',
}

export default function DirectoryPage() {
  return <DirectoryClient />
}
