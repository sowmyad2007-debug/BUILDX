"""
CAMPUS ORBIT - In-Memory & Persistent Campus Database
Pre-populated with rich, realistic campus venues, equipment inventory, volunteer rosters,
pre-existing bookings, demo events, and governance policies.
"""

from typing import List, Dict, Any, Optional
import copy
from datetime import datetime
from .models import (
    Venue, ResourceItem, Volunteer, TaskItem, ConflictItem, ApprovalItem,
    NotificationItem, ScheduleItem, ParsedRequirement, OperationalPlan,
    TaskStatus, TaskPriority, ConflictSeverity, ApprovalStatus, NotificationPriority,
    EventType, User, CampusEvent, ParticipantRegistration
)


def get_demo_venues() -> List[Venue]:
    return [
        Venue(
            id="VEN-AUD-01",
            name="Main Auditorium",
            capacity=500,
            projector=True,
            microphones=4,
            wifi=True,
            accessibility=True,
            ac=True,
            computers=0,
            hourly_rate=120.0,
            location="Central Academic Block - Ground Floor",
            is_available=True,
            smart_score=96,
            why_selected="Highest capacity (500 pax), full acoustic isolation, dual 4K laser projection and stage lighting.",
            amenities=["Tiered Seating", "Green Room", "VIP Lounge", "Live Stream Suite", "Stage Lighting"]
        ),
        Venue(
            id="VEN-INN-01",
            name="Innovation Hall",
            capacity=250,
            projector=True,
            microphones=3,
            wifi=True,
            accessibility=True,
            ac=True,
            computers=0,
            hourly_rate=75.0,
            location="Student Activity Center - 1st Floor",
            is_available=True,
            smart_score=94,
            why_selected="Modern modular seating, high density Wi-Fi 6, 250 capacity, zero timetable clashes.",
            amenities=["Modular Desks", "Display Monitors", "Whiteboards", "Sound System"]
        ),
        Venue(
            id="VEN-CNV-01",
            name="Convention Hall",
            capacity=400,
            projector=True,
            microphones=4,
            wifi=True,
            accessibility=True,
            ac=True,
            computers=0,
            hourly_rate=95.0,
            location="Management Complex - 2nd Floor",
            is_available=True,
            smart_score=88,
            why_selected="High capacity (400 pax) with multi-mic sound setup and video conferencing.",
            amenities=["Tiered Seating", "Acoustic Wall", "Podium Mic", "Air Conditioned"]
        ),
        Venue(
            id="VEN-SEM-01",
            name="Seminar Hall",
            capacity=180,
            projector=True,
            microphones=2,
            wifi=True,
            accessibility=True,
            ac=True,
            computers=0,
            hourly_rate=45.0,
            location="ECE Department - 2nd Floor",
            is_available=True,
            smart_score=82,
            why_selected="Ideal for medium workshops and keynote breakouts up to 180 people.",
            amenities=["Interactive Smartboard", "Surround Sound", "Collar Microphones"]
        ),
        Venue(
            id="VEN-LAB-01",
            name="CSE Lab 1",
            capacity=60,
            projector=True,
            microphones=1,
            wifi=True,
            accessibility=True,
            ac=True,
            computers=60,
            hourly_rate=50.0,
            location="Computer Science Block - 3rd Floor",
            is_available=True,
            smart_score=92,
            why_selected="60 High-end GPU Linux workstations, Gigabit LAN drops, UPS backup.",
            amenities=["60 GPU Workstations", "Gigabit LAN Drops", "Dedicated UPS", "Whiteboard Wall"]
        ),
        Venue(
            id="VEN-LAB-02",
            name="CSE Lab 2",
            capacity=60,
            projector=True,
            microphones=1,
            wifi=True,
            accessibility=True,
            ac=True,
            computers=60,
            hourly_rate=50.0,
            location="Computer Science Block - 3rd Floor",
            is_available=True,
            smart_score=90,
            why_selected="60 Intel i7 developer terminals, dual monitor setups for coding sprints.",
            amenities=["60 Workstations", "Dual Monitors", "Dedicated Server Rack"]
        ),
        Venue(
            id="VEN-LAB-03",
            name="CSE Lab 3",
            capacity=60,
            projector=True,
            microphones=1,
            wifi=True,
            accessibility=True,
            ac=True,
            computers=60,
            hourly_rate=50.0,
            location="Computer Science Block - 4th Floor",
            is_available=True,
            smart_score=90,
            why_selected="60 Workstations with makerspace IoT prototyping kits and 3D printers.",
            amenities=["60 Workstations", "IoT Kits", "Oscilloscopes", "Soldering Stations"]
        ),
        Venue(
            id="VEN-AMP-01",
            name="Open Air Amphitheatre",
            capacity=1200,
            projector=False,
            microphones=6,
            wifi=True,
            accessibility=True,
            ac=False,
            computers=0,
            hourly_rate=110.0,
            location="Central Campus Greens",
            is_available=True,
            smart_score=78,
            why_selected="Massive outdoor capacity (1200 pax) with high-mast floodlights and generator hookup.",
            amenities=["Open Stage", "Stepped Seating", "High-Mast Floodlights", "Generator Terminal"]
        )
    ]


