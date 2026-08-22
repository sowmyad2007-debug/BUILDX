import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { calculateEventReadiness } from "@/lib/planner/readiness-calculator";
import { parseNaturalLanguageRequirements } from "@/lib/planner/intake-parser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()?.content || body.message || "";

    if (!lastUserMessage.trim()) {
      return NextResponse.json({
        success: false,
        error: "Message is required.",
      }, { status: 400 });
    }

    const query = lastUserMessage.toLowerCase();

    // 1. Gather live system context
    const events = Array.from(db.events.values());
    const venues = Array.from(db.venues.values());
    const equipment = Array.from(db.equipment.values());
    const volunteers = Array.from(db.volunteers.values());
    const conflicts = Array.from(db.conflicts.values()).filter((c) => c.status === "ACTIVE");
    const demoEventId = "evt-techfest-2026";
    const readiness = calculateEventReadiness(demoEventId);

    let reply = "";
    let suggestedActions: { label: string; href: string }[] = [];

    // Optional: Gemini API Call if configured
    const geminiKey = process.env.GEMINI_API_KEY;
    if (process.env.AI_PROVIDER === "gemini" && geminiKey) {
      try {
        const systemPrompt = `You are CampusFlow AI, an expert autonomous collegiate event planning & coordination agent for college hackathons, technical fests, workshops, and symposiums. 
Available Events: ${events.map((e) => `${e.name} (${e.priceFormatted}, ${e.venueName})`).join("; ")}.
Venues: ${venues.map((v) => `${v.name} (Cap: ${v.capacity})`).join("; ")}.
Active Conflicts: ${conflicts.length}.
Be concise, professional, helpful, and reference campus locations, schedules, and agentic workflows.`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { parts: [{ text: `${systemPrompt}\n\nUser Question: ${lastUserMessage}` }] }
            ]
          })
        });

        if (geminiRes.ok) {
          const geminiJson = await geminiRes.json();
          reply = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch (err) {
        console.warn("Gemini chat fallback to deterministic engine:", err);
      }
    }

    // 2. Intelligent Deterministic Fallback Engine (Guaranteed zero-error response)
    if (!reply) {
      if (query.includes("free") || query.includes("cost") || query.includes("price") || query.includes("fee") || query.includes("ticket")) {
        const freeEvents = events.filter((e) => e.price === 0);
        const paidEvents = events.filter((e) => e.price > 0);

        reply = `🎟️ **Campus Event Pricing Overview**:\n\n` +
          `**Free Campus Events:**\n` +
          freeEvents.map((e) => `• **${e.name}** (${e.category}) — Venue: ${e.venueName}, Seats: ${e.registeredCount}/${e.capacity}`).join("\n") +
          `\n\n**Paid Ticket Events:**\n` +
          paidEvents.map((e) => `• **${e.name}** (${e.priceFormatted}) — Venue: ${e.venueName}, Deadline: ${e.date}`).join("\n") +
          `\n\nYou can register for any of these directly from the **Events Catalog**!`;

        suggestedActions = [
          { label: "View All 9 Events", href: "/events" },
          { label: "Check My Passes", href: "/dashboard" },
        ];
      } else if (query.includes("techfest") || query.includes("tech fest")) {
        const tf = events.find((e) => e.id === "evt-techfest-2026") || events[0];
        reply = `🎪 **${tf.name} Details**:\n\n` +
          `• **Date & Time:** ${tf.date} (${tf.startTime} - ${tf.endTime})\n` +
          `• **Venue:** ${tf.venueName}\n` +
          `• **Registration Fee:** ${tf.priceFormatted}\n` +
          `• **Capacity & Occupancy:** ${tf.registeredCount} registered / ${tf.capacity} seats (${Math.round((tf.registeredCount / tf.capacity) * 100)}% booked)\n` +
          `• **Organized By:** ${tf.organizer}\n` +
          `• **Readiness Score:** ${readiness.overallScore}% (Mathematically computed)\n\n` +
          `Highlights: 6 specialized tracks, paper presentations, drone racing, and guest keynotes.`;

        suggestedActions = [
          { label: "View TechFest Page", href: "/events/evt-techfest-2026" },
          { label: "Register for TechFest", href: "/events/evt-techfest-2026" },
        ];
      } else if (query.includes("hackathon") || query.includes("hack")) {
        const hk = events.find((e) => e.id === "evt-hackathon-2026");
        reply = `💻 **${hk?.name || "Hackathon 2026"}**:\n\n` +
          `• **Duration:** 36-Hour Non-stop Overnight Hackathon\n` +
          `• **Dates:** ${hk?.date || "Sep 22 - 23, 2026"}\n` +
          `• **Venue:** Main Auditorium & Computer Labs\n` +
          `• **Entry Fee:** ₹200 (Includes midnight meals, red bull, swag kit & Wi-Fi 6 sandbox)\n` +
          `• **Prize Pool:** ₹2,00,000 Cash Prizes\n` +
          `• **Security & Permissions:** Overnight Campus Stay Permit approved by Campus Registrar.`;

        suggestedActions = [
          { label: "Hackathon Registration", href: "/events/evt-hackathon-2026" },
          { label: "View Computer Labs", href: "/venues" },
        ];
      } else if (query.includes("placement") || query.includes("job") || query.includes("career")) {
        const pd = events.find((e) => e.id === "evt-placement-drive-2026");
        reply = `💼 **Mega Campus Placement Drive 2026**:\n\n` +
          `• **Eligibility:** Pre-final & Final Year Students\n` +
          `• **Cost:** Free of Cost (Sponsored by T&P Cell)\n` +
          `• **Participating Companies:** 25+ Tier-1 Tech Firms & Product Startups\n` +
          `• **Venues:** Seminar Hall A (Presentations) & Computer Labs 1 & 2 (Coding Tests)\n` +
          `• **Mandatory Rule:** Formal business attire and 5 printed resume copies required.`;

        suggestedActions = [
          { label: "Placement Drive Details", href: "/events/evt-placement-drive-2026" },
          { label: "Check Schedule", href: "/organizer/planning" },
        ];
      } else if (query.includes("conflict") || query.includes("collision") || query.includes("double book")) {
        if (conflicts.length > 0) {
          reply = `⚠️ **Active Constraint Collisions Detected (${conflicts.length})**:\n\n` +
            conflicts.map((c) => `• **${c.title}** (${c.severity} Severity)\n  Description: ${c.description}\n  Recommendation: ${c.resolutionSuggestions[0] || "Relocate to Seminar Hall B"}`).join("\n\n") +
            `\n\nOur **Recommendation Engine** has calculated alternative venues that fit capacity and hardware requirements with zero schedule clash.`;
        } else {
          reply = `✅ **No Active Constraint Collisions!** All campus venues, hardware inventory, and volunteer rosters are 100% conflict-free.`;
        }

        suggestedActions = [
          { label: "Open Conflict Engine", href: "/conflicts" },
          { label: "View Alternative Venues", href: "/venues" },
        ];
      } else if (query.includes("replan") || query.includes("outage") || query.includes("disruption") || query.includes("what if") || query.includes("hvac") || query.includes("broken")) {
        reply = `⚡ **9-Step Dynamic Replanning Engine**:\n\n` +
          `When disruptions happen (e.g. *Seminar Hall A HVAC Outage* or *Equipment Deficit*), CampusFlow AI executes an autonomous 9-step recovery:\n` +
          `1. Disruption Intake ➔ 2. Constraint Invalidation ➔ 3. Impact Assessment\n` +
          `4. Venue Alternative Ranking ➔ 5. Equipment Re-routing ➔ 6. Squad Shift Rebalance\n` +
          `7. Schedule Delta Matrix ➔ 8. Stakeholder Broadcast ➔ 9. Readiness Recalculation\n\n` +
          `You can simulate live disruptions in our **"What-If" Replanning Center** to inspect the BEFORE vs AFTER delta matrix.`;

        suggestedActions = [
          { label: "Run Dynamic Replanner", href: "/replan" },
          { label: "View Human Approvals", href: "/organizer/approvals" },
        ];
      } else if (query.includes("venue") || query.includes("hall") || query.includes("auditorium") || query.includes("lab") || query.includes("room")) {
        reply = `🏛️ **Campus Facility Directory (${venues.length} Venues)**:\n\n` +
          venues.slice(0, 5).map((v) => `• **${v.name}** — Cap: ${v.capacity}, Location: ${v.location}, Wi-Fi: ${v.wifiCoverage}`).join("\n") +
          `\n\nAll venues feature real-time occupancy monitoring and wheelchair accessibility.`;

        suggestedActions = [
          { label: "Explore All Venues", href: "/venues" },
          { label: "Check Equipment Stock", href: "/equipment" },
        ];
      } else if (query.includes("volunteer") || query.includes("squad") || query.includes("staff")) {
        reply = `👥 **Volunteer Squad Coordination**:\n\n` +
          `• Total Roster: **${volunteers.length} Active Student Volunteers**\n` +
          `• Specialized Squads: **Registration Desk**, **Tech Support**, **VIP Hospitality**, **Security & Logistics**, and **General Stage Marshalls**\n` +
          `• Max Shift Policy: 4 Hours per student with mandatory meal & hydration breaks.`;

        suggestedActions = [
          { label: "Manage Volunteer Squads", href: "/volunteers" },
          { label: "View Role Briefings", href: "/briefings" },
        ];
      } else if (query.includes("plan") || query.includes("organize") || query.includes("create") || query.includes("workshop") || query.includes("fest")) {
        const parsed = parseNaturalLanguageRequirements(lastUserMessage);
        reply = `🧠 **AI Event Intake Analysis**:\n\n` +
          `I analyzed your requirements:\n` +
          `• **Event Type:** ${parsed.type}\n` +
          `• **Target Attendance:** ${parsed.attendeeCount} attendees\n` +
          `• **Duration:** ${parsed.durationDays} Day(s)\n` +
          `• **Estimated Budget:** ₹${parsed.budget.toLocaleString()}\n` +
          `• **Recommended Venues:** ${parsed.requiredVenues.join(", ") || "Main Auditorium & Seminar Hall A"}\n` +
          `• **Volunteer Squad Need:** ~${parsed.volunteerCount} student volunteers\n\n` +
          `Would you like me to generate the complete operational schedule, equipment bookings, and task delegation plan?`;

        suggestedActions = [
          { label: "Generate Operational Plan", href: "/organizer/create-event" },
          { label: "Go to Planning Studio", href: "/organizer/planning" },
        ];
      } else if (query.includes("readiness") || query.includes("score") || query.includes("checklist")) {
        reply = `📊 **Calculated Event Readiness Dashboard**:\n\n` +
          `• **Overall Readiness Score:** **${readiness.overallScore}%**\n` +
          `• **Venue Binding:** ${readiness.breakdown.venue}% (Main Auditorium confirmed)\n` +
          `• **Hardware Allocation:** ${readiness.breakdown.equipment}% (Projectors, Mics, Wi-Fi 6)\n` +
          `• **Volunteer Staffing:** ${readiness.breakdown.volunteers}%\n` +
          `• **Task Milestones:** ${readiness.breakdown.tasks}%\n` +
          `• **Governance Approvals:** ${readiness.breakdown.approvals}%`;

        suggestedActions = [
          { label: "View Readiness Dashboard", href: "/dashboard" },
          { label: "Check Approvals", href: "/organizer/approvals" },
        ];
      } else if (query.includes("register") || query.includes("pass") || query.includes("ticket") || query.includes("id")) {
        reply = `🎟️ **How to Register for Campus Events**:\n\n` +
          `1. Go to **Events** ([/events](/events)) and choose any of our 9 campus events.\n` +
          `2. Click **"Register Now"** on the event card or detail page.\n` +
          `3. Confirm your Student ID (e.g. STU-2023-CS042) and email.\n` +
          `4. Get your instant **Digital Pass ID** (e.g. \`REG-TEC26-8941\`) with QR code.\n` +
          `5. View and manage all your registered passes in **My Passes** ([/dashboard](/dashboard)).`;

        suggestedActions = [
          { label: "Browse Events", href: "/events" },
          { label: "My Passes & Tickets", href: "/dashboard" },
        ];
      } else {
        reply = `👋 Hello! I am **CampusFlow AI**, your autonomous campus event planning and coordination assistant.\n\n` +
          `Here is how I can help you today:\n` +
          `• 🎪 **Event Info & Pricing**: Ask about any of our 9 campus events (TechFest, Hackathon, AI Summit, etc.).\n` +
          `• 🧠 **Natural Language Intake**: Type *"Plan a 2-day workshop for 150 students..."* to synthesize an operational plan.\n` +
          `• ⚠️ **Conflict Detection**: Ask *"Check active venue conflicts"* to review collisions & AI recommendations.\n` +
          `• ⚡ **Dynamic Replanning**: Ask *"What if Seminar Hall A is unavailable?"* to simulate disruption recovery.\n` +
          `• 🎟️ **Student Passes**: Ask *"How do I register?"* or *"Show free events"*.`;

        suggestedActions = [
          { label: "Explore 9 Events", href: "/events" },
          { label: "AI Requirement Intake", href: "/organizer/create-event" },
          { label: "Planning Dashboard", href: "/organizer/planning" },
        ];
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        message: reply,
        suggestedActions,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to process chat message.",
    }, { status: 500 });
  }
}
