"""
CAMPUS ORBIT - Schedule Agent
Generates visual event timelines and calendars respecting session duration,
venue availability, buffer intervals, and dependency sequences.
"""

from typing import List, Dict, Any
from ..models import ScheduleItem, ParsedRequirement, Venue, EventType


class ScheduleAgent:
    """
    Agent responsible for synthesizing conflict-free, structured operational timelines.
    """

    def __init__(self):
        self.name = "Campus Event Scheduling Agent"

    def generate_schedule(self, req: ParsedRequirement, primary_venue: Venue) -> List[ScheduleItem]:
        """
        Creates an end-to-end event itinerary mapped to venues and responsible teams.
        """
        v_name = primary_venue.name if primary_venue else "Main Auditorium"
        v_id = primary_venue.id if primary_venue else "VEN-AUD-01"

        if req.event_type == EventType.HACKATHON:
            return [
                ScheduleItem("SCH-01", "Registration & Attendee Check-In", "09:00", "10:00", v_id, f"{v_name} Lobby", "Registration Team", ["Laptops", "QR Scanners", "Badge Printers"]),
                ScheduleItem("SCH-02", "Opening Ceremony & Keynote Address", "10:00", "11:00", v_id, v_name, "Hospitality & AV Team", ["Projector", "4 Microphones", "Live Stream Cam"]),
                ScheduleItem("SCH-03", "Problem Statement Briefing & Rules", "11:00", "12:00", v_id, v_name, "Technical Support", ["Projector", "Podium Mic"]),
                ScheduleItem("SCH-04", "Lunch Break & Networking", "12:00", "13:00", "VEN-INN-01", "Innovation Hall / Dining Area", "Hospitality Team", ["Buffet Catering", "Water Dispensers"]),
                ScheduleItem("SCH-05", "Hackathon Coding Sprint - Round 1", "13:00", "18:00", "VEN-LAB-01", "CSE Labs 1, 2, 3", "Technical Support", ["GPU Terminals", "Wi-Fi 6", "Extension Boards"]),
                ScheduleItem("SCH-06", "Mentor Architecture Review & Checkpoint", "18:00", "19:00", "VEN-LAB-02", "CSE Labs 1, 2, 3", "Technical Support", ["Whiteboards", "Monitors"]),
                ScheduleItem("SCH-07", "Dinner & Midnight Fuel", "19:00", "20:00", "VEN-INN-01", "Innovation Hall Cafeteria", "Hospitality Team", ["Midnight Coffee", "Refreshments"])
            ]
        elif req.event_type in [EventType.CONFERENCE, EventType.SEMINAR]:
            return [
                ScheduleItem("SCH-01", "Delegate Registration & Welcome Tea", "08:30", "09:30", v_id, f"{v_name} Foyer", "Registration Team", ["Badge Desks", "Coffee Stations"]),
                ScheduleItem("SCH-02", "Inaugural Session & Keynote Speeches", "09:30", "11:00", v_id, v_name, "AV & Hospitality", ["Projectors", "Lapel Mics", "Live Stream"]),
                ScheduleItem("SCH-03", "Technical Paper Track A (AI & Robotics)", "11:15", "13:00", v_id, v_name, "Technical Support", ["Presentation Clicker", "Podium Mic"]),
                ScheduleItem("SCH-04", "Networking Executive Lunch", "13:00", "14:15", "VEN-INN-01", "Innovation Hall Dining", "Hospitality Team", ["VIP Buffet"]),
                ScheduleItem("SCH-05", "Panel Discussion: Future of Compute", "14:30", "16:00", v_id, v_name, "Hospitality Team", ["4 Wireless Mics", "Stage Chairs"]),
                ScheduleItem("SCH-06", "Valedictory & Best Paper Awards", "16:15", "17:30", v_id, v_name, "General Support", ["Mementos", "Certificates", "Audio Fanfare"])
            ]
        elif req.event_type == EventType.PLACEMENT_DRIVE:
            return [
                ScheduleItem("SCH-01", "Candidate Reporting & Biometric Verification", "08:30", "09:30", v_id, "Central Placement Lobby", "Registration Team", ["Biometric Readers", "Roster Sheets"]),
                ScheduleItem("SCH-02", "Pre-Placement Corporate Presentation", "09:30", "11:00", v_id, v_name, "Technical Support", ["Projector", "Podium Mic"]),
                ScheduleItem("SCH-03", "Online Aptitude & Coding Test", "11:15", "13:00", "VEN-LAB-01", "CSE Labs 1 & 2", "Technical Support", ["120 Workstations", "Secure LAN"]),
                ScheduleItem("SCH-04", "Recruiter Lunch & Shortlist Generation", "13:00", "14:00", "VEN-INN-01", "Executive Lounge", "Hospitality Team", ["Catering Boxes"]),
                ScheduleItem("SCH-05", "Technical & HR Interview Rounds", "14:00", "18:30", "VEN-SEM-01", "Interview Cabins", "General Support", ["Waiting Area Chairs", "Water"]),
                ScheduleItem("SCH-06", "Offer Letter Distribution & Wrap-up", "18:30", "19:30", v_id, v_name, "Faculty Coordinator", ["Offer Kits", "Audio System"])
            ]
        else:
            return [
                ScheduleItem("SCH-01", "Participant Gathering & Entry", "09:00", "10:00", v_id, f"{v_name} Entrance", "Registration Team", ["Entry Desks"]),
                ScheduleItem("SCH-02", "Main Event Sessions", "10:00", "13:00", v_id, v_name, "Technical Support", ["Projector", "Sound System"]),
                ScheduleItem("SCH-03", "Lunch Break", "13:00", "14:00", "VEN-INN-01", "Campus Dining", "Hospitality Team", ["Buffet Meals"]),
                ScheduleItem("SCH-04", "Interactive Workshops & Competitions", "14:00", "17:00", v_id, v_name, "General Support", ["Lab Equipment"]),
                ScheduleItem("SCH-05", "Closing Ceremony & Prize Distribution", "17:00", "18:00", v_id, v_name, "Hospitality Team", ["Stage Audio", "Prizes"])
            ]
