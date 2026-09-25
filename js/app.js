/**
 * SafeCampus Main Application Orchestrator
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initThemeToggle();
  initAiAnalyzer();
  initEmergencyModal();
  initDemoPresets();
});

// Tab Switching
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link[data-tab]");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  // Action links with data-tab
  document.querySelectorAll("[data-navigate]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.getAttribute("data-navigate");
      switchTab(target);
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById("mobileMenuBtn");
  const navMenu = document.getElementById("navMenu");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }
}

function switchTab(tabId) {
  // Update nav links
  document.querySelectorAll(".nav-link[data-tab]").forEach(link => {
    if (link.getAttribute("data-tab") === tabId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Update tab sections
  document.querySelectorAll(".portal-tab-section").forEach(sec => {
    if (sec.id === `tab-${tabId}`) {
      sec.classList.remove("hidden");
      sec.classList.add("fade-in");
    } else {
      sec.classList.add("hidden");
      sec.classList.remove("fade-in");
    }
  });

  // Close mobile nav if open
  const navMenu = document.getElementById("navMenu");
  if (navMenu) navMenu.classList.remove("open");

  // Scroll to top of tab smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Hook specific tabs
  if (tabId === "admin" && window.refreshAdminDashboard) {
    window.refreshAdminDashboard();
  }
}
window.switchTab = switchTab;

// Theme Initialization
function initThemeToggle() {
  localStorage.removeItem("safecampus_theme");
  document.documentElement.removeAttribute("data-theme");
}

// AI Toxicity Analyzer Tab Logic
function initAiAnalyzer() {
  const input = document.getElementById("aiAnalyzerInput");
  const analyzeBtn = document.getElementById("aiAnalyzeBtn");
  const clearBtn = document.getElementById("aiClearBtn");
  const resultsContainer = document.getElementById("aiResultsSection");

  if (!input || !analyzeBtn) return;

  analyzeBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) {
      showToast("Please enter or paste a message snippet to evaluate.", "warning");
      return;
    }
    runAnalysis(text);
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      input.value = "";
      if (resultsContainer) resultsContainer.classList.add("hidden");
    });
  }

  // Real-time calculation on typing (debounced)
  let debounceTimer;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (input.value.trim().length > 3) {
        runAnalysis(input.value.trim(), true);
      }
    }, 400);
  });
}

function runAnalysis(text, silent = false) {
  const result = ToxicityEngine.analyze(text);
  const container = document.getElementById("aiResultsSection");
  if (!container) return;

  container.classList.remove("hidden");

  // Animate Gauge & Score
  const scoreElem = document.getElementById("aiOverallScore");
  const gaugeFill = document.getElementById("aiGaugeCircle");
  const severityBadge = document.getElementById("aiSeverityBadge");
  const actionText = document.getElementById("aiRecommendedAction");
  const highlightedSnippet = document.getElementById("aiHighlightedSnippet");

  if (scoreElem) scoreElem.textContent = `${result.overallScore}%`;
  if (severityBadge) {
    severityBadge.textContent = result.severity;
    severityBadge.className = `severity-badge ${result.riskLevel.toLowerCase()}`;
  }
  if (actionText) actionText.textContent = result.recommendedAction;
  if (highlightedSnippet) {
    highlightedSnippet.innerHTML = result.highlightedHtml || escapeHtml(text);
  }

  // Update Category Progress Bars
  updateBar("barThreat", "valThreat", result.categories.threat);
  updateBar("barHate", "valHate", result.categories.hateSpeech);
  updateBar("barInsult", "valInsult", result.categories.insult);
  updateBar("barBlackmail", "valBlackmail", result.categories.blackmailStalking);
  updateBar("barExclusion", "valExclusion", result.categories.socialExclusion);

  // Flagged Keywords Chips
  const flagsList = document.getElementById("aiFlaggedTokensList");
  if (flagsList) {
    if (result.flaggedKeywords.length > 0) {
      flagsList.innerHTML = result.flaggedKeywords.map(k => `
        <span class="flag-chip">⚠️ ${escapeHtml(k)}</span>
      `).join("");
    } else {
      flagsList.innerHTML = `<span class="text-muted text-sm">No hostile trigger patterns detected.</span>`;
    }
  }

  // Update SVG Circle if present
  if (gaugeFill) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (result.overallScore / 100) * circumference;
    gaugeFill.style.strokeDashoffset = offset;
    
    // Dynamic color transition
    if (result.overallScore >= 75) gaugeFill.style.stroke = "var(--color-critical)";
    else if (result.overallScore >= 40) gaugeFill.style.stroke = "var(--color-warning)";
    else gaugeFill.style.stroke = "var(--color-safe)";
  }

  if (!silent) {
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function updateBar(barId, valId, val) {
  const bar = document.getElementById(barId);
  const label = document.getElementById(valId);
  if (bar) bar.style.width = `${val}%`;
  if (label) label.textContent = `${val}%`;
}

// Preset Quick Demos for Examiner / Evaluator Presentation
function initDemoPresets() {
  const presets = [
    {
      label: "Threat & Blackmail",
      text: "I know where you live and I have your private photos. Send me money or I will ruin your life and leak everything."
    },
    {
      label: "Group Hate & Harassment",
      text: "You are an ugly pathetic loser. Nobody likes you here, delete your account and kill yourself."
    },
    {
      label: "Body Shaming Meme",
      text: "Look at this disgusting clown trying to look smart. Total joke of our college department."
    },
    {
      label: "Constructive / Friendly Message",
      text: "Great job on the seminar presentation today! Really appreciate your teamwork and helpful advice."
    }
  ];

  const container = document.getElementById("demoPresetsContainer");
  if (!container) return;

  presets.forEach(p => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-preset-chip";
    btn.textContent = p.label;
    btn.addEventListener("click", () => {
      const input = document.getElementById("aiAnalyzerInput");
      if (input) {
        input.value = p.text;
        runAnalysis(p.text);
      }
    });
    container.appendChild(btn);
  });
}

// Emergency SOS Modal
function initEmergencyModal() {
  const modal = document.getElementById("emergencyModal");
  const openBtns = document.querySelectorAll(".btn-open-sos");
  const closeBtn = document.getElementById("closeSosModalBtn");

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  // Close modals on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop.active").forEach(m => m.classList.remove("active"));
    }
  });
}

// Toast Notifications
function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast-item toast-${type} fade-in`;
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : type === "warning" ? "⚠️" : "ℹ️";
  toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-msg">${escapeHtml(message)}</span>`;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
window.showToast = showToast;

function escapeHtml(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}