def get_demo_resources() -> List[ResourceItem]:
    return [
        ResourceItem(
            id="RES-PRJ",
            name="Projectors",
            category="AV",
            total_qty=8,
            allocated_qty=5,
            available_qty=3,
            shortage_qty=1,
            unit_cost=45.0,
            ai_recommendation="Borrow 1 projector from ECE Seminar Hall to cover requirement."
        ),
        ResourceItem(
            id="RES-MIC",
            name="Microphones",
            category="AV",
            total_qty=12,
            allocated_qty=8,
            available_qty=4,
            shortage_qty=0,
            unit_cost=15.0,
            ai_recommendation="Sufficient wireless microphones available in Central Media store."
        ),
        ResourceItem(
            id="RES-LAP",
            name="Laptops & Workstations",
            category="Computing",
            total_qty=120,
            allocated_qty=100,
            available_qty=20,
            shortage_qty=0,
            unit_cost=25.0,
            ai_recommendation="Pre-configure Linux OS image with Docker & VS Code."
        ),
        ResourceItem(
            id="RES-EXT",
            name="Extension Boards & Spike Strips",
            category="Power",
            total_qty=30,
            allocated_qty=24,
            available_qty=6,
            shortage_qty=0,
            unit_cost=5.0,
            ai_recommendation="Distribute 8 heavy-duty surge protected spike strips across each lab."
        ),
        ResourceItem(
            id="RES-WIF",
            name="Wi-Fi Routers / Access Points",
            category="Networking",
            total_qty=8,
            allocated_qty=6,
            available_qty=2,
            shortage_qty=0,
            unit_cost=30.0,
            ai_recommendation="Deploy dedicated 'CAMPUS_ORBIT_5G' SSID with high QoS bandwidth."
        ),
        ResourceItem(
            id="RES-SPK",
            name="Speakers & Audio Consoles",
            category="AV",
            total_qty=6,
            allocated_qty=4,
            available_qty=2,
            shortage_qty=0,
            unit_cost=80.0,
            ai_recommendation="Connect digital mixer to auditorium line array."
        ),
        ResourceItem(
            id="RES-CHR",
            name="Chairs",
            category="Furniture",
            total_qty=500,
            allocated_qty=350,
            available_qty=150,
            shortage_qty=0,
            unit_cost=2.0,
            ai_recommendation="Sufficient seating buffer available."
        ),
        ResourceItem(
            id="RES-TBL",
            name="Tables & Workbenches",
            category="Furniture",
            total_qty=100,
            allocated_qty=75,
            available_qty=25,
            shortage_qty=0,
            unit_cost=8.0,
            ai_recommendation="Arrange modular cluster tables for team hackathon tracks."
        )
    ]


def get_demo_volunteers() -> List[Volunteer]:
    return [
        # Registration Team (4)
        Volunteer("VOL-01", "Pooja Verma", "Information Tech", 3, ["QR Scanning", "Badging", "Guest Greeting"], "Registration Team", "Lead Registrar", "+91-98765-01001"),
        Volunteer("VOL-02", "Diya Mukherjee", "Management Studies", 2, ["Helpdesk", "Kit Distribution"], "Registration Team", "Kit Desk Coordinator", "+91-98765-01002"),
        Volunteer("VOL-03", "Rahul Roy", "Computer Science", 2, ["Attendee Verification", "Queue Flow"], "Registration Team", "Queue Manager", "+91-98765-01003"),
        Volunteer("VOL-04", "Simran Kaur", "ECE", 3, ["Spot Registration", "Data Entry"], "Registration Team", "Data Desk", "+91-98765-01004"),

        # Technical Support (5)
        Volunteer("VOL-05", "Aarav Sharma", "Computer Science", 3, ["LAN Drops", "Wi-Fi Config", "Linux"], "Technical Support", "Tech Lead", "+91-98765-01005"),
        Volunteer("VOL-06", "Rohan Mehta", "ECE", 4, ["Audio Console", "Projector HDMI", "Mics"], "Technical Support", "AV Operator", "+91-98765-01006"),
        Volunteer("VOL-07", "Riya Sen", "ECE", 3, ["YouTube Live Stream", "OBS Studio", "PTZ Cam"], "Technical Support", "Broadcast Engineer", "+91-98765-01007"),
        Volunteer("VOL-08", "Karthik Nair", "Electrical Engg", 4, ["UPS Backup", "Spike Strips", "Power Line"], "Technical Support", "Power Coordinator", "+91-98765-01008"),
        Volunteer("VOL-09", "Aditya Joshi", "Computer Science", 4, ["Docker", "GitHub", "API Mentoring"], "Technical Support", "Mentor Liaison", "+91-98765-01009"),

        # Hospitality (4)
        Volunteer("VOL-10", "Ananya Iyer", "Information Tech", 3, ["VIP Escort", "Speaker Hospitality"], "Hospitality", "Hospitality Lead", "+91-98765-01010"),
        Volunteer("VOL-11", "Neha Reddy", "Biotech", 2, ["Guest Refreshments", "Green Room"], "Hospitality", "Green Room In-charge", "+91-98765-01011"),
        Volunteer("VOL-12", "Tanmay Sen", "Mechanical", 3, ["Catering Token Flow", "Water Stations"], "Hospitality", "Dining Coordinator", "+91-98765-01012"),
        Volunteer("VOL-13", "Meera Pillai", "Management", 2, ["Speaker Gift Kits", "Mementos"], "Hospitality", "Mementos Protocol", "+91-98765-01013"),

        # Security Coordination (3)
        Volunteer("VOL-14", "Vikram Rathore", "Mechanical Engg", 3, ["Crowd Flow", "Perimeter Gate Check"], "Security Coordination", "Security Liaison Lead", "+91-98765-01014"),
        Volunteer("VOL-15", "Harsh Vardhan", "Civil Engg", 3, ["VIP Parking Barricades", "Fire Exit Path"], "Security Coordination", "Safety Officer", "+91-98765-01015"),
        Volunteer("VOL-16", "Nitin Rao", "Electrical", 2, ["Overnight Patrol Register", "Badge Check"], "Security Coordination", "Night Patrol Liaison", "+91-98765-01016"),

        # General Support (4)
        Volunteer("VOL-17", "Sneha Patel", "Computer Science", 2, ["Social Media Updates", "Photography"], "General Support", "Media Lead", "+91-98765-01017"),
        Volunteer("VOL-18", "Manish Tiwari", "ECE", 2, ["Signage Placards", "Direction Boards"], "General Support", "Signage Coordinator", "+91-98765-01018"),
        Volunteer("VOL-19", "Divya Nair", "Management", 3, ["Certificate Printing", "Prize Logistics"], "General Support", "Awards In-charge", "+91-98765-01019"),
        Volunteer("VOL-20", "Siddharth Das", "Computer Science", 1, ["Runners & Fast Response"], "General Support", "Runner Lead", "+91-98765-01020")
    ]


