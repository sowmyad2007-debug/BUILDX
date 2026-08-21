"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  ShieldAlert,
  RotateCcw,
  Layers,
  ChevronRight
} from "lucide-react";

export default function ConflictsPage() {
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionMessage, setResolutionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts = async () => {
    try {
      const res = await fetch("/api/conflicts/check");
      const json = await res.json();
      if (json.success) {
        setConflicts(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAlternative = async (conflictId: string, alternativeId: string) => {
    setResolvingId(conflictId);
    try {
      const res = await fetch("/api/conflicts/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conflictId, alternativeId }),
      });
      const json = await res.json();
      if (json.success) {
        setResolutionMessage("Conflict resolved and operational plan successfully updated!");
        await fetchConflicts();
        setTimeout(() => setResolutionMessage(null), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResolvingId(null);
    }
  };

  const activeConflicts = conflicts.filter((c) => c.status === "ACTIVE");
  const resolvedConflicts = conflicts.filter((c) => c.status === "RESOLVED");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-rose-400 border border-rose-500/30">
            Constraint Engine
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
          Conflict Detection & Alternative Resolution Center
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-3xl">
          Continuous mathematical collision detector validating room double-bookings, capacity limits, hardware deficits, and schedule collisions.
        </p>
      </div>

      {/* Resolution Toast Alert */}
      {resolutionMessage && (
        <div className="rounded-xl bg-emerald-950/40 p-4 border border-emerald-500/50 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{resolutionMessage}</span>
        </div>
      )}

      {/* Active Conflicts List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Active Constraint Collisions ({activeConflicts.length})</span>
          </h2>
          <button
            onClick={fetchConflicts}
            className="flex items-center gap-1 text-xs text-blue-400 hover:underline"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Re-scan Constraints</span>
          </button>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : activeConflicts.length === 0 ? (
          <div className="rounded-2xl bg-slate-900/90 p-8 border border-slate-800 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Constraint Collisions Detected</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              All venue allocations, hardware quantities, and volunteer schedules are within physical campus boundaries.
            </p>
          </div>
        ) : (
          activeConflicts.map((conflict) => (
            <div
              key={conflict.id}
              className="rounded-2xl bg-slate-900/95 p-6 border border-rose-900/40 shadow-xl space-y-5"
            >
              {/* Conflict Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-rose-500/20 p-2.5 text-rose-400 shrink-0 mt-0.5">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 uppercase tracking-wider border border-rose-500/20">
                      {conflict.category.replace(/_/g, " ")} • {conflict.severity} SEVERITY
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{conflict.title}</h3>
                    <p className="text-xs text-slate-300 mt-0.5">{conflict.description}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 self-start sm:self-auto border border-slate-700">
                  <span className="text-slate-400">Affected: </span>
                  <strong className="text-slate-100">{conflict.affectedItem}</strong>
                </div>
              </div>

              {/* Recommended Alternatives Header */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>AI Agent Ranked Alternatives:</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {conflict.recommendedAlternatives?.map((alt: any, idx: number) => (
                    <div
                      key={alt.id || idx}
                      className="rounded-xl bg-slate-800/70 p-4 border border-slate-700/60 hover:border-indigo-500/50 transition flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                          Option 0{idx + 1}
                        </span>
                        <h5 className="font-bold text-xs text-slate-100">{alt.label}</h5>
                        <p className="text-[11px] text-slate-400 leading-snug">{alt.description}</p>
                      </div>

                      <button
                        onClick={() => handleApplyAlternative(conflict.id, alt.id)}
                        disabled={resolvingId === conflict.id}
                        className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition shadow"
                      >
                        <span>{resolvingId === conflict.id ? "Applying..." : "Apply Alternative"}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolved History */}
      {resolvedConflicts.length > 0 && (
        <div className="rounded-2xl bg-slate-900/60 p-6 border border-slate-800/80 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Resolved Conflict Audit Log ({resolvedConflicts.length})
          </h3>
          <div className="space-y-2">
            {resolvedConflicts.map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between rounded-xl bg-slate-800/40 p-3 text-xs text-slate-400 border border-slate-700/30"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="font-medium text-slate-300">{res.title}</span>
                </div>
                <span className="text-[10px] text-slate-500">Resolved Successfully</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
