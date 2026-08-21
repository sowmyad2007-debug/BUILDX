import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let equipmentList = Array.from(db.equipment.values());

    if (category) {
      equipmentList = equipmentList.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      count: equipmentList.length,
      data: equipmentList,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
