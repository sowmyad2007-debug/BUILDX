export interface InitialVenue {
  id: string;
  name: string;
  code: string;
  capacity: number;
  location: string;
  availableEquipment: string[];
  wifiCoverage: "Excellent" | "Good" | "Moderate";
  isAccessible: boolean;
  currentBooking: string | null;
  suitabilityScore: number;
  status: "AVAILABLE" | "BOOKED" | "MAINTENANCE" | "OFFLINE";
}

export interface InitialEquipment {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  allocatedQuantity: number;
  storageLocation: string;
  status: "AVAILABLE" | "DEFICIT" | "CRITICAL";
}

export interface InitialVolunteer {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  skills: string[];
  role: string;
  availability: "AVAILABLE" | "ASSIGNED" | "UNAVAILABLE";
  shiftCount: number;
}

export interface InitialCampusEvent {
  id: string;
  name: string;
  type: string;
  description: string;
  date: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  venueId: string;
  venueName: string;
  capacity: number;
  registeredCount: number;
  price: number; // in INR ₹
  priceFormatted: string;
  organizer: string;
  contactDetails: {
    name: string;
    email: string;
    phone: string;
  };
  image: string;
  category: "Technical" | "Hackathon" | "Conference" | "Coding" | "Robotics" | "Career" | "Workshop" | "Cultural" | "Sports";
  equipmentRequirements: string[];
  volunteerRequirements: {
    count: number;
    squads: string[];
  };
  securityRequirements: {
    guardsRequired: number;
    entryPoints: string[];
    emergencyPlan: string;
    status: "APPROVED" | "PENDING" | "REQUIRED";
  };
  transportRequirements: {
    vehiclesCount: number;
    pickupPoints: string[];
    dropPoints: string[];
    timings: string;
  };
  communicationRequirements: {
    announcementsCount: number;
    channels: string[];
  };
  permissionRequirements: {
    type: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
    approvedBy?: string;
  }[];
  rules: string[];
  prizePool?: string;
  winnerPrizes?: Array<{
    position: string;
    amount: string;
    description: string;
    perks?: string[];
  }>;
  schedule: Array<{
    time: string;
    activity: string;
    venue: string;
    speakerOrLead?: string;
  }>;
  status: "UPCOMING" | "REGISTRATION_OPEN" | "ONGOING" | "COMPLETED" | "PLANNING";
}

export const INITIAL_VENUES: InitialVenue[] = [
  {
    id: "venue-1",
    name: "Main Auditorium",
    code: "AUD-MAIN",
    capacity: 650,
    location: "Block A - Ground Floor",
    availableEquipment: ["4K Projector", "Stage Lights", "PA System", "Wireless Mics (4)", "Air Conditioning", "Live Stream Setup"],
    wifiCoverage: "Excellent",
    isAccessible: true,
    currentBooking: null,
    suitabilityScore: 98,
    status: "AVAILABLE",
  },
  {
    id: "venue-2",
    name: "Seminar Hall A",
    code: "SEM-HALL-A",
    capacity: 220,
    location: "Block B - 2nd Floor",
    availableEquipment: ["HD Projector", "Podium Mic", "Speakers (2)", "Air Conditioning"],
    wifiCoverage: "Excellent",
    isAccessible: true,
    currentBooking: null,
    suitabilityScore: 94,
    status: "AVAILABLE",
  },
  {
    id: "venue-3",
    name: "Seminar Hall B",
    code: "SEM-HALL-B",
    capacity: 180,
    location: "Block B - 3rd Floor",
    availableEquipment: ["HD Projector", "Wireless Mic", "Speakers (2)", "Smart Board"],
    wifiCoverage: "Good",
    isAccessible: true,
    currentBooking: null,
    suitabilityScore: 90,
    status: "AVAILABLE",
  },
  {
    id: "venue-4",
    name: "Computer Lab 1 (AI & Cloud)",
    code: "LAB-CS-01",
    capacity: 90,
    location: "Block C - 1st Floor",
    availableEquipment: ["90 Workstations (GPU Enabled)", "Projector", "High-speed LAN", "Dual Displays"],
    wifiCoverage: "Excellent",
    isAccessible: true,
    currentBooking: null,
    suitabilityScore: 96,
    status: "AVAILABLE",
  },
  {
    id: "venue-5",
    name: "Computer Lab 2 (Web & Systems)",
    code: "LAB-CS-02",
    capacity: 80,
    location: "Block C - 2nd Floor",
    availableEquipment: ["80 Workstations", "Projector", "Gigabit LAN", "Audio System"],
    wifiCoverage: "Excellent",
    isAccessible: true,
    currentBooking: null,
    suitabilityScore: 92,
    status: "AVAILABLE",
  },
  {
    id: "venue-6",
    name: "Innovation & Robotics Lab",
    code: "LAB-INNOV-01",
    capacity: 60,
    location: "Block D - Ground Floor",
    availableEquipment: ["Soldering Stations", "3D Printers", "Oscilloscopes", "Projector", "Modular Desks"],
    wifiCoverage: "Good",
    isAccessible: true,
    currentBooking: null,
    suitabilityScore: 88,
    status: "AVAILABLE",
  },
  {
    id: "venue-7",
    name: "Conference Hall (Executive)",
    code: "CONF-HALL-01",
    capacity: 120,
    location: "Admin Block - 3rd Floor",
    availableEquipment: ["Video Conferencing Rig", "Podium Mic", "Acoustic Wall Panels", "Display Panels"],
    wifiCoverage: "Excellent",
    isAccessible: true,
    currentBooking: null,
    suitabilityScore: 92,
    status: "AVAILABLE",
  },
  {
    id: "venue-8",
    name: "Open Amphitheatre & Ground",
    code: "OPEN-GROUND-01",
    capacity: 1200,
    location: "Central Campus Quad",
    availableEquipment: ["Outdoor Sound Rig", "Stage Canopy", "Flood Lights"],
    wifiCoverage: "Moderate",
    isAccessible: true,
    currentBooking: null,
    suitabilityScore: 85,
    status: "AVAILABLE",
  },
  {
    id: "venue-9",
    name: "Indoor Sports Complex",
    code: "SPORTS-COMPLEX-01",
    capacity: 800,
    location: "Sports Block - West Gate",
    availableEquipment: ["Scoreboards", "PA Audio System", "First Aid Station", "Locker Rooms"],
    wifiCoverage: "Good",
    isAccessible: true,
    currentBooking: null,
    suitabilityScore: 89,
    status: "AVAILABLE",
  },
];

