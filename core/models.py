"""
CAMPUS ORBIT - Data Models and Entity Schemas
"""

from dataclasses import dataclass, field, asdict
from enum import Enum
from typing import List, Dict, Optional, Any
from datetime import datetime


class EventType(str, Enum):
    HACKATHON = "AI Hackathon"
    CONFERENCE = "Conference"
    TECHNICAL_FEST = "Technical Fest"
    WORKSHOP = "Workshop"
    PLACEMENT_DRIVE = "Placement Drive"
    CULTURAL_FEST = "Cultural Fest"
    SEMINAR = "Seminar & Keynote"
    GENERAL = "General Campus Event"


class TaskStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    BLOCKED = "Blocked"


class TaskPriority(str, Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class ApprovalStatus(str, Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    CHANGES_REQUESTED = "Changes Requested"


class ConflictSeverity(str, Enum):
    CRITICAL = "Critical"
    MAJOR = "Major"
    MINOR = "Minor"


class NotificationPriority(str, Enum):
    CRITICAL = "Critical"
    WARNING = "Warning"
    INFO = "Info"
    SUCCESS = "Success"


@dataclass
class Venue:
    id: str
    name: str
    capacity: int
    projector: bool = True
    projector_av: bool = True
    microphones: int = 2
    wifi: bool = True
    wifi_speed_mbps: int = 500
    accessibility: bool = True
    ac: bool = True
    computers: int = 0
    venue_type: str = "Auditorium"
    power_backup_kva: int = 50
    noise_isolation: bool = True
    is_indoor: bool = True
    hourly_rate: float = 50.0
    location: str = "Main Campus Block"
    location_block: str = "Main Campus Block"
    is_available: bool = True
    smart_score: int = 90
    why_selected: str = "Meets capacity and technical criteria."
    amenities: List[str] = field(default_factory=list)


@dataclass
class Equipment:
    id: str
    name: str
    category: str  # AV, Computing, Power, Networking, Furniture
    total_qty: int
    available_qty: int
    allocated_qty: int = 0
    shortage_qty: int = 0
    unit_cost: float = 10.0
    unit_cost_estimate: float = 10.0
    requires_technician: bool = False
    ai_recommendation: Optional[str] = None

# Aliases
ResourceItem = Equipment

@dataclass
class SupportTeamAllocation:
    team_name: str
    headcount_allocated: int
    shift_hours: str
    special_instructions: str
    lead_contact: str


@dataclass
class Volunteer:
    id: str
    name: str
    department: str
    year: int
    skills: List[str]
    team_name: str = "General Support"  # Registration Team, Technical Support, Hospitality, Security Coordination, General Support
    assigned_role: str = "Volunteer"
    phone: str = ""
    contact_phone: str = ""
    shift: str = "09:00 - 17:00"
    is_available: bool = True
    assigned_roles: List[str] = field(default_factory=list)


@dataclass
class ScheduleItem:
    id: str
    activity: str
    start_time: str
    end_time: str
    venue_id: str
    venue_name: str
    responsible_team: str
    required_resources: List[str]
    status: str = "Scheduled"  # Scheduled, Live, Completed, Shifted


@dataclass
class TaskItem:
    id: str
    name: str
    assigned_team: str
    assigned_lead: str
    priority: TaskPriority
    deadline: str
    status: TaskStatus = TaskStatus.PENDING
    milestone_phase: str = "T-7 Days"
    checklist: List[Dict[str, Any]] = field(default_factory=list)


@dataclass
class ConflictItem:
    id: str
    category: str  # VENUE, SCHEDULE, RESOURCE, VOLUNTEER, PERMISSION
    severity: ConflictSeverity
    title: str
    description: str
    impacted_resource: str
    recommended_alternatives: List[str] = field(default_factory=list)
    resolved: bool = False
    resolution_applied: Optional[str] = None


@dataclass
class ApprovalItem:
    id: str
    category: str  # BUDGET, SECURITY, VENUE, PERMISSION, VENUE_PERMIT, VIP_CLEARANCE, ESTATE
    title: str
    approver_role: str
    recommendation: str = ""
    reason: str = ""
    description: str = ""
    estimated_cost: float = 0.0
    financial_impact: float = 0.0
    risk_level: str = "Medium"  # High, Medium, Low
    impact: str = "Campus Operations & Compliance"
    status: ApprovalStatus = ApprovalStatus.PENDING
    approver_name: Optional[str] = None
    approval_timestamp: Optional[str] = None
    comments: str = ""
    is_blocking: bool = True

    def __post_init__(self):
        if not self.description and self.reason:
            self.description = self.reason
        elif not self.reason and self.description:
            self.reason = self.description
        if self.estimated_cost == 0.0 and self.financial_impact != 0.0:
            self.estimated_cost = self.financial_impact
        elif self.financial_impact == 0.0 and self.estimated_cost != 0.0:
            self.financial_impact = self.estimated_cost


@dataclass
class NotificationItem:
    id: str
    title: str
    message: str
    priority: NotificationPriority
    timestamp: str = field(default_factory=lambda: datetime.now().strftime("%I:%M %p"))
    read: bool = False
    category: str = "General"


@dataclass
class ParsedRequirement:
    raw_prompt: str
    event_name: str
    event_type: EventType
    participants: int = 150
    expected_attendees: int = 150
    duration_days: int = 1
    start_date: str = "2026-08-28"
    end_date: str = "2026-08-29"
    start_time: str = "09:00"
    end_time: str = "18:00"
    venues_requested: List[str] = field(default_factory=list)
    primary_venue_type: str = "Auditorium"
    specific_venue_requested: Optional[str] = None
    equipment: List[str] = field(default_factory=list)
    equipment_needs: Dict[str, int] = field(default_factory=dict)
    volunteers: int = 20
    volunteer_skills_needed: List[str] = field(default_factory=list)
    support_teams_required: List[str] = field(default_factory=list)
    security_needed: bool = True
    transport_needed: bool = False
    food_needed: bool = True
    catering_needed: bool = True
    overnight_access: bool = False
    external_guests_vip: bool = False
    heavy_power_needed: bool = False
    sound_amplification_outdoor: bool = False
    special_requirements: List[str] = field(default_factory=list)
    special_notes: str = ""
    budget_limit: float = 4000.0

    def __post_init__(self):
        if self.participants == 150 and self.expected_attendees != 150:
            self.participants = self.expected_attendees
        elif self.expected_attendees == 150 and self.participants != 150:
            self.expected_attendees = self.participants


@dataclass
class OperationalPlan:
    event_id: str
    requirement: ParsedRequirement
    venues: List[Venue] = field(default_factory=list)
    schedule: List[ScheduleItem] = field(default_factory=list)
    resources: List[ResourceItem] = field(default_factory=list)
    volunteers: List[Volunteer] = field(default_factory=list)
    tasks: List[TaskItem] = field(default_factory=list)
    conflicts: List[ConflictItem] = field(default_factory=list)
    approvals: List[ApprovalItem] = field(default_factory=list)
    notifications: List[NotificationItem] = field(default_factory=list)
    readiness_score: int = 82
    readiness_breakdown: Dict[str, int] = field(default_factory=dict)
    estimated_cost: float = 3450.0
    status: str = "Draft Plan"
    version: int = 1
    created_at: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))


