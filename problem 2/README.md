# 🪐 CampusFlow AI — Autonomous Campus Event Planning & Coordination Platform
> **AI-Powered Multi-Agent Event Operations, Real-Time Constraint Validation & Dynamic Replanning**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.5-black.svg?style=flat&logo=next.js)](https://nextjs.org)
[![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg?style=flat&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.17-2D3748.svg?style=flat&logo=prisma)](https://prisma.io)
[![Vitest](https://img.shields.io/badge/Vitest-2.0-FCC72B.svg?style=flat&logo=vitest)](https://vitest.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deployment: Live](https://img.shields.io/badge/Deployment-Vercel%20Live-brightgreen.svg)](https://campus-orbit-ai.vercel.app)

---

## 🌐 Live Permanent Deployment URLs

- 🌟 **Public Live Website**: **[https://campus-orbit-ai.vercel.app](https://campus-orbit-ai.vercel.app)**
- 🎟️ **9 Campus Events Catalog**: **[https://campus-orbit-ai.vercel.app/events](https://campus-orbit-ai.vercel.app/events)**
- 🎓 **Student Dashboard & Passes**: **[https://campus-orbit-ai.vercel.app/dashboard](https://campus-orbit-ai.vercel.app/dashboard)**
- 📋 **Organizer Planning Hub**: **[https://campus-orbit-ai.vercel.app/organizer/planning](https://campus-orbit-ai.vercel.app/organizer/planning)**
- 🛡️ **Executive Admin Dashboard**: **[https://campus-orbit-ai.vercel.app/admin](https://campus-orbit-ai.vercel.app/admin)**
- 🧪 **API Health Check**: **[https://campus-orbit-ai.vercel.app/api/health](https://campus-orbit-ai.vercel.app/api/health)**
- 📖 **Interactive API Documentation**: **[https://campus-orbit-ai.vercel.app/api-docs](https://campus-orbit-ai.vercel.app/api-docs)**

---

## 📌 Problem Statement (CSE Hackathon 2026)
Organizing large collegiate technical fests, hackathons, conferences, workshops, and placement drives requires continuous coordination of venues, multi-track schedules, audio/visual hardware, student volunteer squads, campus security, catering, and administrative approvals.

Traditional solutions are static spreadsheets or simple text chatbots that are blind to physical constraints (e.g. auditorium seating limits, hardware deficits, double-booked rooms). When unexpected disruptions occur (such as power outages or volunteer shortages), organizers face hours of manual rescheduling.

**CampusFlow AI** solves this by bridging **natural-language requirement parsing** with a **deterministic constraint validation engine** and **autonomous 9-step dynamic replanning** that recalculates operational master plans in seconds.

---

## 🚀 Key Features

- 🧠 **Natural Language Event Requirement Intake**: Parse free-text event descriptions (e.g. *"Plan a 2-day technical fest for 500 students with 6 workshops, 2 seminar halls, 4 labs, 30 volunteers, AV equipment..."*) into structured operational parameters.
- 🏛️ **Venue Planning & Suitability Rankings**: Real-time evaluation of campus halls (Main Auditorium, Seminar Halls A/B, Computer Labs 1/2, Innovation Lab, Open Ground) for seating capacities, acoustics, Wi-Fi mesh coverage, and accessibility.
- 📦 **Hardware Inventory Management**: Automated stock allocation across 8 critical categories (4K laser projectors, wireless mics, PA speakers, power strips, Wi-Fi 6 mesh routers, developer laptops).
- 👥 **Volunteer Squad Coordination**: Roster management of 20 student volunteers across 5 specialized squads (Registration, Tech Support, Hospitality, Security & Logistics, General Coordination) with balanced shift workloads.
- ⚠️ **Deterministic Conflict Detection Engine**: Multi-dimensional collision detection for venue double-bookings, capacity overshoots, equipment deficits, and chronological dependency violations.
- ⚡ **9-Step Dynamic Replanning ("What If?" Center)**: Simulates sudden campus disruptions (e.g. Seminar Hall A HVAC failure, volunteer illness, attendance surge) with side-by-side **BEFORE → AFTER** operational delta comparisons.
- 📊 **Calculated Event Readiness Dashboard**: Mathematically computed 0–100% readiness gauge dynamically weighted across Venues (20%), Hardware (15%), Volunteers (15%), Tasks (20%), Checklists (15%), and Approvals (15%).
- 🛡️ **Human-in-the-Loop Governance**: Mandatory ratification workflows for budget authorizations, night campus security clearances, and major room relocations.
- 📋 **Automated Readiness Checklists**: Interactive domain-specific checklists that recalculate event readiness in real time upon verification.
- 📑 **Stakeholder Operational Briefings**: Auto-generated tailored dossiers for Security Personnel, Technical Crew, Volunteer Squads, and Event Directors.
- 🔌 **Zero-Config Guarantee**: 100% functional out of the box using built-in deterministic planning algorithms—no paid cloud API key required for demonstration.

---

## 🏗️ Multi-Agent Architecture

```
                                USER / ORGANIZER
                                       │
                         [Natural Language Event Brief]
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │   Requirement Analyzer    │
                         │   AI Intake Engine        │
                         └─────────────┬─────────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │   Lead Event Planner      │
                         └─────────────┬─────────────┘
                                       │
           ┌──────────────┬────────────┴────────────┬──────────────┐
           ▼              ▼                         ▼              ▼
    ┌─────────────┐ ┌─────────────┐          ┌─────────────┐ ┌─────────────┐
    │ Venue Agent │ │Schedule Agt │          │Resource Agt │ │Volunteer Agt│
    └──────┬──────┘ └──────┬──────┘          └──────┬──────┘ └──────┬──────┘
           │               │                        │               │
           └───────────────┼────────────────────────┴───────────────┘
                           │
                           ▼
            ┌─────────────────────────────┐
            │   Conflict Engine Agent     │ ◄── Hard Physical Constraints
            └──────────────┬──────────────┘
                           │
                           ▼
            ┌─────────────────────────────┐
            │ Operational Master Plan     │
            │ Tasks • Schedule • Readiness│
            └──────────────┬──────────────┘
                           │
                 [Condition Changes?]
                           │
                           ▼
            ┌─────────────────────────────┐
            │   Replanning Agent          │ ◄── 9-Step What-If Pipeline
            │   (BEFORE vs AFTER Delta)   │
            └──────────────┬──────────────┘
                           │
                           ▼
            ┌─────────────────────────────┐
            │  Human Governance Approval  │
            └─────────────────────────────┘
```

---

## 📂 Project Structure

```
/
├── app/
│   ├── page.tsx                  # Landing Page (Problem/Solution & Showcase)
│   ├── dashboard/                # Executive Readiness Dashboard (Gauge & KPIs)
│   ├── events/                   # Event Intake Studio & NLP Parsing
│   ├── planning/                 # Multi-Agent Planning Hub & Master Timetable
│   ├── venues/                   # Campus Venue Management & Suitability
│   ├── equipment/                # Equipment Inventory & Deficit Warnings
│   ├── volunteers/               # Volunteer Squads & Roster Balancing
│   ├── conflicts/                # Conflict Resolution Center (1-Click Fixes)
│   ├── replan/                   # Dynamic Replanner (Before vs After Delta)
│   ├── approvals/                # Human-in-the-Loop Ratification Center
│   ├── tasks/                    # Task Delegation & Automated Checklist
│   ├── notifications/            # Live Alert Notification Center
│   ├── briefings/                # Stakeholder Dossiers (Security, Tech, Leads)
│   ├── system-flow/              # Visual System Flow & Architecture (Judges)
│   ├── api-docs/                 # Interactive REST API Reference Playground
│   ├── layout.tsx                # AppShell Layout Container
│   └── api/                      # Full REST API Route Handlers
│       ├── health/
│       ├── events/
│       ├── planning/
│       ├── conflicts/
│       ├── venues/
│       ├── equipment/
│       ├── volunteers/
│       ├── tasks/
│       ├── checklists/
│       ├── approvals/
│       ├── replan/
│       ├── notifications/
│       ├── briefings/
│       └── demo/
│
├── components/
│   └── layout/
│       ├── Navbar.tsx            # Header with Role Switcher & Reset CTA
│       ├── Sidebar.tsx           # Navigation Sidebar with live status
│       └── AppShell.tsx          # Responsive Layout Shell
│
├── lib/
│   ├── ai/                       # Modular AI service (Deterministic / Gemini)
│   ├── planner/                  # Intake parser, master planner, replanner
│   ├── conflict-engine/          # Constraint detector & alternative recommender
│   ├── database/                 # In-Memory & Prisma unified data layer
│   └── utils.ts                  # Utility formatting functions
│
├── prisma/
│   └── schema.prisma             # Complete Database schema definition
│
├── tests/
│   └── campusflow.test.ts        # Comprehensive Vitest unit & integration tests
│
├── .env.example                  # Environment variable configuration template
├── package.json                  # Dependencies and execution scripts
├── tailwind.config.ts            # Tailwind styling theme
├── tsconfig.json                 # TypeScript compiler configuration
└── README.md                     # Documentation & Deployment Guide
```

---

## 💻 Local VS Code Execution

### Prerequisites
- Node.js v18+ or v20+ installed
- npm or yarn or pnpm

### Step-by-Step Setup Commands
Execute each command in your VS Code terminal at the root of the project:

```bash
# 1. Install all dependencies
npm install

# 2. Setup environment variables (pre-configured for zero-config local run)
cp .env.example .env.local

# 3. Generate Prisma client
npx prisma generate

# 4. Push database schema (or use in-memory instant store)
npx prisma db push

# 5. Start development server
npm run dev
```

Open your browser and navigate to:
- **Web Application**: [http://localhost:3000](http://localhost:3000)
- **API Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **API Playground**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🧪 Automated Testing

CampusFlow AI includes a full test suite validating NLP intake parsing, conflict detection, hardware shortage alerts, dynamic replanning deltas, and approval state transitions:

```bash
npm test
```

---

## 🌐 Permanent Public Deployment (Vercel + Neon PostgreSQL)

CampusFlow AI is designed for permanent public HTTPS deployment.

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "feat: complete CampusFlow AI agentic platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/campusflow-ai.git
git push -u origin main
```

### 2. Create Cloud Database (Neon PostgreSQL)
1. Go to [Neon.tech](https://neon.tech) and create a free serverless PostgreSQL database.
2. Copy the Connection String:
   `postgresql://user:password@ep-sample.aws.neon.tech/campusflow?sslmode=require`

### 3. Deploy to Vercel
1. Go to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your `campusflow-ai` repository.
3. In **Environment Variables**, add:
   - `DATABASE_URL`: your Neon connection string.
   - `AI_PROVIDER`: `deterministic` (or `gemini` with `GEMINI_API_KEY`).
4. Click **Deploy**.
5. Your app will be live at a permanent URL like `https://campusflow-ai.vercel.app`.

---

## 🎯 Hackathon Demonstration Guide

For live presentation to judges, follow this recommended walkthrough:

1. **Landing Page (`/`)**: Show the problem statement, autonomous multi-agent architecture, and click **"Launch Platform"**.
2. **Readiness Dashboard (`/dashboard`)**: Explain the calculated 84% readiness gauge, 1 active conflict in Seminar Hall A, and pending human approvals.
3. **Conflict Resolution (`/conflicts`)**: Show the detected collision in Seminar Hall A. Click **"Apply Alternative"** (Seminar Hall B) to demonstrate instant resolution.
4. **"What-If" Dynamic Replanning (`/replan`)**: Click **"⚡ Simulate Venue Failure"**. Watch the autonomous 9-step pipeline execute and present the **BEFORE → AFTER** comparison table.
5. **Human Approvals (`/approvals`)**: Switch role to *Security Officer*, click **"Approve & Sign"** on the Night Hackathon clearance, and observe readiness update.
6. **Tasks & Checklists (`/tasks`)**: Tick off checklist items and watch the readiness gauge recalculate in real time.
7. **System Flow (`/system-flow`)**: Walk the judges through the 12-stage operational lifecycle and multi-tier tech stack.

---

## 📄 License
MIT License. Built for the CSE Hackathon 2026.