export const INITIAL_EQUIPMENT: InitialEquipment[] = [
  { id: "eq-1", name: "High-Lumen 4K Laser Projectors", category: "Audio/Visual", totalQuantity: 14, availableQuantity: 14, allocatedQuantity: 0, storageLocation: "Central A/V Room (A-102)", status: "AVAILABLE" },
  { id: "eq-2", name: "Wireless Collar & Handheld Mics", category: "Audio/Visual", totalQuantity: 36, availableQuantity: 36, allocatedQuantity: 0, storageLocation: "Sound Booth (A-104)", status: "AVAILABLE" },
  { id: "eq-3", name: "Portable JBL PA Speaker Towers", category: "Audio/Visual", totalQuantity: 20, availableQuantity: 20, allocatedQuantity: 0, storageLocation: "Sound Booth (A-104)", status: "AVAILABLE" },
  { id: "eq-4", name: "Developer Laptops (Core i7 / 32GB)", category: "Computing", totalQuantity: 50, availableQuantity: 50, allocatedQuantity: 0, storageLocation: "IT Support Center (C-005)", status: "AVAILABLE" },
  { id: "eq-5", name: "Heavy-Duty Power Extension Boards (10A)", category: "Power", totalQuantity: 80, availableQuantity: 80, allocatedQuantity: 0, storageLocation: "Electrical Dept Store (E-01)", status: "AVAILABLE" },
  { id: "eq-6", name: "4K Video Cameras with Tripods", category: "Media", totalQuantity: 10, availableQuantity: 10, allocatedQuantity: 0, storageLocation: "Media & PR Cell (Admin 204)", status: "AVAILABLE" },
  { id: "eq-7", name: "Modular P2.5 Indoor LED Video Walls", category: "Audio/Visual", totalQuantity: 6, availableQuantity: 6, allocatedQuantity: 0, storageLocation: "Auditorium Backstage Storage", status: "AVAILABLE" },
  { id: "eq-8", name: "High-Density Wi-Fi 6 Mesh Routers", category: "Network", totalQuantity: 25, availableQuantity: 25, allocatedQuantity: 0, storageLocation: "Network Operations Center (NOC)", status: "AVAILABLE" },
];

