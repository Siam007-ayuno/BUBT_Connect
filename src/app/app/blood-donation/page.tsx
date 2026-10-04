import { Metadata } from 'next'
import { BloodDonationClient } from '@/components/blood/blood-donation-client'

export const metadata: Metadata = {
  title: 'Blood Donation Wing | BUBT Connect',
  description: 'Urgent blood donation requests and voluntary campus donor directory for BUBT students, faculty, and alumni.',
}

export default function BloodDonationPage() {
  return <BloodDonationClient />
}
