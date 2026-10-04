'use client'

import { useState, useMemo } from 'react'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Search, 
  Printer, 
  Download, 
  BookOpen, 
  AlertCircle, 
  Sparkles,
  Filter,
  CheckCircle2,
  CalendarDays
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RoutineSlot, ExamRoutineItem } from '@/lib/notices-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface RoutineHubProps {
  classRoutines: RoutineSlot[]
  examRoutines: ExamRoutineItem[]
}

const DAYS = ['All', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] as const

export function RoutineHub({ classRoutines, examRoutines }: RoutineHubProps) {
  const [activeTab, setActiveTab] = useState<'class' | 'exam'>('class')
  const [selectedDay, setSelectedDay] = useState<string>('All')
  const [selectedDept, setSelectedDept] = useState<string>('All')
  const [selectedBatch, setSelectedBatch] = useState<string>('50th')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter class routine
  const filteredClassRoutines = useMemo(() => {
    return classRoutines.filter((slot) => {
      const matchDay = selectedDay === 'All' || slot.day.toLowerCase() === selectedDay.toLowerCase()
      const matchDept = selectedDept === 'All' || slot.departmentCode.toLowerCase() === selectedDept.toLowerCase()
      const matchBatch = selectedBatch === 'All' || slot.batchNo.toLowerCase().includes(selectedBatch.toLowerCase())
      const matchSearch =
        !searchQuery.trim() ||
        slot.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slot.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slot.roomNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slot.facultyInitial.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slot.facultyName.toLowerCase().includes(searchQuery.toLowerCase())

      return matchDay && matchDept && matchBatch && matchSearch
    })
  }, [classRoutines, selectedDay, selectedDept, selectedBatch, searchQuery])

  // Filter exam routine
  const filteredExamRoutines = useMemo(() => {
    return examRoutines.filter((ex) => {
      const matchDept = selectedDept === 'All' || ex.departmentCode.toLowerCase() === selectedDept.toLowerCase()
      const matchSearch =
        !searchQuery.trim() ||
        ex.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.roomAllocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.invigilatorInitials.toLowerCase().includes(searchQuery.toLowerCase())

      return matchDept && matchSearch
    })
  }, [examRoutines, selectedDept, searchQuery])

  const handlePrintRoutine = () => {
    window.print()
  }

  const handleDownloadTimetable = () => {
    let content = ''
    if (activeTab === 'class') {
      content = `BUBT CLASS ROUTINE - FALL 2026\nDepartment: ${selectedDept} | Intake: ${selectedBatch} | Generated from BUBT Connect\n\n`
      filteredClassRoutines.forEach((r) => {
        content += `[${r.day}] ${r.timeSlot} | ${r.courseCode}: ${r.courseTitle} | ${r.roomNo} (${r.building}) | Faculty: ${r.facultyInitial} (${r.facultyName})\n`
      })
    } else {
      content = `BUBT MIDTERM EXAMINATION SCHEDULE - FALL 2026\nDepartment: ${selectedDept} | Generated from BUBT Connect\n\n`
      filteredExamRoutines.forEach((e) => {
        content += `${e.examDate} (${e.day}) | ${e.time} | ${e.courseCode}: ${e.courseTitle} | Rooms: ${e.roomAllocation} | Invigilators: ${e.invigilatorInitials}\n`
      })
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `BUBT_${activeTab === 'class' ? 'Class_Routine' : 'Exam_Schedule'}_Fall2026.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Routine schedule downloaded!')
  }

  return (
    <div className="space-y-6">
      {/* View Switcher: Class Timetable vs Exam Routine */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-muted/40 p-1.5 rounded-xl border border-border">
        <div className="grid grid-cols-2 gap-1 w-full sm:w-auto">
          <Button
            type="button"
            variant={activeTab === 'class' ? 'default' : 'ghost'}
            className={cn(
              "h-10 text-xs sm:text-sm font-medium rounded-lg gap-2",
              activeTab === 'class' && "shadow-sm"
            )}
            onClick={() => setActiveTab('class')}
          >
            <Clock className="h-4 w-4" />
            Class Timetable
          </Button>

          <Button
            type="button"
            variant={activeTab === 'exam' ? 'default' : 'ghost'}
            className={cn(
              "h-10 text-xs sm:text-sm font-medium rounded-lg gap-2",
              activeTab === 'exam' && "shadow-sm"
            )}
            onClick={() => setActiveTab('exam')}
          >
            <CalendarDays className="h-4 w-4" />
            Exam Schedules
          </Button>
        </div>

        <div className="flex items-center gap-2 px-1">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={handlePrintRoutine}
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Print Schedule</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs text-primary font-medium hover:bg-primary/5"
            onClick={handleDownloadTimetable}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* Exam Countdown & Notice Banner (when Exam tab is active) */}
      {activeTab === 'exam' && (
        <div className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">
                Midterm Examinations — Fall 2026 Commences in 11 Days
              </h4>
              <p className="text-xs text-muted-foreground">
                Seat plans are room-wise allocated. Please carry your original printed Admit Card and BUBT Student ID card.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs px-3 py-1">
            Exam Hall Rules Enforced
          </Badge>
        </div>
      )}

      {/* Filter Controls Strip */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === 'class' ? "Search course, faculty (e.g. MMR), or room..." : "Search course code, title, or room..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs sm:text-sm"
            />
          </div>

          {/* Department Filter */}
          <div>
            <Select value={selectedDept} onValueChange={(val) => { if (val) setSelectedDept(val) }}>
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Departments</SelectItem>
                <SelectItem value="CSE">Dept. of CSE</SelectItem>
                <SelectItem value="EEE">Dept. of EEE</SelectItem>
                <SelectItem value="BBA">Dept. of BBA</SelectItem>
                <SelectItem value="ENG">Dept. of English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Batch / Intake Filter (for class routine) */}
          {activeTab === 'class' ? (
            <div>
              <Select value={selectedBatch} onValueChange={(val) => { if (val) setSelectedBatch(val) }}>
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue placeholder="Intake / Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Batches</SelectItem>
                  <SelectItem value="50th">50th Intake (Current)</SelectItem>
                  <SelectItem value="49th">49th Intake</SelectItem>
                  <SelectItem value="48th">48th Intake</SelectItem>
                  <SelectItem value="51st">51st Intake</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex items-center justify-end">
              <span className="text-xs text-muted-foreground">
                Showing <strong className="text-foreground">{filteredExamRoutines.length}</strong> exam dates
              </span>
            </div>
          )}
        </div>

        {/* Days Filter Pills (Only for Class Timetable) */}
        {activeTab === 'class' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-muted-foreground font-medium mr-1 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Day:
            </span>
            {DAYS.map((day) => {
              const isSelected = selectedDay.toLowerCase() === day.toLowerCase()
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "px-3 py-1.5 rounded-full font-medium transition-all shrink-0 border",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Class Timetable Grid View */}
      {activeTab === 'class' && (
        <div className="space-y-4">
          {filteredClassRoutines.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-card space-y-2">
              <BookOpen className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
              <p className="text-sm font-medium">No class sessions match your selected filters</p>
              <p className="text-xs text-muted-foreground">Try clearing search or selecting "All Days"</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => {
                  setSelectedDay('All')
                  setSelectedDept('All')
                  setSelectedBatch('50th')
                  setSearchQuery('')
                }}
              >
                Reset Routine Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredClassRoutines.map((slot) => (
                <Card 
                  key={slot.id}
                  className="border transition-all hover:border-primary/50 hover:shadow-sm bg-card group"
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Header: Course Code & Day Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {slot.courseCode}
                        </span>
                        <Badge variant="outline" className="text-[11px] font-medium">
                          {slot.departmentCode} • {slot.batchNo}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-[11px] font-medium bg-muted">
                        {slot.day}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h4 className="font-semibold text-sm leading-snug text-foreground group-hover:text-primary transition-colors">
                      {slot.courseTitle}
                    </h4>

                    {/* Details: Time, Room, Faculty */}
                    <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-medium text-foreground">{slot.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span>{slot.roomNo} <span className="opacity-70">({slot.building})</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>
                          <strong className="text-foreground">{slot.facultyInitial}</strong> — {slot.facultyName}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Exam Timetable List View */}
      {activeTab === 'exam' && (
        <div className="space-y-3">
          {filteredExamRoutines.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-card space-y-2">
              <CalendarDays className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
              <p className="text-sm font-medium">No exam schedules found</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => {
                  setSelectedDept('All')
                  setSearchQuery('')
                }}
              >
                Reset Exam Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExamRoutines.map((exam) => (
                <Card key={exam.id} className="border hover:border-purple-500/40 transition-all bg-card shadow-xs">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded">
                          {exam.courseCode}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {exam.departmentCode} • {exam.batchNo}
                        </Badge>
                      </div>
                      <span className="text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {exam.examDate}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-base text-foreground leading-snug">
                        {exam.courseTitle}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {exam.day}, {exam.time}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-muted/40 text-xs space-y-1.5 border border-border/60">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-foreground">Room Allocation: </span>
                          <span className="text-muted-foreground">{exam.roomAllocation}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <User className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-foreground">Invigilator(s): </span>
                          <span className="text-muted-foreground">{exam.invigilatorInitials}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
