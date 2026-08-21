"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  Wifi,
  Accessibility,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  SlidersHorizontal,
  Building2
} from "lucide-react";

export default function VenuesPage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCapacity, setFilterCapacity] = useState(0);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await fetch("/api/venues");
      const json = await res.json();
      if (json.success) {
        setVenues(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.location.toLowerCase().includes(search.toLowerCase());
    const matchesCap = v.capacity >= filterCapacity;
    return matchesSearch && matchesCap;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400 border border-indigo-500/30">
              Campus Infrastructure
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Venue Management & Planning
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl">
            Campus halls evaluated in real-time for acoustic quality, seating bounds, A/V hardware, Wi-Fi mesh rating, and wheelchair accessibility.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search venues or buildings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500 w-56"
            />
          </div>

          <select
            value={filterCapacity}
            onChange={(e) => setFilterCapacity(parseInt(e.target.value, 10))}
            aria-label="Filter Venues by Minimum Seating Capacity"
            className="rounded-xl bg-slate-900 px-3 py-2 text-xs text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value={0}>All Capacities</option>
            <option value={100}>Min 100 Seats</option>
            <option value={200}>Min 200 Seats</option>
            <option value={500}>Min 500 Seats</option>
          </select>
        </div>
      </div>

      {/* Venues Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className={`rounded-2xl bg-slate-900/90 p-6 border transition flex flex-col justify-between space-y-4 shadow-lg ${
                venue.status === "OFFLINE"
                  ? "border-rose-900/50 opacity-80"
                  : "border-slate-800 hover:border-blue-500/50"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 border border-slate-700">
                    {venue.code}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      venue.status === "AVAILABLE"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : venue.status === "OFFLINE"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {venue.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{venue.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{venue.location}</span>
                  </p>
                </div>
              </div>

              {/* Specs & Metrics */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-800/60 p-3 text-xs border border-slate-700/40">
                <div>
                  <span className="text-[10px] text-slate-400">Capacity</span>
                  <p className="font-bold text-slate-100 flex items-center gap-1 mt-0.5">
                    <Users className="h-3.5 w-3.5 text-blue-400" />
                    <span>{venue.capacity} Seats</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Suitability Match</span>
                  <p className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{venue.suitabilityScore}%</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Wi-Fi Coverage</span>
                  <p className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
                    <Wifi className="h-3.5 w-3.5 text-teal-400" />
                    <span>{venue.wifiCoverage}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Accessibility</span>
                  <p className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
                    <Accessibility className="h-3.5 w-3.5 text-purple-400" />
                    <span>{venue.isAccessible ? "Wheelchair Ready" : "Stairs Only"}</span>
                  </p>
                </div>
              </div>

              {/* Equipment Tags */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-semibold text-slate-400">Available Hardware:</span>
                <div className="flex flex-wrap gap-1">
                  {venue.availableEquipment?.map((eq: string, idx: number) => (
                    <span key={idx} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
