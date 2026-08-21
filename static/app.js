/**
 * CAMPUS ORBIT - Frontend State Machine & Dynamic Operations Engine
 */

let appState = {
  activeView: "dashboard",
  currentUser: null,
  dashboardData: null,
  activePlan: null,
  eventsCatalog: [],
  participants: [],
  checkinStats: null,
  chatHistory: [],
  currentTicket: null,
  catalogFilter: "all",
  venues: [],
  resources: [],
  volunteers: [],
  tasks: [],
  conflicts: [],
  approvals: [],
  notifications: [],
  schedule: [],
  selectedApprovalId: null,
  lastSimResult: null
};

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

async function initApp() {
  handleHashNavigation();
  window.addEventListener("hashchange", handleHashNavigation);
  await checkAuthStatus();
  await refreshGlobalData();
}

function handleHashNavigation() {
  const hash = window.location.hash.replace("#", "") || "dashboard";
  navigateTo(hash, false);
}

function navigateTo(viewName, updateHash = true) {
  if (updateHash) {
    window.location.hash = viewName;
  }
  appState.activeView = viewName;

  // Update sidebar links
  document.querySelectorAll(".sidebar-nav .nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.view === viewName);
  });

  // Switch panels
  document.querySelectorAll(".view-panel").forEach(panel => {
    panel.style.display = panel.id === `view-${viewName}` ? "block" : "none";
  });

  // Update breadcrumbs
  const breadcrumbMap = {
    landing: "Campus Orbit / Landing Overview",
    dashboard: "Dashboard / Executive Overview",
    events: "Events Arena / 9 Competitions, Prizes & Rules",
    registration: "Attendance / Participant Registration & Digital Pass",
    checkin: "Entry Gate / QR Attendance & Security Scanner",
    chatbot: "Operations / Orbit AI Conversational Agent",
    planner: "AI Planner / Requirement Intake",
    venues: "Venues / Facility Management",
    resources: "Resources / Equipment Inventory",
    volunteers: "Volunteers / Team Rosters",
    schedule: "Schedule / Activity Timeline",
    tasks: "Tasks / Milestone WBS",
    conflicts: "Conflicts / Collision Engine",
    approvals: "Approvals / Governance Gatekeeper",
    notifications: "Notifications / Alert Center",
    simulation: "Simulation Center / Dynamic What-If Replanner",
    settings: "Settings / Environment Status",
    auth: "Account & Access / Security Gateway"
  };
  document.getElementById("topBreadcrumbs").innerText = breadcrumbMap[viewName] || "Campus Orbit";

  // Trigger view specific re-render
  if (viewName === "dashboard") renderDashboardView();
  else if (viewName === "events") renderEventsView();
  else if (viewName === "registration") renderRegistrationView();
  else if (viewName === "checkin") renderCheckinView();
  else if (viewName === "chatbot") renderChatbotView();
  else if (viewName === "venues") renderVenuesView();
  else if (viewName === "resources") renderResourcesView();
  else if (viewName === "volunteers") renderVolunteersView();
  else if (viewName === "schedule") renderScheduleView();
  else if (viewName === "tasks") renderTasksView();
  else if (viewName === "conflicts") renderConflictsView();
  else if (viewName === "approvals") renderApprovalsView();
  else if (viewName === "notifications") renderNotificationsView();
}

async function refreshGlobalData() {
  try {
    const [dashRes, venuesRes, resRes, volRes, schedRes, tasksRes, confRes, appRes, notifRes, eventsRes, partsRes, statsRes, chatRes] = await Promise.all([
      fetch("/api/dashboard").then(r => r.json()),
      fetch("/api/venues").then(r => r.json()),
      fetch("/api/resources").then(r => r.json()),
      fetch("/api/volunteers").then(r => r.json()),
      fetch("/api/schedule").then(r => r.json()),
      fetch("/api/tasks").then(r => r.json()),
      fetch("/api/conflicts").then(r => r.json()),
      fetch("/api/approvals").then(r => r.json()),
      fetch("/api/notifications").then(r => r.json()),
      fetch("/api/events/catalog").then(r => r.json()).catch(() => []),
      fetch("/api/participants").then(r => r.json()).catch(() => []),
      fetch("/api/checkin/stats").then(r => r.json()).catch(() => ({})),
      fetch("/api/chatbot/history").then(r => r.json()).catch(() => [])
    ]);

    appState.dashboardData = dashRes;
    appState.activePlan = dashRes.active_event;
    appState.venues = venuesRes;
    appState.resources = resRes;
    appState.volunteers = volRes.volunteers || [];
    appState.volSummary = volRes.team_summary || {};
    appState.schedule = schedRes;
    appState.tasks = tasksRes;
    appState.conflicts = confRes;
    appState.approvals = appRes;
    appState.notifications = notifRes;
    appState.eventsCatalog = eventsRes;
    appState.participants = partsRes;
    appState.checkinStats = statsRes;
    appState.chatHistory = chatRes;

    updateSidebarBadges();
    if (appState.activeView === "dashboard") {
      renderDashboardView();
    } else if (appState.activeView === "events") {
      renderEventsView();
    } else if (appState.activeView === "checkin") {
      renderCheckinView();
    } else if (appState.activeView === "chatbot") {
      renderChatbotView();
    }
  } catch (err) {
    console.error("Failed to fetch initial data:", err);
  }
}

function updateSidebarBadges() {
  const activeConf = appState.conflicts.filter(c => !c.resolved).length;
  const pendingApp = appState.approvals.filter(a => a.status === "Pending").length;
  const shortRes = appState.resources.filter(r => r.shortage_qty > 0).length;
  const pendingTasks = appState.tasks.filter(t => t.status !== "Completed").length;
  const totalParts = appState.participants.length;
  const checkedInCount = appState.participants.filter(p => p.checked_in).length;

  document.getElementById("navConflictCount").innerText = activeConf;
  document.getElementById("navApprovalCount").innerText = pendingApp;
  document.getElementById("navResourceShortageBadge").innerText = `${shortRes} Short`;
  document.getElementById("navTaskDueCount").innerText = `${pendingTasks} Due`;
  document.getElementById("navNotifCount").innerText = appState.notifications.length;
  
  const regBadge = document.getElementById("navRegBadge");
  if (regBadge) regBadge.innerText = `${totalParts} Reg`;

  const checkinBadge = document.getElementById("navCheckinBadge");
  if (checkinBadge) checkinBadge.innerText = `${checkedInCount}/${totalParts}`;

  const eventBadge = document.getElementById("navActiveEventBadge");
  if (eventBadge) eventBadge.innerText = `${appState.eventsCatalog.length || 9} Events`;
}

