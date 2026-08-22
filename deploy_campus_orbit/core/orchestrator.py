"""
CAMPUS ORBIT - Master Multi-Agent Orchestrator (CampusEventDirector)
Connects and coordinates all conceptual sub-agents into a unified event operations system.
"""

import uuid
from typing import Dict, Any, Optional, List
from .models import (
    OperationalPlan, ParsedRequirement, ReplanningIncident, ReplanningResult,
    Venue, ResourceItem, Volunteer, ScheduleItem, TaskItem, ConflictItem, ApprovalItem
)
from .database import db
from .agents.intake_agent import EventIntakeAgent
from .agents.venue_agent import VenueAgent
from .agents.schedule_agent import ScheduleAgent
from .agents.resource_agent import ResourceAgent
from .agents.volunteer_agent import VolunteerAgent
from .agents.conflict_agent import ConflictResolutionAgent
from .agents.approval_agent import ApprovalGovernanceAgent
from .agents.briefing_agent import BriefingAgent
from .agents.replanning_agent import ReplanningAgent
from .agents.chatbot_agent import OrbitChatbotAgent


class CampusEventDirector:
    """
    Primary Multi-Agent Director for Campus Orbit.
    """

    def __init__(self):
        self.intake_agent = EventIntakeAgent()
        self.venue_agent = VenueAgent()
        self.schedule_agent = ScheduleAgent()
        self.resource_agent = ResourceAgent()
        self.volunteer_agent = VolunteerAgent()
        self.conflict_agent = ConflictResolutionAgent()
        self.approval_agent = ApprovalGovernanceAgent()
        self.briefing_agent = BriefingAgent()
        self.replanning_agent = ReplanningAgent()
        self.chatbot_agent = OrbitChatbotAgent()

        self.last_replanning_result: Optional[ReplanningResult] = None

    def plan_event_from_text(self, natural_language_prompt: str) -> OperationalPlan:
        """
        Executes end-to-end multi-agent event synthesis pipeline:
        1. AI Requirement Parser
        2. Venue & Logistics Matching
        3. Schedule Timeline Synthesis
        4. Hardware & Resource Inventory Mapping
        5. Volunteer Team Roster Assignment
        6. Conflict & Collision Engine
        7. Human Approval Evaluation
        8. Dynamic Readiness Scoring
        """
        # Step 1: Parse requirement
        req: ParsedRequirement = self.intake_agent.parse_natural_language(natural_language_prompt)
        event_id = f"EVT-ORBIT-{uuid.uuid4().hex[:4].upper()}"

        # Step 2: Venue Agent
        matched_venues = self.venue_agent.match_venues(req)
        primary_venue = matched_venues[0] if matched_venues else db.venues[0]

        # Step 3: Schedule Agent
        schedule = self.schedule_agent.generate_schedule(req, primary_venue)

        # Step 4: Resource Agent
        resources = self.resource_agent.allocate_resources(req)

        # Step 5: Volunteer Agent
        volunteers = self.volunteer_agent.allocate_volunteers(req)

        # Step 6: Task Delegation (WBS)
        tasks = db.tasks

        # Step 7: Conflict Detection
        # Build equipment allocation map
        eq_map = {"EQ-MIC-01": 4, "EQ-PRJ-01": 2, "EQ-NET-01": 5, "EQ-PWR-01": 20}
        conflicts = self.conflict_agent.detect_conflicts(req, [primary_venue], eq_map)

        # Step 8: Human Approval Gates
        estimated_cost = sum(v.hourly_rate * 8 for v in matched_venues[:2]) + 1500.0  # Catering & Logistics
        approvals = self.approval_agent.evaluate_required_approvals(req, matched_venues[:2], estimated_cost)

        # Step 9: Notifications & Readiness
        notifications = db.notifications
        readiness_info = db.calculate_readiness()

        plan = OperationalPlan(
            event_id=event_id,
            requirement=req,
            venues=matched_venues[:4],
            schedule=schedule,
            resources=resources,
            volunteers=volunteers,
            tasks=tasks,
            conflicts=conflicts,
            approvals=approvals,
            notifications=notifications,
            readiness_score=readiness_info["overall"],
            readiness_breakdown=readiness_info["breakdown"],
            estimated_cost=estimated_cost,
            status="Operational Plan Generated",
            version=1
        )

        db.active_event_plan = plan
        return plan

    def simulate_what_if(self, incident: ReplanningIncident) -> ReplanningResult:
        """
        Triggers the "WHAT IF?" Dynamic Replanning Engine.
        """
        plan = db.active_event_plan or self.plan_event_from_text(
            "We are organizing a 2-day AI Innovation Hackathon for 300 students in Main Auditorium."
        )
        result = self.replanning_agent.simulate_disruption(plan, incident)
        self.last_replanning_result = result
        return result

    def apply_what_if(self) -> Optional[OperationalPlan]:
        """
        Applies the last simulated replanning result to the live operational plan.
        """
        plan = db.active_event_plan
        if plan and self.last_replanning_result:
            updated = self.replanning_agent.apply_replanned_plan(plan, self.last_replanning_result)
            self.last_replanning_result = None
            return updated
        return plan

    def resolve_conflict(self, conflict_id: str, resolution_text: str) -> Optional[OperationalPlan]:
        """
        Applies a resolution to an identified conflict.
        """
        plan = db.active_event_plan
        if not plan:
            return None

        for conf in plan.conflicts:
            if conf.id == conflict_id:
                conf.resolved = True
                conf.resolution_applied = resolution_text
                break

        db.calculate_readiness()
        return plan

    def process_approval(self, approval_id: str, approver_name: str, action: str, comments: str = "") -> Optional[OperationalPlan]:
        """
        Processes human sign-off on a governance ticket.
        """
        plan = db.active_event_plan
        if not plan:
            return None

        self.approval_agent.process_signoff(plan.approvals, approval_id, approver_name, action, comments)
        db.calculate_readiness()
        return plan

    def get_briefings(self) -> Dict[str, str]:
        """
        Generates customized briefings for all campus stakeholders.
        """
        plan = db.active_event_plan
        if not plan:
            return {}
        return self.briefing_agent.generate_briefing_pack(plan)

    def chat_with_orbit(self, user_message: str):
        """
        Handles interactive conversational querying via Orbit AI Assistant.
        """
        return self.chatbot_agent.process_user_message(user_message, db)


# Global singleton director
director = CampusEventDirector()
