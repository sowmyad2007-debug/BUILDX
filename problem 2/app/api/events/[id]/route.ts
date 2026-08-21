import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { calculateEventReadiness } from "@/lib/planner/readiness-calculator";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const event = db.events.get(id);

    if (!event) {
      return NextResponse.json({ success: false, error: `Event with id '${id}' not found.` }, { status: 404 });
    }

    const activities = Array.from(db.activities.values()).filter((a) => a.eventId === id);
    const conflicts = Array.from(db.conflicts.values()).filter((c) => c.eventId === id);
    const approvals = Array.from(db.approvals.values()).filter((a) => a.eventId === id);
    const tasks = Array.from(db.tasks.values()).filter((t) => t.eventId === id);
    const checklists = Array.from(db.checklists.values()).filter((c) => c.eventId === id);
    const briefings = Array.from(db.briefings.values()).filter((b) => b.eventId === id);
    const readiness = calculateEventReadiness(id);

    return NextResponse.json({
      success: true,
      data: {
        ...event,
        readinessScore: readiness.overallScore,
        readinessBreakdown: readiness,
        activities,
        conflicts,
        approvals,
        tasks,
        checklists,
        briefings,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
