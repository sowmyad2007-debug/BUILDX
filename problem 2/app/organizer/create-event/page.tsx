"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Wand2
} from "lucide-react";

export default function OrganizerCreateEventPage() {
  const router = useRouter();

  const [prompt, setPrompt] = useState(
    "Organize a 2-day technical fest for 500 students with 6 workshops, 2 seminar halls, 4 labs, 30 volunteers, AV equipment, security, transport and food arrangements."
  );
  const [parsing, setParsing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  // Editable Form Fields after extraction
  const [formData, setFormData] = useState({
    name: "Campus TechFest & Innovation Odyssey 2026",
    type: "Technical Fest",
    attendeeCount: 500,
    durationDays: 2,
    budget: 150000,
    requiredVenues: ["Main Auditorium", "Seminar Hall A", "Seminar Hall B", "Computer Lab 1"],
    requiredEquipment: ["High-Lumen 4K Laser Projectors", "Wireless Collar & Handheld Mics", "Wi-Fi 6 Routers", "Power Extension Boards"],
    volunteerCount: 30,
    securityRequired: true,
    transportRequired: true,
  });

  const handleParseNLP = async () => {
    if (!prompt.trim()) return;
    setParsing(true);

    try {
      const res = await fetch("/api/planning/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const json = await res.json();

      if (json.success) {
        const p = json.data;
        setParsedData(p);
        setFormData({
          name: p.name || "Campus Technical Event 2026",
          type: p.type || "Technical Fest",
          attendeeCount: p.attendeeCount || 500,
          durationDays: p.durationDays || 2,
          budget: p.budgetEstimate || 150000,
          requiredVenues: p.requiredVenues || ["Main Auditorium", "Seminar Hall A"],
          requiredEquipment: p.requiredEquipment || ["Projectors", "Wireless Mics"],
          volunteerCount: p.volunteerCount || 30,
          securityRequired: p.securityRequired ?? true,
          transportRequired: p.transportRequired ?? true,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setParsing(false);
    }
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/planning/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawPrompt: prompt,
          ...formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        router.push("/organizer/planning");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-purple-400 border border-purple-500/30">
            Core Hackathon Feature 10
          </span>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
            Natural-Language Requirement Intake
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
          Event Requirement Intake Studio
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-3xl leading-relaxed">
          Type or dictate high-level event requirements. The autonomous Multi-Agent Planning Engine extracts structured parameters, sizes venue capacity, checks physical constraints, and synthesizes a full operational plan.
        </p>
      </div>

      {/* Preset Prompts */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[11px] font-bold text-slate-400 py-1">Quick Presets:</span>
        <button
          onClick={() => {
            setPrompt("Organize a 2-day technical fest for 500 students with 6 workshops, 2 seminar halls, 4 labs, 30 volunteers, AV equipment, security, transport and food arrangements.");
          }}
          className="rounded-lg bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1 text-[11px] text-blue-400 border border-slate-700 transition"
        >
          🎪 2-Day TechFest (500 pax)
        </button>
        <button
          onClick={() => {
            setPrompt("Plan a 36-hour overnight hackathon for 400 developers with high-speed internet, power strips, 25 volunteers, overnight security, midnight pizza catering, and judge mentors.");
          }}
          className="rounded-lg bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1 text-[11px] text-purple-400 border border-slate-700 transition"
        >
          ⚡ 36-Hour Hackathon (400 pax)
        </button>
        <button
          onClick={() => {
            setPrompt("Coordinate a campus placement drive for 300 candidates with 20 interview rooms, PPT auditorium, written test lab, corporate lunch, and security clearance.");
          }}
          className="rounded-lg bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1 text-[11px] text-emerald-400 border border-slate-700 transition"
        >
          💼 Placement Drive (300 pax)
        </button>
      </div>

      {/* Main Intake Box */}
      <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <Bot className="h-4 w-4 text-purple-400" />
            <span>Event Requirements Brief (Natural Language)</span>
          </label>
          <span className="text-[11px] text-slate-400">Zero-Config AI Engine</span>
        </div>

        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your event requirements in plain English..."
          className="w-full rounded-xl bg-slate-950 p-4 text-xs sm:text-sm text-white border border-slate-800 focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleParseNLP}
            disabled={parsing || !prompt.trim()}
            className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-xs font-bold text-white transition shadow disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{parsing ? "Parsing Parameters..." : "1. Extract & Analyze Parameters"}</span>
          </button>

          <button
            onClick={handleGeneratePlan}
            disabled={generating}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-2.5 text-xs font-black text-white transition shadow-lg disabled:opacity-50"
          >
            <Wand2 className="h-4 w-4" />
            <span>{generating ? "Synthesizing Operational Plan..." : "2. Generate Operational Plan"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editable Structured Parameters Form */}
      <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-400" />
              <span>Extracted Structured Parameters (Review & Edit)</span>
            </h2>
            <p className="text-xs text-slate-400">Review parameters parsed by AI before operational schedule and resource binding.</p>
          </div>
          <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            Validated Constraints
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Event Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Event Type</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Target Participants</label>
            <input
              type="number"
              value={formData.attendeeCount}
              onChange={(e) => setFormData({ ...formData, attendeeCount: parseInt(e.target.value, 10) })}
              className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Duration (Days)</label>
            <input
              type="number"
              value={formData.durationDays}
              onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value, 10) })}
              className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Volunteers Required</label>
            <input
              type="number"
              value={formData.volunteerCount}
              onChange={(e) => setFormData({ ...formData, volunteerCount: parseInt(e.target.value, 10) })}
              className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Estimated Budget (INR ₹)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value, 10) })}
              className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Required Venues & Equipment Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
            <p className="text-xs font-bold text-slate-300">Allocated Venue Candidates</p>
            <div className="flex flex-wrap gap-1.5">
              {formData.requiredVenues.map((v, i) => (
                <span key={i} className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs text-blue-400 border border-blue-500/20 font-medium">
                  🏛️ {v}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
            <p className="text-xs font-bold text-slate-300">Required Hardware & Equipment</p>
            <div className="flex flex-wrap gap-1.5">
              {formData.requiredEquipment.map((eq, i) => (
                <span key={i} className="rounded-lg bg-purple-500/10 px-2.5 py-1 text-xs text-purple-400 border border-purple-500/20 font-medium">
                  📦 {eq}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
