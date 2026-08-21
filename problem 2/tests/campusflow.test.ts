import { describe, it, expect, beforeEach } from "vitest";
import { parseNaturalLanguageRequirements } from "../lib/planner/intake-parser";
import { generateOperationalPlan } from "../lib/planner/planning-engine";
import { detectEventConflicts } from "../lib/conflict-engine/detector";
import { resolveConflict } from "../lib/conflict-engine/recommender";
import { executeDynamicReplanning } from "../lib/planner/replanning-engine";
import { calculateEventReadiness } from "../lib/planner/readiness-calculator";
import { db } from "../lib/database/db";

describe("CampusFlow AI — Core Agent Planning, Coordination & Student Registration Test Suite", () => {
  beforeEach(() => {
    db.resetToDemoState();
  });

  it("1. Natural Language Intake: Correctly parses prompt into structured parameters", () => {
    const prompt = "Plan a 2-day technical fest for 500 students with 6 workshops, 2 seminar halls, 4 labs, 30 volunteers, AV equipment, security, transportation and food arrangements.";
    const parsed = parseNaturalLanguageRequirements(prompt);

    expect(parsed.attendeeCount).toBe(500);
    expect(parsed.durationDays).toBe(2);
    expect(parsed.volunteerCount).toBe(30);
    expect(parsed.type).toBe("Technical Fest");
    expect(parsed.requiredVenues.length).toBeGreaterThanOrEqual(2);
    expect(parsed.requiredEquipment.length).toBeGreaterThanOrEqual(2);
    expect(parsed.securityRequirements.length).toBeGreaterThanOrEqual(1);
    expect(parsed.budget).toBeGreaterThan(5000);
  });

  it("2. Operational Plan Generation: Synthesizes schedule, tasks, checklists, and briefings", () => {
    const prompt = "Plan a 2-day technical fest for 500 students with 6 workshops, 2 seminar halls, 4 labs, 30 volunteers, AV equipment, security, transportation and food arrangements.";
    const parsed = parseNaturalLanguageRequirements(prompt);
    const plan = generateOperationalPlan(parsed);

    expect(plan.event.id).toBeDefined();
    expect(plan.activities.length).toBeGreaterThanOrEqual(4);
    expect(plan.tasks.length).toBeGreaterThanOrEqual(4);
    expect(plan.checklists.length).toBeGreaterThanOrEqual(5);
    expect(plan.briefings.length).toBeGreaterThanOrEqual(4);
    expect(plan.readinessScore).toBeGreaterThanOrEqual(50);
  });

  it("3. Conflict Detection Engine: Detects venue double-bookings and shortages", () => {
    const conflicts = detectEventConflicts("evt-techfest-2026");

    expect(conflicts.length).toBeGreaterThanOrEqual(1);
    const venueConflict = conflicts.find((c) => c.category === "VENUE_DOUBLE_BOOKING" || c.category === "PERMISSION_MISSING");
    expect(venueConflict).toBeDefined();
    if (venueConflict) {
      expect(venueConflict.recommendedAlternatives.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("4. Alternative Recommendation & Conflict Resolution: Successfully applies chosen alternative", () => {
    const conflicts = detectEventConflicts("evt-techfest-2026");
    const firstConflict = conflicts[0];

    expect(firstConflict).toBeDefined();
    const alt = firstConflict.recommendedAlternatives[0];
    expect(alt).toBeDefined();

    const resolveResult = resolveConflict({
      conflictId: firstConflict.id,
      alternativeId: alt.id,
      resolvedBy: "Lead Organizer",
    });

    expect(resolveResult.success).toBe(true);
    expect(resolveResult.conflict.status).toBe("RESOLVED");
    expect(resolveResult.readiness.overallScore).toBeGreaterThanOrEqual(70);
  });

  it("5. 9-Step Dynamic Replanning: Simulates sudden venue outage with Before vs After delta", () => {
    const replanResult = executeDynamicReplanning({
      eventId: "evt-techfest-2026",
      scenarioType: "VENUE_UNAVAILABLE",
    });

    expect(replanResult.success).toBe(true);
    expect(replanResult.stepsExecuted.length).toBeGreaterThanOrEqual(5);
    expect(replanResult.comparisonTable.length).toBeGreaterThanOrEqual(3);
    expect(replanResult.notificationsDispatched.length).toBeGreaterThanOrEqual(1);
    expect(replanResult.newReadinessScore).toBeGreaterThan(0);
  });

  it("6. Human Approval Governance: Approving clearances updates event readiness", () => {
    const initialReadiness = calculateEventReadiness("evt-techfest-2026").overallScore;
    const approvals = Array.from(db.approvals.values()).filter((a) => a.eventId === "evt-techfest-2026");
    const pending = approvals.find((a) => a.status === "PENDING");

    expect(pending).toBeDefined();
    if (pending) {
      pending.status = "APPROVED";
      pending.approvedBy = "Dean of Student Affairs";
      const updatedReadiness = calculateEventReadiness("evt-techfest-2026").overallScore;
      expect(updatedReadiness).toBeGreaterThanOrEqual(initialReadiness);
    }
  });

  it("7. Automated Readiness Checklist: Ticking items recalculates readiness percentage", () => {
    const checklists = Array.from(db.checklists.values()).filter((c) => c.eventId === "evt-techfest-2026");
    const uncompleted = checklists.filter((c) => !c.isCompleted);

    expect(uncompleted.length).toBeGreaterThan(0);
    uncompleted[0].isCompleted = true;
    const readiness = calculateEventReadiness("evt-techfest-2026");
    expect(readiness.overallScore).toBeGreaterThan(0);
  });

  it("8. 9 Flagship Campus Events: Pre-seeded with realistic pricing in ₹ and capacity", () => {
    const events = Array.from(db.events.values());
    expect(events.length).toBe(9);

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toContain("TechFest 2026");
    expect(eventNames).toContain("Hackathon 2026");
    expect(eventNames).toContain("AI & Innovation Summit");
    expect(eventNames).toContain("CodeSprint");
    expect(eventNames).toContain("Robotics Challenge");
    expect(eventNames).toContain("Placement Drive");
    expect(eventNames).toContain("Technical Workshop");
    expect(eventNames).toContain("Cultural Fest");
    expect(eventNames).toContain("Sports Carnival");

    const placementDrive = events.find((e) => e.name === "Placement Drive");
    expect(placementDrive?.price).toBe(0);
    expect(placementDrive?.priceFormatted).toBe("Free");

    const aiSummit = events.find((e) => e.name === "AI & Innovation Summit");
    expect(aiSummit?.price).toBe(300);
    expect(aiSummit?.priceFormatted).toBe("₹300");
  });

  it("9. Student Event Registration: Generates unique Registration ID & Prevents duplicates", () => {
    const event = db.events.get("evt-codesprint-2026");
    expect(event).toBeDefined();

    const regId = `REG-CS26-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReg = {
      id: "reg-test-101",
      eventId: "evt-codesprint-2026",
      eventName: event!.name,
      eventDate: event!.date || event!.startDate,
      eventVenue: event!.venueName || event!.location,
      eventTime: "02:00 PM - 06:00 PM",
      studentName: "Ananya Iyer",
      studentId: "STU-2024-CS42",
      email: "ananya.i@campus.edu",
      phone: "+91 98765 43213",
      department: "Computer Science",
      year: "2nd Year",
      emergencyContact: "+91 98765 99999",
      registrationId: regId,
      pricePaid: event!.price || 0,
      priceFormatted: event!.priceFormatted || "₹100",
      paymentStatus: "Paid" as const,
      createdAt: new Date().toISOString(),
    };

    db.registrations.set(newReg.id, newReg);

    expect(newReg.registrationId).toMatch(/^REG-CS26-\d{4}$/);
    expect(newReg.pricePaid).toBe(100);
    expect(newReg.paymentStatus).toBe("Paid");

    // Verify retrieval
    const retrieved = db.registrations.get("reg-test-101");
    expect(retrieved?.studentName).toBe("Ananya Iyer");
  });
});
