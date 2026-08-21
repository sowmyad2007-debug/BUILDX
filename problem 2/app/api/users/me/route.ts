import { NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export async function GET() {
  const user = db.currentUser || Array.from(db.users.values())[0];
  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
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
