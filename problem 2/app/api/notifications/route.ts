import { NextRequest, NextResponse } from "next/server";
import { db, NotificationRecord } from "@/lib/database/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const role = searchParams.get("role");

    let notifications = Array.from(db.notifications.values());

    if (eventId) {
      notifications = notifications.filter((n) => !n.eventId || n.eventId === eventId);
    }
    if (role && role !== "ADMIN") {
      notifications = notifications.filter((n) => n.roleTarget === "ALL" || n.roleTarget === role);
    }

    // Sort descending by date
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      count: notifications.length,
      unreadCount: notifications.filter((n) => !n.isRead).length,
      data: notifications,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, markAllRead } = body;

    if (markAllRead) {
      db.notifications.forEach((n) => {
        n.isRead = true;
      });
      return NextResponse.json({ success: true, message: "All notifications marked as read." });
    }

    if (id) {
      const notif = db.notifications.get(id);
      if (notif) {
        notif.isRead = true;
        return NextResponse.json({ success: true, data: notif });
      }
    }

    return NextResponse.json({ success: false, error: "Invalid request payload." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
