'use client'

import { useState } from 'react'
import { Search, MapPin, Phone, Mail, FileText, Send, AlertTriangle, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LostFoundItem } from '@/lib/campus-life-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface PostLostFoundModalProps {
  isOpen: boolean
  onClose: () => void
  onPost: (item: Omit<LostFoundItem, 'id' | 'date' | 'status'>) => void
  userRole?: string
  userName?: string
}

export function PostLostFoundModal({
  isOpen,
  onClose,
  onPost,
  userRole = 'student',
  userName = 'Campus Member',
}: PostLostFoundModalProps) {
  const [type, setType] = useState<'lost' | 'found'>('lost')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<LostFoundItem['category']>('electronics')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [contactName, setContactName] = useState(userName)
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [claimInstructions, setClaimInstructions] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !location.trim() || !description.trim()) {
      toast.error('Please fill in the item title, location, and description')
      return
    }

    onPost({
      type,
      title: title.trim(),
      category,
      location: location.trim(),
      description: description.trim(),
      contactName: contactName.trim() || userName,
      contactPhone: contactPhone.trim() || '01810-033733',
      contactEmail: contactEmail.trim() || 'connect@bubt.edu.bd',
      claimInstructions: claimInstructions.trim() || (type === 'found' ? 'Please bring proof of identity to claim.' : undefined),
      reportedByRole: userRole,
    })

    toast.success(`${type === 'lost' ? 'Lost item report' : 'Found item notice'} published successfully!`)
    setTitle('')
    setLocation('')
    setDescription('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Report Lost or Found Item</DialogTitle>
              <DialogDescription className="text-xs">
                Help fellow students and faculty recover lost belongings across the campus.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Item Type Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Report Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('lost')}
                className={cn(
                  "p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1",
                  type === 'lost'
                    ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold shadow-xs"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                )}
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="text-xs">I Lost Something</span>
              </button>

              <button
                type="button"
                onClick={() => setType('found')}
                className={cn(
                  "p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1",
                  type === 'found'
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                )}
              >
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-xs">I Found Something</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="item-title" className="text-xs font-semibold">
              Item Name & Brand <span className="text-destructive">*</span>
            </Label>
            <Input
              id="item-title"
              placeholder={type === 'lost' ? 'e.g. Casio fx-991EX Calculator' : 'e.g. Blue Umbrella with Wooden Handle'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category</Label>
              <Select value={category} onValueChange={(val: any) => val && setCategory(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics & Gadgets</SelectItem>
                  <SelectItem value="id_card">Student ID / Cards / Keys</SelectItem>
                  <SelectItem value="books">Books, Notebooks & Bags</SelectItem>
                  <SelectItem value="accessories">Wallets & Watches</SelectItem>
                  <SelectItem value="clothing">Clothing & Umbrellas</SelectItem>
                  <SelectItem value="other">Other Campus Articles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="item-location" className="text-xs font-semibold">
                {type === 'lost' ? 'Where did you lose it?' : 'Where did you find it?'} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="item-location"
                placeholder="e.g. Building 2, Room 502 or Cafeteria"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="item-desc" className="text-xs font-semibold">
              Detailed Description & Distinguishing Marks <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="item-desc"
              rows={3}
              placeholder="Describe color, scratches, stickers, contents, or serial numbers to aid verification..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact-phone" className="text-xs font-semibold">Contact Phone Number</Label>
              <Input
                id="contact-phone"
                placeholder="017XX-XXXXXX"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-email" className="text-xs font-semibold">Contact Email</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="student@bubt.edu.bd"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </div>

          {type === 'found' && (
            <div className="space-y-1.5">
              <Label htmlFor="claim-ins" className="text-xs font-semibold">
                Where can the owner collect / claim this item?
              </Label>
              <Input
                id="claim-ins"
                placeholder="e.g. Deposited at Building 1 Proctor Office (Room 104)"
                value={claimInstructions}
                onChange={(e) => setClaimInstructions(e.target.value)}
              />
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              Publish Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
