import { db, ConflictRecord, ActivityRecord } from "../database/db";

export interface DetectedConflict {
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
}

export function detectEventConflicts(eventId: string): DetectedConflict[] {
  const detected: DetectedConflict[] = [];
  const event = db.events.get(eventId);
  if (!event) return detected;

  const activities = Array.from(db.activities.values()).filter((a) => a.eventId === eventId);
  const venues = Array.from(db.venues.values());
  const equipmentList = Array.from(db.equipment.values());
  const approvals = Array.from(db.approvals.values()).filter((a) => a.eventId === eventId);

  // 1. Check Venue Double Bookings
  for (let i = 0; i < activities.length; i++) {
    for (let j = i + 1; j < activities.length; j++) {
      const actA = activities[i];
      const actB = activities[j];

      if (actA.venueId && actB.venueId && actA.venueId === actB.venueId && actA.venueId !== "") {
        // Check time string overlap heuristic
        if (actA.startTime === actB.startTime) {
          const venue = venues.find((v) => v.id === actA.venueId);
          const venueName = venue?.name || actA.venueName;

          // Find candidate alternative venues
          const altVenues = venues.filter((v) => v.id !== actA.venueId && v.capacity >= Math.min(actA.attendeeTarget, actB.attendeeTarget) && v.status === "AVAILABLE");

          const alternatives: DetectedConflict["recommendedAlternatives"] = altVenues.slice(0, 2).map((alt, idx) => ({
            id: `alt-venue-${idx + 1}`,
            label: `Relocate '${actB.title}' to ${alt.name}`,
            description: `${alt.name} has capacity ${alt.capacity} and is vacant during ${actB.startTime}.`,
            actionType: "REPLACE_VENUE",
            payload: { activityId: actB.id, targetVenueId: alt.id, targetVenueName: alt.name },
          }));

          alternatives.push({
            id: `alt-time-shift`,
            label: `Reschedule '${actB.title}' to Afternoon Slot`,
            description: `Shift start time to eliminate overlap with '${actA.title}'.`,
            actionType: "CHANGE_TIME",
            payload: { activityId: actB.id, newStartTime: "Day 1, 02:00 PM", newEndTime: "Day 1, 04:00 PM" },
          });

          detected.push({
            id: `cnf-double-${actA.id}-${actB.id}`,
            eventId,
            category: "VENUE_DOUBLE_BOOKING",
            severity: "HIGH",
            title: `Room Collision in ${venueName}`,
            description: `'${actA.title}' and '${actB.title}' are both scheduled in ${venueName} during ${actA.startTime}.`,
            affectedItem: `${venueName} (${actA.startTime})`,
            recommendedAlternatives: alternatives,
            status: "ACTIVE",
          });
        }
      }
    }
  }

  // 2. Check Venue Capacity Overshoots
  activities.forEach((act) => {
    if (act.venueId) {
      const venue = venues.find((v) => v.id === act.venueId);
      if (venue && act.attendeeTarget > venue.capacity) {
        const biggerVenues = venues.filter((v) => v.capacity >= act.attendeeTarget && v.status === "AVAILABLE");
        detected.push({
          id: `cnf-cap-${act.id}`,
          eventId,
          category: "CAPACITY_OVERSHOOT",
          severity: "HIGH",
          title: `Capacity Overshoot for ${act.title}`,
          description: `Target attendance (${act.attendeeTarget}) exceeds room capacity (${venue.capacity}) of ${venue.name}.`,
          affectedItem: `${venue.name} (Max ${venue.capacity} seats)`,
          recommendedAlternatives: biggerVenues.map((bv, idx) => ({
            id: `alt-cap-${idx}`,
            label: `Upgrade to ${bv.name} (${bv.capacity} seats)`,
            description: `Accommodates full target attendance with comfortable seating buffer.`,
            actionType: "REPLACE_VENUE",
            payload: { activityId: act.id, targetVenueId: bv.id, targetVenueName: bv.name },
          })),
          status: "ACTIVE",
        });
      }
    }
  });

  // 3. Check Equipment Deficits
  const equipmentUsage: Record<string, number> = {};
  activities.forEach((act) => {
    act.requiredEquipment.forEach((eqName) => {
      equipmentUsage[eqName] = (equipmentUsage[eqName] || 0) + 1;
    });
  });

  equipmentList.forEach((eq) => {
    const required = equipmentUsage[eq.name] || 0;
    if (required > eq.availableQuantity) {
      detected.push({
        id: `cnf-eq-${eq.id}`,
        eventId,
        category: "EQUIPMENT_SHORTAGE",
        severity: "MEDIUM",
        title: `Hardware Inventory Shortage: ${eq.name}`,
        description: `Required allocation (${required}) exceeds currently available stock (${eq.availableQuantity}) in ${eq.storageLocation}.`,
        affectedItem: eq.name,
        recommendedAlternatives: [
          {
            id: "alt-borrow",
            label: `Issue Inter-Department Borrowing Voucher`,
            description: `Request surplus units from Electronics Department Lab Store.`,
            actionType: "SUBSTITUTE_EQUIPMENT",
            payload: { equipmentId: eq.id, quantityNeeded: required - eq.availableQuantity },
          },
          {
            id: "alt-substitute",
            label: `Deploy Portable Standalone Units`,
            description: `Substitute with high-lumen portable alternatives.`,
            actionType: "SUBSTITUTE_EQUIPMENT",
            payload: { equipmentId: eq.id },
          },
        ],
        status: "ACTIVE",
      });
    }
  });

  // 4. Check Missing Critical Permissions
  if (event.attendeeCount >= 400) {
    const securityApproval = approvals.find((a) => a.category === "SECURITY" && a.status === "APPROVED");
    if (!securityApproval) {
      detected.push({
        id: `cnf-perm-sec-${event.id}`,
        eventId,
        category: "PERMISSION_MISSING",
        severity: "CRITICAL",
        title: "Missing Mandatory Campus Security & Night Clearance",
        description: "Large event (500 attendees) requires formal security clearance and gate extension ratification.",
        affectedItem: "Campus Security Clearance",
        recommendedAlternatives: [
          {
            id: "alt-req-sec",
            label: "Dispatch Expedited Approval Request to Security Officer",
            description: "Notifies the campus chief security officer for immediate digital sign-off.",
            actionType: "REQUEST_APPROVAL",
            payload: { category: "SECURITY" },
          },
        ],
        status: "ACTIVE",
      });
    }
  }

  // Sync with Database
  // Keep existing conflicts that might have been custom created if still valid
  detected.forEach((d) => {
    if (!db.conflicts.has(d.id)) {
      db.conflicts.set(d.id, d);
    }
  });

  return Array.from(db.conflicts.values()).filter((c) => c.eventId === eventId);
}
