import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Bengali } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const notoBengali = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-bangla', weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: { default: 'BUBT Connect', template: '%s | BUBT Connect' },
  description: 'The community platform for Bangladesh University of Business and Technology',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'BUBT Connect' },
}

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#1a73a7' }, { media: '(prefers-color-scheme: dark)', color: '#0f172a' }],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
