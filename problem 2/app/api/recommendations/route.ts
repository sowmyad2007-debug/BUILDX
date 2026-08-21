import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requiredCapacity, requiredEquipment, excludeVenueId } = body;

    const venues = Array.from(db.venues.values());
    const candidates = venues
      .filter((v) => v.status === "AVAILABLE" && v.id !== excludeVenueId)
      .map((v) => {
        let score = v.suitabilityScore || 90;
        if (requiredCapacity && v.capacity >= requiredCapacity) {
          score += 5;
        } else if (requiredCapacity && v.capacity < requiredCapacity) {
          score -= 30;
        }
        return {
          id: v.id,
          name: v.name,
          code: v.code,
          capacity: v.capacity,
          location: v.location,
          suitabilityScore: Math.min(99, score),
          isAccessible: v.isAccessible,
          wifiCoverage: v.wifiCoverage,
        };
      })
      .sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    return NextResponse.json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
