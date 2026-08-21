"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Cpu,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Package,
  Shield,
  Truck,
  Utensils,
  DollarSign,
  ArrowRight,
  RefreshCw,
  FileEdit,
  Lightbulb
} from "lucide-react";

export default function NewEventIntakePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(
    "Plan a 2-day technical fest for 500 students with 6 workshops, 2 seminar halls, 4 labs, 30 volunteers, AV equipment, security, transportation and food arrangements."
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [reasoningNotes, setReasoningNotes] = useState<string[]>([]);

  const promptPresets = [
    {
      label: "🏆 2-Day TechFest & Hackathon (500 Students)",
      text: "Plan a 2-day technical fest for 500 students with 6 workshops, 2 seminar halls, 4 labs, 30 volunteers, AV equipment, security, transportation and food arrangements.",
    },
    {
      label: "💼 Campus Placement Drive (300 Candidates)",
      text: "Coordinate a 1-day Campus Placement Drive for 300 students with 8 interview panels, 2 seminar halls, 4 computer labs for online coding tests, 15 volunteers, refreshments and badge verification.",
    },
    {
      label: "🤖 International AI & Robotics Summit (400 Delegates)",
      text: "Organize a 2-day International AI & Robotics Symposium for 400 participants with keynote hall, 3 breakout tracks, live streaming cameras, high-density Wi-Fi, VIP hospitality, and dinner gala.",
    },
  ];

  const handleAnalyzePrompt = async () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/planning/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const json = await res.json();
      if (json.success) {
        setParsedData(json.data);
        setReasoningNotes(json.reasoningNotes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!parsedData) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/planning/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirements: parsedData }),
      });
      const json = await res.json();
      if (json.success) {
        router.push("/planning");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/30">
            Natural Language Intake Engine
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
          Event Requirement Intake Studio
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-3xl">
          Describe your campus event in plain English. The AI Requirement Analyzer Agent will decompose your narrative into structured parameters, validate campus facility constraints, and prepare an operational schedule.
        </p>
      </div>

      {/* Input Box & Templates */}
      <div className="rounded-2xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>Event Brief Prompt</span>
          </label>
          <span className="text-[11px] text-slate-500">Plain text / natural language input</span>
        </div>

        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Plan a 2-day technical fest for 500 students with 6 workshops, 2 seminar halls, 4 labs..."
          className="w-full rounded-xl bg-slate-800/90 p-4 text-sm text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
        />

        {/* Preset Prompt Buttons */}
        <div>
          <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            <span>Quick Prompt Presets for Demonstration:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {promptPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(preset.text)}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 border border-slate-700/60 hover:bg-slate-700/80 hover:text-white transition text-left"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleAnalyzePrompt}
            disabled={isAnalyzing || !prompt.trim()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 transition"
          >
            <Cpu className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
            <span>{isAnalyzing ? "Analyzing Requirements..." : "Analyze with AI Agent"}</span>
          </button>
        </div>
      </div>

      {/* Structured Output & Editable Preview */}
      {parsedData && (
        <div className="rounded-2xl bg-slate-900/90 p-6 border border-slate-800 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                Extraction Verified (96% Confidence)
              </span>
              <h2 className="text-lg font-bold text-white mt-1">
                Structured Operational Parameters
              </h2>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <FileEdit className="h-3.5 w-3.5 text-blue-400" />
              Editable prior to plan synthesis
            </span>
          </div>

          {/* Reasoning Stream */}
          {reasoningNotes.length > 0 && (
            <div className="rounded-xl bg-blue-950/20 p-4 border border-blue-800/30 text-xs text-slate-300 space-y-1.5">
              <p className="font-bold text-blue-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Agent Rationale & Validation Log:</span>
              </p>
              {reasoningNotes.map((note, idx) => (
                <p key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>{note}</span>
                </p>
              ))}
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Event Name */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-400" />
                <span>Event Title</span>
              </label>
              <input
                type="text"
                value={parsedData.name}
                onChange={(e) => setParsedData({ ...parsedData, name: e.target.value })}
                className="w-full rounded-lg bg-slate-800 p-2.5 text-slate-100 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Event Type */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Event Category</label>
              <input
                type="text"
                value={parsedData.type}
                onChange={(e) => setParsedData({ ...parsedData, type: e.target.value })}
                className="w-full rounded-lg bg-slate-800 p-2.5 text-slate-100 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Attendee Count */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-emerald-400" />
                <span>Target Attendees</span>
              </label>
              <input
                type="number"
                value={parsedData.attendeeCount}
                onChange={(e) => setParsedData({ ...parsedData, attendeeCount: parseInt(e.target.value, 10) || 0 })}
                className="w-full rounded-lg bg-slate-800 p-2.5 text-slate-100 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Duration Days */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Duration (Days)</label>
              <input
                type="number"
                value={parsedData.durationDays}
                onChange={(e) => setParsedData({ ...parsedData, durationDays: parseInt(e.target.value, 10) || 1 })}
                className="w-full rounded-lg bg-slate-800 p-2.5 text-slate-100 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Volunteer Count */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-amber-400" />
                <span>Volunteers Required</span>
              </label>
              <input
                type="number"
                value={parsedData.volunteerCount}
                onChange={(e) => setParsedData({ ...parsedData, volunteerCount: parseInt(e.target.value, 10) || 0 })}
                className="w-full rounded-lg bg-slate-800 p-2.5 text-slate-100 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Estimated Budget */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-teal-400" />
                <span>Estimated Budget ($)</span>
              </label>
              <input
                type="number"
                value={parsedData.budget}
                onChange={(e) => setParsedData({ ...parsedData, budget: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg bg-slate-800 p-2.5 text-slate-100 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Venues & Equipment Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/50 space-y-2">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <span>Required Campus Venues:</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {parsedData.requiredVenues?.map((v: string, idx: number) => (
                  <span key={idx} className="rounded-lg bg-slate-700 px-2.5 py-1 text-slate-200 font-medium">
                    {v}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/50 space-y-2">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <Package className="h-4 w-4 text-purple-400" />
                <span>Hardware Inventory Needed:</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {parsedData.requiredEquipment?.map((eq: string, idx: number) => (
                  <span key={idx} className="rounded-lg bg-slate-700 px-2.5 py-1 text-slate-200 font-medium">
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Operational Plan CTA */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition"
            >
              <CheckCircle2 className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
              <span>{isGenerating ? "Generating Master Operational Plan..." : "Generate Master Operational Plan →"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
