/**
 * SafeCampus Interactive Cyber Safety Awareness Quiz & Digital Citizen Badge Generator
 */

const QUIZ_QUESTIONS = [
  {
    question: "A classmate creates an anonymous confession Instagram page and posts humiliating memes about another student's appearance. What is this categorized as?",
    options: [
      { text: "Harmless campus banter and freedom of speech", correct: false },
      { text: "Cyberbullying & Defamation punishable under IT Act Section 66A/67", correct: true },
      { text: "Normal social media trend that requires no intervention", correct: false },
      { text: "Justified criticism if the person made mistakes", correct: false }
    ],
    explanation: "Creating non-consensual defamatory content or body-shaming memes on social media constitutes cyberbullying and online harassment, punishable under college disciplinary rules and Indian IT laws."
  },
  {
    question: "If someone repeatedly texts you threatening to leak your personal chats or photos unless you do what they say, what is the best first step?",
    options: [
      { text: "Pay them or comply with their demands immediately", correct: false },
      { text: "Delete your accounts and hope they stop on their own", correct: false },
      { text: "Preserve evidence (take full screenshots with timestamps), do not negotiate, and report to Cyber Cell / Grievance Portal", correct: true },
      { text: "Forward the threats to everyone you know", correct: false }
    ],
    explanation: "Never delete evidence or negotiate with cyber extortionists. Preserving digital artifacts (screenshots, URLs, phone numbers) is vital for taking swift legal and disciplinary action."
  },
  {
    question: "What is the 24/7 National Cybercrime Reporting Helpline number in India?",
    options: [
      { text: "100", correct: false },
      { text: "1930", correct: true },
      { text: "1098", correct: false },
      { text: "102", correct: false }
    ],
    explanation: "Helpline 1930 is the national cyber financial and cyber harassment helpline operated by the Ministry of Home Affairs (I4C)."
  },
  {
    question: "Excluding a student deliberately from official academic project groups, mocking their questions, and rallying peers to ghost them online is known as:",
    options: [
      { text: "Relational Cyberbullying & Social Exclusion", correct: true },
      { text: "Standard academic rivalry", correct: false },
      { text: "Constructive peer feedback", correct: false },
      { text: "Informal networking", correct: false }
    ],
    explanation: "Relational cyberbullying involves deliberately ostracizing, isolating, and humiliating individuals within digital groups or online study forums."
  },
  {
    question: "Under the Information Technology Act (IT Act 2000), Section 66E deals specifically with which offense?",
    options: [
      { text: "Hacking into college Wi-Fi routers", correct: false },
      { text: "Violation of bodily privacy (capturing/publishing private images without consent)", correct: true },
      { text: "Spamming commercial emails", correct: false },
      { text: "Late submission of assignments", correct: false }
    ],
    explanation: "Section 66E of the IT Act penalizes intentionally capturing, transmitting, or publishing the image of a private area of any person without their consent."
  }
];

let currentQuestionIndex = 0;
let userScore = 0;
let answered = false;

document.addEventListener("DOMContentLoaded", () => {
  initQuiz();
});

function initQuiz() {
  const container = document.getElementById("quizContainer");
  if (!container) return;

  renderQuestion();
}

function renderQuestion() {
  const container = document.getElementById("quizContainer");
  if (!container) return;

  if (currentQuestionIndex >= QUIZ_QUESTIONS.length) {
    renderQuizResults(container);
    return;
  }

  answered = false;
  const q = QUIZ_QUESTIONS[currentQuestionIndex];

  container.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-header">
        <div class="quiz-badge">Question ${currentQuestionIndex + 1} of ${QUIZ_QUESTIONS.length}</div>
        <div class="quiz-score-pill">Score: ${userScore}/${QUIZ_QUESTIONS.length}</div>
      </div>
      <h3 class="quiz-question-title">${q.question}</h3>
      <div class="quiz-options-grid" id="quizOptionsGrid">
        ${q.options.map((opt, i) => `
          <button type="button" class="quiz-opt-btn" onclick="selectQuizOption(${i})">
            <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
            <span class="opt-text">${opt.text}</span>
          </button>
        `).join("")}
      </div>
      <div id="quizFeedbackBox" class="quiz-feedback-box hidden"></div>
      <div class="quiz-actions hidden" id="quizNextAction">
        <button type="button" class="btn-primary" onclick="nextQuizQuestion()">
          ${currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? 'Finish & Generate Certificate' : 'Next Question →'}
        </button>
      </div>
    </div>
  `;
}

window.selectQuizOption = (index) => {
  if (answered) return;
  answered = true;

  const q = QUIZ_QUESTIONS[currentQuestionIndex];
  const selected = q.options[index];
  const buttons = document.querySelectorAll(".quiz-opt-btn");
  const feedbackBox = document.getElementById("quizFeedbackBox");
  const nextAction = document.getElementById("quizNextAction");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (q.options[i].correct) {
      btn.classList.add("correct-choice");
    } else if (i === index) {
      btn.classList.add("wrong-choice");
    }
  });

  if (selected.correct) {
    userScore++;
    feedbackBox.className = "quiz-feedback-box success";
    feedbackBox.innerHTML = `<strong>✓ Correct!</strong> ${q.explanation}`;
  } else {
    feedbackBox.className = "quiz-feedback-box danger";
    feedbackBox.innerHTML = `<strong>✗ Incorrect.</strong> ${q.explanation}`;
  }

  feedbackBox.classList.remove("hidden");
  nextAction.classList.remove("hidden");
};

window.nextQuizQuestion = () => {
  currentQuestionIndex++;
  renderQuestion();
};

function renderQuizResults(container) {
  const percentage = Math.round((userScore / QUIZ_QUESTIONS.length) * 100);
  const passed = percentage >= 60;

  container.innerHTML = `
    <div class="quiz-result-card text-center">
      <div class="result-badge-icon">${passed ? "🏆" : "📚"}</div>
      <h2>${passed ? "Congratulations! Quiz Passed" : "Knowledge Check Complete"}</h2>
      <p class="result-subtitle">You scored <strong>${userScore} out of ${QUIZ_QUESTIONS.length}</strong> (${percentage}%)</p>

      <div class="certificate-preview-box" id="certificateBox">
        <div class="cert-border">
          <div class="cert-header">
            <span class="cert-seal">🛡️ SAFECAMPUS</span>
            <h4>CERTIFICATE OF CYBER SAFETY AWARENESS</h4>
          </div>
          <p class="cert-body">
            This digital credential confirms understanding of Anti-Cyberbullying Principles, Digital Ethics, Evidence Preservation, and IT Act Legal Rights.
          </p>
          <div class="cert-meta">
            <div>
              <small>Grade</small>
              <strong>${passed ? 'Verified Champion' : 'Awareness Participant'}</strong>
            </div>
            <div>
              <small>Date</small>
              <strong>${new Date().toLocaleDateString()}</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="result-btn-row">
        <button type="button" class="btn-primary" onclick="window.print()">
          🖨️ Print / Save Certificate
        </button>
        <button type="button" class="btn-secondary" onclick="restartQuiz()">
          🔄 Retake Quiz
        </button>
      </div>
    </div>
  `;
}

window.restartQuiz = () => {
  currentQuestionIndex = 0;
  userScore = 0;
  answered = false;
  renderQuestion();
};
