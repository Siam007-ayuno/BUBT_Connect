'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  Circle, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Building
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OfficialNotice } from '@/lib/notices-data'
import { toast } from 'sonner'

interface NoticeDetailModalProps {
  notice: OfficialNotice | null
  isOpen: boolean
  onClose: () => void
  isRead: boolean
  onToggleRead: (id: string) => void
}

export function NoticeDetailModal({
  notice,
  isOpen,
  onClose,
  isRead,
  onToggleRead,
}: NoticeDetailModalProps) {
  const printAreaRef = useRef<HTMLDivElement>(null)

  if (!notice) return null

  const formattedDate = new Date(notice.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handlePrint = () => {
    window.print()
  }

  const handleSimulatedPdfDownload = () => {
    // Generate text/html blob for the official circular memo
    const memoHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${notice.referenceNo} - ${notice.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: bold; text-transform: uppercase; color: #003366; }
          .motto { font-size: 14px; font-style: italic; margin-top: 4px; }
          .address { font-size: 12px; margin-top: 4px; color: #444; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 13px; font-weight: bold; }
          .subject { font-size: 16px; font-weight: bold; margin: 20px 0; text-decoration: underline; }
          .content { font-size: 14px; white-space: pre-line; margin-bottom: 40px; }
          .sig-box { margin-top: 50px; float: right; text-align: center; width: 250px; }
          .cc-list { margin-top: 80px; clear: both; font-size: 12px; border-top: 1px dashed #999; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Bangladesh University of Business and Technology (BUBT)</div>
          <div class="motto">"জ্ঞানই শক্তি" — Knowledge is Power</div>
          <div class="address">Permanent Campus: Rupnagar, Mirpur-2, Dhaka-1216, Bangladesh | Web: www.bubt.edu.bd</div>
        </div>
        <div class="meta">
          <div>Ref: ${notice.referenceNo}</div>
          <div>Date: ${formattedDate}</div>
        </div>
        <div class="subject">SUBJECT: ${notice.title.toUpperCase()}</div>
        <div class="content">${notice.content}</div>
        <div class="sig-box">
          <div style="font-weight:bold;">${notice.authorName}</div>
          <div>${notice.issuingAuthority}</div>
          <div>BUBT, Dhaka</div>
        </div>
        <div class="cc-list">
          <strong>Copy forwarded for information and necessary action to:</strong><br/>
          1. PS to Vice Chancellor, BUBT<br/>
          2. Deans of all Faculties<br/>
          3. Chairpersons of all Departments<br/>
          4. Controller of Examinations<br/>
          5. Notice Board & BUBT Connect Portal<br/>
          6. Office Guard File
        </div>
      </body>
      </html>
    `
    const blob = new Blob([memoHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${notice.referenceNo.replace(/[\/\\]/g, '_')}_Circular.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Official circular memo downloaded')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/app/notices?ref=${encodeURIComponent(notice.referenceNo)}`)
    toast.success('Circular link copied to clipboard')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 border shadow-2xl">
        <DialogTitle className="sr-only">Notice: {notice.title}</DialogTitle>
        {/* Sticky action toolbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 bg-muted/80 backdrop-blur-md border-b">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs uppercase">
              {notice.category}
            </Badge>
            {notice.isUrgent && (
              <Badge variant="destructive" className="text-xs">
                Urgent Circular
              </Badge>
            )}
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Ref: <strong className="font-mono text-foreground">{notice.referenceNo}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => {
                onToggleRead(notice.id)
                toast.success(isRead ? 'Marked as unread' : 'Marked as read')
              }}
            >
              {isRead ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Read</span>
                </>
              ) : (
                <>
                  <Circle className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span>Mark Read</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={handlePrint}
              title="Print Circular"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs text-primary font-medium"
              onClick={handleSimulatedPdfDownload}
              title="Download memo as document"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Save Memo</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleShare}
              title="Share Link"
            >
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Authentic BUBT Letterhead Circular Memo Body */}
        <div ref={printAreaRef} className="p-6 md:p-10 space-y-6 bg-card text-foreground">
          {/* University Letterhead */}
          <div className="text-center space-y-2 border-b-2 border-primary/20 pb-5">
            <div className="flex justify-center items-center gap-3">
              <div className="w-14 h-14 relative shrink-0">
                <Image
                  src="/images/bubt-logo.png"
                  alt="BUBT Logo"
                  width={56}
                  height={56}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-left">
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-primary uppercase">
                  Bangladesh University of Business and Technology
                </h2>
                <p className="text-xs font-serif italic text-muted-foreground">
                  জ্ঞানই শক্তি — Knowledge is Power
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Permanent Campus: Rupnagar, Mirpur-2, Dhaka-1216 | Web: www.bubt.edu.bd
                </p>
              </div>
            </div>
          </div>

          {/* Reference & Date strip */}
          <div className="flex flex-wrap items-center justify-between text-xs font-medium border-b border-border/60 pb-3 gap-2">
            <div>
              <span className="text-muted-foreground">Memo No: </span>
              <span className="font-mono font-bold text-foreground bg-muted/70 px-2 py-0.5 rounded">
                {notice.referenceNo}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Date: </span>
              <span className="font-semibold text-foreground">{formattedDate}</span>
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Official University Circular
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground underline decoration-primary/40 underline-offset-4">
              SUBJECT: {notice.title.toUpperCase()}
            </h1>
          </div>

          {/* Main Notice Body */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 whitespace-pre-line leading-relaxed text-sm md:text-base py-2">
            {notice.content}
          </div>

          {/* Attached Files Strip (if any) */}
          {notice.attachmentName && (
            <div className="p-3.5 rounded-lg border border-border/80 bg-muted/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-md bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">{notice.attachmentName}</p>
                  <p className="text-xs text-muted-foreground">Official Attachment ({notice.attachmentSize || 'Document'})</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 shrink-0"
                onClick={handleSimulatedPdfDownload}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </Button>
            </div>
          )}

          {/* Signoff / Authority Seal */}
          <div className="pt-8 flex flex-col items-end text-right">
            <div className="space-y-1 text-center min-w-[220px]">
              <div className="inline-flex items-center justify-center p-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs gap-1.5 mb-2 font-mono">
                <ShieldCheck className="h-4 w-4" />
                <span>Digitally Authenticated</span>
              </div>
              <p className="font-bold text-base text-foreground">{notice.authorName}</p>
              <p className="text-xs font-medium text-muted-foreground">{notice.issuingAuthority}</p>
              <p className="text-xs text-muted-foreground">Bangladesh University of Business and Technology</p>
            </div>
          </div>

          {/* Formal CC Distribution List */}
          <div className="pt-6 border-t border-dashed border-border/80 text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground/80">Copy forwarded for information & necessary action to:</p>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>PS to Vice Chancellor, BUBT (for kind information of the Honorable VC)</li>
              <li>Treasurer, BUBT</li>
              <li>Deans of all Faculties (Engineering & Applied Sciences, Business, Arts & Humanities, Law)</li>
              <li>Chairpersons of all Academic Departments</li>
              <li>Controller of Examinations & Registrar Office</li>
              <li>Proctor & Student Affairs Office</li>
              <li>Notice Board & BUBT Connect Digital Community Network</li>
              <li>Office Guard File</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
