/**
 * SafeCampus AI Toxicity & Cyberbullying Analysis Engine
 * Multi-dimensional rule-based NLP classifier designed for student harassment detection
 */

const ToxicityEngine = (() => {
  // Lexicon databases categorized by harassment types
  const THREAT_PATTERNS = [
    /kill\s+(yourself|urself|you)/i,
    /die\s+in\s+a\s+hole/i,
    /watch\s+your\s+back/i,
    /i('ll| will)\s+(hurt|beat|expose|ruin|destroy|leak|find)\s+you/i,
    /you\s+won'?t\s+survive/i,
    /end\s+your\s+life/i,
    /slit\s+your/i,
    /wait\s+and\s+watch\s+what\s+i\s+do/i,
    /i\s+know\s+where\s+you\s+live/i,
    /nobody\s+wants\s+you\s+alive/i
  ];

  const HATE_SPEECH_KEYWORDS = [
    "caste", "untouchable", "chamar", "bhangi", "retard", "faggot", "dyke", "tranny",
    "terrorist", "jihadi", "pakistani", "immigrant", "subhuman", "freak", "disgusting race",
    "whore", "slut", "bitch", "bastard"
  ];

  const INSULT_KEYWORDS = [
    "loser", "ugly", "fat", "disgusting", "idiot", "moron", "dumb", "pathetic",
    "stupid", "worthless", "clown", "freak", "creep", "trash", "pig", "waste of space",
    "coward", "horrible", "shameless", "fool", "scumbag", "parasite", "piece of garbage"
  ];

  const STALKING_BLACKMAIL_PATTERNS = [
    /send\s+(nudes|private\s+pics|photos)\s+or\s+else/i,
    /i\s+have\s+your\s+(photos|chats|videos|secrets)/i,
    /gonna\s+post\s+your\s+(photos|nudes|address)/i,
    /leak\s+your\s+(number|address|pics)/i,
    /following\s+you/i,
    /i\s+saw\s+you\s+at/i,
    /i('ll| will)\s+tell\s+everyone\s+what\s+you\s+did/i,
    /pay\s+me\s+or\s+i('ll| will)/i
  ];

  const EXCLUSION_OR_ISOLATION_PATTERNS = [
    /nobody\s+likes\s+you/i,
    /everyone\s+hates\s+you/i,
    /don'?t\s+talk\s+to\s+(him|her|them)/i,
    /kick\s+(him|her|them)\s+out/i,
    /remove\s+(him|her|them)\s+from\s+the\s+group/i,
    /you\s+have\s+no\s+friends/i
  ];

  const POSITIVE_REINFORCERS = [
    "great job", "love this", "congratulations", "proud of you", "well done",
    "awesome", "kind", "helpful", "good luck", "friend", "respect", "appreciate",
    "thank you", "support", "beautiful", "inspiring", "amazing"
  ];

  /**
   * Analyze input message string
   * @param {string} text - User message or comment
   * @returns {Object} Comprehensive analysis scores and breakdown
   */
  function analyze(text) {
    if (!text || text.trim().length === 0) {
      return {
        overallScore: 0,
        severity: "Safe",
        sentiment: "Neutral / Empty",
        flaggedKeywords: [],
        categories: {
          threat: 0,
          hateSpeech: 0,
          insult: 0,
          blackmailStalking: 0,
          socialExclusion: 0
        },
        riskLevel: "Low",
        recommendedAction: "No harmful patterns detected.",
        highlightsHtml: ""
      };
    }

    const cleanText = text.toLowerCase();
    const words = cleanText.split(/[\s,.;:!?()\[\]{}"]+/).filter(Boolean);
    const flaggedWords = new Set();

    let threatScore = 0;
    let hateSpeechScore = 0;
    let insultScore = 0;
    let blackmailScore = 0;
    let exclusionScore = 0;
    let positiveScore = 0;

    // 1. Direct Threat Pattern Matching (Highest weighting)
    THREAT_PATTERNS.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        threatScore += 45;
        flaggedWords.add(match[0]);
      }
    });

    // 2. Blackmail & Cyberstalking Patterns
    STALKING_BLACKMAIL_PATTERNS.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        blackmailScore += 40;
        flaggedWords.add(match[0]);
      }
    });

    // 3. Social Exclusion Patterns
    EXCLUSION_OR_ISOLATION_PATTERNS.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        exclusionScore += 25;
        flaggedWords.add(match[0]);
      }
    });

    // 4. Hate Speech Keywords
    HATE_SPEECH_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      if (regex.test(text)) {
        hateSpeechScore += 30;
        flaggedWords.add(keyword);
      }
    });

    // 5. Insult & Abusive Keywords
    INSULT_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      if (regex.test(text)) {
        insultScore += 20;
        flaggedWords.add(keyword);
      }
    });

    // 6. Positive Sentiment Offsets
    POSITIVE_REINFORCERS.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      if (regex.test(text)) {
        positiveScore += 15;
      }
    });

    // Caps lock aggression factor
    const totalLetters = (text.match(/[a-zA-Z]/g) || []).length;
    const capsLetters = (text.match(/[A-Z]/g) || []).length;
    const capsRatio = totalLetters > 6 ? capsLetters / totalLetters : 0;
    let capsMultiplier = 1.0;
    if (capsRatio > 0.6 && (threatScore > 0 || insultScore > 0 || hateSpeechScore > 0)) {
      capsMultiplier = 1.25;
    }

    // Repeated exclamation / question marks aggression
    const excessivePunctuation = (text.match(/[!?]{2,}/g) || []).length;
    let punctuationBoost = excessivePunctuation > 0 ? 5 : 0;

    // Normalizing individual categories (0-100%)
    const normThreat = Math.min(100, Math.round(threatScore * capsMultiplier));
    const normHate = Math.min(100, Math.round(hateSpeechScore * capsMultiplier));
    const normInsult = Math.min(100, Math.round(insultScore * capsMultiplier));
    const normBlackmail = Math.min(100, Math.round(blackmailScore * capsMultiplier));
    const normExclusion = Math.min(100, Math.round(exclusionScore * capsMultiplier));

    // Calculate Combined Overall Toxicity (Weighted maximum approach with additive residual)
    let rawTotal = 
      (normThreat * 0.40) + 
      (normBlackmail * 0.25) + 
      (normHate * 0.20) + 
      (normInsult * 0.10) + 
      (normExclusion * 0.05) + 
      punctuationBoost;

    // Apply positive buffer if applicable
    rawTotal = Math.max(0, rawTotal - (positiveScore * 0.5));

    // If strong threat or blackmail detected, baseline minimum 80%
    if (normThreat >= 45 || normBlackmail >= 40) {
      rawTotal = Math.max(rawTotal, 82);
    } else if (normHate >= 30) {
      rawTotal = Math.max(rawTotal, 68);
    } else if (normInsult >= 20) {
      rawTotal = Math.max(rawTotal, 45);
    }

    const overallScore = Math.min(100, Math.round(rawTotal));

    // Categorization & Advice
    let severity = "Safe";
    let riskLevel = "Low";
    let sentiment = "Positive / Safe";
    let recommendedAction = "No immediate danger detected. Safe to interact.";

    if (overallScore >= 80) {
      severity = "Severe Cyberbullying / Immediate Threat";
      riskLevel = "Critical";
      sentiment = "Violent / Extortion Threat";
      recommendedAction = "🚨 Immediate intervention required. File an urgent incident report, preserve screenshots, block sender, and notify College Cyber Cell & National Helpline 1930.";
    } else if (overallScore >= 55) {
      severity = "High Toxicity / Targeted Harassment";
      riskLevel = "High";
      sentiment = "Hostile / Abusive";
      recommendedAction = "⚠️ Targeted harassment detected. Recommended to submit a confidential report with evidence and cease engagement.";
    } else if (overallScore >= 30) {
      severity = "Moderate Cyberbullying / Offensive";
      riskLevel = "Medium";
      sentiment = "Insulting / Derogatory";
      recommendedAction = "Content contains offensive or derogatory remarks. You may block the user and request campus mediator assistance.";
    } else if (overallScore > 10) {
      severity = "Mild Negativity / Heated Exchange";
      riskLevel = "Low";
      sentiment = "Slightly Negative";
      recommendedAction = "Minor negative phrasing observed. Does not appear to violate critical policies, but monitor if repeated.";
    }

    // Generate HTML with flagged phrases highlighted
    let highlightedHtml = escapeHtml(text);
    flaggedWords.forEach(phrase => {
      const safePhrase = escapeRegExp(phrase);
      const re = new RegExp(`(${safePhrase})`, 'gi');
      highlightedHtml = highlightedHtml.replace(re, '<mark class="toxic-flag-highlight">$1</mark>');
    });

    return {
      overallScore,
      severity,
      riskLevel,
      sentiment,
      flaggedKeywords: Array.from(flaggedWords),
      categories: {
        threat: normThreat,
        hateSpeech: normHate,
        insult: normInsult,
        blackmailStalking: normBlackmail,
        socialExclusion: normExclusion
      },
      recommendedAction,
      highlightedHtml
    };
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  return {
    analyze
  };
})();

// Attach to window for global access
window.ToxicityEngine = ToxicityEngine;
