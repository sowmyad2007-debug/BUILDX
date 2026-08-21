import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const minCapacity = searchParams.get("minCapacity");
    const status = searchParams.get("status");

    let venues = Array.from(db.venues.values());

    if (minCapacity) {
      venues = venues.filter((v) => v.capacity >= parseInt(minCapacity, 10));
    }
    if (status) {
      venues = venues.filter((v) => v.status === status);
    }

    return NextResponse.json({
      success: true,
      count: venues.length,
      data: venues,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
