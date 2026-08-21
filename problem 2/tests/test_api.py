import pytest
from fastapi.testclient import TestClient
from backend.app import app
from backend.services.state_store import state_store

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_store():
    state_store.reset_to_demo()

def test_system_status():
    response = client.get("/api/system/status")
    assert response.status_code == 200
    data = response.json()
    assert data["project_name"] == "CAMPUS ORBIT"
    assert "mode" in data

def test_parse_natural_language_event():
    payload = {
        "raw_prompt": "We are organizing a 2-day AI hackathon for 300 students. We need one auditorium, three classrooms, 20 volunteers, Wi-Fi, projectors, technical support, food arrangements and security."
    }
    response = client.post("/api/events/parse", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["participants"] == 300
    assert data["volunteers"] == 20
    assert data["food_arrangements"] is True

def test_get_venues_and_patch():
    response = client.get("/api/venues")
    assert response.status_code == 200
    venues = response.json()
    assert len(venues) == 7

    # Patch venue status
    patch_res = client.patch("/api/venues/venue-main-auditorium", json={"status": "Maintenance"})
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "Maintenance"

def test_get_resources():
    response = client.get("/api/resources")
    assert response.status_code == 200
    assert len(response.json()) == 8

def test_get_volunteers():
    response = client.get("/api/volunteers")
    assert response.status_code == 200
    assert len(response.json()) == 5

def test_get_schedule():
    response = client.get("/api/schedule")
    assert response.status_code == 200
    assert len(response.json()) >= 10

def test_conflicts_and_resolve():
    response = client.get("/api/conflicts")
    assert response.status_code == 200
    conflicts = response.json()
    assert len(conflicts) >= 1

    # Resolve conf-1
    res = client.post("/api/conflicts/conf-1/resolve", json={"action": "apply_recommendation"})
    assert res.status_code == 200

def test_readiness_score():
    response = client.get("/api/readiness")
    assert response.status_code == 200
    data = response.json()
    assert "overall_score" in data
    assert len(data["categories"]) == 8

def test_simulation_replan_and_apply():
    sim_res = client.post("/api/simulation/replan", json={"scenario_id": "sim-venue-down"})
    assert sim_res.status_code == 200
    sim_data = sim_res.json()
    assert len(sim_data["steps_executed"]) == 9
    assert len(sim_data["before_vs_after"]) > 0

    # Apply
    apply_res = client.post("/api/simulation/apply", json={
        "simulation_id": sim_data["simulation_id"],
        "before_vs_after": sim_data["before_vs_after"]
    })
    assert apply_res.status_code == 200

def test_approvals_workflow():
    response = client.get("/api/approvals")
    assert response.status_code == 200
    approvals = response.json()
    assert len(approvals) >= 1

    appr_id = approvals[0]["id"]
    res = client.post(f"/api/approvals/{appr_id}/approve", json={"reviewer_notes": "Ratified by Committee"})
    assert res.status_code == 200
    assert res.json()["status"] == "Approved"
