import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const registration = db.registrations.get(id) || Array.from(db.registrations.values()).find((r) => r.registrationId === id);

    if (!registration) {
      return NextResponse.json({ success: false, error: `Registration '${id}' not found.` }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: registration });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const registration = db.registrations.get(id);

    if (!registration) {
      return NextResponse.json({ success: false, error: `Registration '${id}' not found.` }, { status: 404 });
    }

    // Decrement event registered count if event exists
    const event = db.events.get(registration.eventId);
    if (event && event.registeredCount && event.registeredCount > 0) {
      event.registeredCount -= 1;
    }

    db.registrations.delete(id);

    return NextResponse.json({ success: true, message: "Registration cancelled successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
