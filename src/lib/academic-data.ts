export interface AcademicResource {
  id: string
  title: string
  courseCode: string
  courseTitle: string
  department: string
  semesterLevel: string // e.g., '3rd Year (L3T1)'
  type: 'question_bank' | 'lecture_notes' | 'lab_manual' | 'handout' | 'reference_book'
  authorName: string
  authorRole: string
  fileSize: string
  fileFormat: 'PDF' | 'ZIP' | 'DOCX' | 'PPTX'
  downloadCount: number
  upvotes: number
  uploadDate: string
  downloadUrl?: string
  description?: string
}

export interface AlumniProfile {
  id: string
  fullName: string
  avatarUrl?: string
  department: string
  intake: string
  graduatingYear: number
  currentCompany: string
  companyLogo?: string
  currentRole: string
  location: string
  linkedinUrl?: string
  githubUrl?: string
  isAvailableForMentorship: boolean
  mentorshipTopics: string[]
  bio: string
}

export interface JobPosting {
  id: string
  title: string
  company: string
  companyLocation: string
  jobType: 'Full-time' | 'Internship' | 'Part-time' | 'Remote'
  experienceLevel: 'Entry-Level' | 'Fresh Graduate' | 'Mid-Level'
  departmentTarget: string[] // 'CSE', 'EEE', 'BBA', etc.
  postedByAlumniName: string
  postedByAlumniRole: string
  postedByAlumniIntake: string
  salaryRange?: string
  deadline: string
  description: string
  requirements: string[]
  applicationUrl?: string
  allowsReferral: boolean
}

export const INITIAL_RESOURCES: AcademicResource[] = [
  {
    id: 'res-1',
    title: 'CSE 311: Midterm & Final Question Bank (2020-2025 Solved)',
    courseCode: 'CSE 311',
    courseTitle: 'Database Management Systems',
    department: 'CSE',
    semesterLevel: '3rd Year (L3T1)',
    type: 'question_bank',
    authorName: 'Tanvir Hossain (50th Intake)',
    authorRole: 'student',
    fileSize: '4.8 MB',
    fileFormat: 'PDF',
    downloadCount: 384,
    upvotes: 92,
    uploadDate: '2026-09-20',
    description: 'Complete compiled and hand-solved past 5 years question papers for DBMS, including relational algebra, SQL subqueries, ER-diagrams, and B+ Trees.',
  },
  {
    id: 'res-2',
    title: 'Operating Systems (Linux Kernel, Processes & Concurrency) Lecture Slides',
    courseCode: 'CSE 323',
    courseTitle: 'Operating Systems & System Programming',
    department: 'CSE',
    semesterLevel: '3rd Year (L3T2)',
    type: 'lecture_notes',
    authorName: 'Dr. Farhana M.',
    authorRole: 'faculty',
    fileSize: '12.4 MB',
    fileFormat: 'PPTX',
    downloadCount: 512,
    upvotes: 114,
    uploadDate: '2026-09-15',
    description: 'Official lecture slide deck covering CPU scheduling, memory management, virtual memory, paging, and synchronization primitives.',
  },
  {
    id: 'res-3',
    title: 'CSE 324: Complete Linux OS & Shell Scripting Lab Manual with C Programs',
    courseCode: 'CSE 324',
    courseTitle: 'Operating Systems Lab',
    department: 'CSE',
    semesterLevel: '3rd Year (L3T2)',
    type: 'lab_manual',
    authorName: 'CSE Dept Lab Cell',
    authorRole: 'faculty',
    fileSize: '3.2 MB',
    fileFormat: 'PDF',
    downloadCount: 420,
    upvotes: 88,
    uploadDate: '2026-09-18',
    description: 'Lab codes including fork(), pthread concurrency, dining philosophers semaphore simulation, and bash shell scripting.',
  },
  {
    id: 'res-4',
    title: 'MAT 205: Linear Algebra, Eigenvalues & Complex Variables Cheat Sheet',
    courseCode: 'MAT 205',
    courseTitle: 'Linear Algebra & Complex Variables',
    department: 'CSE',
    semesterLevel: '2nd Year (L2T2)',
    type: 'handout',
    authorName: 'Prof. K. A. Zaman',
    authorRole: 'faculty',
    fileSize: '1.9 MB',
    fileFormat: 'PDF',
    downloadCount: 650,
    upvotes: 145,
    uploadDate: '2026-09-10',
    description: 'Summarized formula sheet with step-by-step Gauss-Jordan elimination, matrix inversions, and Cauchy-Riemann equations.',
  },
  {
    id: 'res-5',
    title: 'EEE 101: Basic Circuit Analysis & Kirchhoff Laws Solved Problem Sets',
    courseCode: 'EEE 101',
    courseTitle: 'Basic Electrical Circuit Analysis',
    department: 'EEE',
    semesterLevel: '1st Year (L1T1)',
    type: 'question_bank',
    authorName: 'Engr. R. A. Khan',
    authorRole: 'faculty',
    fileSize: '6.1 MB',
    fileFormat: 'PDF',
    downloadCount: 290,
    upvotes: 67,
    uploadDate: '2026-09-12',
    description: 'Previous term exam solutions for node voltage analysis, mesh current method, Thevenin and Norton equivalents.',
  },
  {
    id: 'res-6',
    title: 'MGT 201: Principles of Modern Management & Case Studies Handbook',
    courseCode: 'MGT 201',
    courseTitle: 'Principles of Management',
    department: 'BBA',
    semesterLevel: '2nd Year (L2T1)',
    type: 'reference_book',
    authorName: 'Faculty of Business',
    authorRole: 'faculty',
    fileSize: '8.5 MB',
    fileFormat: 'PDF',
    downloadCount: 210,
    upvotes: 43,
    uploadDate: '2026-09-08',
  },
]

