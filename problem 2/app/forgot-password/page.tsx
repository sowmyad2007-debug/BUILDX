"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  KeyRound, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Lock,
  ArrowLeft,
  RefreshCw
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your campus email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage(json.message);
        setOtp(json.simulatedOtp || "894102");
        setStep(2);
      } else {
        setError(json.error || "Failed to send reset email.");
      }
    } catch {
      setError("Network connection issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the 6-digit verification code.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-type your password.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setResetSuccess(true);
        setMessage(json.message);
      } else {
        setError(json.error || "Password reset failed.");
      }
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md">
              <KeyRound className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">CAMPUS<span className="text-blue-500">FLOW</span></span>
          </Link>
          <h1 className="text-xl font-bold text-white">Reset Account Password</h1>
          <p className="text-xs text-slate-400">
            {step === 1 
              ? "Enter your registered campus email to receive a recovery verification code." 
              : "Verify your OTP and create a secure new password."}
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-rose-500/10 p-3.5 border border-rose-500/20 text-xs text-rose-400">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-500/10 p-3.5 border border-emerald-500/20 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {/* Reset Success State */}
        {resetSuccess ? (
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-800 text-center space-y-5 shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Password Updated Successfully!</h3>
              <p className="text-xs text-slate-400">
                You can now log in to your account with your newly created password.
              </p>
            </div>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full rounded-2xl bg-blue-600 hover:bg-blue-500 p-3.5 text-xs font-bold text-white transition shadow-lg shadow-blue-500/20"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-800 space-y-5 shadow-xl">
            {step === 1 ? (
              /* Step 1 Form */
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Campus Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul.d@campus.edu"
                      required
                      className="w-full rounded-2xl bg-slate-950 pl-10 pr-4 py-3 text-xs text-white border border-slate-700 focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Quick Auto-Fill Buttons for Demo Accounts */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-bold text-slate-400">⚡ Fast 1-Click Email Autofill:</p>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setEmail("rahul.d@campus.edu")}
                      className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-slate-300 border border-slate-700 transition"
                    >
                      🎓 rahul.d@campus.edu (Student)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmail("arvind.s@campus.edu")}
                      className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-purple-300 border border-slate-700 transition"
                    >
                      🧭 arvind.s@campus.edu (Organizer)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full rounded-2xl bg-blue-600 hover:bg-blue-500 p-3.5 text-xs font-bold text-white transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Recovery OTP</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2 Form */
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">6-Digit Verification Code (OTP)</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="894102"
                      maxLength={6}
                      required
                      className="w-full rounded-2xl bg-slate-950 pl-10 pr-4 py-3 font-mono text-sm tracking-widest text-blue-400 border border-slate-700 focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                  <p className="text-[10px] text-emerald-400">
                    💡 Simulated test OTP code is <strong>894102</strong>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      className="w-full rounded-2xl bg-slate-950 pl-10 pr-4 py-3 text-xs text-white border border-slate-700 focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      required
                      className="w-full rounded-2xl bg-slate-950 pl-10 pr-4 py-3 text-xs text-white border border-slate-700 focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-2xl bg-slate-800 hover:bg-slate-700 px-4 py-3.5 text-xs font-bold text-slate-300 border border-slate-700 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 p-3.5 text-xs font-bold text-white transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>Update Password</span>
                        <ShieldCheck className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="border-t border-slate-800 pt-4 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Remember your password? Back to Sign In</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
