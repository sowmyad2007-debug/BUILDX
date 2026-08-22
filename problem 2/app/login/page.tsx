"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin, user } = useAuth();
  const [email, setEmail] = useState("rahul.d@campus.edu");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (json.success && json.user) {
        login(json.user);
        if (json.user.role === "ORGANIZER") {
          router.push("/organizer/planning");
        } else if (json.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(json.error || "Invalid login credentials.");
      }
    } catch (err: any) {
      setError(err.message || "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleFastDemoLogin = async (demoRole: "STUDENT" | "ORGANIZER" | "ADMIN") => {
    setLoading(true);
    setError("");

    try {
      await demoLogin(demoRole);
      if (demoRole === "ORGANIZER") {
        router.push("/organizer/planning");
      } else if (demoRole === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Campus Flow Authentication</span>
          </div>
          <h1 className="text-2xl font-black text-white">Sign In to Campus Flow</h1>
          <p className="text-xs text-slate-400">
            Access your student registrations or organizer event planning dashboard.
          </p>
        </div>

        {/* 1-Click Fast Demo Login Buttons */}
        <div className="rounded-2xl bg-slate-900/90 p-4 border border-slate-800 space-y-2.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            ⚡ 1-Click Hackathon Demo Logins
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleFastDemoLogin("STUDENT")}
              disabled={loading}
              className="rounded-xl bg-blue-600/20 hover:bg-blue-600/30 p-2.5 text-center border border-blue-500/30 transition text-blue-400 font-bold text-xs"
            >
              🎓 Student
            </button>
            <button
              onClick={() => handleFastDemoLogin("ORGANIZER")}
              disabled={loading}
              className="rounded-xl bg-purple-600/20 hover:bg-purple-600/30 p-2.5 text-center border border-purple-500/30 transition text-purple-300 font-bold text-xs"
            >
              🧭 Organizer
            </button>
            <button
              onClick={() => handleFastDemoLogin("ADMIN")}
              disabled={loading}
              className="rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 p-2.5 text-center border border-emerald-500/30 transition text-emerald-400 font-bold text-xs"
            >
              🛡️ Admin
            </button>
          </div>
          <p className="text-[10px] text-slate-500 text-center">
            Pre-loaded with sample passes, permissions, and planning credentials.
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-2xl space-y-4">
          {error && (
            <div className="rounded-xl bg-rose-500/10 p-3 text-xs text-rose-400 border border-rose-500/30">
              {error}
            </div>
          )}

          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-400">Campus Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul.d@campus.edu"
                className="w-full rounded-xl bg-slate-800 pl-9 pr-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-400">Password</label>
              <span className="text-[11px] text-blue-400 hover:underline cursor-pointer">Forgot?</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-800 pl-9 pr-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 text-xs font-bold text-white shadow-lg hover:from-blue-500 hover:to-indigo-500 transition active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Sign In to Portal</span>
              </>
            )}
          </button>

          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-blue-400 hover:underline">
              Create student account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