/* ==================== 1. DASHBOARD VIEW ==================== */
function renderDashboardView() {
  const d = appState.dashboardData;
  if (!d) return;

  const k = d.kpis;
  document.getElementById("kpiUpcomingEvents").innerText = k.upcoming_events || (appState.eventsCatalog.length || 9);
  document.getElementById("kpiActiveConflicts").innerText = k.active_conflicts;
  document.getElementById("kpiPendingApprovals").innerText = k.pending_approvals;
  document.getElementById("kpiTasksDue").innerText = k.tasks_due_today;
  
  const totalReg = k.total_registered !== undefined ? k.total_registered : appState.participants.length;
  const totalIn = k.total_checked_in !== undefined ? k.total_checked_in : appState.participants.filter(p => p.checked_in).length;
  const inRate = k.checkin_rate !== undefined ? k.checkin_rate : Math.round((totalIn / Math.max(1, totalReg)) * 100);

  const kpiRegEl = document.getElementById("kpiTotalRegistered");
  if (kpiRegEl) kpiRegEl.innerText = totalReg;

  const kpiInEl = document.getElementById("kpiTotalCheckedIn");
  if (kpiInEl) kpiInEl.innerText = `${totalIn} (${inRate}%)`;

  const kpiChatEl = document.getElementById("kpiChatQueries");
  if (kpiChatEl) kpiChatEl.innerText = appState.chatHistory.length || 7;

  const dashAttEl = document.getElementById("dashAttendanceRate");
  if (dashAttEl) dashAttEl.innerText = `${inRate}% Checked In (${totalIn}/${totalReg})`;

  const score = k.readiness_score || 82;
  document.getElementById("kpiReadinessScore").innerText = `${score}%`;
  document.getElementById("dashboardRadialRing").style.background = `radial-gradient(var(--bg-card) 58%, transparent 60%), conic-gradient(var(--success) 0% ${score}%, var(--border-card) ${score}% 100%)`;

  // Render 8 Category Progress Bars
  const breakdown = d.readiness_breakdown || {};
  const barsContainer = document.getElementById("dashboardReadinessBars");
  barsContainer.innerHTML = "";

  const categoryLabels = {
    venue: "🏛️ Venues",
    equipment: "📦 Equipment",
    volunteers: "👥 Volunteers",
    schedule: "📅 Schedule",
    security: "👮 Security",
    transport: "🚌 Transport",
    permissions: "🛡️ Permissions",
    communication: "📢 Communication"
  };

  for (const [key, val] of Object.entries(breakdown)) {
    const label = categoryLabels[key] || key;
    const bar = document.createElement("div");
    bar.className = "rc-bar-item";
    bar.innerHTML = `
      <div class="rc-bar-label">
        <span>${label}</span>
        <strong>${val}%</strong>
      </div>
      <div class="rc-track">
        <div class="rc-fill" style="width: ${val}%; background: ${val >= 80 ? 'var(--success)' : val >= 60 ? 'var(--warning)' : 'var(--danger)'}"></div>
      </div>
    `;
    barsContainer.appendChild(bar);
  }

  // Render Notifications Feed
  const notifContainer = document.getElementById("dashboardNotifList");
  notifContainer.innerHTML = "";
  (d.recent_notifications || []).forEach(n => {
    const item = document.createElement("div");
    const pClass = (n.priority || "Info").toLowerCase();
    item.className = `notif-item ${pClass}`;
    item.innerHTML = `
      <div class="notif-item-header">
        <span class="notif-item-title">${n.title}</span>
        <span class="notif-item-time">${n.timestamp}</span>
      </div>
      <div class="notif-item-msg">${n.message}</div>
    `;
    notifContainer.appendChild(item);
  });
}

/* ==================== 2. AI PLANNER & EXTRACTION ==================== */
function loadPromptScenario(type) {
  const prompts = {
    hackathon: "We are organizing a 2-day AI Innovation Hackathon for 300 students on Aug 28-29. We need one auditorium, three classrooms/labs, 20 volunteers, high-speed Wi-Fi, projectors, technical support, food arrangements and security. Budget: $4,500.",
    conference: "Hosting the Annual International Conference on Autonomous Systems on Sep 25 from 09:00 to 18:00 for 250 delegates in Kalam Main Auditorium with live streaming multi-cam, 4 microphones, VIP speaker lounge, and buffet lunch. Budget: $3,200.",
    placement: "Conducting Tech Mahindra Campus Placement Drive on Oct 02 from 08:30 to 19:00 for 200 student candidates in Central Placement Complex with 12 interview cabins, Seminar Hall for corporate talks, and cafeteria lunch boxes.",
    cultural: "Planning Ignite Techno-Cultural Night on Sep 18 at Open Air Amphitheatre from 16:00 to 23:30 for 800 students with high-power stage floodlights, sound line arrays, mobile diesel generator, and first aid standby."
  };

  const p = prompts[type] || prompts.hackathon;
  document.getElementById("plannerInput").value = p;
  handleParseRequirements();
}

