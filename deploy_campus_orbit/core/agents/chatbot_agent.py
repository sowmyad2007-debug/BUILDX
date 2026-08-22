"""
CAMPUS ORBIT - Orbit AI Chatbot Agent
Intelligent multi-domain assistant that:
- Answers event-related questions, schedules, prize pools & certificates
- Suggests optimal venues based on attendee headcounts and technical needs
- Computes volunteer allocations using institutional ratio algorithms
- Provides real-time event readiness, attendance, tasks & conflict explanations
"""

import re
from typing import Dict, Any, List, Optional
from datetime import datetime
from ..models import ChatMessage


class OrbitChatbotAgent:
    def __init__(self):
        self.name = "Orbit AI Operations Assistant"
        self.chat_history: List[ChatMessage] = []
        self._init_history()

    def _init_history(self):
        self.chat_history = [
            ChatMessage(
                id="MSG-001",
                sender="orbit_ai",
                message=(
                    "👋 Welcome to **Orbit AI Assistant**! I can help you plan campus events, "
                    "suggest optimal venues for your participant count, calculate volunteer requirements, "
                    "provide live registration & check-in statistics, or check active conflicts and prize pools."
                ),
                intent="greeting"
            )
        ]

    def process_user_message(self, user_query: str, db) -> ChatMessage:
        """Processes user natural-language queries and returns structured AI response."""
        query_lower = user_query.strip().lower()
        
        # 1. Record user message
        u_msg = ChatMessage(
            id=f"MSG-{len(self.chat_history)+1:03d}",
            sender="user",
            message=user_query,
            intent="user_query"
        )
        self.chat_history.append(u_msg)

        # 2. Generate response based on intent
        bot_response, intent, payload = self._generate_response(query_lower, user_query, db)

        # 3. Record bot message
        ai_msg = ChatMessage(
            id=f"MSG-{len(self.chat_history)+1:03d}",
            sender="orbit_ai",
            message=bot_response,
            intent=intent,
            data_payload=payload
        )
        self.chat_history.append(ai_msg)
        return ai_msg

    def _generate_response(self, query_lower: str, raw_query: str, db) -> tuple[str, str, Optional[Dict[str, Any]]]:
        # A. Venue Suggestion by Participant Count
        if any(w in query_lower for w in ["suggest venue", "recommend venue", "which venue", "where can i host", "find venue", "pax", "capacity", "seats"]):
            # Extract number
            num_match = re.search(r'(\d+)', query_lower)
            pax = int(num_match.group(1)) if num_match else 200
            
            # Find best venues
            suitable_venues = [v for v in db.venues if v.capacity >= pax and v.is_available]
            suitable_venues.sort(key=lambda v: v.capacity)

            if suitable_venues:
                top = suitable_venues[0]
                others = suitable_venues[1:3]
                resp = (
                    f"🏛️ **Venue Recommendation for {pax} Attendees**:\n\n"
                    f"⭐ **Top Pick: {top.name}**\n"
                    f"• **Capacity**: {top.capacity} seats (Optimal buffer for {pax} pax)\n"
                    f"• **Location**: {top.location}\n"
                    f"• **Specs**: Projector: {'Yes (4K)' if top.projector else 'No'} | Microphones: {top.microphones} | Wi-Fi: {top.wifi_speed_mbps} Mbps | AC: {'Yes' if top.ac else 'No'}\n"
                    f"• **Match Score**: {top.smart_score}%\n\n"
                )
                if others:
                    resp += "**Alternative Options:**\n"
                    for ov in others:
                        resp += f"• **{ov.name}** (Capacity: {ov.capacity} pax, {ov.location})\n"
                return resp, "venue_suggestion", {"suggested_venue": top.name, "capacity": top.capacity}
            else:
                return (
                    f"⚠️ No single indoor hall exceeds {pax} capacity. I recommend **Open Air Amphitheatre** (1,200 pax capacity) "
                    f"or partitioning across **Main Auditorium** (500 pax) with an overflow live stream to **Innovation Hall** (250 pax).",
                    "venue_suggestion",
                    None
                )

        # B. Volunteer Requirement Estimation
        if any(w in query_lower for w in ["how many volunteers", "volunteer requirement", "volunteer ratio", "need volunteers", "volunteer headcount"]):
            num_match = re.search(r'(\d+)', query_lower)
            pax = int(num_match.group(1)) if num_match else 300
            
            # Formula: 1 volunteer per 15-20 participants + core leads
            total_vols = max(8, int(pax / 15))
            reg_vols = max(2, int(total_vols * 0.25))
            tech_vols = max(2, int(total_vols * 0.25))
            hosp_vols = max(2, int(total_vols * 0.20))
            sec_vols = max(2, int(total_vols * 0.15))
            gen_vols = max(2, total_vols - (reg_vols + tech_vols + hosp_vols + sec_vols))

            resp = (
                f"👥 **AI Volunteer Allocation Matrix for {pax} Attendees** (Total: **{total_vols} Volunteers**):\n\n"
                f"1. 🎫 **Registration Desk**: **{reg_vols} volunteers** (Fast QR check-in & kit distribution)\n"
                f"2. 🔧 **Technical Support**: **{tech_vols} volunteers** (AV consoles, projectors, Wi-Fi & power strips)\n"
                f"3. 🤝 **Hospitality & VIP**: **{hosp_vols} volunteers** (Speaker escort, catering & guest coordination)\n"
                f"4. 👮 **Security & Crowd Control**: **{sec_vols} volunteers** (Gate ushering & perimeter monitoring)\n"
                f"5. 🏃 **General Operations**: **{gen_vols} volunteers** (Stage runners & emergency logistics)\n\n"
                f"💡 *All {total_vols} student volunteers can be automatically assigned from the Campus Orbit volunteer database.*"
            )
            return resp, "volunteer_calculation", {"total_volunteers": total_vols}

        # C. Prize Money & Certificates
        if any(w in query_lower for w in ["prize", "cash prize", "award", "certificate", "reward", "prize money", "1st prize", "winners", "how much prize"]):
            events = db.events_catalog
            resp = "🏆 **Event Prize Pools & Certification Policy** (Max: **₹10,000**, Min: **₹3,000**):\n\n"
            for ev in events:
                resp += (
                    f"• **{ev.name}** — 📅 *{ev.event_date}*\n"
                    f"  🥇 1st Prize: **{ev.prize_1st}** | 🥈 2nd: **{ev.prize_2nd}** | 🥉 3rd: **{ev.prize_3rd}**\n"
                    f"  📜 **Participation Certificates**: {'Guaranteed for all registered participants' if ev.certificates_all else 'Top 10 only'}\n\n"
                )
            resp += "✨ *All participants receive verifiable digital QR certificates upon event completion.*"
            return resp, "prize_info", None

        # D. Event Status, Readiness, Check-in & Attendance
        if any(w in query_lower for w in ["attendance", "check-in", "checked in", "how many registered", "registration stats", "status"]):
            stats = db.get_registration_stats()
            readiness = db.calculate_readiness()
            resp = (
                f"📊 **Live Campus Event Operations Status**:\n\n"
                f"• **Overall Readiness Index**: **{readiness['overall']}%** (Target: 100%)\n"
                f"• **Total Registered Attendees**: **{stats['total_registered']} Participants**\n"
                f"• **Live Checked-In (Attendance)**: **{stats['total_checked_in']} / {stats['total_registered']}** (**{stats['checkin_rate']}%** Attendance Rate)\n"
                f"• **Active Approved Venues**: **{sum(1 for v in db.venues if v.is_available)} / {len(db.venues)} online**\n"
                f"• **Equipment Shortages**: **{sum(r.shortage_qty for r in db.resources)} items pending borrowing**\n\n"
                f"🔍 *You can scan participant QR codes in real-time under the **QR Check-In** tab.*"
            )
            return resp, "status_update", stats

        # E. Conflicts and Pending Tasks
        if any(w in query_lower for w in ["conflict", "bottleneck", "task", "pending", "approvals", "problem", "issues"]):
            active_conflicts = [c for c in db.conflicts if not c.resolved]
            pending_approvals = [a for a in db.approvals if a.status.value == "Pending"]
            pending_tasks = [t for t in db.tasks if t.status.value != "Completed"]

            resp = f"⚠️ **Active Operational Constraints & Task Bottlenecks**:\n\n"
            if active_conflicts:
                resp += f"**🚨 Unresolved Conflicts ({len(active_conflicts)}):**\n"
                for c in active_conflicts:
                    resp += f"• **[{c.severity.value}] {c.title}**: {c.description}\n  *Recommendation*: {c.recommended_alternatives[0] if c.recommended_alternatives else 'Reallocate venue'}\n"
            else:
                resp += "✓ **Conflicts**: Zero active constraint collisions! Timetables clear.\n"

            if pending_approvals:
                resp += f"\n**🛡️ Pending Governance Clearances ({len(pending_approvals)}):**\n"
                for a in pending_approvals:
                    resp += f"• **{a.title}** (Required Sign-off: *{a.approver_role}*)\n"

            resp += f"\n📋 **Milestone Tasks**: **{len(pending_tasks)} tasks pending execution**."
            return resp, "conflicts_explanation", None

        # F. Event Catalog Queries
        matched_event = None
        for ev in db.events_catalog:
            if ev.name.lower() in query_lower or any(tag.lower() in query_lower for tag in ev.tags):
                matched_event = ev
                break

        if matched_event:
            ev = matched_event
            resp = (
                f"🎪 **{ev.name}** ({ev.category}):\n\n"
                f"• **Date**: 📅 {ev.event_date}\n"
                f"• **Time Slot**: ⏰ {ev.schedule_time}\n"
                f"• **Venue**: 🏛️ {ev.venue_name}\n"
                f"• **Description**: {ev.description}\n"
                f"• **Max Capacity**: 👥 {ev.max_participants} participants ({ev.current_registrations} registered)\n"
                f"• **Prize Pool**: 🥇 {ev.prize_1st} | 🥈 {ev.prize_2nd} | 🥉 {ev.prize_3rd}\n"
                f"• **Certificates**: 📜 Yes, digital certificates for all attendees\n\n"
                f"**Key Rules & Requirements:**\n"
            )
            for r in ev.rules:
                resp += f"- {r}\n"
            return resp, "event_details", {"event_id": ev.id}

        # G. General Help & Fallback
        return (
            "🤖 **Orbit AI Assistant ready.** Here is what you can ask me:\n\n"
            "1. `Suggest venue for 350 students with projector`\n"
            "2. `How many volunteers do I need for 500 attendees?`\n"
            "3. `What is the prize money for AI Prompt Combat and Hackathon?`\n"
            "4. `What is the current attendance and check-in percentage?`\n"
            "5. `Explain pending conflicts and approvals`\n"
            "6. `Tell me about AI QuestX and Industry Innovation Summit`",
            "general_help",
            None
        )