def get_demo_tasks() -> List[TaskItem]:
    return [
        TaskItem("TSK-01", "Book Auditorium & CSE Labs", "Faculty Coordinator", "Prof. R. K. Verma", TaskPriority.CRITICAL, "Aug 24", TaskStatus.COMPLETED, "T-14 Days", [
            {"item": "Submit online venue reservation form", "done": True},
            {"item": "Dean Student Welfare signature endorsement", "done": True}
        ]),
        TaskItem("TSK-02", "Publish Registration Portal & Posters", "Media & Web Team", "Sneha Patel", TaskPriority.HIGH, "Aug 25", TaskStatus.COMPLETED, "T-14 Days", [
            {"item": "QR Code registration link active", "done": True},
            {"item": "Digital posters distributed across student channels", "done": True}
        ]),
        TaskItem("TSK-03", "Arrange Projectors & AV Systems", "Technical Support", "Rohan Mehta", TaskPriority.HIGH, "Aug 26", TaskStatus.IN_PROGRESS, "T-7 Days", [
            {"item": "Test wireless microphones and replace AA batteries", "done": True},
            {"item": "Reserve 4K laser projector from ECE Seminar Hall", "done": False}
        ]),
        TaskItem("TSK-04", "Test Wi-Fi 6 & NOC Uplink", "IT & Network Ops", "Aarav Sharma", TaskPriority.CRITICAL, "Aug 26", TaskStatus.IN_PROGRESS, "T-7 Days", [
            {"item": "Deploy dedicated SSID 'CAMPUS_ORBIT_5G'", "done": True},
            {"item": "Whitelist GitHub, Docker, and dev endpoints", "done": False}
        ]),
        TaskItem("TSK-05", "Prepare Registration Desk & Badges", "Registration Team", "Pooja Verma", TaskPriority.MEDIUM, "Aug 27", TaskStatus.PENDING, "T-3 Days", [
            {"item": "Print 300 attendee ID badges", "done": False},
            {"item": "Setup 4 parallel check-in laptop terminals", "done": False}
        ]),
        TaskItem("TSK-06", "Security Perimeter & VIP Parking", "Security Coordination", "Vikram Rathore", TaskPriority.HIGH, "Aug 27", TaskStatus.PENDING, "T-1 Day", [
            {"item": "Barricade VIP parking slots near Main Block", "done": False},
            {"item": "Brief security guards on overnight lab access register", "done": False}
        ]),
        TaskItem("TSK-07", "Catering Confirmation & Refreshments", "Hospitality Team", "Diya Mukherjee", TaskPriority.HIGH, "Aug 27", TaskStatus.PENDING, "T-1 Day", [
            {"item": "Confirm dietary headcount with Campus Dining", "done": False},
            {"item": "Inspect water dispenser cooler stations at labs", "done": False}
        ]),
        TaskItem("TSK-08", "Teardown, Gear Return & NOC Sign-off", "Organizing Core", "Faculty Advisor", TaskPriority.MEDIUM, "Aug 29", TaskStatus.PENDING, "Post-Event", [
            {"item": "Return borrowed projectors and switches to Media Center", "done": False},
            {"item": "Submit final bills to Finance Office", "done": False}
        ])
    ]


def get_demo_conflicts() -> List[ConflictItem]:
    return [
        ConflictItem(
            id="CONF-01",
            category="VENUE_COLLISION",
            severity=ConflictSeverity.CRITICAL,
            title="Venue Conflict in Main Auditorium",
            description="Opening Ceremony (10:00–12:00) clashes with Annual Department Guest Lecture (11:00–13:00) booked by Alumni Relations.",
            impacted_resource="Main Auditorium",
            recommended_alternatives=[
                "Move Opening Ceremony to Innovation Hall (Capacity: 250 pax, Score: 94%)",
                "Move to Convention Hall (Capacity: 400 pax, Score: 88%)",
                "Shift Opening Ceremony time to 08:30–10:30 AM"
            ],
            resolved=False
        ),
        ConflictItem(
            id="CONF-02",
            category="RESOURCE_SHORTAGE",
            severity=ConflictSeverity.MAJOR,
            title="Equipment Shortage: 1 Projector Deficit",
            description="Event requires 4 high-lumen projectors across Main Auditorium and Labs, but only 3 are in central stock.",
            impacted_resource="Projectors (Inventory: 3 Available / 4 Required)",
            recommended_alternatives=[
                "Borrow 1 portable laser projector from ECE Seminar Hall",
                "Utilize large 85-inch digital display panel in Innovation Hub",
                "Authorize external dry-hire rental ($45.00)"
            ],
            resolved=False
        )
    ]


