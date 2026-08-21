import { NextRequest, NextResponse } from "next/server";
import { db, RegistrationRecord } from "@/lib/database/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");

    let list = Array.from(db.registrations.values());

    if (eventId) {
      list = list.filter((r) => r.eventId === eventId);
    }
    if (email) {
      list = list.filter((r) => r.email.toLowerCase() === email.toLowerCase());
    }
    if (userId) {
      list = list.filter((r) => r.userId === userId);
    }

    // Sort descending by date
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventId,
      studentName,
      studentId,
      email,
      phone,
      department,
      year,
      emergencyContact,
    } = body;

    // 1. Validation: Required fields
    if (!eventId || !studentName || !studentId || !email) {
      return NextResponse.json(
        { success: false, error: "Event ID, Full Name, Student ID, and Email are mandatory." },
        { status: 400 }
      );
    }

    // 2. Find Event
    const event = db.events.get(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: `Event with ID '${eventId}' not found.` },
        { status: 404 }
      );
    }

    // 3. Validation: Duplicate Check
    const existingRegistration = Array.from(db.registrations.values()).find(
      (r) => r.eventId === eventId && (r.email.toLowerCase() === email.toLowerCase() || r.studentId === studentId)
    );
    if (existingRegistration) {
      return NextResponse.json(
        {
          success: false,
          error: `You are already registered for '${event.name}'. Registration ID: ${existingRegistration.registrationId}.`,
        },
        { status: 409 }
      );
    }

    // 4. Validation: Capacity Limit Check
    const currentRegCount = (event.registeredCount || 0);
    const capacityLimit = (event.capacity || event.attendeeCount || 500);
    if (currentRegCount >= capacityLimit) {
      return NextResponse.json(
        { success: false, error: `Registration full. Event has reached maximum capacity of ${capacityLimit} seats.` },
        { status: 400 }
      );
    }

    // 5. Generate Unique Registration ID (e.g. REG-TF26-8941)
    const eventPrefix = event.name.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const uniqueRegId = `REG-${eventPrefix}26-${randomSuffix}`;

    // 6. Pricing Summary & Demo Payment
    const price = event.price || 0;
    const priceFormatted = event.priceFormatted || (price === 0 ? "Free" : `₹${price}`);
    const paymentStatus = price === 0 ? "Free" : "Paid"; // Demo instant paid workflow

    const newRegistration: RegistrationRecord = {
      id: `reg-${Date.now()}`,
      eventId,
      eventName: event.name,
      eventDate: event.date || event.startDate,
      eventVenue: event.venueName || event.location,
      eventTime: event.startTime ? `${event.startTime} - ${event.endTime}` : "09:00 AM",
      userId: db.currentUser?.id,
      studentName,
      studentId,
      email: email.toLowerCase(),
      phone: phone || "",
      department: department || "Computer Science",
      year: year || "1st Year",
      emergencyContact: emergencyContact || "",
      registrationId: uniqueRegId,
      pricePaid: price,
      priceFormatted,
      paymentStatus,
      createdAt: new Date().toISOString(),
    };

    db.registrations.set(newRegistration.id, newRegistration);

    // Increment event count
    event.registeredCount = currentRegCount + 1;

    // Create Notification
    const notifId = `notif-reg-${Date.now()}`;
    db.notifications.set(notifId, {
      id: notifId,
      eventId: event.id,
      title: `🎉 Registration Confirmed: ${event.name}`,
      message: `Your registration for ${event.name} is confirmed! Pass ID: ${uniqueRegId}. Venue: ${event.venueName || event.location}.`,
      type: "REGISTRATION",
      roleTarget: "STUDENT",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: `Successfully registered for ${event.name}!`,
        data: newRegistration,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
