"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  Bus,
  Volume2,
  Lock,
  ArrowLeft,
  Sparkles,
  DollarSign,
  QrCode,
  X,
  CreditCard,
  Trophy,
  Award,
  Medal,
  Download
} from "lucide-react";
import { QrCodePassModal, RegistrationPassData } from "@/components/passes/QrCodePassModal";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePassForQr, setActivePassForQr] = useState<RegistrationPassData | null>(null);

  // Registration Modal State
  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState({
    studentName: "Rahul Deshmukh",
    studentId: "STU-2023-CS042",
    email: "rahul.d@campus.edu",
    phone: "+91 98765 00001",
    department: "Computer Science",
    year: "3rd Year",
    emergencyContact: "+91 98765 99999",
  });
  const [submitting, setSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState<any>(null);
  const [regError, setRegError] = useState("");

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      const json = await res.json();
      if (json.success) {
        setEvent(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setRegError("");

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          ...regForm,
        }),
      });
      const json = await res.json();

      if (json.success) {
        setRegSuccess(json.data);
        fetchEventDetails(); // Refresh registered counts
      } else {
        setRegError(json.error || "Failed to register.");
      }
    } catch (err: any) {
      setRegError(err.message || "Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="rounded-2xl bg-slate-900 p-8 border border-slate-800 text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Event Not Found</h2>
        <p className="text-xs text-slate-400">The event you are looking for does not exist or has been removed.</p>
        <Link href="/events" className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white">
          Back to Events
        </Link>
      </div>
    );
  }

  const seatsLeft = Math.max(0, (event.capacity || 500) - (event.registeredCount || 0));

  return (
    <div className="space-y-8 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/events" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Events</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
            {event.status === "REGISTRATION_OPEN" ? "● Registration Open" : "● Planning"}
          </span>
          <span className="rounded-md bg-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-400 border border-blue-500/30">
            {event.category || event.type}
          </span>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-800">
          <img
            src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200"}
            alt={event.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="rounded-md bg-blue-600 px-2.5 py-0.5 text-xs font-black text-white">
                {event.type}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {event.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                {event.description}
              </p>
            </div>

            {/* Price & Register Action Card */}
            <div className="rounded-2xl bg-slate-900/95 p-4 border border-slate-700/80 backdrop-blur-md shrink-0 flex flex-row md:flex-col items-center md:items-start justify-between gap-4 shadow-xl">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Entry Ticket</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-400">
                  {event.priceFormatted || (event.price === 0 ? "Free" : `₹${event.price}`)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={() => setShowRegModal(true)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-black text-white shadow-lg hover:from-blue-500 hover:to-indigo-500 transition active:scale-95 text-center"
                >
                  Register Now
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("open-ai-helper", {
                        detail: { query: `Tell me all details, prize money, rules, and schedule for ${event.name}` }
                      }));
                    }
                  }}
                  className="rounded-xl bg-purple-600/20 hover:bg-purple-600/30 px-3.5 py-3 text-xs font-bold text-purple-300 border border-purple-500/30 transition flex items-center justify-center gap-1.5"
                  title="Ask AI Helper about this event"
                >
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>AI Helper</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Logistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-semibold">Event Dates</span>
          </div>
          <p className="text-sm font-bold text-white">{event.date || "Sep 15 - 16, 2026"}</p>
          <p className="text-[11px] text-slate-400">{event.startTime || "09:00 AM"} - {event.endTime || "06:00 PM"}</p>
        </div>

        <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-semibold">Campus Venue</span>
          </div>
          <p className="text-sm font-bold text-white truncate">{event.venueName || event.location}</p>
          <p className="text-[11px] text-slate-400">Central University Campus</p>
        </div>

        <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-teal-400">
            <Users className="h-4 w-4" />
            <span className="text-xs font-semibold">Capacity</span>
          </div>
          <p className="text-sm font-bold text-white">{event.registeredCount || 0} / {event.capacity || 500}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">{seatsLeft} Seats Remaining</p>
        </div>

        <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-semibold">Reg. Deadline</span>
          </div>
          <p className="text-sm font-bold text-white">48h Before Event</p>
          <p className="text-[11px] text-slate-400">Online registration closing soon</p>
        </div>
      </div>

      {/* Main Content Sections: Schedule, Rules, Logistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Full Schedule & Rules */}
        <div className="lg:col-span-2 space-y-8">
          {/* Master Schedule Timeline */}
          <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>Event Schedule & Timetable</span>
            </h2>

            <div className="relative border-l border-slate-800 ml-3 space-y-6 pt-2">
              {event.schedule && event.schedule.length > 0 ? (
                event.schedule.map((item: any, idx: number) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-slate-950" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <p className="text-xs font-bold text-white">{item.activity}</p>
                      <span className="text-[11px] font-semibold text-blue-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      <span>{item.venue}</span>
                      {item.speakerOrLead && (
                        <span className="text-slate-300"> • Lead: {item.speakerOrLead}</span>
                      )}
                    </p>
                  </div>
                ))
              ) : (
                <div className="pl-6 text-xs text-slate-400">Schedule in coordination.</div>
              )}
            </div>
          </div>

          {/* Winner Prizes & Awards Showcase */}
          {event.winnerPrizes && event.winnerPrizes.length > 0 && (
            <div className="rounded-2xl bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-900 p-6 border border-amber-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Winner Prizes & Cash Pool</span>
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-400 border border-amber-500/30">
                        {event.prizePool}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">Cash awards, rolling trophies, direct incubation, and sponsor perks</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {event.winnerPrizes.map((prize: any, idx: number) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 space-y-2 border transition ${
                      idx === 0
                        ? "bg-gradient-to-b from-amber-500/15 to-slate-950 border-amber-500/40 shadow-lg"
                        : idx === 1
                        ? "bg-slate-950 border-slate-700 hover:border-slate-500"
                        : "bg-slate-950 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {idx === 0 ? "🥇 1st Place" : idx === 1 ? "🥈 2nd Place" : idx === 2 ? "🥉 3rd Place" : "🎖️ Special Award"}
                      </span>
                      <span className="font-mono text-sm font-black text-amber-400">
                        {prize.amount}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white">{prize.position}</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">{prize.description}</p>
                    </div>

                    {prize.perks && prize.perks.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1 border-t border-slate-800">
                        {prize.perks.map((perk: string, pIdx: number) => (
                          <span
                            key={pIdx}
                            className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300 border border-slate-700"
                          >
                            ✓ {perk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules & Guidelines */}
          <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Participation Rules & Guidelines</span>
            </h2>

            <div className="space-y-2">
              {event.rules && event.rules.length > 0 ? (
                event.rules.map((rule: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Standard campus code of conduct applies.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Coordination, Contact & Support */}
        <div className="space-y-6">
          {/* Organizer Contact Card */}
          <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Organizing Committee</h3>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="font-bold text-white">{event.organizer || "Campus Student Affairs & Dept"}</p>
              {event.contactDetails && (
                <>
                  <p className="text-slate-400">Lead: {event.contactDetails.name}</p>
                  <p className="text-slate-400">Email: <span className="text-blue-400">{event.contactDetails.email}</span></p>
                  <p className="text-slate-400">Helpdesk: <span className="text-slate-200">{event.contactDetails.phone}</span></p>
                </>
              )}
            </div>
          </div>

          {/* Infrastructure & Support Summary */}
          <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Event Infrastructure</h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Security Status</span>
                </span>
                <span className="font-semibold text-emerald-400">Active Campus Guard Roster</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Bus className="h-3.5 w-3.5 text-blue-400" />
                  <span>Transport Shuttles</span>
                </span>
                <span className="font-semibold text-slate-200">Metro Station Loops</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Volume2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Audio/Visual Setup</span>
                </span>
                <span className="font-semibold text-slate-200">4K Projection + PA Audio</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Event Registration Form</h3>
                <p className="text-xs text-slate-400">{event.name}</p>
              </div>
              <button onClick={() => { setShowRegModal(false); setRegSuccess(null); }} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {regSuccess ? (
              /* Success Confirmation Card */
              <div className="space-y-4 text-center py-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">Registration Confirmed!</h4>
                  <p className="text-xs text-slate-300">
                    You are registered for <span className="font-bold text-white">{event.name}</span>.
                  </p>
                </div>

                {/* Digital Event Pass */}
                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-left space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Digital Pass ID</span>
                    <span className="font-mono text-sm font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                      {regSuccess.registrationId}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-500">Attendee Name</p>
                      <p className="font-semibold text-slate-200">{regSuccess.studentName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Student ID</p>
                      <p className="font-semibold text-slate-200">{regSuccess.studentId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Venue</p>
                      <p className="font-semibold text-slate-200 truncate">{regSuccess.eventVenue}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Payment Status</p>
                      <p className="font-semibold text-emerald-400">{regSuccess.paymentStatus} ({regSuccess.priceFormatted})</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      setActivePassForQr(regSuccess);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-bold text-white hover:from-blue-500 hover:to-indigo-500 transition shadow"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>View & Download QR Pass</span>
                  </button>
                  <Link
                    href="/dashboard"
                    className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 text-center hover:bg-slate-700 transition border border-slate-700"
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => { setShowRegModal(false); setRegSuccess(null); }}
                    className="rounded-xl bg-slate-800 px-3 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition border border-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleRegister} className="space-y-4">
                {regError && (
                  <div className="rounded-xl bg-rose-500/10 p-3 text-xs text-rose-400 border border-rose-500/30">
                    {regError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={regForm.studentName}
                      onChange={(e) => setRegForm({ ...regForm, studentName: e.target.value })}
                      className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Student ID *</label>
                    <input
                      type="text"
                      required
                      value={regForm.studentId}
                      onChange={(e) => setRegForm({ ...regForm, studentId: e.target.value })}
                      className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Department</label>
                    <input
                      type="text"
                      value={regForm.department}
                      onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                      className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Year of Study</label>
                    <select
                      value={regForm.year}
                      onChange={(e) => setRegForm({ ...regForm, year: e.target.value })}
                      aria-label="Year of Study"
                      className="w-full rounded-xl bg-slate-800 px-3 py-2 text-white border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>

                {/* Price Summary Breakdown */}
                <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Event Registration Ticket</span>
                    <span className="text-white">{event.priceFormatted || (event.price === 0 ? "Free" : `₹${event.price}`)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Campus Technology & Facility Fee</span>
                    <span className="text-white">₹0 (Waived)</span>
                  </div>
                  <div className="border-t border-slate-800 pt-1.5 flex justify-between font-bold text-white">
                    <span>Total Amount</span>
                    <span className="text-emerald-400">{event.priceFormatted || (event.price === 0 ? "Free" : `₹${event.price}`)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-black text-white hover:from-blue-500 hover:to-indigo-500 transition shadow-lg disabled:opacity-50"
                >
                  {submitting ? "Processing Registration..." : `Confirm Registration (${event.priceFormatted || "Free"})`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Scannable Registration QR Code Pass Modal */}
      <QrCodePassModal
        passData={activePassForQr}
        onClose={() => setActivePassForQr(null)}
      />
    </div>
  );
}
