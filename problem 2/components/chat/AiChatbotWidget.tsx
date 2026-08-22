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
  ArrowUpRight
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
    content: "👋 Hi! I'm **CampusFlow AI Assistant**.\n\nI can help you explore campus events, plan new symposia with AI intake, detect venue collisions, or simulate dynamic replanning.\n\nWhat would you like to do today?",
    suggestedActions: [
      { label: "🎟️ Show All 9 Events", href: "/events" },
      { label: "🧠 Plan an Event with AI", href: "/organizer/create-event" },
      { label: "⚠️ Check Venue Conflicts", href: "/conflicts" },
    ],
    timestamp: "Just now",
  }
];

const QUICK_PROMPTS = [
  "🎟️ Which events are free?",
  "💻 Tell me about Hackathon 2026",
  "⚠️ Are there venue conflicts?",
  "⚡ What if Seminar Hall A fails?",
  "🧠 Plan a 2-day AI Workshop for 200 students",
  "🎓 How do I register for an event?",
];

export function AiChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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

  const handleClearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  // Helper to format basic markdown (bold, bullet points, linebreaks)
  const renderFormattedText = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Bold replacement
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Code tags replacement
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
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button (when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-3.5 sm:px-5 sm:py-3.5 text-white shadow-2xl hover:scale-105 hover:shadow-blue-500/25 transition duration-300 active:scale-95 border border-white/20"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="h-6 w-6 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black tracking-tight leading-tight">AI Assistant</span>
            <span className="text-[10px] text-blue-200 font-medium leading-tight">Campus Coordinator</span>
          </div>
        </button>
      )}

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div
          className={`flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden transition-all duration-300 ${
            isExpanded
              ? "w-[92vw] sm:w-[680px] h-[85vh] max-h-[750px]"
              : "w-[92vw] sm:w-[420px] h-[540px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white">CampusFlow AI Assistant</h3>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-400">Autonomous Event Planning & Queries</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
                title="Clear Chat History"
                aria-label="Clear chat"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
                title={isExpanded ? "Collapse Window" : "Expand Window"}
                aria-label="Toggle window size"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition"
                title="Close Assistant"
                aria-label="Close assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 bg-slate-950/40 border-b border-slate-800/60 no-scrollbar text-[11px]">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="shrink-0 rounded-full bg-slate-800/80 hover:bg-blue-600/20 px-2.5 py-1 text-slate-300 hover:text-blue-300 border border-slate-700/60 transition whitespace-nowrap active:scale-95"
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
                  className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] space-y-2 shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                      : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none"
                  }`}
                >
                  <div className="text-xs leading-relaxed">
                    {msg.role === "assistant" ? renderFormattedText(msg.content) : msg.content}
                  </div>

                  {/* Suggested Action Links */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-700/60">
                      {msg.suggestedActions.map((action, idx) => (
                        <Link
                          key={idx}
                          href={action.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 text-[11px] font-bold text-blue-400 border border-blue-500/20 transition active:scale-95"
                        >
                          <span>{action.label}</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="text-[9px] text-slate-400/80 text-right pt-0.5">
                    {msg.timestamp}
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
                    <span className="text-[11px] text-slate-400 ml-1.5">Analyzing constraints...</span>
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
            <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-1.5 border border-slate-700 focus-within:border-blue-500 transition">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about events, venues, conflicts, or type requirements..."
                disabled={loading}
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none py-1"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:hover:bg-blue-600 transition shadow"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] text-slate-500">
              <span>Press Enter to send</span>
              <span>CampusFlow AI Core Engine</span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
