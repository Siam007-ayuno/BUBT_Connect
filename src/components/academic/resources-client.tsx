'use client'

import { useState, useMemo } from 'react'
import {
  BookOpen,
  Download,
  ThumbsUp,
  Search,
  PlusCircle,
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAcademicStore } from '@/lib/academic-store'
import { AcademicResource } from '@/lib/academic-data'
import { UploadResourceModal } from '@/components/academic/upload-resource-modal'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ResourcesClientProps {
  userRole?: string
  userName?: string
}

const TYPE_FILTERS = [
  { id: 'all', label: 'All Resources' },
  { id: 'question_bank', label: 'Past Questions & Solved' },
  { id: 'lecture_notes', label: 'Lecture Slides' },
  { id: 'lab_manual', label: 'Lab Codes & Manuals' },
  { id: 'handout', label: 'Cheat Sheets & Handouts' },
]

export function ResourcesClient({ userRole = 'student', userName = 'Student' }: ResourcesClientProps) {
  const {
    resources,
    upvotedResourceIds,
    toggleUpvoteResource,
    downloadResource,
    uploadResource,
  } = useAcademicStore()

  const [selectedType, setSelectedType] = useState('all')
  const [selectedDept, setSelectedDept] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchType = selectedType === 'all' || res.type === selectedType
      const matchDept = selectedDept === 'all' || res.department.toLowerCase() === selectedDept.toLowerCase()
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        res.title.toLowerCase().includes(q) ||
        res.courseCode.toLowerCase().includes(q) ||
        res.courseTitle.toLowerCase().includes(q) ||
        (res.description && res.description.toLowerCase().includes(q)) ||
        res.authorName.toLowerCase().includes(q)

      return matchType && matchDept && matchSearch
    })
  }, [resources, selectedType, selectedDept, searchQuery])

  const typeConfig: Record<string, { label: string; color: string }> = {
    question_bank: { label: 'Question Bank', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
    lecture_notes: { label: 'Lecture Slides', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    lab_manual: { label: 'Lab Manual', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    handout: { label: 'Cheat Sheet', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    reference_book: { label: 'Reference Book', color: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20' },
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-cyan-500/10 border border-indigo-500/20 p-5 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  BUBT Academic Resources & Question Bank
                </h1>
                <Badge variant="outline" className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
                  {resources.length} Verified Materials
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Past semester exam questions, faculty lecture slides, lab manuals, and peer study notes.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            className="h-9 gap-1.5 text-xs font-semibold shadow-xs"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Upload Resource</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by course code (e.g. CSE 311), title, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs sm:text-sm"
            />
          </div>

          <div>
            <Select value={selectedDept} onValueChange={(val) => val && setSelectedDept(val)}>
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="cse">Dept. of CSE</SelectItem>
                <SelectItem value="eee">Dept. of EEE</SelectItem>
                <SelectItem value="bba">Faculty of Business</SelectItem>
                <SelectItem value="english">Dept. of English</SelectItem>
                <SelectItem value="law">Dept. of Law</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {TYPE_FILTERS.map((tf) => {
            const isSelected = selectedType === tf.id
            return (
              <button
                key={tf.id}
                type="button"
                onClick={() => setSelectedType(tf.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full font-medium transition-all shrink-0 border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {tf.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Resources Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card space-y-3">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
          <p className="text-base font-semibold text-foreground">No study resources match your search</p>
          <Button
            variant="outline"
            size="sm"
            className="text-xs mt-2"
            onClick={() => {
              setSelectedType('all')
              setSelectedDept('all')
              setSearchQuery('')
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((res) => {
            const isUpvoted = upvotedResourceIds.has(res.id)
            const badgeMeta = typeConfig[res.type] || typeConfig.handout

            return (
              <Card
                key={res.id}
                className="border hover:border-primary/40 transition-all bg-card flex flex-col justify-between shadow-xs"
              >
                <CardContent className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {res.courseCode}
                        </span>
                        <Badge variant="outline" className={cn("text-[10px] font-medium", badgeMeta.color)}>
                          {badgeMeta.label}
                        </Badge>
                      </div>

                      <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {res.fileFormat} • {res.fileSize}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-bold text-base text-foreground leading-snug">
                        {res.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {res.courseTitle} • {res.semesterLevel}
                      </p>
                    </div>

                    {/* Description if present */}
                    {res.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {res.description}
                      </p>
                    )}

                    {/* Contributor metadata */}
                    <div className="text-xs text-muted-foreground pt-1 flex items-center justify-between">
                      <span>Shared by: <strong className="text-foreground">{res.authorName}</strong></span>
                      <span className="text-[11px]">{res.uploadDate}</span>
                    </div>
                  </div>

                  {/* Actions: Upvotes & Download */}
                  <div className="pt-3 border-t flex items-center justify-between gap-3 mt-2">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Button
                        type="button"
                        variant={isUpvoted ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "h-8 gap-1.5 text-xs",
                          isUpvoted && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => {
                          toggleUpvoteResource(res.id)
                          toast.success(isUpvoted ? 'Upvote removed' : 'Resource upvoted!')
                        }}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{res.upvotes}</span>
                      </Button>

                      <span className="text-[11px] hidden sm:inline">
                        {res.downloadCount} downloads
                      </span>
                    </div>

                    <Button
                      size="sm"
                      className="h-8 gap-1.5 text-xs font-semibold"
                      onClick={() => {
                        downloadResource(res)
                        toast.success(`Downloading ${res.courseCode} ${badgeMeta.label}...`)
                      }}
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download File</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Upload Modal */}
      <UploadResourceModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={uploadResource}
        userRole={userRole}
        userName={userName}
      />
    </div>
  )
}
