import { NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { calculateEventReadiness } from "@/lib/planner/readiness-calculator";

export async function POST() {
  try {
    db.resetToDemoState();
    const demoEventId = "evt-demo-hackfest-2026";
    const readiness = calculateEventReadiness(demoEventId);

    return NextResponse.json({
      success: true,
      message: "CampusFlow AI state successfully reset to comprehensive demo dataset.",
      eventId: demoEventId,
      readinessScore: readiness.overallScore,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
