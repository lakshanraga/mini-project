/**
 * SafeCampus Case Tracker Module
 */

document.addEventListener("DOMContentLoaded", () => {
  initTrackerModule();
});

function initTrackerModule() {
  const trackBtn = document.getElementById("trackCaseBtn");
  const caseInput = document.getElementById("trackerCaseInput");
  const quickPillContainer = document.getElementById("trackerQuickPills");
  const trackingResultContainer = document.getElementById("trackingResultContainer");
  const trackingNotFound = document.getElementById("trackingNotFound");

  renderQuickPills();

  if (trackBtn && caseInput) {
    trackBtn.addEventListener("click", () => {
      const query = caseInput.value.trim().toUpperCase();
      if (!query) {
        showToast("Please enter a valid Case ID (e.g., CBP-2026-1042)", "warning");
        return;
      }
      lookupCase(query);
    });

    caseInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        trackBtn.click();
      }
    });
  }

  function renderQuickPills() {
    if (!quickPillContainer) return;
    const incidents = getStoredIncidents();
    quickPillContainer.innerHTML = "";
    
    // Take up to 4 recent incidents for quick demo
    incidents.slice(0, 4).forEach(inc => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "demo-pill-btn";
      pill.innerHTML = `<span>${inc.id}</span> <small>(${inc.status})</small>`;
      pill.addEventListener("click", () => {
        caseInput.value = inc.id;
        lookupCase(inc.id);
      });
      quickPillContainer.appendChild(pill);
    });
  }

  function lookupCase(caseId) {
    const incidents = getStoredIncidents();
    const caseData = incidents.find(item => item.id.toUpperCase() === caseId.toUpperCase());

    if (!caseData) {
      if (trackingResultContainer) trackingResultContainer.classList.add("hidden");
      if (trackingNotFound) trackingNotFound.classList.remove("hidden");
      return;
    }

    if (trackingNotFound) trackingNotFound.classList.add("hidden");
    if (trackingResultContainer) {
      trackingResultContainer.classList.remove("hidden");
      renderCaseTimeline(caseData);
    }
  }

  function renderCaseTimeline(c) {
    // Basic Details
    document.getElementById("trackResId").textContent = c.id;
    document.getElementById("trackResDate").textContent = new Date(c.timestamp).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    document.getElementById("trackResCategory").textContent = c.category;
    document.getElementById("trackResPlatform").textContent = c.platform;
    document.getElementById("trackResOfficer").textContent = c.assignedOfficer || "Grievance Redressal Committee";
    
    // Status Badge
    const statusBadge = document.getElementById("trackResStatusBadge");
    statusBadge.textContent = c.status;
    statusBadge.className = `status-badge ${getStatusClass(c.status)}`;

    // Toxicity Score
    const toxBadge = document.getElementById("trackResToxScore");
    toxBadge.textContent = `${c.toxicityScore || 0}%`;
    toxBadge.className = `tox-indicator ${c.toxicityScore > 70 ? 'high' : c.toxicityScore > 35 ? 'med' : 'low'}`;

    // Description & Details
    document.getElementById("trackResDesc").textContent = c.description;

    // Timeline Stages
    // Stages: 1. Submitted, 2. Triaged & Assigned, 3. Under Investigation, 4. Action Taken, 5. Resolved
    const stages = [
      { id: "step-1", title: "Complaint Registered", desc: "Digital intake completed & assigned unique hash tracking key." },
      { id: "step-2", title: "AI Triaged & Verified", desc: "NLP toxicity model analyzed evidence & severity parameters." },
      { id: "step-3", title: "Assigned & Inquiring", desc: "Disciplinary committee & cyber cell initiated fact verification." },
      { id: "step-4", title: "Corrective Action", desc: "Offender notice served / platform content takedown request issued." },
      { id: "step-5", title: "Resolution & Support", desc: "Counseling support extended, follow-up logged, case formally closed." }
    ];

    let currentStepNumber = 1;
    if (c.status === "Submitted") currentStepNumber = 1;
    else if (c.status === "Under Review") currentStepNumber = 2;
    else if (c.status === "Under Investigation") currentStepNumber = 3;
    else if (c.status === "Action Taken") currentStepNumber = 4;
    else if (c.status === "Resolved") currentStepNumber = 5;

    const timelineContainer = document.getElementById("trackerTimelineSteps");
    if (timelineContainer) {
      timelineContainer.innerHTML = stages.map((st, idx) => {
        const stepNum = idx + 1;
        let stepState = "pending";
        if (stepNum < currentStepNumber) stepState = "completed";
        else if (stepNum === currentStepNumber) stepState = "active";

        return `
          <div class="timeline-step ${stepState}">
            <div class="step-indicator">
              <span class="step-icon">${stepState === 'completed' ? '✓' : stepNum}</span>
              <div class="step-line"></div>
            </div>
            <div class="step-content">
              <h4>${st.title}</h4>
              <p>${st.desc}</p>
              ${stepState === 'active' ? `<span class="step-badge-live">Current Stage</span>` : ''}
            </div>
          </div>
        `;
      }).join("");
    }

    // Investigation Log Entries
    const logList = document.getElementById("trackInvestigationLogs");
    if (logList) {
      if (c.notes && c.notes.length > 0) {
        logList.innerHTML = c.notes.map(n => `
          <div class="log-entry-item">
            <span class="log-date">${n.date}</span>
            <p class="log-text">${escapeHtml(n.text)}</p>
          </div>
        `).join("");
      } else {
        logList.innerHTML = `<p class="empty-hint">Case is queued. Initial notes will appear once assigned officer begins inquiry.</p>`;
      }
    }

    // Interactive Counselor Chat Simulator
    setupCounselorChat(c.id);
  }

  function setupCounselorChat(caseId) {
    const chatBox = document.getElementById("counselorChatMessages");
    const chatInput = document.getElementById("counselorMsgInput");
    const sendBtn = document.getElementById("sendCounselorMsgBtn");

    if (!chatBox || !chatInput || !sendBtn) return;

    // Reset default counselor greeting
    chatBox.innerHTML = `
      <div class="chat-msg counselor">
        <div class="msg-avatar">🛡️</div>
        <div class="msg-bubble">
          <strong>Campus Counselor:</strong>
          <p>Hello! This is a confidential safe line linked to Case <b>${caseId}</b>. You are not alone. Feel free to leave questions or follow-up evidence here.</p>
          <span class="msg-time">Just now</span>
        </div>
      </div>
    `;

    sendBtn.onclick = () => {
      const text = chatInput.value.trim();
      if (!text) return;

      // Append student message
      const studentMsg = document.createElement("div");
      studentMsg.className = "chat-msg student";
      studentMsg.innerHTML = `
        <div class="msg-bubble">
          <p>${escapeHtml(text)}</p>
          <span class="msg-time">Just now</span>
        </div>
      `;
      chatBox.appendChild(studentMsg);
      chatInput.value = "";
      chatBox.scrollTop = chatBox.scrollHeight;

      // Simulated automated supportive counselor response
      setTimeout(() => {
        const counselorReplies = [
          "Thank you for sharing this update. I have noted this in your confidential grievance dossier. Please remember to take screenshots if there are any new messages.",
          "We understand how distressing this is. Your safety and peace of mind are our priority. An officer is actively looking into the digital logs.",
          "Understood. If you feel overwhelmed at any point, our campus counseling center is also open for walk-ins, or you can dial the 24/7 student support helpline 14416.",
          "Received. We will escalate this directly to the disciplinary committee chair for expedited review."
        ];
        const randomReply = counselorReplies[Math.floor(Math.random() * counselorReplies.length)];

        const counselorMsg = document.createElement("div");
        counselorMsg.className = "chat-msg counselor";
        counselorMsg.innerHTML = `
          <div class="msg-avatar">🛡️</div>
          <div class="msg-bubble">
            <strong>Campus Counselor:</strong>
            <p>${randomReply}</p>
            <span class="msg-time">Just now</span>
          </div>
        `;
        chatBox.appendChild(counselorMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 1000);
    };
  }

  function getStatusClass(status) {
    switch (status) {
      case "Submitted": return "badge-submitted";
      case "Under Review": return "badge-review";
      case "Under Investigation": return "badge-investigation";
      case "Action Taken": return "badge-action";
      case "Resolved": return "badge-resolved";
      default: return "badge-default";
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }
}
