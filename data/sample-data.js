// Default Seed Data for SafeCampus College Cyberbullying Grievance Portal
const INITIAL_INCIDENTS = [
  {
    id: "CBP-2026-1042",
    timestamp: "2026-09-21T14:32:00Z",
    reportingType: "Anonymous",
    studentName: "Anonymous Student",
    studentId: "N/A (Confidential)",
    department: "Computer Science & Engg",
    category: "Harassment & Abusive DMs",
    platform: "Instagram",
    offenderHandle: "@pseudo_troll_99",
    urgency: "High",
    description: "Repeated offensive, abusive direct messages and threats sent to me regarding college festival elections. The user posted morphed pictures in story mentions.",
    evidenceCount: 2,
    status: "Under Investigation",
    toxicityScore: 88,
    assignedOfficer: "Dr. R. Sharma (Disciplinary Committee)",
    notes: [
      { date: "2026-09-21 15:00", text: "Report received via confidential intake queue. Flagged as High Priority due to visual morphing allegations." },
      { date: "2026-09-22 11:30", text: "Forwarded to Campus Cyber Safety Cell. IP log inquiry requested from college network firewall." }
    ]
  },
  {
    id: "CBP-2026-1088",
    timestamp: "2026-09-22T09:15:00Z",
    reportingType: "Identified",
    studentName: "Ananya Deshmukh",
    studentId: "CS-2024-041",
    department: "Information Technology",
    category: "Doxxing & Personal Info Leak",
    platform: "WhatsApp Groups",
    offenderHandle: "+91 98******12 (Admin of unofficial batch group)",
    urgency: "Critical",
    description: "Private contact numbers and home address were circulated without consent on an unauthorized student WhatsApp group along with defamatory captions.",
    evidenceCount: 3,
    status: "Action Taken",
    toxicityScore: 92,
    assignedOfficer: "Prof. S. Nair (Head of Grievance Redressal)",
    notes: [
      { date: "2026-09-22 10:00", text: "Urgent meeting summoned with group administrators." },
      { date: "2026-09-23 16:45", text: "Official warning notice served to perpetrators. Unauthorized group deleted. Victim provided safety counseling." }
    ]
  },
  {
    id: "CBP-2026-1120",
    timestamp: "2026-09-23T18:40:00Z",
    reportingType: "Anonymous",
    studentName: "Anonymous Student",
    studentId: "N/A (Confidential)",
    department: "Electronics & Comm.",
    category: "Cyberstalking & Impersonation",
    platform: "College Confession Page",
    offenderHandle: "@mit_uncensored_confessions",
    urgency: "Medium",
    description: "A fake account using my initials and photo has been posting derogatory statements targeting faculty and peers, making it seem like I posted it.",
    evidenceCount: 1,
    status: "Under Investigation",
    toxicityScore: 74,
    assignedOfficer: "Prof. K. Venkatesh (IT Faculty)",
    notes: [
      { date: "2026-09-24 10:15", text: "Meta grievance redressal escalation filed under IT Act Section 66D (Cheating by personation)." }
    ]
  },
  {
    id: "CBP-2026-0955",
    timestamp: "2026-09-18T11:20:00Z",
    reportingType: "Identified",
    studentName: "Karthik Verma",
    studentId: "ME-2023-018",
    department: "Mechanical Engineering",
    category: "Trolling & Body Shaming",
    platform: "Discord Campus Server",
    offenderHandle: "phantom_user#4021",
    urgency: "Low",
    description: "Derogatory comments and body shaming remarks posted in the public gaming channel during departmental tournament.",
    evidenceCount: 1,
    status: "Resolved",
    toxicityScore: 62,
    assignedOfficer: "Student Welfare Committee",
    notes: [
      { date: "2026-09-18 14:00", text: "Discord server moderator notified." },
      { date: "2026-09-19 12:00", text: "Offender apologized in writing. Restorative mediation completed successfully." }
    ]
  }
];

// Helper to initialize or retrieve from localStorage
function getStoredIncidents() {
  const stored = localStorage.getItem("safecampus_incidents");
  if (!stored) {
    localStorage.setItem("safecampus_incidents", JSON.stringify(INITIAL_INCIDENTS));
    return INITIAL_INCIDENTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_INCIDENTS;
  }
}

function saveIncidents(incidents) {
  localStorage.setItem("safecampus_incidents", JSON.stringify(incidents));
}
