"use client";

import React, { useState, useEffect } from "react";
import {
  FileCheck2,
  Shield,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Sparkles,
  RotateCcw
} from "lucide-react";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const res = await fetch("/api/approvals");
      const json = await res.json();
      if (json.success) {
        setApprovals(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/approvals/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvedBy: "Authorized Campus Administrator" }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchApprovals();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/approvals/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectedBy: "Authorized Campus Administrator" }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchApprovals();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingApprovals = approvals.filter((a) => a.status === "PENDING");
  const completedApprovals = approvals.filter((a) => a.status !== "PENDING");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400 border border-indigo-500/30">
            Human-in-the-Loop Governance
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
          Administrative Approval & Ratification Center
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-3xl">
          Ensuring safety and fiscal responsibility. Autonomous agents NEVER automatically approve high-risk security clearances or budget thresholds without explicit human review.
        </p>
      </div>

      {/* Pending Action Items */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Pending Governance Clearances ({pendingApprovals.length})</span>
        </h2>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : pendingApprovals.length === 0 ? (
          <div className="rounded-2xl bg-slate-900/90 p-8 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">All Clearances Ratified</h3>
            <p className="text-xs text-slate-400">No pending budget, night pass, or security actions waiting for sign-off.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApprovals.map((appr) => (
              <div
                key={appr.id}
                className="rounded-2xl bg-slate-900/90 p-6 border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider border border-slate-700">
                      {appr.category}
                    </span>
                    <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                      {appr.priority} PRIORITY
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{appr.title}</h3>
                  <p className="text-xs text-slate-300">{appr.reason}</p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-slate-500" />
                      <span>Req by: <strong className="text-slate-200">{appr.requestedBy}</strong></span>
                    </span>
                    {appr.amount > 0 && (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <DollarSign className="h-3.5 w-3.5" />
                        <span>${appr.amount.toLocaleString()}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Approve / Reject Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(appr.id)}
                    disabled={processingId === appr.id}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{processingId === appr.id ? "Ratifying..." : "Approve & Sign"}</span>
                  </button>

                  <button
                    onClick={() => handleReject(appr.id)}
                    disabled={processingId === appr.id}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/40 border border-slate-700 transition"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Clearances Audit History */}
      {completedApprovals.length > 0 && (
        <div className="rounded-2xl bg-slate-900/60 p-6 border border-slate-800/80 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Ratification History & Audit Trail ({completedApprovals.length})
          </h3>
          <div className="space-y-2 text-xs">
            {completedApprovals.map((appr) => (
              <div
                key={appr.id}
                className="flex items-center justify-between rounded-xl bg-slate-800/40 p-3.5 border border-slate-700/30"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{appr.title}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                        appr.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {appr.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Sign-off by {appr.approvedBy || "Administrator"} • {appr.resolutionNotes}</p>
                </div>
                <span className="text-[10px] text-slate-500">Recorded</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