async function handleParseRequirements() {
  const prompt = document.getElementById("plannerInput").value.trim();
  if (!prompt) return;

  try {
    const res = await fetch("/api/parse-requirements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();

    document.getElementById("entName").value = data.event_name;
    document.getElementById("entType").value = data.event_type;
    document.getElementById("entPax").value = data.participants;
    document.getElementById("entDuration").value = `${data.duration_days} Days (${data.start_date} - ${data.end_date})`;
    document.getElementById("entVenues").value = data.venues_requested.join(" + ") || "Main Auditorium";
    document.getElementById("entVolunteers").value = data.volunteers;
    document.getElementById("entBudget").value = `$${data.budget_limit.toLocaleString()}`;
    document.getElementById("entEquipment").value = data.equipment.join(", ");
  } catch (err) {
    console.error("Parse error:", err);
  }
}

async function handleSynthesizeFullPlan() {
  const prompt = document.getElementById("plannerInput").value.trim() || (
    "We are organizing a 2-day AI Innovation Hackathon for 300 students. We need one auditorium, three classrooms/labs, 20 volunteers, Wi-Fi, projectors, technical support, food arrangements and security. Budget: $4,500."
  );

  const btn = document.getElementById("btnSynthesizePlan");
  btn.innerText = "⏳ Multi-Agent Swarm Synthesizing Master Plan...";
  btn.disabled = true;

  try {
    const res = await fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const plan = await res.json();
    appState.activePlan = plan;
    await refreshGlobalData();
    alert("✨ Operational Plan Generated Successfully! Navigating to Executive Dashboard.");
    navigateTo("dashboard");
  } catch (err) {
    alert("Failed to synthesize plan: " + err.message);
  } finally {
    btn.innerText = "✨ Generate Complete Operational Plan";
    btn.disabled = false;
  }
}

/* ==================== 3. VENUES VIEW ==================== */
function renderVenuesView() {
  const container = document.getElementById("venuesCatalogGrid");
  container.innerHTML = "";

  appState.venues.forEach(v => {
    const card = document.createElement("div");
    card.className = `venue-card ${v.is_available ? '' : 'offline'}`;
    card.innerHTML = `
      <div>
        <div class="vc-top-row">
          <div class="vc-title">${v.name}</div>
          <span class="badge ${v.is_available ? 'badge-success' : 'badge-danger'}">
            ${v.is_available ? '● Available' : '● Maintenance / Offline'}
          </span>
        </div>
        <div class="vc-location">📍 ${v.location}</div>

        <div class="vc-specs-grid">
          <div class="vc-spec-item">👥 Capacity: <strong>${v.capacity} pax</strong></div>
          <div class="vc-spec-item">📽️ Projector: <strong>${v.projector ? 'Yes (4K)' : 'No'}</strong></div>
          <div class="vc-spec-item">🎙️ Microphones: <strong>${v.microphones} Units</strong></div>
          <div class="vc-spec-item">📶 Wi-Fi: <strong>${v.wifi ? 'Active 1Gbps' : 'Standard'}</strong></div>
          <div class="vc-spec-item">❄️ AC: <strong>${v.ac ? 'Climate Controlled' : 'Open Air'}</strong></div>
          <div class="vc-spec-item">♿ Accessibility: <strong>${v.accessibility ? 'ADA Compliant' : 'Partial'}</strong></div>
        </div>

        <div class="vc-amenities">
          ${v.amenities.map(a => `<span class="vc-amenity-tag">${a}</span>`).join("")}
        </div>
      </div>

      <div class="vc-footer-row">
        <span class="smart-score-badge" onclick="openWhyVenueModal('${v.id}')">
          Match Score: ${v.smart_score}% (Why? 🔍)
        </span>
        <button class="btn btn-sm ${v.is_available ? 'btn-outline' : 'btn-primary'}" onclick="toggleVenueAvailability('${v.id}')">
          ${v.is_available ? 'Toggle Offline' : 'Mark Online'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterVenues(category) {
  document.querySelectorAll(".pill-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  const cards = document.querySelectorAll(".venue-card");
  cards.forEach(c => {
    const title = c.querySelector(".vc-title").innerText.toLowerCase();
    if (category === "all") c.style.display = "flex";
    else if (category === "auditorium" && title.includes("auditorium")) c.style.display = "flex";
    else if (category === "labs" && title.includes("lab")) c.style.display = "flex";
    else if (category === "halls" && (title.includes("hall") || title.includes("amphitheatre"))) c.style.display = "flex";
    else c.style.display = "none";
  });
}

async function toggleVenueAvailability(venueId) {
  try {
    const res = await fetch("/api/venues/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ venue_id: venueId })
    });
    await refreshGlobalData();
    renderVenuesView();
  } catch (err) {
    console.error("Failed to toggle venue:", err);
  }
}

async function openWhyVenueModal(venueId) {
  try {
    const res = await fetch(`/api/venues/explain/${venueId}`);
    const data = await res.json();

    document.getElementById("whyVenueTitle").innerText = `Why was ${data.venue_name} selected? (Score: ${data.overall_score}%)`;
    const body = document.getElementById("whyVenueBody");
    body.innerHTML = `
      <p style="font-size:0.86rem; color:var(--text-main); margin-bottom:14px;">${data.explanation}</p>
      <h4 class="sub-section-title">Constraint Satisfaction Breakdown:</h4>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; font-size:0.8rem;">
        ${Object.entries(data.criteria_breakdown).map(([k, v]) => `
          <div style="background:var(--bg-input); padding:8px 10px; border-radius:6px;">
            <span style="color:var(--text-dim);">${k}:</span> <strong>${v}</strong>
          </div>
        `).join("")}
      </div>
    `;
    document.getElementById("whyVenueModal").style.display = "flex";
  } catch (err) {
    console.error(err);
  }
}

/* ==================== 4. RESOURCES VIEW ==================== */
function renderResourcesView() {
  const tbody = document.getElementById("resourceTableBody");
  tbody.innerHTML = "";

  appState.resources.forEach(r => {
    const tr = document.createElement("tr");
    const pct = intPct(r.allocated_qty, r.total_qty);
    tr.innerHTML = `
      <td><strong>${r.name}</strong></td>
      <td><span class="badge badge-primary">${r.category}</span></td>
      <td><strong>${r.total_qty}</strong></td>
      <td style="color:var(--primary); font-weight:700;">${r.allocated_qty}</td>
      <td style="color:var(--success); font-weight:700;">${r.available_qty}</td>
      <td style="color:${r.shortage_qty > 0 ? 'var(--danger)' : 'var(--text-dim)'}; font-weight:800;">
        ${r.shortage_qty > 0 ? `⚠️ ${r.shortage_qty}` : '0'}
      </td>
      <td style="width: 140px;">
        <div class="rc-track">
          <div class="rc-fill" style="width: ${pct}%; background: ${r.shortage_qty > 0 ? 'var(--danger)' : 'var(--primary)'}"></div>
        </div>
      </td>
      <td style="font-size:0.78rem; color:${r.shortage_qty > 0 ? '#fca5a5' : 'var(--text-muted)'};">
        ${r.ai_recommendation || 'Stock normal'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function intPct(num, total) {
  if (!total || total === 0) return 0;
  return Math.min(100, Math.round((num / total) * 100));
}

/* ==================== 5. VOLUNTEERS VIEW ==================== */
function renderVolunteersView() {
  const summaryBox = document.getElementById("volunteerTeamsSummary");
  summaryBox.innerHTML = "";

  const teams = [
    { name: "Registration Team", count: 4, lead: "Pooja Verma", icon: "🎫" },
    { name: "Technical Support", count: 5, lead: "Aarav Sharma", icon: "🔧" },
    { name: "Hospitality", count: 4, lead: "Ananya Iyer", icon: "🤝" },
    { name: "Security Coordination", count: 3, lead: "Vikram Rathore", icon: "👮" },
    { name: "General Support", count: 4, lead: "Sneha Patel", icon: "🏃" }
  ];

  teams.forEach(t => {
    const card = document.createElement("div");
    card.className = "vt-summary-card";
    card.innerHTML = `
      <div class="vt-title">${t.icon} ${t.name} (${t.count})</div>
      <div class="vt-lead">👤 Team Lead: <strong>${t.lead}</strong></div>
    `;
    summaryBox.appendChild(card);
  });

  const rosterGrid = document.getElementById("volunteersRosterGrid");
  rosterGrid.innerHTML = "";

  appState.volunteers.forEach(v => {
    const card = document.createElement("div");
    card.className = "vol-card";
    card.innerHTML = `
      <div class="vol-card-top">
        <span class="vol-name">${v.name} (${v.department} - Yr ${v.year})</span>
        <span class="badge badge-accent">${v.team_name}</span>
      </div>
      <div style="font-size:0.76rem; color:var(--text-muted);">🎯 Role: <strong>${v.assigned_role}</strong> | 📞 ${v.phone}</div>
      <div style="font-size:0.72rem; color:var(--text-dim); margin-top:4px;">Skills: ${v.skills.join(", ")}</div>
    `;
    rosterGrid.appendChild(card);
  });
}

/* ==================== 6. SCHEDULE VIEW ==================== */
function renderScheduleView() {
  const container = document.getElementById("scheduleTimelineContainer");
  container.innerHTML = "";

  appState.schedule.forEach(s => {
    const block = document.createElement("div");
    block.className = "schedule-block";
    block.innerHTML = `
      <div class="sb-time-col">${s.start_time} - ${s.end_time}</div>
      <div class="sb-main-col">
        <div class="sb-activity">${s.activity}</div>
        <div class="sb-meta-row">
          <span>🏛️ Venue: <strong>${s.venue_name}</strong></span>
          <span>👥 Team: <strong>${s.responsible_team}</strong></span>
          <span>🛠️ Gear: <strong>${s.required_resources.join(", ")}</strong></span>
        </div>
      </div>
      <div>
        <span class="badge ${s.status === 'Relocated' ? 'badge-warning' : 'badge-success'}">${s.status}</span>
      </div>
    `;
    container.appendChild(block);
  });
}

/* ==================== 7. TASKS VIEW ==================== */
function renderTasksView() {
  const container = document.getElementById("tasksPhasesContainer");
  container.innerHTML = "";

  appState.tasks.forEach(t => {
    const card = document.createElement("div");
    card.className = "task-item-card";
    card.innerHTML = `
      <div class="tic-header">
        <span class="tic-phase">${t.milestone_phase}</span>
        <span class="badge ${t.priority === 'Critical' ? 'badge-danger' : t.priority === 'High' ? 'badge-warning' : 'badge-info'}">
          ${t.priority}
        </span>
      </div>
      <div class="tic-title">${t.name}</div>
      <div class="tic-lead">👤 Assigned: <strong>${t.assigned_team}</strong> (${t.assigned_lead}) | 📅 Deadline: <strong>${t.deadline}</strong></div>
      
      <div class="tic-checklist">
        ${(t.checklist || []).map((ci, idx) => `
          <label class="check-row ${ci.done ? 'done' : ''}">
            <input type="checkbox" ${ci.done ? 'checked' : ''} onchange="toggleTaskItem('${t.id}', ${idx})" />
            <span>${ci.item}</span>
          </label>
        `).join("")}
      </div>
    `;
    container.appendChild(card);
  });
}

async function toggleTaskItem(taskId, itemIdx) {
  try {
    await fetch("/api/tasks/toggle-checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_id: taskId, item_index: itemIdx })
    });
    await refreshGlobalData();
    renderTasksView();
  } catch (err) {
    console.error(err);
  }
}

/* ==================== 8. CONFLICTS VIEW ==================== */
function renderConflictsView() {
  const container = document.getElementById("conflictsListContainer");
  container.innerHTML = "";

  if (appState.conflicts.length === 0) {
    container.innerHTML = `<div class="dash-card text-center text-success">✅ Zero Constraint Collisions. All facilities and timetables clear!</div>`;
    return;
  }

  appState.conflicts.forEach(c => {
    const box = document.createElement("div");
    box.className = `conflict-box ${c.resolved ? 'resolved' : ''}`;
    box.innerHTML = `
      <div class="cb-header">
        <span class="cb-title">${c.resolved ? '✓ [RESOLVED] ' : '⚠️ '}${c.title}</span>
        <span class="badge ${c.severity === 'Critical' ? 'badge-danger' : 'badge-warning'}">${c.severity}</span>
      </div>
      <div class="cb-desc">${c.description}</div>
      <div class="cb-recs-box">
        <div class="cb-recs-label">AI Fallback Recommendations:</div>
        ${c.recommended_alternatives.map(rec => `
          <div class="cb-rec-row">
            <span>• ${rec}</span>
            ${!c.resolved ? `
              <button class="btn btn-sm btn-outline" onclick="applyConflictFix('${c.id}', '${rec.replace(/'/g, "\\'")}')">
                Apply Recommendation
              </button>
            ` : ''}
          </div>
        `).join("")}
      </div>
    `;
    container.appendChild(box);
  });
}

async function applyConflictFix(conflictId, resolution) {
  try {
    await fetch("/api/conflicts/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conflict_id: conflictId, resolution })
    });
    await refreshGlobalData();
    renderConflictsView();
  } catch (err) {
    console.error(err);
  }
}

/* ==================== 9. APPROVALS (HITL) ==================== */
function renderApprovalsView() {
  const container = document.getElementById("approvalsListContainer");
  container.innerHTML = "";

  appState.approvals.forEach(a => {
    const box = document.createElement("div");
    box.className = `approval-box ${a.status.toLowerCase()}`;
    box.innerHTML = `
      <div class="ap-info">
        <h4>${a.title}</h4>
        <div class="ap-role">👤 Required Sign-off: <strong>${a.approver_role}</strong> | Risk Level: <strong>${a.risk_level}</strong></div>
        <p class="ap-desc">${a.reason} <em>(Impact: ${a.impact})</em></p>
        ${a.approver_name ? `<p style="font-size:0.75rem; color:var(--success); margin-top:4px;">✍️ Signed by ${a.approver_name} (${a.comments})</p>` : ''}
      </div>
      <div>
        ${a.status === 'Pending' ? `
          <button class="btn btn-sm btn-primary" onclick="openApprovalModal('${a.id}', '${a.title}', '${a.approver_role}')">
            ✍️ Endorse Ticket
          </button>
        ` : `
          <span class="badge ${a.status === 'Approved' ? 'badge-success' : 'badge-danger'}">${a.status}</span>
        `}
      </div>
    `;
    container.appendChild(box);
  });
}

function openApprovalModal(appId, title, role) {
  appState.selectedApprovalId = appId;
  document.getElementById("approvalModalTitle").innerText = `Sign-off: ${title}`;
  document.getElementById("approvalModalDesc").innerText = `Institutional endorsement required from ${role}.`;
  document.getElementById("modalApproverName").value = role.split("(")[0].trim();
  document.getElementById("approvalModal").style.display = "flex";
}

async function submitModalApproval(action) {
  if (!appState.selectedApprovalId) return;
  const name = document.getElementById("modalApproverName").value.trim() || "Authorized Official";
  const comments = document.getElementById("modalComments").value.trim() || "Authorized electronically";

  try {
    await fetch("/api/approvals/signoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approval_id: appState.selectedApprovalId,
        approver_name: name,
        action: action,
        comments: comments
      })
    });
    closeModal("approvalModal");
    await refreshGlobalData();
    renderApprovalsView();
  } catch (err) {
    console.error(err);
  }
}

