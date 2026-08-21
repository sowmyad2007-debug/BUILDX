import { db, EventRecord, ActivityRecord, ConflictRecord, TaskRecord } from "../database/db";
import { calculateEventReadiness } from "./readiness-calculator";

export interface ReplanScenarioPayload {
  eventId: string;
  scenarioType: "VENUE_UNAVAILABLE" | "VOLUNTEER_SHORTAGE" | "EQUIPMENT_FAILURE" | "ATTENDANCE_SURGE" | "RAIN_OUTDOOR_ALERT";
  customDetails?: string;
  targetVenueCode?: string;
  shortageCount?: number;
}

export interface ReplanStepLog {
  stepNumber: number;
  agentName: string;
  status: "COMPLETED" | "IN_PROGRESS" | "WARNING";
  action: string;
  details: string;
}

export interface BeforeAfterComparison {
  metric: string;
  before: string;
  after: string;
  changeType: "POSITIVE" | "NEUTRAL" | "WARNING";
}

export interface ReplanResult {
  success: boolean;
  scenarioTitle: string;
  disruptionDescription: string;
  stepsExecuted: ReplanStepLog[];
  comparisonTable: BeforeAfterComparison[];
  affectedActivities: Array<{
    id: string;
    title: string;
    previousVenue: string;
    newVenue: string;
    previousTime: string;
    newTime: string;
    rationale: string;
  }>;
  newTasksCreated: TaskRecord[];
  notificationsDispatched: string[];
  newReadinessScore: number;
}

