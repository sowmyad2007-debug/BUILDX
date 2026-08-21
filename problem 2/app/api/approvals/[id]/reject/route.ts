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

    approval.status = "REJECTED";
    approval.approvedBy = body.rejectedBy || "Campus Administrator";
    approval.resolutionNotes = body.notes || "Action rejected. Operational adjustments or budget reduction required.";
    approval.resolvedAt = new Date().toISOString();

    const notifId = `notif-appr-rej-${Date.now()}`;
    db.notifications.set(notifId, {
      id: notifId,
      eventId: approval.eventId,
      title: `❌ Approval Rejected: ${approval.title}`,
      message: `Action declined by ${approval.approvedBy}. Reason: ${approval.resolutionNotes}`,
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
