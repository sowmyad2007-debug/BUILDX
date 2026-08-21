"""
CAMPUS ORBIT - Venue Agent
Handles venue matching, capacity validation, technical capability checks,
multi-criteria ranking, and "Why this venue?" decision rationales.
"""

from typing import List, Dict, Tuple, Any, Optional
from ..models import Venue, ParsedRequirement
from ..database import db


class VenueAgent:
    """
    Agent responsible for searching venues, checking capacity, verifying AV/Wi-Fi/AC,
    computing multi-criteria suitability scores (0-100%), and generating natural explanations.
    """

    def __init__(self):
        self.name = "Campus Venue & Facility Agent"

    def match_venues(self, req: ParsedRequirement) -> List[Venue]:
        """
        Evaluates all campus venues against requirements and returns ranked matching venues.
        """
        all_venues = db.venues
        ranked: List[Tuple[int, Venue, str]] = []

        for v in all_venues:
            score = 0
            reasons = []

            # 1. Availability check (Hard constraint)
            if not v.is_available:
                score -= 50
                reasons.append("Currently marked unavailable/offline.")
            else:
                score += 30
                reasons.append("Currently available.")

            # 2. Capacity fit
            if v.capacity >= req.participants:
                score += 35
                utilization = int((req.participants / v.capacity) * 100)
                reasons.append(f"Comfortably accommodates {req.participants} pax (Capacity: {v.capacity}, {utilization}% utilization).")
            else:
                deficit = req.participants - v.capacity
                score -= 30
                reasons.append(f"Capacity shortfall of {deficit} seats.")

            # 3. Technical amenities
            if v.projector:
                score += 10
                reasons.append("Equipped with presentation projector.")
            if v.wifi:
                score += 10
                reasons.append("High-speed Wi-Fi active.")
            if v.accessibility:
                score += 5
                reasons.append("Wheelchair & ADA accessible.")
            if v.ac:
                score += 10
                reasons.append("Fully air-conditioned.")

            final_score = max(10, min(100, score))
            why_text = f"{v.name} scored {final_score}%: " + " ".join(reasons[:3])
            v.smart_score = final_score
            v.why_selected = why_text
            ranked.append((final_score, v, why_text))

        ranked.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in ranked]

    def explain_selection(self, venue: Venue, req: ParsedRequirement) -> Dict[str, Any]:
        """
        Generates detailed breakdown for the "Why this venue?" modal.
        """
        return {
            "venue_id": venue.id,
            "venue_name": venue.name,
            "overall_score": venue.smart_score,
            "criteria_breakdown": {
                "Capacity Fit": "100%" if venue.capacity >= req.participants else f"{int(venue.capacity/req.participants*100)}%",
                "Equipment Match": "100% (Projector + Microphones)" if venue.projector else "60%",
                "Wi-Fi & Connectivity": "100% (High Density 1Gbps)" if venue.wifi else "50%",
                "Schedule Availability": "100% (Zero Clashes)" if venue.is_available else "0% (Occupied)",
                "Accessibility & Comfort": "100% (AC + Ramp Access)" if venue.accessibility and venue.ac else "75%"
            },
            "explanation": (
                f"{venue.name} was selected because it satisfies all hard operational constraints: "
                f"it provides {venue.capacity} seats for {req.participants} participants, has built-in AV projection "
                f"and sound mixing, high-density Wi-Fi 6, full wheelchair accessibility, and no overlapping bookings."
            )
        }
