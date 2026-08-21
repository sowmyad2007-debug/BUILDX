import { db } from "../database/db";
import { calculateEventReadiness } from "../planner/readiness-calculator";

export interface ResolveConflictPayload {
  conflictId: string;
  alternativeId: string;
  resolvedBy?: string;
}

export function resolveConflict(payload: ResolveConflictPayload) {
  const conflict = db.conflicts.get(payload.conflictId);
  if (!conflict) {
    throw new Error(`Conflict with ID ${payload.conflictId} not found.`);
  }

  const selectedAlt = conflict.recommendedAlternatives.find((a) => a.id === payload.alternativeId);
  if (!selectedAlt) {
    // If specific alternative ID not found, take the first available
    const fallbackAlt = conflict.recommendedAlternatives[0];
    if (fallbackAlt) {
      applyAlternativeAction(fallbackAlt);
    }
  } else {
    applyAlternativeAction(selectedAlt);
  }

  conflict.status = "RESOLVED";
  conflict.resolvedAt = new Date().toISOString();

  // Create resolution notification
  const notifId = `notif-res-${Date.now()}`;
  db.notifications.set(notifId, {
    id: notifId,
    eventId: conflict.eventId,
    title: `✅ Conflict Resolved: ${conflict.title}`,
    message: `Alternative selected and applied successfully. Operational plan updated.`,
    type: "CONFLICT",
    roleTarget: "ALL",
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  // Recalculate event readiness
  calculateEventReadiness(conflict.eventId);

  return {
    success: true,
    conflict,
    readiness: calculateEventReadiness(conflict.eventId),
  };
}

function applyAlternativeAction(alt: { actionType: string; payload: any }) {
  if (alt.actionType === "REPLACE_VENUE" && alt.payload?.activityId && alt.payload?.targetVenueId) {
    const act = db.activities.get(alt.payload.activityId);
    if (act) {
      act.venueId = alt.payload.targetVenueId;
      act.venueName = alt.payload.targetVenueName || act.venueName;
    }
  } else if (alt.actionType === "CHANGE_TIME" && alt.payload?.activityId) {
    const act = db.activities.get(alt.payload.activityId);
    if (act) {
      if (alt.payload.newStartTime) act.startTime = alt.payload.newStartTime;
      if (alt.payload.newEndTime) act.endTime = alt.payload.newEndTime;
    }
  } else if (alt.actionType === "REQUEST_APPROVAL") {
    // Ensure pending approval exists
    const apprId = `appr-gen-${Date.now()}`;
    db.approvals.set(apprId, {
      id: apprId,
      eventId: "evt-demo-hackfest-2026",
      title: "Expedited Campus Security Clearance",
      reason: "Mandatory campus security clearance for overnight hackathon activities.",
      category: "SECURITY",
      requestedBy: "Conflict Resolution Agent",
      priority: "CRITICAL",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    });
  }
}
