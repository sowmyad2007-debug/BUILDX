"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Bot, 
  Sparkles, 
  Send, 
  RotateCcw, 
  ArrowUpRight, 
  User, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  RefreshCw,
  Layers,
  Calendar,
  ShieldCheck,
  Zap
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestedActions?: { label: string; href: string }[];
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg-welcome",
    role: "assistant",
    content: "👋 Welcome to the **CampusFlow AI Planning Studio**!\n\nI can help you coordinate venues, synthesize schedules, allocate audio/visual hardware, deploy volunteer squads, detect schedule conflicts, and execute 9-step dynamic replanning.\n\nTry asking me to plan a new hackathon, check room availability, or inspect active campus collisions!",
    suggestedActions: [
      { label: "🧠 Plan a 2-Day Hackathon", href: "/organizer/create-event" },
      { label: "🎟️ Show All 9 Events", href: "/events" },
      { label: "⚠️ Check Conflicts", href: "/conflicts" },
      { label: "⚡ Run Dynamic Replanning", href: "/replan" },
    ],
    timestamp: "Just now",
  }
];

const PRESET_QUERIES = [
  {
    category: "Event Requirement Intake",
    prompt: "Plan a 2-day technical fest for 500 students with 6 workshops, 2 seminar halls, 4 labs, 30 volunteers, AV equipment, security, transport and food arrangements.",
    icon: "🧠",
  },
  {
    category: "Conflict Detection",
    prompt: "Are there any active venue collisions or double-bookings in Seminar Hall A?",
    icon: "⚠️",
  },
  {
    category: "Disruption Recovery",
    prompt: "What happens if Seminar Hall A suffers an unexpected HVAC breakdown during TechFest?",
    icon: "⚡",
  },
  {
    category: "Pricing & Registration",
    prompt: "List all 9 campus events with their ticket fees, capacities, and deadlines.",
    icon: "🎟️",
  },
  {
    category: "Volunteer Logistics",
    prompt: "How many volunteers are rostered and how are the 5 squads distributed?",
    icon: "👥",
  },
  {
    category: "Placement Drive",
    prompt: "What are the infrastructure requirements and schedule for the Mega Placement Drive?",
    icon: "💼",
  },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "presets">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        const assistantMessage: Message = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: json.data.message,
          suggestedActions: json.data.suggestedActions,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "⚠️ " + (json.error || "Sorry, could not process query. Please retry."),
          timestamp: "Now",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch {
      const fallbackMessage: Message = {
        id: `fb-${Date.now()}`,
        role: "assistant",
        content: "⚠️ Network connection interrupted. Please try again.",
        timestamp: "Now",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-800 text-blue-400 font-mono text-[11px]">$1</code>');

      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 my-0.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted.substring(2) }} />
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="my-0.5 text-slate-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-purple-400 border border-purple-500/30">
              Autonomous AI Copilot
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Multi-Agent Core Active</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            AI Event Planning & Coordination Studio
          </h1>
          <p className="text-xs text-slate-400">
            Ask questions, intake event briefs into operational schedules, evaluate constraints, or simulate dynamic disruption replanning.
          </p>
        </div>

        <button
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-bold text-slate-300 border border-slate-700 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Conversation</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chat Conversation Interface (2 cols) */}
        <div className="lg:col-span-2 flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl h-[680px] overflow-hidden">
          {/* Chat Window Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 py-3.5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 shadow-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">CampusFlow Intelligent Agent</h3>
                <p className="text-[10px] text-slate-400">Connected to 9 Events • 9 Venues • 20 Volunteers • 8 Equipment Categories</p>
              </div>
            </div>

            <div className="flex gap-1 rounded-xl bg-slate-800 p-1 border border-slate-700 text-xs">
              <button
                onClick={() => setActiveTab("chat")}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  activeTab === "chat" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab("presets")}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  activeTab === "presets" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Presets ({PRESET_QUERIES.length})
              </button>
            </div>
          </div>

          {/* Active Chat or Presets Tab */}
          {activeTab === "presets" ? (
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ⚡ Ready-to-Run Hackathon Prompts
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {PRESET_QUERIES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab("chat");
                      handleSendMessage(item.prompt);
                    }}
                    className="flex items-start gap-3 rounded-2xl bg-slate-950 p-3.5 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-800/40 transition text-left group"
                  >
                    <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{item.category}</span>
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition leading-relaxed">{item.prompt}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[85%] space-y-2.5 shadow-md ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                        : "bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none"
                    }`}
                  >
                    <div className="text-xs leading-relaxed">
                      {msg.role === "assistant" ? renderFormattedText(msg.content) : msg.content}
                    </div>

                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-800">
                        {msg.suggestedActions.map((action, idx) => (
                          <Link
                            key={idx}
                            href={action.href}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 text-[11px] font-bold text-blue-400 border border-blue-500/20 transition active:scale-95"
                          >
                            <span>{action.label}</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="text-[9px] text-slate-400 text-right pt-0.5">
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm font-bold text-xs">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-bl-none bg-slate-950 px-4 py-3 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      <span className="text-[11px] text-slate-400 ml-1.5">Evaluating schedule and constraints...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="border-t border-slate-800 bg-slate-950 p-3.5"
          >
            <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-3.5 py-2 border border-slate-700 focus-within:border-blue-500 transition">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your event requirements or query (e.g. 'Plan a 2-day hackathon for 500 students...')"
                disabled={loading}
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition shadow"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Campus Operational Intelligence (1 col) */}
        <div className="space-y-4">
          {/* Readiness Gauge Card */}
          <div className="rounded-3xl bg-slate-900 p-5 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400">
                  <Zap className="h-4 w-4" />
                </span>
                <h3 className="text-xs font-bold text-white">Event Readiness Gauge</h3>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                84% Ready
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[84%]" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                <p className="text-slate-400">Venues</p>
                <p className="font-bold text-white">Main Auditorium</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                <p className="text-slate-400">Hardware Stock</p>
                <p className="font-bold text-emerald-400">100% Allocated</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                <p className="text-slate-400">Volunteers</p>
                <p className="font-bold text-white">30 Roster</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                <p className="text-slate-400">Governance</p>
                <p className="font-bold text-purple-400">Dean Approved</p>
              </div>
            </div>
          </div>

          {/* Quick Tool Launchers */}
          <div className="rounded-3xl bg-slate-900 p-5 border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-white">Autonomous Tool Callers</h3>
            
            <div className="space-y-2 text-xs">
              <Link
                href="/organizer/create-event"
                className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800 hover:border-purple-500/40 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Cpu className="h-4 w-4 text-purple-400" />
                  <span className="font-semibold text-slate-200 group-hover:text-white">NLP Requirement Intake</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-purple-400" />
              </Link>

              <Link
                href="/conflicts"
                className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800 hover:border-rose-500/40 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  <span className="font-semibold text-slate-200 group-hover:text-white">Conflict Engine & Alts</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-rose-400" />
              </Link>

              <Link
                href="/replan"
                className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800 hover:border-amber-500/40 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="h-4 w-4 text-amber-400" />
                  <span className="font-semibold text-slate-200 group-hover:text-white">9-Step Dynamic Replanner</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-400" />
              </Link>

              <Link
                href="/organizer/planning"
                className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800 hover:border-blue-500/40 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4 text-blue-400" />
                  <span className="font-semibold text-slate-200 group-hover:text-white">Operational Master Plan</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
