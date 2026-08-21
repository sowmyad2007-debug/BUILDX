import { db, EventRecord } from "../database/db";

export interface ReadinessBreakdown {
  overallScore: number;
  venueScore: number;
  equipmentScore: number;
  volunteerScore: number;
  taskScore: number;
  checklistScore: number;
  approvalScore: number;
  activeConflictsCount: number;
  pendingApprovalsCount: number;
  completedTasksCount: number;
  totalTasksCount: number;
  completedChecklistCount: number;
  totalChecklistCount: number;
}

export function calculateEventReadiness(eventId: string): ReadinessBreakdown {
  const event = db.events.get(eventId);
  const activities = Array.from(db.activities.values()).filter((a) => a.eventId === eventId);
  const conflicts = Array.from(db.conflicts.values()).filter((c) => c.eventId === eventId && c.status === "ACTIVE");
  const approvals = Array.from(db.approvals.values()).filter((a) => a.eventId === eventId);
  const tasks = Array.from(db.tasks.values()).filter((t) => t.eventId === eventId);
  const checklists = Array.from(db.checklists.values()).filter((c) => c.eventId === eventId);

  // 1. Venue Score (20% Weight)
  let venueScore = 100;
  if (activities.length > 0) {
    const venuesWithConflicts = conflicts.filter((c) => c.category === "VENUE_DOUBLE_BOOKING" || c.category === "CAPACITY_OVERSHOOT");
    venueScore = Math.max(0, Math.round(((activities.length - venuesWithConflicts.length) / activities.length) * 100));
  }

  // 2. Equipment Score (15% Weight)
  const equipmentConflicts = conflicts.filter((c) => c.category === "EQUIPMENT_SHORTAGE");
  const equipmentScore = equipmentConflicts.length > 0 ? Math.max(20, 100 - equipmentConflicts.length * 40) : 95;

  // 3. Volunteer Score (15% Weight)
  const volunteerConflicts = conflicts.filter((c) => c.category === "VOLUNTEER_OVERLAP");
  const volunteerScore = volunteerConflicts.length > 0 ? Math.max(30, 100 - volunteerConflicts.length * 35) : 92;

  // 4. Task Score (20% Weight) - Base 50% for initial automated synthesis + 50% for completed/in-progress execution
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const taskExecutionRatio = tasks.length > 0 ? (completedTasks + inProgressTasks * 0.5) / tasks.length : 0.8;
  const taskScore = Math.round(50 + 50 * taskExecutionRatio);

  // 5. Checklist Score (15% Weight) - Base 50% for automated checklist provisioning + 50% for verified items
  const completedChecklist = checklists.filter((c) => c.isCompleted).length;
  const checklistRatio = checklists.length > 0 ? completedChecklist / checklists.length : 0.7;
  const checklistScore = Math.round(50 + 50 * checklistRatio);

  // 6. Approval Score (15% Weight)
  const approvedCount = approvals.filter((a) => a.status === "APPROVED").length;
  const pendingApprovals = approvals.filter((a) => a.status === "PENDING").length;
  const approvalRatio = approvals.length > 0 ? approvedCount / approvals.length : 1.0;
  const approvalScore = Math.round(40 + 60 * approvalRatio);

  // Weighted Total
  let rawWeighted =
    venueScore * 0.2 +
    equipmentScore * 0.15 +
    volunteerScore * 0.15 +
    taskScore * 0.2 +
    checklistScore * 0.15 +
    approvalScore * 0.15;

  // Penalty for unresolved active conflicts
  const conflictPenalty = conflicts.length * 6;
  const overallScore = Math.max(0, Math.min(100, Math.round(rawWeighted - conflictPenalty)));

  // Update in DB if event exists
  if (event) {
    event.readinessScore = overallScore;
  }

  return {
    overallScore,
    venueScore,
    equipmentScore,
    volunteerScore,
    taskScore,
    checklistScore,
    approvalScore,
    activeConflictsCount: conflicts.length,
    pendingApprovalsCount: pendingApprovals,
    completedTasksCount: completedTasks,
    totalTasksCount: tasks.length,
    completedChecklistCount: completedChecklist,
    totalChecklistCount: checklists.length,
  };
}
