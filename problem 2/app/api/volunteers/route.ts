import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const availability = searchParams.get("availability");

    let volunteers = Array.from(db.volunteers.values());

    if (department) {
      volunteers = volunteers.filter((v) => v.department.toLowerCase() === department.toLowerCase());
    }
    if (availability) {
      volunteers = volunteers.filter((v) => v.availability === availability);
    }

    return NextResponse.json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
