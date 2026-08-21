import { 
  INITIAL_VENUES, 
  INITIAL_EQUIPMENT, 
  INITIAL_VOLUNTEERS, 
  INITIAL_9_CAMPUS_EVENTS, 
  InitialVenue, 
  InitialEquipment, 
  InitialVolunteer, 
  InitialCampusEvent 
} from "./initial-data";

export interface UserRecord {
  id: string;
  name: string;
  studentId?: string;
  email: string;
  phone?: string;
  department?: string;
  year?: string;
  role: "STUDENT" | "ORGANIZER" | "ADMIN";
  avatarUrl?: string;
  password?: string;
  createdAt: string;
}

export interface RegistrationRecord {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  eventTime: string;
  userId?: string;
  studentName: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  emergencyContact: string;
  registrationId: string; // e.g. "REG-TF26-9812"
  pricePaid: number;
  priceFormatted: string;
  paymentStatus: "Free" | "Pending" | "Paid";
  createdAt: string;
}

export interface EventRecord {
  id: string;
  name: string;
  type: string;
  category?: string;
  description: string;
  rawPrompt?: string;
  date?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  registrationDeadline?: string;
  attendeeCount: number;
  capacity?: number;
  registeredCount?: number;
  price?: number;
  priceFormatted?: string;
  organizer?: string;
  contactDetails?: {
    name: string;
    email: string;
    phone: string;
  };
  image?: string;
  budget: number;
  status: "DRAFT" | "PLANNING" | "APPROVED" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "REGISTRATION_OPEN" | "UPCOMING" | "ONGOING";
  readinessScore: number;
  location: string;
  venueId?: string;
  venueName?: string;
  specialRequirements?: string;
  rules?: string[];
  equipmentRequirements?: string[];
  volunteerRequirements?: any;
  securityRequirements?: any;
  transportRequirements?: any;
  communicationRequirements?: any;
  permissionRequirements?: any;
  schedule?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityRecord {
  id: string;
  eventId: string;
  title: string;
  description: string;
  venueId: string;
  venueName: string;
  startTime: string;
  endTime: string;
  track: string;
  requiredEquipment: string[];
  attendeeTarget: number;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "DELAYED" | "CANCELLED";
  dependencies: string[];
}

export interface ConflictRecord {
  id: string;
  eventId: string;
  category: "VENUE_DOUBLE_BOOKING" | "CAPACITY_OVERSHOOT" | "EQUIPMENT_SHORTAGE" | "VOLUNTEER_OVERLAP" | "CHRONOLOGY_ERROR" | "PERMISSION_MISSING";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  affectedItem: string;
  recommendedAlternatives: Array<{
    id: string;
    label: string;
    description: string;
    actionType: "REPLACE_VENUE" | "CHANGE_TIME" | "SUBSTITUTE_EQUIPMENT" | "REQUEST_APPROVAL";
    payload: any;
  }>;
  status: "ACTIVE" | "RESOLVED" | "IGNORED";
  resolvedAt?: string;
}

export interface ApprovalRecord {
  id: string;
  eventId: string;
  title: string;
  reason: string;
  category: "BUDGET" | "SECURITY" | "VENUE_RELOCATION" | "OVERTIME" | "PERMISSION";
  requestedBy: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "APPROVED" | "REJECTED";
  resolutionNotes?: string;
  approvedBy?: string;
  resolvedAt?: string;
  amount?: number;
  createdAt: string;
}

export interface TaskRecord {
  id: string;
  eventId: string;
  title: string;
  description: string;
  assignedSquad: "REGISTRATION" | "TECH_SUPPORT" | "HOSPITALITY" | "SECURITY_LOGISTICS" | "GENERAL";
  assignedTo: string;
  deadline: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistRecord {
  id: string;
  eventId: string;
  category: "VENUE" | "EQUIPMENT" | "SECURITY" | "VOLUNTEERS" | "LOGISTICS";
  title: string;
  description: string;
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: string;
  sortOrder: number;
}

export interface NotificationRecord {
  id: string;
  eventId?: string;
  title: string;
  message: string;
  type: "REGISTRATION" | "CONFLICT" | "TASK" | "APPROVAL" | "VENUE_CHANGE" | "REPLAN" | "GENERAL";
  roleTarget: "ALL" | "STUDENT" | "ORGANIZER" | "VOLUNTEER" | "SECURITY" | "ADMIN";
  isRead: boolean;
  createdAt: string;
}

export interface BriefingRecord {
  id: string;
  eventId: string;
  targetRole: "ORGANIZER" | "VOLUNTEERS" | "SECURITY_TEAM" | "VENUE_FACILITY" | "TECHNICAL_CREW";
  title: string;
  summary: string;
  keyInstructions: string[];
  contactPerson: string;
  createdAt: string;
}

// In-Memory Global State Store
class MemoryDatabase {
  users: Map<string, UserRecord> = new Map();
  registrations: Map<string, RegistrationRecord> = new Map();
  events: Map<string, EventRecord> = new Map();
  venues: Map<string, InitialVenue> = new Map();
  equipment: Map<string, InitialEquipment> = new Map();
  volunteers: Map<string, InitialVolunteer> = new Map();
  activities: Map<string, ActivityRecord> = new Map();
  conflicts: Map<string, ConflictRecord> = new Map();
  approvals: Map<string, ApprovalRecord> = new Map();
  tasks: Map<string, TaskRecord> = new Map();
  checklists: Map<string, ChecklistRecord> = new Map();
  notifications: Map<string, NotificationRecord> = new Map();
  briefings: Map<string, BriefingRecord> = new Map();

