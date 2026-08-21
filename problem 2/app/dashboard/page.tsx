"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Tag,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
  ArrowRight,
  Trash2,
  Bell,
  User,
  ShieldCheck,
  Zap,
  Activity,
  Layers
} from "lucide-react";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Get current user
      const userRes = await fetch("/api/users/me");
      const userJson = await userRes.json();
      if (userJson.success) {
        setCurrentUser(userJson.user);
      }

      // 2. Get registrations
      const regRes = await fetch("/api/registrations");
      const regJson = await regRes.json();
      if (regJson.success) {
        setRegistrations(regJson.data);
      }

      // 3. Get notifications
      const notifRes = await fetch("/api/notifications");
      const notifJson = await notifRes.json();
      if (notifJson.success) {
        setNotifications(notifJson.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this event registration?")) return;
    setCancellingId(id);

    try {
      const res = await fetch(`/api/registrations/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setRegistrations(registrations.filter((r) => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  const user = currentUser || {
    name: "Rahul Deshmukh",
    studentId: "STU-2023-CS042",
    department: "Computer Science",
    year: "3rd Year",
    email: "rahul.d@campus.edu",
    role: "STUDENT",
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Student Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/30">
              Student Participant Hub
            </span>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
              {user.department} • {user.year}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-xs text-slate-400">
            Track your registered passes, campus event schedules, notifications, and workshop credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/events"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition shadow"
          >
            <Sparkles className="h-4 w-4" />
            <span>Browse More Events</span>
          </Link>
          <Link
            href="/organizer/planning"
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 transition border border-slate-700"
          >
            <Layers className="h-4 w-4 text-purple-400" />
            <span>Organizer Studio</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 space-y-1 shadow">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Events</p>
          <p className="text-2xl font-black text-white">{registrations.length}</p>
          <p className="text-[10px] text-emerald-400">● Active Digital Passes</p>
        </div>

        <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 space-y-1 shadow">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Student ID</p>
          <p className="text-base sm:text-lg font-bold text-blue-400 font-mono truncate">{user.studentId}</p>
          <p className="text-[10px] text-slate-400">Verified Campus Profile</p>
        </div>

        <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 space-y-1 shadow">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unread Alerts</p>
          <p className="text-2xl font-black text-amber-400">{notifications.length}</p>
          <p className="text-[10px] text-slate-400">Campus broadcasts & reminders</p>
        </div>

        <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 space-y-1 shadow">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role Access</p>
          <p className="text-base sm:text-lg font-bold text-purple-400">{user.role}</p>
          <p className="text-[10px] text-slate-400">Full Participant Permissions</p>
        </div>
      </div>

      {/* Main Section: My Registrations Table */}
      <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <QrCode className="h-4 w-4 text-blue-400" />
              <span>My Registrations & Digital Event Passes</span>
            </h2>
            <p className="text-xs text-slate-400">Present your unique Registration ID at the venue entrance scanner.</p>
          </div>
          <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-400 border border-blue-500/20">
            {registrations.length} Passes
          </span>
        </div>

        {registrations.length === 0 ? (
          <div className="rounded-xl bg-slate-950 p-8 text-center space-y-3 border border-slate-800">
            <p className="text-xs text-slate-400">You haven't registered for any events yet.</p>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition"
            >
              <span>Explore 9 Campus Events</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Event Name</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Registration ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3.5 font-bold text-white">
                      <Link href={`/events/${reg.eventId}`} className="hover:text-blue-400 transition">
                        {reg.eventName}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">
                      <div>{reg.eventDate}</div>
                      <div className="text-[10px] text-slate-500">{reg.eventTime}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 truncate max-w-[150px]">
                      {reg.eventVenue}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-emerald-400">
                      {reg.priceFormatted || (reg.pricePaid === 0 ? "Free" : `₹${reg.pricePaid}`)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {reg.registrationId}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Confirmed ({reg.paymentStatus})</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleCancelRegistration(reg.id)}
                        disabled={cancellingId === reg.id}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Cancel Registration"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notifications & Announcements Feed */}
      <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-400" />
          <span>Recent Campus Event Notifications</span>
        </h2>

        <div className="space-y-3">
          {notifications.slice(0, 4).map((n) => (
            <div key={n.id} className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-blue-500/20 p-1.5 text-blue-400">
                <Bell className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">{n.title}</p>
                <p className="text-xs text-slate-400">{n.message}</p>
                <p className="text-[10px] text-slate-500">{new Date(n.createdAt).toLocaleTimeString()} • Broadcast</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
