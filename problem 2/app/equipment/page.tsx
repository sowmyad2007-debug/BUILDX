"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Search,
  Layers,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingDown
} from "lucide-react";

export default function EquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await fetch("/api/equipment");
      const json = await res.json();
      if (json.success) {
        setEquipmentList(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = equipmentList.filter((eq) => {
    const matchesSearch = eq.name.toLowerCase().includes(search.toLowerCase()) || eq.storageLocation.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || eq.category.toUpperCase() === categoryFilter.toUpperCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-purple-400 border border-purple-500/30">
              Hardware & Inventory
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Equipment Inventory & Allocations
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl">
            Real-time tracking of projectors, microphones, PA speakers, power strips, Wi-Fi 6 mesh nodes, and developer laptops.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search hardware name or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500 w-56"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter Equipment by Category"
            className="rounded-xl bg-slate-900 px-3 py-2 text-xs text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Audio/Visual">Audio / Visual</option>
            <option value="Computing">Computing</option>
            <option value="Power">Power & Electrical</option>
            <option value="Network">Network</option>
            <option value="Media">Media & PR</option>
          </select>
        </div>
      </div>

      {/* Equipment Table / Card Matrix */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const isDeficit = item.availableQuantity < item.totalQuantity * 0.2;
            const percentageUsed = Math.round((item.allocatedQuantity / item.totalQuantity) * 100) || 0;

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 hover:border-purple-500/50 transition flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-purple-400 border border-slate-700">
                      {item.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                        item.status === "AVAILABLE"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-tight">{item.name}</h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-indigo-400" />
                    <span>{item.storageLocation}</span>
                  </p>
                </div>

                {/* Stock Stats */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Available Stock:</span>
                    <span className="font-bold text-slate-100">{item.availableQuantity} / {item.totalQuantity} units</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        percentageUsed > 80 ? "bg-amber-500" : "bg-purple-500"
                      }`}
                      style={{ width: `${Math.max(10, 100 - percentageUsed)}%` }}
                    />
                  </div>

                  {isDeficit && (
                    <div className="rounded-lg bg-amber-950/30 p-2 text-[10px] text-amber-300 border border-amber-800/40 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>Stock buffer low (&lt;20% reserve). Inter-department borrowing recommended.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
