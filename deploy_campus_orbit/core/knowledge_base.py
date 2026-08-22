"""
Campus Knowledge Base: Real-world catalog of campus venues, equipment inventory,
volunteer roster, support team units, pre-existing bookings, and governance policies.
"""

from typing import List, Dict, Any
from .models import Venue, Equipment, Volunteer


CAMPUS_VENUES: List[Venue] = [
    Venue(
        id="V-AUD-01",
        name="Dr. APJ Abdul Kalam Main Auditorium",
        capacity=1000,
        venue_type="Auditorium",
        ac=True,
        projector_av=True,
        wifi_speed_mbps=500,
        power_backup_kva=120,
        noise_isolation=True,
        is_indoor=True,
        hourly_rate=150.0,
        location_block="Main Academic Block - Ground Floor",
        amenities=["Tiered Seating", "Green Room", "Dual Projectors", "Live Streaming Suite", "VIP Lounge"]
    ),
    Venue(
        id="V-AUD-02",
        name="Sir CV Raman Mini Auditorium",
        capacity=350,
        venue_type="Auditorium",
        ac=True,
        projector_av=True,
        wifi_speed_mbps=300,
        power_backup_kva=60,
        noise_isolation=True,
        is_indoor=True,
        hourly_rate=80.0,
        location_block="Science & Tech Block - 1st Floor",
        amenities=["Acoustic Paneling", "Wireless Podium", "Recording Cameras"]
    ),
    Venue(
        id="V-SEM-A",
        name="Aryabhatta Seminar Hall A",
        capacity=180,
        venue_type="Seminar Hall",
        ac=True,
        projector_av=True,
        wifi_speed_mbps=200,
        power_backup_kva=40,
        noise_isolation=True,
        is_indoor=True,
        hourly_rate=45.0,
        location_block="ECE Block - 2nd Floor",
        amenities=["Interactive Smart Board", "Collar Microphones", "Surround Sound"]
    ),
    Venue(
        id="V-SEM-B",
        name="Bhaskara Seminar Hall B",
        capacity=150,
        venue_type="Seminar Hall",
        ac=True,
        projector_av=True,
        wifi_speed_mbps=200,
        power_backup_kva=40,
        noise_isolation=True,
        is_indoor=True,
        hourly_rate=40.0,
        location_block="Mechanical Block - 3rd Floor",
        amenities=["Projector", "Podium Mic", "Video Conferencing"]
    ),
    Venue(
        id="V-LAB-01",
        name="Advanced AI & High Performance Computing Lab (Lab 1)",
        capacity=80,
        venue_type="Lab",
        ac=True,
        projector_av=True,
        wifi_speed_mbps=1000,
        power_backup_kva=80,
        noise_isolation=False,
        is_indoor=True,
        hourly_rate=60.0,
        location_block="CSE Department - 3rd Floor",
        amenities=["80 GPU Workstations", "Gigabit LAN Drops", "UPS Dedicated Line", "Whiteboard Wall"]
    ),
    Venue(
        id="V-LAB-02",
        name="Cloud Computing & Systems Lab (Lab 2)",
        capacity=80,
        venue_type="Lab",
        ac=True,
        projector_av=True,
        wifi_speed_mbps=1000,
        power_backup_kva=80,
        noise_isolation=False,
        is_indoor=True,
        hourly_rate=60.0,
        location_block="CSE Department - 3rd Floor",
        amenities=["80 Workstations", "Dedicated Server Rack", "LAN Cabling"]
    ),
    Venue(
        id="V-LAB-03",
        name="IoT & Robotics Makerspace Lab (Lab 3)",
        capacity=60,
        venue_type="Lab",
        ac=True,
        projector_av=True,
        wifi_speed_mbps=500,
        power_backup_kva=50,
        noise_isolation=False,
        is_indoor=True,
        hourly_rate=50.0,
        location_block="Robotics Center - Ground Floor",
        amenities=["Soldering Stations", "3D Printers", "Oscilloscopes", "Workbench Tables"]
    ),
    Venue(
        id="V-HUB-01",
        name="Campus Innovation & Incubation Hub",
        capacity=120,
        venue_type="Hall",
        ac=True,
        projector_av=True,
        wifi_speed_mbps=500,
        power_backup_kva=40,
        noise_isolation=False,
        is_indoor=True,
        hourly_rate=50.0,
        location_block="Student Activity Center - 1st Floor",
        amenities=["Modular Desks", "Bean Bags", "Pantry Area", "Display Screens"]
    ),
    Venue(
        id="V-AMP-01",
        name="Open Air Amphitheatre (OAT)",
        capacity=1500,
        venue_type="Ground",
        ac=False,
        projector_av=False,
        wifi_speed_mbps=100,
        power_backup_kva=100,
        noise_isolation=False,
        is_indoor=False,
        hourly_rate=120.0,
        location_block="Central Campus Greens",
        amenities=["Open Stage", "Stepped Seating", "High-Mast Floodlights", "Generator Hookup Point"]
    ),
    Venue(
        id="V-PLC-01",
        name="Central Placement & Training Complex",
        capacity=250,
        venue_type="Hall",
        ac=True,
        projector_av=True,
        wifi_speed_mbps=400,
        power_backup_kva=60,
        noise_isolation=True,
        is_indoor=True,
        hourly_rate=70.0,
        location_block="Placement Building - 1st Floor",
        amenities=["12 Interview Cabins", "GD Discussion Rooms", "Waiting Lounge", "Biometric Terminal"]
    )
]


