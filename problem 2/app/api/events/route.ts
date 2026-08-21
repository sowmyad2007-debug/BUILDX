import { NextRequest, NextResponse } from "next/server";
import { db, EventRecord } from "@/lib/database/db";
import { calculateEventReadiness } from "@/lib/planner/readiness-calculator";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    if (db.events.size < 9) {
      db.resetToDemoState();
    }
    const events = Array.from(db.events.values()).map((evt) => {
      const readiness = calculateEventReadiness(evt.id);
      return {
        ...evt,
        readinessScore: readiness.overallScore,
      };
    });
    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: "Event name is required." }, { status: 400 });
    }

    const id = body.id || `evt-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newEvent: EventRecord = {
      id,
      name: body.name,
      type: body.type || "Technical Fest",
      description: body.description || "",
      rawPrompt: body.rawPrompt || "",
      startDate: body.startDate || nowIso,
      endDate: body.endDate || nowIso,
      attendeeCount: Number(body.attendeeCount) || 100,
      budget: Number(body.budget) || 0,
      status: body.status || "PLANNING",
      readinessScore: 60,
      location: body.location || "Main Campus Complex",
      specialRequirements: body.specialRequirements || "",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    db.events.set(id, newEvent);

    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