def get_demo_approvals() -> List[ApprovalItem]:
    return [
        ApprovalItem(
            id="APP-01",
            category="VENUE",
            title="Main Auditorium & CSE Labs Reservation Sanction",
            approver_role="Estate Officer & Registrar",
            recommendation="Sanction reservation of Main Auditorium and CSE Labs 1, 2, 3.",
            reason="Large multi-track hackathon requiring both keynote stage and dedicated GPU coding pods.",
            estimated_cost=960.0,
            risk_level="Low",
            impact="Primary event venue lock-in.",
            status=ApprovalStatus.PENDING
        ),
        ApprovalItem(
            id="APP-02",
            category="SECURITY",
            title="Overnight Campus Operation & Hostel Curfew Waiver",
            approver_role="Chief Security Officer (CSO)",
            recommendation="Authorize 24-hour overnight lab access for 300 participants with 2 roving night guards.",
            reason="Hackathon teams require overnight coding sprints in CSE Labs from 21:00 to 06:00.",
            estimated_cost=150.0,
            risk_level="High",
            impact="Overnight safety, building access control, hostel attendance waiver.",
            status=ApprovalStatus.PENDING
        ),
        ApprovalItem(
            id="APP-03",
            category="BUDGET",
            title="Institutional Budget Grant Authorization ($3,450)",
            approver_role="Chief Finance Officer (CFO)",
            recommendation="Grant operational expenditure sanction of $3,450 from Student Activity Tech Fund.",
            reason="Covers catering for 300 pax, high-speed Wi-Fi switch rental, and prizes.",
            estimated_cost=3450.0,
            risk_level="Medium",
            impact="Financial grant disbursement and vendor advances.",
            status=ApprovalStatus.PENDING
        ),
        ApprovalItem(
            id="APP-04",
            category="PERMISSION",
            title="External VIP Dignitary & Keynote Security Protocol",
            approver_role="Dean of Student Welfare (DSW)",
            recommendation="Approve VIP guest escort protocol for Dr. Vikram Roy (Google DeepMind Director).",
            reason="Requires VIP lounge access, designated parking bay, and student escort team.",
            estimated_cost=200.0,
            risk_level="Medium",
            impact="Protocol compliance, campus reputation, and media coverage.",
            status=ApprovalStatus.PENDING
        )
    ]


def get_demo_notifications() -> List[NotificationItem]:
    return [
        NotificationItem(
            id="NOTIF-01",
            title="Critical Venue Conflict Detected",
            message="Main Auditorium has a time collision between 11:00 AM - 12:00 PM. AI recommendation: Reallocate to Innovation Hall.",
            priority=NotificationPriority.CRITICAL,
            timestamp="10:15 AM",
            category="Conflict"
        ),
        NotificationItem(
            id="NOTIF-02",
            title="Projector Shortage Alert",
            message="Required: 4 projectors | Available: 3. AI recommendation: Borrow 1 projector from ECE Seminar Hall.",
            priority=NotificationPriority.WARNING,
            timestamp="09:45 AM",
            category="Resource"
        ),
        NotificationItem(
            id="NOTIF-03",
            title="Human Approval Required",
            message="Overnight lab access & budget sanction ($3,450) pending endorsement by CSO and Finance Officer.",
            priority=NotificationPriority.WARNING,
            timestamp="09:30 AM",
            category="Governance"
        ),
        NotificationItem(
            id="NOTIF-04",
            title="Readiness Milestone Achieved",
            message="Campus Event Readiness currently at 82%. 6/8 preliminary milestone tasks on schedule.",
            priority=NotificationPriority.SUCCESS,
            timestamp="09:00 AM",
            category="Milestone"
        )
    ]


def get_demo_schedule() -> List[ScheduleItem]:
    return [
        ScheduleItem("SCH-01", "Registration & Badge Collection", "09:00", "10:00", "VEN-AUD-01", "Main Auditorium Lobby", "Registration Team", ["Laptops", "QR Scanners", "Badge Printers"]),
        ScheduleItem("SCH-02", "Opening Ceremony & Keynote Address", "10:00", "11:00", "VEN-AUD-01", "Main Auditorium", "Hospitality & AV Team", ["Projector", "4 Wireless Mics", "Live Stream Cam"]),
        ScheduleItem("SCH-03", "Problem Statement Briefing & Track Allocation", "11:00", "12:00", "VEN-AUD-01", "Main Auditorium", "Technical Support", ["Projector", "Podium Mic"]),
        ScheduleItem("SCH-04", "Lunch & Networking Break", "12:00", "13:00", "VEN-INN-01", "Dining Hall & Innovation Hub", "Hospitality Team", ["Buffet Catering", "Water Dispensers"]),
        ScheduleItem("SCH-05", "Hackathon Coding Sprint - Round 1", "13:00", "18:00", "VEN-LAB-01", "CSE Labs 1, 2, 3", "Technical Support", ["GPU Terminals", "Wi-Fi 6", "Extension Boards"]),
        ScheduleItem("SCH-06", "Mentor Checkpoint & Architecture Review", "18:00", "19:00", "VEN-LAB-02", "CSE Labs 1, 2, 3", "Mentor Liaison Team", ["Whiteboards", "Monitors"]),
        ScheduleItem("SCH-07", "Dinner & Midnight Caffeine Fuel", "19:00", "20:00", "VEN-INN-01", "Innovation Hub Cafeteria", "Hospitality Team", ["Midnight Coffee", "Snack Boxes"])
    ]