/* ==================== 10. NOTIFICATIONS VIEW ==================== */
function renderNotificationsView() {
  const list = document.getElementById("notifCenterList");
  list.innerHTML = "";

  appState.notifications.forEach(n => {
    const item = document.createElement("div");
    const pClass = (n.priority || "Info").toLowerCase();
    item.className = `notif-item ${pClass}`;
    item.innerHTML = `
      <div class="notif-item-header">
        <span class="notif-item-title">${n.title}</span>
        <span class="notif-item-time">${n.timestamp}</span>
      </div>
      <div class="notif-item-msg">${n.message}</div>
    `;
    list.appendChild(item);
  });
}

function filterNotifs(pri) {
  document.querySelectorAll("#view-notifications .pill-btn").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");

  const items = document.querySelectorAll("#notifCenterList .notif-item");
  items.forEach(it => {
    if (pri === "ALL" || it.classList.contains(pri.toLowerCase())) it.style.display = "block";
    else it.style.display = "none";
  });
}

/* ==================== 11. EVENTS VIEW ==================== */
function renderEventsView() {
  const container = document.getElementById("eventsListContainer");
  container.innerHTML = "";

  const plan = appState.activePlan;
  if (!plan) return;

  const card = document.createElement("div");
  card.className = "dash-card";
  card.innerHTML = `
    <div class="card-header-bar">
      <div class="card-header-title">
        <span class="header-icon">🎪</span>
        <h3>${plan.requirement.event_name} (${plan.requirement.event_type})</h3>
      </div>
      <span class="badge badge-success">${plan.status}</span>
    </div>
    <div class="spotlight-meta-grid">
      <div><span>Event ID:</span> <strong>${plan.event_id}</strong></div>
      <div><span>Footfall:</span> <strong>${plan.requirement.participants} Pax</strong></div>
      <div><span>Dates:</span> <strong>${plan.requirement.start_date} to ${plan.requirement.end_date}</strong></div>
      <div><span>Venues:</span> <strong>${plan.venues.map(v => v.name).join(", ")}</strong></div>
      <div><span>Budget:</span> <strong>$${plan.estimated_cost.toLocaleString()} (Cap: $${plan.requirement.budget_limit.toLocaleString()})</strong></div>
      <div><span>Readiness:</span> <strong class="text-success">${plan.readiness_score}%</strong></div>
    </div>
    <div class="action-btn-row mt-3">
      <button class="btn btn-outline" onclick="navigateTo('schedule')">View Schedule</button>
      <button class="btn btn-outline" onclick="navigateTo('tasks')">Tasks</button>
      <button class="btn btn-primary" onclick="exportOperationalPlanModal()">📄 Export Master Brief</button>
    </div>
  `;
  container.appendChild(card);
}

