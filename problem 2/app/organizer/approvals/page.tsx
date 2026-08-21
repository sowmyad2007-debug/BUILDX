"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  DollarSign,
  MapPin,
  Sparkles
} from "lucide-react";

export default function OrganizerApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

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

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActingId(id);
    try {
      const res = await fetch(`/api/approvals/${id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvedBy: "Campus Event Dean / Lead Organizer",
          notes: action === "approve" ? "Sanctioned after review." : "Budget exceeds quota.",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setApprovals((prev) =>
          prev.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: action === "approve" ? "APPROVED" : "REJECTED",
                  approvedBy: "Campus Event Dean / Lead Organizer",
                }
              : a
          )
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  const pending = approvals.filter((a) => a.status === "PENDING");
  const resolved = approvals.filter((a) => a.status !== "PENDING");

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/30">
            Core Requirement 28
          </span>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
            Human-in-the-Loop Governance
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
          Human Approval & Administrative Governance
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
          Critical financial authorizations, overnight security permits, and major facility relocations require human administrative sign-off before execution.
        </p>
      </div>

      {/* Pending Approvals Section */}
      <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>Pending Clearance Requests ({pending.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Requires Administrative Ratification</span>
        </div>

        {pending.length === 0 ? (
          <div className="rounded-xl bg-slate-950 p-6 text-center text-xs text-slate-400 border border-slate-800">
            🎉 All governance clearances and permissions have been resolved.
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((appr) => (
              <div
                key={appr.id}
                className="rounded-xl bg-slate-950 p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                      {appr.category}
                    </span>
                    <span className="text-xs font-bold text-white">{appr.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{appr.reason}</p>
                  <p className="text-[10px] text-slate-500">
                    Requested by: <b className="text-slate-300">{appr.requestedBy}</b> • Priority: <b className="text-amber-400">{appr.priority}</b>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAction(appr.id, "approve")}
                    disabled={actingId === appr.id}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition shadow"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approve & Sign</span>
                  </button>
                  <button
                    onClick={() => handleAction(appr.id, "reject")}
                    disabled={actingId === appr.id}
                    className="flex items-center gap-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 px-3.5 py-2 text-xs font-bold text-rose-400 border border-rose-500/30 transition"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved Audit Trail */}
      <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Governance Clearance History & Audit Trail</span>
        </h2>

        <div className="space-y-2">
          {resolved.map((appr) => (
            <div key={appr.id} className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">{appr.title}</p>
                <p className="text-slate-400">Approved by: {appr.approvedBy || "Campus Dean"}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                appr.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              }`}>
                {appr.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
