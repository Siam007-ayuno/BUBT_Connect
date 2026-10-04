export interface CampusEvent {
  id: string
  title: string
  description: string
  clubId?: string
  clubName?: string
  organizerName: string
  category: 'tech' | 'cultural' | 'sports' | 'career' | 'academic' | 'workshop'
  startDate: string
  endDate: string
  time: string
  venue: string
  coverImage?: string
  registrationUrl?: string
  maxAttendees?: number
  currentAttendees: number
  isFeatured: boolean
  tags: string[]
  rsvpStatus?: 'going' | 'interested' | 'not_going'
}

export interface ClubItem {
  id: string
  name: string
  shortCode: string
  category: 'technology' | 'culture' | 'sports' | 'leadership' | 'academic'
  description: string
  motto: string
  logoUrl?: string
  coverUrl?: string
  president: string
  advisor: string
  establishedYear: number
  memberCount: number
  contactEmail: string
  facebookPage?: string
  isRecruiting: boolean
  recruitmentDeadline?: string
  executives: Array<{ name: string; designation: string; intake: string }>
}

export interface LostFoundItem {
  id: string
  type: 'lost' | 'found'
  title: string
  description: string
  category: 'electronics' | 'id_card' | 'books' | 'accessories' | 'clothing' | 'other'
  location: string
  date: string
  status: 'open' | 'claimed' | 'returned'
  contactName: string
  contactPhone: string
  contactEmail: string
  imageUrl?: string
  reportedByRole: string
  claimInstructions?: string
}

export interface DirectoryContact {
  id: string
  name: string
  designation: string
  department: string
  role: 'administration' | 'faculty' | 'emergency' | 'service'
  email: string
  phone: string
  building: string
  roomNo: string
  officeHours?: string
  avatarUrl?: string
  isEmergency?: boolean
}

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'evt-1',
    title: 'BUBT CodeStorm 2026: Intra-University 24h Hackathon',
    description: `The flagship competitive hackathon organized by BUBT IT Club (BITC). Teams of 3-4 will build real-world software solutions across AI/ML, FinTech, and Smart Campus automation. Mentored by industry leaders with prize pool of BDT 150,000!`,
    clubId: 'club-itc',
    clubName: 'BUBT IT Club',
    organizerName: 'BUBT IT Club & Dept. of CSE',
    category: 'tech',
    startDate: '2026-10-24T09:00:00Z',
    endDate: '2026-10-25T16:00:00Z',
    time: '09:00 AM - 04:00 PM (Next Day)',
    venue: 'Auditorium & Software Lab 501, Building 2',
    isFeatured: true,
    maxAttendees: 200,
    currentAttendees: 142,
    tags: ['Hackathon', 'Coding', 'AI', 'BITC', 'Prizes'],
    rsvpStatus: 'going',
  },
  {
    id: 'evt-2',
    title: 'National Roborace & Line Follower Challenge 2026',
    description: `Annual autonomous robotics competition hosted by BUBT Robotics Club. Features Line Follower Robot (LFR), Robo Soccer, and Project Showcase with universities from across Bangladesh.`,
    clubId: 'club-robotics',
    clubName: 'BUBT Robotics Club',
    organizerName: 'BUBT Robotics Club',
    category: 'tech',
    startDate: '2026-11-05T10:00:00Z',
    endDate: '2026-11-05T18:00:00Z',
    time: '10:00 AM - 06:00 PM',
    venue: 'BUBT Main Indoor Sports Arena & Ground Floor',
    isFeatured: true,
    maxAttendees: 300,
    currentAttendees: 215,
    tags: ['Robotics', 'LFR', 'Hardware', 'Engineering'],
    rsvpStatus: 'interested',
  },
  {
    id: 'evt-3',
    title: 'BUBT Fresher\'s Fiesta & Cultural Gala 2026',
    description: `A warm musical reception welcoming the incoming 52nd and 53rd Intakes. Live acoustic band performances by campus artists, classical dance, drama production, and a guest musical concert.`,
    clubId: 'club-cultural',
    clubName: 'BUBT Cultural Club',
    organizerName: 'BUBT Cultural Club',
    category: 'cultural',
    startDate: '2026-10-18T15:00:00Z',
    endDate: '2026-10-18T20:30:00Z',
    time: '03:00 PM - 08:30 PM',
    venue: 'Permanent Campus Central Plaza & Open Stage',
    isFeatured: true,
    maxAttendees: 800,
    currentAttendees: 620,
    tags: ['Music', 'Dance', 'Freshers', 'Concert'],
  },
  {
    id: 'evt-4',
    title: 'Fall 2026 Tech Career & Alumni Networking Expo',
    description: `Connect with hiring managers from 25+ top technology and multinational companies in Bangladesh. On-spot CV reviews, mock behavioral interviews, and full-time/internship opportunities for graduating seniors and alumni.`,
    organizerName: 'Career Guidance & Alumni Affairs Office',
    category: 'career',
    startDate: '2026-11-12T10:00:00Z',
    endDate: '2026-11-12T17:00:00Z',
    time: '10:00 AM - 05:00 PM',
    venue: 'Permanent Campus Building 1 Ground & 1st Floor',
    isFeatured: false,
    maxAttendees: 500,
    currentAttendees: 380,
    tags: ['Jobs', 'Internships', 'Alumni', 'Networking'],
  },
  {
    id: 'evt-5',
    title: 'BUBT Premier League (BPL) Cricket Tournament 2026',
    description: `The intra-department tape-tennis cricket showdown! 16 teams representing CSE, EEE, BBA, Law, English, Textile and Civil Engineering battling for the championship trophy.`,
    clubId: 'club-sports',
    clubName: 'BUBT Sports Club',
    organizerName: 'BUBT Sports Club',
    category: 'sports',
    startDate: '2026-11-20T08:30:00Z',
    endDate: '2026-11-22T17:00:00Z',
    time: '08:30 AM - 05:00 PM',
    venue: 'BUBT Permanent Campus Sports Ground',
    isFeatured: false,
    maxAttendees: 400,
    currentAttendees: 290,
    tags: ['Cricket', 'Sports', 'Tournament', 'Trophy'],
  },
]