def get_demo_events_catalog() -> List[CampusEvent]:
    return [
        CampusEvent(
            id="EVT-HACK",
            name="AI Innovation Hackathon",
            category="Flagship Hackathon",
            description="48-Hour intensive AI buildathon solving real-world challenges across Healthcare, Climate, FinTech, and Agentic Systems.",
            venue_name="Main Auditorium & CSE Labs",
            event_date="Aug 28-29, 2026",
            schedule_time="09:00 AM - 06:00 PM",
            max_participants=300,
            current_registrations=240,
            prize_1st="₹10,000 + Trophy",
            prize_2nd="₹6,000",
            prize_3rd="₹4,000",
            certificates_all=True,
            rules=["Teams of 2-4 members", "Original open-source code built during the event", "Mandatory Git check-ins every 6 hours"],
            tags=["AI", "Hackathon", "Flagship", "Coding", "Prizes"]
        ),
        CampusEvent(
            id="EVT-QUESTX",
            name="AI QuestX",
            category="Treasure Hunt & Odyssey",
            description="Algorithmic campus-wide treasure hunt with cryptic AI riddles, AR geolocation markers, and code puzzles.",
            venue_name="Student Activity Center & Campus Greens",
            event_date="Aug 28, 2026",
            schedule_time="02:00 PM - 05:30 PM",
            max_participants=150,
            current_registrations=124,
            prize_1st="₹9,000",
            prize_2nd="₹5,000",
            prize_3rd="₹3,000",
            certificates_all=True,
            rules=["Teams of 3", "Campus perimeter boundaries strictly enforced", "Time penalty for using external unauthorized bots"],
            tags=["Fun", "Treasure Hunt", "Logic", "Exploration"]
        ),
        CampusEvent(
            id="EVT-COMBAT",
            name="AI Prompt Combat",
            category="Prompt Engineering Duel",
            description="1v1 Head-to-Head arena battling LLM security defenses, jailbreaks, prompt optimization, and output fidelity.",
            venue_name="CSE Lab 1 (AI High-Performance Lab)",
            event_date="Aug 28, 2026",
            schedule_time="11:30 AM - 02:00 PM",
            max_participants=100,
            current_registrations=88,
            prize_1st="₹9,000",
            prize_2nd="₹5,000",
            prize_3rd="₹3,000",
            certificates_all=True,
            rules=["Individual entry", "Live timed rounds on sandbox evaluation server", "Scoring by automated prompt judge API"],
            tags=["LLMs", "Prompting", "Arena", "Cybersecurity"]
        ),
        CampusEvent(
            id="EVT-JAM",
            name="JAM Session (Just A Minute)",
            category="Extempore Speech & AI Ethics",
            description="Fast-paced 60-second verbal showdown testing spontaneous articulation on AI controversies, breakthroughs, and philosophy.",
            venue_name="Seminar Hall",
            event_date="Aug 28, 2026",
            schedule_time="03:30 PM - 05:00 PM",
            max_participants=80,
            current_registrations=65,
            prize_1st="₹8,000",
            prize_2nd="₹5,000",
            prize_3rd="₹3,000",
            certificates_all=True,
            rules=["Individual entry", "Topic allotted 30 seconds prior", "No hesitation, repetition, or grammatical stalls allowed"],
            tags=["Speaking", "Extempore", "Debate", "Ethics"]
        ),
        CampusEvent(
            id="EVT-EXPO",
            name="AI Expo & Innovation Showcase",
            category="Hardware & Project Exhibition",
            description="Exhibition stalls demonstrating physical robotics, IoT smart sensors, drone autonomy, and interactive GenAI kiosks.",
            venue_name="Innovation Hall Foyer",
            event_date="Aug 29, 2026",
            schedule_time="10:00 AM - 04:00 PM",
            max_participants=200,
            current_registrations=160,
            prize_1st="₹10,000",
            prize_2nd="₹6,000",
            prize_3rd="₹4,000",
            certificates_all=True,
            rules=["Working physical demo required", "Safety compliance for high-voltage and battery circuits", "Visitor voting + Jury evaluation"],
            tags=["Robotics", "Hardware", "Exhibition", "Prototypes"]
        ),
        CampusEvent(
            id="EVT-QUIZ",
            name="AI QUIZ",
            category="Trivia & Speed Teaser",
            description="Rapid-fire buzzer quiz covering neural networks, deep learning history, sci-fi lore, and tech pioneers.",
            venue_name="Convention Hall",
            event_date="Aug 29, 2026",
            schedule_time="11:00 AM - 01:00 PM",
            max_participants=250,
            current_registrations=195,
            prize_1st="₹9,000",
            prize_2nd="₹5,000",
            prize_3rd="₹3,000",
            certificates_all=True,
            rules=["Teams of 2", "Preliminary elimination round followed by 6-team stage buzzer finale", "Negative marking on wrong buzzes"],
            tags=["Quiz", "Trivia", "Buzzer", "Fast-Paced"]
        ),
        CampusEvent(
            id="EVT-POSTER",
            name="AI Poster Design",
            category="Digital Art & Visual Design",
            description="Creative showcase of GenAI artwork, architectural infographic posters, and futuristic technological visions.",
            venue_name="Central Exhibition Gallery",
            event_date="Aug 28, 2026",
            schedule_time="10:00 AM - 04:00 PM",
            max_participants=120,
            current_registrations=92,
            prize_1st="₹8,000",
            prize_2nd="₹5,000",
            prize_3rd="₹3,000",
            certificates_all=True,
            rules=["Individual or duo entries", "Submission in high-res A1 format + prompt creation log", "Jury criteria: Aesthetics, Concept & Clarity"],
            tags=["Art", "GenAI", "Design", "Posters"]
        ),
        CampusEvent(
            id="EVT-PODCAST",
            name="Podcast with Industrial Professionals",
            category="Fireside Chat & Live Recording",
            description="Live studio podcast and fireside audience Q&A with tech CEOs, AI researchers, and startup founders.",
            venue_name="Media Suite / Seminar Hall",
            event_date="Aug 29, 2026",
            schedule_time="02:00 PM - 04:30 PM",
            max_participants=180,
            current_registrations=145,
            prize_1st="₹8,000 (Best Question)",
            prize_2nd="₹5,000",
            prize_3rd="₹3,000",
            certificates_all=True,
            rules=["Audience open mic questions vetted by moderators", "Exclusive networking session for top questioners"],
            tags=["Podcast", "Industry", "Networking", "Career"]
        ),
        CampusEvent(
            id="EVT-SUMMIT",
            name="Industry Innovation Summit",
            category="Executive Conference & CXO Panel",
            description="Premier congregation of venture capitalists, institutional deans, industry CTOs, and emerging campus innovators.",
            venue_name="Main Auditorium",
            event_date="Aug 29, 2026",
            schedule_time="09:30 AM - 02:00 PM",
            max_participants=450,
            current_registrations=380,
            prize_1st="₹10,000 (Best Pitch)",
            prize_2nd="₹6,000",
            prize_3rd="₹4,000",
            certificates_all=True,
            rules=["Formal dress code required", "Interactive panel Q&A + Venture pitch showcase for student startups"],
            tags=["Summit", "CXO", "Conference", "Innovation"]
        )
    ]


