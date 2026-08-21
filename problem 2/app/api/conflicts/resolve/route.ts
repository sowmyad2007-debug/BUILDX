import { NextRequest, NextResponse } from "next/server";
import { resolveConflict } from "@/lib/conflict-engine/recommender";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conflictId, alternativeId, resolvedBy } = body;

    if (!conflictId) {
      return NextResponse.json({ success: false, error: "conflictId is required." }, { status: 400 });
    }

    const result = resolveConflict({
      conflictId,
      alternativeId: alternativeId || "",
      resolvedBy: resolvedBy || "Event Organizer",
    });

    return NextResponse.json({
      success: true,
      message: "Conflict resolved successfully.",
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
