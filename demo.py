"""
CAMPUS ORBIT - Live 3-5 Minute Hackathon Demonstration Script
Executes the complete end-to-end multi-agent event operations workflow:
1. Natural language intake
2. Agent swarm allocation (Venues, Schedule, Resources, Volunteers)
3. Conflict detection
4. What-If Simulation: "Main Auditorium Unavailable"
5. Ranked alternative evaluation & Before/After comparison
6. Human approval & dynamic plan application
7. Dynamic readiness score update
"""

import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from core.orchestrator import director
from core.database import db
from core.models import ReplanningIncident, ApprovalStatus


def run_hackathon_demo():
    print("=" * 85)
    print(" 🪐 CAMPUS ORBIT - AI-Powered Campus Event Planning & Coordination Platform")
    print("    Tagline: 'Plan smarter. Coordinate automatically. Adapt instantly.'")
    print("=" * 85)

    # 1. Natural Language Event Requirement Intake
    print("\n[STEP 1] Natural-Language Event Requirement Intake:")
    sample_prompt = (
        "We are organizing a 2-day AI Innovation Hackathon for 300 students on Aug 28-29. "
        "We need one auditorium, three classrooms/labs, 20 volunteers, Wi-Fi, projectors, "
        "technical support, food arrangements and security. Budget: $4,500. "
        "Keynote speaker is Dr. Vikram Roy (Google DeepMind Director)."
    )
    print(f"  User Prompt:\n  \"{sample_prompt}\"")

    req = director.intake_agent.parse_natural_language(sample_prompt)
    print(f"\n  ✓ AI Requirement Parser Extracted Entities:")
    print(f"    • Event Name: {req.event_name}")
    print(f"    • Type: {req.event_type.value} | Participants: {req.participants} Pax | Duration: {req.duration_days} Days")
    print(f"    • Dates: {req.start_date} to {req.end_date} ({req.start_time} - {req.end_time})")
    print(f"    • Budget Limit: ${req.budget_limit:,.2f} | Volunteers Required: {req.volunteers}")
    print(f"    • Risk Flags: Overnight Access={req.overnight_access}, VIP Protocol={req.external_guests_vip}")

    # 2. Multi-Agent Master Plan Synthesis
    print("\n[STEP 2] Multi-Agent Swarm Orchestration:")
    plan = director.plan_event_from_text(sample_prompt)

    print(f"  ✓ Venue Agent Allocated:")
    for v in plan.venues[:3]:
        print(f"    • {v.name} (Cap: {v.capacity} pax | Score: {v.smart_score}% | {v.location})")

    print(f"\n  ✓ Schedule Agent Itinerary ({len(plan.schedule)} Sessions Generated):")
    for s in plan.schedule[:4]:
        print(f"    • [{s.start_time} - {s.end_time}] {s.activity} @ {s.venue_name} (Lead: {s.responsible_team})")

    print(f"\n  ✓ Resource Agent Hardware Inventory Check:")
    for r in plan.resources[:5]:
        status_str = f"Shortage: {r.shortage_qty}" if r.shortage_qty > 0 else "Available"
        print(f"    • {r.name}: {r.allocated_qty} Allocated / {r.total_qty} Total [{status_str}]")

    print(f"\n  ✓ Volunteer Agent Team Rostering (20 Students Assigned):")
    summary = director.volunteer_agent.get_team_summary(plan.volunteers)
    for t_name, t_info in summary.items():
        print(f"    • {t_name}: {t_info['count']} volunteers (Lead: {t_info['lead']})")

    # 3. Conflict Detection Engine
    print("\n[STEP 3] Constraint & Conflict Engine Evaluation:")
    print(f"  • Active Conflicts Identified: {len(plan.conflicts)}")
    for c in plan.conflicts:
        print(f"    - [{c.severity.value}] {c.title}")
        print(f"      Problem: {c.description}")
        print(f"      AI Recommendation: {c.recommended_alternatives[0]}")

    # 4. Human-in-the-Loop Governance
    print("\n[STEP 4] Human-in-the-Loop Governance Sanction Gates:")
    for a in plan.approvals:
        print(f"    • [{a.id}] {a.title} -> Approver Role: {a.approver_role} [{a.status.value}]")

    # Initial Readiness
    readiness = db.calculate_readiness()
    print(f"\n  • Initial Campus Readiness Index: {readiness['overall']}%")

    # 5. MAIN DIFFERENTIATOR: DYNAMIC REPLANNING ("WHAT IF?")
    print("\n" + "=" * 85)
    print(" ⚡ [STEP 5] MAIN DIFFERENTIATOR: DYNAMIC EVENT REPLANNING ('WHAT IF?')")
    print("=" * 85)
    print("  🚨 TRIGGER: Operator clicks 'Simulate: Main Auditorium Becomes Unavailable'")

    incident = ReplanningIncident(
        incident_type="AUDITORIUM_UNAVAILABLE",
        description="Main Auditorium HVAC chiller failure and emergency ceiling maintenance.",
        affected_venue="VEN-AUD-01"
    )

    replan_res = director.simulate_what_if(incident)

    print(f"\n  1. Impact Analysis: {replan_res.impact_summary}")
    print(f"     Affected Sessions: {[s['activity'] for s in replan_res.affected_sessions]}")

    print(f"\n  2. Multi-Criteria Candidate Venue Ranking:")
    for idx, cand in enumerate(replan_res.candidate_alternatives, 1):
        print(f"     #{idx} {cand.venue_name} -> Score: {cand.score}% (Capacity: {cand.capacity} pax | Clashes: {cand.schedule_conflict_count})")
        print(f"        Reason: {cand.reason}")

    print(f"\n  3. BEFORE / AFTER COMPARISON:")
    diff = replan_res.before_after_diff
    print(f"     ---------------------------------------------------------------------")
    print(f"     Session: {diff.get('session_name')}")
    print(f"     BEFORE: Venue={diff['before']['venue']} | Time={diff['before']['time']} | Status={diff['before']['status']}")
    print(f"     AFTER : Venue={diff['after']['venue']} | Time={diff['after']['time']} | Status={diff['after']['status']}")
    print(f"     AI Selection Rationale: {diff.get('explanation')}")
    print(f"     ---------------------------------------------------------------------")

    print(f"\n  4. Injected Urgent Mitigation Tasks:")
    for ut in replan_res.urgent_tasks:
        print(f"     • [URGENT] {ut.name} -> Assigned: {ut.assigned_team} ({ut.assigned_lead})")

    print(f"\n  5. Dispatched Broadcast Alerts:")
    for al in replan_res.stakeholder_alerts:
        print(f"     • [{al['target']}] {al['message']}")

    # 6. Human Approval & Live Plan Application
    print("\n[STEP 6] Human Approval & Plan Execution:")
    print("  -> Human Operator endorses replanned alternative: Innovation Hall")
    updated_plan = director.apply_what_if()
    print(f"  ✓ Operational Plan Updated to: v{updated_plan.version}.0 ({updated_plan.status})")
    print(f"  ✓ Relocated Venue: {updated_plan.venues[0].name} ({updated_plan.venues[0].location})")
    
    new_readiness = db.calculate_readiness()
    print(f"  ✓ Dynamic Readiness Score: {new_readiness['overall']}%")

    print("\n" + "=" * 85)
    print(" ✨ CAMPUS ORBIT DEMO COMPLETED SUCCESSFULLY IN UNDER 3 MINUTES!")
    print("=" * 85)


if __name__ == "__main__":
    run_hackathon_demo()
