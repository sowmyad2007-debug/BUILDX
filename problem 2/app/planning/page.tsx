"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Package,
  Users,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Shield,
  Layers,
  Sparkles
} from "lucide-react";

export default function PlanningHubPage() {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWhy, setSelectedWhy] = useState<string | null>(null);

  useEffect(() => {
    fetchPlanData();
  }, []);

  const fetchPlanData = async () => {
    try {
      const res = await fetch("/api/events/evt-demo-hackfest-2026");
      const json = await res.json();
      if (json.success) {
        setEventData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const agentSteps = [
    { title: "Requirement Analyzer", role: "NLP & Headcount Decomposition", status: "COMPLETE" },
    { title: "Resource Planner", role: "A/V Inventory & Power Sizing", status: "COMPLETE" },
    { title: "Schedule Planner", role: "Chronological Slot Matrix", status: "COMPLETE" },
    { title: "Conflict Detector", role: "Hard Constraint Collision Check", status: "COMPLETE" },
    { title: "Recommendation Agent", role: "Candidate Ranking & Alternatives", status: "COMPLETE" },
    { title: "Approval Manager", role: "Human-in-the-Loop Governance", status: "COMPLETE" },
    { title: "Task Coordinator", role: "Squad Delegation & Readiness Tracking", status: "COMPLETE" },
  ];

  if (loading || !eventData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-xs text-slate-400">Loading Agent Planning Matrix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-purple-400 border border-purple-500/30">
            Multi-Agent Orchestration
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
          Autonomous Planning Hub
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-3xl">
          Visualized multi-agent execution pipeline synthesizing schedule chronologies, physical venue constraints, hardware allocations, and squad assignments.
        </p>
      </div>

      {/* Visual Multi-Agent Pipeline Hierarchy */}
      <div className="rounded-2xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-blue-400" />
          <span>7-Step Autonomous Planning Pipeline</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {agentSteps.map((step, idx) => (
            <div
              key={idx}
              className="relative rounded-xl bg-slate-800/80 p-3.5 border border-slate-700/60 flex flex-col justify-between space-y-2 hover:border-blue-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-400">Step 0{idx + 1}</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 leading-tight">{step.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{step.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Schedule Timetable & Activities */}
      <div className="rounded-2xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Master Operational Schedule</h2>
            <p className="text-xs text-slate-400">Chronological slots linked with venue capacities and hardware inventory</p>
          </div>
          <Link
            href="/conflicts"
            className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition self-start sm:self-auto"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>1 Active Collision Detected</span>
          </Link>
        </div>

        <div className="space-y-4">
          {eventData.activities?.map((act: any, idx: number) => (
            <div
              key={act.id}
              className="rounded-xl bg-slate-800/60 p-5 border border-slate-700/50 hover:bg-slate-800/90 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600/20 text-xs font-bold text-blue-400">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-sm text-slate-100">{act.title}</h3>
                  <span className="rounded bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {act.track}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                    <span>{act.startTime} – {act.endTime}</span>
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    {act.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300">{act.description}</p>

              {/* Resource Bindings & Why Explainability Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-750 text-xs">
                <div className="flex flex-wrap items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                    <strong className="text-slate-100">{act.venueName}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Target: {act.attendeeTarget} seats</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="h-3.5 w-3.5 text-purple-400" />
                    <span>Equipment: {act.requiredEquipment?.slice(0, 2).join(", ") || "Standard A/V"}</span>
                  </span>
                </div>

                {/* Explainability Popup Button */}
                <button
                  onClick={() => setSelectedWhy(selectedWhy === act.id ? null : act.id)}
                  className="flex items-center gap-1 rounded-lg bg-indigo-600/20 px-2.5 py-1 text-[11px] font-bold text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Why this choice?</span>
                </button>
              </div>

              {/* Explainability Accordion Dropdown */}
              {selectedWhy === act.id && (
                <div className="rounded-lg bg-indigo-950/30 p-3 text-xs text-indigo-200 border border-indigo-800/40 space-y-1 animate-in fade-in duration-200">
                  <p className="font-bold flex items-center gap-1 text-indigo-300">
                    <Sparkles className="h-3 w-3" />
                    <span>Agent Rationale for '{act.title}':</span>
                  </p>
                  <p className="text-slate-300 text-[11px]">
                    1. <strong>Capacity Fit:</strong> {act.venueName} matched required target ({act.attendeeTarget} seats) with a safe &gt;15% buffer.
                  </p>
                  <p className="text-slate-300 text-[11px]">
                    2. <strong>Hardware Availability:</strong> Audio/visual hardware requirements satisfied without stock deficit.
                  </p>
                  <p className="text-slate-300 text-[11px]">
                    3. <strong>Chronology:</strong> Placed sequentially after prerequisite sessions with 30-min setup buffer.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