export const INITIAL_VOLUNTEERS: InitialVolunteer[] = [
  { id: "vol-1", name: "Aarav Sharma", studentId: "STU-2023-CS01", email: "aarav.s@campus.edu", phone: "+91 98765 43210", department: "Computer Science", skills: ["Stage Management", "Public Speaking", "A/V Setup"], role: "Squad Lead - Tech", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-2", name: "Diya Patel", studentId: "STU-2023-IT14", email: "diya.p@campus.edu", phone: "+91 98765 43211", department: "Information Tech", skills: ["Registration Desk", "QR Scanning", "Crowd Flow"], role: "Squad Lead - Registration", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-3", name: "Rohan Verma", studentId: "STU-2022-EC09", email: "rohan.v@campus.edu", phone: "+91 98765 43212", department: "Electronics Engg", skills: ["Hardware Troubleshooting", "LAN Cabling", "Power Management"], role: "Tech Support", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-4", name: "Ananya Iyer", studentId: "STU-2024-CS42", email: "ananya.i@campus.edu", phone: "+91 98765 43213", department: "Computer Science", skills: ["Guest Hospitality", "VIP Escort", "Catering Coordination"], role: "Squad Lead - Hospitality", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-5", name: "Vikram Malhotra", studentId: "STU-2022-ME05", email: "vikram.m@campus.edu", phone: "+91 98765 43214", department: "Mechanical Engg", skills: ["Entry Gate Security", "ID Verification", "Emergency Response"], role: "Squad Lead - Security", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-6", name: "Sneha Sen", studentId: "STU-2023-DS21", email: "sneha.s@campus.edu", phone: "+91 98765 43215", department: "Data Science", skills: ["Photography", "Social Media Live", "Documentation"], role: "Media & PR", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-7", name: "Kabir Das", studentId: "STU-2024-CS18", email: "kabir.d@campus.edu", phone: "+91 98765 43216", department: "Computer Science", skills: ["Discord/Slack Mod", "Hacker Helpdesk", "GitHub Setup"], role: "Hacker Support", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-8", name: "Meera Nair", studentId: "STU-2023-BT07", email: "meera.n@campus.edu", phone: "+91 98765 43217", department: "Biotech", skills: ["First Aid", "Food Packets Distribution", "Helpdesk"], role: "Hospitality", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-9", name: "Arjun Reddy", studentId: "STU-2022-EE19", email: "arjun.r@campus.edu", phone: "+91 98765 43218", department: "Electrical Engg", skills: ["Power Strips Allocation", "Backup Generator Link", "Lighting"], role: "Tech Support", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-10", name: "Pooja Hegde", studentId: "STU-2023-IT33", email: "pooja.h@campus.edu", phone: "+91 98765 43219", department: "Information Tech", skills: ["ID Badge Printing", "Kit Distribution", "Verification"], role: "Registration", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-11", name: "Karan Johar", studentId: "STU-2024-ME12", email: "karan.j@campus.edu", phone: "+91 98765 43220", department: "Mechanical Engg", skills: ["Venue Signage", "Chair Arrangement", "Mic Runner"], role: "General Coordination", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-12", name: "Tanya Sen", studentId: "STU-2023-CE08", email: "tanya.s@campus.edu", phone: "+91 98765 43221", department: "Civil Engg", skills: ["Crowd Marshall", "Parking Coordination", "Gate Entry"], role: "Security & Logistics", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-13", name: "Aditya Roy", studentId: "STU-2022-CS55", email: "aditya.r@campus.edu", phone: "+91 98765 43222", department: "Computer Science", skills: ["Cloud Sandbox Setup", "Wi-Fi Access Passwords", "Server Watch"], role: "Tech Support", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-14", name: "Neha Kakkar", studentId: "STU-2024-MS03", email: "neha.k@campus.edu", phone: "+91 98765 43223", department: "Management Studies", skills: ["Sponsor Hospitality", "Judge Escort", "Scoreboard Entry"], role: "Hospitality", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-15", name: "Rishabh Pant", studentId: "STU-2023-PE01", email: "rishabh.p@campus.edu", phone: "+91 98765 43224", department: "Physical Education", skills: ["Campus Shuttles", "Late Night Patrol", "Medical Team Liaison"], role: "Security & Logistics", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-16", name: "Ishaan Khatter", studentId: "STU-2024-DM10", email: "ishaan.k@campus.edu", phone: "+91 98765 43225", department: "Design & Media", skills: ["Video Editing", "Poster Display", "Opening Montage"], role: "Media & PR", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-17", name: "Zoya Akhtar", studentId: "STU-2023-CS77", email: "zoya.a@campus.edu", phone: "+91 98765 43226", department: "Computer Science", skills: ["Swag Bags Packing", "Snack Counters", "Trash Marshall"], role: "General Coordination", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-18", name: "Varun Dhawan", studentId: "STU-2022-ME31", email: "varun.d@campus.edu", phone: "+91 98765 43227", department: "Mechanical Engg", skills: ["Banner Mounts", "Audio Checks", "Stage Runner"], role: "General Coordination", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-19", name: "Kriti Sanon", studentId: "STU-2023-IT05", email: "kriti.s@campus.edu", phone: "+91 98765 43228", department: "Information Tech", skills: ["Certificate Generation", "Prize Distribution", "Stage Coordination"], role: "Squad Lead - Valedictory", availability: "AVAILABLE", shiftCount: 0 },
  { id: "vol-20", name: "Siddharth Rao", studentId: "STU-2024-EC22", email: "siddharth.r@campus.edu", phone: "+91 98765 43229", department: "Electronics Engg", skills: ["IoT Setup", "Mic Batteries", "Backup Displays"], role: "Tech Support", availability: "AVAILABLE", shiftCount: 0 },
];

