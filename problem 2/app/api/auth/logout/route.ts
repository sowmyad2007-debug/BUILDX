import { NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  db.currentUser = null;
  return NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });
}
