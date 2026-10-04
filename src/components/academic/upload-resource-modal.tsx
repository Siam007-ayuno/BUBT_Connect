'use client'

import { useState, useRef } from 'react'
import {
  Upload,
  FileText,
  FileArchive,
  FileCode,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  CloudUpload,
  Send,
  BookOpen
} from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AcademicResource } from '@/lib/academic-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface UploadResourceModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (res: Omit<AcademicResource, 'id' | 'downloadCount' | 'upvotes' | 'uploadDate'>) => void
  userRole?: string
  userName?: string
}

const DEPARTMENTS = [
  { code: 'CSE', label: 'Computer Science & Engineering (CSE)' },
  { code: 'EEE', label: 'Electrical & Electronic Engineering (EEE)' },
  { code: 'BBA', label: 'Business Administration (BBA)' },
  { code: 'English', label: 'Department of English' },
  { code: 'Law', label: 'Faculty of Law & Justice' },
  { code: 'Economics', label: 'Department of Economics' },
  { code: 'Civil', label: 'Civil Engineering (CE)' },
  { code: 'Textile', label: 'Textile Engineering (TE)' },
]

const SEMESTER_LEVELS = [
  '1st Year (L1T1)',
  '1st Year (L1T2)',
  '2nd Year (L2T1)',
  '2nd Year (L2T2)',
  '3rd Year (L3T1)',
  '3rd Year (L3T2)',
  '4th Year (L4T1)',
  '4th Year (L4T2)',
  'Graduate / All Semesters',
]

const RESOURCE_TYPES = [
  { id: 'question_bank', label: '📑 Past Question Bank & Solved Papers' },
  { id: 'lecture_notes', label: '🖥️ Lecture Slides & Presentations' },
  { id: 'lab_manual', label: '💻 Lab Manuals & Source Codes' },
  { id: 'handout', label: '📝 Handouts & Study Cheat Sheets' },
  { id: 'reference_book', label: '📚 Reference Book & Formula Guides' },
]

