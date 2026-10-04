export interface OfficialNotice {
  id: string
  title: string
  content: string
  category: 'academic' | 'exam' | 'fees' | 'scholarship' | 'urgent' | 'administrative'
  authorName: string
  authorRole: string
  issuingAuthority: string
  targetDepartments: string[] // 'all' or department IDs
  targetBatches?: string[]
  isPinned: boolean
  isUrgent: boolean
  publishedAt: string
  expiresAt?: string
  attachmentUrl?: string
  attachmentName?: string
  attachmentSize?: string
  referenceNo: string
}

export interface RoutineSlot {
  id: string
  day: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday'
  timeSlot: string // e.g. "08:30 AM - 10:00 AM"
  courseCode: string
  courseTitle: string
  roomNo: string
  building: string
  facultyInitial: string
  facultyName: string
  departmentCode: string
  batchNo: string
}

export interface ExamRoutineItem {
  id: string
  examDate: string
  day: string
  time: string
  courseCode: string
  courseTitle: string
  departmentCode: string
  batchNo: string
  roomAllocation: string
  invigilatorInitials: string
}

export const INITIAL_NOTICES: OfficialNotice[] = [
  {
    id: 'not-01',
    title: 'Urgent: Midterm Examination Schedule & Admit Card Issuance — Fall 2026',
    content: `All students of undergraduate and postgraduate programs are hereby informed that the Midterm Examinations of Fall Semester 2026 will commence from October 10, 2026.\n\nKey Directives:\n1. Students must clear at least 50% of the semester tuition fees before October 05, 2026 to download the digital Admit Card via BUBT Annex portal.\n2. No student will be allowed to sit for examinations without a verified student ID card and printed Admit Card.\n3. Detailed room-wise seat plans and course routines are published in the Routine Hub.`,
    category: 'exam',
    authorName: 'Controller of Examinations',
    authorRole: 'authority',
    issuingAuthority: 'Office of the Controller of Examinations',
    targetDepartments: ['all'],
    isPinned: true,
    isUrgent: true,
    publishedAt: '2026-09-28T09:00:00Z',
    expiresAt: '2026-10-25T23:59:59Z',
    attachmentUrl: 'https://www.bubt.edu.bd/storage/uploads/routines/exam-routine-fall2026.pdf',
    attachmentName: 'Midterm_Exam_Routine_Fall2026.pdf',
    attachmentSize: '480 KB',
    referenceNo: 'BUBT/COE/F26/CIR-104',
  },
  {
    id: 'not-02',
    title: 'Vice-Chancellor Special Academic Merit Scholarship Application Open',
    content: `Applications are invited from meritorious regular students who obtained a SGPA of 3.85 or higher in the Spring 2026 semester for the Vice-Chancellor Special Academic Merit Scholarship (up to 100% tuition waiver).\n\nEligibility:\n- Minimum 12 credits completed in the previous semester without any retake/incomplete.\n- Clean proctorial disciplinary record.\n- Completed applications must be submitted through the scholarship form before October 15, 2026.`,
    category: 'scholarship',
    authorName: 'Registrar Office',
    authorRole: 'authority',
    issuingAuthority: 'Office of the Registrar',
    targetDepartments: ['all'],
    isPinned: true,
    isUrgent: false,
    publishedAt: '2026-09-26T11:30:00Z',
    expiresAt: '2026-10-15T23:59:59Z',
    attachmentUrl: 'https://www.bubt.edu.bd/storage/uploads/scholarship/scholarship-form-2026.pdf',
    attachmentName: 'VC_Scholarship_Application_Form.pdf',
    attachmentSize: '320 KB',
    referenceNo: 'BUBT/REG/SCH/2026-42',
  },
  {
    id: 'not-03',
    title: 'Department of CSE: Capstone Project Proposal Submission & Supervisor Allocation',
    content: `All final-year students (CSE 49th and 50th Intake) must submit their Capstone Project Phase-I proposals online by October 08, 2026.\n\nProject domains must be selected from:\n- Artificial Intelligence & Machine Learning\n- Cloud Systems, DevOps & Distributed Computing\n- Cyber Security & Cryptography\n- Computer Vision & Robotics\n\nLate submissions will not be assigned faculty supervisors for the current semester.`,
    category: 'academic',
    authorName: 'Dept Chair (CSE)',
    authorRole: 'faculty',
    issuingAuthority: 'Department of Computer Science & Engineering',
    targetDepartments: ['dept-cse'],
    isPinned: false,
    isUrgent: false,
    publishedAt: '2026-09-27T14:15:00Z',
    referenceNo: 'BUBT/CSE/PROJ/26-09',
  },
  {
    id: 'not-04',
    title: 'Extension of Semester Registration & Course Add/Drop Period Without Fine',
    content: `Upon recommendation of the Academic Council, the deadline for course registration and Add/Drop for Fall 2026 has been extended until October 02, 2026 without any delay surcharge.\n\nStudents experiencing prerequisite credit locks or section capacity overflows are requested to contact their respective department academic coordinators.`,
    category: 'fees',
    authorName: 'Accounts & Finance',
    authorRole: 'authority',
    issuingAuthority: 'Office of Accounts & Finance',
    targetDepartments: ['all'],
    isPinned: false,
    isUrgent: false,
    publishedAt: '2026-09-25T16:00:00Z',
    referenceNo: 'BUBT/ACC/F26/REG-08',
  },
  {
    id: 'not-05',
    title: 'Campus Shuttle Bus Route & Schedule Adjustment (Mirpur-Uttara-Gazipur)',
    content: `Please note that starting Sunday, October 01, 2026, Transport Route 3 (BUBT Main Campus ➔ Uttara House Building ➔ Gazipur Chowrasta) will operate with 2 additional AC shuttle buses.\n\nMorning departure from Gazipur: 06:45 AM.\nEvening departure from BUBT Main Gate: 05:15 PM and 06:30 PM.`,
    category: 'administrative',
    authorName: 'Transport Section',
    authorRole: 'authority',
    issuingAuthority: 'Campus Estate & Transport Directorate',
    targetDepartments: ['all'],
    isPinned: false,
    isUrgent: false,
    publishedAt: '2026-09-24T10:00:00Z',
    referenceNo: 'BUBT/TRP/2026-19',
  },
]

