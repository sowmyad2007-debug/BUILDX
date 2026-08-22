"""
Conflict Detection & Alternative Recommendation Agent:
Performs collision checks on venues, equipment inventory, timetable schedules,
and generates prioritized recommendations to resolve bottlenecks.
"""

from datetime import datetime
from typing import List, Dict, Tuple, Any
from ..models import (
    ParsedRequirement, Venue, ConflictItem, ConflictSeverity
)
from ..knowledge_base import (
    CAMPUS_VENUES, CAMPUS_EQUIPMENT, PRE_EXISTING_BOOKINGS,
    GOVERNANCE_POLICIES
)


class ConflictResolutionAgent:
    """
    Agent responsible for detecting operational, schedule, and resource collisions,
    and synthesizing actionable fallback alternatives.
    """

    def __init__(self):
        self.name = "Conflict Detection & Recommendation Engine"

    def detect_conflicts(
        self,
        req: ParsedRequirement,
        allocated_venues: List[Venue],
        allocated_equipment: Dict[str, int]
    ) -> List[ConflictItem]:
        """
        Runs comprehensive constraint satisfaction checks.
        """
        conflicts: List[ConflictItem] = []
        c_counter = 1

        # 1. Check Pre-existing Venue Bookings (Time-Overlap Collision)
        for venue in allocated_venues:
            for booking in PRE_EXISTING_BOOKINGS:
                venue_match = (
                    booking["venue_id"] == venue.id or
                    ("AUD" in booking["venue_id"] and "Auditorium" in venue.name) or
                    ("SEM" in booking["venue_id"] and "Seminar" in venue.name) or
                    ("LAB" in booking["venue_id"] and "Lab" in venue.name)
                )
                if venue_match and booking["date"] == req.start_date:
                    # Check time overlap
                    b_start = booking["start_time"]
                    b_end = booking["end_time"]
                    r_start = req.start_time
                    r_end = req.end_time

                    if self._times_overlap(r_start, r_end, b_start, b_end):
                        # Generate alternative recommendations
                        alt_venues = [
                            f"Reallocate to {v.name} (Capacity: {v.capacity} pax, {v.location_block})"
                            for v in CAMPUS_VENUES
                            if v.id != venue.id and v.capacity >= req.expected_attendees
                        ]
                        alt_times = [
                            f"Shift event schedule to morning session (08:30 - 13:30) on {req.start_date}",
                            f"Reschedule event to next available date on {self._next_day(req.start_date)}"
                        ]
                        recommendations = alt_venues[:2] + alt_times

                        conflicts.append(ConflictItem(
                            id=f"CONF-{c_counter:03d}",
                            category="VENUE_COLLISION",
                            severity=ConflictSeverity.CRITICAL,
                            title=f"Venue Collision: {venue.name} is already booked",
                            description=(
                                f"{venue.name} is already reserved by '{booking['booked_by']}' "
                                f"for '{booking['event_title']}' on {req.start_date} from {b_start} to {b_end}."
                            ),
                            impacted_resource=venue.name,
                            recommended_alternatives=recommendations
                        ))
                        c_counter += 1

        # 2. Check Capacity Bottlenecks
        for venue in allocated_venues:
            if req.expected_attendees > venue.capacity:
                conflicts.append(ConflictItem(
                    id=f"CONF-{c_counter:03d}",
                    category="CAPACITY_EXCEEDED",
                    severity=ConflictSeverity.CRITICAL,
                    title=f"Capacity Deficit in {venue.name}",
                    description=f"Expected {req.expected_attendees} attendees exceeds max capacity ({venue.capacity}) by {req.expected_attendees - venue.capacity} pax.",
                    impacted_resource=venue.name,
                    recommended_alternatives=[
                        "Upgrade venue to Dr. APJ Abdul Kalam Main Auditorium (1000 pax)",
                        "Set up dual-venue video stream to Aryabhatta Seminar Hall A (180 pax overflow)"
                    ]
                ))
                c_counter += 1

        # 3. Check Equipment Deficits
        eq_map = {eq.id: eq for eq in CAMPUS_EQUIPMENT}
        for eq_id, req_qty in allocated_equipment.items():
            eq = eq_map.get(eq_id)
            if eq and req_qty > eq.available_qty:
                deficit = req_qty - eq.available_qty
                conflicts.append(ConflictItem(
                    id=f"CONF-{c_counter:03d}",
                    category="EQUIPMENT_DEFICIT",
                    severity=ConflictSeverity.MAJOR,
                    title=f"Equipment Shortage: {eq.name}",
                    description=f"Requested {req_qty} units, but only {eq.available_qty} currently available (Shortfall: {deficit} units).",
                    impacted_resource=eq.name,
                    recommended_alternatives=[
                        f"Cap allocation to available stock ({eq.available_qty} units) and share in batches",
                        f"Raise urgent inter-department equipment requisition to Central Media Lab",
                        f"Authorize external vendor dry-hire rental (Estimated Cost: ${deficit * eq.unit_cost_estimate * 1.5:.2f})"
                    ]
                ))
                c_counter += 1

        # 4. Check Outdoor Sound Curfew Restrictions
        if req.sound_amplification_outdoor and req.end_time > GOVERNANCE_POLICIES["sound_limit_outdoor_cutoff"]:
            conflicts.append(ConflictItem(
                id=f"CONF-{c_counter:03d}",
                category="POLICY_VIOLATION",
                severity=ConflictSeverity.MAJOR,
                title="Outdoor Acoustic Curfew Conflict",
                description=f"High-decibel sound requested until {req.end_time}, which violates campus curfew ({GOVERNANCE_POLICIES['sound_limit_outdoor_cutoff']}).",
                impacted_resource="Open Air Amphitheatre Sound Permit",
                recommended_alternatives=[
                    f"Conclude outdoor acoustic performance strictly by {GOVERNANCE_POLICIES['sound_limit_outdoor_cutoff']}",
                    "Move post-10 PM programming indoors to Kalam Main Auditorium (Acoustic isolated)"
                ]
            ))
            c_counter += 1

        # 5. Check Minimum Lead Time Violation
        try:
            event_dt = datetime.strptime(req.start_date, "%Y-%m-%d")
            delta_days = (event_dt - datetime.now()).days
            if delta_days < GOVERNANCE_POLICIES["min_lead_time_days"]:
                conflicts.append(ConflictItem(
                    id=f"CONF-{c_counter:03d}",
                    category="SCHEDULE_URGENCY",
                    severity=ConflictSeverity.MINOR,
                    title="Short Lead-Time Warning",
                    description=f"Event requested in {delta_days} days. Standard campus policy mandates at least {GOVERNANCE_POLICIES['min_lead_time_days']} days notice.",
                    impacted_resource="Administrative Permissions",
                    recommended_alternatives=[
                        "Obtain emergency fast-track clearance from Dean Student Welfare",
                        "Reschedule start date by at least 5 business days"
                    ]
                ))
                c_counter += 1
        except Exception:
            pass

        return conflicts

    def _times_overlap(self, start1: str, end1: str, start2: str, end2: str) -> bool:
        s1 = self._to_mins(start1)
        e1 = self._to_mins(end1)
        s2 = self._to_mins(start2)
        e2 = self._to_mins(end2)
        return max(s1, s2) < min(e1, e2)

    def _to_mins(self, time_str: str) -> int:
        parts = time_str.split(":")
        return int(parts[0]) * 60 + int(parts[1]) if len(parts) > 1 else int(parts[0]) * 60

    def _next_day(self, date_str: str) -> str:
        try:
            dt = datetime.strptime(date_str, "%Y-%m-%d")
            from datetime import timedelta
            return (dt + timedelta(days=1)).strftime("%Y-%m-%d")
        except Exception:
            return date_str
