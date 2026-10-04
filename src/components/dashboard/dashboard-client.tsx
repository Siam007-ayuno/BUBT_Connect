'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Shield,
  BarChart3,
  Inbox,
  Vote,
  ShieldAlert,
  Download,
  Lock,
  Sparkles,
  Users,
  BookOpen,
  GraduationCap,
  Crown,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts'
import { IssueInbox } from '@/components/dashboard/issue-inbox'
import { PollsManager } from '@/components/dashboard/polls-manager'
import { ModerationQueue } from '@/components/dashboard/moderation-queue'
import { ExportDialog } from '@/components/dashboard/export-dialog'
import { useVoiceBoardStore } from '@/lib/voice-board-store'
import { useAuthorityStore } from '@/lib/authority-store'
import { DEMO_USERS } from '@/lib/demo-data'
import { toast } from 'sonner'
import type { Profile } from '@/lib/types'

interface DashboardClientProps {
  serverRole: string
  serverProfile: Profile
}

const PERSONA_ICONS: Record<string, React.ElementType> = {
  student: Users,
  faculty: BookOpen,
  authority: Shield,
  alumni: GraduationCap,
  super_admin: Crown,
}

export function DashboardClient({ serverRole, serverProfile }: DashboardClientProps) {
  const { posts, updatePostStatus, addOfficialResponse } = useVoiceBoardStore()
  const { reports } = useAuthorityStore()

  const [activeTab, setActiveTab] = useState<'inbox' | 'analytics' | 'polls' | 'moderation'>('inbox')
  const [isExportOpen, setIsExportOpen] = useState(false)

  const isAuthority = serverRole === 'authority' || serverRole === 'super_admin'
  const currentRole = serverRole
  const currentUserName = serverProfile.full_name || 'Authority Member'

  const handleSwitchPersona = (roleKey: string) => {
    document.cookie = `bubt_demo_role=${roleKey}; path=/; max-age=86400`
    const targetLabel = DEMO_USERS[roleKey]?.label || roleKey
    toast.success(`Switched persona to: ${targetLabel}`)

    // If switching to student/faculty/alumni, navigate to the public Voice Board
    if (roleKey !== 'authority' && roleKey !== 'super_admin') {
      window.location.href = '/app'
    } else {
      window.location.reload()
    }
  }

  // If role is unauthorized, show access restriction with 1-click persona switch
  if (!isAuthority) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
          <Lock className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">
            Authority & Administration Access Restricted
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            The BUBT Authority Dashboard is reserved for Proctorial Body members, Department Heads, and University Administrators.
          </p>
        </div>

        {/* Action: Return to Voice Board */}
        <div className="flex justify-center pt-1">
          <Link href="/app">
            <Button variant="default" className="font-bold text-xs gap-1.5 h-10 px-6">
              <ArrowLeft className="h-4 w-4" />
              Return to Community Voice Board
            </Button>
          </Link>
        </div>

        {/* Demo Switcher Helper for Reviewers */}
        <div className="p-5 rounded-2xl border border-primary/20 bg-card shadow-md space-y-4 max-w-lg mx-auto text-left">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Interactive Demo: Switch to Any BUBT Persona</span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            You are currently signed in as <strong>{serverProfile.full_name} ({serverRole})</strong>. Select any persona below to experience their specific permissions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <Button
              onClick={() => handleSwitchPersona('authority')}
              className="font-bold text-xs gap-1.5 h-10 justify-start"
            >
              <Shield className="h-4 w-4" />
              Proctor Office (Authority)
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSwitchPersona('super_admin')}
              className="font-semibold text-xs h-10 justify-start gap-1.5"
            >
              <Crown className="h-4 w-4" />
              Super Admin
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSwitchPersona('student')}
              className="font-medium text-xs h-10 justify-start gap-1.5"
            >
              <Users className="h-4 w-4" />
              Student (Tanvir - CSE)
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSwitchPersona('faculty')}
              className="font-medium text-xs h-10 justify-start gap-1.5"
            >
              <BookOpen className="h-4 w-4" />
              Faculty (Dr. Rahman)
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Authority & Proctorial Suite
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              Admin Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Official management platform for BUBT student affairs, issue triage, institutional analytics, and campus safety.
          </p>
        </div>

        {/* Header Action Toolbar */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Switch Persona Dropdown directly in dashboard */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer shadow-xs">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>Persona: <strong className="capitalize">{currentRole.replace('_', ' ')}</strong></span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Switch Demo Persona
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(DEMO_USERS).map(([key, data]) => {
                const Icon = PERSONA_ICONS[key] || Users
                const isSelected = key === currentRole
                return (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleSwitchPersona(key)}
                    className="flex items-start gap-2.5 py-2 cursor-pointer"
                  >
                    <div
                      className={`p-1.5 rounded-md ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold flex items-center gap-1.5">
                        {data.label}
                        {isSelected && (
                          <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.2 rounded font-bold">
                            Active
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-muted-foreground line-clamp-1">
                        {data.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Meeting Report */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportOpen(true)}
            className="text-xs font-semibold gap-1.5 h-9"
          >
            <Download className="h-3.5 w-3.5" />
            Export Meeting Report
          </Button>

          {/* Quick link to Voice Board */}
          <Link href="/app">
            <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1 h-9">
              <span>Voice Board</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <StatsCards posts={posts} reports={reports} />

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'inbox'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Inbox className="h-4 w-4" />
          <span>Issue Inbox & Resolution Desk ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Analytics & Institutional Charts</span>
        </button>

        <button
          onClick={() => setActiveTab('polls')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'polls'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Vote className="h-4 w-4" />
          <span>Official Polls & Surveys</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'moderation'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <ShieldAlert className="h-4 w-4 text-destructive" />
          <span>Safety & Moderation ({reports.filter((r) => r.status === 'pending').length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'inbox' && (
        <IssueInbox
          posts={posts}
          currentRole={currentRole}
          currentUserName={currentUserName}
          onUpdatePostStatus={(postId, status, note) => {
            updatePostStatus(postId, status, currentUserName, note)
          }}
          onAddOfficialResponse={(postId, body) => {
            addOfficialResponse(
              postId,
              body,
              currentUserName,
              currentRole,
              serverProfile.avatar_url || '/images/bubt-logo.png'
            )
          }}
        />
      )}

      {activeTab === 'analytics' && <AnalyticsCharts posts={posts} />}

      {activeTab === 'polls' && (
        <PollsManager currentRole={currentRole} currentUserName={currentUserName} />
      )}

      {activeTab === 'moderation' && (
        <ModerationQueue currentRole={currentRole} currentUserName={currentUserName} />
      )}

      {/* Export Dialog */}
      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        posts={posts}
      />
    </div>
  )
}