/* ==================== 12. DYNAMIC REPLANNING (WHAT IF?) ==================== */
async function triggerSimulation(disruptionType, description, timeOffset, venueId) {
  document.getElementById("simResultsContainer").style.display = "none";
  document.getElementById("simLoadingBox").style.display = "block";

  // Simulate realistic multi-step agent reasoning latency
  setTimeout(async () => {
    try {
      const res = await fetch("/api/simulation/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disruption_type: disruptionType,
          description: description,
          time_offset_minutes: timeOffset,
          venue_id: venueId
        })
      });
      const data = await res.json();
      appState.lastSimResult = data;

      document.getElementById("simLoadingBox").style.display = "none";
      renderSimulationResults(data);
      document.getElementById("simResultsContainer").style.display = "block";
    } catch (err) {
      alert("Simulation error: " + err.message);
      document.getElementById("simLoadingBox").style.display = "none";
    }
  }, 900);
}

function renderSimulationResults(res) {
  document.getElementById("simImpactTitle").innerText = `Impact Analysis: ${res.incident.incident_type}`;
  document.getElementById("simImpactDesc").innerText = res.impact_summary;

  // BEFORE / AFTER COMPARISON
  const ba = res.before_after_diff || {};
  const beforeBox = document.getElementById("baBeforeBox");
  const afterBox = document.getElementById("baAfterBox");

  const b = ba.before || {};
  beforeBox.innerHTML = `
    <div style="font-size:0.95rem; font-weight:800; color:var(--text-main);">${ba.session_name || 'Session'}</div>
    <div style="margin-top:6px; font-size:0.82rem; color:var(--text-muted);">
      🏛️ <strong>${b.venue || 'Original Venue'}</strong><br/>
      ⏰ ${b.time || '10:00 AM'}<br/>
      ⚠️ Status: <span style="color:var(--danger); font-weight:700;">${b.status || 'Offline'}</span>
    </div>
  `;

  const a = ba.after || {};
  afterBox.innerHTML = `
    <div style="font-size:0.95rem; font-weight:800; color:var(--text-main);">${ba.session_name || 'Session'}</div>
    <div style="margin-top:6px; font-size:0.82rem; color:var(--text-muted);">
      🏛️ <strong>${a.venue || 'Innovation Hall'}</strong><br/>
      ⏰ ${a.time || '10:00 AM'}<br/>
      ✓ Status: <span style="color:var(--success); font-weight:700;">${a.status || 'Confirmed'}</span>
    </div>
  `;

  document.getElementById("baRationaleText").innerText = ba.explanation || res.impact_summary;

  // Render 2-3 Ranked Candidates
  const candGrid = document.getElementById("simCandidatesGrid");
  candGrid.innerHTML = "";

  (res.candidate_alternatives || []).forEach((c, idx) => {
    const card = document.createElement("div");
    card.className = `candidate-card ${idx === 0 ? 'top-pick' : ''}`;
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <strong>#${idx+1} ${c.venue_name}</strong>
        <span class="badge ${idx === 0 ? 'badge-success' : 'badge-primary'}">Score: ${c.score}%</span>
      </div>
      <div style="font-size:0.78rem; color:var(--text-muted);">👥 Capacity: ${c.capacity} pax | ⚠️ Conflicts: ${c.schedule_conflict_count}</div>
      <div style="font-size:0.75rem; color:var(--text-dim); margin-top:4px;">${c.equipment_match}</div>
      <p style="font-size:0.78rem; color:var(--text-main); margin-top:6px;">${c.reason}</p>
    `;
    candGrid.appendChild(card);
  });

  // Urgent Injected Tasks
  const taskBox = document.getElementById("simUrgentTasksList");
  taskBox.innerHTML = "";
  (res.urgent_tasks || []).forEach(t => {
    const item = document.createElement("div");
    item.style.padding = "8px 0";
    item.style.borderBottom = "1px solid var(--border-subtle)";
    item.innerHTML = `
      <div style="font-weight:700; color:var(--danger); font-size:0.84rem;">🚨 ${t.name}</div>
      <div style="font-size:0.76rem; color:var(--text-dim);">Assigned: ${t.assigned_team} (${t.assigned_lead}) | Deadline: ${t.deadline}</div>
    `;
    taskBox.appendChild(item);
  });

  // Alerts
  const alertBox = document.getElementById("simAlertsList");
  alertBox.innerHTML = "";
  (res.stakeholder_alerts || []).forEach(al => {
    const item = document.createElement("div");
    item.style.padding = "8px 0";
    item.style.borderBottom = "1px solid var(--border-subtle)";
    item.innerHTML = `
      <div style="font-weight:700; color:var(--warning); font-size:0.84rem;">📢 Target: ${al.target} (${al.channel})</div>
      <div style="font-size:0.78rem; color:var(--text-muted);">${al.message}</div>
    `;
    alertBox.appendChild(item);
  });
}

async function applyReplannedPlan() {
  try {
    await fetch("/api/simulation/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    await refreshGlobalData();
    alert("✅ Approved! Dynamic changes applied to active operational plan and live schedule.");
    navigateTo("dashboard");
  } catch (err) {
    alert("Failed to apply replanning: " + err.message);
  }
}

function cancelSimulation() {
  document.getElementById("simResultsContainer").style.display = "none";
}

/* ==================== 13. EXPORT OPERATIONAL PLAN ==================== */
async function exportOperationalPlanModal() {
  try {
    const res = await fetch("/api/briefings");
    const briefings = await res.json();

    const plan = appState.activePlan;
    const planText = briefings.executive_briefing || (
      `CAMPUS ORBIT - OPERATIONAL EVENT PLAN\n=====================================\nEvent: ${plan.requirement.event_name}\nReadiness: ${plan.readiness_score}%\nEstimated Cost: $${plan.estimated_cost}`
    );

    document.getElementById("exportBriefBox").innerText = planText;
    document.getElementById("exportModal").style.display = "flex";
  } catch (err) {
    console.error(err);
  }
}

/* ==================== UTILS ==================== */
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

function toggleMobileSidebar() {
  document.querySelector(".sidebar").classList.toggle("open");
}

/* ==================== 14. AUTHENTICATION & ACCESS ENGINE ==================== */
async function checkAuthStatus() {
  try {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    if (data && data.authenticated && data.user) {
      appState.currentUser = data.user;
      updateUserHeaderUI(data.user);
    } else {
      appState.currentUser = null;
      updateUserHeaderUI(null);
    }
  } catch (err) {
    console.error("Auth check failed:", err);
  }
}

function updateUserHeaderUI(user) {
  const avatarEl = document.getElementById("topUserAvatar");
  const nameEl = document.getElementById("topUserName");
  const roleEl = document.getElementById("topUserRole");
  const btnLogoutEl = document.getElementById("topBtnLogout");
  const authStatusTextEl = document.getElementById("authStatusText");
  const authBannerEl = document.getElementById("authSessionStatusBanner");

  if (user) {
    if (avatarEl) avatarEl.innerText = user.avatar || "CO";
    if (nameEl) nameEl.innerText = user.name;
    if (roleEl) roleEl.innerText = user.role;
    if (btnLogoutEl) btnLogoutEl.style.display = "inline-flex";
    if (authStatusTextEl) authStatusTextEl.innerText = `Signed In: ${user.name} (${user.role})`;
    if (authBannerEl) authBannerEl.classList.remove("logged-out");
  } else {
    if (avatarEl) avatarEl.innerText = "??";
    if (nameEl) nameEl.innerText = "Guest User";
    if (roleEl) roleEl.innerText = "Click to Sign In";
    if (btnLogoutEl) btnLogoutEl.style.display = "none";
    if (authStatusTextEl) authStatusTextEl.innerText = "Not Signed In (Guest Access)";
    if (authBannerEl) authBannerEl.classList.add("logged-out");
  }
}

function switchAuthTab(tab) {
  const formLogin = document.getElementById("formLogin");
  const formSignup = document.getElementById("formSignup");
  const tabBtnLogin = document.getElementById("tabBtnLogin");
  const tabBtnSignup = document.getElementById("tabBtnSignup");
  const alertBox = document.getElementById("authAlertBox");

  if (alertBox) alertBox.style.display = "none";

  if (tab === "login") {
    if (formLogin) formLogin.style.display = "block";
    if (formSignup) formSignup.style.display = "none";
    if (tabBtnLogin) tabBtnLogin.classList.add("active");
    if (tabBtnSignup) tabBtnSignup.classList.remove("active");
  } else {
    if (formLogin) formLogin.style.display = "none";
    if (formSignup) formSignup.style.display = "block";
    if (tabBtnLogin) tabBtnLogin.classList.remove("active");
    if (tabBtnSignup) tabBtnSignup.classList.add("active");
  }
}

function quickFillLogin(email, password, role) {
  switchAuthTab("login");
  const emailInput = document.getElementById("loginEmail");
  const passInput = document.getElementById("loginPassword");
  const roleInput = document.getElementById("loginRole");

  if (emailInput) emailInput.value = email;
  if (passInput) passInput.value = password;
  if (roleInput) roleInput.value = role;

  // Highlight selected chip
  document.querySelectorAll(".demo-chip-btn").forEach(btn => {
    btn.classList.toggle("active", btn.innerText.includes(email));
  });

  showAuthAlert(`⚡ Fast Demo Account Selected: ${role} (${email}). Click 'Sign In' below to enter.`, "success");
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const btn = document.getElementById("btnLoginSubmit");

  btn.innerText = "⏳ Authenticating...";
  btn.disabled = true;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success && data.user) {
      appState.currentUser = data.user;
      updateUserHeaderUI(data.user);
      showAuthAlert(`✅ Welcome back, ${data.user.name}! Redirecting to Operations Console...`, "success");
      setTimeout(() => {
        navigateTo("dashboard");
      }, 700);
    } else {
      showAuthAlert(`❌ ${data.message || "Invalid email or password."}`, "danger");
    }
  } catch (err) {
    showAuthAlert(`❌ Network error: ${err.message}`, "danger");
  } finally {
    btn.innerText = "🚀 Sign In to Operations Console";
    btn.disabled = false;
  }
}

async function handleSignupSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const dept = document.getElementById("signupDept").value.trim();
  const role = document.getElementById("signupRole").value;
  const phone = document.getElementById("signupPhone").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;
  const btn = document.getElementById("btnSignupSubmit");

  if (password !== confirmPassword) {
    showAuthAlert("❌ Passwords do not match. Please verify and retry.", "danger");
    return;
  }

  btn.innerText = "⏳ Provisioning Account...";
  btn.disabled = true;

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        department: dept,
        phone
      })
    });
    const data = await res.json();

    if (data.success && data.user) {
      appState.currentUser = data.user;
      updateUserHeaderUI(data.user);
      showAuthAlert(`✨ Account created successfully for ${data.user.name}! Welcome to Campus Orbit. Redirecting...`, "success");
      setTimeout(() => {
        navigateTo("dashboard");
      }, 800);
    } else {
      showAuthAlert(`❌ Registration failed: ${data.message}`, "danger");
    }
  } catch (err) {
    showAuthAlert(`❌ Network error: ${err.message}`, "danger");
  } finally {
    btn.innerText = "✨ Create Account & Enter Operations Console";
    btn.disabled = false;
  }
}

function promptLogout() {
  document.getElementById("logoutModal").style.display = "flex";
}

async function executeLogout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    appState.currentUser = null;
    updateUserHeaderUI(null);
    closeModal("logoutModal");
    navigateTo("auth");
    showAuthAlert("👋 You have been logged out of Campus Orbit safely. Sign in to resume operations.", "success");
  } catch (err) {
    console.error("Logout failed:", err);
  }
}

function showAuthAlert(message, type = "success") {
  const box = document.getElementById("authAlertBox");
  if (!box) return;
  box.className = `auth-alert ${type}`;
  box.innerHTML = message;
  box.style.display = "block";
}

/* ==================== 15. SVG QR CODE GENERATOR ==================== */
function generateQRCodeSVG(text, size = 140) {
  const modules = 21;
  const cellSize = size / modules;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`;
  svg += `<rect width="${size}" height="${size}" fill="#ffffff"/>`;

  function drawFinderPattern(startX, startY) {
    svg += `<rect x="${startX * cellSize}" y="${startY * cellSize}" width="${7 * cellSize}" height="${7 * cellSize}" fill="#000000"/>`;
    svg += `<rect x="${(startX + 1) * cellSize}" y="${(startY + 1) * cellSize}" width="${5 * cellSize}" height="${5 * cellSize}" fill="#ffffff"/>`;
    svg += `<rect x="${(startX + 2) * cellSize}" y="${(startY + 2) * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" fill="#000000"/>`;
  }

  drawFinderPattern(0, 0);
  drawFinderPattern(modules - 7, 0);
  drawFinderPattern(0, modules - 7);

  // Timing lines
  for (let i = 8; i < modules - 8; i++) {
    if (i % 2 === 0) {
      svg += `<rect x="${i * cellSize}" y="${6 * cellSize}" width="${cellSize}" height="${cellSize}" fill="#000000"/>`;
      svg += `<rect x="${6 * cellSize}" y="${i * cellSize}" width="${cellSize}" height="${cellSize}" fill="#000000"/>`;
    }
  }

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) continue;
      if (r === 6 || c === 6) continue;
      const val = (Math.abs(hash ^ (r * 37 + c * 19 + text.charCodeAt((r + c) % text.length))) % 100);
      if (val > 42) {
        svg += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#000000"/>`;
      }
    }
  }

  svg += `</svg>`;
  return svg;
}

