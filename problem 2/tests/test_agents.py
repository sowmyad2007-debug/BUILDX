import pytest
from backend.models.schemas import ParsedEventRequirements, StateComparison
from backend.agents.event_manager import EventManagerAgent
from backend.agents.venue_agent import VenueAgent
from backend.agents.schedule_agent import ScheduleAgent
from backend.agents.resource_agent import ResourceAgent
from backend.agents.volunteer_agent import VolunteerAgent
from backend.agents.conflict_agent import ConflictAgent
from backend.agents.replanning_agent import ReplanningAgent
from backend.services.state_store import state_store

@pytest.fixture(autouse=True)
def reset_store():
    state_store.reset_to_demo()

def test_venue_agent():
    agent = VenueAgent()
    reqs = ParsedEventRequirements(
        event_name="AI Hackathon",
        required_capacity=300,
        required_venues=["Main Auditorium", "3 CSE Labs"]
    )
    result = agent.execute({"requirements": reqs})
    assert result["status"] == "Success"
    assert len(result["allocated_venues"]) >= 2
    assert any("Auditorium" in v["venue_name"] for v in result["allocated_venues"])

def test_venue_ranking_alternatives():
    agent = VenueAgent()
    alts = agent.rank_alternatives_for_venue("venue-main-auditorium", 250)
    assert len(alts) > 0
    assert alts[0]["score"] > 80

def test_schedule_agent():
    agent = ScheduleAgent()
    reqs = ParsedEventRequirements(event_name="AI Hackathon", duration="2 days")
    result = agent.execute({"requirements": reqs})
    assert result["status"] == "Success"
    assert result["total_sessions"] >= 5

def test_resource_agent_allocation_and_shortage():
    agent = ResourceAgent()
    reqs = ParsedEventRequirements(event_name="AI Hackathon", participants=300)
    result = agent.execute({"requirements": reqs})
    assert len(result["resources"]) == 8

    # Simulate deficit
    deficit_res = agent.simulate_resource_deficit("res-projectors", 3)
    assert deficit_res["shortage"] == 3
    assert "Borrow" in deficit_res["recommendation"] or "Procure" in deficit_res["recommendation"]

def test_volunteer_agent_rebalance():
    agent = VolunteerAgent()
    reqs = ParsedEventRequirements(event_name="AI Hackathon", volunteers=20)
    result = agent.execute({"requirements": reqs})
    assert result["total_assigned"] == 20

    rebalance_res = agent.rebalance_teams(3, "team-reg")
    assert rebalance_res["new_count"] >= 1

def test_conflict_agent_detection_and_resolution():
    agent = ConflictAgent()
    result = agent.execute({})
    assert len(result["conflicts"]) >= 1

    # Resolve conf-1
    res = agent.resolve_conflict("conf-1")
    assert res["status"] == "Success"
    updated = state_store.get_conflicts()
    assert any(c.id == "conf-1" and c.status == "Resolved" for c in updated)

def test_replanning_agent_9_step_simulation():
    agent = ReplanningAgent()
    result = agent.execute({"scenario_id": "sim-venue-down"})
    
    assert len(result.steps_executed) == 9
    assert len(result.before_vs_after) > 0
    assert result.alternatives_evaluated[0]["rank"] == 1
    assert "Innovation Hall" in result.alternatives_evaluated[0]["venue_name"]
    assert len(result.human_approvals_triggered) > 0

    # Apply replanning
    apply_res = agent.apply_approved_replanning(result.simulation_id, result.before_vs_after)
    assert apply_res["status"] == "Success"
    main_aud = state_store.get_venue("venue-main-auditorium")
    assert main_aud.status == "Maintenance"

def test_event_manager_master_orchestration():
    manager = EventManagerAgent()
    reqs = ParsedEventRequirements(
        event_name="Robotics Challenge 2026",
        participants=250,
        duration="2 days"
    )
    plan = manager.execute({"requirements": reqs, "event_id": "evt-robotics"})
    assert plan.event_id == "evt-robotics"
    assert len(plan.venues_allocated) > 0
    assert len(plan.schedule) > 0
    assert len(plan.volunteer_teams) == 5
    assert plan.readiness_score.overall_score > 0