@dataclass
class ReplanningIncident:
    incident_type: str  # AUDITORIUM_UNAVAILABLE, PROJECTOR_SHORTAGE, VOLUNTEERS_UNAVAILABLE, WORKSHOP_DELAYED, DURATION_CHANGED, LAB_POWER_OUTAGE
    description: str
    time_offset_minutes: int = 0
    affected_venue: str = ""
    reported_by: str = "Live Incident Monitor"


@dataclass
class ReplanningAlternative:
    venue_id: str
    venue_name: str
    capacity: int
    equipment_match: str
    schedule_conflict_count: int
    score: int
    reason: str


@dataclass
class ReplanningResult:
    original_event_id: str
    incident: ReplanningIncident
    impact_summary: str
    affected_sessions: List[Dict[str, Any]] = field(default_factory=list)
    candidate_alternatives: List[ReplanningAlternative] = field(default_factory=list)
    recommended_alternative: Optional[ReplanningAlternative] = None
    before_after_diff: Dict[str, Any] = field(default_factory=dict)
    urgent_tasks: List[TaskItem] = field(default_factory=list)
    stakeholder_alerts: List[Dict[str, str]] = field(default_factory=list)
    new_readiness_score: int = 84
    plan_updated: bool = True
    status: str = "Evaluated"


@dataclass
class User:
    id: str
    name: str
    email: str
    role: str  # Event Manager, Faculty Coordinator, Dean / Admin, Student Volunteer Lead
    department: str
    password_hash: str = "password123"
    avatar: str = "EM"
    phone: str = "+91-98765-01001"
    is_active: bool = True


@dataclass
class CampusEvent:
    id: str
    name: str
    category: str
    description: str
    venue_name: str
    schedule_time: str
    max_participants: int
    event_date: str = "Aug 28, 2026"
    current_registrations: int = 0
    prize_1st: str = "₹10,000"
    prize_2nd: str = "₹6,000"
    prize_3rd: str = "₹4,000"
    certificates_all: bool = True
    rules: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    is_open: bool = True


@dataclass
class ParticipantRegistration:
    id: str
    full_name: str
    email: str
    phone: str
    college: str
    department: str
    event_id: str
    event_name: str
    qr_code_data: str
    event_date: str = "Aug 28, 2026"
    registered_at: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M"))
    checked_in: bool = False
    check_in_time: Optional[str] = None
    check_in_gate: str = "Main Entrance Gate A"
    certificate_eligible: bool = True


@dataclass
class ChatMessage:
    id: str
    sender: str  # "user" or "orbit_ai"
    message: str
    timestamp: str = field(default_factory=lambda: datetime.now().strftime("%I:%M %p"))
    intent: str = "general"
    data_payload: Optional[Dict[str, Any]] = None