/* ==================== 16. EVENTS ARENA & CATALOG ==================== */
function renderEventsView() {
  const container = document.getElementById("eventsCatalogGrid");
  if (!container) return;
  container.innerHTML = "";

  const events = appState.eventsCatalog || [];
  const filter = appState.catalogFilter || "all";

  const filtered = events.filter(e => {
    if (filter === "all") return true;
    if (filter === "hackathon") return e.category.toLowerCase().includes("hackathon") || e.category.toLowerCase().includes("coding");
    if (filter === "competitions") return e.category.toLowerCase().includes("arena") || e.category.toLowerCase().includes("duel") || e.category.toLowerCase().includes("teaser") || e.category.toLowerCase().includes("speech") || e.category.toLowerCase().includes("hunt") || e.category.toLowerCase().includes("art");
    if (filter === "summits") return e.category.toLowerCase().includes("summit") || e.category.toLowerCase().includes("podcast") || e.category.toLowerCase().includes("showcase");
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="dash-card text-center text-muted">No events match this filter.</div>`;
    return;
  }

  filtered.forEach(ev => {
    const card = document.createElement("div");
    card.className = "event-catalog-card";
    card.innerHTML = `
      <div>
        <div class="event-card-top">
          <span class="event-category-tag">${ev.category}</span>
          <span class="badge badge-primary" style="font-size:0.75rem; font-weight:700;">📅 ${ev.event_date}</span>
        </div>
        <h3 class="event-card-title">${ev.name}</h3>
        <p class="event-card-desc">${ev.description}</p>
      </div>

      <!-- Cash Prize Podium Breakdown (Max ₹10,000 | Min ₹3,000) -->
      <div class="prize-podium-box">
        <div class="prize-badge-item prize-rank-1st">
          <span class="prize-rank-label">🥇 1st Prize</span>
          <span class="prize-amount">${ev.prize_1st}</span>
        </div>
        <div class="prize-badge-item prize-rank-2nd">
          <span class="prize-rank-label">🥈 2nd Prize</span>
          <span class="prize-amount">${ev.prize_2nd}</span>
        </div>
        <div class="prize-badge-item prize-rank-3rd">
          <span class="prize-rank-label">🥉 3rd Prize</span>
          <span class="prize-amount">${ev.prize_3rd}</span>
        </div>
      </div>

      <!-- Guaranteed Participation Certificate -->
      <div class="certificate-tag-banner">
        <span>📜</span>
        <span>Guaranteed Digital Certificate for All Participants</span>
      </div>

      <div>
        <div class="event-meta-footer">
          <span>🏛️ ${ev.venue_name}</span>
          <span>⏰ ${ev.schedule_time}</span>
        </div>
        <div class="event-meta-footer mt-1" style="border-top:none; padding-top:4px;">
          <span>👥 Capacity: ${ev.max_participants} Pax (${ev.current_registrations} Registered)</span>
          <button class="btn btn-sm btn-primary" onclick="openRegistrationForEvent('${ev.id}')">
            📝 Register Now
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterEventCatalog(filterCategory) {
  appState.catalogFilter = filterCategory;
  document.querySelectorAll("#view-events .pill-btn").forEach(btn => {
    btn.classList.toggle("active", btn.innerText.toLowerCase().includes(filterCategory) || (filterCategory === "all" && btn.innerText.includes("All")));
  });
  renderEventsView();
}

function openRegistrationForEvent(eventId) {
  navigateTo("registration");
  const select = document.getElementById("regEventSelect");
  if (select) {
    select.value = eventId;
  }
}

/* ==================== 17. PARTICIPANT REGISTRATION & DIGITAL PASS ==================== */
function renderRegistrationView() {
  if (!appState.currentTicket && appState.participants.length > 0) {
    renderDigitalTicket(appState.participants[0]);
  }
}

async function handleParticipantRegister(e) {
  e.preventDefault();
  const name = document.getElementById("regFullName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const college = document.getElementById("regCollege").value.trim();
  const dept = document.getElementById("regDept").value.trim();
  const eventId = document.getElementById("regEventSelect").value;
  const btn = document.getElementById("btnSubmitRegistration");

  btn.innerText = "⏳ Generating QR Credentials...";
  btn.disabled = true;

  try {
    const res = await fetch("/api/participants/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: name,
        email: email,
        phone: phone,
        college: college,
        department: dept,
        event_id: eventId
      })
    });
    const data = await res.json();

    if (data.success && data.registration) {
      appState.currentTicket = data.registration;
      appState.participants.push(data.registration);
      renderDigitalTicket(data.registration);
      updateSidebarBadges();
      alert(`🎉 Registration Confirmed for ${data.registration.full_name} (${data.registration.event_date})!\nYour Digital QR Pass is ready.`);
    } else {
      alert(`❌ Registration failed: ${data.message}`);
    }
  } catch (err) {
    alert("Network error during registration: " + err.message);
  } finally {
    btn.innerText = "🎟️ Register & Generate Unique QR Entry Pass";
    btn.disabled = false;
  }
}

function renderDigitalTicket(reg) {
  appState.currentTicket = reg;
  const qrBox = document.getElementById("ticketQRBox");
  if (qrBox) {
    qrBox.innerHTML = generateQRCodeSVG(reg.qr_code_data || reg.id, 140);
  }

  const nameEl = document.getElementById("ticketName");
  if (nameEl) nameEl.innerText = reg.full_name;

  const idEl = document.getElementById("ticketRegId");
  if (idEl) idEl.innerText = `ID: ${reg.id}`;

  const eventEl = document.getElementById("ticketEventName");
  if (eventEl) eventEl.innerText = `${reg.event_name} (${reg.event_date || 'Aug 28, 2026'})`;

  const colEl = document.getElementById("ticketCollege");
  if (colEl) colEl.innerText = reg.college || "Campus University";

  const deptEl = document.getElementById("ticketDept");
  if (deptEl) deptEl.innerText = reg.department || "Engineering";

  const statusPill = document.getElementById("ticketStatusPill");
  const checkinStatusEl = document.getElementById("ticketCheckinStatus");

  if (reg.checked_in) {
    if (statusPill) {
      statusPill.innerText = "✓ CHECKED IN";
      statusPill.style.background = "rgba(16, 185, 129, 0.2)";
      statusPill.style.borderColor = "var(--success)";
      statusPill.style.color = "var(--success)";
    }
    if (checkinStatusEl) {
      checkinStatusEl.innerText = `Checked In (${reg.check_in_time || 'Verified'})`;
      checkinStatusEl.className = "text-success";
    }
  } else {
    if (statusPill) {
      statusPill.innerText = "● REGISTERED";
      statusPill.style.background = "rgba(56, 189, 248, 0.2)";
      statusPill.style.borderColor = "var(--primary)";
      statusPill.style.color = "var(--primary)";
    }
    if (checkinStatusEl) {
      checkinStatusEl.innerText = "Pending Gate Check-In";
      checkinStatusEl.className = "text-warning";
    }
  }
}

async function testCheckInCurrentTicket() {
  if (!appState.currentTicket) return;
  const qrString = appState.currentTicket.qr_code_data || appState.currentTicket.id;
  
  try {
    const res = await fetch("/api/checkin/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qr_data: qrString, gate: "Main Entrance Gate A" })
    });
    const data = await res.json();
    if (data.participant) {
      appState.currentTicket = data.participant;
      const idx = appState.participants.findIndex(p => p.id === data.participant.id);
      if (idx !== -1) appState.participants[idx] = data.participant;
      renderDigitalTicket(data.participant);
      updateSidebarBadges();
    }
    alert(data.message);
  } catch (err) {
    alert("Test scan error: " + err.message);
  }
}

