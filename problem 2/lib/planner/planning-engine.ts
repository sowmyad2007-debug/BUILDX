import { db, EventRecord, ActivityRecord, TaskRecord, ChecklistRecord, BriefingRecord } from "../database/db";
import { ParsedEventRequirements } from "./intake-parser";
import { detectEventConflicts } from "../conflict-engine/detector";
import { calculateEventReadiness } from "./readiness-calculator";

export interface OperationalPlanResult {
  event: EventRecord;
  activities: ActivityRecord[];
  tasks: TaskRecord[];
  checklists: ChecklistRecord[];
  briefings: BriefingRecord[];
  conflicts: any[];
  readinessScore: number;
}

export function generateOperationalPlan(requirements: ParsedEventRequirements): OperationalPlanResult {
  const eventId = `evt-${Date.now()}`;
  const nowIso = new Date().toISOString();

  // 1. Create Event Record
  const event: EventRecord = {
    id: eventId,
    name: requirements.name,
    type: requirements.type,
    description: `Generated operational plan for ${requirements.attendeeCount} participants across ${requirements.durationDays} day(s).`,
    rawPrompt: requirements.rawPrompt,
    startDate: requirements.startDate,
    endDate: requirements.endDate,
    attendeeCount: requirements.attendeeCount,
    budget: requirements.budget,
    status: "PLANNING",
    readinessScore: 75,
    location: "Main Campus Complex",
    specialRequirements: requirements.specialRequirements,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  db.events.set(eventId, event);

  // 2. Generate Activities based on type and duration
  const generatedActivities: ActivityRecord[] = [];
  const venues = Array.from(db.venues.values());

  const audVenue = venues.find((v) => v.code === "AUD-MAIN") || venues[0];
  const semVenueA = venues.find((v) => v.code === "SEM-HALL-A") || venues[1];
  const semVenueB = venues.find((v) => v.code === "SEM-HALL-B") || venues[2];
  const labVenue1 = venues.find((v) => v.code === "LAB-CS-01") || venues[3];
  const labVenue2 = venues.find((v) => v.code === "LAB-CS-02") || venues[4];

  // Keynote / Inauguration
  generatedActivities.push({
    id: `act-${Date.now()}-1`,
    eventId,
    title: "Opening Keynote & Strategic Overview",
    description: `Welcome address and kickoff for ${requirements.name}.`,
    venueId: audVenue.id,
    venueName: audVenue.name,
    startTime: "Day 1, 09:00 AM",
    endTime: "Day 1, 10:30 AM",
    track: "Main Stage",
    requiredEquipment: ["High-Lumen 4K Laser Projectors", "Wireless Collar & Handheld Mics", "Portable JBL PA Speaker Towers"],
    attendeeTarget: requirements.attendeeCount,
    status: "SCHEDULED",
    dependencies: [],
  });

  // Morning Track / Workshops
  generatedActivities.push({
    id: `act-${Date.now()}-2`,
    eventId,
    title: "Track 1: Advanced AI Agent Systems Workshop",
    description: "Hands-on engineering workshop on agentic architectures, tool calling, and workflow coordination.",
    venueId: semVenueA.id,
    venueName: semVenueA.name,
    startTime: "Day 1, 11:00 AM",
    endTime: "Day 1, 01:00 PM",
    track: "AI / ML Track",
    requiredEquipment: ["High-Lumen 4K Laser Projectors", "Wireless Collar & Handheld Mics"],
    attendeeTarget: Math.min(200, Math.round(requirements.attendeeCount * 0.4)),
    status: "SCHEDULED",
    dependencies: [`act-${Date.now()}-1`],
  });

  generatedActivities.push({
    id: `act-${Date.now()}-3`,
    eventId,
    title: "Track 2: Scalable Cloud & Distributed Computing Lab",
    description: "Hands-on deployment and container orchestration lab.",
    venueId: labVenue1.id,
    venueName: labVenue1.name,
    startTime: "Day 1, 11:00 AM",
    endTime: "Day 1, 01:00 PM",
    track: "Cloud Track",
    requiredEquipment: ["Developer Laptops (Core i7 / 32GB)", "High-Density Wi-Fi 6 Mesh Routers"],
    attendeeTarget: Math.min(90, Math.round(requirements.attendeeCount * 0.2)),
    status: "SCHEDULED",
    dependencies: [`act-${Date.now()}-1`],
  });

  // Afternoon Track / Sprint
  if (requirements.type === "Hackathon" || requirements.durationDays > 1) {
    generatedActivities.push({
      id: `act-${Date.now()}-4`,
      eventId,
      title: "Hacking Marathon: Sprint Phase 1",
      description: "Mentoring rounds, architecture checks, and uninterrupted sprint execution.",
      venueId: audVenue.id,
      venueName: audVenue.name,
      startTime: "Day 1, 02:00 PM",
      endTime: "Day 1, 08:00 PM",
      track: "Hackathon Track",
      requiredEquipment: ["Heavy-Duty Power Extension Boards (10A)", "High-Density Wi-Fi 6 Mesh Routers"],
      attendeeTarget: Math.round(requirements.attendeeCount * 0.8),
      status: "SCHEDULED",
      dependencies: [`act-${Date.now()}-2`],
    });

    generatedActivities.push({
      id: `act-${Date.now()}-5`,
      eventId,
      title: "Jury Evaluation & Final Project Showcase",
      description: "Pitch presentations, demonstration booths, and live scoring.",
      venueId: audVenue.id,
      venueName: audVenue.name,
      startTime: `Day ${requirements.durationDays}, 02:00 PM`,
      endTime: `Day ${requirements.durationDays}, 05:00 PM`,
      track: "Main Stage",
      requiredEquipment: ["High-Lumen 4K Laser Projectors", "Wireless Collar & Handheld Mics", "Modular P2.5 Indoor LED Video Walls"],
      attendeeTarget: requirements.attendeeCount,
      status: "SCHEDULED",
      dependencies: [`act-${Date.now()}-4`],
    });
  } else {
    generatedActivities.push({
      id: `act-${Date.now()}-4`,
      eventId,
      title: "Panel Discussion & Open Q&A Session",
      description: "Industry leaders answer attendee questions on career roadmap and research directions.",
      venueId: semVenueB.id,
      venueName: semVenueB.name,
      startTime: "Day 1, 02:30 PM",
      endTime: "Day 1, 04:30 PM",
      track: "Leadership Track",
      requiredEquipment: ["Wireless Collar & Handheld Mics", "Portable JBL PA Speaker Towers"],
      attendeeTarget: Math.round(requirements.attendeeCount * 0.5),
      status: "SCHEDULED",
      dependencies: [`act-${Date.now()}-2`],
    });
  }

  // Valedictory
  generatedActivities.push({
    id: `act-${Date.now()}-6`,
    eventId,
    title: "Valedictory Ceremony & Award Distribution",
    description: "Closing remarks, distribution of certificates and cash prizes.",
    venueId: audVenue.id,
    venueName: audVenue.name,
    startTime: `Day ${requirements.durationDays}, 05:30 PM`,
    endTime: `Day ${requirements.durationDays}, 06:30 PM`,
    track: "Main Stage",
    requiredEquipment: ["High-Lumen 4K Laser Projectors", "Wireless Collar & Handheld Mics"],
    attendeeTarget: requirements.attendeeCount,
    status: "SCHEDULED",
    dependencies: [],
  });

  generatedActivities.forEach((act) => db.activities.set(act.id, act));

  // 3. Generate Tasks
  const generatedTasks: TaskRecord[] = [
    {
      id: `tsk-${Date.now()}-1`,
      eventId,
      title: "Deploy Dedicated Wi-Fi 6 Mesh Network",
      description: "Set up isolated SSID and bandwidth limiters for smooth hacking experience.",
      assignedSquad: "TECH_SUPPORT",
      assignedTo: "Rohan Verma",
      deadline: "2026-09-14T18:00:00",
      priority: "CRITICAL",
      status: "IN_PROGRESS",
      dependencies: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: `tsk-${Date.now()}-2`,
      eventId,
      title: `Prepare ${requirements.attendeeCount} Registration Kits & QR ID Tags`,
      description: "Organize attendee lanyards, RFID/QR tags, and sponsor merchandise.",
      assignedSquad: "REGISTRATION",
      assignedTo: "Diya Patel",
      deadline: "2026-09-14T20:00:00",
      priority: "HIGH",
      status: "PENDING",
      dependencies: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: `tsk-${Date.now()}-3`,
      eventId,
      title: "Test A/V Projectors and Microphones in Main Auditorium",
      description: "Full audio sweep and video signal synchronization check.",
      assignedSquad: "TECH_SUPPORT",
      assignedTo: "Aarav Sharma",
      deadline: "2026-09-15T07:30:00",
      priority: "HIGH",
      status: "PENDING",
      dependencies: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: `tsk-${Date.now()}-4`,
      eventId,
      title: "Establish Campus Perimeter Security & Night Access Roster",
      description: "Assign security personnel at Gate 1 and 3 with emergency response protocol.",
      assignedSquad: "SECURITY_LOGISTICS",
      assignedTo: "Vikram Malhotra",
      deadline: "2026-09-15T08:00:00",
      priority: "CRITICAL",
      status: "PENDING",
      dependencies: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: `tsk-${Date.now()}-5`,
      eventId,
      title: "Catering & Hydration Stations Setup",
      description: "Confirm meal delivery schedules and hydration coolers on each floor.",
      assignedSquad: "HOSPITALITY",
      assignedTo: "Ananya Iyer",
      deadline: "2026-09-15T08:30:00",
      priority: "MEDIUM",
      status: "PENDING",
      dependencies: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];
  generatedTasks.forEach((t) => db.tasks.set(t.id, t));

  // 4. Generate Checklists
  const generatedChecklists: ChecklistRecord[] = [
    { id: `chk-${Date.now()}-1`, eventId, category: "VENUE", title: "Main Auditorium seating & lighting configured", description: "All rows cleaned and labeled", isCompleted: false, sortOrder: 1 },
    { id: `chk-${Date.now()}-2`, eventId, category: "VENUE", title: "Seminar halls HVAC & projection systems tested", description: "HDMI inputs verified", isCompleted: false, sortOrder: 2 },
    { id: `chk-${Date.now()}-3`, eventId, category: "EQUIPMENT", title: "Power extension boards connected at student tables", description: "10A surge protection verified", isCompleted: false, sortOrder: 3 },
    { id: `chk-${Date.now()}-4`, eventId, category: "EQUIPMENT", title: "Wi-Fi routers active with guest passwords printed", description: "1 Gbps backhaul link tested", isCompleted: false, sortOrder: 4 },
    { id: `chk-${Date.now()}-5`, eventId, category: "SECURITY", title: "Campus gate passes and emergency contact posted", description: "Campus security informed", isCompleted: false, sortOrder: 5 },
    { id: `chk-${Date.now()}-6`, eventId, category: "VOLUNTEERS", title: "Volunteer squads assigned to designated stations", description: "Roll call and channel sync", isCompleted: false, sortOrder: 6 },
    { id: `chk-${Date.now()}-7`, eventId, category: "LOGISTICS", title: "Welcome kits & certificates staged backstage", description: "Alpha-ordered by team ID", isCompleted: false, sortOrder: 7 },
  ];
  generatedChecklists.forEach((chk) => db.checklists.set(chk.id, chk));

  // 5. Generate Human Approvals
  const generatedApprovals = [
    {
      id: `appr-${Date.now()}-1`,
      eventId,
      title: "Event Operations & Logistics Budget Clearance",
      reason: `Authorization for estimated operational budget of $${requirements.budget.toLocaleString()}.`,
      category: "BUDGET" as const,
      requestedBy: "AI Budget Planner Agent",
      priority: "HIGH" as const,
      status: "PENDING" as const,
      amount: requirements.budget,
      createdAt: nowIso,
    },
    {
      id: `appr-${Date.now()}-2`,
      eventId,
      title: "Campus Security & Night Entry Permit",
      reason: "Mandatory authorization for 24/7 building access and campus perimeter guards.",
      category: "SECURITY" as const,
      requestedBy: "Security Planner Agent",
      priority: "CRITICAL" as const,
      status: "PENDING" as const,
      createdAt: nowIso,
    },
  ];
  generatedApprovals.forEach((appr) => db.approvals.set(appr.id, appr));

  // 6. Generate Stakeholder Briefings
  const generatedBriefings: BriefingRecord[] = [
    {
      id: `brf-${Date.now()}-1`,
      eventId,
      targetRole: "SECURITY_TEAM",
      title: "Security Operations Dossier",
      summary: `Protocol for managing access for ${requirements.attendeeCount} students, parking, and night watch for ${requirements.name}.`,
      keyInstructions: [
        "Enforce mandatory QR verification at Gate 1 and Gate 3 starting at 07:30 AM.",
        "Maintain active security patrol around computer labs and main auditorium.",
        "Ensure emergency ambulance remains stationed at Gate 2 entrance.",
      ],
      contactPerson: "Vikram Malhotra (Security Lead)",
      createdAt: nowIso,
    },
    {
      id: `brf-${Date.now()}-2`,
      eventId,
      targetRole: "TECHNICAL_CREW",
      title: "Technical Infrastructure Deployment Briefing",
      summary: "Network, power distribution, and stage A/V requirements for multi-track execution.",
      keyInstructions: [
        "Deploy Wi-Fi 6 mesh routers with dedicated subnet for attendees.",
        "Verify backup power generator automatic transfer switch is primed.",
        "Keep spare wireless mic batteries and HDMI converters in Central A/V store.",
      ],
      contactPerson: "Rohan Verma (Tech Lead)",
      createdAt: nowIso,
    },
    {
      id: `brf-${Date.now()}-3`,
      eventId,
      targetRole: "VOLUNTEERS",
      title: "Volunteer Coordination & Squad Briefing",
      summary: `Roster instructions for ${requirements.volunteerCount} student volunteers across 5 functional squads.`,
      keyInstructions: [
        "Report to B-102 Volunteer Lounge 30 minutes before your scheduled shift.",
        "Escort VIP speakers directly to the Green Room behind Main Auditorium.",
        "Contact your Squad Lead via Walkie-Talkie Channel 2 for rapid escalation.",
      ],
      contactPerson: "Diya Patel (Volunteer Coordinator)",
      createdAt: nowIso,
    },
    {
      id: `brf-${Date.now()}-4`,
      eventId,
      targetRole: "ORGANIZER",
      title: "Lead Event Director Summary",
      summary: `Operational readiness summary for ${requirements.name}.`,
      keyInstructions: [
        "Review and sign pending budget and security approval requests.",
        "Verify speaker arrival time and presentation deck synchronization.",
        "Ensure trophy certificates are signed prior to valedictory ceremony.",
      ],
      contactPerson: "Campus Event Lead / Dean",
      createdAt: nowIso,
    },
  ];
  generatedBriefings.forEach((b) => db.briefings.set(b.id, b));

  // 7. Initial Notification
  const notifId = `notif-${Date.now()}`;
  db.notifications.set(notifId, {
    id: notifId,
    eventId,
    title: `🎉 Operational Plan Generated for ${requirements.name}`,
    message: `${generatedActivities.length} activities scheduled, ${generatedTasks.length} tasks delegated, and ${generatedChecklists.length} readiness checklist items created.`,
    type: "GENERAL",
    roleTarget: "ALL",
    isRead: false,
    createdAt: nowIso,
  });

  // 8. Run Conflict Detection & Calculate Readiness
  const conflicts = detectEventConflicts(eventId);
  const readiness = calculateEventReadiness(eventId);

  return {
    event,
    activities: generatedActivities,
    tasks: generatedTasks,
    checklists: generatedChecklists,
    briefings: generatedBriefings,
    conflicts,
    readinessScore: readiness.overallScore,
  };
}
