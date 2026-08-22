import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, demoRole } = body;

    // Demo Role Fast Login
    if (demoRole) {
      let targetUser = Array.from(db.users.values()).find((u) => u.role === demoRole);
      if (!targetUser) {
        targetUser = {
          id: `usr-demo-${demoRole.toLowerCase()}`,
          name: demoRole === "STUDENT" ? "Rahul Deshmukh (Student)" : demoRole === "ORGANIZER" ? "Prof. Arvind Swaminathan (Lead Organizer)" : "Campus Event Dean (Admin)",
          email: `${demoRole.toLowerCase()}@campus.edu`,
          role: demoRole,
          department: "Computer Science",
          studentId: "STU-2023-CS042",
          year: "3rd Year",
          createdAt: new Date().toISOString(),
        };
        db.users.set(targetUser.id, targetUser);
      }
      db.currentUser = targetUser;
      return NextResponse.json({
        success: true,
        message: `Logged in as ${targetUser.name} (${targetUser.role})`,
        user: targetUser,
      });
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = Array.from(db.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return NextResponse.json(
        { success: false, error: "No user found with this email address. Please check your email or register." },
        { status: 401 }
      );
    }

    if (user.password && user.password !== password) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Incorrect password! If you don't remember your password, please click 'Reset Password' to recover your account." 
        },
        { status: 401 }
      );
    }

    db.currentUser = user;

    return NextResponse.json({
      success: true,
      message: "Login successful.",
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
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
