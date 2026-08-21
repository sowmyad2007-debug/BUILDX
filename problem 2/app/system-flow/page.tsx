"use client";

import React from "react";
import {
  Workflow,
  Sparkles,
  ArrowDown,
  Layers,
  Cpu,
  Shield,
  RefreshCw,
  CheckCircle2,
  Database,
  Code2,
  TrendingUp,
  FileCheck2,
  Users
} from "lucide-react";

export default function SystemFlowPage() {
  const steps = [
    { num: "01", name: "User / Organizer", desc: "Inputs free-text natural-language campus event brief.", icon: Users, color: "border-blue-500/40 bg-blue-950/20 text-blue-400" },
    { num: "02", name: "Requirement Analyzer Agent", desc: "Extracts structured parameters, headcounts, venues, hardware, and budgets.", icon: Sparkles, color: "border-indigo-500/40 bg-indigo-950/20 text-indigo-400" },
    { num: "03", name: "Resource & Hardware Planner", desc: "Allocates projectors, PA systems, Wi-Fi 6 mesh, and power strips from stock.", icon: Layers, color: "border-purple-500/40 bg-purple-950/20 text-purple-400" },
    { num: "04", name: "Schedule & Timeline Planner", desc: "Builds multi-track chronological timetable and binds physical venues.", icon: Cpu, color: "border-teal-500/40 bg-teal-950/20 text-teal-400" },
    { num: "05", name: "Deterministic Conflict Engine", desc: "Validates room collisions, seating capacity bounds, and squad overlaps.", icon: Shield, color: "border-rose-500/40 bg-rose-950/20 text-rose-400" },
    { num: "06", name: "Recommendation Engine", desc: "Computes ranked candidate alternative halls, time slots, and substitutions.", icon: Sparkles, color: "border-amber-500/40 bg-amber-950/20 text-amber-400" },
    { num: "07", name: "Human-in-the-Loop Governance", desc: "Mandatory ratifications for budgets, overnight gate passes, and security.", icon: FileCheck2, color: "border-indigo-500/40 bg-indigo-950/20 text-indigo-400" },
    { num: "08", name: "Master Operational Plan", desc: "Finalized schedule, briefings, checklists, and 0–100% readiness score.", icon: CheckCircle2, color: "border-emerald-500/40 bg-emerald-950/20 text-emerald-400" },
    { num: "09", name: "Task Delegation & Checklist", desc: "Distributes actionable tasks across 5 squads with status tracking.", icon: Workflow, color: "border-blue-500/40 bg-blue-950/20 text-blue-400" },
    { num: "10", name: "Real-Time Event Monitoring", desc: "Tracks active checklist verification and live readiness score updates.", icon: TrendingUp, color: "border-teal-500/40 bg-teal-950/20 text-teal-400" },
    { num: "11", name: "Disruption Condition Change", desc: "Captures sudden venue power outages, volunteer illness, or attendee surges.", icon: RefreshCw, color: "border-amber-500/40 bg-amber-950/20 text-amber-400" },
    { num: "12", name: "9-Step Dynamic Replanner", desc: "Simulates failover, recalculates plan, and produces BEFORE vs AFTER delta.", icon: Cpu, color: "border-purple-500/40 bg-purple-950/20 text-purple-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-purple-400 border border-purple-500/30">
            System Architecture
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
          System Flow & Technical Architecture
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-3xl">
          End-to-end multi-agent orchestration pipeline and technical architecture diagram designed for judges and engineering evaluation.
        </p>
      </div>

      {/* Technical Stack Architecture Grid */}
      <div className="rounded-2xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Code2 className="h-5 w-5 text-blue-400" />
          <span>Full-Stack Multi-Tier Architecture</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl bg-slate-800/80 p-4 border border-blue-500/30 space-y-2">
            <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400">
              Presentation Layer
            </span>
            <h4 className="font-bold text-slate-100 text-sm">Next.js 14 & React 18</h4>
            <p className="text-slate-400 leading-relaxed">
              App Router, Tailwind CSS, Lucide Icons, Glassmorphism UI, Responsive Desktop & Mobile layout.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/80 p-4 border border-indigo-500/30 space-y-2">
            <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
              API & Routing Layer
            </span>
            <h4 className="font-bold text-slate-100 text-sm">REST Route Handlers</h4>
            <p className="text-slate-400 leading-relaxed">
              Clean HTTP endpoints with JSON serialization, CORS validation, error barriers, and health checks.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/80 p-4 border border-purple-500/30 space-y-2">
            <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-400">
              AI & Logic Engine
            </span>
            <h4 className="font-bold text-slate-100 text-sm">Multi-Agent Planner</h4>
            <p className="text-slate-400 leading-relaxed">
              Deterministic constraint engine, 9-step dynamic replanning pipeline, and optional Gemini integration.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/80 p-4 border border-teal-500/30 space-y-2">
            <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-400">
              Data & Persistence
            </span>
            <h4 className="font-bold text-slate-100 text-sm">Prisma ORM & PostgreSQL</h4>
            <p className="text-slate-400 leading-relaxed">
              Zero-config SQLite for local development, pre-configured for Neon PostgreSQL cloud deployment.
            </p>
          </div>
        </div>
      </div>

      {/* Visual System Execution Flow */}
      <div className="rounded-2xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Workflow className="h-5 w-5 text-purple-400" />
          <span>Operational Lifecycle Flow (12 Stages)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl p-5 border shadow-lg flex flex-col justify-between space-y-3 ${s.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-black opacity-70">STAGE {s.num}</span>
                  <div className="rounded-lg bg-slate-900/60 p-2">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white">{s.name}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
