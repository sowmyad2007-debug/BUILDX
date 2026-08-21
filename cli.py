"""
Interactive Command Line Interface (CLI) for Campus Event Planning Multi-Agent Platform.
"""

import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
import argparse
from core.orchestrator import CampusEventDirector
from core.models import ReplanningIncident


def print_banner():
    print("=" * 80)
    print(" 🏛️  AI CAMPUS EVENT PLANNING & COORDINATION MULTI-AGENT PLATFORM")
    print("    Domain: College / Campus Operations / Multi-Agent AI")
    print("=" * 80)


def format_plan_cli(plan):
    req = plan.requirement
    print(f"\n📌 EVENT SPECIFICATION: {req.event_name}")
    print(f"   Type: {req.event_type.value} | Expected Footfall: {req.expected_attendees} pax")
    print(f"   Dates: {req.start_date} to {req.end_date} ({req.start_time} - {req.end_time})")
    print(f"   Financial Estimate: ${plan.estimated_cost:,.2f} / Budget Cap: ${req.budget_limit:,.2f}")
    print(f"   Readiness Score: {plan.readiness_score}% (Status: {plan.status})")

    print("\n🏛️  ALLOCATED CAMPUS VENUES:")
    for v in plan.allocated_venues:
        print(f"   • {v.name} (Cap: {v.capacity} pax | {v.location_block} | AC: {v.ac} | Wi-Fi: {v.wifi_speed_mbps} Mbps)")

    print("\n🛠️  EQUIPMENT & HARDWARE ALLOCATION:")
    for eq_id, qty in plan.allocated_equipment.items():
        print(f"   • {eq_id}: {qty} units reserved")

    print("\n🤝 STUDENT VOLUNTEER ROSTER:")
    for vol in plan.allocated_volunteers:
        print(f"   • {vol['volunteer_name']} ({vol['department']} Yr-{vol['year']}) -> {vol['assigned_role']} [{vol['shift']}]")

    print("\n🏢 INSTITUTIONAL SUPPORT TEAMS:")
    for st in plan.allocated_support_teams:
        print(f"   • {st.team_name}: {st.headcount_allocated} personnel (Lead: {st.lead_contact})")

    print("\n⚠️  CONFLICTS & AI RECOMMENDATIONS:")
    if not plan.conflicts:
        print("   ✅ Zero collisions detected. All venue, equipment and timetable constraints satisfied.")
    else:
        for c in plan.conflicts:
            print(f"   [{c.severity.value}] {c.title}")
            print(f"       Problem: {c.description}")
            print("       AI Alternative Recommendations:")
            for alt in c.recommended_alternatives:
                print(f"         -> {alt}")

    print("\n📋 OPERATIONAL MILESTONE TASKS (WBS):")
    for t in plan.tasks[:6]:
        print(f"   [{t.milestone_phase}] {t.title} -> Assigned: {t.assigned_lead} [{t.status.value}]")

    print("\n🛡️  GOVERNANCE & HUMAN APPROVAL TICKETS (HITL):")
    for app in plan.approvals:
        print(f"   • [{app.id}] {app.title} -> Approver: {app.approver_role} [{app.status.value}]")


def main():
    parser = argparse.ArgumentParser(description="AI Campus Event Planning Multi-Agent Platform")
    parser.add_argument("--prompt", "-p", type=str, help="Natural language event description")
    parser.add_argument("--demo", action="store_true", help="Run automated end-to-end multi-agent demo")
    args = parser.parse_args()

    print_banner()
    director = CampusEventDirector()

    if args.demo or not args.prompt:
        default_prompt = (
            "We need to organize a 2-day National AI Hackathon on 2026-10-15 to 2026-10-16. "
            "Expected 200 participants. We need Advanced AI Lab 1 and Cloud Lab 2 with high-speed 1 Gbps Wi-Fi, "
            "20 VR headsets, 50 power spike strips, 4 microphones, overnight 24-hour campus lab access, "
            "hostel shuttle transport buses, food catering (midnight pizza/coffee, breakfast, lunch), "
            "and keynote stage in Dr. APJ Abdul Kalam Main Auditorium. Budget: $4,500. "
            "Keynote speaker is Dr. Vikram Roy (Google DeepMind Director)."
        )
        prompt_to_use = args.prompt or default_prompt
    else:
        prompt_to_use = args.prompt

    print(f"\n[1/4] Processing Natural Language Prompt:\n\"{prompt_to_use}\"")
    plan = director.plan_event_from_text(prompt_to_use)

    format_plan_cli(plan)

    print("\n" + "=" * 80)
    print(" [2/4] TESTING HUMAN-IN-THE-LOOP (HITL) APPROVAL WORKFLOW")
    print("=" * 80)
    if plan.approvals:
        first_app = plan.approvals[0]
        print(f"Endorsing approval ticket: {first_app.id} ({first_app.title})")
        director.process_human_approval(
            plan.event_id,
            first_app.id,
            approver_name="Prof. S. R. Ramanathan (Registrar)",
            action="APPROVED",
            comments="Clearance granted under University Tech Initiative fund."
        )
        print(f"✅ Ticket {first_app.id} status updated to: {first_app.status.value}")
        print(f"Updated Readiness Score: {plan.readiness_score}%")

    print("\n" + "=" * 80)
    print(" [3/4] TESTING DYNAMIC REPLANNING CONTINGENCY ENGINE")
    print("=" * 80)
    incident = ReplanningIncident(
        incident_type="SPEAKER_DELAY",
        description="Keynote speaker flight delayed by 90 minutes due to bad weather at transit airport",
        time_offset_minutes=90,
        reported_by="Faculty Coordinator"
    )
    print(f"🚨 Runtime Incident Reported: {incident.description}")
    replan_result = director.dynamic_replan(plan.event_id, incident)
    print(f"⚡ Dynamic Impact Summary: {replan_result.impact_summary}")
    print("Schedule Adjustments:")
    for adj in replan_result.schedule_adjustments:
        print(f"   • {adj['session']}: {adj['original_time']} -> {adj['revised_time']} ({adj['action']})")
    print("Stakeholder Alerts Dispatched:")
    for notif in replan_result.stakeholder_notifications:
        print(f"   📢 [{notif['audience']}] {notif['message']}")

    print("\n" + "=" * 80)
    print(" [4/4] GENERATING STAKEHOLDER BRIEFINGS")
    print("=" * 80)
    briefings = director.get_briefings(plan.event_id)
    print("Executive Memo Excerpt:")
    print("-" * 50)
    print("\n".join(briefings["executive_briefing"].split("\n")[:18]))
    print("...")

    print("\n✅ Multi-Agent Event Planning Execution Complete!")


if __name__ == "__main__":
    main()
