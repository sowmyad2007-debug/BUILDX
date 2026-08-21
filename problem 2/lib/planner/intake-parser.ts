export interface ParsedEventRequirements {
  name: string;
  type: string;
  attendeeCount: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  requiredVenues: string[];
  requiredEquipment: string[];
  volunteerCount: number;
  securityRequirements: string[];
  transportRequirements: string[];
  foodRequirements: string[];
  budget: number;
  specialRequirements: string;
  rawPrompt: string;
  confidenceScore: number;
}

export function parseNaturalLanguageRequirements(prompt: string): ParsedEventRequirements {
  const p = prompt.trim();
  const lower = p.toLowerCase();

  // 1. Detect Attendee Count
  let attendeeCount = 250;
  const attendeeMatch = lower.match(/(\d+)\s*(?:students|attendees|participants|people|delegates|hackers|candidates|guests)/i);
  if (attendeeMatch) {
    attendeeCount = parseInt(attendeeMatch[1], 10);
  }

  // 2. Detect Duration Days
  let durationDays = 1;
  const durationMatch = lower.match(/(\d+)\s*(?:-| )?day/i);
  if (durationMatch) {
    durationDays = parseInt(durationMatch[1], 10);
  } else if (lower.includes("weekend")) {
    durationDays = 2;
  }

  // 3. Detect Event Type & Generate Name
  let type = "Technical Fest";
  let name = "Campus Technical Event 2026";

  if (lower.includes("fest") || lower.includes("carnival") || lower.includes("cultural") || lower.includes("technical fest")) {
    type = "Technical Fest";
    name = "Inter-College TechFest Odyssey 2026";
  } else if (lower.includes("hackathon") || lower.includes("hackfest") || lower.includes("hack")) {
    type = "Hackathon";
    name = "Campus HackFest & Innovation Summit 2026";
  } else if (lower.includes("placement") || lower.includes("drive") || lower.includes("recruitment") || lower.includes("interview")) {
    type = "Placement Drive";
    name = "Annual Campus Placement & Recruitment Drive 2026";
  } else if (lower.includes("conference") || lower.includes("symposium") || lower.includes("summit")) {
    type = "Conference";
    name = "International Tech & AI Symposium 2026";
  } else if (lower.includes("workshop") || lower.includes("bootcamp") || lower.includes("hands-on")) {
    type = "Workshop Series";
    name = "Hands-On Technical Workshop Series 2026";
  }

  // Check if a specific event title was provided in quotes
  const quotedName = prompt.match(/["']([^"']+)["']/);
  if (quotedName && quotedName[1].length > 3 && quotedName[1].length < 60) {
    name = quotedName[1];
  }

  // 4. Detect Required Venues
  const requiredVenues: string[] = [];
  if (lower.includes("auditorium") || attendeeCount > 300) {
    requiredVenues.push("Main Auditorium");
  }
  const semHallMatch = lower.match(/(\d+)\s*seminar\s*hall/i);
  if (semHallMatch) {
    const count = Math.min(2, parseInt(semHallMatch[1], 10));
    if (count >= 1) requiredVenues.push("Seminar Hall A");
    if (count >= 2) requiredVenues.push("Seminar Hall B");
  } else if (lower.includes("seminar")) {
    requiredVenues.push("Seminar Hall A");
  }

  const labMatch = lower.match(/(\d+)\s*lab/i);
  if (labMatch) {
    const count = Math.min(4, parseInt(labMatch[1], 10));
    if (count >= 1) requiredVenues.push("Computer Lab 1 (AI & Cloud)");
    if (count >= 2) requiredVenues.push("Computer Lab 2 (Web & Systems)");
    if (count >= 3) requiredVenues.push("Innovation & Robotics Lab");
  } else if (lower.includes("lab")) {
    requiredVenues.push("Computer Lab 1 (AI & Cloud)");
  }

  if (lower.includes("ground") || lower.includes("amphitheatre") || lower.includes("outdoor")) {
    requiredVenues.push("Open Amphitheatre & Ground");
  }

  if (requiredVenues.length === 0) {
    requiredVenues.push("Main Auditorium", "Seminar Hall A");
  }

  // 5. Detect Volunteer Count
  let volunteerCount = 20;
  const volMatch = lower.match(/(\d+)\s*volunteers?/i);
  if (volMatch) {
    volunteerCount = parseInt(volMatch[1], 10);
  } else {
    volunteerCount = Math.max(10, Math.min(50, Math.ceil(attendeeCount / 20)));
  }

  // 6. Detect Required Equipment
  const requiredEquipment: string[] = [];
  if (lower.includes("av") || lower.includes("projector") || lower.includes("screen") || true) {
    requiredEquipment.push("High-Lumen 4K Laser Projectors", "Wireless Collar & Handheld Mics", "Portable JBL PA Speaker Towers");
  }
  if (lower.includes("lab") || lower.includes("laptop") || lower.includes("pc") || type === "Hackathon") {
    requiredEquipment.push("Developer Laptops (Core i7 / 32GB)", "Heavy-Duty Power Extension Boards (10A)", "High-Density Wi-Fi 6 Mesh Routers");
  }
  if (lower.includes("camera") || lower.includes("record") || lower.includes("stream") || lower.includes("live")) {
    requiredEquipment.push("4K Video Cameras with Tripods", "Modular P2.5 Indoor LED Video Walls");
  }

  // 7. Detect Security Requirements
  const securityRequirements: string[] = [
    "QR ID Badge scanning at campus entry gates",
    "Emergency medical response booth stationed at Block A",
  ];
  if (lower.includes("security") || lower.includes("guard") || durationDays > 1 || type === "Hackathon") {
    securityRequirements.push("24/7 Security patrol for overnight access and perimeter monitoring");
    securityRequirements.push("Campus security clearance and night gate pass authorization");
  }

  // 8. Detect Transport Requirements
  const transportRequirements: string[] = [];
  if (lower.includes("transport") || lower.includes("shuttle") || lower.includes("bus") || attendeeCount > 300) {
    transportRequirements.push("3 Campus Shuttle Vans operating from University Metro Station Gate 2");
    transportRequirements.push("Designated parking zone and traffic marshals at West Gate");
  } else {
    transportRequirements.push("Standard campus visitor parking access");
  }

  // 9. Detect Food Requirements
  const foodRequirements: string[] = [];
  if (lower.includes("food") || lower.includes("lunch") || lower.includes("refreshment") || lower.includes("catering") || true) {
    foodRequirements.push("Buffet lunch arrangements for attendees, judges, and faculty");
    foodRequirements.push("Continuous tea, coffee, and water hydration stations across all halls");
    if (type === "Hackathon" || durationDays > 1) {
      foodRequirements.push("Midnight pizza, energy drinks, and breakfast distribution");
    }
  }

  // 10. Calculate Estimated Budget
  let budget = attendeeCount * 25 + volunteerCount * 15 + durationDays * 2000;
  if (type === "Hackathon") budget += 3500; // Prize pool + midnight food
  const budgetMatch = lower.match(/(?:\$|usd|rs\.?|inr|budget\s*of\s*)(\d+[\d,]*)/i);
  if (budgetMatch) {
    budget = parseFloat(budgetMatch[1].replace(/,/g, ""));
  }

  // Calculate Dates (Default: next month)
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + 1, 15, 9, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + (durationDays - 1));
  end.setHours(18, 0, 0);

  const specialReqs = [
    "High-speed 1 Gbps dedicated VLAN for live workshops.",
    "First aid paramedic on campus standby throughout the event.",
  ];
  if (durationDays > 1) {
    specialReqs.push("Overnight security protocol and rest lounges active.");
  }

  return {
    name,
    type,
    attendeeCount,
    durationDays,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    requiredVenues,
    requiredEquipment,
    volunteerCount,
    securityRequirements,
    transportRequirements,
    foodRequirements,
    budget,
    specialRequirements: specialReqs.join(" "),
    rawPrompt: prompt,
    confidenceScore: 96,
  };
}
