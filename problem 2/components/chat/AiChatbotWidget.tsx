"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  ChevronRight,
  User,
  Calendar,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
  Copy,
  Check,
  HelpCircle,
  QrCode,
  Trophy,
  KeyRound,
  MessageSquare
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
    content: "👋 Hello! I'm your **CampusFlow AI Chatbot Helper**.\n\nI can instantly assist you with:\n• 🎪 **Event Info & Ticket Pricing** (Find free events or prize pools)\n• 📱 **Digital QR Passes & Verification** (How to download passes)\n• 🔑 **Forgot Password & Account Recovery** (Fast 2-step OTP reset)\n• 🧠 **Natural Language Event Planning** (Generate schedules from briefs)\n• ⚠️ **Conflict Detection & Dynamic Replanning** (Fix venue/hardware collisions)\n\nWhat can I help you with today?",
    suggestedActions: [
      { label: "🎟️ Show All 9 Events", href: "/events" },
      { label: "🏆 Winner Prize Pools", href: "/events" },
      { label: "📱 My Passes & QR", href: "/dashboard" },
      { label: "🧠 Plan an Event with AI", href: "/organizer/create-event" },
    ],
    timestamp: "Just now",
  }
];

const STUDENT_HELPER_PROMPTS = [
  "🎟️ Which events are free of cost?",
  "🏆 What is the prize money for Hackathon 2026?",
  "📱 How do I get my QR code pass?",
  "🔑 How to reset my password if I forgot it?",
  "💼 Tell me about Mega Placement Drive",
  "🎪 When does TechFest 2026 start?",
];

const ORGANIZER_HELPER_PROMPTS = [
  "🧠 Plan a 2-day AI Workshop for 200 students",
  "⚠️ Check active venue conflicts & collisions",
  "⚡ What if Seminar Hall A HVAC breaks down?",
  "🏛️ Which venues have 400+ capacity and Wi-Fi 6?",
  "👥 How are volunteer squads distributed?",
  "🛡️ How do Human Approval Gates work?",
];

export function AiChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHelperBubble, setShowHelperBubble] = useState(true);
  const [helperTab, setHelperTab] = useState<"all" | "student" | "organizer">("all");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowHelperBubble(false);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleOpenHelper = (e: any) => {
      setIsOpen(true);
      setShowHelperBubble(false);
      if (e.detail?.query) {
        handleSendMessage(e.detail.query);
      }
    };
    window.addEventListener("open-ai-helper", handleOpenHelper);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "k") || (e.altKey && e.key === "a")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-ai-helper", handleOpenHelper);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
          content: "⚠️ " + (json.error || "Sorry, I had trouble processing that. Please try again."),
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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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

  const activePrompts = helperTab === "student" 
    ? STUDENT_HELPER_PROMPTS 
    : helperTab === "organizer" 
    ? ORGANIZER_HELPER_PROMPTS 
    : [...STUDENT_HELPER_PROMPTS.slice(0, 3), ...ORGANIZER_HELPER_PROMPTS.slice(0, 3)];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Proactive Helper Speech Balloon Bubble */}
      {!isOpen && showHelperBubble && (
        <div className="relative mb-3 animate-bounce">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 border border-purple-500/40 shadow-2xl backdrop-blur-md">
            <span className="text-sm">👋</span>
            <span>Need help? Ask the <strong>AI Chatbot Helper</strong>!</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowHelperBubble(false);
              }}
              className="rounded-full p-1 text-slate-400 hover:text-white"
              aria-label="Dismiss helper tooltip"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="absolute right-8 -bottom-1.5 h-3 w-3 rotate-45 bg-slate-900 border-r border-b border-purple-500/40" />
        </div>
      )}

      {/* Floating Trigger Button (when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-3.5 sm:px-5 sm:py-3.5 text-white shadow-2xl hover:scale-105 hover:shadow-purple-500/30 transition duration-300 active:scale-95 border border-white/20"
          aria-label="Open AI Chatbot Helper"
        >
          <div className="relative">
            <Bot className="h-6 w-6 text-white group-hover:rotate-12 transition transform" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black tracking-tight leading-tight flex items-center gap-1">
              <span>AI Chatbot Helper</span>
              <Sparkles className="h-3 w-3 text-amber-300" />
            </span>
            <span className="text-[10px] text-blue-200 font-medium leading-tight">Instant Campus Assistant</span>
          </div>
        </button>
      )}

      {/* Interactive Chat Helper Modal Window */}
      {isOpen && (
        <div
          className={`flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden transition-all duration-300 ${
            isExpanded
              ? "w-[94vw] sm:w-[720px] h-[85vh] max-h-[800px]"
              : "w-[94vw] sm:w-[440px] h-[580px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 shadow-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white">CampusFlow AI Helper</h3>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Events • Passes • Prizes • Planning Helper</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages(INITIAL_MESSAGES)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
                title="Reset Conversation"
                aria-label="Reset chat"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
                title={isExpanded ? "Collapse Window" : "Expand Window"}
                aria-label="Toggle size"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition"
                title="Close AI Helper"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Helper Category Filters */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 text-[11px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <HelpCircle className="h-3 w-3 text-purple-400" />
              <span>Quick Assist:</span>
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setHelperTab("all")}
                className={`rounded-md px-2 py-0.5 font-bold transition ${
                  helperTab === "all" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setHelperTab("student")}
                className={`rounded-md px-2 py-0.5 font-bold transition ${
                  helperTab === "student" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                🎓 Student
              </button>
              <button
                onClick={() => setHelperTab("organizer")}
                className={`rounded-md px-2 py-0.5 font-bold transition ${
                  helperTab === "organizer" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                🧭 Organizer
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 bg-slate-950/30 border-b border-slate-800/60 no-scrollbar text-[11px]">
            {activePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="shrink-0 rounded-full bg-slate-800/90 hover:bg-purple-600/20 px-2.5 py-1 text-slate-300 hover:text-purple-300 border border-slate-700/60 transition whitespace-nowrap active:scale-95"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] space-y-2 shadow-md relative group ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                      : "bg-slate-800/95 text-slate-200 border border-slate-700/70 rounded-bl-none"
                  }`}
                >
                  <div className="text-xs leading-relaxed">
                    {msg.role === "assistant" ? renderFormattedText(msg.content) : msg.content}
                  </div>

                  {/* Action Shortcuts */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-700/60">
                      {msg.suggestedActions.map((action, idx) => (
                        <Link
                          key={idx}
                          href={action.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 px-2.5 py-1 text-[11px] font-bold text-blue-400 border border-blue-500/30 transition active:scale-95"
                        >
                          <span>{action.label}</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[9px] text-slate-400/80 pt-0.5">
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 hover:text-white transition"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                        <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                      </button>
                    )}
                    <span className="ml-auto">{msg.timestamp}</span>
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm font-bold text-xs">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Loader */}
            {loading && (
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-bl-none bg-slate-800 px-4 py-3 border border-slate-700/60">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-[11px] text-slate-400 ml-1.5">AI Helper analyzing query...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="border-t border-slate-800 bg-slate-950 p-3"
          >
            <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-1.5 border border-slate-700 focus-within:border-purple-500 transition">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI Helper anything (e.g. 'How do I get my QR pass?')..."
                disabled={loading}
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none py-1"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 disabled:hover:bg-purple-600 transition shadow"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] text-slate-500">
              <span>Press Enter to send • 24/7 AI Helper</span>
              <Link href="/assistant" onClick={() => setIsOpen(false)} className="hover:text-purple-400 transition">
                Open Full Studio ↗
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
