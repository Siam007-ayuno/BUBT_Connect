import { Metadata } from 'next'
import { SosClient } from '@/components/sos/sos-client'

export const metadata: Metadata = {
  title: 'Campus SOS & Rapid Emergency Help | BUBT Connect',
  description: 'Emergency distress beacon, Proctor Rapid Response hotline, and student safety network at BUBT.',
}

export default function SosPage() {
  return <SosClient />
}
