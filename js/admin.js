/**
 * SafeCampus Admin & Grievance Cell Dashboard Module
 */

document.addEventListener("DOMContentLoaded", () => {
  initAdminModule();
});

let isAdminAuthenticated = false;

function initAdminModule() {
  const loginForm = document.getElementById("adminLoginForm");
  const adminAuthCard = document.getElementById("adminAuthCard");
  const adminMainDashboard = document.getElementById("adminMainDashboard");
  const quickDemoLoginBtn = document.getElementById("quickDemoLoginBtn");
  const adminLogoutBtn = document.getElementById("adminLogoutBtn");

  // Filters
  const searchInput = document.getElementById("adminSearchInput");
  const statusFilter = document.getElementById("adminFilterStatus");
  const urgencyFilter = document.getElementById("adminFilterUrgency");
  const resetDataBtn = document.getElementById("adminResetDataBtn");
  const exportCsvBtn = document.getElementById("adminExportCsvBtn");

  // Authentication
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("adminUsername").value.trim();
      const pass = document.getElementById("adminPassword").value.trim();

      if (user === "admin" && pass === "admin123") {
        setAdminLoggedIn(true);
      } else {
        showToast("Invalid credentials! (Demo hint: admin / admin123)", "error");
      }
    });
  }

  if (quickDemoLoginBtn) {
    quickDemoLoginBtn.addEventListener("click", () => {
      document.getElementById("adminUsername").value = "admin";
      document.getElementById("adminPassword").value = "admin123";
      setAdminLoggedIn(true);
      showToast("Signed in as Campus Grievance Administrator", "success");
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", () => {
      setAdminLoggedIn(false);
      showToast("Logged out of Admin Portal", "info");
    });
  }

  // Filter Listeners
  if (searchInput) searchInput.addEventListener("input", renderAdminTable);
  if (statusFilter) statusFilter.addEventListener("change", renderAdminTable);
  if (urgencyFilter) urgencyFilter.addEventListener("change", renderAdminTable);

  if (resetDataBtn) {
    resetDataBtn.addEventListener("click", () => {
      if (confirm("Reset portal to initial demo cases? Any custom tests will be reset.")) {
        localStorage.removeItem("safecampus_incidents");
        refreshAdminDashboard();
        showToast("System database reset to initial demo state.", "info");
      }
    });
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", exportIncidentsToCsv);
  }

  function setAdminLoggedIn(loggedIn) {
    isAdminAuthenticated = loggedIn;
    if (loggedIn) {
      adminAuthCard.classList.add("hidden");
      adminMainDashboard.classList.remove("hidden");
      refreshAdminDashboard();
    } else {
      adminAuthCard.classList.remove("hidden");
      adminMainDashboard.classList.add("hidden");
    }
  }

  window.refreshAdminDashboard = () => {
    if (!isAdminAuthenticated) return;
    renderAdminStats();
    renderAdminTable();
    renderPlatformBars();
  };

  function renderAdminStats() {
    const incidents = getStoredIncidents();
    const total = incidents.length;
    const pending = incidents.filter(i => i.status !== "Resolved").length;
    const critical = incidents.filter(i => i.urgency === "Critical" || i.urgency === "High").length;
    const resolved = incidents.filter(i => i.status === "Resolved").length;

    document.getElementById("statTotalIncidents").textContent = total;
    document.getElementById("statPendingIncidents").textContent = pending;
    document.getElementById("statCriticalIncidents").textContent = critical;
    document.getElementById("statResolvedIncidents").textContent = resolved;
  }

  function renderPlatformBars() {
    const incidents = getStoredIncidents();
    const platformCounts = {};
    incidents.forEach(inc => {
      const p = inc.platform || "Other";
      platformCounts[p] = (platformCounts[p] || 0) + 1;
    });

    const container = document.getElementById("adminPlatformMetrics");
    if (!container) return;

    const total = incidents.length || 1;
    container.innerHTML = Object.entries(platformCounts).map(([platform, count]) => {
      const pct = Math.round((count / total) * 100);
      return `
        <div class="platform-bar-row">
          <div class="platform-meta">
            <span class="platform-label">${platform}</span>
            <span class="platform-count">${count} reports (${pct}%)</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderAdminTable() {
    const tableBody = document.getElementById("adminIncidentsTbody");
    if (!tableBody) return;

    let incidents = getStoredIncidents();
    const search = (document.getElementById("adminSearchInput")?.value || "").toLowerCase();
    const statusVal = document.getElementById("adminFilterStatus")?.value || "ALL";
    const urgencyVal = document.getElementById("adminFilterUrgency")?.value || "ALL";

    // Filtering
    incidents = incidents.filter(i => {
      const matchesSearch = 
        i.id.toLowerCase().includes(search) || 
        i.category.toLowerCase().includes(search) || 
        i.studentName.toLowerCase().includes(search) ||
        i.platform.toLowerCase().includes(search);
      const matchesStatus = statusVal === "ALL" || i.status === statusVal;
      const matchesUrgency = urgencyVal === "ALL" || i.urgency === urgencyVal;

      return matchesSearch && matchesStatus && matchesUrgency;
    });

    if (incidents.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">No matching complaints found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = incidents.map(inc => {
      return `
        <tr>
          <td><strong class="font-mono text-purple">${inc.id}</strong></td>
          <td>
            <div class="table-student-info">
              <span>${escapeHtml(inc.studentName)}</span>
              <small class="text-muted">${inc.reportingType === 'Anonymous' ? '🔒 Anonymous' : inc.department}</small>
            </div>
          </td>
          <td>
            <span class="category-pill">${inc.category}</span>
            <small class="platform-sub">${inc.platform}</small>
          </td>
          <td>
            <span class="urgency-tag ${inc.urgency.toLowerCase()}">${inc.urgency}</span>
          </td>
          <td>
            <span class="toxicity-gauge-mini ${inc.toxicityScore > 70 ? 'crit' : inc.toxicityScore > 35 ? 'med' : 'low'}">
              ${inc.toxicityScore}%
            </span>
          </td>
          <td>
            <select class="table-status-select" onchange="updateIncidentStatus('${inc.id}', this.value)">
              <option value="Submitted" ${inc.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
              <option value="Under Review" ${inc.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Under Investigation" ${inc.status === 'Under Investigation' ? 'selected' : ''}>Under Investigation</option>
              <option value="Action Taken" ${inc.status === 'Action Taken' ? 'selected' : ''}>Action Taken</option>
              <option value="Resolved" ${inc.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
            </select>
          </td>
          <td>
            <button type="button" class="btn-table-action" onclick="openCaseDossierModal('${inc.id}')">
              Review Dossier 👁️
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  function exportIncidentsToCsv() {
    const incidents = getStoredIncidents();
    if (incidents.length === 0) return;

    const headers = ["Case_ID", "Timestamp", "Type", "Student_Name", "Department", "Category", "Platform", "Offender", "Urgency", "Toxicity_Score", "Status"];
    const rows = incidents.map(i => [
      i.id,
      i.timestamp,
      i.reportingType,
      `"${i.studentName}"`,
      `"${i.department}"`,
      `"${i.category}"`,
      `"${i.platform}"`,
      `"${i.offenderHandle}"`,
      i.urgency,
      i.toxicityScore,
      i.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SafeCampus_Grievance_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Incident report exported as CSV!", "success");
  }
}

// Global window actions
window.updateIncidentStatus = (caseId, newStatus) => {
  const incidents = getStoredIncidents();
  const index = incidents.findIndex(i => i.id === caseId);
  if (index !== -1) {
    incidents[index].status = newStatus;
    const nowStr = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    incidents[index].notes = incidents[index].notes || [];
    incidents[index].notes.push({
      date: nowStr,
      text: `Status updated to "${newStatus}" by Disciplinary Committee Officer.`
    });
    saveIncidents(incidents);
    showToast(`Case ${caseId} updated to ${newStatus}`, "info");
    if (window.refreshAdminDashboard) window.refreshAdminDashboard();
  }
};

window.openCaseDossierModal = (caseId) => {
  const incidents = getStoredIncidents();
  const caseItem = incidents.find(i => i.id === caseId);
  if (!caseItem) return;

  const modal = document.getElementById("adminDossierModal");
  if (!modal) return;

  document.getElementById("dossierCaseId").textContent = caseItem.id;
  document.getElementById("dossierStudent").textContent = caseItem.reportingType === "Anonymous" 
    ? "Anonymous Student (Protected)" 
    : `${caseItem.studentName} (${caseItem.studentId}) - ${caseItem.department}`;
  document.getElementById("dossierCategory").textContent = caseItem.category;
  document.getElementById("dossierPlatform").textContent = `${caseItem.platform} (Offender: ${caseItem.offenderHandle})`;
  document.getElementById("dossierUrgency").textContent = caseItem.urgency;
  document.getElementById("dossierToxicity").textContent = `${caseItem.toxicityScore}%`;
  document.getElementById("dossierDesc").textContent = caseItem.description;

  // Render logs
  const logBox = document.getElementById("dossierNotesList");
  if (logBox) {
    logBox.innerHTML = (caseItem.notes || []).map(n => `
      <div class="dossier-note-entry">
        <small class="text-muted">${n.date}</small>
        <p>${escapeHtml(n.text)}</p>
      </div>
    `).join("");
  }

  // Setup Add Note button
  const addNoteBtn = document.getElementById("dossierAddNoteBtn");
  const noteInput = document.getElementById("dossierNoteInput");
  if (addNoteBtn && noteInput) {
    addNoteBtn.onclick = () => {
      const text = noteInput.value.trim();
      if (!text) return;
      const nowStr = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      caseItem.notes = caseItem.notes || [];
      caseItem.notes.push({
        date: nowStr,
        text: `Officer Remark: ${text}`
      });
      saveIncidents(incidents);
      noteInput.value = "";
      openCaseDossierModal(caseId); // re-render
      showToast("Investigation note appended", "success");
      if (window.refreshAdminDashboard) window.refreshAdminDashboard();
    };
  }

  modal.classList.add("active");
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}
