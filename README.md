# CAMPUS ORBIT

### AI-Powered Campus Event Planning & Coordination Platform

> **Tagline**: *"Plan smarter. Coordinate automatically. Adapt instantly."*  
> **Domain**: Multi-Agent Campus Event Operations & Dynamic Replanning

---

## 1. Executive Summary

Campus events (technical fests, conferences, hackathons, workshops, and placement drives) are operationally complex logistics ecosystems. Managing them manually leads to venue double-bookings, equipment shortages, unapproved curfew violations, and runtime chaos during disruptions.

**CAMPUS ORBIT** is an agentic operations platform that transforms natural-language event requirements into structured operational plans, enforces deterministic constraints across campus infrastructure, coordinates volunteer & equipment resources, and dynamically replans in real time when conditions change.

---

## 2. Multi-Agent System Architecture

```
                                      USER
                                       ↓
                        Natural-Language Event Description
                                       ↓
                             AI Requirement Parser
                                       ↓
                          Structured Event Requirements
                                       ↓
                             AI Event Orchestrator
                                       ↓
        ┌───────────────┬──────────────┬──────────────┬──────────────┐
        ↓               ↓              ↓              ↓              ↓
   Venue Agent   Schedule Agent  Resource Agent Volunteer Agent Approval Gate
        └───────────────┴──────────────┴──────────────┴──────────────┘
                                       ↓
                          Constraint & Conflict Engine
                                       ↓
                            Operational Event Plan
                                       ↓
                                Task Delegation
                                       ↓
                              Readiness Dashboard
                                       ↓
                                 Notifications
                                       ↓
                                Human Approval
                                       ↓
                    ⚡ DYNAMIC REPLANNING (WHEN CONDITIONS CHANGE)
```

### Conceptual Sub-Agents

| Agent | Responsibility | Key Output |
|---|---|---|
| **Event Manager Agent** | High-level synthesis & goal formulation | Unified Master Operational Plan |
| **Intake Agent** | NLP semantic entity extraction | Event Type, Pax, Dates, Venues, Budget, Flags |
| **Venue Agent** | Capacity, AV, Wi-Fi, accessibility check & scoring | Multi-criteria ranked venues & "Why this venue?" |
| **Schedule Agent** | Chronological timeline synthesis | Conflict-free session schedule with assigned leads |
| **Resource Agent** | Equipment inventory & shortage detection | Allocation meters & inter-department borrowing |
| **Volunteer Agent** | Skill matching & team allocation | 5 Specialized student teams (Registration, Tech, etc.) |
| **Conflict Agent** | Collision & constraint engine | Double-booking, capacity, sound curfew clashes & fixes |
| **Approval Agent (HITL)** | Institutional compliance & sign-off gates | Dean budget sanction, CSO overnight access waivers |
| **Replanning Agent** | **"WHAT IF?" Dynamic Replanning Engine** | Disruption impact analysis, ranked alternatives, **Before/After Diff** |

---

## 3. Main Differentiator: Dynamic Event Replanning ("WHAT IF?")

When unexpected disruptions happen during campus events, Campus Orbit recalculates affected parameters in seconds:

### Disruption Simulation Demo Flow:
1. **Operator Triggers Disruption**: `"Main Auditorium Becomes Unavailable"` (HVAC chiller failure).
2. **Impact Detection**: System detects 3 affected keynote sessions.
3. **Multi-Criteria Alternative Evaluation**: Evaluates all campus venues on Capacity, AV gear, Wi-Fi 6, accessibility, and timetable clashes:
   - **#1 Innovation Hall** $\rightarrow$ **Score: 94%** (Capacity: 250 pax, AV projector, Wi-Fi 6, 0 conflicts)
   - **#2 Convention Hall** $\rightarrow$ **Score: 88%** (Capacity: 400 pax, 1 conflict)
   - **#3 Seminar Hall** $\rightarrow$ **Score: 75%** (Capacity: 180 pax, capacity shortfall)
4. **Before / After Visual Diff**:
   - **BEFORE**: Opening Ceremony | Main Auditorium | 10:00 AM | Status: *Unavailable (Maintenance)*
   - **AFTER**: Opening Ceremony | Innovation Hall | 10:00 AM | Status: *Relocated & Confirmed*
   - **AI Selection Rationale**: *"Main Auditorium became unavailable. Innovation Hall meets the required capacity (250/200), presentation projectors, high-density Wi-Fi 6, and has zero schedule conflicts."*
