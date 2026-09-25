# SafeCampus - College Cyberbullying Prevention & Incident Reporting Portal
> **College Mini Project** | 100% Static Web Application (HTML5, CSS3, Vanilla JavaScript)

---

## 📌 1. Project Overview & Abstract

With the rising prevalence of social media, student WhatsApp groups, anonymous confession pages, and Discord servers, cyberbullying and online harassment have become critical threats to student mental health and campus safety. 

**SafeCampus** is an intelligent, confidential, and comprehensive web portal created as a college mini project. It provides students with a secure environment to lodge complaints anonymously or openly, instantly screens incoming messages with a **Real-Time Natural Language Processing (NLP) Toxicity Engine**, tracks case inquiries across 5 distinct milestones, and gives university disciplinary authorities a full grievance management dashboard.

---

## 🎯 2. Key Objectives

1. **Confidentiality & Whistleblower Safety**: Enable victims and witnesses to file incidents anonymously without fear of academic or social retaliation.
2. **Automated Threat Triage**: Use client-side NLP pattern matching and lexical scoring to calculate a toxicity percentage (0–100%) and detect threats, extortion, and hate speech.
3. **Transparent Redressal Workflow**: Issue unique Case Tracking IDs (`CBP-2026-XXXX`) with a 5-stage inquiry timeline (Submitted → AI Triaged → Under Investigation → Action Taken → Resolved).
4. **Legal & Institutional Alignment**: Educate students on their rights under the Indian Information Technology Act (IT Act 2000: Sections 66E, 66D, 67) and UGC anti-ragging mandates.
5. **100% Static & Standalone**: Runs in any modern browser without requiring Node.js, Python, or backend servers.

---

## 🚀 3. Features & Modules

### 🔹 Module 1: AI Cyberbullying & Toxicity Analyzer
- Real-time scoring meter (SVG radial gauge).
- Multi-dimensional classification:
  - *Direct Threat & Physical Harm*
  - *Blackmail & Cyberstalking*
  - *Hate Speech & Identity Bias*
  - *Insults & Derogatory Language*
  - *Social Exclusion & Group Isolation*
- Dynamic token highlighting of aggressive keywords.
- One-click demo presets for examiner/viva demonstration.

### 🔹 Module 2: Confidential Incident Reporting Wizard
- Toggle between **100% Anonymous** and **Identified Student**.
- Platform selection (Instagram, WhatsApp, Discord, Confession Page, Snapchat, etc.).
- Real-time toxicity assist on incident description to automatically recommend urgency.
- Drag-and-drop evidence upload simulator (screenshots, PDFs) with preview chips.
- Digital grievance slip generation with printable receipt.

### 🔹 Module 3: Live Case Status Tracker
- Instant lookup using Case ID (e.g., `CBP-2026-1042`).
- 5-stage vertical timeline with active pulsing states.
- Official committee notes audit log.
- Simulated interactive Counselor Safe-Line chat for emotional support.

### 🔹 Module 4: Grievance Cell & Disciplinary Committee Dashboard
- Quick 1-click demo login (`admin` / `admin123`).
- Key metrics: Total Complaints, Active Inquiries, Critical Urgency, Resolved Cases.
- Platform breakdown progress chart.
- Filterable data table by status, urgency, and search keywords.
- In-place status updating with persistent `localStorage` synchronization.
- Case Dossier review modal with official note append feature.
- CSV export for official college records.

### 🔹 Module 5: Helplines & Legal Rights Hub
- 24/7 direct dial links:
  - **1930** (National Cybercrime Reporting Helpline / I4C)
  - **14416** (Tele-MANAS Mental Health Counseling)
  - **1800-180-5522** (National Anti-Ragging Cell)
  - **112** (All-India Police Emergency)
- Plain-language legal guides on IT Act Sections 66E, 66D, 67, and IPC 354D, 507.

### 🔹 Module 6: Interactive Cyber Safety Awareness Quiz
- 5 situational campus scenario questions with instant answer explanations.
- Real-time score counter.
- Generates an official printable **Digital Citizen Certificate of Cyber Safety**.

---

## 🛠️ 4. Technology Stack (100% Static)

| Layer | Technologies Used |
| :--- | :--- |
| **Structure** | Semantic HTML5 |
| **Styling** | Windows 8 Metro / Modern UI Kit (Flat colorful live tiles, sharp geometry 0px radius, vibrant emerald/purple/orange accents) |
| **Typography** | Segoe UI (Windows 8 Modern Typography) & JetBrains Mono |
| **Logic** | Vanilla JavaScript (ES6+ modular architecture) |
| **Data Storage** | Browser `localStorage` (Preserves complaints, statuses, notes, and theme across reloads) |
| **Architecture** | **100% Static Client-Side Application** (Zero server / Zero dependencies) |

---

## 📂 5. Folder Structure

```text
cyber-bullying-portal/
├── index.html                  # Main application entry point
├── README.md                   # Complete college project documentation
├── css/
│   ├── style.css               # Design system, theme variables, navbar, hero, cards
│   ├── components.css          # Form wizard, AI gauge, case timeline, modal styling
│   └── dashboard.css           # Admin statistics cards, data tables, filter toolbar
├── js/
│   ├── app.js                  # Navigation, theme toggle, SOS modal, orchestrator
│   ├── toxicity-engine.js      # Multi-dimensional NLP pattern matching & lexical scoring
│   ├── reporting.js            # Complaint form handling, validation, ID generation
│   ├── tracker.js              # Case tracking, timeline renderer, counselor chat
│   ├── admin.js                # Grievance dashboard, filters, dossier modal, CSV export
│   └── quiz.js                 # Interactive awareness quiz & certificate generator
└── data/
    └── sample-data.js          # Realistic seed cases & localStorage manager
```

---

## 💻 6. How to Run the Project

Since this project is **100% static**, no server or command-line installation is required:

1. Navigate to the project folder:
   ```
   d:\Projects\miniproject\cyber-bullying-portal
   ```
2. **Double-click `index.html`** to open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.
3. Everything is fully functional immediately!

---

## 🎓 7. College Viva / Exam Q&A Guide

**Q1: How does the AI Toxicity Engine work without a heavy backend server?**  
*Answer:* The engine runs client-side using lexical heuristics, regular expressions for threat patterns, weighted scoring, and caps-lock/punctuation aggression multipliers. It calculates weighted sub-scores for threats, hate speech, blackmail, and insults to produce an aggregate toxicity score (0–100%).

**Q2: How is confidentiality maintained in Anonymous reporting?**  
*Answer:* In Anonymous mode, no personal identifiers (such as student name, roll number, or email) are collected or stored. The system issues a randomized hash tracking key (`CBP-2026-XXXX`) which allows the complainant to check inquiry progress without exposing their identity.

**Q3: Where is the data stored?**  
*Answer:* All data is stored in the browser's `localStorage` using structured JSON. Updates made by the student or the admin (such as changing case status from "Under Review" to "Action Taken") immediately persist and synchronize across the portal.

**Q4: Which legal sections of the IT Act 2000 apply to college cyberbullying in India?**  
*Answer:* 
- **Section 66E**: Violation of bodily privacy (circulating non-consensual images).
- **Section 66D**: Cheating by personation using computer resource (fake profiles/impersonation).
- **Section 67**: Publishing or transmitting obscene material in electronic form.
- **Section 354D IPC / BNS**: Cyberstalking and persistent digital harassment.
