# BUBT Connect (বিইউবিটি কানেক্ট)

> **Official Digital Community, Academic & Emergency Platform for Bangladesh University of Business and Technology (BUBT)**  
> *মটো: জ্ঞানই শক্তি (Knowledge is Power)* • Permanent Campus: Rupnagar, Mirpur-2, Dhaka-1216, Bangladesh  
> **Repository:** [https://github.com/Siam007-ayuno/BUBT_Connect](https://github.com/Siam007-ayuno/BUBT_Connect)

---

## 📌 Executive Overview

**BUBT Connect** is an all-in-one, mobile-first progressive web application (PWA) specifically engineered for the student body, faculty, administrative bodies (Proctor Office, Student Affairs, Accounts, IT Cell), and alumni of Bangladesh University of Business and Technology (BUBT). 

It bridges campus communication, transparent governance, peer-to-peer academic sharing, emergency distress response, and humanitarian blood donations into a secure, accountable digital ecosystem.

---

## 🌟 Key Feature Modules

### 1. 🛡️ Campus SOS & Rapid Emergency Help (`/app/sos`)
* **1-Tap Emergency Distress Beacon**: In danger or facing harassment? Students can trigger an immediate emergency distress beacon with one click.
* **Emergency Categories**:
  - 🚨 **Eve-teasing & Stalking**: Rapid response for harassment near campus perimeters.
  - 🚑 **Medical Emergency & Collapse**: Immediate alert for fainting, sudden illness, or injuries.
  - 🩸 **Road Accident / Physical Trauma**: Rapid coordination around Mirpur-2 and Rupnagar.
  - 🛡️ **Mugging / Security Threat**: Direct dispatch for extortion or outsider threats.
* **Live Community Responder Counter**: Nearby students can click **"I Am Coming to Help"** to signal real-time solidarity and rush to assist.
* **Direct 24/7 Campus & National Hotlines**:
  - **BUBT Proctor Office 24/7 Rapid Response**: `+8801741129242`
  - **BUBT Campus Medical Desk & First Aid**: `+8801912345678`
  - **Mirpur Model Police Station (DMP)**: `+8801713373155`
  - **National Emergency Service (Police, Fire, Ambulance)**: `999`
  - **Mirpur 24/7 Emergency Ambulance Fleet**: `+8801711818692`
  - **National Anti-Harassment & Child Helpline**: `109`

---

### 2. 🩸 Voluntary Blood Donation Wing (`/app/blood-donation`)
* **Urgent Blood Requests Feed**: Real-time posts detailing patient condition, hospital (Delta Medical Mirpur-1, National Heart Foundation Mirpur-2, DMCH, Ibn Sina), bags needed, and urgency level.
* **Interactive Community Actions**:
  - **"I Can Donate" (Pledge)**: Increment community donor pledges with 1 tap.
  - **Direct Dial**: Call the attendant/family immediately via `tel:` integration.
  - **Share Request**: 1-click formatted copy for WhatsApp, Facebook groups, and Messenger.
* **BUBT Voluntary Donors Directory**: Searchable registry of student and staff blood donors filtered by blood group (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`), department, and location.
* **Transfusion Matrix**: Comprehensive blood group compatibility matrix and medical eligibility criteria.

---

### 3. 🎓 Digital Student Identity & Campus Pass (`/app/profile`)
* **Edit DP & Blood Group**:
  - Interactive photo uploader supporting local images (`JPG`, `PNG`, `WEBP`) with instant preview and crop.
  - Blood group selector (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) reflecting dynamically across profile metadata and the smart ID card.
* **Academic Transcript Hub**: Real-time tracker for Cumulative GPA, completed credit progress, and current semester registered courses.

---

### 4. 🔍 Official BUBT Student ID Verification
* **Integrated with Official Portal**: Live validation against the official BUBT verification service (`https://www.bubt.edu.bd/global_file/validityCheck.php`).
* **Strict Format Enforcement**: Enforces genuine 11-digit BUBT Student IDs with valid department codes (`01`–`08`) and real intake cohorts; blocks malformed or unverified registrations automatically.

---

### 5. 📢 Voice Board (Campus Governance & Problem Resolution)
* **Post Types**: ⚠️ Problem, 💡 Suggestion, ❓ Question, 💬 Discussion.
* **13 University Categories**: IT & WiFi, Academic, Exam & Results, Library, Transport, Cafeteria & Food, Facilities, Fees & Accounts, Hostel, Administration, Campus Safety, Clubs & Cultural, Other.
* **Status Stepper**: Real-time issue tracking (`Open` ➔ `Under Review` ➔ `In Progress` ➔ `Resolved` / `Rejected`).
* **Official Verification**: Verified responses signed by Proctorial Authority with official BUBT seals.
* **Student Satisfaction Rating (CSAT)**: 5-star rating triggered when problems are marked resolved.
* **Anonymous Posting**: Secure identity masking with moderation audit trails to protect student whistleblowers.

---

### 6. 🏛️ Authority & Administration Dashboard (`/app/dashboard`)
* **Issue Allocation**: Assign complaints to specific directorates (Estate, Transport, IT Cell, Proctor Office).
* **Internal Collaboration Notes**: Private discussion threads visible only to authorized administration.
* **Interactive Analytics**: Powered by Recharts — monthly resolution velocities, category distributions, and CSAT scores.
* **Official University Polls**: Create campus-wide student votes with live percentage breakdown.
* **Proctorial Moderation Queue**: Dismiss, issue formal warnings, or suspend abusive accounts with audit logging.
* **CSV Data Export**: Export filtered records for administrative reports and syndicate meetings.

---

### 7. 📄 Official Notices & Routine Hub (`/app/notices`)
* **Circular Memo Letterhead**: Official BUBT letterhead layout featuring the BUBT crest, official reference numbers (e.g. `BUBT/COE/F26/CIR-104`), date, formal subject line, digital authentication seal, and distribution/CC list.
* **Letterhead Export & Print**: Printable official memos or offline PDF export.
* **Routine Hub**:
  - **Class Timetable Grid**: Filterable by Day (Saturday–Thursday), Intake/Batch, and Department with room allocations and faculty initials.
  - **Exam Schedules**: Midterm and Final timetables with room allocations and admit card fee clearance warnings.

---

### 8. 🎪 Campus Life & Academic Vault
* **Events & RSVPs (`/app/events`)**: Hackathons, cultural nights, sports tournaments with `.ics` calendar sync.
* **Clubs & Societies (`/app/clubs`)**: BITC, Robotics Club, IEEE Student Branch, Cultural Club, Debating Club with executive committees and recruitment modals.
* **Lost & Found Central (`/app/lost-found`)**: "I Lost Something" vs "I Found Something" reporting with Proctor Office claim matching.
* **Academic Resource Vault (`/app/resources`)**: Past semester exam question papers, lab manuals, lecture slides, and drag-and-drop file uploader.
* **Alumni Network (`/app/alumni`)**: Directory of BUBT graduates at Google, bKash, Brain Station 23, Walton, BAT, with 1-on-1 mentorship bookings and job boards.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) + React 19 + TypeScript |
| **Styling & UI** | Tailwind CSS v4 + shadcn/ui + Lucide Icons |
| **Backend & DB** | Supabase (PostgreSQL 15, Row Level Security, Auth, Storage) |
| **Emergency & State** | Custom reactive stores (`sos-store.ts`, `blood-donation-store.ts`, `voice-board-store.ts`) + LocalStorage + Cookie sync |
| **Verification** | BUBT Portal API Integration (`https://www.bubt.edu.bd/global_file/validityCheck.php`) |
| **Data Visualization** | Recharts (Responsive Container, Area, Bar, Donut charts) |
| **Forms & Validation** | Zod + React Hook Form |
| **Internationalization** | English & Bengali (`Noto Sans Bengali` with bilingual campus motto) |
| **Theme & PWA** | Dark / Light theme + Service Worker offline asset caching (`/sw.js`) |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Siam007-ayuno/BUBT_Connect.git
cd BUBT_Connect/bubt-connect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create `.env.local` in the project root:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=BUBT Connect
NEXT_PUBLIC_ESCALATION_THRESHOLD=25
```

> **Note on Demo Mode:** If Supabase keys are not set, the platform operates seamlessly in **Full Interactive Demo Mode** with complete mock datasets, persistent storage, and live persona switching!

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## ⚡ Instant Role Switcher (Live Testing)
Test all personas in the live application via the **Role Switcher** badge in the top header:
* 🎓 **Student**: SAIF SIAM / Tanvir Ahmed — Post issues, vote, trigger SOS, pledge blood, join clubs.
* 👨‍🏫 **Faculty**: Dr. M. M. Rahman (Dept of CSE) — Academic resources, class circulars, mentorship.
* 🏛️ **Authority**: Proctor Office & Student Affairs — Resolve SOS alerts, manage issues, publish circulars, view analytics.
* 💼 **Alumni**: Farzana Yasmin (Brain Station 23) — Job postings, mentorship bookings.
* 🛡️ **Super Admin**: Platform Governance & Audit.

---

## 📂 Project Structure

```
bubt-connect/
├── public/
│   ├── images/              # BUBT crest logo & campus imagery
│   ├── manifest.json        # PWA Web App Manifest
│   └── sw.js                # Service Worker
├── src/
│   ├── app/
│   │   ├── (auth)/          # Registration & Login with 11-digit BUBT ID verification
│   │   ├── api/             # ID verification & background routes
│   │   └── app/             # Authenticated shell
│   │       ├── blood-donation/ # Blood Donation Wing
│   │       ├── sos/            # Campus Emergency SOS Network
│   │       ├── profile/        # Digital Student ID Pass & Transcript
│   │       ├── dashboard/      # Proctor & Authority Dashboard
│   │       ├── notices/        # Notices & Routine Timetables
│   │       ├── resources/      # Academic Vault & Question Bank
│   │       ├── events/         # Campus Events & RSVPs
│   │       ├── clubs/          # Clubs & Societies Directory
│   │       ├── lost-found/     # Campus Lost & Found
│   │       ├── directory/      # Faculty & Emergency Contacts
│   │       ├── alumni/         # Alumni Directory & Job Board
│   │       └── notifications/  # Notification Center
│   ├── components/
│   │   ├── blood/           # Blood Donation client, modals, filters
│   │   ├── sos/             # SOS trigger beacon, hotlines, distress feed
│   │   ├── academic/        # Profile client, ID card pass, resource vault
│   │   ├── dashboard/       # Administrative analytics & moderation
│   │   ├── layout/          # Header, SidebarNav, BottomNav
│   │   ├── notices/         # Notice memos & letterhead generator
│   │   └── voice-board/     # Problem & suggestion issue feed
│   └── lib/
│       ├── bubt-verification.ts    # Official BUBT portal validator
│       ├── blood-donation-store.ts # Blood requests & donors store
│       ├── sos-store.ts            # Campus SOS beacon & hotlines store
│       ├── voice-board-store.ts    # Voice board issue tracker store
│       └── demo-data.ts            # Authentic campus initial datasets
└── supabase/
    ├── migrations/          # Complete PostgreSQL schema
    └── seed.sql             # Department & campus seed records
```

---

## 🛡️ License & Acknowledgements
Built for **Bangladesh University of Business and Technology (BUBT)**.  
*জ্ঞানই শক্তি — Knowledge is Power.*