CAMPUS_EQUIPMENT: List[Equipment] = [
    Equipment("EQ-MIC-01", "Wireless Handheld Microphones", "AV", total_qty=24, available_qty=18, unit_cost_estimate=15.0),
    Equipment("EQ-MIC-02", "Wireless Collar/Lapel Microphones", "AV", total_qty=12, available_qty=8, unit_cost_estimate=20.0),
    Equipment("EQ-PRJ-01", "4K Ultra-Short Throw Projector", "AV", total_qty=10, available_qty=7, unit_cost_estimate=50.0, requires_technician=True),
    Equipment("EQ-SND-01", "Digital Sound Console & Line Arrays", "AV", total_qty=6, available_qty=4, unit_cost_estimate=120.0, requires_technician=True),
    Equipment("EQ-NET-01", "High-Density Wi-Fi 6 Access Points", "Networking", total_qty=20, available_qty=15, unit_cost_estimate=30.0),
    Equipment("EQ-NET-02", "24-Port Gigabit Network Switches", "Networking", total_qty=15, available_qty=12, unit_cost_estimate=25.0),
    Equipment("EQ-PWR-01", "Heavy-Duty Surge Protected Spike Strips", "Power", total_qty=80, available_qty=65, unit_cost_estimate=5.0),
    Equipment("EQ-PWR-02", "50 kVA Mobile Diesel Generator Unit", "Power", total_qty=3, available_qty=2, unit_cost_estimate=200.0, requires_technician=True),
    Equipment("EQ-STG-01", "Stage Dynamic RGB Par Floodlights", "Stage", total_qty=30, available_qty=22, unit_cost_estimate=15.0),
    Equipment("EQ-VR-01", "Meta Quest 3 VR Developer Headsets", "Computing", total_qty=30, available_qty=20, unit_cost_estimate=40.0),
    Equipment("EQ-CAM-01", "4K PTZ Live Streaming Multi-Cam Rig", "AV", total_qty=4, available_qty=3, unit_cost_estimate=150.0, requires_technician=True)
]


CAMPUS_VOLUNTEERS: List[Volunteer] = [
    Volunteer("VOL-101", "Aarav Sharma", "Computer Science", 3, ["Tech Support", "Networking", "Coding Labs"], contact_phone="+91-98765-01001"),
    Volunteer("VOL-102", "Ananya Iyer", "Information Tech", 3, ["Hospitality", "Registration Desk", "VIP Escort"], contact_phone="+91-98765-01002"),
    Volunteer("VOL-103", "Rohan Mehta", "Electronics & Comm", 4, ["AV Operation", "Sound Console", "Live Stream"], contact_phone="+91-98765-01003"),
    Volunteer("VOL-104", "Sneha Patel", "Computer Science", 2, ["Social Media", "Photography", "Design"], contact_phone="+91-98765-01004"),
    Volunteer("VOL-105", "Vikram Rathore", "Mechanical Engg", 3, ["Crowd Control", "Logistics", "Stage Setup"], contact_phone="+91-98765-01005"),
    Volunteer("VOL-106", "Diya Mukherjee", "Management Studies", 2, ["Catering Logistics", "Sponsor Relations", "Finance"], contact_phone="+91-98765-01006"),
    Volunteer("VOL-107", "Karthik Nair", "Electrical Engg", 4, ["Power & Backup", "Electrical Wiring", "AV Operation"], contact_phone="+91-98765-01007"),
    Volunteer("VOL-108", "Pooja Verma", "Information Tech", 3, ["Registration Desk", "Helpdesk", "Certificate Distribution"], contact_phone="+91-98765-01008"),
    Volunteer("VOL-109", "Aditya Joshi", "Computer Science", 4, ["Hackathon Mentorship", "Judging Liaison", "Tech Support"], contact_phone="+91-98765-01009"),
    Volunteer("VOL-110", "Neha Reddy", "Biotech", 2, ["First Aid & Health", "Hospitality", "Guest Welcoming"], contact_phone="+91-98765-01010"),
    Volunteer("VOL-111", "Harsh Vardhan", "Civil Engg", 3, ["Stage Management", "Venue Decor", "Signage"], contact_phone="+91-98765-01011"),
    Volunteer("VOL-112", "Riya Sen", "Electronics & Comm", 3, ["Live Stream", "Projectionist", "Tech Support"], contact_phone="+91-98765-01012")
]


