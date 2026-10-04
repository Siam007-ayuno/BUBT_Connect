import { SearchClient } from '@/components/search/search-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Global Search | BUBT Connect',
  description: 'Search across Voice Board posts, official circulars, exam schedules, and campus contacts.',
}

export default function SearchPage() {
  return <SearchClient />
}
