"""
CAMPUS ORBIT - Master Web Server & REST API Backend
Self-contained Python HTTP server providing full REST endpoints for the complete frontend.
"""

import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import os
import json
import mimetypes
from typing import Dict, Any, List, Optional
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from dataclasses import asdict
from core.database import db
from core.orchestrator import director
from core.models import ReplanningIncident, ParsedRequirement, EventType


class CampusOrbitHTTPHandler(BaseHTTPRequestHandler):
    """
    HTTP Request Handler serving both the static single-page app and RESTful API endpoints.
    """

    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        if path in ["", "/", "/index.html"]:
            self._serve_static_file("static/index.html", "text/html")
        elif path.startswith("/static/"):
            file_rel = path.lstrip("/")
            mime_type, _ = mimetypes.guess_type(file_rel)
            self._serve_static_file(file_rel, mime_type or "application/octet-stream")
        elif path in ["/api/all", "/api/master", "/api/urls", "/api/everything"]:
            self._send_json(self._get_master_all_payload())
        elif path == "/api/dashboard":
            self._send_json(self._get_dashboard_payload())
        elif path == "/api/events":
            plan = db.active_event_plan
            self._send_json([asdict(plan)] if plan else [])
        elif path == "/api/venues":
            self._send_json([asdict(v) for v in db.venues])
        elif path.startswith("/api/venues/explain/"):
            venue_id = path.split("/")[-1]
            venue = next((v for v in db.venues if v.id == venue_id), db.venues[0])
            req = db.active_event_plan.requirement if db.active_event_plan else ParsedRequirement(
                raw_prompt="", event_name="AI Hackathon", event_type=EventType.HACKATHON,
                participants=300, duration_days=2, start_date="2026-08-28", end_date="2026-08-29",
                start_time="09:00", end_time="20:00"
            )
            explanation = director.venue_agent.explain_selection(venue, req)
            self._send_json(explanation)
        elif path == "/api/resources":
            self._send_json([asdict(r) for r in db.resources])
        elif path == "/api/volunteers":
            self._send_json({
                "volunteers": [asdict(v) for v in db.volunteers],
                "team_summary": director.volunteer_agent.get_team_summary(db.volunteers)
            })
        elif path == "/api/schedule":
            self._send_json([asdict(s) for s in db.schedule])
        elif path == "/api/tasks":
            self._send_json([asdict(t) for t in db.tasks])
        elif path == "/api/conflicts":
            self._send_json([asdict(c) for c in db.conflicts])
        elif path == "/api/approvals":
            self._send_json([asdict(a) for a in db.approvals])
        elif path == "/api/notifications":
            self._send_json([asdict(n) for n in db.notifications])
        elif path == "/api/briefings":
            self._send_json(director.get_briefings())
        elif path == "/api/export-plan":
            plan = db.active_event_plan
            self._send_json(asdict(plan) if plan else {})
        elif path == "/api/events/catalog":
            self._send_json([asdict(e) for e in db.events_catalog])
        elif path == "/api/participants":
            self._send_json([asdict(p) for p in db.participants])
        elif path == "/api/checkin/stats":
            self._send_json(db.get_registration_stats())
        elif path == "/api/chatbot/history":
            self._send_json([asdict(m) for m in director.chatbot_agent.chat_history])
        elif path == "/api/auth/me":
            user = db.get_current_user()
            self._send_json({
                "authenticated": user is not None,
                "user": asdict(user) if user else None
            })
        elif path == "/api/docs":
            self._send_json({
                "openapi": "3.0.0",
                "info": {
                    "title": "Campus Orbit API",
                    "description": "AI-Powered Campus Event Planning & Real-Time Coordination Operations Engine",
                    "version": "1.0.0"
                },
                "endpoints": {
                    "GET /api/dashboard": "Executive dashboard KPIs, active events, and readiness index",
                    "GET /api/events/catalog": "9-Event competition arena with prizes (₹3k–₹10k) and certificates",
                    "GET /api/participants": "List of registered attendees and QR pass metadata",
                    "POST /api/participants/register": "Register new participant and generate SVG QR code pass",
                    "POST /api/checkin/scan": "Scan QR string / Participant ID and mark attendance",
                    "GET /api/checkin/stats": "Live registration & gate check-in statistics",
                    "POST /api/chatbot/message": "Query Orbit AI for venue suggestions, volunteers, and conflicts",
                    "GET /api/chatbot/history": "Retrieve recent multi-turn chat history",
                    "GET /api/venues": "Campus venue inventory with capacities and AV equipment",
                    "GET /api/resources": "Equipment inventory, borrowed units, and shortages",
                    "GET /api/volunteers": "Volunteer roster and squad allocations",
                    "GET /api/schedule": "Milestone timetable and master run of show",
                    "GET /api/tasks": "Task delegation with Kanban statuses and priorities",
                    "GET /api/conflicts": "Detected constraint clashes and resolution recommendations",
                    "GET /api/approvals": "Governance clearance workflow and status",
                    "POST /api/generate-plan": "Generate end-to-end event plan from natural language prompt",
                    "POST /api/simulation/trigger": "Simulate campus disruption scenario (e.g. venue blackout)",
                    "POST /api/simulation/apply": "Apply dynamic AI replanning recommendations",
                    "GET /api/code": "Project architecture metadata and codebase details"
                }
            })
        elif path in ["/api/code", "/api/code/all", "/api/full-code", "/api/code/bundle", "/api/source"]:
            self._send_json(self._get_all_code_payload())
        else:
            self._send_json({"error": "Endpoint not found"}, status=404)

    def do_POST(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        content_len = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_len).decode("utf-8") if content_len > 0 else "{}"
        try:
            data = json.loads(body)
        except Exception:
            data = {}

        if path == "/api/parse-requirements":
            prompt = data.get("prompt", "")
            req = director.intake_agent.parse_natural_language(prompt)
            self._send_json(asdict(req))

        elif path == "/api/generate-plan":
            prompt = data.get("prompt", "")
            if not prompt:
                # Fallback default prompt
                prompt = (
                    "We are organizing a 2-day AI Innovation Hackathon for 300 students. "
                    "We need one auditorium, three classrooms/labs, 20 volunteers, Wi-Fi, projectors, "
                    "technical support, food arrangements and security. Budget: $4,500."
                )
            plan = director.plan_event_from_text(prompt)
            self._send_json(asdict(plan))

        elif path == "/api/venues/toggle":
            venue_id = data.get("venue_id", "")
            updated_venue = db.toggle_venue_availability(venue_id)
            if updated_venue:
                db.calculate_readiness()
                self._send_json(asdict(updated_venue))
            else:
                self._send_json({"error": "Venue not found"}, status=404)

        elif path == "/api/conflicts/resolve":
            conflict_id = data.get("conflict_id", "")
            resolution = data.get("resolution", "Applied recommendation fix")
            plan = director.resolve_conflict(conflict_id, resolution)
            self._send_json(asdict(plan) if plan else {"status": "ok"})

        elif path == "/api/approvals/signoff":
            approval_id = data.get("approval_id", "")
            approver_name = data.get("approver_name", "Authorized Officer")
            action = data.get("action", "APPROVED")
            comments = data.get("comments", "Digitally signed via Campus Orbit Portal")
            plan = director.process_approval(approval_id, approver_name, action, comments)
            self._send_json(asdict(plan) if plan else {"status": "ok"})

        elif path == "/api/tasks/toggle-checklist":
            task_id = data.get("task_id", "")
            item_idx = int(data.get("item_index", 0))
            for t in db.tasks:
                if t.id == task_id and item_idx < len(t.checklist):
                    t.checklist[item_idx]["done"] = not t.checklist[item_idx]["done"]
                    if all(ci["done"] for ci in t.checklist):
                        from core.models import TaskStatus
                        t.status = TaskStatus.COMPLETED
                    break
            db.calculate_readiness()
            self._send_json({"status": "ok", "readiness": db.calculate_readiness()})

        elif path == "/api/simulation/trigger":
            disruption_type = data.get("disruption_type", "AUDITORIUM_UNAVAILABLE")
            description = data.get("description", "Disruption simulated by operator")
            time_offset = int(data.get("time_offset_minutes", 0))
            venue_id = data.get("venue_id", "")

            incident = ReplanningIncident(
                incident_type=disruption_type,
                description=description,
                time_offset_minutes=time_offset,
                affected_venue=venue_id
            )
            result = director.simulate_what_if(incident)
            self._send_json(asdict(result))

        elif path == "/api/simulation/apply":
            updated_plan = director.apply_what_if()
            self._send_json(asdict(updated_plan) if updated_plan else {"status": "ok"})

        elif path == "/api/auth/login":
            email = data.get("email", "")
            password = data.get("password", "")
            user = db.authenticate_user(email, password)
            if user:
                self._send_json({"success": True, "message": "Login successful", "user": asdict(user)})
            else:
                self._send_json({"success": False, "message": "Invalid email or password"}, status=401)

        elif path == "/api/auth/signup":
            name = data.get("name", "")
            email = data.get("email", "")
            password = data.get("password", "")
            role = data.get("role", "Event Manager")
            department = data.get("department", "Campus Operations")
            phone = data.get("phone", "")
            if not email or not name:
                self._send_json({"success": False, "message": "Name and email are required"}, status=400)
            else:
                user = db.register_user(name, email, password, role, department, phone)
                self._send_json({"success": True, "message": "Account registered successfully", "user": asdict(user)})

        elif path == "/api/auth/logout":
            db.logout_user()
            self._send_json({"success": True, "message": "Logged out successfully"})

        elif path == "/api/participants/register":
            name = data.get("full_name", "")
            email = data.get("email", "")
            phone = data.get("phone", "")
            college = data.get("college", "")
            dept = data.get("department", "")
            event_id = data.get("event_id", "EVT-HACK")
            if not name or not email:
                self._send_json({"success": False, "message": "Full Name and Email are required."}, status=400)
            else:
                reg = db.register_participant(name, email, phone, college, dept, event_id)
                self._send_json({"success": True, "message": "Participant registered successfully", "registration": asdict(reg)})

        elif path == "/api/checkin/scan":
            qr_or_id = data.get("qr_data", "") or data.get("id", "")
            gate = data.get("gate", "Main Entrance Gate A")
            if not qr_or_id:
                self._send_json({"success": False, "message": "QR Code or Participant ID is required."}, status=400)
            else:
                ok, msg, record = db.checkin_participant(qr_or_id, gate)
                self._send_json({"success": ok, "message": msg, "participant": asdict(record) if record else None})

        elif path == "/api/chatbot/message":
            msg = data.get("message", "") or data.get("query", "")
            if not msg:
                self._send_json({"success": False, "message": "Message cannot be empty."}, status=400)
            else:
                reply = director.chat_with_orbit(msg)
                self._send_json({"success": True, "reply": asdict(reply)})

        else:
            self._send_json({"error": "Endpoint not found"}, status=404)

    def _get_all_code_payload(self) -> Dict[str, Any]:
        """Bundles and properly organizes the complete source code of all project files and URLs into one JSON response."""
        base_dir = os.path.dirname(os.path.abspath(__file__))

        def read_file_safe(rel_path: str) -> Optional[Dict[str, Any]]:
            full_path = os.path.join(base_dir, rel_path)
            if os.path.exists(full_path) and os.path.isfile(full_path):
                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                    lines = content.splitlines()
                    return {
                        "file_path": rel_path,
                        "file_name": os.path.basename(rel_path),
                        "language": rel_path.split(".")[-1],
                        "lines_count": len(lines),
                        "size_bytes": len(content.encode("utf-8")),
                        "code": content
                    }
                except Exception as err:
                    return {"file_path": rel_path, "error": str(err)}
            return None

        # 1. Stage 01: Data Models & Enums
        stage_01_models = {
            "step_01_models": read_file_safe("core/models.py")
        }

        # 2. Stage 02: Database Engine & Campus Knowledge
        stage_02_database = {
            "step_02_database_and_events_catalog": read_file_safe("core/database.py"),
            "step_03_campus_knowledge_base": read_file_safe("core/knowledge_base.py")
        }

        # 3. Stage 03: Multi-Agent Orchestrator & AI Agent Ecosystem
        stage_03_ai_agents = {
            "step_04_master_orchestrator": read_file_safe("core/orchestrator.py"),
            "step_05_orbit_chatbot_agent": read_file_safe("core/agents/chatbot_agent.py"),
            "step_06_intake_parser_agent": read_file_safe("core/agents/intake_agent.py"),
            "step_07_venue_matching_agent": read_file_safe("core/agents/venue_agent.py"),
            "step_08_volunteer_squad_agent": read_file_safe("core/agents/volunteer_agent.py"),
            "step_09_resource_equipment_agent": read_file_safe("core/agents/resource_agent.py"),
            "step_10_schedule_timetable_agent": read_file_safe("core/agents/schedule_agent.py"),
            "step_11_task_delegation_agent": read_file_safe("core/agents/task_delegation_agent.py"),
            "step_12_conflict_detection_agent": read_file_safe("core/agents/conflict_agent.py"),
            "step_13_approval_governance_agent": read_file_safe("core/agents/approval_agent.py"),
            "step_14_dynamic_replanning_agent": read_file_safe("core/agents/replanning_agent.py"),
            "step_15_incident_briefing_agent": read_file_safe("core/agents/briefing_agent.py")
        }

        # 4. Stage 04: Backend Web Server & REST API
        stage_04_backend_api = {
            "step_16_master_server_and_api_routes": read_file_safe("app.py")
        }

        # 5. Stage 05: Frontend SPA User Interface
        stage_05_frontend = {
            "step_17_frontend_html_views": read_file_safe("static/index.html"),
            "step_18_design_system_and_css": read_file_safe("static/styles.css"),
            "step_19_spa_controller_and_qr_engine": read_file_safe("static/app.js")
        }

        # 6. Stage 06: Testing Suite & Public Deployment
        stage_06_testing_and_infra = {
            "step_20_automated_unit_tests": read_file_safe("tests/test_event_planner.py"),
            "step_21_public_tunnel_launcher": read_file_safe("start_tunnel.js"),
            "step_22_package_config": read_file_safe("package.json")
        }

        ordered_stages = [
            {
                "stage_number": "01",
                "stage_title": "Data Models, Schemas & Enums",
                "description": "Defines core dataclasses (CampusEvent, ParticipantRegistration, ChatMessage, Venue, Resource, Volunteer, Task, Conflict, Approval) and status Enums.",
                "files": stage_01_models
            },
            {
                "stage_number": "02",
                "stage_title": "Database Engine, Event Catalog & QR Engine",
                "description": "In-memory database singleton, 9 campus events with exact dates and prizes (₹3k–₹10k), SVG QR attendance tracking, and readiness metrics.",
                "files": stage_02_database
            },
            {
                "stage_number": "03",
                "stage_title": "Multi-Agent AI Orchestrator & Agents Ecosystem",
                "description": "Autonomous agents coordinating venue allocation, volunteer ratios (1:15), constraint clash checking, governance approvals, What-If disruption replanning, and Orbit AI conversational assistant.",
                "files": stage_03_ai_agents
            },
            {
                "stage_number": "04",
                "stage_title": "Backend Web Server & REST API Endpoints",
                "description": "High-concurrency Python ThreadingHTTPServer serving 21 REST API endpoints and static SPA files.",
                "files": stage_04_backend_api
            },
            {
                "stage_number": "05",
                "stage_title": "Frontend Single Page Application (SPA)",
                "description": "Responsive glassmorphic UI with all 14 views (Dashboard, Events Arena, Participant Registration, QR Pass Generator, Laser Entry Scanner, Orbit AI Chatbot, Simulator).",
                "files": stage_05_frontend
            },
            {
                "stage_number": "06",
                "stage_title": "Automated Testing & Public Deployment",
                "description": "11 Unit test verification suite, package manifests, and public HTTPS tunnel launcher.",
                "files": stage_06_testing_and_infra
            }
        ]

        # Flat ordered list of all files with full code
        ordered_files_manifest = []
        all_raw_files = {}
        total_lines = 0
        total_bytes = 0

        for stage in ordered_stages:
            for key, val in stage["files"].items():
                if val and "code" in val:
                    entry = {
                        "order_key": key,
                        "stage": stage["stage_title"],
                        "file_path": val["file_path"],
                        "file_name": val["file_name"],
                        "language": val["language"],
                        "lines_count": val["lines_count"],
                        "size_bytes": val["size_bytes"],
                        "code": val["code"]
                    }
                    ordered_files_manifest.append(entry)
                    all_raw_files[val["file_path"]] = val
                    total_lines += val["lines_count"]
                    total_bytes += val["size_bytes"]

        base_url = "https://campus-orbit-ai.loca.lt"

        return {
            "status": "success",
            "project_name": "CAMPUS ORBIT",
            "tagline": "AI-Powered Campus Event Planning & Real-Time Dynamic Coordination Agent",
            "repository": "https://github.com/sowmyad2007-debug/campus-orbit-ai",
            "public_website_url": base_url,
            "local_website_url": "http://127.0.0.1:8000",
            "master_code_api_url": f"{base_url}/api/code/all",
            "ordered_pipeline_summary": {
                "total_ordered_stages": len(ordered_stages),
                "total_ordered_files": len(ordered_files_manifest),
                "total_lines_of_code": total_lines,
                "total_codebase_bytes": total_bytes,
                "stages_sequence": [f"Stage {s['stage_number']}: {s['stage_title']}" for s in ordered_stages]
            },
            "ordered_code_stages": ordered_stages,
            "sequential_code_files": ordered_files_manifest
        }

    def _get_master_all_payload(self) -> Dict[str, Any]:
        """Consolidates ALL public Web URLs, REST API endpoints, and live data snapshots into one response."""
        base_url = "https://campus-orbit-ai.loca.lt"
        local_url = "http://127.0.0.1:8000"
        stats = db.get_registration_stats()
        readiness = db.calculate_readiness()

        return {
            "status": "success",
            "project": {
                "name": "CAMPUS ORBIT",
                "tagline": "AI-Powered Campus Event Planning & Real-Time Dynamic Coordination Operations Agent",
                "repository": "https://github.com/sowmyad2007-debug/campus-orbit-ai",
                "public_app_url": base_url,
                "local_app_url": local_url,
                "master_api_url": f"{base_url}/api/all"
            },
            "all_web_urls": {
                "dashboard": f"{base_url}/#dashboard",
                "events_arena_and_prizes": f"{base_url}/#events",
                "participant_registration_and_qr": f"{base_url}/#registration",
                "qr_live_attendance_checkin": f"{base_url}/#checkin",
                "orbit_ai_chatbot": f"{base_url}/#chatbot",
                "dynamic_what_if_simulator": f"{base_url}/#simulation",
                "venues_and_capacity": f"{base_url}/#venues",
                "resources_and_inventory": f"{base_url}/#resources",
                "volunteers_and_squads": f"{base_url}/#volunteers",
                "schedule_timetable": f"{base_url}/#schedule",
                "tasks_and_kanban": f"{base_url}/#tasks",
                "conflicts_and_constraints": f"{base_url}/#conflicts",
                "governance_and_approvals": f"{base_url}/#approvals",
                "auth_login_signup": f"{base_url}/#auth"
            },
            "all_api_urls": {
                "master_consolidated_api": f"{base_url}/api/all",
                "all_source_code_api": f"{base_url}/api/code/all",
                "api_docs": f"{base_url}/api/docs",
                "code_architecture_api": f"{base_url}/api/code",
                "dashboard_api": f"{base_url}/api/dashboard",
                "events_catalog_api": f"{base_url}/api/events/catalog",
                "participants_list_api": f"{base_url}/api/participants",
                "register_participant_api": f"{base_url}/api/participants/register",
                "checkin_scan_api": f"{base_url}/api/checkin/scan",
                "checkin_stats_api": f"{base_url}/api/checkin/stats",
                "chatbot_message_api": f"{base_url}/api/chatbot/message",
                "chatbot_history_api": f"{base_url}/api/chatbot/history",
                "venues_api": f"{base_url}/api/venues",
                "resources_api": f"{base_url}/api/resources",
                "volunteers_api": f"{base_url}/api/volunteers",
                "schedule_api": f"{base_url}/api/schedule",
                "tasks_api": f"{base_url}/api/tasks",
                "conflicts_api": f"{base_url}/api/conflicts",
                "approvals_api": f"{base_url}/api/approvals",
                "generate_plan_api": f"{base_url}/api/generate-plan",
                "simulation_trigger_api": f"{base_url}/api/simulation/trigger",
                "simulation_apply_api": f"{base_url}/api/simulation/apply"
            },
            "live_summary": {
                "total_events": len(db.events_catalog),
                "total_registered": stats["total_registered"],
                "total_checked_in": stats["total_checked_in"],
                "attendance_rate": f"{stats['checkin_rate']}%",
                "readiness_score": f"{readiness['overall']}%",
                "active_conflicts": sum(1 for c in db.conflicts if not c.resolved),
                "pending_approvals": sum(1 for a in db.approvals if a.status.value == "Pending"),
                "total_volunteers": len(db.volunteers)
            }
        }

    def _get_dashboard_payload(self) -> Dict[str, Any]:
        """Generates executive dashboard overview."""
        readiness = db.calculate_readiness()
        active_conflicts = sum(1 for c in db.conflicts if not c.resolved)
        pending_approvals = sum(1 for a in db.approvals if a.status.value == "Pending")
        tasks_due_today = sum(1 for t in db.tasks if t.status.value != "Completed")
        stats = db.get_registration_stats()

        plan = db.active_event_plan
        return {
            "greeting": "Good morning, Event Manager",
            "kpis": {
                "upcoming_events": len(db.events_catalog),
                "events_today": 2,
                "active_conflicts": active_conflicts,
                "pending_approvals": pending_approvals,
                "tasks_due_today": tasks_due_today,
                "readiness_score": readiness["overall"],
                "total_registered": stats["total_registered"],
                "total_checked_in": stats["total_checked_in"],
                "checkin_rate": stats["checkin_rate"],
                "chatbot_queries": len(director.chatbot_agent.chat_history)
            },
            "registration_stats": stats,
            "readiness_breakdown": readiness["breakdown"],
            "active_event": asdict(plan) if plan else None,
            "recent_notifications": [asdict(n) for n in db.notifications[:6]]
        }

    def _serve_static_file(self, rel_path: str, content_type: str):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        full_path = os.path.join(base_dir, rel_path)
        if os.path.exists(full_path) and os.path.isfile(full_path):
            with open(full_path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(content)
        else:
            self._send_json({"error": f"File not found: {rel_path}"}, status=404)

    def _send_json(self, data: Any, status: int = 200):
        body = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)


def run_server(port: int = 8000):
    server_address = ("0.0.0.0", port)
    httpd = ThreadingHTTPServer(server_address, CampusOrbitHTTPHandler)
    print("=" * 80)
    print(" 🚀 CAMPUS ORBIT - AI Event Operations & Dynamic Replanning Platform")
    print("    Tagline: 'Plan smarter. Coordinate automatically. Adapt instantly.'")
    print(f"    Local Access:   http://127.0.0.1:{port}/")
    print(f"    Network Access: http://172.22.12.70:{port}/ (for other participants)")
    print("=" * 80)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Campus Orbit server...")
        httpd.server_close()


if __name__ == "__main__":
    import sys
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run_server(port)