/* ==================== 18. QR EVENT CHECK-IN SYSTEM ==================== */
async function renderCheckinView() {
  await refreshCheckinStats();
  renderParticipantsTable();
}

async function refreshCheckinStats() {
  try {
    const res = await fetch("/api/checkin/stats");
    const stats = await res.json();
    appState.checkinStats = stats;

    const partsRes = await fetch("/api/participants");
    appState.participants = await partsRes.json();

    const totalReg = stats.total_registered || appState.participants.length;
    const totalIn = stats.total_checked_in !== undefined ? stats.total_checked_in : appState.participants.filter(p => p.checked_in).length;
    const rate = stats.checkin_rate !== undefined ? stats.checkin_rate : Math.round((totalIn / Math.max(1, totalReg)) * 100);

    const totalRegEl = document.getElementById("cmTotalRegistered");
    if (totalRegEl) totalRegEl.innerText = totalReg;

    const totalInEl = document.getElementById("cmTotalCheckedIn");
    if (totalInEl) totalInEl.innerText = totalIn;

    const rateEl = document.getElementById("cmAttendanceRate");
    if (rateEl) rateEl.innerText = `${rate}%`;

    const progPctEl = document.getElementById("cmProgressPct");
    if (progPctEl) progPctEl.innerText = `${rate}% (${totalIn}/${totalReg})`;

    const progBarEl = document.getElementById("cmProgressBar");
    if (progBarEl) progBarEl.style.width = `${rate}%`;

    renderLiveCheckinFeed();
    updateSidebarBadges();
  } catch (err) {
    console.error("Failed to refresh check-in stats:", err);
  }
}

