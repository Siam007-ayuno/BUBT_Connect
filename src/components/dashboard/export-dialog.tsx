'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, Printer, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { ExtendedPost } from '@/lib/demo-data'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  posts: ExtendedPost[]
}

export function ExportDialog({ isOpen, onClose, posts }: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleDownloadCSV = () => {
    setIsExporting(true)

    // Build CSV content
    const headers = [
      'Issue ID',
      'Title',
      'Type',
      'Category',
      'Author',
      'Department',
      'Status',
      'Upvotes',
      'Escalated',
      'Created At',
      'Has Official Response',
    ]

    const rows = posts.map((p) => [
      `"${p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.type}"`,
      `"${p.category?.name_en || 'General'}"`,
      `"${p.is_anonymous ? 'Anonymous Student' : (p.author?.full_name || 'Member')}"`,
      `"${p.department?.code || 'Campus-wide'}"`,
      `"${p.status}"`,
      p.upvote_count,
      p.is_escalated ? 'YES' : 'NO',
      `"${new Date(p.created_at).toLocaleDateString()}"`,
      p.official_response ? 'YES' : 'NO',
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `bubt_community_issues_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      setIsExporting(false)
      toast.success('CSV report downloaded successfully!')
      onClose()
    }, 400)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <FileSpreadsheet className="h-5 w-5" />
            <DialogTitle>Export Authority Meeting Report</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Generate an official summary of all active, in-progress, and resolved community issues for the BUBT Academic Council or Proctorial Board.
          </DialogDescription>
        </DialogHeader>

        <div className="p-3.5 rounded-xl border bg-muted/30 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total records included:</span>
            <span className="font-bold text-foreground">{posts.length} issues</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Escalated items:</span>
            <span className="font-bold text-red-600 dark:text-red-400">
              {posts.filter((p) => p.is_escalated).length} issues
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Format:</span>
            <span className="font-bold text-foreground">Standard CSV (Excel / Google Sheets)</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleDownloadCSV}
            disabled={isExporting}
            className="font-bold gap-1.5"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Generating...' : 'Download CSV'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