export const CLASS_ROUTINE_DATA: RoutineSlot[] = [
  // Saturday
  {
    id: 'cr-1',
    day: 'Saturday',
    timeSlot: '08:30 AM - 10:00 AM',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    roomNo: 'Room 502',
    building: 'Building 2',
    facultyInitial: 'MMR',
    facultyName: 'Dr. M. M. Rahman',
    departmentCode: 'CSE',
    batchNo: '50th',
  },
  {
    id: 'cr-2',
    day: 'Saturday',
    timeSlot: '10:00 AM - 11:30 AM',
    courseCode: 'CSE 312',
    courseTitle: 'Database Systems Lab',
    roomNo: 'Lab 501',
    building: 'Building 2',
    facultyInitial: 'MMR / TAS',
    facultyName: 'Dr. M. M. Rahman / Tanvir Sir',
    departmentCode: 'CSE',
    batchNo: '50th',
  },
  {
    id: 'cr-3',
    day: 'Saturday',
    timeSlot: '11:30 AM - 01:00 PM',
    courseCode: 'MAT 205',
    courseTitle: 'Linear Algebra & Complex Variables',
    roomNo: 'Room 403',
    building: 'Building 1',
    facultyInitial: 'KAZ',
    facultyName: 'Prof. K. A. Zaman',
    departmentCode: 'CSE',
    batchNo: '50th',
  },
  // Sunday
  {
    id: 'cr-4',
    day: 'Sunday',
    timeSlot: '10:00 AM - 11:30 AM',
    courseCode: 'CSE 323',
    courseTitle: 'Operating Systems & Architecture',
    roomNo: 'Room 504',
    building: 'Building 2',
    facultyInitial: 'FHM',
    facultyName: 'Dr. Farhana M.',
    departmentCode: 'CSE',
    batchNo: '50th',
  },
  {
    id: 'cr-5',
    day: 'Sunday',
    timeSlot: '01:30 PM - 03:00 PM',
    courseCode: 'CSE 324',
    courseTitle: 'Operating Systems Lab (Linux/C)',
    roomNo: 'Lab 402',
    building: 'Building 2',
    facultyInitial: 'FHM',
    facultyName: 'Dr. Farhana M.',
    departmentCode: 'CSE',
    batchNo: '50th',
  },
  // Monday
  {
    id: 'cr-6',
    day: 'Monday',
    timeSlot: '08:30 AM - 10:00 AM',
    courseCode: 'CSE 315',
    courseTitle: 'Software Engineering & Agile Methodologies',
    roomNo: 'Room 601',
    building: 'Building 2',
    facultyInitial: 'SBN',
    facultyName: 'Sabina Yasmin',
    departmentCode: 'CSE',
    batchNo: '50th',
  },
  {
    id: 'cr-7',
    day: 'Monday',
    timeSlot: '10:00 AM - 11:30 AM',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems (Tutorial)',
    roomNo: 'Room 502',
    building: 'Building 2',
    facultyInitial: 'MMR',
    facultyName: 'Dr. M. M. Rahman',
    departmentCode: 'CSE',
    batchNo: '50th',
  },
  // Tuesday
  {
    id: 'cr-8',
    day: 'Tuesday',
    timeSlot: '11:30 AM - 01:00 PM',
    courseCode: 'EEE 101',
    courseTitle: 'Basic Electrical Circuit Analysis',
    roomNo: 'Room 302',
    building: 'Building 1',
    facultyInitial: 'RAK',
    facultyName: 'Engr. R. A. Khan',
    departmentCode: 'EEE',
    batchNo: '50th',
  },
  // Wednesday
  {
    id: 'cr-9',
    day: 'Wednesday',
    timeSlot: '10:00 AM - 11:30 AM',
    courseCode: 'CSE 323',
    courseTitle: 'Operating Systems (Review & Concurrency)',
    roomNo: 'Room 504',
    building: 'Building 2',
    facultyInitial: 'FHM',
    facultyName: 'Dr. Farhana M.',
    departmentCode: 'CSE',
    batchNo: '50th',
  },
]

