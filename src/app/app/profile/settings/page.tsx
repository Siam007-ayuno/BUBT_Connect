'use client'

import { useState } from 'react'
import {
  Settings,
  Bell,
  Shield,
  Moon,
  Sun,
  Globe,
  Save,
  CheckCircle2,
  Users,
  Lock,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTheme } from 'next-themes'
import { RoleSwitcher } from '@/components/role-switcher'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [notifyUrgent, setNotifyUrgent] = useState(true)
  const [notifyIssueUpdates, setNotifyIssueUpdates] = useState(true)
  const [notifyClubEvents, setNotifyClubEvents] = useState(false)
  const [defaultAnonymous, setDefaultAnonymous] = useState(false)
  const [language, setLanguage] = useState('en')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Profile and application preferences saved successfully!')
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Account & App Settings
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your BUBT Connect preferences, notification alerts, and privacy settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Privacy & Confidentiality */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Voice Board Privacy & Whistleblower Shield</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Configure how your identity appears on campus posts and replies.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">Default Anonymous Posting</Label>
                <p className="text-[11px] text-muted-foreground">
                  Automatically enable identity masking on newly drafted Voice Board submissions.
                </p>
              </div>
              <Switch checked={defaultAnonymous} onCheckedChange={setDefaultAnonymous} />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <span>Notification Alerts</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Receive timely updates regarding academic notices and voice issues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">Urgent University Circulars</Label>
                <p className="text-[11px] text-muted-foreground">
                  Immediate alerts for examination schedules, campus emergencies, and deadlines.
                </p>
              </div>
              <Switch checked={notifyUrgent} onCheckedChange={setNotifyUrgent} />
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">Issue Resolution Updates</Label>
                <p className="text-[11px] text-muted-foreground">
                  Notify when issues you reported or upvoted transition to In Progress or Resolved.
                </p>
              </div>
              <Switch checked={notifyIssueUpdates} onCheckedChange={setNotifyIssueUpdates} />
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">Club Fests & Competition Reminders</Label>
                <p className="text-[11px] text-muted-foreground">
                  Notifications for intra-university hackathons, cultural galas, and tournaments.
                </p>
              </div>
              <Switch checked={notifyClubEvents} onCheckedChange={setNotifyClubEvents} />
            </div>
          </CardContent>
        </Card>

        {/* Language & Localization */}
        <Card className="border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>Language & Locale</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Choose your preferred display language for UI labels and circular memorandums.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Portal Language</Label>
              <Select value={language} onValueChange={(val) => val && setLanguage(val)}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (Default)</SelectItem>
                  <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="submit" className="gap-2 text-xs font-semibold shadow-xs">
            <Save className="h-3.5 w-3.5" />
            <span>Save Preferences</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
