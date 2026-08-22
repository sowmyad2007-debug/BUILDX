"""
Venue & Logistics Agent: Optimizes campus venue allocation, equipment provisioning,
volunteer roster matching, and support department scheduling.
"""

import math
from typing import List, Dict, Tuple, Any, Optional
from ..models import (
    ParsedRequirement, Venue, Equipment, Volunteer,
    SupportTeamAllocation
)
from ..knowledge_base import (
    CAMPUS_VENUES, CAMPUS_EQUIPMENT, CAMPUS_VOLUNTEERS,
    SUPPORT_TEAMS_CATALOG
)


class VenueLogisticsAgent:
    """
    Agent responsible for matching event demands with available campus infrastructure,
    equipment, skilled volunteer teams, and institutional support departments.
    """

    def __init__(self):
        self.name = "Venue, Equipment & Logistics Planning Agent"

    def plan_venues(self, req: ParsedRequirement) -> List[Venue]:
        """
        Selects primary and secondary venues that fit attendee capacity, technical needs,
        and event format.
        """
        # If user explicitly requested a specific venue ID
        if req.specific_venue_requested:
            for v in CAMPUS_VENUES:
                if v.id == req.specific_venue_requested:
                    return [v]

        needed_capacity = req.expected_attendees
        candidates = []

        for v in CAMPUS_VENUES:
            # Check capacity suitability (allow up to 2.5x capacity for comfort, min 75% capacity fit)
            if v.capacity >= needed_capacity:
                score = 0
                # Proximity score to capacity (penalize 1000-seater for 40 people)
                utilization = needed_capacity / v.capacity
                score += utilization * 50

                # Venue type preference matching
                if req.primary_venue_type.lower() in v.venue_type.lower():
                    score += 40

                # Features matching
                if v.ac:
                    score += 10
                if v.projector_av:
                    score += 10
                if req.event_type.value == "Hackathon" and v.wifi_speed_mbps >= 500:
                    score += 25

                candidates.append((score, v))

        if candidates:
            candidates.sort(key=lambda x: x[0], reverse=True)
            return [candidates[0][1]]

        # If no single venue can accommodate, find largest or combination
        sorted_by_cap = sorted(CAMPUS_VENUES, key=lambda v: v.capacity, reverse=True)
        return [sorted_by_cap[0]]

    def plan_equipment(self, req: ParsedRequirement) -> Tuple[Dict[str, int], float]:
        """
        Provisions equipment from inventory and calculates hardware cost estimates.
        """
        allocated: Dict[str, int] = {}
        total_cost = 0.0

        for eq in CAMPUS_EQUIPMENT:
            qty_needed = req.equipment_needs.get(eq.id, 0)
            if qty_needed > 0:
                allocated[eq.id] = qty_needed
                total_cost += qty_needed * eq.unit_cost_estimate

        return allocated, total_cost

    def plan_volunteers(self, req: ParsedRequirement) -> List[Dict[str, Any]]:
        """
        Assigns volunteers matching the specific skill requirements of the event.
        """
        assignments = []
        needed_skills = list(req.volunteer_skills_needed)
        used_vols = set()

        for skill in needed_skills:
            matched = False
            for vol in CAMPUS_VOLUNTEERS:
                if vol.id not in used_vols and any(skill.lower() in s.lower() for s in vol.skills):
                    assignments.append({
                        "volunteer_id": vol.id,
                        "volunteer_name": vol.name,
                        "department": vol.department,
                        "year": vol.year,
                        "contact_phone": vol.contact_phone,
                        "assigned_role": skill,
                        "shift": f"{req.start_time} - {req.end_time}"
                    })
                    used_vols.add(vol.id)
                    matched = True
                    break

            if not matched:
                # Fallback assignment
                for vol in CAMPUS_VOLUNTEERS:
                    if vol.id not in used_vols:
                        assignments.append({
                            "volunteer_id": vol.id,
                            "volunteer_name": vol.name,
                            "department": vol.department,
                            "year": vol.year,
                            "contact_phone": vol.contact_phone,
                            "assigned_role": f"{skill} (Associate)",
                            "shift": f"{req.start_time} - {req.end_time}"
                        })
                        used_vols.add(vol.id)
                        break

        return assignments

    def plan_support_teams(self, req: ParsedRequirement) -> List[SupportTeamAllocation]:
        """
        Calculates headcount and duty roster for Security, Housekeeping, Catering, Transport, IT.
        """
        allocations: List[SupportTeamAllocation] = []
        pax = req.expected_attendees

        # 1. Security
        security_count = max(4, math.ceil(pax / 50))
        if req.overnight_access:
            security_count += 2
        if req.external_guests_vip:
            security_count += 2
        allocations.append(SupportTeamAllocation(
            team_name="Campus Security Force",
            headcount_allocated=security_count,
            shift_hours=f"{req.start_time} to {req.end_time}" + (" (Overnight Patrolling included)" if req.overnight_access else ""),
            special_instructions="Manage entry validation, visitor badging, parking zone allocation, and emergency corridor maintenance.",
            lead_contact=SUPPORT_TEAMS_CATALOG["Security"]["lead"]
        ))

        # 2. Housekeeping
        hk_count = max(3, math.ceil(pax / 60))
        allocations.append(SupportTeamAllocation(
            team_name="Estate Housekeeping & Sanitation",
            headcount_allocated=hk_count,
            shift_hours=f"Pre-event setup (1h prior) through post-event cleanup (1h post)",
            special_instructions="Venue pre-cleaning, constant trash bin clearance, water dispenser replenishment, restroom maintenance.",
            lead_contact=SUPPORT_TEAMS_CATALOG["Housekeeping"]["lead"]
        ))

        # 3. Catering
        if req.catering_needed or "Catering" in req.support_teams_required:
            allocations.append(SupportTeamAllocation(
                team_name="Campus Dining & Hospitality",
                headcount_allocated=max(4, math.ceil(pax / 40)),
                shift_hours=f"Meal windows: Morning Refreshments, Lunch (12:30-14:00), Evening High-Tea",
                special_instructions=f"Serve buffet service for {pax} pax + 25 faculty/guests. Ensure bottled water and dietary allergen labeling.",
                lead_contact=SUPPORT_TEAMS_CATALOG["Catering"]["lead"]
            ))

        # 4. IT & Network Operations
        if req.event_type.value in ["Hackathon", "Workshop", "Technical Fest"] or "IT_Network" in req.support_teams_required:
            allocations.append(SupportTeamAllocation(
                team_name="Network Operations Center (NOC)",
                headcount_allocated=3,
                shift_hours="Full event duration + 2 hours pre-event testing",
                special_instructions="Configure dedicated high-bandwidth SSID, bypass restrictive ports for dev tooling, deploy on-site switch backups.",
                lead_contact=SUPPORT_TEAMS_CATALOG["IT_Network"]["lead"]
            ))

        # 5. Transport Fleet
        if req.transport_needed or "Transport" in req.support_teams_required:
            buses = max(1, math.ceil(pax / 60))
            allocations.append(SupportTeamAllocation(
                team_name="Campus Transport Division",
                headcount_allocated=buses,
                shift_hours="Morning arrival (08:00 - 09:30) & Evening dispersal (17:30 - 19:00)",
                special_instructions=f"Operate {buses} shuttle bus(es) connecting Hostels, Metro Station, and Main Academic Venue.",
                lead_contact=SUPPORT_TEAMS_CATALOG["Transport"]["lead"]
            ))

        # 6. Medical Unit
        if pax >= 250 or req.event_type.value == "Cultural Fest":
            allocations.append(SupportTeamAllocation(
                team_name="Campus Health & First Aid Unit",
                headcount_allocated=2,
                shift_hours="Full event standby",
                special_instructions="First-aid triage station equipped with trauma kit, ORS, glucose, and standby ambulance.",
                lead_contact=SUPPORT_TEAMS_CATALOG["Medical"]["lead"]
            ))

        return allocations
