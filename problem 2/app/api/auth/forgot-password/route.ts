import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Campus email is required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = Array.from(db.users.values()).find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "No account found with this campus email. Please check the address or sign up.",
        },
        { status: 404 }
      );
    }

    // Step 2: OTP and Password Reset execution
    if (otp && newPassword) {
      if (otp !== "894102" && otp.length !== 6) {
        return NextResponse.json(
          { success: false, error: "Invalid OTP code. Please enter the 6-digit code sent to your email (e.g. 894102)." },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      // Update password in database
      user.password = newPassword;
      db.users.set(user.id, user);

      return NextResponse.json({
        success: true,
        message: "Your password has been successfully reset! You can now log in with your new password.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // Step 1: Send simulated OTP code
    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${trimmedEmail}. Use OTP code: 894102 for instant verification.`,
      simulatedOtp: "894102",
      email: trimmedEmail,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process forgot password request." },
      { status: 500 }
    );
  }
}