export const INITIAL_CLUBS: ClubItem[] = [
  {
    id: 'club-itc',
    name: 'BUBT IT Club (BITC)',
    shortCode: 'BITC',
    category: 'technology',
    motto: 'Empowering Innovators of Tomorrow',
    description: 'The largest technical society at BUBT. Promotes competitive programming, software development, cloud computing, cybersecurity, and open-source contributions through workshops, bootcamps, and hackathons.',
    president: 'Tanvir Hossain (CSE 49th)',
    advisor: 'Dr. M. M. Rahman (Professor, CSE)',
    establishedYear: 2012,
    memberCount: 840,
    contactEmail: 'itclub@bubt.edu.bd',
    facebookPage: 'https://facebook.com/bubtitclub',
    isRecruiting: true,
    recruitmentDeadline: 'October 15, 2026',
    executives: [
      { name: 'Tanvir Hossain', designation: 'President', intake: 'CSE 49th' },
      { name: 'Nafisa Rahman', designation: 'General Secretary', intake: 'CSE 50th' },
      { name: 'Sabbir Ahmed', designation: 'Head of Competitive Programming', intake: 'CSE 49th' },
      { name: 'Afia Ibnat', designation: 'Head of Event Management', intake: 'CSE 50th' },
    ],
  },
  {
    id: 'club-robotics',
    name: 'BUBT Robotics Club',
    shortCode: 'BRC',
    category: 'technology',
    motto: 'Building the Autonomous Future',
    description: 'A vibrant hardware, IoT, and embedded systems hub where students design autonomous line followers, drones, robotic arms, and industrial IoT solutions. Winner of multiple national robotics championships.',
    president: 'Mahmudul Hasan (EEE 48th)',
    advisor: 'Engr. R. A. Khan (Asst. Professor, EEE)',
    establishedYear: 2015,
    memberCount: 420,
    contactEmail: 'robotics@bubt.edu.bd',
    isRecruiting: true,
    recruitmentDeadline: 'October 20, 2026',
    executives: [
      { name: 'Mahmudul Hasan', designation: 'President', intake: 'EEE 48th' },
      { name: 'Fahim Faisal', designation: 'Vice President (Technical)', intake: 'CSE 49th' },
      { name: 'Sumaiya Akter', designation: 'General Secretary', intake: 'EEE 50th' },
    ],
  },
  {
    id: 'club-ieee',
    name: 'IEEE BUBT Student Branch',
    shortCode: 'IEEE BUBT SB',
    category: 'academic',
    motto: 'Advancing Technology for Humanity',
    description: 'The international IEEE student branch at BUBT providing access to global conferences, research seminars, IEEE Xplore digital library publications, and global networking.',
    president: 'Arifuzzaman Shuvo (EEE 48th)',
    advisor: 'Prof. Dr. Ali Ahmed (Dean, FEAS)',
    establishedYear: 2017,
    memberCount: 310,
    contactEmail: 'ieee@bubt.edu.bd',
    isRecruiting: false,
    executives: [
      { name: 'Arifuzzaman Shuvo', designation: 'Chair', intake: 'EEE 48th' },
      { name: 'Tasnim Jahan', designation: 'Vice Chair (WIE)', intake: 'CSE 49th' },
      { name: 'Rashidul Alam', designation: 'Secretary', intake: 'EEE 49th' },
    ],
  },
  {
    id: 'club-cultural',
    name: 'BUBT Cultural Club',
    shortCode: 'BCC',
    category: 'culture',
    motto: 'Echoing the Heritage and Rhythms of Bengal',
    description: 'Nurturing music, theatrical arts, poetry recitation, classical and folk dance, and creative celebrations of Pohela Boishakh, BUBT Foundation Day, and National Victory Days.',
    president: 'Anika Tabassum (English 47th)',
    advisor: 'Prof. Syed Anwarul Huq',
    establishedYear: 2008,
    memberCount: 650,
    contactEmail: 'cultural@bubt.edu.bd',
    isRecruiting: true,
    recruitmentDeadline: 'October 12, 2026',
    executives: [
      { name: 'Anika Tabassum', designation: 'President', intake: 'English 47th' },
      { name: 'Sadman Sakib', designation: 'General Secretary', intake: 'BBA 48th' },
      { name: 'Mithila Roy', designation: 'Music Director', intake: 'CSE 50th' },
    ],
  },
  {
    id: 'club-sports',
    name: 'BUBT Sports Club',
    shortCode: 'BSC',
    category: 'sports',
    motto: 'Fitness, Teamwork, and Glory',
    description: 'Organizes intra-university and inter-university cricket, football, badminton, table tennis, chess, and carrom tournaments to foster physical fitness and camaraderie.',
    president: 'Rashedul Islam (BBA 48th)',
    advisor: 'Physical Education Directorate',
    establishedYear: 2009,
    memberCount: 580,
    contactEmail: 'sports@bubt.edu.bd',
    isRecruiting: false,
    executives: [
      { name: 'Rashedul Islam', designation: 'President', intake: 'BBA 48th' },
      { name: 'Kamrul Hasan', designation: 'Captain (Cricket)', intake: 'CSE 49th' },
      { name: 'Mehedi Miraj', designation: 'Captain (Football)', intake: 'Civil 48th' },
    ],
  },
  {
    id: 'club-debating',
    name: 'BUBT Debating Club (BDC)',
    shortCode: 'BDC',
    category: 'leadership',
    motto: 'Logic, Eloquence, and Conviction',
    description: 'Champions of Parliamentary and British Parliamentary debate in both Bangla and English. Fosters critical thinking, public speaking mastery, and policy analysis.',
    president: 'Zubair Hossain (Law 46th)',
    advisor: 'Dept. of Law & Proctor Office',
    establishedYear: 2011,
    memberCount: 290,
    contactEmail: 'debate@bubt.edu.bd',
    isRecruiting: true,
    recruitmentDeadline: 'October 18, 2026',
    executives: [
      { name: 'Zubair Hossain', designation: 'President', intake: 'Law 46th' },
      { name: 'Farah Naz', designation: 'Vice President (Bangla Debate)', intake: 'English 48th' },
      { name: 'Tahmid Khan', designation: 'Vice President (English Debate)', intake: 'CSE 49th' },
    ],
  },
]

