# 🪐 CAMPUS ORBIT
> **Plan smarter. Coordinate automatically. Adapt instantly.**

An agentic AI platform that transforms natural-language campus event requirements into executable operational plans, validates hard physical constraints, coordinates cross-functional squads, and dynamically replans when real-world conditions change.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB.svg?style=flat&logo=python)](https://python.org)
[![Tailwind CSS](https://img.shields.io/badge/Frontend-Tailwind_CSS-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Multi-Agent AI](https://img.shields.io/badge/Architecture-Multi--Agent_AI-8B5CF6.svg?style=flat)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Problem Statement (CSE Hackathon 2026)
**Domain:** College / Campus Operations / Multi-Agent AI  
Organizing large collegiate events (hackathons, symposiums, fests) involves complex logistics across dozens of stakeholders: booking auditoriums, ensuring adequate seating capacity, checking A/V hardware inventory, aligning multi-day timelines, assigning student volunteer squads, obtaining security clearances, and handling unexpected disruptions.

Traditional tools are either static spreadsheets or simple text chatbots that lack awareness of physical constraints. **Campus Orbit** solves this by bridging natural language understanding with deterministic multi-agent constraint validation and instant dynamic replanning.

---

## 🚀 Key Features

- 🧠 **Natural-Language Event Requirement Intake**: Parse free-text event descriptions into structured operational parameters (venues, headcounts, equipment, squads, dates, budgets).
- 🏛️ **Venue Planning & Alternative Ranking**: Evaluates 7 campus venues for seating capacity, projectors, microphones, Wi-Fi mesh, and accessibility.
- 📦 **Resource & Hardware Inventory Management**: Balances stock across 8 critical categories (Projectors, Mics, Laptops, Power Strips, Wi-Fi Routers, Speakers, Chairs, Tables) with automated deficit mitigation.
- 👥 **Volunteer & Support Squad Coordination**: Organizes 20 organizers across 5 specialized squads (Registration, Tech Support, Hospitality, Security, General).
- ⏱️ **Visual Chronological Schedule**: Multi-track timeline synchronizing activity duration, room bookings, equipment needs, and prerequisite dependencies.
- ⚠️ **Constraint & Conflict Engine**: Continuous multi-dimensional collision detection for room double-bookings, capacity overshoots, and hardware deficits.
- ⚡ **Dynamic Replanning ("What If?" Simulation Center)**: Simulates sudden disruptions (e.g. Auditorium outage, equipment breakdown, volunteer sick leave, delays) through a 9-step adaptive replanning pipeline with side-by-side **BEFORE vs AFTER** state comparison.
- 📊 **Calculated Event Readiness Dashboard**: Dynamically computed readiness score (0–100%) weighted across 8 operational domains.
- 🛡️ **Human-in-the-Loop Governance**: Mandatory human ratification for budgets, night permissions, security protocols, and major facility relocations.
- 💡 **AI Explainability ("WHY?" Buttons)**: Transparent consensus rationale explaining why specific venues or alternatives were selected.
- 🔌 **Zero-Config Demo Mode**: Works 100% out of the box with realistic deterministic data—no paid API key or cloud database required for demonstration.

---

## 🏗️ Multi-Agent Architecture

```
                                USER / ORGANIZER
                                       │
                         [Natural Language Event Brief]
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │   Requirement Parser &    │
                         │   AI Intake Engine        │
                         └─────────────┬─────────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │ Event Manager Agent (Lead)│
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

### Agent Roles & Responsibilities

| Agent | Responsibility |
|---|---|
| **Event Manager Agent** | Decomposes event brief, coordinates domain agents, synthesizes operational master plan, calculates readiness. |
| **Venue Agent** | Validates room capacity, A/V equipment, Wi-Fi coverage, accessibility, and ranks alternatives. |
| **Schedule Agent** | Builds chronologies, prevents time collisions, manages slot dependencies, and balances track duration. |
| **Resource Agent** | Manages hardware inventory (8 categories), tracks allocations, detects shortages, and formulates borrowing vouchers. |
| **Volunteer Agent** | Directs 5 functional squads, assigns team leads, balances workloads, and reallocates floaters during shortages. |
| **Conflict Agent** | Deterministic hard-constraint validator detecting venue collisions, capacity overshoots, and inventory deficits. |
| **Replanning Agent** | 9-step simulation engine for sudden campus disruptions with candidate ranking and Before/After delta comparison. |

---

## 💻 Technology Stack

- **Backend:** Python 3.12, FastAPI, Pydantic v2, Uvicorn, Requests, Pytest
- **Frontend:** HTML5, Modern Vanilla JavaScript (ES6 Modules), Tailwind CSS, Glassmorphism UI
- **AI Integration:** Dual-mode engine: Google Gemini API / OpenAI API with automatic deterministic semantic NLP fallback (Demo Mode)
- **Data Layer:** Thread-safe state store with instant reset-to-demo functionality and SQLite persistence
- **Tunneling:** Node.js live HTTPS tunnel helper (`scripts/start_tunnel.js`)

---

## 📂 Project Structure

```
campus-orbit/
│
├── README.md                           # Master project documentation
├── DEMO_GUIDE.md                       # 3-5 Minute judge presentation script
├── .gitignore                          # Git exclusions (no secrets/temp files)
├── .env.example                        # Environment template
├── package.json                        # Node scripts & tunnel helpers
├── requirements.txt                    # Python dependencies
│
├── backend/
│   ├── app.py                          # FastAPI server & route orchestration
│   ├── config.py                       # App settings & mode configuration
│   ├── agents/                         # Logical Multi-Agent AI system
│   │   ├── __init__.py
│   │   ├── base_agent.py               # Abstract Base Agent
│   │   ├── event_manager.py            # Master Orchestrator Agent
│   │   ├── venue_agent.py              # Space & Facilities Optimizer
│   │   ├── schedule_agent.py           # Temporal & Timeline Orchestrator
│   │   ├── resource_agent.py           # Hardware Logistics Manager
│   │   ├── volunteer_agent.py          # Workforce & Squad Coordinator
│   │   ├── conflict_agent.py           # Hard Constraint Collision Validator
│   │   └── replanning_agent.py         # 9-Step Dynamic Replanning Engine
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py                  # Pydantic data schemas
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_service.py               # Dual-mode AI & NLP parser
│   │   ├── state_store.py              # In-memory thread-safe state store
│   │   └── readiness_service.py        # Calculated 8-category readiness index
│   ├── data/
│   │   ├── __init__.py
│   │   └── seed_data.py                # Preloaded campus venues, stock & squads
│   └── routers/
│       ├── __init__.py
│       ├── events.py                   # Event intake & master plan routes
│       ├── venues.py                   # Venue matrix & status routes
│       ├── resources.py                # Inventory & shortage routes
│       ├── volunteers.py               # Volunteer squad routes
│       ├── schedule.py                 # Timeline & slot routes
│       ├── conflicts.py                # Conflict detection & resolve routes
│       ├── tasks.py                    # Checklists & task routes
│       ├── readiness.py                # Readiness score API
│       ├── approvals.py                # Governance & human approval routes
│       ├── simulation.py               # What-If simulation center routes
│       ├── notifications.py            # Activity alert feeds
│       └── system.py                   # System status & explainability
│
├── frontend/
│   ├── index.html                      # Modern SaaS single-page application
│   ├── css/
│   │   └── styles.css                  # Modern styling & glassmorphism
│   └── js/
│       ├── app.js                      # Master SPA router
│       ├── api.js                      # REST API client
│       ├── utils/
│       │   ├── toast.js                # Toast alert notifications
│       │   └── explain_modal.js        # "WHY?" explainability modal
│       └── components/
│           ├── navbar.js               # Top header & readiness ring
│           ├── landing.js              # Hero landing page & workflow
│           ├── dashboard.js            # Live operations dashboard
│           ├── ai_planner.js           # Natural language event intake
│           ├── event_plan.js           # Master operational plan
│           ├── venues.js               # Campus facilities grid
│           ├── resources.js            # Hardware inventory manager
│           ├── volunteers.js           # Volunteer squads & shift roster
│           ├── schedule.js             # Visual run-of-show timeline
│           ├── conflicts.js            # Collision detection center
│           ├── simulation.js           # "What If?" Simulation Center
│           ├── tasks.js                # Task checklists & delegation
│           ├── readiness.js            # 8-Category readiness audit
│           ├── approvals.js            # Human-in-the-loop governance
│           ├── notifications.js        # Real-time event log
│           └── settings.js             # Runtime configuration
│
├── scripts/
│   ├── run_app.py                      # Python backend launcher
│   ├── run_app.bat                     # Windows batch launcher
│   └── start_tunnel.js                 # Live HTTPS public tunnel helper
│
└── tests/
    ├── test_agents.py                  # Multi-agent unit & integration tests
    └── test_api.py                     # FastAPI endpoint test suite
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- Python 3.10+ (Recommended: Python 3.12)
- Node.js 18+ (Optional, for public tunnel helper)

### 2. Clone Repository & Install Dependencies
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/campus-orbit.git
cd campus-orbit

# Install Python requirements
pip install -r requirements.txt
```

### 3. Run Application Locally
```bash
# Start backend server
python scripts/run_app.py

# Or on Windows:
scripts\run_app.bat
```

Open your browser and navigate to:
- **Web Application:** `http://127.0.0.1:8000`
- **Interactive Swagger API Docs:** `http://127.0.0.1:8000/docs`

---

## 🌐 Public Tunnel Instructions (For Judges & Mentors)

To generate a live, shareable public HTTPS link for remote hackathon judges:

```bash
# In a separate terminal:
npm run tunnel
# OR:
node scripts/start_tunnel.js
```
The script will output a real, active HTTPS URL (e.g., `https://campus-orbit-demo.loca.lt`).

---

## 🧪 Running Automated Tests

Campus Orbit comes with a complete test suite covering all 7 agents and API routes:

```bash
pytest tests/ -v
```

---

## 📖 3-Minute Demo Walkthrough

1. **Intake Event Requirements:** Navigate to `#ai-planner`, load the sample prompt (*"2-day AI hackathon for 300 students..."*), click **Extract Requirements**, and click **GENERATE EVENT PLAN**.
2. **Review Operational Plan:** Navigate to `#event-plan` to inspect allocated venues, chronological run-of-show, equipment matrices, and AI consensus rationales.
3. **Inspect Conflicts:** Navigate to `#conflicts` to observe the Main Auditorium double-booking and click **APPLY RECOMMENDATION** to automatically relocate the guest lecture to Innovation Hall.
4. **Simulate Disruption (The Showcase Feature):** Navigate to `#simulation` (Simulation Center / What If?). Click **"Main Auditorium Becomes Unavailable"**.
   - Watch the **9-stage multi-agent pipeline** execute.
   - Inspect the **BEFORE vs AFTER** visual comparison card.
   - Click **Why this selection?** to see the explainability modal.
   - Click **APPLY APPROVED REVISED PLAN** to commit the changes live!
5. **Verify Live Updates:** Navigate to `#schedule` and `#readiness` to see updated venue assignments and recalculated readiness scores.

---

## 🛠️ GitHub Push Commands

```bash
git init
git add .
git commit -m "Initial Campus Orbit project - CSE Hackathon 2026"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

---

## 🏆 Hackathon Team Contribution
- **Project:** CAMPUS ORBIT
- **Hackathon:** CSE Hackathon 2026
- **Domain:** College / Campus Operations / Multi-Agent AI
- **Tagline:** *"Plan smarter. Coordinate automatically. Adapt instantly."*
