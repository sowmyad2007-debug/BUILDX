"""
Stakeholder Briefing & Notification Agent:
Generates role-tailored briefings, executive memos, operational action orders,
and participant broadcasts for campus stakeholders.
"""

from typing import Dict, Any, List
from ..models import OperationalPlan, ParsedRequirement, TaskStatus


class BriefingAgent:
    """
    Agent responsible for synthesizing customized briefings and operational notification packs
    for University Executives, Security/Facilities, Student Volunteers, and Attendees.
    """

    def __init__(self):
        self.name = "Multi-Stakeholder Briefing & Notification Agent"

    def generate_briefing_pack(self, plan: OperationalPlan) -> Dict[str, str]:
        """
        Produces 4 specialized stakeholder briefing documents.
        """
        req = plan.requirement
        venue_str = ", ".join(f"{v.name} ({v.location_block})" for v in plan.allocated_venues)

        return {
            "executive_briefing": self._generate_executive_memo(plan, venue_str),
            "security_estate_briefing": self._generate_security_memo(plan, venue_str),
            "volunteer_operational_briefing": self._generate_volunteer_memo(plan),
            "attendee_broadcast": self._generate_attendee_broadcast(plan, venue_str)
        }

    def _generate_executive_memo(self, plan: OperationalPlan, venue_str: str) -> str:
        req = plan.requirement
        pending_apps = [a for a in plan.approvals if a.status.value == "PENDING"]
        
        memo = f"""========================================================================
EXECUTIVE BRIEFING & COMPLIANCE MEMORANDUM
To: Dean of Student Welfare, Registrar, Academic Council
Subject: Operational Plan & Resource Authorization for '{req.event_name}'
Readiness Index: {plan.readiness_score}% | Status: {plan.status}
========================================================================

1. EVENT OVERVIEW
- Title: {req.event_name} ({req.event_type.value})
- Schedule: {req.start_date} to {req.end_date} | {req.start_time} - {req.end_time}
- Venue Allocated: {venue_str}
- Projected Footfall: {req.expected_attendees} Participants
- Total Estimated Financial Commitment: ${plan.estimated_cost:,.2f} (Budget Cap: ${req.budget_limit:,.2f})

2. INSTITUTIONAL RISK & COMPLIANCE ASSESSMENT
- Overnight Campus Operations: {"YES (CSO clearance mandated)" if req.overnight_access else "No"}
- VIP Dignitaries / External Keynotes: {"YES (Protocol escort planned)" if req.external_guests_vip else "No"}
- High-Density Wi-Fi / Infrastructure: Dedicated SSID allocated with NOC on-site engineer.
- First Aid & Emergency Standby: {"Standby ambulance & medic deployed" if req.expected_attendees >= 250 else "Triage kit at helpdesk"}

3. ACTION REQUIRED FROM EXECUTIVE LEADERSHIP
"""
        if pending_apps:
            memo += "The following formal clearances are pending digital endorsement:\n"
            for app in pending_apps:
                memo += f"  [*] [{app.id}] {app.title} -> Assigned to: {app.approver_role}\n"
        else:
            memo += "All governance and budget approvals have been successfully cleared.\n"

        memo += "\nSubmitted by: AI Campus Event Planning & Coordination Multi-Agent System"
        return memo

    def _generate_security_memo(self, plan: OperationalPlan, venue_str: str) -> str:
        req = plan.requirement
        sec_team = next((t for t in plan.allocated_support_teams if "Security" in t.team_name), None)
        sec_count = sec_team.headcount_allocated if sec_team else 4

        return f"""========================================================================
CAMPUS SECURITY, ESTATES & FACILITIES OPERATIONAL DIRECTIVE
To: Chief Security Officer, Estate Manager, Fire & Safety Lead
Event: '{req.event_name}' | Expected Pax: {req.expected_attendees}
========================================================================

1. DEPLOYMENT PARAMETERS
- Assigned Venues: {venue_str}
- Security Guards Rostered: {sec_count} Officers (Day shift + {"Night watch" if req.overnight_access else "Evening lockup"})
- Parking Protocol: Reserve Sector A (Main Admin Block) for 15 VIP vehicles and 4 faculty buses.

2. ACCESS CONTROL & PERIMETER GATES
- Main Gate 1: General participant entry with digital QR badge scan.
- Gate 3: Heavy logistics & catering vendor unloading (07:00 - 08:30 only).
- Emergency Corridors: Maintain clear 20-foot ambulance access lane adjacent to {plan.allocated_venues[0].name if plan.allocated_venues else 'Main Venue'}.

3. SPECIAL DIRECTIVES
- {"OVERNIGHT PATROL MANDATE: Conduct hourly rounds in lab corridors between 22:00 and 06:00." if req.overnight_access else "Standard curfew applies at 21:30."}
- Housekeeping: Continuous waste clearance schedule active with {plan.expected_attendees if hasattr(plan, 'expected_attendees') else req.expected_attendees} pax volume.
"""

    def _generate_volunteer_memo(self, plan: OperationalPlan) -> str:
        req = plan.requirement
        lines = [
            "========================================================================",
            f"STUDENT VOLUNTEER & STAGE CREW OPERATIONAL PLAYBOOK",
            f"Event: '{req.event_name}' | Date: {req.start_date}",
            "========================================================================\n",
            "1. VOLUNTEER STATION ASSIGNMENTS & ROSTER"
        ]

        for v in plan.allocated_volunteers:
            lines.append(f"- [{v['volunteer_id']}] {v['volunteer_name']} ({v['department']} - Yr {v['year']})")
            lines.append(f"    * Assigned Role: {v['assigned_role']}")
            lines.append(f"    * Shift: {v['shift']} | Emergency Contact: {v['contact_phone']}")

        lines.append("\n2. KEY OPERATIONAL DEADLINES")
        for t in plan.tasks[:5]:
            lines.append(f"- [{t.due_date}] {t.title} -> Lead: {t.assigned_lead} [{t.status.value}]")

        lines.append("\n3. CODE OF CONDUCT & PROTOCOL")
        lines.append("- Wear official volunteer badges and lanyards at all times.")
        lines.append("- Report any hardware glitch or medical issue immediately to Central NOC Helpdesk.")

        return "\n".join(lines)

    def _generate_attendee_broadcast(self, plan: OperationalPlan, venue_str: str) -> str:
        req = plan.requirement
        return f"""📢 IMPORTANT PARTICIPANT BRIEFING: {req.event_name.upper()} 📢

Welcome to {req.event_name}! Please review your essential event day instructions below:

📍 VENUE & REPORTING TIME:
- Venue: {venue_str}
- Check-in Time: {req.start_time} on {req.start_date}
- Dispersal Time: {req.end_time} on {req.end_date}

📶 HIGH-SPEED WI-FI ACCESS:
- SSID: CAMPUS_EVENT_5G
- Access credentials will be provided upon badge collection at the registration desk.

🎒 WHAT TO BRING:
- Valid College ID Card / Govt Photo ID
- Laptop, Charger, and power extension (if participating in coding/hackathon tracks)
- Downloaded QR registration confirmation pass

🍽️ DINING & REFRESHMENTS:
- {"Complimentary welcome breakfast, buffet lunch, and evening refreshments are arranged." if req.catering_needed else "Campus cafeterias will remain open."}

Need assistance during the event? Reach out to any volunteer in official badges at the Helpdesk!
"""
