"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  MapPin,
  Users,
  Tag,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  DollarSign,
  Trophy
} from "lucide-react";

export default function EventsCatalogPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedPrice, setSelectedPrice] = useState("ALL");
  const [selectedVenue, setSelectedVenue] = useState("ALL");
  const [sortBy, setSortBy] = useState("DATE");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const json = await res.json();
      if (json.success) {
        setEvents(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["ALL", "Technical", "Hackathon", "Conference", "Coding", "Robotics", "Career", "Workshop", "Cultural", "Sports"];
  const prices = ["ALL", "Free", "₹50", "₹100", "₹150", "₹200", "₹300"];

  const filteredEvents = events.filter((evt) => {
    const matchesSearch = evt.name.toLowerCase().includes(search.toLowerCase()) || (evt.description && evt.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === "ALL" || (evt.category && evt.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesPrice = selectedPrice === "ALL" || (selectedPrice === "Free" && evt.price === 0) || evt.priceFormatted === selectedPrice;
    const matchesVenue = selectedVenue === "ALL" || (evt.venueName && evt.venueName.includes(selectedVenue));
    return matchesSearch && matchesCategory && matchesPrice && matchesVenue;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/30">
              Campus Events Directory
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Explore Campus Events (9 Flagship Programs)
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl">
            Browse all upcoming technical symposiums, hackathons, coding contests, career placement drives, and cultural carnivals.
          </p>
        </div>

        <Link
          href="/organizer/create-event"
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-blue-500 hover:to-indigo-500 transition self-start sm:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          <span>Organizer AI Intake</span>
        </Link>
      </div>

      {/* AI Event Finder Helper Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-blue-950/50 p-4 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">AI Event Recommendation Helper</p>
            <p className="text-[11px] text-slate-400">Need personalized event recommendations, pass guidance, or prize details?</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("open-ai-helper", {
                detail: { query: "Recommend the best technical fests, hackathons, and workshops with cash prize pools" }
              }));
            }
          }}
          className="shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white transition active:scale-95 shadow"
        >
          <span>Ask AI Helper</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by event title, tech stack, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-800/90 pl-9 pr-4 py-2 text-xs text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by Category"
              className="w-full rounded-xl bg-slate-800/90 px-3 py-2 text-xs text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === "ALL" ? "All Categories" : c}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              aria-label="Filter by Price"
              className="w-full rounded-xl bg-slate-800/90 px-3 py-2 text-xs text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {prices.map((p) => (
                <option key={p} value={p}>{p === "ALL" ? "All Ticket Prices" : `Price: ${p}`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid (9 Cards) */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-2xl bg-slate-900/80 p-8 border border-slate-800 text-center space-y-2">
          <p className="text-sm font-bold text-white">No events match your filter criteria.</p>
          <p className="text-xs text-slate-400">Try clearing filters or changing your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const seatsLeft = Math.max(0, (evt.capacity || 500) - (evt.registeredCount || 0));
            const percentFilled = Math.min(100, Math.round(((evt.registeredCount || 0) / (evt.capacity || 500)) * 100));

            return (
              <div
                key={evt.id}
                className="group rounded-2xl bg-slate-900/95 border border-slate-800 hover:border-blue-500/50 transition overflow-hidden flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Event Thumbnail Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                    <img
                      src={evt.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
                      alt={evt.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-slate-700/80 backdrop-blur-md">
                        {evt.category || evt.type}
                      </span>
                      {evt.prizePool && (
                        <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-black text-slate-950 shadow flex items-center gap-1">
                          <Trophy className="h-2.5 w-2.5 text-slate-950" />
                          <span>{evt.prizePool}</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-slate-950 shadow">
                        {evt.priceFormatted || (evt.price === 0 ? "Free" : `₹${evt.price}`)}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-blue-400" />
                        <span>{evt.date || "Sep 2026"}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{evt.startTime || "09:00 AM"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                        {evt.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        <span className="text-slate-300 truncate">{evt.venueName || evt.location}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                        <span>{evt.registeredCount || 0} Registered / {evt.capacity || 500} Max Seats</span>
                      </p>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Seat Capacity</span>
                        <span className="font-semibold text-slate-200">{seatsLeft} seats remaining</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${percentFilled > 80 ? "bg-amber-500" : "bg-blue-500"}`}
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0 border-t border-slate-800/80 mt-2 flex items-center gap-2">
                  <Link
                    href={`/events/${evt.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition shadow"
                  >
                    <span>View & Register</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