export function UploadResourceModal({
  isOpen,
  onClose,
  onUpload,
  userRole = 'student',
  userName = 'Student',
}: UploadResourceModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileSizeStr, setFileSizeStr] = useState('3.2 MB')
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [title, setTitle] = useState('')
  const [courseCode, setCourseCode] = useState('CSE 311')
  const [courseTitle, setCourseTitle] = useState('Database Management Systems')
  const [department, setDepartment] = useState('CSE')
  const [semesterLevel, setSemesterLevel] = useState('3rd Year (L3T1)')
  const [type, setType] = useState<AcademicResource['type']>('question_bank')
  const [fileFormat, setFileFormat] = useState<AcademicResource['fileFormat']>('PDF')
  const [description, setDescription] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Format file size helper
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 KB'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Handle selected file
  const handleFile = (file: File) => {
    setSelectedFile(file)
    const formattedSize = formatBytes(file.size)
    setFileSizeStr(formattedSize)

    // Detect format from extension
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (ext === 'pdf') {
      setFileFormat('PDF')
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      setFileFormat('ZIP')
    } else if (['docx', 'doc', 'odt', 'rtf'].includes(ext)) {
      setFileFormat('DOCX')
    } else if (['pptx', 'ppt'].includes(ext)) {
      setFileFormat('PPTX')
    } else {
      setFileFormat('PDF')
    }

    // Auto-populate title if empty
    if (!title.trim()) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]+/g, ' ')
        .trim()
      setTitle(cleanName)
    }

    toast.success(`Selected file: ${file.name} (${formattedSize})`)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Icon for selected file
  const getFileIcon = (format: string) => {
    switch (format) {
      case 'PDF':
        return <FileText className="h-8 w-8 text-rose-500" />
      case 'ZIP':
        return <FileArchive className="h-8 w-8 text-amber-500" />
      case 'DOCX':
        return <File className="h-8 w-8 text-blue-500" />
      case 'PPTX':
        return <FileCode className="h-8 w-8 text-orange-500" />
      default:
        return <FileText className="h-8 w-8 text-primary" />
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast.error('Please select or drag & drop an academic file to upload')
      return
    }

    if (!title.trim() || !courseCode.trim()) {
      toast.error('Please enter the resource title and course code')
      return
    }

    setIsUploading(true)
    setUploadProgress(20)

    const timer1 = setTimeout(() => setUploadProgress(65), 300)
    const timer2 = setTimeout(() => {
      setUploadProgress(100)
      
      const downloadUrl = selectedFile ? URL.createObjectURL(selectedFile) : '#'

      onUpload({
        title: title.trim(),
        courseCode: courseCode.trim().toUpperCase(),
        courseTitle: courseTitle.trim() || courseCode.trim(),
        department,
        semesterLevel,
        type,
        authorName: userName,
        authorRole: userRole,
        fileSize: fileSizeStr,
        fileFormat,
        downloadUrl,
        description: description.trim(),
      })

      setIsUploading(false)
      toast.success('Resource published to BUBT Study Hub!')
      
      // Reset
      setSelectedFile(null)
      setTitle('')
      setDescription('')
      setUploadProgress(0)
      onClose()
    }, 700)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isUploading && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-6">
        <DialogHeader className="pb-3 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight">Upload Academic Resource</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Share past question banks, lecture slides, lab manuals, and study notes with BUBT students.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* 1. Drag & Drop File Picker Zone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold flex items-center justify-between">
              <span>Select File to Upload <span className="text-destructive">*</span></span>
              {selectedFile && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> File Ready ({fileSizeStr})
                </span>
              )}
            </Label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0])
                }
              }}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.7z,.txt"
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group',
                  isDragging
                    ? 'border-primary bg-primary/10 scale-[1.01]'
                    : 'border-border/80 hover:border-primary/60 hover:bg-muted/40 bg-muted/10'
                )}
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CloudUpload className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    <span className="text-primary underline underline-offset-2">Click to browse file</span> or drag and drop here
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Supports PDF, DOCX, PPTX, ZIP, or RAR (Max 50 MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-xs">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-card border shadow-xs shrink-0">
                    {getFileIcon(fileFormat)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-foreground truncate max-w-xs sm:max-w-md">
                      {selectedFile.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span>{fileSizeStr}</span>
                      <span>•</span>
                      <span className="font-semibold text-primary">{fileFormat} Format</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-medium">Ready to upload</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 text-xs cursor-pointer"
                  >
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Resource Title */}
          <div className="space-y-1.5">
            <Label htmlFor="res-title" className="text-xs font-semibold">
              Resource Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="res-title"
              placeholder="e.g. CSE 311 Midterm & Final Solved Question Bank (2024-2025)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-9.5 text-xs"
            />
          </div>

          {/* 3. Course Details (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="res-course" className="text-xs font-semibold">
                Course Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="res-course"
                placeholder="e.g. CSE 311"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
                className="h-9.5 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="res-name" className="text-xs font-semibold">Course Name</Label>
              <Input
                id="res-name"
                placeholder="e.g. Database Management Systems"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="h-9.5 text-xs"
              />
            </div>
          </div>

          {/* 4. Academic Classification (2 columns, spacious) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Department</Label>
              <Select value={department} onValueChange={(val) => val && setDepartment(val)}>
                <SelectTrigger className="h-9.5 text-xs w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="w-64">
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept.code} value={dept.code} className="text-xs">
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Semester / Level</Label>
              <Select value={semesterLevel} onValueChange={(val) => val && setSemesterLevel(val)}>
                <SelectTrigger className="h-9.5 text-xs w-full">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent className="w-56">
                  {SEMESTER_LEVELS.map((level) => (
                    <SelectItem key={level} value={level} className="text-xs">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 5. Resource Type & Detected File Format (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Resource Category</Label>
              <Select value={type} onValueChange={(val: any) => val && setType(val)}>
                <SelectTrigger className="h-9.5 text-xs w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="w-72">
                  {RESOURCE_TYPES.map((rt) => (
                    <SelectItem key={rt.id} value={rt.id} className="text-xs">
                      {rt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center justify-between">
                <span>File Format</span>
                <span className="text-[10px] text-muted-foreground font-normal">Auto-detected</span>
              </Label>
              <Select value={fileFormat} onValueChange={(val: any) => val && setFileFormat(val)}>
                <SelectTrigger className="h-9.5 text-xs w-full">
                  <SelectValue placeholder="File Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF" className="text-xs">PDF Document (.pdf)</SelectItem>
                  <SelectItem value="ZIP" className="text-xs">ZIP Archive (.zip, .rar)</SelectItem>
                  <SelectItem value="DOCX" className="text-xs">Word Document (.docx)</SelectItem>
                  <SelectItem value="PPTX" className="text-xs">PowerPoint Presentation (.pptx)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 6. Summary / Description */}
          <div className="space-y-1.5">
            <Label htmlFor="res-desc" className="text-xs font-semibold">
              Description & Topics Covered <span className="text-[11px] font-normal text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="res-desc"
              rows={3}
              placeholder="e.g. Contains solutions for Spring 2024 and Fall 2024 midterms, normalization questions, SQL queries, and ER diagrams..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs resize-none"
            />
          </div>

          {/* Upload Progress Bar if submitting */}
          {isUploading && (
            <div className="space-y-1.5 p-3 rounded-lg border bg-muted/40">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5 text-primary">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Uploading resource to BUBT Study Cloud...
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 border-t mt-4 flex items-center justify-between sm:justify-between">
            <div className="text-[11px] text-muted-foreground hidden sm:block">
              Published under BUBT Academic Sharing Policy
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="gap-1.5 font-bold shadow-xs cursor-pointer"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Upload Resource
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
