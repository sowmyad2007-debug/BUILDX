"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Search,
  Phone,
  Mail,
  Shield,
  Layers,
  Sparkles,
  Calendar
} from "lucide-react";

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const res = await fetch("/api/volunteers");
      const json = await res.json();
      if (json.success) {
        setVolunteers(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const squads = [
    { name: "Technical Support Squad", count: 5, lead: "Aarav Sharma", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { name: "QR Registration Squad", count: 4, lead: "Diya Patel", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { name: "Guest & VIP Hospitality", count: 4, lead: "Ananya Iyer", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { name: "Security & Logistics Squad", count: 4, lead: "Vikram Malhotra", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { name: "General Floater Squad", count: 3, lead: "Karan Johar", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  ];

  const filtered = volunteers.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.skills.some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesDept = selectedDept === "ALL" || v.department.toLowerCase() === selectedDept.toLowerCase();
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-teal-400 border border-teal-500/30">
              Workforce Coordination
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Volunteer Squads & Rosters
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl">
            20 student volunteers organized across 5 specialized squads with balanced workloads and zero double-booked shifts.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search volunteer name or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500 w-56"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            aria-label="Filter Volunteers by Department"
            className="rounded-xl bg-slate-900 px-3 py-2 text-xs text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Tech">Information Tech</option>
            <option value="Electronics Engg">Electronics Engg</option>
            <option value="Mechanical Engg">Mechanical Engg</option>
          </select>
        </div>
      </div>

      {/* Squad Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {squads.map((sq, idx) => (
          <div key={idx} className="rounded-xl bg-slate-900/90 p-4 border border-slate-800 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${sq.color}`}>
                {sq.count} Members
              </span>
              <Users className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100 leading-snug">{sq.name}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Lead: {sq.lead}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Volunteers Roster Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((vol) => (
            <div
              key={vol.id}
              className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 hover:border-teal-500/50 transition flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700">
                    {vol.department}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    {vol.availability}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{vol.name}</h3>
                  <p className="text-xs font-medium text-teal-400 mt-0.5">{vol.role}</p>
                </div>

                <div className="space-y-1 text-[11px] text-slate-400">
                  <p className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-slate-500" />
                    <span>{vol.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-slate-500" />
                    <span>{vol.phone}</span>
                  </p>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                <span className="text-[10px] font-semibold text-slate-400">Tagged Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {vol.skills?.map((skill: string, idx: number) => (
                    <span key={idx} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
