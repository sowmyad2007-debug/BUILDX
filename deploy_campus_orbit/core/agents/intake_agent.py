"""
Intake Agent: Parses unstructured natural language event prompts into
rigorous, strongly typed event requirement specifications.
"""

import re
from datetime import datetime, timedelta
from typing import Dict, Any, List
from ..models import ParsedRequirement, EventType


class EventIntakeAgent:
    """
    Agent responsible for processing natural language descriptions of campus events,
    extracting dates, attendee estimates, venue preferences, hardware/AV requirements,
    support services, budget constraints, and risk flags.
    """

    def __init__(self):
        self.name = "Event Intake & Requirement Extraction Agent"

    def parse_natural_language(self, prompt: str) -> ParsedRequirement:
        """
        Parses free-text event brief using heuristic entity recognition, regex,
        and domain keyword extraction.
        """
        text = prompt.strip()
        lower_text = text.lower()

        # 1. Detect Event Type
        event_type = EventType.GENERAL
        if any(w in lower_text for w in ["hackathon", "codeathon", "hack-a-thon", "24-hour", "36-hour"]):
            event_type = EventType.HACKATHON
        elif any(w in lower_text for w in ["placement", "recruitment", "interview drive", "campus hiring"]):
            event_type = EventType.PLACEMENT_DRIVE
        elif any(w in lower_text for w in ["conference", "symposium", "summit", "keynote"]):
            event_type = EventType.CONFERENCE
        elif any(w in lower_text for w in ["fest", "technical fest", "techno-cultural", "symposia"]):
            event_type = EventType.TECHNICAL_FEST
        elif any(w in lower_text for w in ["workshop", "hands-on", "bootcamp", "training"]):
            event_type = EventType.WORKSHOP
        elif any(w in lower_text for w in ["cultural", "music", "concert", "dj night", "drama", "dance"]):
            event_type = EventType.CULTURAL_FEST
        elif any(w in lower_text for w in ["seminar", "guest lecture", "webinar"]):
            event_type = EventType.SEMINAR

        # 2. Extract Event Name / Title
        name_match = re.search(r'(?:title|name|called|named|hosting|organizing)\s+["\']?([^"\',.\n]+)["\']?', text, re.IGNORECASE)
        if name_match:
            event_name = name_match.group(1).strip()
        else:
            first_clause = text.split("\n")[0].split(".")[0]
            event_name = first_clause[:50].strip() if len(first_clause) > 5 else f"Campus {event_type.value}"

        # 3. Extract Dates (Look for ISO dates, DD/MM/YYYY, or Month Day format)
        today = datetime.now()
        date_pattern = r'(\d{4}-\d{2}-\d{2})|(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})|((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)'
        found_dates = re.findall(date_pattern, lower_text)

        start_date = (today + timedelta(days=14)).strftime("%Y-%m-%d")
        end_date = start_date

        if found_dates:
            extracted = [d[0] or d[1] or d[2] for d in found_dates if any(d)]
            if len(extracted) >= 1:
                start_date = self._normalize_date(extracted[0], today)
                end_date = self._normalize_date(extracted[-1], today) if len(extracted) > 1 else start_date

        # Check for multi-day duration mention
        duration_days = 1
        if "2-day" in lower_text or "2 days" in lower_text or "two days" in lower_text:
            duration_days = 2
            dt_start = datetime.strptime(start_date, "%Y-%m-%d")
            end_date = (dt_start + timedelta(days=1)).strftime("%Y-%m-%d")
        elif "3-day" in lower_text or "3 days" in lower_text or "three days" in lower_text:
            duration_days = 3
            dt_start = datetime.strptime(start_date, "%Y-%m-%d")
            end_date = (dt_start + timedelta(days=2)).strftime("%Y-%m-%d")

        # 4. Extract Times
        time_match = re.findall(r'(\d{1,2}(?::\d{2})?\s*(?:am|pm|hrs|hours))', lower_text)
        start_time = "09:00"
        end_time = "17:00"
        if time_match:
            start_time = self._normalize_time(time_match[0], "09:00")
            if len(time_match) > 1:
                end_time = self._normalize_time(time_match[-1], "18:00")

        # 5. Extract Attendee Count
        attendee_match = re.search(r'(\d+)\s*(?:people|attendees|participants|students|candidates|delegates|members|audience|pax)', lower_text)
        expected_attendees = 150
        if attendee_match:
            expected_attendees = int(attendee_match.group(1))
        elif "200" in lower_text:
            expected_attendees = 200
        elif "500" in lower_text:
            expected_attendees = 500
        elif "100" in lower_text:
            expected_attendees = 100
        elif "50" in lower_text:
            expected_attendees = 50

        # 6. Extract Budget
        budget_match = re.search(r'(?:\$|rs\.?|inr|usd|budget\s*of\s*|budget\s*[:=]?\s*)\s*(\d+(?:,\d+)*(?:\.\d+)?)', lower_text)
        budget_limit = 2500.0
        if budget_match:
            clean_num = budget_match.group(1).replace(",", "")
            budget_limit = float(clean_num)

        # 7. Venue requirements & Specific Requested Venues
        primary_venue_type = "Auditorium"
        if event_type in [EventType.HACKATHON, EventType.WORKSHOP]:
            primary_venue_type = "Lab"
        elif event_type in [EventType.CULTURAL_FEST]:
            primary_venue_type = "Ground"
        elif event_type in [EventType.PLACEMENT_DRIVE]:
            primary_venue_type = "Hall"
        elif event_type in [EventType.SEMINAR]:
            primary_venue_type = "Seminar Hall"

        specific_venue_requested = None
        if "main audi" in lower_text or "abdul kalam" in lower_text or "main auditorium" in lower_text:
            specific_venue_requested = "V-AUD-01"
        elif "mini audi" in lower_text or "raman mini" in lower_text:
            specific_venue_requested = "V-AUD-02"
        elif "seminar hall a" in lower_text or "aryabhatta" in lower_text:
            specific_venue_requested = "V-SEM-A"
        elif "seminar hall b" in lower_text or "bhaskara" in lower_text:
            specific_venue_requested = "V-SEM-B"
        elif "lab 1" in lower_text or "ai lab" in lower_text or "hpc lab" in lower_text:
            specific_venue_requested = "V-LAB-01"
        elif "lab 2" in lower_text or "cloud lab" in lower_text:
            specific_venue_requested = "V-LAB-02"
        elif "lab 3" in lower_text or "iot lab" in lower_text or "robotics lab" in lower_text:
            specific_venue_requested = "V-LAB-03"
        elif "amphitheatre" in lower_text or "oat" in lower_text or "ground" in lower_text:
            specific_venue_requested = "V-AMP-01"
        elif "placement" in lower_text or "interview cabins" in lower_text:
            specific_venue_requested = "V-PLC-01"

        # 8. Equipment Needs Extraction
        equipment_needs: Dict[str, int] = {}
        
        # Mics
        mic_count = 2
        mic_match = re.search(r'(\d+)\s*(?:mic|mics|microphones)', lower_text)
        if mic_match:
            mic_count = int(mic_match.group(1))
        equipment_needs["EQ-MIC-01"] = mic_count
        equipment_needs["EQ-MIC-02"] = 2

        # Projector
        if any(w in lower_text for w in ["projector", "screen", "presentation", "slides"]):
            equipment_needs["EQ-PRJ-01"] = 2 if expected_attendees > 300 else 1

        # Sound & Audio
        if any(w in lower_text for w in ["sound", "audio", "speaker system", "dj", "amplification", "concert"]):
            equipment_needs["EQ-SND-01"] = 1

        # VR Headsets
        vr_match = re.search(r'(\d+)\s*(?:vr|quest|headset)', lower_text)
        if vr_match:
            equipment_needs["EQ-VR-01"] = int(vr_match.group(1))
        elif "vr" in lower_text or "virtual reality" in lower_text:
            equipment_needs["EQ-VR-01"] = 10

        # Networking & Power Extensions
        if event_type == EventType.HACKATHON or "power strip" in lower_text or "lan" in lower_text or "wifi" in lower_text:
            equipment_needs["EQ-NET-01"] = max(2, expected_attendees // 40)
            equipment_needs["EQ-NET-02"] = max(2, expected_attendees // 50)
            equipment_needs["EQ-PWR-01"] = max(10, expected_attendees // 4)

        # Stage Lights
        if event_type in [EventType.CULTURAL_FEST, EventType.TECHNICAL_FEST] or "lighting" in lower_text:
            equipment_needs["EQ-STG-01"] = 8

        # Live Streaming Camera
        if any(w in lower_text for w in ["live stream", "broadcast", "recording", "hybrid", "youtube"]):
            equipment_needs["EQ-CAM-01"] = 1

        # 9. Support Services
        support_teams: List[str] = ["Security", "Housekeeping"]
        if any(w in lower_text for w in ["catering", "food", "lunch", "dinner", "snacks", "coffee", "breakfast", "refreshments"]):
            support_teams.append("Catering")
        if any(w in lower_text for w in ["transport", "bus", "shuttle", "pickup", "van", "transit"]):
            support_teams.append("Transport")
        if event_type in [EventType.HACKATHON, EventType.WORKSHOP, EventType.TECHNICAL_FEST]:
            support_teams.append("IT_Network")
        if expected_attendees >= 300 or event_type == EventType.CULTURAL_FEST:
            support_teams.append("Medical")

        # 10. Volunteer Skills Needed
        volunteer_skills = ["Registration Desk", "Hospitality"]
        if event_type in [EventType.HACKATHON, EventType.WORKSHOP]:
            volunteer_skills.extend(["Tech Support", "Networking", "Hackathon Mentorship"])
        if event_type in [EventType.CONFERENCE, EventType.SEMINAR]:
            volunteer_skills.extend(["AV Operation", "VIP Escort"])
        if event_type in [EventType.CULTURAL_FEST, EventType.TECHNICAL_FEST]:
            volunteer_skills.extend(["Crowd Control", "Stage Management", "Social Media"])
        if "live stream" in lower_text:
            volunteer_skills.append("Live Stream")

        # 11. Security & Compliance Risk Flags
        overnight = any(w in lower_text for w in ["overnight", "24-hour", "24 hour", "all night", "night access", "midnight"])
        vip_guest = any(w in lower_text for w in ["vip", "director", "minister", "ceo", "dignitary", "keynote speaker", "external guest"])
        heavy_power = any(w in lower_text for w in ["heavy power", "generator", "high power", "amps", "ac loads"])
        outdoor_sound = any(w in lower_text for w in ["outdoor sound", "loudspeaker", "dj", "concert", "open air"])

        return ParsedRequirement(
            raw_prompt=prompt,
            event_name=event_name,
            event_type=event_type,
            participants=expected_attendees,
            expected_attendees=expected_attendees,
            duration_days=duration_days,
            start_date=start_date,
            end_date=end_date,
            start_time=start_time,
            end_time=end_time,
            budget_limit=budget_limit,
            primary_venue_type=primary_venue_type,
            specific_venue_requested=specific_venue_requested,
            equipment_needs=equipment_needs,
            volunteer_skills_needed=list(set(volunteer_skills)),
            support_teams_required=list(set(support_teams)),
            catering_needed="Catering" in support_teams,
            transport_needed="Transport" in support_teams,
            overnight_access=overnight,
            external_guests_vip=vip_guest,
            heavy_power_needed=heavy_power,
            sound_amplification_outdoor=outdoor_sound,
            special_notes="Auto-extracted by AI Intake Agent"
        )

    def _normalize_date(self, raw_str: str, base_date: datetime) -> str:
        raw_str = raw_str.strip().lower().replace(",", "")
        month_map = {
            "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
            "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12
        }
        for m_name, m_num in month_map.items():
            if m_name in raw_str:
                day_match = re.search(r'\d{1,2}', raw_str)
                day = int(day_match.group(0)) if day_match else 15
                year = base_date.year
                year_match = re.search(r'\b(202\d)\b', raw_str)
                if year_match:
                    year = int(year_match.group(1))
                return f"{year:04d}-{m_num:02d}-{day:02d}"

        if "-" in raw_str and len(raw_str.split("-")[0]) == 4:
            return raw_str
        return (base_date + timedelta(days=14)).strftime("%Y-%m-%d")

    def _normalize_time(self, raw_time: str, fallback: str) -> str:
        raw_time = raw_time.strip().lower()
        if "am" in raw_time:
            num = re.findall(r'\d+', raw_time)[0]
            val = int(num)
            return f"{val:02d}:00"
        elif "pm" in raw_time:
            num = re.findall(r'\d+', raw_time)[0]
            val = int(num)
            if val < 12:
                val += 12
            return f"{val:02d}:00"
        return fallback
