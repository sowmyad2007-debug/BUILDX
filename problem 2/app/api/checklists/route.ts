import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { calculateEventReadiness } from "@/lib/planner/readiness-calculator";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const category = searchParams.get("category");

    let checklists = Array.from(db.checklists.values());

    if (eventId) {
      checklists = checklists.filter((c) => c.eventId === eventId);
    }
    if (category) {
      checklists = checklists.filter((c) => c.category === category);
    }

    checklists.sort((a, b) => a.sortOrder - b.sortOrder);

    return NextResponse.json({
      success: true,
      count: checklists.length,
      completedCount: checklists.filter((c) => c.isCompleted).length,
      data: checklists,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isCompleted, completedBy } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Checklist item id is required." }, { status: 400 });
    }

    const item = db.checklists.get(id);
    if (!item) {
      return NextResponse.json({ success: false, error: `Checklist item '${id}' not found.` }, { status: 404 });
    }

    item.isCompleted = Boolean(isCompleted);
    item.completedBy = item.isCompleted ? (completedBy || "Event Coordinator") : undefined;
    item.completedAt = item.isCompleted ? new Date().toISOString() : undefined;

    const readiness = calculateEventReadiness(item.eventId);

    return NextResponse.json({
      success: true,
      data: item,
      readiness: readiness.overallScore,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
