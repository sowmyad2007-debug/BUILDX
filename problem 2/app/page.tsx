"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  Layers,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Zap,
  Activity,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  FileCheck,
  Bell,
  AlertTriangle
} from "lucide-react";

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEvents(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const featured = events.slice(0, 3);
  const categories = [
    { name: "Technical Fests", count: "2 Events", icon: "🎪", desc: "Flagship hackathons and symposia." },
    { name: "Coding Sprints", count: "2 Events", icon: "💻", desc: "Algorithmic competitions and challenges." },
    { name: "Conferences", count: "1 Event", icon: "🎤", desc: "AI & Innovation research keynotes." },
    { name: "Workshops", count: "1 Event", icon: "🛠️", desc: "Hands-on Next.js & AI engineering labs." },
    { name: "Career Drives", count: "1 Event", icon: "💼", desc: "Placement recruitment with 25+ top firms." },
    { name: "Cultural & Sports", count: "2 Events", icon: "🏆", desc: "Music carnivals and athletic games." },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-14 text-center shadow-2xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-400 border border-blue-500/20 backdrop-blur-md">
          <Sparkles className="h-4 w-4" />
          <span>Plan Better. Coordinate Smarter. Run Better Events.</span>
        </div>

        <div className="space-y-3 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            CAMPUS FLOW
          </h1>
          <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Your Campus Events, Planned and Coordinated in One Place.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The intelligent dual-sided platform connecting students to 9 premier campus events while providing organizers with autonomous multi-agent operational planning, deterministic constraint checking, and 9-step dynamic replanning.
          </p>
        </div>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/events"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-xs font-black text-white shadow-xl hover:from-blue-500 hover:to-indigo-500 transition active:scale-95"
          >
            <span>Explore Events</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/events"
            className="flex items-center gap-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 px-6 py-3 text-xs font-black text-emerald-400 border border-emerald-500/30 transition"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Register for an Event</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-3 text-xs font-bold text-slate-300 border border-slate-700 transition"
          >
            <Bot className="h-4 w-4 text-purple-400" />
            <span>Organizer Login</span>
          </Link>
        </div>
      </section>

      {/* 2. Featured Upcoming Events Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
                Featured Programs
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Upcoming Flagship Campus Events
            </h2>
          </div>
          <Link
            href="/events"
            className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:underline"
          >
            <span>View All 9 Events</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(featured.length > 0 ? featured : events.slice(0, 3)).map((evt) => (
            <div
              key={evt.id}
              className="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition overflow-hidden flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                  <img
                    src={evt.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
                    alt={evt.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-slate-700">
                      {evt.category || evt.type}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                      {evt.priceFormatted || (evt.price === 0 ? "Free" : `₹${evt.price}`)}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                    {evt.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{evt.description}</p>
                  <div className="pt-2 text-xs text-slate-400 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-blue-400" />
                      <span>{evt.date}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="truncate">{evt.venueName || evt.location}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/events/${evt.id}`}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 py-2.5 text-xs font-bold text-blue-400 border border-blue-500/30 transition"
                >
                  <span>View Details & Register</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Event Categories Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Event Categories</h2>
          <p className="text-xs text-slate-400">Discover specialized symposiums and activities curated for campus life.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <Link
              key={i}
              href="/events"
              className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 hover:border-purple-500/40 transition text-center space-y-1.5 group"
            >
              <div className="text-2xl">{cat.icon}</div>
              <p className="text-xs font-bold text-white group-hover:text-purple-400 transition">{cat.name}</p>
              <p className="text-[10px] text-slate-400">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. How It Works (Student & Organizer Sides) */}
      <section className="rounded-3xl bg-slate-900/70 border border-slate-800 p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-white">How Campus Flow Works</h2>
          <p className="text-xs text-slate-400">A synchronized system for attendees and campus event directors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Journey */}
          <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-blue-400">
              <Users className="h-5 w-5" />
              <h3 className="text-base font-bold text-white">For Students & Participants</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><b>Browse 9 Campus Events</b>: Search, filter by price (Free - ₹300), and check real-time seat availability.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><b>Instant One-Click Pass</b>: Register with Student ID to generate a unique digital Registration ID.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><b>Personal Dashboard</b>: View registered passes, live alerts, and schedules in one unified portal.</span>
              </li>
            </ul>
          </div>

          {/* Organizer Journey */}
          <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-purple-400">
              <Bot className="h-5 w-5" />
              <h3 className="text-base font-bold text-white">For Campus Event Organizers</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <span><b>Natural-Language Intake</b>: Convert unstructured briefs into operational plans with timeline and equipment.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <span><b>Deterministic Constraint Engine</b>: Detect venue collisions, hardware deficits, and volunteer overlaps.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <span><b>9-Step Dynamic Replanner</b>: Simulate sudden outages with side-by-side BEFORE vs AFTER comparison.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Event Coordination Features Showcase */}
      <section className="space-y-6">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-white">Autonomous Event Coordination Features</h2>
          <p className="text-xs text-slate-400">Built to satisfy every requirement of the hackathon problem statement.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800 space-y-2">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400 w-fit">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Schedule Synthesis</h3>
            <p className="text-xs text-slate-400">Multi-track timelines with venue and equipment bindings.</p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800 space-y-2">
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400 w-fit">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Conflict Engine</h3>
            <p className="text-xs text-slate-400">Deterministic detection of double bookings and shortages.</p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800 space-y-2">
            <div className="rounded-lg bg-rose-500/10 p-2 text-rose-400 w-fit">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Dynamic Replanning</h3>
            <p className="text-xs text-slate-400">9-step autonomous replanning with BEFORE vs AFTER delta.</p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800 space-y-2">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 w-fit">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Readiness Dashboard</h3>
            <p className="text-xs text-slate-400">Calculated 0–100% readiness score with verified checklists.</p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800 space-y-2">
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400 w-fit">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Human Approvals</h3>
            <p className="text-xs text-slate-400">Protects sensitive overnight security and budget authorizations.</p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800 space-y-2">
            <div className="rounded-lg bg-teal-500/10 p-2 text-teal-400 w-fit">
              <FileCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Role Briefings</h3>
            <p className="text-xs text-slate-400">Auto-generated operational dossiers for Security and Tech crew.</p>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="space-y-1">
          <p className="font-bold text-slate-300">CAMPUS FLOW</p>
          <p>Plan Better. Coordinate Smarter. Run Better Events.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/events" className="hover:text-slate-300 transition">Events</Link>
          <Link href="/dashboard" className="hover:text-slate-300 transition">Dashboard</Link>
          <Link href="/organizer/planning" className="hover:text-slate-300 transition">Organizer Hub</Link>
          <Link href="/system-flow" className="hover:text-slate-300 transition">System Flow</Link>
          <Link href="/api-docs" className="hover:text-slate-300 transition">API Docs</Link>
        </div>
      </footer>
    </div>
  );
}
