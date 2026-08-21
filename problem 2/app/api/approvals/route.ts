import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    let approvals = Array.from(db.approvals.values());

    if (eventId) {
      approvals = approvals.filter((a) => a.eventId === eventId);
    }
    if (status) {
      approvals = approvals.filter((a) => a.status === status);
    }
    if (category) {
      approvals = approvals.filter((a) => a.category === category);
    }

    return NextResponse.json({
      success: true,
      count: approvals.length,
      pendingCount: approvals.filter((a) => a.status === "PENDING").length,
      data: approvals,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
