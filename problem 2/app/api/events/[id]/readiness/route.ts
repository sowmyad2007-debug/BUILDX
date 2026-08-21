import { NextRequest, NextResponse } from "next/server";
import { calculateEventReadiness } from "@/lib/planner/readiness-calculator";
import { db } from "@/lib/database/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const event = db.events.get(id);
    if (!event) {
      return NextResponse.json({ success: false, error: `Event '${id}' not found.` }, { status: 404 });
    }

    const readiness = calculateEventReadiness(id);
    return NextResponse.json({
      success: true,
      eventId: id,
      eventName: event.name,
      readiness,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