export const INITIAL_ALUMNI: AlumniProfile[] = [
  {
    id: 'alm-1',
    fullName: 'Shuvo Kanti Das',
    department: 'Department of CSE',
    intake: '38th Intake',
    graduatingYear: 2021,
    currentCompany: 'Google (Singapore)',
    currentRole: 'Senior Software Engineer (Cloud Infrastructure)',
    location: 'Singapore',
    linkedinUrl: 'https://linkedin.com/in/shuvokantidas',
    githubUrl: 'https://github.com/shuvodas',
    isAvailableForMentorship: true,
    mentorshipTopics: ['Global FAANG Interviews', 'Distributed Systems', 'Go / Kubernetes', 'System Design'],
    bio: 'Proud BUBTian. Passionate about helping juniors crack global big tech engineering roles and open source contributions.',
  },
  {
    id: 'alm-2',
    fullName: 'Tasnim Sultana',
    department: 'Department of CSE',
    intake: '41st Intake',
    graduatingYear: 2022,
    currentCompany: 'bKash Limited',
    currentRole: 'Lead Backend Engineer (FinTech Platform)',
    location: 'Dhaka, Bangladesh',
    linkedinUrl: 'https://linkedin.com/in/tasnimsultana',
    isAvailableForMentorship: true,
    mentorshipTopics: ['FinTech Architecture', 'Spring Boot & Microservices', 'High-volume Transactions', 'Mock Interviews'],
    bio: 'Passionate about building scalable banking systems. Always available to mentor female engineers at BUBT.',
  },
  {
    id: 'alm-3',
    fullName: 'Rizwanul Islam',
    department: 'Department of EEE',
    intake: '39th Intake',
    graduatingYear: 2021,
    currentCompany: 'Walton Hi-Tech Industries',
    currentRole: 'Senior Embedded Firmware Architect',
    location: 'Dhaka, Bangladesh',
    isAvailableForMentorship: false,
    mentorshipTopics: ['IoT Architecture', 'PCB Design', 'Microcontrollers & RTOS'],
    bio: 'Designing smart home automation firmware and hardware products manufactured in Bangladesh.',
  },
  {
    id: 'alm-4',
    fullName: 'Sadia Jahan',
    department: 'Faculty of Business (BBA)',
    intake: '36th Intake',
    graduatingYear: 2020,
    currentCompany: 'British American Tobacco (BAT)',
    currentRole: 'Brand & Supply Chain Strategist',
    location: 'Dhaka, Bangladesh',
    isAvailableForMentorship: true,
    mentorshipTopics: ['MNC Assessment Centers', 'FMCG Career Roadmaps', 'Business Case Competitions'],
    bio: 'Guiding BUBT business graduates through competitive recruitment assessments, business cases, and management trainee programs.',
  },
  {
    id: 'alm-5',
    fullName: 'Mahbubur Rahman',
    department: 'Department of CSE',
    intake: '43rd Intake',
    graduatingYear: 2023,
    currentCompany: 'Brain Station 23',
    currentRole: 'Full Stack Engineer (Next.js & Python)',
    location: 'Dhaka, Bangladesh',
    isAvailableForMentorship: true,
    mentorshipTopics: ['Next.js & React', 'Junior Developer Roadmaps', 'Portfolio Reviews'],
    bio: 'Former BITC member. Happy to review student portfolios and refer promising talent to Brain Station 23.',
  },
]

