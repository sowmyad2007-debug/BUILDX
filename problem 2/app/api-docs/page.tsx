"use client";

import React, { useState } from "react";
import {
  Code2,
  Play,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Layers,
  Send
} from "lucide-react";

export default function ApiDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState<string>("/api/health");
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const endpoints = [
    { method: "GET", path: "/api/health", desc: "System health status and AI provider information." },
    { method: "GET", path: "/api/events", desc: "List all created campus events with readiness scores." },
    { method: "GET", path: "/api/events/evt-demo-hackfest-2026", desc: "Retrieve full event dossier including activities, tasks, and conflicts." },
    { method: "GET", path: "/api/conflicts/check", desc: "Run real-time multi-dimensional constraint collision detector." },
    { method: "GET", path: "/api/venues", desc: "Query campus venues, capacities, and suitability scores." },
    { method: "GET", path: "/api/equipment", desc: "Retrieve hardware inventory levels and deficit flags." },
    { method: "GET", path: "/api/volunteers", desc: "List student volunteers, skills, and squad allocations." },
    { method: "GET", path: "/api/tasks", desc: "Fetch delegated squad tasks with priorities and deadlines." },
    { method: "GET", path: "/api/checklists", desc: "Retrieve event readiness checklist categorized by domain." },
    { method: "GET", path: "/api/approvals", desc: "List pending human-in-the-loop governance sign-offs." },
    { method: "GET", path: "/api/notifications", desc: "Live multi-agent alert notification feed." },
    { method: "GET", path: "/api/briefings", desc: "Stakeholder briefing dossiers for security, tech, and volunteers." },
    { method: "POST", path: "/api/demo/seed", desc: "Reset and seed in-memory database with comprehensive demo dataset." },
  ];

  const handleTestEndpoint = async (path: string, method: string) => {
    setActiveEndpoint(path);
    setIsLoading(true);
    setResponseJson(null);
    try {
      const res = await fetch(path, { method });
      const json = await res.json();
      setResponseJson(JSON.stringify(json, null, 2));
    } catch (e: any) {
      setResponseJson(JSON.stringify({ error: e.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/30">
            Developer Documentation
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
          REST API Reference & Interactive Playground
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-3xl">
          Every frontend feature communicates directly with real Next.js REST API route handlers. Test any endpoint live directly in this playground.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoints List */}
        <div className="lg:col-span-6 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Available REST Endpoints ({endpoints.length})
          </h2>
          <div className="space-y-2">
            {endpoints.map((ep, idx) => {
              const isSelected = activeEndpoint === ep.path;
              return (
                <div
                  key={idx}
                  onClick={() => handleTestEndpoint(ep.path, ep.method)}
                  className={`cursor-pointer rounded-xl p-3.5 border transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-blue-950/30 border-blue-500/50 shadow-md"
                      : "bg-slate-900/80 border-slate-800 hover:bg-slate-800/80"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                          ep.method === "GET"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-100">{ep.path}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{ep.desc}</p>
                  </div>

                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white transition shrink-0"
                    title="Send Request"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Response Viewer */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/95 p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5 text-emerald-400" />
                <span>Live Response Inspector</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">{activeEndpoint}</span>
            </div>

            <div className="relative">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                </div>
              ) : responseJson ? (
                <pre className="max-h-[500px] overflow-y-auto rounded-xl bg-slate-950 p-4 font-mono text-[11px] text-emerald-400 border border-slate-800/80 leading-relaxed">
                  {responseJson}
                </pre>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center text-center text-xs text-slate-500 space-y-2">
                  <Code2 className="h-8 w-8 text-slate-600" />
                  <p>Click any endpoint on the left to execute a live API request.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Status: 200 OK</span>
            <span>Content-Type: application/json</span>
          </div>
        </div>
      </div>
    </div>
  );
}
