"""
CAMPUS ORBIT - Unit Test Suite
Verifies all core requirements:
1. Natural language requirement intake
2. Venue, Equipment, Volunteer & Support planning
3. Schedule generation
4. Conflict detection & Alternative recommendations
5. Task management & Dynamic readiness scoring
6. Human-in-the-loop (HITL) governance
7. Dynamic Replanning & Before/After Diff Simulation
"""

import unittest
from core.database import db
from core.orchestrator import director
from core.models import EventType, TaskStatus, ApprovalStatus, ReplanningIncident


class TestCampusOrbit(unittest.TestCase):

    def setUp(self):
        pass

    def test_01_intake_parser(self):
        """Test Natural-Language Event Requirement Intake."""
        prompt = (
            "We are organizing a 2-day AI Innovation Hackathon for 300 students on Aug 28-29. "
            "We need one auditorium, three classrooms/labs, 20 volunteers, Wi-Fi, projectors, "
            "technical support, food arrangements and security. Budget: $4,500."
        )
        req = director.intake_agent.parse_natural_language(prompt)
        self.assertEqual(req.event_type, EventType.HACKATHON)
        self.assertEqual(req.participants, 300)
        self.assertEqual(req.duration_days, 2)
        self.assertEqual(req.budget_limit, 4500.0)
        self.assertTrue(req.food_needed)
        self.assertTrue(req.security_needed)

    def test_02_venue_matching_and_smart_scoring(self):
        """Test Venue Agent search, capacity check, and scoring."""
        prompt = "Organizing a 250 participant conference."
        req = director.intake_agent.parse_natural_language(prompt)
        matched = director.venue_agent.match_venues(req)

        self.assertGreater(len(matched), 0)
        self.assertGreaterEqual(matched[0].capacity, 250)
        self.assertGreaterEqual(matched[0].smart_score, 70)

        # Test explanation
        exp = director.venue_agent.explain_selection(matched[0], req)
        self.assertIn("explanation", exp)
        self.assertIn("criteria_breakdown", exp)

    def test_03_schedule_timeline_generation(self):
        """Test Schedule Agent itinerary generation."""
        req = director.intake_agent.parse_natural_language("Hackathon for 300 students.")
        sched = director.schedule_agent.generate_schedule(req, db.venues[0])

        self.assertGreater(len(sched), 4)
        activities = [s.activity for s in sched]
        self.assertTrue(any("Registration" in a for a in activities))
        self.assertTrue(any("Keynote" in a or "Ceremony" in a for a in activities))

    def test_04_resource_and_volunteer_allocation(self):
        """Test Resource inventory and Volunteer teams."""
        req = director.intake_agent.parse_natural_language("Hackathon with projectors and Wi-Fi.")
        resources = director.resource_agent.allocate_resources(req)
        vols = director.volunteer_agent.allocate_volunteers(req)

        self.assertGreater(len(resources), 0)
        self.assertEqual(len(vols), 20)
        team_summary = director.volunteer_agent.get_team_summary(vols)
        self.assertIn("Technical Support", team_summary)
        self.assertIn("Registration Team", team_summary)

    def test_05_conflict_detection_and_resolution(self):
        """Test Conflict Agent detection and 1-click fix."""
        req = director.intake_agent.parse_natural_language("Event in Kalam Main Auditorium on 2026-09-15 from 14:00 to 18:00.")
        conflicts = director.conflict_agent.detect_conflicts(req, [db.venues[0]], {})

        self.assertGreater(len(conflicts), 0)
        c_id = conflicts[0].id
        director.resolve_conflict(c_id, "Move to Innovation Hall")
        # Should be resolved
        for c in db.conflicts:
            if c.id == c_id:
                self.assertTrue(c.resolved)

    def test_06_human_in_the_loop_governance(self):
        """Test Approvals Agent sign-off gates."""
        app_id = db.approvals[0].id
        director.process_approval(app_id, "Prof. Ramanathan", "APPROVED", "Sanction endorsed.")
        self.assertEqual(db.approvals[0].status, ApprovalStatus.APPROVED)

    def test_07_dynamic_replanning_simulation(self):
        """Test Dynamic Replanning Agent ("WHAT IF?" Center)."""
        incident = ReplanningIncident(
            incident_type="AUDITORIUM_UNAVAILABLE",
            description="Main Auditorium HVAC breakdown.",
            affected_venue="VEN-AUD-01"
        )
        res = director.simulate_what_if(incident)

        self.assertGreater(len(res.candidate_alternatives), 0)
        self.assertEqual(res.candidate_alternatives[0].venue_name, "Innovation Hall")
        self.assertIn("before", res.before_after_diff)
        self.assertIn("after", res.before_after_diff)

        # Apply replanned changes
        updated = director.apply_what_if()
        self.assertEqual(updated.status, "Replanned & Approved")

    def test_08_events_catalog_prizes_and_certificates(self):
        """Test Events Catalog contains all 9 requested events with prizes and certificates."""
        catalog = db.events_catalog
        self.assertEqual(len(catalog), 9)

        event_names = [e.name for e in catalog]
        expected = [
            "AI Innovation Hackathon",
            "AI QuestX",
            "AI Prompt Combat",
            "JAM Session (Just A Minute)",
            "AI Expo & Innovation Showcase",
            "AI QUIZ",
            "AI Poster Design",
            "Podcast with Industrial Professionals",
            "Industry Innovation Summit"
        ]
        for name in expected:
            self.assertIn(name, event_names)

        # Verify all events have dates, prizes between 3000 and 10000, and certificates for all
        for ev in catalog:
            self.assertTrue(ev.event_date)
            self.assertTrue(ev.prize_1st)
            self.assertTrue(ev.prize_2nd)
            self.assertTrue(ev.prize_3rd)
            self.assertTrue(ev.certificates_all)
            # Check price amounts are in [3,000, 10,000]
            for prize_str in [ev.prize_1st, ev.prize_2nd, ev.prize_3rd]:
                digits = int(''.join(filter(str.isdigit, prize_str)))
                self.assertLessEqual(digits, 10000, f"{ev.name} prize {prize_str} exceeds 10,000")
                self.assertGreaterEqual(digits, 3000, f"{ev.name} prize {prize_str} is below 3,000")

    def test_09_participant_registration_and_qr_generation(self):
        """Test Participant Registration and unique QR generation."""
        reg = db.register_participant(
            full_name="Kiran Patel",
            email="kiran.p@college.edu",
            phone="+91-98765-99887",
            college="BITS Pilani",
            department="AI & Data Science",
            event_id="EVT-COMBAT"
        )
        self.assertTrue(reg.id.startswith("REG-"))
        self.assertTrue(reg.qr_code_data.startswith("ORBIT:"))
        self.assertEqual(reg.event_name, "AI Prompt Combat")
        self.assertFalse(reg.checked_in)
        self.assertTrue(reg.certificate_eligible)

    def test_10_qr_event_checkin_system(self):
        """Test QR Attendance Scanning and live statistics."""
        # 1. Register a participant
        reg = db.register_participant(
            full_name="Sneha Roy",
            email="sneha.roy@univ.edu",
            phone="+91-98765-44332",
            college="IIT Bombay",
            department="Computer Science",
            event_id="EVT-QUESTX"
        )
        
        # 2. Check in via QR string
        success, msg, attendee = db.checkin_participant(reg.qr_code_data, gate="Main Entrance Gate A")
        self.assertTrue(success)
        self.assertIn("Sneha Roy", msg)
        self.assertTrue(attendee.checked_in)
        self.assertIsNotNone(attendee.check_in_time)

        # 3. Check stats
        stats = db.get_registration_stats()
        self.assertGreater(stats["total_registered"], 0)
        self.assertGreater(stats["total_checked_in"], 0)
        self.assertGreater(stats["checkin_rate"], 0)

    def test_11_orbit_ai_chatbot(self):
        """Test Orbit AI Chatbot query processing."""
        # A. Venue suggestion by participant count
        msg1 = director.chat_with_orbit("Suggest venue for 350 students with projector")
        self.assertEqual(msg1.intent, "venue_suggestion")
        self.assertIn("Venue Recommendation", msg1.message)

        # B. Volunteer calculation
        msg2 = director.chat_with_orbit("How many volunteers do I need for 400 attendees?")
        self.assertEqual(msg2.intent, "volunteer_calculation")
        self.assertIn("Volunteer Allocation Matrix", msg2.message)

        # C. Prize pool details
        msg3 = director.chat_with_orbit("What is the prize money and certificate policy?")
        self.assertEqual(msg3.intent, "prize_info")
        self.assertIn("1st Prize", msg3.message)
        self.assertIn("Certificates", msg3.message)

        # D. Status update
        msg4 = director.chat_with_orbit("What is the current attendance status?")
        self.assertEqual(msg4.intent, "status_update")


if __name__ == "__main__":
    unittest.main()

