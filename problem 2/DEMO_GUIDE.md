# 🏆 CAMPUS FLOW — Hackathon Demonstration & Judging Guide

Follow this step-by-step walkthrough to present **CAMPUS FLOW** ("Plan Better. Coordinate Smarter. Run Better Events.") to hackathon judges.

---

## 🎬 Complete Hackathon Live Demonstration Flow

### Step 1: Open Home Page (`/`)
- **URL**: [http://localhost:3000](http://localhost:3000)
- **Showcase**:
  - Hero Header: *"CAMPUS FLOW"* — *"Plan Better. Coordinate Smarter. Run Better Events."*
  - CTA Buttons: **"Explore Events"**, **"Register for an Event"**, **"Organizer Login"**.
  - Sections: Featured Programs, 6 Event Categories, How It Works (Student & Organizer journeys), Event Coordination Features.

### Step 2: Explore All 9 Campus Events (`/events`)
- **URL**: `/events`
- **Showcase**:
  - All 9 realistic campus events displayed as interactive cards:
    1. **TechFest 2026** (₹150)
    2. **Hackathon 2026** (₹200)
    3. **AI & Innovation Summit** (₹300)
    4. **CodeSprint** (₹100)
    5. **Robotics Challenge** (₹200)
    6. **Placement Drive** (Free)
    7. **Technical Workshop** (₹50)
    8. **Cultural Fest** (Free)
    9. **Sports Carnival** (₹50)
  - Test the **Search Bar**, **Category Filter**, **Price Filter** (Free to ₹300), and observe live seat progress bars.

### Step 3: Event Details & Instant Registration (`/events/evt-techfest-2026`)
- **URL**: `/events/evt-techfest-2026`
- **Showcase**:
  - Banner image, date, time, venue, capacity, seats remaining, price summary, organizer contact, master schedule timeline, and participation rules.
  - Click **"Register Now"** to open the registration modal.
  - Submit the registration: Notice the instant generation of a unique **Digital Pass ID** (e.g. `REG-TEC26-8941`) and payment status.

### Step 4: Student Dashboard (`/dashboard`)
- **URL**: `/dashboard`
- **Showcase**:
  - Logged-in student profile (Rahul Deshmukh • STU-2023-CS042).
  - **"My Registrations"** table with Event Name, Date, Venue, Time, Price in ₹, Registration ID, and confirmed status.
  - Test cancelling or managing registrations and review the recent notification broadcasts feed.

### Step 5: Organizer Event Requirement Intake (`/organizer/create-event`)
- **URL**: `/organizer/create-event`
- **Showcase**:
  - Core Hackathon Feature: Enter or click the preset prompt:
    *"Organize a 2-day technical fest for 500 students with 6 workshops, 2 seminar halls, 4 labs, 30 volunteers, AV equipment, security, transport and food arrangements."*
  - Click **"1. Extract & Analyze Parameters"**: Notice structured extraction of headcounts, duration, candidate venues, and required hardware.
  - Edit any parameter and click **"2. Generate Operational Plan"**.

### Step 6: Multi-Agent Planning Dashboard (`/organizer/planning`)
- **URL**: `/organizer/planning`
- **Showcase**:
  - Tabbed operational inspector across:
    - 🕒 **Master Schedule**: Multi-track chronological timeline.
    - 🏛️ **Venues**: Main Auditorium, Seminar Halls A/B, Computer Labs, Innovation Lab, Conference Hall, Open Ground, Sports Complex.
    - 📦 **Equipment**: Projectors, Microphones, Wi-Fi 6 Routers, Extension Boards with stock status.
    - 👥 **Volunteers**: 20 student roster across 5 squads with shift tracking.
    - 🛡️ **Security**: Guard allocations and emergency action plan.
    - 🚌 **Transport**: Shuttle vans and metro loops.
    - 🔒 **Permissions**: Clearances queue.
    - 📋 **Tasks & Deadlines**: Delegated squad assignments.
    - ⚠️ **Conflicts**: Active constraint collisions.
    - 📈 **Readiness**: 0–100% weighted index.

### Step 7: Constraint Checking & Conflict Resolution (`/conflicts`)
- **URL**: `/conflicts`
- **Showcase**:
  - Deterministic conflict engine detected a double-booking in Seminar Hall A.
  - Click **"Apply Alternative"** (Relocate to Seminar Hall B) and observe instant resolution.

### Step 8: Dynamic Replanning & Disruption Simulator (`/replan`)
- **URL**: `/replan`
- **Showcase**:
  - Select **"⚡ Sudden Venue Outage"** (Seminar Hall A offline).
  - Click **"Trigger Autonomous Replanning Pipeline"**.
  - Review the **9-step execution trace** and the side-by-side **BEFORE → CHANGE → CONFLICT → ALTERNATIVE → UPDATED PLAN** comparison table.

### Step 9: Human Governance Approvals (`/organizer/approvals`)
- **URL**: `/organizer/approvals`
- **Showcase**:
  - Demonstrates that agents cannot bypass safety/budget barriers.
  - Click **"Approve & Sign"** on the Night Hackathon Security Clearance.

### Step 10: Executive Admin Control Center (`/admin`)
- **URL**: `/admin`
- **Showcase**:
  - Total events (9), Total registrations (3,500+), Gross Revenue in ₹, Seat Utilization breakdown, and Venue Occupancy matrix.

### Step 11: System Flow & REST API Documentation (`/system-flow` & `/api-docs`)
- **URL**: `/system-flow` and `/api-docs`
- **Showcase**:
  - 12-stage visual operational flow.
  - Live interactive API testing for all endpoints (`/api/events`, `/api/registrations`, `/api/conflicts/check`, `/api/replan`, `/api/admin/stats`, `/api/health`).