5. **Urgent Injected Tasks & Alerts**:
   - Injects `Migrate Stage Signage & AV Booth to Innovation Hall` to Tech Lead Rohan Mehta.
   - Dispatches broadcast to attendees and security perimeter gates.
6. **Human Approval & Dynamic Update**:
   - One-click approval updates the active plan, schedule, tasks, and dynamic readiness score.

---

## 4. Built-in Campus Datasets & Knowledge Base

### Campus Venues Catalog
- **Main Auditorium**: Capacity 500 | Projector: Yes | Mics: 4 | Wi-Fi: Yes | Accessibility: Yes
- **Innovation Hall**: Capacity 250 | Projector: Yes | Mics: 3 | Wi-Fi: Yes | Accessibility: Yes
- **Convention Hall**: Capacity 400 | Projector: Yes | Mics: 4 | Wi-Fi: Yes | Accessibility: Yes
- **Seminar Hall**: Capacity 180 | Projector: Yes | Mics: 2 | Wi-Fi: Yes | Accessibility: Yes
- **CSE Lab 1**: Capacity 60 | GPU Computers: 60 | Wi-Fi: Yes | Dedicated UPS
- **CSE Lab 2**: Capacity 60 | Dev Workstations: 60 | Wi-Fi: Yes
- **CSE Lab 3**: Capacity 60 | IoT & Makerspace: 60 | Wi-Fi: Yes
- **Open Air Amphitheatre**: Capacity 1200 | Open Stage | High-Mast Lights

### Resource Inventory
- Projectors (8), Microphones (12), Laptops (120), Extension Boards (30), Wi-Fi Routers (8), Speakers (6), Chairs (500), Tables (100).
- Actionable AI Borrowing Recommendations (e.g. *"Borrow 1 projector from ECE Seminar Hall"*).

### Volunteer Teams (20 Student Volunteers)
- **Registration Team** (4 vols) - Lead: Pooja Verma
- **Technical Support** (5 vols) - Lead: Aarav Sharma
- **Hospitality** (4 vols) - Lead: Ananya Iyer
- **Security Coordination** (3 vols) - Lead: Vikram Rathore
- **General Support** (4 vols) - Lead: Sneha Patel

---

## 5. Quick Start & Execution

### 1. Launch Interactive Web Dashboard
Run from terminal or double-click `run_app.bat`:
```bash
python app.py
```
Open your browser and navigate to: **`http://127.0.0.1:8000`**

### 2. Run 3-Minute Live Hackathon Demo Script
```bash
python demo.py
```

### 3. Run Automated Unit Test Suite
```bash
python -m unittest discover -s tests -v
```

---

## 6. Directory Structure

```
c:\Users\PC\Documents\problem/
├── .env.example                # Environment variables template (Demo mode enabled)
├── README.md                   # Full system documentation & hackathon guide
├── run_app.bat                 # 1-Click launcher for Windows
├── app.py                      # Master REST API & Web Server (Python standard library)
├── static/
│   ├── index.html              # Modern single-page enterprise application UI
│   ├── styles.css              # Dark slate theme, glassmorphism, responsive grid
│   └── app.js                  # Frontend state machine, dynamic replanning & router
├── core/
│   ├── __init__.py
│   ├── models.py               # Strongly typed schemas & enums
│   ├── database.py             # Campus catalog & stateful repository
│   ├── orchestrator.py         # Multi-Agent Director (CampusEventDirector)
│   └── agents/
│       ├── intake_agent.py     # NLP Requirement Parser & Entity Extractor
│       ├── venue_agent.py      # Venue Matching, Smart Scoring & "Why?" Engine
│       ├── schedule_agent.py   # Chronological Timeline & Activity Scheduler
│       ├── resource_agent.py   # Hardware Inventory & Shortage Recommender
│       ├── volunteer_agent.py  # Volunteer Roster & Team Allocator
│       ├── conflict_agent.py   # Deterministic Constraint & Collision Engine
│       ├── approval_agent.py   # Human-in-the-Loop Governance Gatekeeper
│       ├── briefing_agent.py   # Multi-Stakeholder Briefing Generator
│       └── replanning_agent.py # Dynamic Replanning & "What-If" Simulation Engine
└── tests/
    └── test_event_planner.py   # Unit test suite verifying all 7 core capabilities
```
