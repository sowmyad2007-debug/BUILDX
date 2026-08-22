"""
Task Delegation & Event-Readiness Checklist Agent:
Automates milestone task breakdowns (WBS), dependency tracking, team assignment,
deadline scheduling, and generates role-tailored operational checklists.
"""

from typing import List, Dict, Any
from ..models import (
    ParsedRequirement, TaskItem, TaskPriority, TaskStatus, Venue
)


class TaskDelegationAgent:
    """
    Agent responsible for breaking event execution into milestone phases (T-14 to D-Day to Post-Event),
    allocating responsible student teams and staff leads, and generating operational checklists.
    """

    def __init__(self):
        self.name = "Task Delegation & Operational Readiness Agent"

    def generate_task_breakdown(self, req: ParsedRequirement, venues: List[Venue]) -> List[TaskItem]:
        """
        Creates structured milestone tasks with deadlines, dependencies, and checklist points.
        """
        tasks: List[TaskItem] = []
        venue_names = ", ".join(v.name for v in venues)

        # Phase 1: T-14 Days (Planning & Institutional Clearance)
        tasks.append(TaskItem(
            id="TSK-001",
            milestone_phase="T-14 Days (Planning & Clearance)",
            title="Secure Institutional Permissions & Venue Reservation",
            description=f"Submit formal booking requisition for {venue_names} and acquire Dean/Estate clearance.",
            assigned_team="Faculty Coordinator & Student President",
            assigned_lead="Faculty Advisor",
            priority=TaskPriority.CRITICAL,
            due_date=f"{req.start_date} (-14d)",
            status=TaskStatus.COMPLETED,
            dependencies=[],
            checklist_items=[
                {"item": "Submit online venue reservation form", "done": True},
                {"item": "Attach event syllabus / itinerary", "done": True},
                {"item": "Dean Student Welfare signature endorsement", "done": True}
            ]
        ))

        tasks.append(TaskItem(
            id="TSK-002",
            milestone_phase="T-14 Days (Planning & Clearance)",
            title="Publish Event Website, Registration Portal & Poster Campaign",
            description="Launch ticketing/registration form, social media announcements, and campus billboard posters.",
            assigned_team="Media & Web Development Team",
            assigned_lead="Sneha Patel (CS-Year 2)",
            priority=TaskPriority.HIGH,
            due_date=f"{req.start_date} (-12d)",
            status=TaskStatus.IN_PROGRESS,
            dependencies=["TSK-001"],
            checklist_items=[
                {"item": "QR Code registration link active", "done": True},
                {"item": "Digital posters distributed across student WhatsApp/Discord", "done": True},
                {"item": "Printed posters placed on Department Notice Boards", "done": False}
            ]
        ))

        # Phase 2: T-7 Days (Logistics & Requisition)
        tasks.append(TaskItem(
            id="TSK-003",
            milestone_phase="T-7 Days (Logistics & Requisition)",
            title="Central Equipment & AV Inventory Requisition",
            description="Submit gate passes and hardware requisition forms to Central Media Center and NOC.",
            assigned_team="Tech & AV Operations Team",
            assigned_lead="Rohan Mehta (ECE-Year 4)",
            priority=TaskPriority.CRITICAL,
            due_date=f"{req.start_date} (-7d)",
            status=TaskStatus.IN_PROGRESS,
            dependencies=["TSK-001"],
            checklist_items=[
                {"item": "Test wireless microphones and replace AA batteries", "done": True},
                {"item": "Reserve 4K laser projector and HDMI 2.1 cables", "done": False},
                {"item": "Requisition 24-port Gigabit switches and CAT6 cables", "done": False}
            ]
        ))

        tasks.append(TaskItem(
            id="TSK-004",
            milestone_phase="T-7 Days (Logistics & Requisition)",
            title="Volunteer Briefing & Shift Roster Finalization",
            description="Conduct orientation session with all assigned volunteers for registration, hospitality, and crowd control.",
            assigned_team="Volunteer Management Committee",
            assigned_lead="Ananya Iyer (IT-Year 3)",
            priority=TaskPriority.HIGH,
            due_date=f"{req.start_date} (-6d)",
            status=TaskStatus.PENDING,
            dependencies=["TSK-002"],
            checklist_items=[
                {"item": "Issue volunteer badge lanyards and T-shirts", "done": False},
                {"item": "Distribute emergency contact directory", "done": False},
                {"item": "Assign specific venue station posts", "done": False}
            ]
        ))

        # Phase 3: T-3 Days (Technical Dry-Run & Vendor Prep)
        tasks.append(TaskItem(
            id="TSK-005",
            milestone_phase="T-3 Days (Dry Run & Setup)",
            title="Campus NOC Network Stress Test & Dedicated SSID Deployment",
            description="Stress-test Wi-Fi access points for high-density concurrent connections and verify port firewall rules.",
            assigned_team="Network Ops Team & Tech Volunteers",
            assigned_lead="Aarav Sharma (CS-Year 3)",
            priority=TaskPriority.CRITICAL,
            due_date=f"{req.start_date} (-3d)",
            status=TaskStatus.PENDING,
            dependencies=["TSK-003"],
            checklist_items=[
                {"item": "Deploy dedicated SSID 'CAMPUS_EVENT_5G' with captive portal", "done": False},
                {"item": "Verify 500+ Mbps symmetrical fiber uplink", "done": False},
                {"item": "Whitelist GitHub, HuggingFace, Docker Hub and dev endpoints", "done": False}
            ]
        ))

        tasks.append(TaskItem(
            id="TSK-006",
            milestone_phase="T-3 Days (Dry Run & Setup)",
            title="Catering & Transport Schedule Confirmation",
            description="Finalize food count with Campus Dining and confirm bus departure timings from hostels.",
            assigned_team="Logistics & Hospitality Team",
            assigned_lead="Diya Mukherjee (Management-Year 2)",
            priority=TaskPriority.HIGH,
            due_date=f"{req.start_date} (-2d)",
            status=TaskStatus.PENDING,
            dependencies=["TSK-004"],
            checklist_items=[
                {"item": "Confirm dietary headcount (Veg, Non-Veg, Vegan)", "done": False},
                {"item": "Inspect water dispenser cooler stations at venue", "done": False},
                {"item": "Verify driver contact numbers for hostel shuttle buses", "done": False}
            ]
        ))

        # Phase 4: T-1 Day (Final Stage Setup & Security Briefing)
        tasks.append(TaskItem(
            id="TSK-007",
            milestone_phase="T-1 Day (Final Lock-in)",
            title="Full Venue Soundcheck, Stage Lighting & Projection Test",
            description="Conduct end-to-end rehearsal with keynote presentation slides and audio mixing board.",
            assigned_team="Tech & AV Operations Team",
            assigned_lead="Rohan Mehta & Harsh Vardhan",
            priority=TaskPriority.CRITICAL,
            due_date=f"{req.start_date} (-1d)",
            status=TaskStatus.PENDING,
            dependencies=["TSK-003", "TSK-005"],
            checklist_items=[
                {"item": "Acoustic line check across all auditorium seats", "done": False},
                {"item": "Dual projector aspect ratio & color calibration", "done": False},
                {"item": "Test backup power automatic transfer switch (ATS)", "done": False}
            ]
        ))

        tasks.append(TaskItem(
            id="TSK-008",
            milestone_phase="T-1 Day (Final Lock-in)",
            title="Security Gate Protocol & VIP Parking Zone Barricading",
            description="Brief campus security personnel on guest list, pass verification, and parking arrangements.",
            assigned_team="Security Liaison Team",
            assigned_lead="Vikram Rathore (Mech-Year 3)",
            priority=TaskPriority.HIGH,
            due_date=f"{req.start_date} (-1d)",
            status=TaskStatus.PENDING,
            dependencies=["TSK-004"],
            checklist_items=[
                {"item": "Barricade VIP designated parking slots near Main Block", "done": False},
                {"item": "Provide printed attendee roster to Security Gate 1 & 2", "done": False},
                {"item": "Inspect fire extinguishers and emergency exit pathways", "done": False}
            ]
        ))

        # Phase 5: D-Day (Live Execution)
        tasks.append(TaskItem(
            id="TSK-009",
            milestone_phase="D-Day (Live Execution)",
            title="Registration Desk Opening, Attendee Kit & ID Badging",
            description="Manage morning influx of participants, verify QR codes, distribute event merchandise and badges.",
            assigned_team="Registration & Helpdesk Team",
            assigned_lead="Pooja Verma (IT-Year 3)",
            priority=TaskPriority.CRITICAL,
            due_date=f"{req.start_date} (08:00 AM)",
            status=TaskStatus.PENDING,
            dependencies=["TSK-008"],
            checklist_items=[
                {"item": "Open 4 parallel check-in counters", "done": False},
                {"item": "Issue Wi-Fi login scratch cards to external guests", "done": False},
                {"item": "Real-time attendance counter sync to dashboard", "done": False}
            ]
        ))

        tasks.append(TaskItem(
            id="TSK-010",
            milestone_phase="D-Day (Live Execution)",
            title="Live Stream Broadcast & Stage Operations",
            description="Manage keynote stage audio, camera switching, live streaming to YouTube, and speaker timer.",
            assigned_team="AV & Media Broadcast Team",
            assigned_lead="Riya Sen (ECE-Year 3)",
            priority=TaskPriority.HIGH,
            due_date=f"{req.start_date} (09:30 AM)",
            status=TaskStatus.PENDING,
            dependencies=["TSK-007"],
            checklist_items=[
                {"item": "YouTube Live Stream test stream 15 mins before keynote", "done": False},
                {"item": "Stage timer countdown monitor active", "done": False},
                {"item": "VIP hospitality green room refreshments served", "done": False}
            ]
        ))

        # Phase 6: Post-Event (Teardown & Audit)
        tasks.append(TaskItem(
            id="TSK-011",
            milestone_phase="Post-Event (Wrap-up & Audit)",
            title="Hardware Inventory Return, Venue Cleanup & Financial Reconciliation",
            description="Audit all borrowed gear, ensure zero damages, return venues in pristine state, and submit final bills.",
            assigned_team="Organizing Committee Core",
            assigned_lead="Faculty Advisor & Student President",
            priority=TaskPriority.MEDIUM,
            due_date=f"{req.end_date} (+1d)",
            status=TaskStatus.PENDING,
            dependencies=["TSK-010"],
            checklist_items=[
                {"item": "Return all mics, projectors, switches to Media Center and get signed NOC", "done": False},
                {"item": "Housekeeping deep cleaning sign-off", "done": False},
                {"item": "Dispatch digital certificates of participation", "done": False},
                {"item": "Submit final expense receipts to Finance Office", "done": False}
            ]
        ))

        return tasks

    def calculate_readiness_metrics(
        self,
        tasks: List[TaskItem],
        conflicts: List[Any],
        approvals: List[Any]
    ) -> Dict[str, Any]:
        """
        Calculates holistic 0-100% readiness score based on task completion,
        approval clearances, and unresolved conflicts.
        """
        # 1. Task progress score (35% weight)
        total_tasks = len(tasks)
        completed_tasks = sum(1 for t in tasks if t.status == TaskStatus.COMPLETED)
        in_progress_tasks = sum(1 for t in tasks if t.status == TaskStatus.IN_PROGRESS)
        task_score = int(((completed_tasks + in_progress_tasks * 0.5) / max(1, total_tasks)) * 100)

        # 2. Approval clearance score (35% weight)
        total_approvals = len(approvals)
        approved_count = sum(1 for a in approvals if a.status.value == "APPROVED")
        approval_score = int((approved_count / max(1, total_approvals)) * 100) if total_approvals > 0 else 100

        # 3. Conflict resolution score (30% weight)
        unresolved_critical = sum(1 for c in conflicts if c.severity.value == "CRITICAL" and not c.resolved)
        unresolved_major = sum(1 for c in conflicts if c.severity.value == "MAJOR" and not c.resolved)
        
        conflict_penalty = (unresolved_critical * 40) + (unresolved_major * 20)
        conflict_score = max(0, 100 - conflict_penalty)

        # Overall weighted score
        overall = int((task_score * 0.35) + (approval_score * 0.35) + (conflict_score * 0.30))
        overall = min(100, max(0, overall))

        return {
            "overall_score": overall,
            "breakdown": {
                "tasks_progress": task_score,
                "approvals_clearance": approval_score,
                "conflict_health": conflict_score
            },
            "metrics": {
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "pending_approvals": sum(1 for a in approvals if a.status.value == "PENDING"),
                "critical_conflicts": unresolved_critical
            }
        }