export const INITIAL_LOST_FOUND: LostFoundItem[] = [
  {
    id: 'lf-1',
    type: 'lost',
    title: 'Casio Scientific Calculator fx-991EX ClassWiz',
    description: 'Black scientific calculator left on desk in Room 502 (Building 2) during Saturday 11:30 AM Linear Algebra class. Has a small yellow sticker with initial "TK" on the back cover.',
    category: 'electronics',
    location: 'Building 2, Room 502',
    date: '2026-09-28',
    status: 'open',
    contactName: 'Tanvir Hossain',
    contactPhone: '01712-345678',
    contactEmail: 'tanvir.cse@bubt.edu.bd',
    reportedByRole: 'student',
    claimInstructions: 'Please contact via phone or return to CSE Department Coordinator desk.',
  },
  {
    id: 'lf-2',
    type: 'found',
    title: 'BUBT Student ID Card — Dept of EEE (Intake 51)',
    description: 'Found a plastic laminated student ID card near the 2nd Floor Cafeteria cash counter. Name on card: "MD. RAYHANUL ISLAM", ID: 22235103045.',
    category: 'id_card',
    location: 'Cafeteria, Building 1 (2nd Floor)',
    date: '2026-09-29',
    status: 'open',
    contactName: 'Proctor Office Security Desk',
    contactPhone: '01810-033733',
    contactEmail: 'proctor@bubt.edu.bd',
    reportedByRole: 'authority',
    claimInstructions: 'Owner can collect from Proctor Office (Building 1, Room 104) upon showing verification.',
  },
  {
    id: 'lf-3',
    type: 'found',
    title: 'Apple 67W USB-C Laptop Charger Cable & Brick',
    description: 'Found plugged into power socket in Central Library 4th Floor quiet study section on Sunday afternoon.',
    category: 'electronics',
    location: 'Central Library, 4th Floor Study Room',
    date: '2026-09-27',
    status: 'open',
    contactName: 'Library Circulation Desk',
    contactPhone: '01810-033734',
    contactEmail: 'library@bubt.edu.bd',
    reportedByRole: 'faculty',
    claimInstructions: 'Claim at Library Circulation Desk by specifying serial number or laptop model.',
  },
  {
    id: 'lf-4',
    type: 'lost',
    title: 'Black Leather Bifold Wallet with NID & Annex Cards',
    description: 'Lost wallet containing National ID card, BUBT library card, and student bank card. Probably dropped in Campus Shuttle Bus Route 3 (Mirpur-Uttara) on morning commute.',
    category: 'accessories',
    location: 'Campus Shuttle Bus #3',
    date: '2026-09-26',
    status: 'claimed',
    contactName: 'Sabbir Rahman',
    contactPhone: '01911-223344',
    contactEmail: 'sabbir.bba@bubt.edu.bd',
    reportedByRole: 'student',
  },
  {
    id: 'lf-5',
    type: 'found',
    title: 'Tupperware Insulated Stainless Steel Water Bottle (Navy Blue)',
    description: 'Found in Building 2, 6th Floor lobby sofa after Thursday evening lab.',
    category: 'other',
    location: 'Building 2, 6th Floor Lobby',
    date: '2026-09-25',
    status: 'returned',
    contactName: 'Building 2 Estate Supervisor',
    contactPhone: '01810-033740',
    contactEmail: 'estate@bubt.edu.bd',
    reportedByRole: 'authority',
  },
]

