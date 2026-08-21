"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Bus,
  Volume2,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight,
  ListTodo,
  FileText,
  Activity,
  SlidersHorizontal,
  Wand2
} from "lucide-react";

export default function OrganizerPlanningPage() {
  const [activeTab, setActiveTab] = useState<"SCHEDULE" | "VENUES" | "EQUIPMENT" | "VOLUNTEERS" | "SECURITY" | "TRANSPORT" | "PERMISSIONS" | "TASKS" | "CONFLICTS" | "READINESS">("SCHEDULE");
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("evt-techfest-2026");
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [readiness, setReadiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, [selectedEventId]);

  const fetchAllData = async () => {
    try {
      const [evtRes, vRes, eqRes, volRes, tskRes, cnfRes, apprRes, readRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/venues"),
        fetch("/api/equipment"),
        fetch("/api/volunteers"),
        fetch("/api/tasks"),
        fetch("/api/conflicts/check"),
        fetch("/api/approvals"),
        fetch(`/api/events/${selectedEventId}/readiness`),
      ]);

      const [evtJson, vJson, eqJson, volJson, tskJson, cnfJson, apprJson, readJson] = await Promise.all([
        evtRes.json(),
        vRes.json(),
        eqRes.json(),
        volRes.json(),
        tskRes.json(),
        cnfRes.json(),
        apprRes.json(),
        readRes.json(),
      ]);

      if (evtJson.success) {
        setEvents(evtJson.data);
        const curr = evtJson.data.find((e: any) => e.id === selectedEventId) || evtJson.data[0];
        setCurrentEvent(curr);
      }
      if (vJson.success) setVenues(vJson.data);
      if (eqJson.success) setEquipment(eqJson.data);
      if (volJson.success) setVolunteers(volJson.data);
      if (tskJson.success) setTasks(tskJson.data);
      if (cnfJson.success) setConflicts(cnfJson.data);
      if (apprJson.success) setApprovals(apprJson.data);
      if (readJson.success) setReadiness(readJson.readiness);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !currentEvent) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  const tabs = [
    { id: "SCHEDULE", label: "Master Schedule", icon: Clock },
    { id: "VENUES", label: "Venues", icon: MapPin },
    { id: "EQUIPMENT", label: "Equipment", icon: Layers },
    { id: "VOLUNTEERS", label: "Volunteers", icon: Users },
    { id: "SECURITY", label: "Security", icon: ShieldCheck },
    { id: "TRANSPORT", label: "Transport", icon: Bus },
    { id: "PERMISSIONS", label: "Permissions", icon: Lock },
    { id: "TASKS", label: "Tasks & Deadlines", icon: ListTodo },
    { id: "CONFLICTS", label: `Conflicts (${conflicts.length})`, icon: AlertTriangle, highlight: conflicts.length > 0 },
    { id: "READINESS", label: "Readiness (84%)", icon: Activity },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Event Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-purple-400 border border-purple-500/30">
              Organizer Operations Suite
            </span>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
              Multi-Agent Operational Plan
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Event Planning & Coordination Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time multi-dimensional resource allocation, constraint checking, and squad coordination.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            aria-label="Select Campus Event"
            className="rounded-xl bg-slate-800 px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer font-bold"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.name} ({e.category || e.type})</option>
            ))}
          </select>

          <Link
            href="/replan"
            className="flex items-center gap-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 px-4 py-2.5 text-xs font-bold text-white transition shadow"
          >
            <Zap className="h-4 w-4" />
            <span>Simulate Disruption</span>
          </Link>
        </div>
      </div>

      {/* Event Overview Summary Banner */}
      <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="rounded-md bg-purple-600 px-2.5 py-0.5 text-[10px] font-black text-white">
            {currentEvent.type}
          </span>
          <h2 className="text-xl font-bold text-white">{currentEvent.name}</h2>
          <p className="text-xs text-slate-400 max-w-2xl">{currentEvent.description}</p>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 shrink-0">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Event Readiness</p>
            <p className="text-2xl font-black text-emerald-400">{readiness?.overallScore || 84}%</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Active Conflicts</p>
            <p className={`text-2xl font-black ${conflicts.length > 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {conflicts.length}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Registered</p>
            <p className="text-2xl font-black text-blue-400">{currentEvent.registeredCount || 0} / {currentEvent.capacity || 500}</p>
          </div>
        </div>
      </div>

      {/* Coordination Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? "bg-purple-600 text-white shadow"
                  : tab.highlight
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-xl space-y-6">
        {/* 1. Schedule Tab */}
        {activeTab === "SCHEDULE" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              <span>Chronological Timetable & Activity Bindings</span>
            </h3>

            <div className="relative border-l border-slate-800 ml-4 space-y-6 pt-2">
              {currentEvent.schedule && currentEvent.schedule.map((item: any, idx: number) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-purple-500 ring-4 ring-slate-950" />
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">{item.activity}</p>
                    <span className="text-[11px] font-mono text-purple-400">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">🏛️ {item.venue} {item.speakerOrLead && `• Lead: ${item.speakerOrLead}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Venues Tab */}
        {activeTab === "VENUES" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>Allocated Campus Venues & Facility Capacity</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venues.map((v) => (
                <div key={v.id} className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-white">{v.name}</h4>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">{v.code}</span>
                  </div>
                  <p className="text-xs text-slate-400">{v.location}</p>
                  <div className="flex justify-between text-xs pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Capacity: <b className="text-white">{v.capacity} pax</b></span>
                    <span className="text-emerald-400 font-bold">{v.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Equipment Tab */}
        {activeTab === "EQUIPMENT" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              <span>Hardware & Equipment Inventory Matrix</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Item Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Total Stock</th>
                    <th className="px-4 py-3">Available</th>
                    <th className="px-4 py-3">Storage Location</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {equipment.map((eq) => (
                    <tr key={eq.id}>
                      <td className="px-4 py-3 font-bold text-white">{eq.name}</td>
                      <td className="px-4 py-3 text-slate-400">{eq.category}</td>
                      <td className="px-4 py-3 text-white font-mono">{eq.totalQuantity}</td>
                      <td className="px-4 py-3 text-emerald-400 font-mono font-bold">{eq.availableQuantity}</td>
                      <td className="px-4 py-3 text-slate-400">{eq.storageLocation}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          {eq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Volunteers Tab */}
        {activeTab === "VOLUNTEERS" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-teal-400" />
              <span>Volunteer Squad Coordination Roster (20 Active Students)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {volunteers.map((vol) => (
                <div key={vol.id} className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <p className="font-bold text-white">{vol.name}</p>
                    <span className="text-[10px] font-mono text-teal-400">{vol.studentId}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{vol.department} • {vol.role}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {vol.skills.map((s: string, idx: number) => (
                      <span key={idx} className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-300">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Security Tab */}
        {activeTab === "SECURITY" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Campus Security & Crowd Protocol</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                <p className="font-bold text-white">Guards & Entry Gates</p>
                <p className="text-slate-400">Guards Assigned: <b className="text-white">8 Guards on Shift</b></p>
                <p className="text-slate-400">Permitted Entry Gates: <b className="text-white">Gate 1 & Gate 3</b></p>
              </div>
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                <p className="font-bold text-white">Medical & Emergency Action Plan</p>
                <p className="text-slate-400">{currentEvent.securityRequirements?.emergencyPlan || "Paramedic station stationed in Block A Ground Floor."}</p>
              </div>
            </div>
          </div>
        )}

        {/* 6. Transport Tab */}
        {activeTab === "TRANSPORT" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bus className="h-4 w-4 text-blue-400" />
              <span>Campus Shuttle & Transport Fleet Plan</span>
            </h3>
            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2 text-xs">
              <p className="text-slate-300">Vehicles Allocated: <b className="text-white">3 Shuttle Vans</b></p>
              <p className="text-slate-300">Pickup Points: <b className="text-white">University Metro Station Gate 2</b></p>
              <p className="text-slate-300">Drop Points: <b className="text-white">Main Auditorium Porch</b></p>
              <p className="text-slate-300">Operating Hours: <b className="text-white">07:30 AM - 10:30 AM & 05:00 PM - 07:00 PM</b></p>
            </div>
          </div>
        )}

        {/* 7. Permissions Tab */}
        {activeTab === "PERMISSIONS" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-400" />
              <span>Administrative Clearances & Approvals</span>
            </h3>
            <div className="space-y-2">
              {approvals.map((appr) => (
                <div key={appr.id} className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-white">{appr.title}</p>
                    <p className="text-slate-400">{appr.reason}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    appr.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {appr.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. Tasks Tab */}
        {activeTab === "TASKS" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-teal-400" />
              <span>Delegated Squad Tasks & Deadlines</span>
            </h3>
            <div className="space-y-2">
              {tasks.map((tsk) => (
                <div key={tsk.id} className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{tsk.title}</p>
                    <p className="text-slate-400">{tsk.assignedSquad} • Assigned to: {tsk.assignedTo}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    tsk.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {tsk.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. Conflicts Tab */}
        {activeTab === "CONFLICTS" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Physical Constraint & Collision Engine</span>
            </h3>
            {conflicts.length === 0 ? (
              <div className="rounded-xl bg-emerald-500/10 p-6 text-center text-xs text-emerald-400 border border-emerald-500/20">
                ✅ Zero constraint collisions detected. All venue, schedule, and hardware allocations verified.
              </div>
            ) : (
              <div className="space-y-3">
                {conflicts.map((cnf) => (
                  <div key={cnf.id} className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/30 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-amber-400">
                      <span>⚠️ {cnf.title}</span>
                      <span className="text-[10px] uppercase font-mono">{cnf.category}</span>
                    </div>
                    <p className="text-slate-300">{cnf.description}</p>
                    <Link
                      href="/conflicts"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition"
                    >
                      <span>Resolve in Conflict Center</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 10. Readiness Tab */}
        {activeTab === "READINESS" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Calculated Event Readiness Index ({readiness?.overallScore || 84}%)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <p className="text-slate-400">Venue Score (20%)</p>
                <p className="text-xl font-bold text-emerald-400">{readiness?.venueScore || 90}%</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <p className="text-slate-400">Equipment Score (15%)</p>
                <p className="text-xl font-bold text-blue-400">{readiness?.equipmentScore || 95}%</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <p className="text-slate-400">Volunteers (15%)</p>
                <p className="text-xl font-bold text-teal-400">{readiness?.volunteerScore || 92}%</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <p className="text-slate-400">Tasks Execution (20%)</p>
                <p className="text-xl font-bold text-purple-400">{readiness?.taskScore || 80}%</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <p className="text-slate-400">Checklist Verified (15%)</p>
                <p className="text-xl font-bold text-amber-400">{readiness?.checklistScore || 78}%</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <p className="text-slate-400">Approvals Ratified (15%)</p>
                <p className="text-xl font-bold text-emerald-400">{readiness?.approvalScore || 85}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
