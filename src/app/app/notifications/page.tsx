import { NotificationsClient } from '@/components/notifications/notifications-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Notifications & Alerts | BUBT Connect',
  description: 'View real-time notices, issue updates, event announcements, and academic notifications.',
}

export default function NotificationsPage() {
  return <NotificationsClient />
}
