import { NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const user = db.currentUser;
  if (!user) {
    return NextResponse.json({
      success: true,
      isAuthenticated: false,
      user: null,
    });
  }

  return NextResponse.json({
    success: true,
    isAuthenticated: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      department: user.department,
      year: user.year,
      role: user.role,
    },
  });
}
