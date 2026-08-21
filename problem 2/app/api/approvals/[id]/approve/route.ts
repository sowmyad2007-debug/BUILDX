import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { calculateEventReadiness } from "@/lib/planner/readiness-calculator";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const approval = db.approvals.get(id);

    if (!approval) {
      return NextResponse.json({ success: false, error: `Approval with id '${id}' not found.` }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));

    approval.status = "APPROVED";
    approval.approvedBy = body.approvedBy || "Campus Administrator";
    approval.resolutionNotes = body.notes || "Approved through Human-in-the-Loop Ratification Center.";
    approval.resolvedAt = new Date().toISOString();

    // Create notification
    const notifId = `notif-appr-${Date.now()}`;
    db.notifications.set(notifId, {
      id: notifId,
      eventId: approval.eventId,
      title: `✅ Approval Granted: ${approval.title}`,
      message: `Ratified by ${approval.approvedBy}. Operational permissions unlocked.`,
      type: "APPROVAL",
      roleTarget: "ALL",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    const readiness = calculateEventReadiness(approval.eventId);

    return NextResponse.json({
      success: true,
      data: approval,
      readiness: readiness.overallScore,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