  currentUser: UserRecord | null = null;

  constructor() {
    this.resetToDemoState();
  }

  resetToDemoState() {
    this.users.clear();
    this.registrations.clear();
    this.events.clear();
    this.venues.clear();
    this.equipment.clear();
    this.volunteers.clear();
    this.activities.clear();
    this.conflicts.clear();
    this.approvals.clear();
    this.tasks.clear();
    this.checklists.clear();
    this.notifications.clear();
    this.briefings.clear();

    // 1. Initial Venues
    INITIAL_VENUES.forEach((v) => this.venues.set(v.id, { ...v }));

    // 2. Initial Equipment
    INITIAL_EQUIPMENT.forEach((e) => this.equipment.set(e.id, { ...e }));

    // 3. Initial Volunteers
    INITIAL_VOLUNTEERS.forEach((vol) => this.volunteers.set(vol.id, { ...vol }));

    // 4. Seed Default Users
    const defaultUsers: UserRecord[] = [
      {
        id: "usr-student-01",
        name: "Rahul Deshmukh",
        studentId: "STU-2023-CS042",
        email: "rahul.d@campus.edu",
        phone: "+91 98765 00001",
        department: "Computer Science",
        year: "3rd Year",
        role: "STUDENT",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-organizer-01",
        name: "Prof. Arvind Swaminathan",
        email: "organizer@campus.edu",
        phone: "+91 98765 00002",
        department: "Computer Science",
        role: "ORGANIZER",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-admin-01",
        name: "Campus Event Dean",
        email: "admin@campus.edu",
        phone: "+91 98765 00003",
        department: "Student Affairs",
        role: "ADMIN",
        createdAt: new Date().toISOString(),
      },
    ];
    defaultUsers.forEach((u) => this.users.set(u.id, u));
    this.currentUser = defaultUsers[0]; // Default logged in student

    // 5. Seed Exactly 9 Required Campus Events
    INITIAL_9_CAMPUS_EVENTS.forEach((evt) => {
      const eventRecord: EventRecord = {
        id: evt.id,
        name: evt.name,
        type: evt.type,
        category: evt.category,
        description: evt.description,
        date: evt.date,
        startDate: evt.startDate,
        endDate: evt.endDate,
        startTime: evt.startTime,
        endTime: evt.endTime,
        registrationDeadline: evt.registrationDeadline,
        venueId: evt.venueId,
        venueName: evt.venueName,
        capacity: evt.capacity,
        attendeeCount: evt.capacity,
        registeredCount: evt.registeredCount,
        price: evt.price,
        priceFormatted: evt.priceFormatted,
        organizer: evt.organizer,
        contactDetails: evt.contactDetails,
        image: evt.image,
        budget: evt.price > 0 ? evt.capacity * evt.price * 0.7 : 10000,
        status: evt.status,
        readinessScore: 84,
        location: evt.venueName,
        rules: evt.rules,
        schedule: evt.schedule,
        equipmentRequirements: evt.equipmentRequirements,
        volunteerRequirements: evt.volunteerRequirements,
        securityRequirements: evt.securityRequirements,
        transportRequirements: evt.transportRequirements,
        communicationRequirements: evt.communicationRequirements,
        permissionRequirements: evt.permissionRequirements,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.events.set(evt.id, eventRecord);

      // Create activities for the schedule
      evt.schedule?.forEach((sch, idx) => {
        const actId = `act-${evt.id}-${idx + 1}`;
        this.activities.set(actId, {
          id: actId,
          eventId: evt.id,
          title: sch.activity,
          description: `Session part of ${evt.name}`,
          venueId: evt.venueId,
          venueName: sch.venue || evt.venueName,
          startTime: sch.time,
          endTime: sch.time,
          track: "General Track",
          requiredEquipment: evt.equipmentRequirements.slice(0, 2),
          attendeeTarget: Math.round(evt.capacity * 0.7),
          status: "SCHEDULED",
          dependencies: [],
        });
      });
    });

    // 6. Seed Sample Initial Registrations for Student
    const sampleRegistrations: RegistrationRecord[] = [
      {
        id: "reg-01",
        eventId: "evt-techfest-2026",
        eventName: "TechFest 2026",
        eventDate: "Sep 15 - 16, 2026",
        eventVenue: "Main Auditorium & Seminar Halls",
        eventTime: "09:00 AM - 06:00 PM",
        userId: "usr-student-01",
        studentName: "Rahul Deshmukh",
        studentId: "STU-2023-CS042",
        email: "rahul.d@campus.edu",
        phone: "+91 98765 00001",
        department: "Computer Science",
        year: "3rd Year",
        emergencyContact: "+91 98765 99999",
        registrationId: "REG-TF26-8941",
        pricePaid: 150,
        priceFormatted: "₹150",
        paymentStatus: "Paid",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      },
      {
        id: "reg-02",
        eventId: "evt-hackathon-2026",
        eventName: "Hackathon 2026",
        eventDate: "Sep 22 - 23, 2026",
        eventVenue: "Main Auditorium & Computer Labs",
        eventTime: "08:00 AM (Day 1)",
        userId: "usr-student-01",
        studentName: "Rahul Deshmukh",
        studentId: "STU-2023-CS042",
        email: "rahul.d@campus.edu",
        phone: "+91 98765 00001",
        department: "Computer Science",
        year: "3rd Year",
        emergencyContact: "+91 98765 99999",
        registrationId: "REG-HK26-1029",
        pricePaid: 200,
        priceFormatted: "₹200",
        paymentStatus: "Paid",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
    ];
    sampleRegistrations.forEach((r) => this.registrations.set(r.id, r));

    // 7. Seed Initial Conflict
    const demoConflict: ConflictRecord = {
      id: "cnf-101",
      eventId: "evt-techfest-2026",
      category: "VENUE_DOUBLE_BOOKING",
      severity: "HIGH",
      title: "Venue Collision in Seminar Hall A",
      description: "Seminar Hall A is allocated to 'Paper Presentation Tracks' (11:30 AM) while Department Review meeting was previously scheduled.",
      affectedItem: "Seminar Hall A (11:30 AM - 01:00 PM)",
      recommendedAlternatives: [
        {
          id: "alt-1",
          label: "Relocate Session to Seminar Hall B",
          description: "Seminar Hall B (Capacity 180, A/V Ready) is vacant and adjacent.",
          actionType: "REPLACE_VENUE",
          payload: { activityId: "act-evt-techfest-2026-3", targetVenueId: "venue-3", targetVenueName: "Seminar Hall B" },
        },
        {
          id: "alt-2",
          label: "Relocate to Conference Hall (Admin Block)",
          description: "Conference Hall (Capacity 120, Full A/V) is available.",
          actionType: "REPLACE_VENUE",
          payload: { activityId: "act-evt-techfest-2026-3", targetVenueId: "venue-7", targetVenueName: "Conference Hall (Executive)" },
        },
      ],
      status: "ACTIVE",
    };
    this.conflicts.set(demoConflict.id, demoConflict);

    // 8. Seed Initial Approvals
    const approvals: ApprovalRecord[] = [
      {
        id: "appr-1",
        eventId: "evt-hackathon-2026",
        title: "Night Hackathon 24/7 Security Clearance & Gate Access",
        reason: "Event runs overnight past 10:00 PM. Requires security perimeter guard shifts and student gate entry sign-off.",
        category: "SECURITY",
        requestedBy: "Security Squad Lead",
        priority: "CRITICAL",
        status: "PENDING",
        amount: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "appr-2",
        eventId: "evt-techfest-2026",
        title: "Catering & Participant Refreshment Budget Authorization",
        reason: "Lunch buffet, tea counters, and guest faculty dining allocation for 500 attendees.",
        category: "BUDGET",
        requestedBy: "Hospitality Squad Lead",
        priority: "HIGH",
        status: "PENDING",
        amount: 4200,
        createdAt: new Date().toISOString(),
      },
    ];
    approvals.forEach((appr) => this.approvals.set(appr.id, appr));

    // 9. Seed Initial Tasks
    const tasks: TaskRecord[] = [
      { id: "tsk-1", eventId: "evt-techfest-2026", title: "Deploy Dedicated Wi-Fi 6 Mesh Network", description: "Set up isolated SSID with 1 Gbps backhaul.", assignedSquad: "TECH_SUPPORT", assignedTo: "Rohan Verma", deadline: "2026-09-14T18:00:00", priority: "CRITICAL", status: "COMPLETED", dependencies: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "tsk-2", eventId: "evt-techfest-2026", title: "Print 500 Participant QR Badges & Kits", description: "Assemble lanyard tags and welcome kits.", assignedSquad: "REGISTRATION", assignedTo: "Diya Patel", deadline: "2026-09-14T21:00:00", priority: "HIGH", status: "IN_PROGRESS", dependencies: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "tsk-3", eventId: "evt-techfest-2026", title: "Test Main Auditorium 4K Laser Projector", description: "Audio sweep and frequency check on 4 UHF mics.", assignedSquad: "TECH_SUPPORT", assignedTo: "Aarav Sharma", deadline: "2026-09-15T07:30:00", priority: "HIGH", status: "COMPLETED", dependencies: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "tsk-4", eventId: "evt-techfest-2026", title: "Deploy Campus Shuttle Buses for Metro Station", description: "3 shuttle vans on 20-min loop from Metro Gate 2.", assignedSquad: "SECURITY_LOGISTICS", assignedTo: "Rishabh Pant", deadline: "2026-09-15T07:00:00", priority: "MEDIUM", status: "IN_PROGRESS", dependencies: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "tsk-5", eventId: "evt-techfest-2026", title: "Setup First Aid & Emergency Paramedic Booth", description: "Equip medical booth in Block A Ground Floor.", assignedSquad: "SECURITY_LOGISTICS", assignedTo: "Vikram Malhotra", deadline: "2026-09-15T08:00:00", priority: "CRITICAL", status: "PENDING", dependencies: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
    tasks.forEach((t) => this.tasks.set(t.id, t));

    // 10. Seed Initial Checklists
    const checklists: ChecklistRecord[] = [
      { id: "chk-1", eventId: "evt-techfest-2026", category: "VENUE", title: "Main Auditorium seating & stage cleared", description: "650 chairs cleaned and numbered", isCompleted: true, completedBy: "Karan Johar", completedAt: new Date().toISOString(), sortOrder: 1 },
      { id: "chk-2", eventId: "evt-techfest-2026", category: "VENUE", title: "Air conditioning tested in Seminar Halls", description: "Thermostats calibrated to 22C", isCompleted: true, completedBy: "Varun Dhawan", completedAt: new Date().toISOString(), sortOrder: 2 },
      { id: "chk-3", eventId: "evt-techfest-2026", category: "VENUE", title: "Directional signage mounted on Block A/B/C", description: "From entrance gate to labs", isCompleted: false, sortOrder: 3 },
      { id: "chk-4", eventId: "evt-techfest-2026", category: "EQUIPMENT", title: "4K Laser Projectors and HDMI converters ready", description: "Reserve units positioned", isCompleted: true, completedBy: "Rohan Verma", completedAt: new Date().toISOString(), sortOrder: 4 },
      { id: "chk-5", eventId: "evt-techfest-2026", category: "EQUIPMENT", title: "Power extension strips distributed", description: "10A surge protectors verified", isCompleted: true, completedBy: "Arjun Reddy", completedAt: new Date().toISOString(), sortOrder: 5 },
      { id: "chk-6", eventId: "evt-techfest-2026", category: "SECURITY", title: "Night security pass permissions ratified", description: "Dean stamp verified", isCompleted: false, sortOrder: 6 },
      { id: "chk-7", eventId: "evt-techfest-2026", category: "SECURITY", title: "Campus emergency guard roster active", description: "8 guards on rotating shifts", isCompleted: true, completedBy: "Vikram Malhotra", completedAt: new Date().toISOString(), sortOrder: 7 },
      { id: "chk-8", eventId: "evt-techfest-2026", category: "VOLUNTEERS", title: "All 20 volunteers briefed on squad stations", description: "Walkie-talkie channel 4 confirmed", isCompleted: true, completedBy: "Diya Patel", completedAt: new Date().toISOString(), sortOrder: 8 },
      { id: "chk-9", eventId: "evt-techfest-2026", category: "LOGISTICS", title: "Welcome kits & certificates staged backstage", description: "Alpha-sorted by ID", isCompleted: false, sortOrder: 9 },
    ];
    checklists.forEach((chk) => this.checklists.set(chk.id, chk));

    // 11. Initial Notifications
    const notifications: NotificationRecord[] = [
      {
        id: "notif-1",
        eventId: "evt-techfest-2026",
        title: "🎉 Registration Confirmed: TechFest 2026",
        message: "Your registration for TechFest 2026 is confirmed. Registration ID: REG-TF26-8941. Please arrive at Main Auditorium by 08:30 AM.",
        type: "REGISTRATION",
        roleTarget: "STUDENT",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: "notif-2",
        eventId: "evt-techfest-2026",
        title: "⚠️ Constraint Conflict: Seminar Hall A Overlap",
        message: "Workshop session collides with Department Review. 2 alternative recommendations ready in Conflict Center.",
        type: "CONFLICT",
        roleTarget: "ORGANIZER",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: "notif-3",
        eventId: "evt-hackathon-2026",
        title: "🛡️ Security Clearance Pending Sign-off",
        message: "Night Hackathon 24/7 Security Clearance & Gate Access is awaiting Security Officer ratification.",
        type: "APPROVAL",
        roleTarget: "ADMIN",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ];
    notifications.forEach((n) => this.notifications.set(n.id, n));

    // 12. Initial Briefings
    const briefings: BriefingRecord[] = [
      {
        id: "brf-1",
        eventId: "evt-techfest-2026",
        targetRole: "SECURITY_TEAM",
        title: "Security & Safety Operational Briefing",
        summary: "Operational protocols for managing entry gates, crowd control for 500 attendees, and emergency ambulance readiness for TechFest 2026.",
        keyInstructions: [
          "Enforce mandatory QR ID badge scanning at Gate 1 and Gate 3 starting 07:30 AM.",
          "Keep Block A emergency exits unobstructed and unlocked.",
          "Maintain direct radio link with campus ambulance at West Gate.",
        ],
        contactPerson: "Vikram Malhotra (Security Lead) - Ext: 43214",
        createdAt: new Date().toISOString(),
      },
      {
        id: "brf-2",
        eventId: "evt-techfest-2026",
        targetRole: "TECHNICAL_CREW",
        title: "A/V & Infrastructure Technical Crew Dossier",
        summary: "Execution checklist for high-density networking, stage sound, projection mapping, and power distribution.",
        keyInstructions: [
          "Perform audio frequency sweep in Main Auditorium at 07:30 AM before keynote.",
          "Deploy 20 Wi-Fi 6 mesh nodes across Block A and C with 1 Gbps dedicated backhaul.",
          "Verify all 60 power extension strips have 10A surge protectors operational.",
        ],
        contactPerson: "Rohan Verma (Tech Lead) - Ext: 43212",
        createdAt: new Date().toISOString(),
      },
    ];
    briefings.forEach((b) => this.briefings.set(b.id, b));
  }
}

const globalForDb = global as unknown as { campusDb: MemoryDatabase };
export const db = globalForDb.campusDb || new MemoryDatabase();
if (db.events.size < 9) {
  db.resetToDemoState();
}
if (process.env.NODE_ENV !== "production") globalForDb.campusDb = db;
