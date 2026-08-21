# 🎬 CAMPUS ORBIT — 3-5 MINUTE HACKATHON DEMO SCRIPT

> **Tagline:** *"Plan smarter. Coordinate automatically. Adapt instantly."*  
> **Presenter Goal:** Demonstrate that Campus Orbit is not just a chatbot, but an agentic multi-agent orchestration engine that validates hard physical constraints and dynamically adapts to disruptions in real time.

---

## ⏱️ Step-by-Step Demonstration Flow (3–5 Minutes)

### 1. Opening Hook (30 seconds)
- **Action:** Open `http://127.0.0.1:8000` (Landing Page).
- **Pitch:**  
  *"Good morning judges. Planning collegiate events like hackathons or conferences involves balancing hundreds of physical constraints—auditorium capacities, projector inventory, volunteer shifts, and curfew permissions. When conditions change—like a hall breaking down—manual replanning is chaotic.  
  Meet **Campus Orbit**: an agentic multi-agent platform that turns natural-language briefs into executable plans and dynamically replans the moment disruptions happen."*

---

### 2. Natural Language Event Intake & AI Planner (45 seconds)
- **Action:** Click **"TRY AI PLANNER"** in the top navbar or hero.
- **Action:** Click **"Load Sample Hackathon Prompt"** (or type):
  > *"We are organizing a 2-day AI hackathon for 300 students. We need one auditorium, three classrooms, 20 volunteers, Wi-Fi, projectors, technical support, food arrangements and security."*
- **Action:** Click **"Extract Requirements"**.
- **Point out to judges:**
  - Show how the NLP parser extracted: Event Name, 300 participants, 2 days duration, 20 volunteers, required venues, equipment list, budget, and security flags into clean editable fields.
- **Action:** Click the purple button **"GENERATE EVENT PLAN"**.
- **Pitch:**  
  *"Notice what just happened: The master Event Manager Agent delegated tasks in parallel to 5 domain agents—Venue Agent, Schedule Agent, Resource Agent, Volunteer Agent, and Conflict Agent."*

---

### 3. Operational Master Plan & Subsystem Breakdown (45 seconds)
- **Action:** You are now on `#event-plan`.
- **Point out to judges:**
  - **Venues Allocated:** Main Auditorium (500 Cap) + 3 CSE Labs (60 workstations each).
  - **Volunteer Squads:** 20 organizers divided into 5 squads (Registration, Tech Support, Hospitality, Security, General).
  - **Visual Schedule Timeline:** Chronological Day 1 & Day 2 run-of-show with prerequisites and team tags.
  - **AI Consensus Reasoning:** Click any **"Why?"** button on the reasoning cards to show transparent explainability.
- **Action:** Click **"Stakeholder Briefing"** to demonstrate one-click Markdown run-of-show export.

---

### 4. Calculated Event Readiness Dashboard (30 seconds)
- **Action:** Click **"Readiness"** in the sidebar (or `#readiness`).
- **Point out to judges:**
  - *"Campus Orbit doesn't guess event readiness. It dynamically calculates an 8-category weighted readiness index (82%)."*
  - Show the categories: Venue Planning (100%), Equipment (85%), Volunteers (90%), Security (70%), Permissions (60%).
  - Point out the active blockers: *Pending Midnight Catering Budget ($1,200)*.

---

### 5. Constraint Engine & Conflict Detection (30 seconds)
- **Action:** Click **"Conflicts"** in the sidebar (or `#conflicts`).
- **Point out to judges:**
  - Show the **Critical Conflict**: *Main Auditorium double-booking between Opening Ceremony (10:00–12:00) and University Guest Lecture (11:00–13:00)*.
  - Show the AI Recommendation: *Move Guest Lecture to Innovation Hall (Capacity: 250)*.
  - Click **"Why this recommendation?"** to show the explainability rationale.
  - Click **"APPLY RECOMMENDATION"** to resolve it with a single click!

---

### 6. The Showcase: Simulation Center ("What If?" Dynamic Replanning) (90 seconds)
- **Action:** Click **"Simulation Center"** in the sidebar (or `#simulation`).
- **Pitch:**  
  *"Now let's demonstrate the most powerful feature of Campus Orbit: **Dynamic Replanning**."*
- **Action:** Select Scenario #1: **"Main Auditorium Becomes Unavailable"** (HVAC electrical breakdown).
- **Point out the 9-Stage Stepper:**
  1. *Disruption Intake & Anomaly Detection*
  2. *Downstream Impact Analysis (300 participants affected)*
  3. *Hard Constraint Verification (Seating ≥ 250, AV, 1Gbps Wi-Fi, Ramp accessibility)*
  4. *Candidate Alternative Search (Queried 7 campus venues)*
  5. *Multi-Criteria Fitness Ranking (#1: Innovation Hall at 94%, #2: Convention Hall at 89%)*
  6. *Synthesize Revised Operational Plan*
  7. *Compute Before vs After Delta*
  8. *Human Approval Governance Trigger*
  9. *Execution Ready*
- **Point out the BEFORE vs AFTER View:**
  - **BEFORE:** Main Auditorium | 10:00 AM | Status: Unavailable
  - **AFTER:** Innovation Hall | 10:00 AM | Status: Available & Reserved
  - Reason: *"Innovation Hall satisfies capacity, equipment and availability requirements while creating no new schedule conflicts."*
- **Action:** Click **"APPLY APPROVED REVISED PLAN"**.

---

### 7. Verifying the Live Adaptation (30 seconds)
- **Action:** Navigate to **Schedule** (`#schedule`) and **Venues** (`#venues`).
- **Point out to judges:**
  - Opening Ceremony has been live-relocated to **Innovation Hall** with status badge `Relocated`.
  - Main Auditorium status is now marked as `Maintenance`.
  - Open **Approvals** (`#approvals`) to show human governance ticket created.

---

### 8. Closing Pitch (15 seconds)
- **Pitch:**  
  *"Campus Orbit delivers true agentic AI: transparent, deterministic, physically grounded, and instantly adaptive to real-world campus disruptions. Thank you!"*

---

## 💡 Key Highlights to Emphasize to Judges

| Feature | Why it Wins |
|---|---|
| **Zero Mockups** | Everything is 100% functional, runnable, and connected to FastAPI backend APIs. |
| **Demo Mode Guarantee** | Zero risk of API outage or missing credit during presentation; works perfectly out of the box. |
| **Explainable AI** | Every decision has a "WHY?" button grounded in physical constraints. |
| **Human-in-the-Loop** | High-risk items (budget, permits) require explicit human sign-off. |
| **Before / After Delta** | Visually proves autonomous replanning in seconds. |