export const INITIAL_9_CAMPUS_EVENTS: InitialCampusEvent[] = [
  {
    id: "evt-techfest-2026",
    name: "TechFest 2026",
    type: "Technical Fest",
    category: "Technical",
    description: "The premier inter-college technical symposium featuring 6 specialized tracks, paper presentations, project expos, drone racing, and guest lectures from industry pioneers.",
    date: "Sep 15 - 16, 2026",
    startDate: "2026-09-15T09:00:00",
    endDate: "2026-09-16T18:00:00",
    startTime: "09:00 AM",
    endTime: "06:00 PM",
    registrationDeadline: "2026-09-13T23:59:59",
    venueId: "venue-1",
    venueName: "Main Auditorium & Seminar Halls",
    capacity: 650,
    registeredCount: 480,
    price: 150,
    priceFormatted: "₹150",
    organizer: "CSE & IEEE Student Branch",
    contactDetails: { name: "Dr. Arvind Swaminathan", email: "techfest@campus.edu", phone: "+91 98765 11001" },
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    equipmentRequirements: ["High-Lumen 4K Laser Projectors", "Wireless Collar & Handheld Mics", "Portable JBL PA Speaker Towers", "High-Density Wi-Fi 6 Mesh Routers"],
    volunteerRequirements: { count: 30, squads: ["Registration", "Tech Support", "Hospitality", "Security", "General"] },
    securityRequirements: { guardsRequired: 8, entryPoints: ["Gate 1", "Gate 3"], emergencyPlan: "First aid booth stationed in Block A Ground Floor with campus ambulance standby.", status: "APPROVED" },
    transportRequirements: { vehiclesCount: 3, pickupPoints: ["University Metro Station Gate 2"], dropPoints: ["Main Auditorium Porch"], timings: "07:30 AM - 10:30 AM & 05:00 PM - 07:00 PM" },
    communicationRequirements: { announcementsCount: 4, channels: ["Campus App", "Email", "WhatsApp Squad Group"] },
    permissionRequirements: [{ type: "Dean Approval", status: "APPROVED", approvedBy: "Dean of Student Affairs" }, { type: "Acoustics Clearance", status: "APPROVED" }],
    rules: ["Valid college student ID card mandatory.", "Attendees must register individually or as a team of up to 4.", "Formal/smart casual attire for keynote sessions."],
    prizePool: "₹1,50,000",
    winnerPrizes: [
      { position: "1st Prize (Grand Winner)", amount: "₹75,000", description: "Gold Trophy + Direct Industry Internship Referral", perks: ["Gold Trophy", "Certificate of Excellence", "Tech Sponsor Swag"] },
      { position: "2nd Prize (Runner Up)", amount: "₹45,000", description: "Silver Trophy + Hardware Dev Kit", perks: ["Silver Trophy", "Certificate of Merit"] },
      { position: "3rd Prize (2nd Runner Up)", amount: "₹30,000", description: "Bronze Trophy + Tech Vouchers", perks: ["Bronze Trophy", "Certificate of Merit"] },
    ],
    schedule: [
      { time: "09:00 AM", activity: "Registration & Badge Verification", venue: "Main Auditorium Lobby" },
      { time: "09:30 AM", activity: "Grand Inaugural Ceremony & Keynote", venue: "Main Auditorium", speakerOrLead: "Dr. Arvind Swaminathan" },
      { time: "11:30 AM", activity: "Paper Presentation Tracks & Tech Exhibits", venue: "Seminar Hall A & B" },
      { time: "01:00 PM", activity: "Buffet Lunch & Networking", venue: "Campus Dining Complex" },
      { time: "02:00 PM", activity: "Hands-on Technical Workshops", venue: "Computer Labs 1 & 2" },
      { time: "04:30 PM", activity: "Project Finals & Valedictory Awards", venue: "Main Auditorium" },
    ],
    status: "REGISTRATION_OPEN",
  },
  {
    id: "evt-hackathon-2026",
    name: "Hackathon 2026",
    type: "Hackathon",
    category: "Hackathon",
    description: "A 36-hour non-stop hackathon pushing the frontiers of Autonomous AI, Web3, Distributed Cloud, and Healthcare IoT with a ₹2,00,000 cash prize pool.",
    date: "Sep 22 - 23, 2026",
    startDate: "2026-09-22T08:00:00",
    endDate: "2026-09-23T20:00:00",
    startTime: "08:00 AM (Day 1)",
    endTime: "08:00 PM (Day 2)",
    registrationDeadline: "2026-09-20T23:59:59",
    venueId: "venue-1",
    venueName: "Main Auditorium & Computer Labs",
    capacity: 500,
    registeredCount: 395,
    price: 200,
    priceFormatted: "₹200",
    organizer: "ACM Student Chapter & GDG On Campus",
    contactDetails: { name: "Prof. Rajeshwari K.", email: "hackathon@campus.edu", phone: "+91 98765 11002" },
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60",
    equipmentRequirements: ["Heavy-Duty Power Extension Boards (10A)", "High-Density Wi-Fi 6 Mesh Routers", "Developer Laptops", "4K Video Cameras"],
    volunteerRequirements: { count: 25, squads: ["Registration", "Tech Support", "Hospitality", "Security"] },
    securityRequirements: { guardsRequired: 10, entryPoints: ["Main Gate", "Block C Gate"], emergencyPlan: "24/7 night patrol, paramedic on duty in B-104, emergency fire exits illuminated.", status: "APPROVED" },
    transportRequirements: { vehiclesCount: 2, pickupPoints: ["Metro Station", "Hostel Block A"], dropPoints: ["Main Auditorium"], timings: "Continuous 30-min loops" },
    communicationRequirements: { announcementsCount: 6, channels: ["Discord Server", "Campus App", "SMS Emergency Broadcast"] },
    permissionRequirements: [{ type: "Overnight Campus Stay Permit", status: "APPROVED", approvedBy: "Campus Registrar" }, { type: "Midnight Food Catering Clearance", status: "APPROVED" }],
    rules: ["Teams of 2 to 4 members.", "Fresh codebase created after problem statement reveal.", "Use of AI tools encouraged with proper code attribution."],
    prizePool: "₹2,00,000",
    winnerPrizes: [
      { position: "1st Prize (Grand Winner)", amount: "₹1,00,000", description: "Gold Trophy + Direct Venture Seed Pitch + ₹50k AWS Cloud Credits", perks: ["Gold Trophy", "Incubator Fast-Track", "AWS Activate Credits"] },
      { position: "2nd Prize (1st Runner Up)", amount: "₹60,000", description: "Silver Trophy + Cloud Developer Subscriptions", perks: ["Silver Trophy", "Developer Goodie Box"] },
      { position: "3rd Prize (2nd Runner Up)", amount: "₹40,000", description: "Bronze Trophy + Tech Vouchers", perks: ["Bronze Trophy", "Certificate of Honor"] },
      { position: "Special: Best All-Women Team", amount: "₹15,000", description: "Women in Tech Champions Trophy", perks: ["Trophy", "Mentorship Fast-Track"] },
      { position: "Special: Most Innovative GenAI Hack", amount: "₹10,000", description: "AI Excellence Plaque + GPU Credits", perks: ["Plaque", "GPU Credits"] },
    ],
    schedule: [
      { time: "08:00 AM", activity: "Hacker Check-in & Team Registration", venue: "Main Auditorium" },
      { time: "09:30 AM", activity: "Problem Statements Revealed & Hacking Begins", venue: "Main Auditorium" },
      { time: "02:00 PM", activity: "Mentorship Round 1: Architecture Check", venue: "Computer Lab 1" },
      { time: "11:00 PM", activity: "Midnight Pizza Sprint & Energy Refreshments", venue: "Auditorium Backstage Lounge" },
      { time: "08:00 AM", activity: "Breakfast & Mid-Point Progress Evaluation", venue: "Dining Hall" },
      { time: "03:00 PM", activity: "Final Code Freeze & Pitch Deck Submission", venue: "Main Auditorium" },
      { time: "05:30 PM", activity: "Grand Finale Demos & Award Distribution", venue: "Main Auditorium" },
    ],
    status: "REGISTRATION_OPEN",
  },
  {
    id: "evt-ai-summit-2026",
    name: "AI & Innovation Summit",
    type: "Conference",
    category: "Conference",
    description: "International thought-leadership conference on Generative AI, Large Multi-Modal Models, Autonomous Agents, and Ethical Machine Learning in Higher Education.",
    date: "Oct 05, 2026",
    startDate: "2026-10-05T09:30:00",
    endDate: "2026-10-05T17:30:00",
    startTime: "09:30 AM",
    endTime: "05:30 PM",
    registrationDeadline: "2026-10-03T23:59:59",
    venueId: "venue-1",
    venueName: "Main Auditorium",
    capacity: 400,
    registeredCount: 310,
    price: 300,
    priceFormatted: "₹300",
    organizer: "Centre for Artificial Intelligence & Robotics",
    contactDetails: { name: "Dr. Preeti Sharma", email: "aisummit@campus.edu", phone: "+91 98765 11003" },
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60",
    equipmentRequirements: ["High-Lumen 4K Laser Projectors", "Modular P2.5 Indoor LED Video Walls", "Wireless Collar Mics (6)", "Live Stream Setup"],
    volunteerRequirements: { count: 20, squads: ["VIP Hospitality", "Registration", "A/V Tech"] },
    securityRequirements: { guardsRequired: 6, entryPoints: ["Auditorium VIP Porch", "Gate 1"], emergencyPlan: "Medical station in Admin Block.", status: "APPROVED" },
    transportRequirements: { vehiclesCount: 2, pickupPoints: ["Airport Shuttle", "Metro Station"], dropPoints: ["Main Auditorium"], timings: "08:00 AM - 10:00 AM" },
    communicationRequirements: { announcementsCount: 3, channels: ["Email", "Campus Portal"] },
    permissionRequirements: [{ type: "Dean Clearance", status: "APPROVED" }],
    rules: ["Professional executive attire required.", "Delegates must wear VIP summit lanyards.", "Q&A via Slido platform."],
    prizePool: "₹50,000",
    winnerPrizes: [
      { position: "Best Research Paper", amount: "₹30,000", description: "IEEE Publication Sponsorship + Gold Citation", perks: ["Gold Citation", "IEEE Indexing Grant"] },
      { position: "Outstanding AI Prototype", amount: "₹20,000", description: "AI Center Research Grant + Lab Fellowship", perks: ["Lab Fellowship", "Certificate of Merit"] },
    ],
    schedule: [
      { time: "09:30 AM", activity: "Welcome Address & Lighting of Lamp", venue: "Main Auditorium" },
      { time: "10:15 AM", activity: "Keynote: Multi-Agent Systems in 2026", venue: "Main Auditorium", speakerOrLead: "Google DeepMind Fellow" },
      { time: "12:00 PM", activity: "Panel: AI Ethics & Safe Autonomy", venue: "Main Auditorium" },
      { time: "01:15 PM", activity: "Networking Luncheon", venue: "Conference Hall Lounge" },
      { time: "02:30 PM", activity: "Industry Showcase & Research Posters", venue: "Main Auditorium Foyer" },
      { time: "04:30 PM", activity: "Closing Synthesis & Certificate Handover", venue: "Main Auditorium" },
    ],
    status: "REGISTRATION_OPEN",
  },
  {
    id: "evt-codesprint-2026",
    name: "CodeSprint",
    type: "Coding Competition",
    category: "Coding",
    description: "High-speed 4-hour algorithmic problem-solving showdown covering dynamic programming, graph algorithms, combinatorial optimization, and concurrency.",
    date: "Oct 12, 2026",
    startDate: "2026-10-12T14:00:00",
    endDate: "2026-10-12T18:00:00",
    startTime: "02:00 PM",
    endTime: "06:00 PM",
    registrationDeadline: "2026-10-11T20:00:00",
    venueId: "venue-4",
    venueName: "Computer Lab 1 & 2",
    capacity: 170,
    registeredCount: 145,
    price: 100,
    priceFormatted: "₹100",
    organizer: "Competitive Coding Club (C3)",
    contactDetails: { name: "Prof. S. Narayanan", email: "codesprint@campus.edu", phone: "+91 98765 11004" },
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    equipmentRequirements: ["170 Workstations", "High-Speed LAN", "Server Watch Monitors"],
    volunteerRequirements: { count: 12, squads: ["Tech Support", "Registration"] },
    securityRequirements: { guardsRequired: 4, entryPoints: ["Block C Entrance"], emergencyPlan: "Standard campus medical response.", status: "APPROVED" },
    transportRequirements: { vehiclesCount: 0, pickupPoints: [], dropPoints: [], timings: "N/A" },
    communicationRequirements: { announcementsCount: 2, channels: ["Discord", "HackerRank Board"] },
    permissionRequirements: [{ type: "Lab Access Permit", status: "APPROVED" }],
    rules: ["Individual participation only.", "Plagiarism detection via MOSS active.", "Supported languages: C++, Java, Python, Rust, Go."],
    prizePool: "₹50,000",
    winnerPrizes: [
      { position: "1st Place (Grand Master)", amount: "₹25,000", description: "Gold Trophy + Direct Fast-Track Interview Shortlist", perks: ["Gold Trophy", "Certificate of Grand Mastery", "Company Shortlist"] },
      { position: "2nd Place (Master Coder)", amount: "₹15,000", description: "Silver Plaque + Mechanical Keyboard Kit", perks: ["Silver Plaque", "Hardware Kit"] },
      { position: "3rd Place (Expert Coder)", amount: "₹10,000", description: "Bronze Plaque + Premium Cloud Dev Sub", perks: ["Bronze Plaque", "Dev Voucher"] },
    ],
    schedule: [
      { time: "02:00 PM", activity: "Environment Setup & Sandbox Test", venue: "Computer Lab 1 & 2" },
      { time: "02:30 PM", activity: "Contest Launch: 6 Hard Algorithmic Problems", venue: "Computer Lab 1 & 2" },
      { time: "05:30 PM", activity: "Leaderboard Freeze & Live Solution Walkthrough", venue: "Seminar Hall A" },
      { time: "06:00 PM", activity: "Prize Distribution (Top 3 Coders)", venue: "Seminar Hall A" },
    ],
    status: "REGISTRATION_OPEN",
  },
  {
    id: "evt-robotics-challenge-2026",
    name: "Robotics Challenge",
    type: "Robotics Competition",
    category: "Robotics",
    description: "Autonomous line follower, maze-solver bots, and RoboWars combat arena designed and engineered by student robotics teams.",
    date: "Oct 20, 2026",
    startDate: "2026-10-20T10:00:00",
    endDate: "2026-10-20T17:00:00",
    startTime: "10:00 AM",
    endTime: "05:00 PM",
    registrationDeadline: "2026-10-18T23:59:59",
    venueId: "venue-6",
    venueName: "Innovation Lab & Open Ground",
    capacity: 120,
    registeredCount: 88,
    price: 200,
    priceFormatted: "₹200",
    organizer: "Robotics & Mechatronics Society",
    contactDetails: { name: "Dr. K. V. Raman", email: "robotics@campus.edu", phone: "+91 98765 11005" },
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60",
    equipmentRequirements: ["Soldering Stations", "3D Printers", "Modular Desks", "Heavy-Duty Power Extension Boards"],
    volunteerRequirements: { count: 15, squads: ["Arena Marshalls", "Tech Support"] },
    securityRequirements: { guardsRequired: 6, entryPoints: ["Open Ground Gate 4"], emergencyPlan: "Fire extinguisher & safety goggles mandated at arena.", status: "APPROVED" },
    transportRequirements: { vehiclesCount: 1, pickupPoints: ["West Gate"], dropPoints: ["Innovation Lab"], timings: "09:00 AM" },
    communicationRequirements: { announcementsCount: 2, channels: ["Campus App"] },
    permissionRequirements: [{ type: "Safety & Hazard Clearance", status: "APPROVED" }],
    rules: ["Robot dimensions must adhere to 30x30x30 cm standard.", "Maximum weight 5 kg for combat bots.", "Safety cutoff switch mandatory."],
    prizePool: "₹75,000",
    winnerPrizes: [
      { position: "RoboWars Heavyweight Champion", amount: "₹40,000", description: "Gold Championship Trophy + Hardware Sponsorship", perks: ["Gold Trophy", "Robotics Component Kit", "Certificate"] },
      { position: "Autonomous Maze Navigation Winner", amount: "₹25,000", description: "Silver Trophy + ROS2 Robotics Kit", perks: ["Silver Trophy", "ROS Dev Board"] },
      { position: "Best Innovative Mechanical Design", amount: "₹10,000", description: "Innovation Citation & Lab Grant", perks: ["Innovation Plaque", "Lab Access Pass"] },
    ],
    schedule: [
      { time: "10:00 AM", activity: "Robot Dimension & Weight Inspection", venue: "Innovation Lab" },
      { time: "11:00 AM", activity: "Autonomous Maze Navigation Heats", venue: "Innovation Lab Arena" },
      { time: "01:00 PM", activity: "Lunch Break & Pit Repairs", venue: "Innovation Lab" },
      { time: "02:00 PM", activity: "RoboWars Combat Elimination Tournament", venue: "Open Ground Arena" },
      { time: "04:30 PM", activity: "Championship Bout & Trophies", venue: "Open Ground" },
    ],
    status: "REGISTRATION_OPEN",
  },
  {
    id: "evt-placement-drive-2026",
    name: "Placement Drive",
    type: "Recruitment",
    category: "Career",
    description: "Annual Campus Mega Recruitment Drive hosting 25+ Tier-1 tech firms, quantitative finance funds, and product startups for pre-placement talks, coding rounds, and interviews.",
    date: "Nov 02 - 03, 2026",
    startDate: "2026-11-02T08:30:00",
    endDate: "2026-11-03T19:00:00",
    startTime: "08:30 AM",
    endTime: "07:00 PM",
    registrationDeadline: "2026-10-30T23:59:59",
    venueId: "venue-2",
    venueName: "Seminar Hall A & Computer Labs",
    capacity: 300,
    registeredCount: 285,
    price: 0,
    priceFormatted: "Free",
    organizer: "Campus Training & Placement Cell (T&P)",
    contactDetails: { name: "Prof. Alok Gupta", email: "placements@campus.edu", phone: "+91 98765 11006" },
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=60",
    equipmentRequirements: ["Projectors", "Interview Cubicle Panels", "Workstations", "Wireless Mics"],
    volunteerRequirements: { count: 20, squads: ["Corporate Escort", "Registration", "Control Room"] },
    securityRequirements: { guardsRequired: 8, entryPoints: ["Seminar Hall A", "Admin Block"], emergencyPlan: "First aid team in Admin 101.", status: "APPROVED" },
    transportRequirements: { vehiclesCount: 3, pickupPoints: ["City Hotels", "Airport"], dropPoints: ["Admin Guest House"], timings: "Continuous corporate shuttles" },
    communicationRequirements: { announcementsCount: 5, channels: ["T&P Portal", "Email Alert"] },
    permissionRequirements: [{ type: "Dean of Academics Clearance", status: "APPROVED" }],
    rules: ["Eligible for pre-final and final year registered students only.", "Formal business attire mandatory.", "Carry 5 printed copies of verified resume."],
    prizePool: "Offers Up to ₹45 LPA",
    winnerPrizes: [
      { position: "Top Tier-1 Dream Job CTC", amount: "₹45,00,000 / yr", description: "Full-Time SWE / AI Engineer Offer with Stock Units", perks: ["Full-Time Offer", "Relocation Allowance", "Joining Bonus"] },
      { position: "Average Core Tech Package", amount: "₹18,50,000 / yr", description: "Product Startup & FinTech Quant Roles", perks: ["PPO Guarantee", "Health Insurance"] },
      { position: "Star Intern Stipend", amount: "₹1,20,000 / mo", description: "6-Month Pre-Placement Internship", perks: ["Stipend", "Direct PPO Review"] },
    ],
    schedule: [
      { time: "08:30 AM", activity: "Student Registration & Roll Call", venue: "Seminar Hall A" },
      { time: "09:30 AM", activity: "Corporate Pre-Placement Talks (PPTs)", venue: "Seminar Hall A" },
      { time: "11:30 AM", activity: "Online Technical Screening Tests", venue: "Computer Labs 1 & 2" },
      { time: "02:00 PM", activity: "1-on-1 Technical & HR Interviews", venue: "Conference Hall Rooms 1-8" },
      { time: "06:30 PM", activity: "Offer Rollouts & Letter Handover", venue: "Seminar Hall A" },
    ],
    status: "REGISTRATION_OPEN",
  },
  {
    id: "evt-technical-workshop-2026",
    name: "Technical Workshop",
    type: "Workshop",
    category: "Workshop",
    description: "Hands-on masterclass on Building Production-Ready Full-Stack AI Apps using Next.js 14, LangChain, Tool Calling, Vector Databases, and Cloud Deployment.",
    date: "Nov 10, 2026",
    startDate: "2026-11-10T10:00:00",
    endDate: "2026-11-10T16:00:00",
    startTime: "10:00 AM",
    endTime: "04:00 PM",
    registrationDeadline: "2026-11-08T23:59:59",
    venueId: "venue-3",
    venueName: "Seminar Hall B",
    capacity: 180,
    registeredCount: 142,
    price: 50,
    priceFormatted: "₹50",
    organizer: "Developer Student Club (DSC)",
    contactDetails: { name: "Er. Tarun Saxena", email: "workshop@campus.edu", phone: "+91 98765 11007" },
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60",
    equipmentRequirements: ["HD Projector", "Wireless Mic", "Power Extension Boards", "Smart Board"],
    volunteerRequirements: { count: 8, squads: ["Tech Support", "Helpdesk"] },
    securityRequirements: { guardsRequired: 2, entryPoints: ["Seminar Hall B"], emergencyPlan: "Standard campus response.", status: "APPROVED" },
    transportRequirements: { vehiclesCount: 0, pickupPoints: [], dropPoints: [], timings: "N/A" },
    communicationRequirements: { announcementsCount: 2, channels: ["Email", "Campus App"] },
    permissionRequirements: [{ type: "Lab Booking Permit", status: "APPROVED" }],
    rules: ["Bring personal laptop with Node.js 20+ and VS Code installed.", "GitHub repository access provided at check-in.", "Verified digital certificates awarded upon lab completion."],
    prizePool: "₹25,000",
    winnerPrizes: [
      { position: "Best Workshop Project Hack", amount: "₹15,000", description: "Pro Vercel Credits + AI Developer Toolkit", perks: ["Cash Award", "Cloud Subscriptions"] },
      { position: "Fastest Clean Deployment", amount: "₹10,000", description: "Developer Swag Box & Certificate of Excellence", perks: ["Swag Box", "Certificate"] },
    ],
    schedule: [
      { time: "10:00 AM", activity: "Check-in & Starter Code Clone", venue: "Seminar Hall B" },
      { time: "10:30 AM", activity: "Module 1: Next.js 14 App Router & API Route Handlers", venue: "Seminar Hall B", speakerOrLead: "Tarun Saxena" },
      { time: "01:00 PM", activity: "Working Lunch & Debugging Circle", venue: "Seminar Hall B Lounge" },
      { time: "02:00 PM", activity: "Module 2: Tool Calling & Deterministic Planning Engines", venue: "Seminar Hall B" },
      { time: "03:30 PM", activity: "Project Deployment to Vercel & Q&A", venue: "Seminar Hall B" },
    ],
    status: "REGISTRATION_OPEN",
  },
  {
    id: "evt-cultural-fest-2026",
    name: "Cultural Fest",
    type: "Cultural Fest",
    category: "Cultural",
    description: "The biggest music, dance, fashion, and theatrical carnival of the academic year featuring battle of the bands, pro-nite concerts, art expos, and street food alleys.",
    date: "Nov 20 - 21, 2026",
    startDate: "2026-11-20T16:00:00",
    endDate: "2026-11-21T23:00:00",
    startTime: "04:00 PM",
    endTime: "11:00 PM",
    registrationDeadline: "2026-11-18T23:59:59",
    venueId: "venue-8",
    venueName: "Open Amphitheatre & Main Auditorium",
    capacity: 1200,
    registeredCount: 1120,
    price: 0,
    priceFormatted: "Free",
    organizer: "Campus Cultural Committee & Student Council",
    contactDetails: { name: "Prof. Monica Bell", email: "cultural@campus.edu", phone: "+91 98765 11008" },
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60",
    equipmentRequirements: ["Outdoor Sound Rig", "Stage Canopy", "Flood Lights", "LED Video Walls", "Wireless Mics (12)"],
    volunteerRequirements: { count: 40, squads: ["Crowd Control", "Stage Management", "Hospitality", "Security"] },
    securityRequirements: { guardsRequired: 16, entryPoints: ["Gate 1", "Gate 2", "Gate 3", "Amphitheatre Perimeter"], emergencyPlan: "2 Campus Ambulances stationed, barricaded crowd channels, night flood lighting.", status: "APPROVED" },
    transportRequirements: { vehiclesCount: 4, pickupPoints: ["Metro Station", "Hostel Quads"], dropPoints: ["Open Amphitheatre"], timings: "03:30 PM - 11:30 PM" },
    communicationRequirements: { announcementsCount: 6, channels: ["Campus App", "Instagram Live", "Posters"] },
    permissionRequirements: [{ type: "Late Night Sound Clearance", status: "APPROVED", approvedBy: "City Police & Registrar" }, { type: "Food Stall Fire Permit", status: "APPROVED" }],
    rules: ["QR ID verification mandatory at all perimeter gates.", "Alcohol, tobacco, and fireworks strictly prohibited.", "Follow designated entrance/exit crowd lanes."],
    prizePool: "₹1,00,000",
    winnerPrizes: [
      { position: "Battle of the Bands Winner", amount: "₹45,000", description: "Champions Trophy + Professional Studio Recording Session", perks: ["Rolling Trophy", "Studio Session", "Pro Certificate"] },
      { position: "Inter-College Dance Crew Champions", amount: "₹35,000", description: "Gold Trophy + National Fest Direct Entry", perks: ["Gold Trophy", "Direct Entry"] },
      { position: "Neo-Campus Fashion Show Winner", amount: "₹20,000", description: "Designer Trophy & Model Portfolio Feature", perks: ["Trophy", "Feature Shoot"] },
    ],
    schedule: [
      { time: "04:00 PM", activity: "Street Dance & Flashmob Showcase", venue: "Central Quad" },
      { time: "05:30 PM", activity: "Inter-College Battle of the Bands", venue: "Open Amphitheatre" },
      { time: "07:30 PM", activity: "Fashion Show: Neo-Campus Couture", venue: "Main Auditorium" },
      { time: "09:00 PM", activity: "Celebrity Pro-Nite Live Musical Concert", venue: "Open Amphitheatre" },
    ],
    status: "REGISTRATION_OPEN",
  },
  {
    id: "evt-sports-carnival-2026",
    name: "Sports Carnival",
    type: "Sports Event",
    category: "Sports",
    description: "Annual intra-university athletics and sports tournament including Football, Basketball, Badminton, Table Tennis, Track & Field sprints, and Tug of War.",
    date: "Dec 04 - 05, 2026",
    startDate: "2026-12-04T08:00:00",
    endDate: "2026-12-05T18:00:00",
    startTime: "08:00 AM",
    endTime: "06:00 PM",
    registrationDeadline: "2026-12-01T23:59:59",
    venueId: "venue-9",
    venueName: "Indoor Sports Complex & Open Ground",
    capacity: 800,
    registeredCount: 640,
    price: 50,
    priceFormatted: "₹50",
    organizer: "Department of Physical Education & Sports Board",
    contactDetails: { name: "Coach Mahendra Singh", email: "sports@campus.edu", phone: "+91 98765 11009" },
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60",
    equipmentRequirements: ["Digital Scoreboards", "PA Audio System", "First Aid Kits", "Whistles & Cones"],
    volunteerRequirements: { count: 25, squads: ["Court Referees", "Hydration Staff", "Logistics"] },
    securityRequirements: { guardsRequired: 8, entryPoints: ["West Gate", "Sports Complex Lobby"], emergencyPlan: "First aid paramedic and physio team stationed in Sports 102.", status: "APPROVED" },
    transportRequirements: { vehiclesCount: 2, pickupPoints: ["Hostel Blocks"], dropPoints: ["Sports Complex"], timings: "07:30 AM - 06:30 PM" },
    communicationRequirements: { announcementsCount: 4, channels: ["Campus App", "PA Sound Announcements"] },
    permissionRequirements: [{ type: "Sports Board Approval", status: "APPROVED" }],
    rules: ["Appropriate sports jersey and non-marking footwear required for indoor courts.", "Medical fitness certificate must be signed before contact sports."],
    prizePool: "₹60,000",
    winnerPrizes: [
      { position: "Inter-Department Football Champions", amount: "₹25,000", description: "Gold Rolling Championship Cup + Individual Medals", perks: ["Gold Cup", "Gold Medals", "Champion Jerseys"] },
      { position: "Basketball Tournament Winners", amount: "₹20,000", description: "Championship Trophy & Certificates", perks: ["Silver Trophy", "Medals"] },
      { position: "Best University Athlete (Male & Female)", amount: "₹15,000", description: "Athletic Excellence Scholarship + Blazer Crest", perks: ["Scholarship", "Honorary Crest"] },
    ],
    schedule: [
      { time: "08:00 AM", activity: "Athletes March Past & Torch Lighting", venue: "Open Ground" },
      { time: "09:30 AM", activity: "Track & Field Heats (100m, 400m, 4x100m Relay)", venue: "Open Ground Track" },
      { time: "11:30 AM", activity: "Basketball & Badminton Quarter-Finals", venue: "Indoor Sports Complex" },
      { time: "01:30 PM", activity: "Lunch Break", venue: "Sports Pavilion" },
      { time: "02:30 PM", activity: "Inter-Department Football Final Match", venue: "Open Ground" },
      { time: "05:00 PM", activity: "Trophy Presentation & Best Athlete Awards", venue: "Indoor Sports Complex" },
    ],
    status: "REGISTRATION_OPEN",
  },
];
