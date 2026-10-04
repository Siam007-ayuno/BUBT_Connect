'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MessageSquare, Megaphone, Users, Calendar, Shield, Sparkles, Building2, CheckCircle2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  const setRoleAndGo = (role: string) => {
    document.cookie = `bubt_demo_role=${role}; path=/; max-age=86400`
    router.push('/app')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top University Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="font-bangla font-semibold">জ্ঞানই শক্তি</span>
        <span>•</span>
        <span>Bangladesh University of Business and Technology (BUBT)</span>
        <span>•</span>
        <span className="hidden sm:inline text-primary-foreground/90">Mirpur-2, Dhaka-1216</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xs">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-white p-0.5 border border-primary/20 shadow-xs">
              <Image
                src="/images/bubt-logo.png"
                alt="BUBT Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black text-primary tracking-tight">
                BUBT <span className="text-foreground">Connect</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">
                Official Digital Campus Platform
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), "hidden sm:inline-flex text-xs")}>
              Sign In
            </Link>
            <Link href="/app" className={cn(buttonVariants({ size: 'sm' }), "text-xs font-semibold gap-1.5 shadow-xs")}>
              Open App <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              
              {/* Left Column: Headlines & Call to Actions */}
              <div className="flex flex-col items-start gap-4 text-left">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Your Voice. Your University Community.
                </div>

                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                  One Unified Hub for{' '}
                  <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    BUBT
                  </span>{' '}
                  Campus
                </h1>

                <p className="max-w-[38rem] text-muted-foreground text-base sm:text-lg leading-relaxed">
                  Voice your concerns safely on the <strong>Voice Board</strong>, get verified responses from university administration, follow official notices, connect with alumni, and participate in campus life.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/app" className={cn(buttonVariants({ size: 'lg' }), "h-12 px-6 font-bold shadow-md")}>
                    Enter Voice Board <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link href="/signup" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "h-12 px-6 font-medium")}>
                    Create Account
                  </Link>
                </div>

                {/* Instant Persona Switcher for Browser Testing */}
                <div className="w-full mt-4 p-4 rounded-xl border border-primary/20 bg-card/80 backdrop-blur shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    ⚡ Instant Demo Access (Test All Roles):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => setRoleAndGo('student')}
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900 transition-colors text-xs font-semibold"
                    >
                      <Users className="h-4 w-4 mb-1" />
                      <span>Student (Tanvir)</span>
                    </button>
                    <button
                      onClick={() => setRoleAndGo('faculty')}
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-900 transition-colors text-xs font-semibold"
                    >
                      <Building2 className="h-4 w-4 mb-1" />
                      <span>Faculty (Dr. Rahman)</span>
                    </button>
                    <button
                      onClick={() => setRoleAndGo('authority')}
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900 transition-colors text-xs font-semibold"
                    >
                      <Shield className="h-4 w-4 mb-1" />
                      <span>Authority (Proctor)</span>
                    </button>
                    <button
                      onClick={() => setRoleAndGo('alumni')}
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 transition-colors text-xs font-semibold"
                    >
                      <CheckCircle2 className="h-4 w-4 mb-1" />
                      <span>Alumni (Farzana)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Real BUBT Campus Image & Live Stats Card */}
              <div className="relative flex flex-col items-center">
                <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl">
                  <Image
                    src="/images/bubt-campus.jpg"
                    alt="BUBT Permanent Campus Building Mirpur"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                      Permanent Campus • Rupnagar, Mirpur-2
                    </p>
                    <h3 className="text-lg font-bold">
                      Bangladesh University of Business & Technology
                    </h3>
                  </div>
                </div>

                {/* Floating Highlight Card */}
                <div className="w-[90%] -mt-6 rounded-xl border bg-card p-4 shadow-lg flex items-center justify-around text-center">
                  <div>
                    <span className="block text-2xl font-black text-primary">15,000+</span>
                    <span className="text-[11px] text-muted-foreground">Students & Alumni</span>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <span className="block text-2xl font-black text-accent">98.4%</span>
                    <span className="text-[11px] text-muted-foreground">Issue Escalation Rate</span>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">Official</span>
                    <span className="text-[11px] text-muted-foreground">Admin Response</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="container mx-auto space-y-12 py-16 px-4">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-3 text-center">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
              Engineered Specifically for BUBT Community
            </h2>
            <p className="max-w-[85%] text-muted-foreground text-sm sm:text-base">
              A transparent, accountable ecosystem uniting students, professors, administration, and alumni.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            <div className="rounded-xl border bg-card p-6 shadow-xs hover:border-primary/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base mb-1.5">Voice Board Feed</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Post problems, suggestions, and academic questions. Supports anonymous posting with database-level privacy protection.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-xs hover:border-primary/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base mb-1.5">Issue Status Tracker</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transparent issue workflow: Open ➔ Under Review ➔ In Progress ➔ Resolved. With verified official responses from authority.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-xs hover:border-primary/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-4">
                <Megaphone className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base mb-1.5">Notice & Routine Hub</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Never miss exams, fees, scholarships, or routine updates. Direct announcements targeted by department and batch.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-xs hover:border-primary/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base mb-1.5">Alumni & Career Corner</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Directory of BUBT graduates across leading IT firms and multinationals, mentorship matching, and verified job referrals.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4 bg-muted/30">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 rounded-full overflow-hidden bg-white p-0.5 border">
              <Image src="/images/bubt-logo.png" alt="BUBT Crest" fill className="object-contain" />
            </div>
            <span>© {new Date().getFullYear()} BUBT Connect • Bangladesh University of Business & Technology</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/guidelines" className="hover:underline">Community Guidelines</Link>
            <a href="https://www.bubt.edu.bd" target="_blank" rel="noreferrer" className="hover:underline">Official BUBT Website</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
