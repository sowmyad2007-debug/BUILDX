import { NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export async function GET() {
  try {
    const events = Array.from(db.events.values());
    const registrations = Array.from(db.registrations.values());
    const venues = Array.from(db.venues.values());
    const conflicts = Array.from(db.conflicts.values());
    const approvals = Array.from(db.approvals.values());
    const tasks = Array.from(db.tasks.values());

    // Calculate total revenue in ₹
    const totalRevenue = registrations.reduce((sum, reg) => sum + (reg.pricePaid || 0), 0);

    // Registrations by Event
    const registrationsByEvent = events.map((evt) => {
      const count = registrations.filter((r) => r.eventId === evt.id).length + (evt.registeredCount || 0);
      return {
        id: evt.id,
        name: evt.name,
        category: evt.category || evt.type,
        registeredCount: count,
        capacity: evt.capacity || evt.attendeeCount || 500,
        price: evt.price || 0,
        revenue: count * (evt.price || 0),
      };
    });

    // Venue utilization
    const venueUtilization = venues.map((v) => {
      const bookedEvents = events.filter((e) => e.venueId === v.id || e.venueName?.includes(v.name));
      return {
        name: v.name,
        code: v.code,
        capacity: v.capacity,
        status: v.status,
        eventsCount: bookedEvents.length,
        occupancyRate: v.status === "OFFLINE" ? 0 : Math.min(100, Math.round((bookedEvents.length / 3) * 100)),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalEvents: events.length,
        totalRegistrations: registrations.length + 3575, // Include cumulative seed registrations
        totalRevenue: totalRevenue + 485000, // Cumulative demo revenue in ₹
        totalRevenueFormatted: `₹${(totalRevenue + 485000).toLocaleString()}`,
        activeVenuesCount: venues.filter((v) => v.status === "AVAILABLE").length,
        totalVenuesCount: venues.length,
        activeConflictsCount: conflicts.filter((c) => c.status === "ACTIVE").length,
        pendingApprovalsCount: approvals.filter((a) => a.status === "PENDING").length,
        completedTasksCount: tasks.filter((t) => t.status === "COMPLETED").length,
        totalTasksCount: tasks.length,
        registrationsByEvent,
        venueUtilization,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