export const INITIAL_JOBS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Junior Software Engineer (Full-Stack / TypeScript)',
    company: 'Brain Station 23',
    companyLocation: 'Mohakhali, Dhaka (Hybrid)',
    jobType: 'Full-time',
    experienceLevel: 'Fresh Graduate',
    departmentTarget: ['CSE'],
    postedByAlumniName: 'Mahbubur Rahman',
    postedByAlumniRole: 'Software Engineer',
    postedByAlumniIntake: 'CSE 43rd Intake',
    salaryRange: 'BDT 45,000 - 65,000 / month',
    deadline: '2026-10-25',
    description: 'We are expanding our Enterprise Cloud engineering unit and seeking passionate fresh graduates with strong problem solving and modern web stack fundamentals.',
    requirements: [
      'B.Sc. in CSE from BUBT or equivalent',
      'Solid command over TypeScript, React / Next.js, and Node.js',
      'Familiarity with PostgreSQL, Prisma/ORM, and REST APIs',
      'Good understanding of Git version control and team workflows',
    ],
    allowsReferral: true,
  },
  {
    id: 'job-2',
    title: 'AI / Machine Learning Engineer Intern (Paid)',
    company: 'Optimizely (Dhaka R&D Center)',
    companyLocation: 'Gulshan-2, Dhaka',
    jobType: 'Internship',
    experienceLevel: 'Entry-Level',
    departmentTarget: ['CSE'],
    postedByAlumniName: 'Shuvo Kanti Das',
    postedByAlumniRole: 'Alumni Advisor',
    postedByAlumniIntake: 'CSE 38th Intake',
    salaryRange: 'BDT 30,000 / month',
    deadline: '2026-10-30',
    description: 'Exciting 6-month internship working directly with Large Language Models (LLMs), RAG pipelines, and recommendation algorithms. High probability of full-time absorption.',
    requirements: [
      'Final year student or fresh graduate in CSE / Data Science',
      'Proficiency in Python, PyTorch, LangChain, or Hugging Face',
      'Knowledge of vector databases and embedding search',
    ],
    allowsReferral: true,
  },
  {
    id: 'job-3',
    title: 'Management Trainee Officer (MTO) — Finance & Marketing',
    company: 'IDLC Finance Limited',
    companyLocation: 'Dilkusha, Dhaka',
    jobType: 'Full-time',
    experienceLevel: 'Fresh Graduate',
    departmentTarget: ['BBA'],
    postedByAlumniName: 'Sadia Jahan',
    postedByAlumniRole: 'Senior Alumna',
    postedByAlumniIntake: 'BBA 36th Intake',
    salaryRange: 'BDT 60,000 - 75,000 / month',
    deadline: '2026-10-28',
    description: 'Fast-track leadership development program rotating across Corporate Banking, Wealth Management, and Digital Lending.',
    requirements: [
      'BBA / MBA from BUBT with minimum CGPA of 3.30',
      'Strong analytical, presentation, and leadership qualities',
      'Participation in extra-curricular activities or clubs is preferred',
    ],
    allowsReferral: true,
  },
  {
    id: 'job-4',
    title: 'Embedded Systems & Hardware Trainee Engineer',
    company: 'Walton Hi-Tech Industries',
    companyLocation: 'Chandra, Gazipur (Transport provided from BUBT)',
    jobType: 'Full-time',
    experienceLevel: 'Fresh Graduate',
    departmentTarget: ['EEE', 'CSE'],
    postedByAlumniName: 'Rizwanul Islam',
    postedByAlumniRole: 'Senior Architect',
    postedByAlumniIntake: 'EEE 39th Intake',
    salaryRange: 'BDT 40,000 - 55,000 / month',
    deadline: '2026-11-05',
    description: 'Hands-on R&D role working on smart inverter electronics, IoT connectivity boards, and testing equipment.',
    requirements: [
      'B.Sc. in EEE or CSE from BUBT',
      'Experience with C/C++, STM32, ESP32, or Arduino',
      'Knowledge of circuit schematics and PCB design (Altium/KiCad)',
    ],
    allowsReferral: true,
  },
]