export const DIRECTORY_CONTACTS: DirectoryContact[] = [
  // Emergency Desk
  {
    id: 'dir-em-1',
    name: 'Proctor Office & Campus Security Hotline',
    designation: 'Emergency Response & Student Safety Command',
    department: 'Proctorial Directorate',
    role: 'emergency',
    email: 'proctor@bubt.edu.bd',
    phone: '01810-033733',
    building: 'Building 1',
    roomNo: 'Room 104 (Ground Floor)',
    officeHours: '24/7 Campus Security Duty',
    isEmergency: true,
  },
  {
    id: 'dir-em-2',
    name: 'BUBT Medical Centre & First Aid Clinic',
    designation: 'Campus Physician & Paramedic Team',
    department: 'Health Services',
    role: 'emergency',
    email: 'medical@bubt.edu.bd',
    phone: '01810-033735',
    building: 'Building 1',
    roomNo: 'Room 106 (Ground Floor)',
    officeHours: '08:00 AM - 08:00 PM (Sat-Thu)',
    isEmergency: true,
  },
  {
    id: 'dir-em-3',
    name: 'Campus Estate & Transport Emergency Hotline',
    designation: 'Shuttle Buses & Facility Maintenance',
    department: 'Transport Directorate',
    role: 'emergency',
    email: 'transport@bubt.edu.bd',
    phone: '01810-033736',
    building: 'Building 2',
    roomNo: 'Transport Desk (Main Gate)',
    officeHours: '06:30 AM - 09:00 PM',
    isEmergency: true,
  },
  // Administration
  {
    id: 'dir-adm-1',
    name: 'Prof. Dr. Md. Fayyaz Khan',
    designation: 'Honorable Vice Chancellor',
    department: 'Office of the Vice Chancellor',
    role: 'administration',
    email: 'vc@bubt.edu.bd',
    phone: '01810-033701',
    building: 'Building 1',
    roomNo: 'VC Suite, 3rd Floor',
    officeHours: '10:00 AM - 04:00 PM (By Appointment)',
  },
  {
    id: 'dir-adm-2',
    name: 'Dr. Md. Harun-Or-Rashid',
    designation: 'Registrar',
    department: 'Office of the Registrar',
    role: 'administration',
    email: 'registrar@bubt.edu.bd',
    phone: '01810-033702',
    building: 'Building 1',
    roomNo: 'Room 201, 2nd Floor',
    officeHours: '09:00 AM - 05:00 PM (Sat-Thu)',
  },
  {
    id: 'dir-adm-3',
    name: 'Prof. A. B. Md. Badruddoza Mia',
    designation: 'Controller of Examinations',
    department: 'Office of the Controller of Examinations',
    role: 'administration',
    email: 'controller@bubt.edu.bd',
    phone: '01810-033703',
    building: 'Building 1',
    roomNo: 'Room 205, 2nd Floor',
    officeHours: '09:00 AM - 05:00 PM (Sat-Thu)',
  },
  {
    id: 'dir-adm-4',
    name: 'Accounts & Student Finance Section',
    designation: 'Tuition Fees, Waivers & Bank Reconciliation',
    department: 'Finance & Accounts',
    role: 'administration',
    email: 'accounts@bubt.edu.bd',
    phone: '01810-033708',
    building: 'Building 1',
    roomNo: 'Room 102 (Accounts Counter)',
    officeHours: '09:00 AM - 04:30 PM (Sat-Thu)',
  },
  // Faculty
  {
    id: 'dir-fac-1',
    name: 'Prof. Dr. Ali Ahmed',
    designation: 'Dean, Faculty of Engineering & Applied Sciences',
    department: 'Faculty of Engineering (FEAS)',
    role: 'faculty',
    email: 'dean.feas@bubt.edu.bd',
    phone: '01810-033711',
    building: 'Building 2',
    roomNo: 'Room 501',
    officeHours: '11:00 AM - 01:00 PM (Sun, Tue, Thu)',
  },
  {
    id: 'dir-fac-2',
    name: 'Dr. M. M. Rahman',
    designation: 'Professor & Chairman, Department of CSE',
    department: 'Department of Computer Science & Engineering',
    role: 'faculty',
    email: 'chair.cse@bubt.edu.bd',
    phone: '01810-033712',
    building: 'Building 2',
    roomNo: 'Room 503',
    officeHours: '10:00 AM - 12:00 PM (Sat, Mon, Wed)',
  },
  {
    id: 'dir-fac-3',
    name: 'Dr. Farhana M.',
    designation: 'Associate Professor & Capstone Coordinator',
    department: 'Department of Computer Science & Engineering',
    role: 'faculty',
    email: 'farhana.cse@bubt.edu.bd',
    phone: '01810-033714',
    building: 'Building 2',
    roomNo: 'Room 508',
    officeHours: '02:00 PM - 04:00 PM (Sat, Sun, Wed)',
  },
  {
    id: 'dir-fac-4',
    name: 'Engr. R. A. Khan',
    designation: 'Assistant Professor & Lab In-charge',
    department: 'Department of Electrical & Electronic Engineering',
    role: 'faculty',
    email: 'rakhan.eee@bubt.edu.bd',
    phone: '01810-033718',
    building: 'Building 1',
    roomNo: 'Room 304',
    officeHours: '11:30 AM - 01:30 PM (Mon, Tue, Thu)',
  },
  {
    id: 'dir-fac-5',
    name: 'Prof. Dr. Syed Masud Husain',
    designation: 'Dean, Faculty of Business & Social Sciences',
    department: 'Faculty of Business',
    role: 'faculty',
    email: 'dean.business@bubt.edu.bd',
    phone: '01810-033722',
    building: 'Building 1',
    roomNo: 'Room 401',
    officeHours: '10:00 AM - 12:30 PM (Sat-Wed)',
  },
]