def get_demo_participants() -> List[ParticipantRegistration]:
    return [
        ParticipantRegistration("REG-1001", "Rohan Verma", "rohan.verma@tech.edu", "+91-98765-11001", "IIT Delhi", "Computer Science", "EVT-HACK", "AI Innovation Hackathon", "ORBIT:REG-1001:AI_HACKATHON", event_date="Aug 28-29, 2026", registered_at="2026-08-20 10:15", checked_in=True, check_in_time="09:12 AM"),
        ParticipantRegistration("REG-1002", "Ananya Deshmukh", "ananya.d@univ.edu", "+91-98765-11002", "BITS Pilani", "Data Science", "EVT-COMBAT", "AI Prompt Combat", "ORBIT:REG-1002:PROMPT_COMBAT", event_date="Aug 28, 2026", registered_at="2026-08-20 11:30", checked_in=True, check_in_time="09:18 AM"),
        ParticipantRegistration("REG-1003", "Siddharth Menon", "siddharth.m@engg.edu", "+91-98765-11003", "NIT Trichy", "Electronics & Comm", "EVT-QUESTX", "AI QuestX", "ORBIT:REG-1003:AI_QUESTX", event_date="Aug 28, 2026", registered_at="2026-08-20 14:00", checked_in=False),
        ParticipantRegistration("REG-1004", "Meera Kulkarni", "meera.k@tech.edu", "+91-98765-11004", "DTU Delhi", "Information Technology", "EVT-JAM", "JAM Session (Just A Minute)", "ORBIT:REG-1004:JAM_SESSION", event_date="Aug 28, 2026", registered_at="2026-08-20 15:45", checked_in=True, check_in_time="09:25 AM"),
        ParticipantRegistration("REG-1005", "Tanmay Joshi", "tanmay.j@institute.edu", "+91-98765-11005", "VIT Vellore", "AI & Robotics", "EVT-EXPO", "AI Expo & Innovation Showcase", "ORBIT:REG-1005:AI_EXPO", event_date="Aug 29, 2026", registered_at="2026-08-20 16:10", checked_in=False),
        ParticipantRegistration("REG-1006", "Kavya Sundaram", "kavya.s@univ.edu", "+91-98765-11006", "IIIT Hyderabad", "Computer Science", "EVT-QUIZ", "AI QUIZ", "ORBIT:REG-1006:AI_QUIZ", event_date="Aug 29, 2026", registered_at="2026-08-20 17:20", checked_in=True, check_in_time="09:31 AM"),
        ParticipantRegistration("REG-1007", "Aditya Rawat", "aditya.r@tech.edu", "+91-98765-11007", "Manipal Institute", "Media & Design", "EVT-POSTER", "AI Poster Design", "ORBIT:REG-1007:AI_POSTER", event_date="Aug 28, 2026", registered_at="2026-08-20 18:05", checked_in=False),
        ParticipantRegistration("REG-1008", "Deepika Rao", "deepika.r@engg.edu", "+91-98765-11008", "PSG Tech", "Electrical Engg", "EVT-PODCAST", "Podcast with Industrial Professionals", "ORBIT:REG-1008:PODCAST", event_date="Aug 29, 2026", registered_at="2026-08-20 19:15", checked_in=True, check_in_time="09:40 AM"),
        ParticipantRegistration("REG-1009", "Harsh Vardhan", "harsh.v@college.edu", "+91-98765-11009", "SRM University", "MBA / Tech Mgmt", "EVT-SUMMIT", "Industry Innovation Summit", "ORBIT:REG-1009:SUMMIT", event_date="Aug 29, 2026", registered_at="2026-08-20 20:00", checked_in=False),
        ParticipantRegistration("REG-1010", "Neha Chawla", "neha.c@tech.edu", "+91-98765-11010", "Thapar Institute", "Computer Science", "EVT-HACK", "AI Innovation Hackathon", "ORBIT:REG-1010:AI_HACKATHON", event_date="Aug 28-29, 2026", registered_at="2026-08-20 21:10", checked_in=True, check_in_time="09:45 AM")
    ]