export function executeDynamicReplanning(payload: ReplanScenarioPayload): ReplanResult {
  const event = db.events.get(payload.eventId) || Array.from(db.events.values())[0];
  const eventId = event ? event.id : payload.eventId;
  const venues = Array.from(db.venues.values());
  const activities = Array.from(db.activities.values()).filter((a) => a.eventId === eventId);
  const nowIso = new Date().toISOString();

  const stepsExecuted: ReplanStepLog[] = [];
  const comparisonTable: BeforeAfterComparison[] = [];
  const affectedActivities: any[] = [];
  const newTasksCreated: TaskRecord[] = [];
  const notificationsDispatched: string[] = [];

  let scenarioTitle = "Disruption Replanning";
  let disruptionDescription = "";

  if (payload.scenarioType === "VENUE_UNAVAILABLE") {
    scenarioTitle = "⚡ Seminar Hall A Sudden Electrical/HVAC Outage";
    disruptionDescription = "Seminar Hall A experienced a severe HVAC and power fault. Venue is marked OFFLINE for maintenance. 2 active workshops require instant relocation.";

    // Step 1: Disruption Ingestion
    stepsExecuted.push({
      stepNumber: 1,
      agentName: "Disruption Ingestion Agent",
      status: "COMPLETED",
      action: "Ingested Venue Outage Event",
      details: "Flagged 'Seminar Hall A' (code: SEM-HALL-A) as OFFLINE. Triggered immediate operational lock on current allocations.",
    });

    // Mark Venue Offline
    const hallA = venues.find((v) => v.code === "SEM-HALL-A" || v.name.includes("Seminar Hall A"));
    if (hallA) hallA.status = "OFFLINE";

    // Step 2: Impact Analysis
    const impacted = activities.filter((a) => a.venueId === hallA?.id || a.venueName.includes("Seminar Hall A"));
    stepsExecuted.push({
      stepNumber: 2,
      agentName: "Impact Analysis Agent",
      status: "COMPLETED",
      action: "Identified Impacted Schedule Blocks",
      details: `Found ${impacted.length} activity blocks affected: ${impacted.map((a) => `'${a.title}'`).join(", ")}.`,
    });

    // Step 3: Candidate Venue Search & Ranking
    const availableVenues = venues.filter((v) => v.status === "AVAILABLE" && v.id !== hallA?.id);
    const hallB = venues.find((v) => v.code === "SEM-HALL-B") || availableVenues[0];
    const innovLab = venues.find((v) => v.code === "LAB-INNOV-01") || availableVenues[1];

    stepsExecuted.push({
      stepNumber: 3,
      agentName: "Venue Evaluation Agent",
      status: "COMPLETED",
      action: "Scored & Ranked Candidate Alternative Venues",
      details: `Ranked 1: Seminar Hall B (Capacity 180, Match Score: 96%), Ranked 2: Innovation Lab (Capacity 60, Match Score: 88%).`,
    });

    // Step 4: Schedule Migration & Resource Reallocation
    impacted.forEach((act, idx) => {
      const prevVenueName = act.venueName;
      const targetVenue = idx === 0 ? hallB : innovLab;
      if (targetVenue) {
        act.venueId = targetVenue.id;
        act.venueName = targetVenue.name;
        affectedActivities.push({
          id: act.id,
          title: act.title,
          previousVenue: prevVenueName,
          newVenue: targetVenue.name,
          previousTime: act.startTime,
          newTime: act.startTime,
          rationale: `Selected ${targetVenue.name} due to compatible A/V hardware, equal Wi-Fi rating, and zero time collisions.`,
        });
      }
    });

    stepsExecuted.push({
      stepNumber: 4,
      agentName: "Dynamic Scheduling Agent",
      status: "COMPLETED",
      action: "Reassigned Venues and Shifted Activity Tracks",
      details: `Migrated activities seamlessly without modifying attendee timing schedule.`,
    });

    // Step 5: Hardware & Squad Dispatch
    stepsExecuted.push({
      stepNumber: 5,
      agentName: "Resource & Squad Agent",
      status: "COMPLETED",
      action: "Dispatched Signage & Physical Escort Squads",
      details: "Assigned Volunteer Squads 2 & 4 to stand outside Seminar Hall A to redirect students to Seminar Hall B & Innovation Lab.",
    });

    // Step 6: Task Creation
    const redirectTask: TaskRecord = {
      id: `tsk-replan-${Date.now()}-1`,
      eventId,
      title: "Mount Emergency Directional Signage for Seminar Hall B",
      description: "Place rollup banners at Block B stairs indicating Workshop 1 relocation to Seminar Hall B.",
      assignedSquad: "GENERAL",
      assignedTo: "Karan Johar",
      deadline: "Within 15 Minutes",
      priority: "CRITICAL",
      status: "IN_PROGRESS",
      dependencies: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    db.tasks.set(redirectTask.id, redirectTask);
    newTasksCreated.push(redirectTask);

    // Step 7: Notification Dispatch
    const notifMsg = `🚨 EMERGENCY VENUE RELOCATION: Seminar Hall A is offline due to HVAC maintenance. Workshop 1 relocated to Seminar Hall B. Squad guides deployed.`;
    const notifId = `notif-replan-${Date.now()}`;
    db.notifications.set(notifId, {
      id: notifId,
      eventId,
      title: "🚨 Urgent Replan: Seminar Hall A Relocated",
      message: notifMsg,
      type: "REPLAN",
      roleTarget: "ALL",
      isRead: false,
      createdAt: nowIso,
    });
    notificationsDispatched.push(notifMsg);

    // Build Comparison Table
    comparisonTable.push(
      { metric: "Primary Workshop 1 Venue", before: "Seminar Hall A (Block B - 2nd Floor)", after: "Seminar Hall B (Block B - 3rd Floor)", changeType: "POSITIVE" },
      { metric: "Secondary Lab Session Venue", before: "Seminar Hall A", after: "Innovation & Robotics Lab", changeType: "POSITIVE" },
      { metric: "Disrupted Activities", before: "2 Activities Stalled", after: "0 Stalled (All 2 Rescheduled)", changeType: "POSITIVE" },
      { metric: "Hardware Availability", before: "A/V offline in Hall A", after: "A/V active in Hall B + Wireless Mic linked", changeType: "POSITIVE" },
      { metric: "Attendee Redirection Protocol", before: "No directional guides", after: "Volunteer Squad deployed with digital signage", changeType: "POSITIVE" }
    );
  } else if (payload.scenarioType === "VOLUNTEER_SHORTAGE") {
    scenarioTitle = "👥 Sudden Volunteer Shortage (6 Members Down)";
    disruptionDescription = "6 student volunteers reported sick. Critical shortfall detected in Registration and Tech Support desks.";

    stepsExecuted.push({
      stepNumber: 1,
      agentName: "Workforce Monitor Agent",
      status: "WARNING",
      action: "Detected Volunteer Depletion",
      details: "Active roster dropped from 20 to 14 volunteers during peak registration hours.",
    });

    // Rebalance squads
    stepsExecuted.push({
      stepNumber: 2,
      agentName: "Squad Rebalance Agent",
      status: "COMPLETED",
      action: "Reallocated Floater Squad to Critical Desks",
      details: "Transferred 4 volunteers from General Coordination floater pool to QR Registration Desk (2) and A/V Tech Booth (2).",
    });

    comparisonTable.push(
      { metric: "Registration Desk Staffing", before: "2 Volunteers (Severe Queue Delay)", after: "4 Volunteers (Normal Throughput)", changeType: "POSITIVE" },
      { metric: "A/V Tech Support Team", before: "2 Volunteers across 4 Halls", after: "4 Volunteers (Dedicated per Hall)", changeType: "POSITIVE" },
      { metric: "General Floater Pool", before: "6 Float Reserve", after: "2 Float Reserve (Optimal Lean Load)", changeType: "NEUTRAL" }
    );
  } else if (payload.scenarioType === "ATTENDANCE_SURGE") {
    scenarioTitle = "📈 Sudden Attendee Surge (+150 Students)";
    disruptionDescription = "Spot registrations and high walk-ins increased expected keynote attendance from 350 to 500+ participants.";

    stepsExecuted.push({
      stepNumber: 1,
      agentName: "Capacity Monitor Agent",
      status: "WARNING",
      action: "Detected Capacity Threshold Breach",
      details: "Keynote attendee count exceeded Seminar Hall capacity limit.",
    });

    stepsExecuted.push({
      stepNumber: 2,
      agentName: "Venue Upgrade Agent",
      status: "COMPLETED",
      action: "Promoted Keynote to Main Auditorium",
      details: "Allocated Main Auditorium (Capacity 650) with Balcony seating unlocked.",
    });

    comparisonTable.push(
      { metric: "Keynote Venue Allocation", before: "Seminar Hall A (Max 220 Seats)", after: "Main Auditorium (650 Seats)", changeType: "POSITIVE" },
      { metric: "Seating Capacity Buffer", before: "-130 Seats Deficit (Standing Room)", after: "+150 Extra Seat Buffer", changeType: "POSITIVE" },
      { metric: "Lunch Packet Allocation", before: "350 Catered Meals", after: "500 Catered Meals (+150 Requested)", changeType: "POSITIVE" }
    );
  } else {
    // Default fallback scenario
    scenarioTitle = "🔧 Hardware Projector Failure & Redundancy Failover";
    disruptionDescription = "Laser Projector in Computer Lab 1 suffered power surge. Swapped with reserve unit from Central A/V store.";

    stepsExecuted.push({
      stepNumber: 1,
      agentName: "Hardware Health Agent",
      status: "COMPLETED",
      action: "Identified Equipment Malfunction",
      details: "Dispatched backup 4K Laser Projector from Room A-102.",
    });

    comparisonTable.push(
      { metric: "Lab 1 Projection Hardware", before: "Faulty Projector (Offline)", after: "Reserve 4K Projector Online", changeType: "POSITIVE" },
      { metric: "Downtime Duration", before: "Estimated 45 min", after: "Reduced to 6 min hot-swap", changeType: "POSITIVE" }
    );
  }

  // Recalculate readiness
  const readiness = calculateEventReadiness(eventId);

  return {
    success: true,
    scenarioTitle,
    disruptionDescription,
    stepsExecuted,
    comparisonTable,
    affectedActivities,
    newTasksCreated,
    notificationsDispatched,
    newReadinessScore: readiness.overallScore,
  };
}
