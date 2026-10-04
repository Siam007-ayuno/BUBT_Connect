'use client'

import { useState } from 'react'
import { Plus, CheckCircle, Clock, BarChart2, Users, AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useAuthorityStore, type OfficialPoll } from '@/lib/authority-store'

interface PollsManagerProps {
  currentRole: string
  currentUserName: string
}

export function PollsManager({ currentRole, currentUserName }: PollsManagerProps) {
  const { polls, createPoll, votePoll, toggleClosePoll } = useAuthorityStore()
  const isAuthority = currentRole === 'authority' || currentRole === 'super_admin'

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [targetAudience, setTargetAudience] = useState('All BUBT Students')
  const [expiryDays, setExpiryDays] = useState('7')

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, ''])
    }
  }

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options]
    updated[index] = val
    setOptions(updated)
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) {
      toast.error('Question cannot be empty.')
      return
    }
    const validOptions = options.map((o) => o.trim()).filter(Boolean)
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 valid poll options.')
      return
    }

    createPoll(
      question.trim(),
      description.trim(),
      validOptions,
      targetAudience,
      parseInt(expiryDays, 10),
      currentUserName,
      currentRole
    )

    toast.success('Official university poll published!')
    setIsCreateModalOpen(false)
    setQuestion('')
    setDescription('')
    setOptions(['', ''])
  }

  return (
    <div className="space-y-4">
      {/* Header & New Poll CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card p-4 rounded-xl border">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Official University Polls & Surveys
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Conduct verified student body surveys to inform administrative policy, timetable adjustments, and campus facility upgrades.
          </p>
        </div>

        {isAuthority && (
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="font-bold text-xs gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Create Official Poll
          </Button>
        )}
      </div>

      {/* Poll Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {polls.map((poll) => {
          return (
            <div
              key={poll.id}
              className={`p-4 sm:p-5 rounded-xl border bg-card shadow-xs space-y-4 flex flex-col justify-between ${
                poll.isClosed ? 'opacity-85 border-border' : 'border-primary/30'
              }`}
            >
              <div className="space-y-3">
                {/* Status + Audience badges */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {poll.isClosed ? (
                      <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground">
                        Closed
                      </Badge>
                    ) : (
                      <Badge className="text-[10px] bg-emerald-600 dark:bg-emerald-500 font-bold">
                        ● Active
                      </Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      Target: {poll.targetAudience}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Total: {poll.totalVotes} votes
                  </span>
                </div>

                {/* Question */}
                <h3 className="font-bold text-sm sm:text-base leading-snug text-foreground">
                  {poll.question}
                </h3>

                {poll.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {poll.description}
                  </p>
                )}

                {/* Options Bars */}
                <div className="space-y-2 pt-1">
                  {poll.options.map((opt) => {
                    const percent =
                      poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0
                    const isVoted = poll.userVotedOptionId === opt.id

                    return (
                      <div
                        key={opt.id}
                        onClick={() => !poll.isClosed && !poll.userVotedOptionId && votePoll(poll.id, opt.id)}
                        className={`p-2.5 rounded-lg border text-xs relative overflow-hidden transition-all ${
                          !poll.isClosed && !poll.userVotedOptionId
                            ? 'cursor-pointer hover:border-primary/50 bg-muted/20'
                            : 'bg-muted/30'
                        } ${isVoted ? 'border-primary ring-1 ring-primary' : ''}`}
                      >
                        {/* Progress Bar Background */}
                        <div
                          className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ${
                            isVoted ? 'bg-primary/20' : 'bg-primary/10'
                          }`}
                          style={{ width: `${percent}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between gap-2">
                          <span className="font-medium text-foreground flex items-center gap-1.5">
                            {opt.text}
                            {isVoted && (
                              <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                            )}
                          </span>
                          <span className="font-bold text-foreground shrink-0 text-[11px]">
                            {percent}% ({opt.votes})
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bottom Authority Control */}
              <div className="pt-3 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                <span>By {poll.createdBy}</span>
                {isAuthority && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => toggleClosePoll(poll.id, currentUserName, currentRole)}
                    className="text-xs font-semibold h-7"
                  >
                    {poll.isClosed ? 'Reopen Poll' : 'Close Poll'}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Poll Modal */}
      {isCreateModalOpen && (
        <Dialog open={true} onOpenChange={() => setIsCreateModalOpen(false)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Launch Official BUBT Poll
              </DialogTitle>
              <DialogDescription className="text-xs">
                Official polls are presented directly to targeted student cohorts for decision-making.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Poll Question / Title:</label>
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Preferred date for Campus Tech Carnival 2026"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Context / Notes (optional):</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly state rationale or committee details..."
                  rows={2}
                  className="text-xs"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="text-xs font-semibold">Voting Options (2 to 5):</label>
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="text-xs h-8"
                      required
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(i)}
                        className="text-muted-foreground hover:text-destructive p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                {options.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={handleAddOption}
                    className="text-xs gap-1 mt-1"
                  >
                    <Plus className="h-3 w-3" /> Add Option
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Target Audience:</label>
                  <Select value={targetAudience} onValueChange={(val) => val && setTargetAudience(val)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All BUBT Students">All BUBT Students</SelectItem>
                      <SelectItem value="Department of CSE">Department of CSE</SelectItem>
                      <SelectItem value="Department of EEE">Department of EEE</SelectItem>
                      <SelectItem value="Department of BBA">Department of BBA</SelectItem>
                      <SelectItem value="Department of Law">Department of Law</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Poll Duration:</label>
                  <Select value={expiryDays} onValueChange={(val) => val && setExpiryDays(val)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="14">14 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="font-bold">
                  Publish Poll
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
