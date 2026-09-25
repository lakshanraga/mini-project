/**
 * SafeCampus Reporting Wizard & Evidence Handler
 */

document.addEventListener("DOMContentLoaded", () => {
  initReportingModule();
});

function initReportingModule() {
  const reportForm = document.getElementById("incidentReportForm");
  if (!reportForm) return;

  const reportingTypeRadios = document.querySelectorAll('input[name="reportingType"]');
  const studentDetailsFields = document.getElementById("studentDetailsFields");
  const descriptionInput = document.getElementById("incidentDescription");
  const descAiToxicityBadge = document.getElementById("descAiToxicityBadge");
  const evidenceDropzone = document.getElementById("evidenceDropzone");
  const evidenceFileInput = document.getElementById("evidenceFiles");
  const evidencePreviewContainer = document.getElementById("evidencePreviewContainer");
  const urgencySelect = document.getElementById("incidentUrgency");

  let uploadedFiles = [];

  // Toggle Identified vs Anonymous student fields
  reportingTypeRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "Identified") {
        studentDetailsFields.classList.remove("hidden");
        document.getElementById("studentName").setAttribute("required", "true");
        document.getElementById("studentId").setAttribute("required", "true");
      } else {
        studentDetailsFields.classList.add("hidden");
        document.getElementById("studentName").removeAttribute("required");
        document.getElementById("studentId").removeAttribute("required");
      }
    });
  });

  // Real-time AI Toxicity scoring of user's description
  if (descriptionInput && descAiToxicityBadge) {
    descriptionInput.addEventListener("input", () => {
      const text = descriptionInput.value.trim();
      if (text.length < 5) {
        descAiToxicityBadge.className = "toxicity-badge-pill safe hidden";
        return;
      }
      const result = ToxicityEngine.analyze(text);
      descAiToxicityBadge.classList.remove("hidden");
      
      if (result.overallScore >= 70) {
        descAiToxicityBadge.className = "toxicity-badge-pill critical";
        descAiToxicityBadge.innerHTML = `⚠️ High Severity Incident Detected (${result.overallScore}%) - Urgent Priority Recommended`;
        if (urgencySelect) urgencySelect.value = "Critical";
      } else if (result.overallScore >= 35) {
        descAiToxicityBadge.className = "toxicity-badge-pill warning";
        descAiToxicityBadge.innerHTML = `⚠️ Moderate Harassment Severity (${result.overallScore}%)`;
        if (urgencySelect && urgencySelect.value !== "Critical") urgencySelect.value = "High";
      } else {
        descAiToxicityBadge.className = "toxicity-badge-pill safe";
        descAiToxicityBadge.innerHTML = `✓ Content recorded (${result.overallScore}% severity)`;
      }
    });
  }

  // Evidence file upload & simulated previews
  if (evidenceDropzone && evidenceFileInput) {
    evidenceDropzone.addEventListener("click", () => evidenceFileInput.click());

    evidenceDropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      evidenceDropzone.classList.add("drag-hover");
    });

    evidenceDropzone.addEventListener("dragleave", () => {
      evidenceDropzone.classList.remove("drag-hover");
    });

    evidenceDropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      evidenceDropzone.classList.remove("drag-hover");
      handleFiles(e.dataTransfer.files);
    });

    evidenceFileInput.addEventListener("change", (e) => {
      handleFiles(e.target.files);
    });
  }

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      if (uploadedFiles.length >= 5) {
        showToast("Maximum 5 evidence files allowed.", "warning");
        return;
      }
      uploadedFiles.push(file);
      renderEvidencePreview(file);
    });
  }

  function renderEvidencePreview(file) {
    const item = document.createElement("div");
    item.className = "evidence-chip";
    const isImage = file.type.startsWith("image/");
    
    item.innerHTML = `
      <span class="file-icon">${isImage ? "🖼️" : "📄"}</span>
      <span class="file-name" title="${file.name}">${file.name.substring(0, 18)}...</span>
      <button type="button" class="remove-btn" title="Remove file">&times;</button>
    `;

    item.querySelector(".remove-btn").addEventListener("click", () => {
      uploadedFiles = uploadedFiles.filter(f => f !== file);
      item.remove();
    });

    evidencePreviewContainer.appendChild(item);
  }

  // Handle Form Submission
  reportForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const reportingType = document.querySelector('input[name="reportingType"]:checked').value;
    const studentName = reportingType === "Identified" 
      ? document.getElementById("studentName").value.trim() 
      : "Anonymous Student";
    const studentId = reportingType === "Identified" 
      ? document.getElementById("studentId").value.trim() 
      : "N/A (Confidential)";
    const department = document.getElementById("studentDept").value;
    const category = document.getElementById("incidentCategory").value;
    const platform = document.getElementById("incidentPlatform").value;
    const offenderHandle = document.getElementById("offenderHandle").value.trim() || "Unknown / Not Disclosed";
    const urgency = document.getElementById("incidentUrgency").value;
    const description = document.getElementById("incidentDescription").value.trim();

    // Run toxicity analysis on incident description
    const aiAnalysis = ToxicityEngine.analyze(description);

    // Generate unique Report ID: CBP-2026-XXXX
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newCaseId = `CBP-2026-${randomCode}`;
    const timestamp = new Date().toISOString();

    const newIncident = {
      id: newCaseId,
      timestamp,
      reportingType,
      studentName,
      studentId,
      department: department || "General / Not Specified",
      category,
      platform,
      offenderHandle,
      urgency,
      description,
      evidenceCount: Math.max(uploadedFiles.length, 1),
      status: "Submitted",
      toxicityScore: aiAnalysis.overallScore,
      assignedOfficer: "Pending Assignment (Grievance Cell)",
      notes: [
        {
          date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          text: `Complaint lodged via SafeCampus Student Portal. AI Toxicity Severity: ${aiAnalysis.overallScore}% (${aiAnalysis.riskLevel} risk).`
        }
      ]
    };

    // Store in LocalStorage
    const incidents = getStoredIncidents();
    incidents.unshift(newIncident);
    saveIncidents(incidents);

    // Reset Form
    reportForm.reset();
    uploadedFiles = [];
    evidencePreviewContainer.innerHTML = "";
    if (descAiToxicityBadge) descAiToxicityBadge.classList.add("hidden");

    // Show Success Modal with Print/Track capability
    showSubmissionModal(newIncident);

    // Refresh Admin & Trackers if active
    if (window.refreshAdminDashboard) window.refreshAdminDashboard();
  });
}

function showSubmissionModal(incident) {
  const modal = document.getElementById("submissionModal");
  if (!modal) return;

  document.getElementById("modalCaseId").textContent = incident.id;
  document.getElementById("modalCategory").textContent = incident.category;
  document.getElementById("modalPlatform").textContent = incident.platform;
  document.getElementById("modalUrgency").textContent = incident.urgency;
  document.getElementById("modalReportingType").textContent = incident.reportingType;
  document.getElementById("modalToxicityScore").textContent = `${incident.toxicityScore}%`;

  modal.classList.add("active");

  // Track button inside modal
  const trackBtn = document.getElementById("modalTrackBtn");
  if (trackBtn) {
    trackBtn.onclick = () => {
      modal.classList.remove("active");
      switchTab("tracker");
      const trackerInput = document.getElementById("trackerCaseInput");
      if (trackerInput) {
        trackerInput.value = incident.id;
        document.getElementById("trackCaseBtn").click();
      }
    };
  }

  // Print receipt button
  const printBtn = document.getElementById("modalPrintBtn");
  if (printBtn) {
    printBtn.onclick = () => {
      window.print();
    };
  }
}
