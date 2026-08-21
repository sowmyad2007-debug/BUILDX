import { NextRequest, NextResponse } from "next/server";
import { executeDynamicReplanning, ReplanScenarioPayload } from "@/lib/planner/replanning-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload: ReplanScenarioPayload = {
      eventId: body.eventId || "evt-demo-hackfest-2026",
      scenarioType: body.scenarioType || "VENUE_UNAVAILABLE",
      customDetails: body.customDetails,
      targetVenueCode: body.targetVenueCode,
      shortageCount: body.shortageCount,
    };

    const replanResult = executeDynamicReplanning(payload);

    return NextResponse.json({
      success: true,
      message: `Dynamic replanning executed: ${replanResult.scenarioTitle}`,
      data: replanResult,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
