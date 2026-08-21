"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, BookOpen, GraduationCap, ArrowRight, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
    department: "Computer Science",
    year: "1st Year",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (json.success) {
        router.push("/dashboard");
      } else {
        setError(json.error || "Registration failed.");
      }
    } catch (err: any) {
      setError(err.message || "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Student Onboarding</span>
          </div>
          <h1 className="text-2xl font-black text-white">Create Student Account</h1>
          <p className="text-xs text-slate-400">
            Register to join hackathons, tech fests, coding sprints, and campus workshops.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-2xl space-y-4">
          {error && (
            <div className="rounded-xl bg-rose-500/10 p-3 text-xs text-rose-400 border border-rose-500/30">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-400">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Diya Patel"
                className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-400">Student ID Number *</label>
              <input
                type="text"
                required
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                placeholder="e.g. STU-2024-CS102"
                className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-400">University Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="student@campus.edu"
                className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-400">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 00000"
                className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-400">Academic Department</label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                aria-label="Academic Department"
                className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Management Studies">Management Studies</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-400">Year of Study</label>
              <select
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                aria-label="Year of Study"
                className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-400">Password *</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-400">Confirm Password *</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-black text-white shadow-lg hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-50 mt-2"
          >
            <span>{loading ? "Creating Account..." : "Complete Registration"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
