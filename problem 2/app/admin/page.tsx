"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  AlertTriangle,
  Lock,
  Activity,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Layers
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
              Campus Executive Administration
            </span>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
              Dean & Logistics Oversight
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Campus Flow Executive Control Center
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time aggregate campus event metrics, registration revenue in ₹, venue occupancy, and governance approvals.
          </p>
        </div>

        <Link
          href="/organizer/planning"
          className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2.5 text-xs font-bold text-white transition shadow self-start sm:self-auto"
        >
          <Layers className="h-4 w-4" />
          <span>Operational Planner</span>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800 space-y-1 shadow">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Campus Events</p>
          <p className="text-3xl font-black text-white">{stats.totalEvents}</p>
          <p className="text-[11px] text-blue-400 font-semibold">9 Flagship Programs</p>
        </div>

        <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800 space-y-1 shadow">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Registrations</p>
          <p className="text-3xl font-black text-emerald-400">{stats.totalRegistrations.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">Verified Student Attendees</p>
        </div>

        <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800 space-y-1 shadow">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Revenue (INR)</p>
          <p className="text-3xl font-black text-white">{stats.totalRevenueFormatted}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">Passes & Ticket Inflow</p>
        </div>

        <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800 space-y-1 shadow">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Conflicts</p>
          <p className={`text-3xl font-black ${stats.activeConflictsCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {stats.activeConflictsCount}
          </p>
          <p className="text-[11px] text-slate-400">{stats.pendingApprovalsCount} Approvals Pending</p>
        </div>
      </div>

      {/* Registrations By Event Table */}
      <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-400" />
          <span>Campus Event Popularity & Seat Utilization (9 Events)</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Event Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Ticket Price</th>
                <th className="px-4 py-3">Registrations</th>
                <th className="px-4 py-3">Occupancy %</th>
                <th className="px-4 py-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {stats.registrationsByEvent.map((evt: any) => {
                const percent = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));
                return (
                  <tr key={evt.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3.5 font-bold text-white">
                      <Link href={`/events/${evt.id}`} className="hover:text-blue-400 transition">
                        {evt.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400">{evt.category}</td>
                    <td className="px-4 py-3.5 font-semibold text-emerald-400">
                      {evt.price === 0 ? "Free" : `₹${evt.price}`}
                    </td>
                    <td className="px-4 py-3.5 text-slate-200">
                      {evt.registeredCount} / {evt.capacity} pax
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${percent > 80 ? "bg-emerald-500" : "bg-blue-500"}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-slate-300">{percent}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-white">
                      ₹{evt.revenue.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Venue Utilization Matrix */}
      <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <MapPin className="h-4 w-4 text-purple-400" />
          <span>Facility & Venue Utilization Index</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stats.venueUtilization.map((v: any, idx: number) => (
            <div key={idx} className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <p className="font-bold text-white">{v.name}</p>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">{v.code}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Capacity: {v.capacity} pax</span>
                <span className={v.status === "OFFLINE" ? "text-rose-400 font-bold" : "text-emerald-400"}>{v.status}</span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Occupancy Load</span>
                  <span className="text-slate-300 font-semibold">{v.occupancyRate}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500" style={{ width: `${v.occupancyRate}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
