import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { detectEventConflicts } from "@/lib/conflict-engine/detector";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId") || Array.from(db.events.keys())[0] || "evt-demo-hackfest-2026";
    const conflicts = detectEventConflicts(eventId);

    return NextResponse.json({
      success: true,
      eventId,
      count: conflicts.length,
      activeCount: conflicts.filter((c) => c.status === "ACTIVE").length,
      data: conflicts,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventId = body.eventId || Array.from(db.events.keys())[0] || "evt-demo-hackfest-2026";
    const conflicts = detectEventConflicts(eventId);

    return NextResponse.json({
      success: true,
      eventId,
      count: conflicts.length,
      activeCount: conflicts.filter((c) => c.status === "ACTIVE").length,
      data: conflicts,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
