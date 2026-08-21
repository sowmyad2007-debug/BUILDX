import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId") || Array.from(db.events.keys())[0] || "evt-demo-hackfest-2026";
    const targetRole = searchParams.get("role");

    let briefings = Array.from(db.briefings.values()).filter((b) => b.eventId === eventId);

    if (targetRole) {
      briefings = briefings.filter((b) => b.targetRole === targetRole);
    }

    return NextResponse.json({
      success: true,
      count: briefings.length,
      data: briefings,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
