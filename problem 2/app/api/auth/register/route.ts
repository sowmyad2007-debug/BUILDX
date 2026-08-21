import { NextRequest, NextResponse } from "next/server";
import { db, UserRecord } from "@/lib/database/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, studentId, phone, department, year, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    // Check existing
    const existing = Array.from(db.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      name,
      studentId: studentId || `STU-${Date.now().toString().slice(-6)}`,
      email: email.toLowerCase(),
      phone: phone || "",
      department: department || "Computer Science",
      year: year || "1st Year",
      role: (role || "STUDENT") as "STUDENT" | "ORGANIZER" | "ADMIN",
      password,
      createdAt: new Date().toISOString(),
    };

    db.users.set(newUser.id, newUser);
    db.currentUser = newUser;

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        studentId: newUser.studentId,
        department: newUser.department,
        year: newUser.year,
        role: newUser.role,
      },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
