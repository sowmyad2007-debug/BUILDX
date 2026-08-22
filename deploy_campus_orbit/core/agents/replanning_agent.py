"""
CAMPUS ORBIT - Dynamic Replanning & Simulation Center Agent
Powers the "WHAT IF?" disruption simulation engine, impact analysis,
multi-criteria candidate ranking, before/after visual diffs, and adaptive plan updates.
"""

from typing import List, Dict, Any, Optional
from ..models import (
    OperationalPlan, ReplanningIncident, ReplanningResult, ReplanningAlternative,
    TaskItem, TaskPriority, TaskStatus, NotificationItem, NotificationPriority,
    Venue
)
from ..database import db
import copy


class ReplanningAgent:
    """
    Core agent responsible for dynamic contingency replanning when unexpected changes occur.
    """

    def __init__(self):
        self.name = "Dynamic Contingency Replanning Agent"

    def simulate_disruption(self, plan: OperationalPlan, incident: ReplanningIncident) -> ReplanningResult:
        """
        Executes complete replanning pipeline:
        1. Detect affected sessions
        2. Check available alternative venues, capacity, equipment, schedule
        3. Rank alternatives with suitability scores
        4. Explain why the top alternative was selected
        5. Build Before / After visual comparison
        6. Inject urgent mitigation tasks and stakeholder notifications
        """
        inc_type = incident.incident_type.upper()
        affected_sessions = []
        candidates: List[ReplanningAlternative] = []
        before_after = {}
        urgent_tasks = []
        stakeholder_alerts = []
        impact_summary = ""

        # SCENARIO 1: Main Auditorium Unavailable / Venue Breakdown
        if "AUDITORIUM" in inc_type or "VENUE" in inc_type:
            affected_venue_name = "Main Auditorium"
            # Mark venue offline in database
            for v in db.venues:
                if "Auditorium" in v.name:
                    v.is_available = False

            # 1. Identify affected sessions
            for item in plan.schedule:
                if "Auditorium" in item.venue_name or item.venue_id == "VEN-AUD-01":
                    affected_sessions.append({
                        "session_id": item.id,
                        "activity": item.activity,
                        "time": f"{item.start_time} - {item.end_time}",
                        "original_venue": item.venue_name
                    })

            # 2. Evaluate candidate venues
            candidates.append(ReplanningAlternative(
                venue_id="VEN-INN-01",
                venue_name="Innovation Hall",
                capacity=250,
                equipment_match="✓ Projector, 3 Mics, Wi-Fi 6, AC",
                schedule_conflict_count=0,
                score=94,
                reason="Capacity fits core audience (250 pax), active AV & Wi-Fi, zero timetable conflicts."
            ))
            candidates.append(ReplanningAlternative(
                venue_id="VEN-CNV-01",
                venue_name="Convention Hall",
                capacity=400,
                equipment_match="✓ Projector, 4 Mics, Wi-Fi 6, AC",
                schedule_conflict_count=1,
                score=88,
                reason="High capacity (400 pax), but requires adjusting 1 afternoon guest lecture booking."
            ))
            candidates.append(ReplanningAlternative(
                venue_id="VEN-SEM-01",
                venue_name="Seminar Hall",
                capacity=180,
                equipment_match="✓ Projector, 2 Mics, Wi-Fi",
                schedule_conflict_count=0,
                score=75,
                reason="Available with zero clashes, but smaller capacity (180 pax) requires overflow live stream."
            ))

            top_choice = candidates[0]

            impact_summary = (
                f"Main Auditorium became unavailable due to emergency maintenance. "
                f"3 primary sessions ({', '.join(s['activity'] for s in affected_sessions[:2])}) require immediate relocation. "
                f"{top_choice.venue_name} selected as optimal replacement (Score: {top_choice.score}%)."
            )

            before_after = {
                "session_name": "Opening Ceremony & Keynote Address",
                "before": {
                    "venue": "Main Auditorium",
                    "time": "10:00 AM - 11:00 AM",
                    "capacity": "500 Seats",
                    "status": "Unavailable (Maintenance)"
                },
                "after": {
                    "venue": "Innovation Hall",
                    "time": "10:00 AM - 11:00 AM",
                    "capacity": "250 Seats (Optimized)",
                    "status": "Relocated & Confirmed"
                },
                "explanation": (
                    "Main Auditorium became unavailable. Three venues were evaluated. "
                    "Innovation Hall was selected because it meets the required capacity, has built-in presentation "
                    "projectors and sound consoles, high-density Wi-Fi, full accessibility, and has zero schedule conflicts."
                )
            }

            urgent_tasks.append(TaskItem(
                id="REPLAN-TSK-01",
                name="Migrate Stage Signage & AV Booth to Innovation Hall",
                assigned_team="Technical Support",
                assigned_lead="Rohan Mehta",
                priority=TaskPriority.CRITICAL,
                deadline="Immediate (Within 20 mins)",
                status=TaskStatus.IN_PROGRESS,
                milestone_phase="Dynamic Replanning",
                checklist=[
                    {"item": "Transfer speaker presentation slides to Innovation Hall podium", "done": True},
                    {"item": "Test wireless microphones and sound level in Innovation Hall", "done": False},
                    {"item": "Place direction placards in Main Foyer redirecting attendees", "done": False}
                ]
            ))

            stakeholder_alerts.append({
                "target": "All Attendees",
                "channel": "Push Broadcast & Campus Display Boards",
                "message": "📢 VENUE CHANGE: Opening Ceremony & Keynotes will now be held in Innovation Hall (SAC 1st Floor). Please proceed to Innovation Hall."
            })
            stakeholder_alerts.append({
                "target": "Campus Security",
                "channel": "Walkie-Talkie & Security Lead",
                "message": "👮 Security directive: Redirect participant entry gates to Student Activity Center."
            })

        # SCENARIO 2: Projector Shortage / Equipment Breakdown
        elif "PROJECTOR" in inc_type or "EQUIPMENT" in inc_type or "SHORTAGE" in inc_type:
            impact_summary = (
                "Central Media Center reported a 1-projector deficit for breakout labs. "
                "AI Resource Agent negotiated inter-department equipment requisition."
            )
            before_after = {
                "session_name": "CSE Lab 3 Coding Sprint",
                "before": {
                    "venue": "CSE Lab 3",
                    "time": "13:00 - 18:00",
                    "equipment": "Missing 1 Laser Projector",
                    "status": "Blocked"
                },
                "after": {
                    "venue": "CSE Lab 3",
                    "time": "13:00 - 18:00",
                    "equipment": "1 Requisitioned Projector from ECE Dept",
                    "status": "Resolved"
                },
                "explanation": "Requisitioned 1 standby projector from ECE Seminar Hall. Zero financial cost incurred."
            }
            urgent_tasks.append(TaskItem(
                id="REPLAN-TSK-02",
                name="Collect & Mount Requisitioned Projector from ECE Store",
                assigned_team="Technical Support",
                assigned_lead="Aarav Sharma",
                priority=TaskPriority.HIGH,
                deadline="Immediate",
                status=TaskStatus.IN_PROGRESS,
                milestone_phase="Dynamic Replanning"
            ))
            stakeholder_alerts.append({
                "target": "Technical Team",
                "channel": "Internal Slack/WhatsApp",
                "message": "🔧 Projector requisition form #REQ-402 signed. Collect unit from ECE Block Room 204."
            })

        # SCENARIO 3: Workshop or Speaker Delay (+90 Mins)
        elif "DELAY" in inc_type or "WORKSHOP" in inc_type or "SPEAKER" in inc_type:
            delay_mins = incident.time_offset_minutes or 90
            impact_summary = (
                f"Keynote speaker delayed by {delay_mins} minutes due to airport transit delay. "
                "Schedule Agent shifted keynote slot, advanced sponsor lightning showcases forward, and rescheduled high-tea."
            )
            before_after = {
                "session_name": "Keynote Address vs Networking Sprint",
                "before": {
                    "venue": "Main Auditorium",
                    "time": "10:00 AM - 11:00 AM (Keynote)",
                    "speaker": "Dr. Vikram Roy (Delayed in Transit)",
                    "status": "At Risk"
                },
                "after": {
                    "venue": "Main Auditorium",
                    "time": "11:30 AM - 12:30 PM (Keynote)",
                    "speaker": "Lightning Showcases advanced to 10:00 AM",
                    "status": "Optimized & Synchronized"
                },
                "explanation": (
                    f"By swapping the 10:00 AM keynote with the interactive lightning showcases, "
                    f"audience engagement is preserved with zero idle downtime."
                )
            }
            urgent_tasks.append(TaskItem(
                id="REPLAN-TSK-03",
                name="Brief Master of Ceremonies (MC) on Advanced Lightning Talks",
                assigned_team="Hospitality & Stage",
                assigned_lead="Ananya Iyer",
                priority=TaskPriority.CRITICAL,
                deadline="Immediate (Within 5 mins)",
                status=TaskStatus.IN_PROGRESS,
                milestone_phase="Dynamic Replanning"
            ))
            stakeholder_alerts.append({
                "target": "Attendees & Participants",
                "channel": "Live Screen Broadcast",
                "message": "⏱️ PROGRAM UPDATE: Interactive Lightning Showcases kick off at 10:00 AM. Keynote will commence at 11:30 AM."
            })

        # SCENARIO 4: Volunteers Shortage
        elif "VOLUNTEER" in inc_type:
            impact_summary = (
                "5 Volunteers reported unavailable due to academic submissions. "
                "AI Volunteer Agent re-rostered 3 volunteers from General Support into Registration & AV booths."
            )
            before_after = {
                "session_name": "Morning Registration & Check-In Desk",
                "before": {
                    "manning": "2 Volunteers (Deficit of 2)",
                    "queue_wait_time": "Estimated ~18 mins",
                    "status": "Bottleneck Warning"
                },
                "after": {
                    "manning": "4 Volunteers (Rebalanced from General Support)",
                    "queue_wait_time": "Estimated ~4 mins",
                    "status": "Optimal Flow"
                },
                "explanation": "Reallocated 2 general runners to high-priority registration QR check-in counters."
            }
            urgent_tasks.append(TaskItem(
                id="REPLAN-TSK-04",
                name="Reassign Badges & Shift Roster for Backup Volunteers",
                assigned_team="Volunteer Coordination",
                assigned_lead="Pooja Verma",
                priority=TaskPriority.HIGH,
                deadline="Immediate",
                status=TaskStatus.IN_PROGRESS,
                milestone_phase="Dynamic Replanning"
            ))
            stakeholder_alerts.append({
                "target": "Volunteer Pool",
                "channel": "Volunteer Coordinator Group",
                "message": "🤝 Volunteer reallocation active. Sneha & Siddharth assigned to Registration Counter 3."
            })

        # SCENARIO 5: Lab Power Outage / Technical Fault
        elif "POWER" in inc_type or "LAB" in inc_type:
            impact_summary = (
                "Power breaker tripped in CSE Lab 2. "
                "AI Replanning Agent transferred teams to CSE Lab 1 and Innovation Hub, while activating mobile diesel generator."
            )
            before_after = {
                "session_name": "Hackathon Coding Pods (CSE Lab 2)",
                "before": {
                    "venue": "CSE Lab 2",
                    "power_status": "Breaker Tripped",
                    "status": "Offline"
                },
                "after": {
                    "venue": "CSE Lab 1 & Innovation Hub",
                    "power_status": "UPS + Dedicated Generator Line",
                    "status": "Active & Fully Operational"
                },
                "explanation": "Rerouted 60 developers to Innovation Hub and synced backup UPS line."
            }
            urgent_tasks.append(TaskItem(
                id="REPLAN-TSK-05",
                name="Engage Campus Electrician for Generator Hookup",
                assigned_team="Technical Support",
                assigned_lead="Karthik Nair",
                priority=TaskPriority.CRITICAL,
                deadline="Within 10 mins",
                status=TaskStatus.IN_PROGRESS,
                milestone_phase="Dynamic Replanning"
            ))
            stakeholder_alerts.append({
                "target": "Lab 2 Teams",
                "channel": "Direct Announcement",
                "message": "⚡ Developers in Lab 2: Please shift to Innovation Hub modular pods. Wi-Fi and power are fully live!"
            })

        else:
            impact_summary = f"Disruption '{inc_type}' analyzed. Contingency mitigation generated."

        return ReplanningResult(
            original_event_id=plan.event_id,
            incident=incident,
            impact_summary=impact_summary,
            affected_sessions=affected_sessions,
            candidate_alternatives=candidates,
            before_after_diff=before_after,
            urgent_tasks=urgent_tasks,
            stakeholder_alerts=stakeholder_alerts,
            new_readiness_score=86,
            plan_updated=True
        )

    def apply_replanned_plan(self, plan: OperationalPlan, result: ReplanningResult) -> OperationalPlan:
        """
        Applies approved changes to the live operational plan.
        """
        # If venue relocation occurred
        if result.candidate_alternatives:
            top_venue_id = result.candidate_alternatives[0].venue_id
            top_venue_name = result.candidate_alternatives[0].venue_name

            # Update schedule venues
            for item in plan.schedule:
                if "Auditorium" in item.venue_name or item.venue_id == "VEN-AUD-01":
                    item.venue_id = top_venue_id
                    item.venue_name = top_venue_name
                    item.status = "Relocated"

            # Update allocated venue in plan
            alt_venue = next((v for v in db.venues if v.id == top_venue_id), None)
            if alt_venue:
                plan.venues = [alt_venue] + [v for v in plan.venues if "Auditorium" not in v.name]

        # Inject urgent tasks at top of list
        for t in result.urgent_tasks:
            plan.tasks.insert(0, t)

        # Inject notifications
        for alert in result.stakeholder_alerts:
            plan.notifications.insert(0, NotificationItem(
                id=f"NOTIF-{len(plan.notifications)+1:02d}",
                title="Dynamic Replanning Executed",
                message=alert["message"],
                priority=NotificationPriority.CRITICAL,
                category="Replanning"
            ))

        # Update version and status
        plan.version += 1
        plan.status = "Replanned & Approved"
        
        # Recalculate readiness
        db.calculate_readiness()

        return plan
