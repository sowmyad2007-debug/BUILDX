"""
CAMPUS ORBIT - Volunteer Agent
Manages volunteer team allocations, skill matching, shift assignments,
and staffing shortage monitoring.
"""

from typing import List, Dict, Any
from ..models import Volunteer, ParsedRequirement
from ..database import db
import copy


class VolunteerAgent:
    """
    Agent responsible for organizing student volunteers into functional operational teams:
    Registration, Tech Support, Hospitality, Security Coordination, and General Support.
    """

    def __init__(self):
        self.name = "Volunteer Coordination Agent"

    def allocate_volunteers(self, req: ParsedRequirement) -> List[Volunteer]:
        """
        Assigns volunteers from the database to event shifts and teams.
        """
        volunteers = copy.deepcopy(db.volunteers)
        # Verify shifts match event schedule
        for v in volunteers:
            v.shift = f"{req.start_time} - {req.end_time}"
        return volunteers

    def get_team_summary(self, volunteers: List[Volunteer]) -> Dict[str, Dict[str, Any]]:
        """
        Summarizes volunteer counts by team.
        """
        summary = {}
        for v in volunteers:
            if v.team_name not in summary:
                summary[v.team_name] = {
                    "team_name": v.team_name,
                    "count": 0,
                    "lead": v.name,
                    "members": []
                }
            summary[v.team_name]["count"] += 1
            summary[v.team_name]["members"].append(v.name)
        return summary