function renderLiveCheckinFeed() {
  const feed = document.getElementById("liveCheckinFeed");
  if (!feed) return;
  feed.innerHTML = "";

  const checkedInList = appState.participants.filter(p => p.checked_in);
  if (checkedInList.length === 0) {
    feed.innerHTML = `<div class="text-muted" style="font-size:0.8rem;">No attendees checked in yet. Scan a QR code to begin.</div>`;
    return;
  }

  checkedInList.slice(-6).reverse().forEach(p => {
    const item = document.createElement("div");
    item.className = "checkin-feed-item";
    item.innerHTML = `
      <div>
        <strong style="color:var(--text-main);">${p.full_name}</strong>
        <div style="font-size:0.7rem; color:var(--text-muted);">${p.event_name} (${p.college})</div>
      </div>
      <div style="text-align:right;">
        <span class="badge badge-success" style="font-size:0.7rem;">✓ Verified</span>
        <div style="font-size:0.68rem; color:var(--primary); margin-top:2px;">${p.check_in_time || 'Just now'}</div>
      </div>
    `;
    feed.appendChild(item);
  });
}

function renderParticipantsTable(filteredList = null) {
  const tbody = document.getElementById("participantsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const list = filteredList || appState.participants || [];

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="padding:20px;">No participant records found.</td></tr>`;
    return;
  }

  list.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${p.id}</strong></td>
      <td>${p.full_name}</td>
      <td><span style="font-size:0.78rem;">${p.email}</span><br/><span style="font-size:0.72rem; color:var(--text-dim);">${p.phone}</span></td>
      <td>${p.college}<br/><span style="font-size:0.72rem; color:var(--text-muted);">${p.department}</span></td>
      <td><span class="badge badge-primary" style="font-size:0.72rem;">${p.event_name}</span></td>
      <td>
        <span class="badge ${p.checked_in ? 'badge-success' : 'badge-warning'}">
          ${p.checked_in ? '● Checked In' : '○ Pending'}
        </span>
      </td>
      <td>${p.checked_in ? `<strong>${p.check_in_time}</strong><br/><span style="font-size:0.68rem; color:var(--text-muted);">${p.check_in_gate}</span>` : '—'}</td>
      <td>
        ${!p.checked_in ? `
          <button class="btn btn-sm btn-primary" onclick="quickCheckIn('${p.id}')">
            ⚡ Check In
          </button>
        ` : `
          <button class="btn btn-sm btn-outline" onclick="renderDigitalTicketFromTable('${p.id}')">
            🎟️ View Pass
          </button>
        `}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterParticipantsTable() {
  const q = (document.getElementById("participantSearchInput")?.value || "").toLowerCase().trim();
  if (!q) {
    renderParticipantsTable(appState.participants);
    return;
  }
  const filtered = appState.participants.filter(p => 
    p.full_name.toLowerCase().includes(q) ||
    p.email.toLowerCase().includes(q) ||
    p.id.toLowerCase().includes(q) ||
    p.event_name.toLowerCase().includes(q) ||
    p.college.toLowerCase().includes(q)
  );
  renderParticipantsTable(filtered);
}

async function handleScanSubmit() {
  const input = document.getElementById("scanInput");
  const query = input ? input.value.trim() : "";
  if (!query) {
    alert("Please enter a Participant ID or scanned QR Code string.");
    return;
  }

  const feedbackBox = document.getElementById("scanFeedbackBox");

  try {
    const res = await fetch("/api/checkin/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qr_data: query, gate: "Main Entrance Gate A" })
    });
    const data = await res.json();

    if (feedbackBox) {
      feedbackBox.style.display = "block";
      feedbackBox.className = `auth-alert ${data.success ? 'success' : 'danger'}`;
      feedbackBox.innerHTML = `
        <strong>${data.success ? '✓ Scan Verified:' : '❌ Scan Error:'}</strong> ${data.message}
      `;
    }

    if (data.success && data.participant) {
      const idx = appState.participants.findIndex(p => p.id === data.participant.id);
      if (idx !== -1) appState.participants[idx] = data.participant;
      appState.currentTicket = data.participant;
      input.value = "";
      await refreshCheckinStats();
      renderParticipantsTable();
    }
  } catch (err) {
    alert("Scan submission error: " + err.message);
  }
}

async function simulateRandomCheckIn() {
  const pending = appState.participants.filter(p => !p.checked_in);
  const target = pending.length > 0 ? pending[Math.floor(Math.random() * pending.length)] : appState.participants[0];
  if (!target) return;

  const scanInput = document.getElementById("scanInput");
  if (scanInput) scanInput.value = target.qr_code_data || target.id;
  await handleScanSubmit();
}

async function quickCheckIn(participantId) {
  const scanInput = document.getElementById("scanInput");
  if (scanInput) scanInput.value = participantId;
  await handleScanSubmit();
}

function renderDigitalTicketFromTable(participantId) {
  const p = appState.participants.find(item => item.id === participantId);
  if (p) {
    renderDigitalTicket(p);
    navigateTo("registration");
  }
}

/* ==================== 19. ORBIT AI CHATBOT ==================== */
async function renderChatbotView() {
  try {
    const res = await fetch("/api/chatbot/history");
    const history = await res.json();
    appState.chatHistory = history;
    renderChatMessages(history);
  } catch (err) {
    console.error("Failed to load chat history:", err);
  }
}

function renderChatMessages(history) {
  const feed = document.getElementById("chatMessageFeed");
  if (!feed) return;
  feed.innerHTML = "";

  (history || []).forEach(msg => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`;
    
    let formattedText = msg.message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');

    bubble.innerHTML = `
      <div style="font-size:0.72rem; color:${msg.sender === 'user' ? '#e0f2fe' : 'var(--primary)'}; font-weight:700; margin-bottom:4px;">
        ${msg.sender === 'user' ? '👤 You' : '🪐 Orbit AI Operations Assistant'} • ${msg.timestamp || ''}
      </div>
      <div>${formattedText}</div>
    `;
    feed.appendChild(bubble);
  });

  feed.scrollTop = feed.scrollHeight;
}

async function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("chatInput");
  const query = input ? input.value.trim() : "";
  if (!query) return;

  const tempUserMsg = {
    id: "temp",
    sender: "user",
    message: query,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  appState.chatHistory.push(tempUserMsg);
  renderChatMessages(appState.chatHistory);
  input.value = "";

  try {
    const res = await fetch("/api/chatbot/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query })
    });
    const data = await res.json();
    if (data.success && data.reply) {
      appState.chatHistory.push(data.reply);
      renderChatMessages(appState.chatHistory);
    }
  } catch (err) {
    console.error("Chat error:", err);
  }
}

function sendQuickPrompt(promptText) {
  const input = document.getElementById("chatInput");
  if (input) {
    input.value = promptText;
    const fakeEvent = { preventDefault: () => {} };
    handleChatSubmit(fakeEvent);
  }
}

function clearChatHistory() {
  appState.chatHistory = [{
    id: "MSG-001",
    sender: "orbit_ai",
    message: "👋 Welcome to **Orbit AI Assistant**! Chat history cleared. How can I help you coordinate campus operations today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }];
  renderChatMessages(appState.chatHistory);
}


