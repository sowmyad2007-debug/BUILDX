"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Layers,
  TrendingUp,
  SlidersHorizontal,
  Bell,
  Cpu
} from "lucide-react";

export default function DynamicReplanningPage() {
  const [selectedScenario, setSelectedScenario] = useState<string>("VENUE_UNAVAILABLE");
  const [isExecuting, setIsExecuting] = useState(false);
  const [replanResult, setReplanResult] = useState<any>(null);

  const demoScenarios = [
    {
      id: "VENUE_UNAVAILABLE",
      title: "⚡ Sudden Venue Outage: Seminar Hall A Offline",
      desc: "HVAC cooling failure and electrical trip in Seminar Hall A. 2 workshops require instant relocation.",
      badge: "High Impact",
      badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    },
    {
      id: "VOLUNTEER_SHORTAGE",
      title: "👥 Sudden Volunteer Shortage (-6 Members Down)",
      desc: "6 volunteers fall ill. Critical deficit in Registration and A/V support desks.",
      badge: "Medium Impact",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    {
      id: "ATTENDANCE_SURGE",
      title: "📈 Spot Registration Surge (+150 Attendees)",
      desc: "Walk-in participants exceed seminar hall capacity limits for keynote.",
      badge: "High Impact",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      id: "EQUIPMENT_FAILURE",
      title: "🔧 Hardware Breakdown: Projector Surge in Lab 1",
      desc: "Primary laser projector offline. Backup redundancy failover required.",
      badge: "Hardware",
      badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
  ];

  const handleExecuteReplan = async () => {
    setIsExecuting(true);
    try {
      const res = await fetch("/api/replan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: "evt-demo-hackfest-2026",
          scenarioType: selectedScenario,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setReplanResult(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/30">
            Agentic Replanner
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
          Dynamic Replanning & "What-If" Simulation Center
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-3xl">
          Test real-time agentic resilience. Inject sudden campus disruptions (facility outages, hardware failures, volunteer shortages) and observe autonomous 9-step replanning with side-by-side BEFORE vs AFTER deltas.
        </p>
      </div>

      {/* Scenario Selector Panel */}
      <div className="rounded-2xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-amber-400" />
          <span>Select Disruption Scenario to Simulate</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoScenarios.map((sc) => {
            const isSelected = selectedScenario === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`cursor-pointer rounded-xl p-4 border transition flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? "bg-amber-950/20 border-amber-500/60 shadow-lg"
                    : "bg-slate-800/60 border-slate-700/60 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${sc.badgeColor}`}>
                    {sc.badge}
                  </span>
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-amber-400 bg-amber-500" : "border-slate-600"}`}>
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{sc.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{sc.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleExecuteReplan}
            disabled={isExecuting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-amber-600/20 hover:from-amber-500 hover:to-orange-500 transition"
          >
            <RefreshCw className={`h-4 w-4 ${isExecuting ? "animate-spin" : ""}`} />
            <span>{isExecuting ? "Executing 9-Step Replanning..." : "Trigger Autonomous Replanning Pipeline →"}</span>
          </button>
        </div>
      </div>

      {/* Replanning Results Display */}
      {replanResult && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-slate-900 p-6 border border-amber-500/40 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                Replanning Executed (&lt;180ms)
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">{replanResult.scenarioTitle}</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">{replanResult.disruptionDescription}</p>
          </div>

          {/* BEFORE vs AFTER Side-by-Side Comparison Table */}
          <div className="rounded-2xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>BEFORE → AFTER Operational Delta Matrix</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">Judges Explainability View</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3 font-bold">Operational Parameter</th>
                    <th className="py-2.5 px-3 font-bold text-rose-400">BEFORE (Disrupted State)</th>
                    <th className="py-2.5 px-3 font-bold text-emerald-400">AFTER (Replanned State)</th>
                    <th className="py-2.5 px-3 font-bold text-right">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {replanResult.comparisonTable?.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-bold text-slate-300">{row.metric}</td>
                      <td className="py-3 px-3 text-rose-300/90 bg-rose-950/10 font-mono text-[11px]">{row.before}</td>
                      <td className="py-3 px-3 text-emerald-300/90 bg-emerald-950/10 font-mono text-[11px] font-semibold">{row.after}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                          {row.changeType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 9-Step Agent Execution Log */}
          <div className="rounded-2xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-purple-400" />
              <span>Multi-Agent 9-Step Replanning Execution Trace</span>
            </h3>

            <div className="space-y-3">
              {replanResult.stepsExecuted?.map((step: any) => (
                <div
                  key={step.stepNumber}
                  className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/50 flex items-start gap-3 text-xs"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/20 text-xs font-bold text-amber-400 shrink-0 mt-0.5">
                    {step.stepNumber}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{step.agentName}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-amber-400 font-semibold">{step.action}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