class CampusDatabase:
    """
    Stateful repository managing campus venues, resources, volunteers, events,
    conflicts, approvals, and dynamic replanning logs.
    """

    def __init__(self):
        self.venues: List[Venue] = get_demo_venues()
        self.resources: List[ResourceItem] = get_demo_resources()
        self.volunteers: List[Volunteer] = get_demo_volunteers()
        self.tasks: List[TaskItem] = get_demo_tasks()
        self.conflicts: List[ConflictItem] = get_demo_conflicts()
        self.approvals: List[ApprovalItem] = get_demo_approvals()
        self.notifications: List[NotificationItem] = get_demo_notifications()
        self.schedule: List[ScheduleItem] = get_demo_schedule()
        self.events_catalog: List[CampusEvent] = get_demo_events_catalog()
        self.participants: List[ParticipantRegistration] = get_demo_participants()
        self.active_event_plan: Optional[OperationalPlan] = None
        self._init_default_event()

    def _init_default_event(self):
        req = ParsedRequirement(
            raw_prompt="We are organizing a 2-day AI Innovation Hackathon for 300 students. We need one auditorium, three classrooms/labs, 20 volunteers, Wi-Fi, projectors, technical support, food arrangements and security.",
            event_name="AI Innovation Hackathon",
            event_type=EventType.HACKATHON,
            participants=300,
            duration_days=2,
            start_date="2026-08-28",
            end_date="2026-08-29",
            start_time="09:00",
            end_time="20:00",
            venues_requested=["Main Auditorium", "CSE Lab 1", "CSE Lab 2", "CSE Lab 3"],
            equipment=["Projectors", "Microphones", "Wi-Fi Routers", "Laptops", "Extension Boards"],
            volunteers=20,
            security_needed=True,
            transport_needed=True,
            food_needed=True,
            special_requirements=["Overnight 24h Lab Access", "VIP Keynote Dignitary", "High-Bandwidth NOC QoS"],
            budget_limit=4500.0
        )

        readiness_breakdown = {
            "venue": 100,
            "equipment": 85,
            "volunteers": 90,
            "schedule": 100,
            "security": 70,
            "transport": 80,
            "permissions": 60,
            "communication": 85
        }
        overall = int(sum(readiness_breakdown.values()) / len(readiness_breakdown))

        self.active_event_plan = OperationalPlan(
            event_id="EVT-ORBIT-01",
            requirement=req,
            venues=self.venues[:4],
            schedule=self.schedule,
            resources=self.resources,
            volunteers=self.volunteers,
            tasks=self.tasks,
            conflicts=self.conflicts,
            approvals=self.approvals,
            notifications=self.notifications,
            readiness_score=overall,
            readiness_breakdown=readiness_breakdown,
            estimated_cost=3450.0,
            status="Draft Plan - In Review",
            version=1
        )

    def toggle_venue_availability(self, venue_id: str) -> Optional[Venue]:
        for v in self.venues:
            if v.id == venue_id:
                v.is_available = not v.is_available
                # If made unavailable, raise conflict notification
                if not v.is_available:
                    self.notifications.insert(0, NotificationItem(
                        id=f"NOTIF-{len(self.notifications)+1:02d}",
                        title=f"Venue Alert: {v.name} Marked Unavailable",
                        message=f"{v.name} status changed to Offline. Dynamic replanning recommended.",
                        priority=NotificationPriority.CRITICAL,
                        category="Venue"
                    ))
                return v
        return None

    def calculate_readiness(self) -> Dict[str, Any]:
        """Dynamically computes category readiness based on actual operational state."""
        # 1. Venue readiness (affected by venue availability)
        allocated_venues = self.active_event_plan.venues if self.active_event_plan else self.venues[:4]
        avail_count = sum(1 for v in allocated_venues if v.is_available)
        venue_score = int((avail_count / max(1, len(allocated_venues))) * 100)

        # 2. Equipment readiness
        shortages = sum(r.shortage_qty for r in self.resources)
        eq_score = max(50, 100 - (shortages * 15))

        # 3. Volunteer readiness
        active_vols = sum(1 for v in self.volunteers if v.is_available)
        vol_score = int((active_vols / max(1, len(self.volunteers))) * 100)

        # 4. Schedule readiness (decreased if unapplied conflicts exist)
        active_conflicts = sum(1 for c in self.conflicts if not c.resolved)
        sched_score = max(40, 100 - (active_conflicts * 20))

        # 5. Security & Permissions (based on approvals)
        approved_count = sum(1 for a in self.approvals if a.status == ApprovalStatus.APPROVED)
        perm_score = int((approved_count / max(1, len(self.approvals))) * 100)
        sec_score = 90 if any(a.category == "SECURITY" and a.status == ApprovalStatus.APPROVED for a in self.approvals) else 65

        # 6. Tasks progress
        completed_tasks = sum(1 for t in self.tasks if t.status == TaskStatus.COMPLETED)
        in_prog_tasks = sum(1 for t in self.tasks if t.status == TaskStatus.IN_PROGRESS)
        task_score = int(((completed_tasks + in_prog_tasks * 0.5) / max(1, len(self.tasks))) * 100)

        breakdown = {
            "venue": venue_score,
            "equipment": eq_score,
            "volunteers": vol_score,
            "schedule": sched_score,
            "security": sec_score,
            "transport": 85,
            "permissions": perm_score,
            "communication": task_score
        }
        overall = int(sum(breakdown.values()) / len(breakdown))

        if self.active_event_plan:
            self.active_event_plan.readiness_score = overall
            self.active_event_plan.readiness_breakdown = breakdown

        return {"overall": overall, "breakdown": breakdown}

    # ==================== USER & AUTHENTICATION ====================
    def _init_users(self) -> List[User]:
        return [
            User(
                id="USR-001",
                name="Dr. Rajesh Sharma",
                email="admin@campusorbit.edu",
                role="Dean / Admin",
                department="Dean of Student Welfare",
                password_hash="admin123",
                avatar="RS",
                phone="+91-98765-01001"
            ),
            User(
                id="USR-002",
                name="Priya Nair",
                email="manager@campusorbit.edu",
                role="Event Manager",
                department="Computer Science & Engineering",
                password_hash="manager123",
                avatar="PN",
                phone="+91-98765-01002"
            ),
            User(
                id="USR-003",
                name="Aarav Sharma",
                email="volunteer@campusorbit.edu",
                role="Student Volunteer Lead",
                department="Computer Science & Engineering",
                password_hash="volunteer123",
                avatar="AS",
                phone="+91-98765-01003"
            )
        ]

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        if not hasattr(self, "users") or not self.users:
            self.users = self._init_users()
        email_clean = email.strip().lower()
        for u in self.users:
            if u.email.lower() == email_clean and (u.password_hash == password or password == "demo123" or not u.password_hash):
                self.current_user = u
                return u
        # Demo fallback for any valid email
        if "@" in email_clean:
            name_part = email_clean.split("@")[0].replace(".", " ").title()
            new_u = User(
                id=f"USR-{len(self.users)+1:03d}",
                name=name_part,
                email=email_clean,
                role="Event Manager",
                department="Campus Operations",
                password_hash=password,
                avatar=name_part[:2].upper() if len(name_part) >= 2 else "CO",
                phone="+91-98765-01099"
            )
            self.users.append(new_u)
            self.current_user = new_u
            return new_u
        return None

    def register_user(self, name: str, email: str, password: str, role: str, department: str, phone: str = "") -> User:
        if not hasattr(self, "users") or not self.users:
            self.users = self._init_users()
        email_clean = email.strip().lower()
        for u in self.users:
            if u.email.lower() == email_clean:
                self.current_user = u
                return u
        avatar_initials = "".join([part[0].upper() for part in name.split() if part])[:2] or "CO"
        new_u = User(
            id=f"USR-{len(self.users)+1:03d}",
            name=name.strip(),
            email=email_clean,
            role=role.strip(),
            department=department.strip(),
            password_hash=password,
            avatar=avatar_initials,
            phone=phone.strip() or "+91-98765-01099"
        )
        self.users.append(new_u)
        self.current_user = new_u
        return new_u

    def logout_user(self) -> None:
        self.current_user = None

    def get_current_user(self) -> Optional[User]:
        if not hasattr(self, "current_user") or self.current_user is None:
            if not hasattr(self, "users") or not self.users:
                self.users = self._init_users()
            self.current_user = self.users[1]  # Default to Priya Nair (Event Manager)
        return self.current_user

    # ==================== PARTICIPANTS & QR CHECK-IN ====================
    def register_participant(self, full_name: str, email: str, phone: str, college: str, department: str, event_id: str) -> ParticipantRegistration:
        import uuid
        event = next((e for e in self.events_catalog if e.id == event_id), self.events_catalog[0])
        reg_id = f"REG-{len(self.participants) + 1001}"
        clean_event_slug = event.id.replace("-", "_")
        qr_data = f"ORBIT:{reg_id}:{clean_event_slug}:{uuid.uuid4().hex[:6].upper()}"

        reg = ParticipantRegistration(
            id=reg_id,
            full_name=full_name.strip(),
            email=email.strip().lower(),
            phone=phone.strip(),
            college=college.strip() or "Campus University",
            department=department.strip() or "General Engineering",
            event_id=event.id,
            event_name=event.name,
            qr_code_data=qr_data,
            event_date=event.event_date,
            registered_at=datetime.now().strftime("%Y-%m-%d %H:%M"),
            checked_in=False,
            certificate_eligible=True
        )
        self.participants.append(reg)
        event.current_registrations += 1

        self.notifications.insert(0, NotificationItem(
            id=f"NOTIF-{len(self.notifications)+1:03d}",
            title=f"New Registration: {reg.full_name}",
            message=f"{reg.full_name} registered for {event.name} on {event.event_date} ({reg.college}). Entry QR pass generated.",
            priority=NotificationPriority.INFO,
            category="Registration"
        ))

        self.calculate_readiness()
        return reg

    def checkin_participant(self, query_id_or_qr: str, gate: str = "Main Entrance Gate A") -> tuple[bool, str, Optional[ParticipantRegistration]]:
        clean_q = query_id_or_qr.strip()
        matched = None
        for p in self.participants:
            if p.id.lower() == clean_q.lower() or p.qr_code_data == clean_q or p.email.lower() == clean_q.lower():
                matched = p
                break

        if not matched:
            return False, f"Invalid QR Code or Participant ID '{clean_q}'. No matching record found.", None

        if matched.checked_in:
            return True, f"Attendee {matched.full_name} was ALREADY checked in at {matched.check_in_time} ({matched.check_in_gate}).", matched

        matched.checked_in = True
        matched.check_in_time = datetime.now().strftime("%I:%M %p")
        matched.check_in_gate = gate

        self.notifications.insert(0, NotificationItem(
            id=f"NOTIF-{len(self.notifications)+1:03d}",
            title=f"Check-In Confirmed: {matched.full_name}",
            message=f"{matched.full_name} verified at {gate} for {matched.event_name}. Digital badge issued.",
            priority=NotificationPriority.SUCCESS,
            category="Check-In"
        ))

        self.calculate_readiness()
        return True, f"Check-in verified successfully for {matched.full_name} ({matched.event_name})!", matched

    def get_registration_stats(self) -> Dict[str, Any]:
        total_reg = len(self.participants)
        total_in = sum(1 for p in self.participants if p.checked_in)
        rate = int((total_in / max(1, total_reg)) * 100)

        event_breakdown = []
        for ev in self.events_catalog:
            ev_regs = [p for p in self.participants if p.event_id == ev.id]
            ev_in = sum(1 for p in ev_regs if p.checked_in)
            event_breakdown.append({
                "event_id": ev.id,
                "event_name": ev.name,
                "category": ev.category,
                "registered": len(ev_regs),
                "checked_in": ev_in,
                "capacity": ev.max_participants,
                "prize_1st": ev.prize_1st,
                "prize_2nd": ev.prize_2nd,
                "prize_3rd": ev.prize_3rd,
                "date": ev.event_date,
                "venue": ev.venue_name,
                "time": ev.schedule_time
            })

        return {
            "total_registered": total_reg,
            "total_checked_in": total_in,
            "checkin_rate": rate,
            "events_breakdown": event_breakdown
        }


# Global singleton instance
db = CampusDatabase()