SUPPORT_TEAMS_CATALOG: Dict[str, Dict[str, Any]] = {
    "Security": {
        "lead": "Capt. M. Singh (Chief Security Officer)",
        "available_guards": 25,
        "responsibilities": ["Entry gate frisking", "Crowd dispersal", "VIP escort", "Night patrolling"],
        "rate_per_guard_shift": 35.0
    },
    "Transport": {
        "lead": "Mr. R. Deshmukh (Fleet Transport Officer)",
        "available_buses": 8,
        "available_vans": 4,
        "responsibilities": ["Guest airport/station pickup", "Inter-hostel shuttles", "Equipment transit"],
        "rate_per_bus": 100.0
    },
    "Housekeeping": {
        "lead": "Mrs. S. Bannerjee (Estate Sanitation Lead)",
        "available_staff": 30,
        "responsibilities": ["Pre-event deep cleaning", "Continuous dustbin clearance", "Restroom maintenance", "Post-event teardown"],
        "rate_per_staff": 25.0
    },
    "Catering": {
        "lead": "Chef G. Pillai (Campus Food Services)",
        "capacity_meals_per_hour": 1200,
        "responsibilities": ["Welcome tea & snacks", "Buffet lunch/dinner", "Midnight hackathon coffee/refreshments"],
        "rate_per_meal": 4.5
    },
    "IT_Network": {
        "lead": "Er. K. Swaminathan (Network Ops Center)",
        "responsibilities": ["Dedicated SSID setup", "Firewall whitelist", "High bandwidth QoS allocation", "On-site switch deployment"],
        "rate_fixed": 80.0
    },
    "Medical": {
        "lead": "Dr. Aruna Rao (Campus Health Center)",
        "responsibilities": ["On-site emergency first aid", "Ambulance standby for large gatherings", "Triage post"],
        "rate_fixed": 50.0
    }
}


PRE_EXISTING_BOOKINGS: List[Dict[str, Any]] = [
    {
        "venue_id": "V-AUD-01",
        "event_title": "Annual Alumni General Meeting & Felicitation",
        "date": "2026-09-15",
        "start_time": "14:00",
        "end_time": "18:00",
        "booked_by": "Alumni Relations Office"
    },
    {
        "venue_id": "V-SEM-A",
        "event_title": "Department Faculty Council & Accreditation Audit",
        "date": "2026-09-20",
        "start_time": "09:30",
        "end_time": "13:00",
        "booked_by": "Dean Academics"
    },
    {
        "venue_id": "V-LAB-01",
        "event_title": "Semester Practical End-Exam (CS301)",
        "date": "2026-09-22",
        "start_time": "09:00",
        "end_time": "17:00",
        "booked_by": "Controller of Examinations"
    }
]


GOVERNANCE_POLICIES = {
    "budget_threshold_dean_approval": 1500.0,       # Any event costing > $1500 requires Dean Student Welfare approval
    "budget_threshold_finance_approval": 3000.0,    # > $3000 requires Chief Finance Officer signoff
    "overnight_requires_security_signoff": True,    # Events extending beyond 21:00 or overnight require CSO approval
    "sound_limit_outdoor_cutoff": "22:00",          # Outdoor loudspeakers strictly prohibited after 22:00
    "vip_guest_requires_director_approval": True,   # State ministers, global tech execs require Director clearance
    "min_lead_time_days": 5                         # Minimum 5 days advance booking required
}