export const EXAM_ROUTINE_DATA: ExamRoutineItem[] = [
  {
    id: 'ex-1',
    examDate: '2026-10-10',
    day: 'Saturday',
    time: '10:00 AM - 12:00 PM',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    departmentCode: 'CSE',
    batchNo: '50th',
    roomAllocation: 'Building 2, Rooms 501, 502, 504',
    invigilatorInitials: 'MMR, SBN, TAS',
  },
  {
    id: 'ex-2',
    examDate: '2026-10-13',
    day: 'Tuesday',
    time: '10:00 AM - 12:00 PM',
    courseCode: 'CSE 323',
    courseTitle: 'Operating Systems & Concurrency',
    departmentCode: 'CSE',
    batchNo: '50th',
    roomAllocation: 'Building 2, Rooms 401, 402, 502',
    invigilatorInitials: 'FHM, KAZ',
  },
  {
    id: 'ex-3',
    examDate: '2026-10-16',
    day: 'Friday',
    time: '02:30 PM - 04:30 PM',
    courseCode: 'MAT 205',
    courseTitle: 'Linear Algebra & Complex Variables',
    departmentCode: 'CSE',
    batchNo: '50th',
    roomAllocation: 'Building 1, Auditorium & Room 301',
    invigilatorInitials: 'Prof. K. A. Zaman',
  },
  {
    id: 'ex-4',
    examDate: '2026-10-19',
    day: 'Monday',
    time: '10:00 AM - 12:00 PM',
    courseCode: 'CSE 315',
    courseTitle: 'Software Engineering & Design Patterns',
    departmentCode: 'CSE',
    batchNo: '50th',
    roomAllocation: 'Building 2, Rooms 601, 602',
    invigilatorInitials: 'Sabina Yasmin',
  },
]
