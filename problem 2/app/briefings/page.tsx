"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Shield,
  Users,
  Cpu,
  UserCheck,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
  Phone
} from "lucide-react";

export default function StakeholderBriefingsPage() {
  const [briefings, setBriefings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchBriefings();
  }, []);

  const fetchBriefings = async () => {
    try {
      const res = await fetch("/api/briefings");
      const json = await res.json();
      if (json.success) {
        setBriefings(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (b: any) => {
    const text = `${b.title}\n${b.summary}\n\nKey Instructions:\n${b.keyInstructions?.map((i: string) => `- ${i}`).join("\n")}\n\nContact: ${b.contactPerson}`;
    navigator.clipboard.writeText(text);
    setCopiedId(b.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400 border border-indigo-500/30">
              Stakeholder Communications
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Stakeholder Operational Briefings
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl">
            Synthesized operational dossiers tailored for Security Staff, A/V Technical Crew, Volunteer Squads, and Event Directors.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-700 transition self-start sm:self-auto"
        >
          <Printer className="h-4 w-4 text-blue-400" />
          <span>Print All Briefings</span>
        </button>
      </div>

      {/* Briefings Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {briefings.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                    {b.targetRole.replace(/_/g, " ")}
                  </span>
                  <button
                    onClick={() => handleCopy(b)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedId === b.id ? "Copied!" : "Copy"}</span>
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{b.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{b.summary}</p>
                </div>

                <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/50 space-y-2">
                  <h4 className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                    Mandatory Operational Directives:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {b.keyInstructions?.map((inst: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-500" />
                  <span>Lead: <strong className="text-slate-200">{b.contactPerson}</strong></span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Active Directive</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
