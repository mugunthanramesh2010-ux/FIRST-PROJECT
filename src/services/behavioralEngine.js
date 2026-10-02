// Zero Copy-Paste Policy & Behavioral Anti-Cheat Intelligence Engine
// Monitors typing rhythm, keystroke cadence, focus changes, tab switches, and AI phrasing.

export class BehavioralEngine {
  constructor(onFlagCallback) {
    this.onFlag = onFlagCallback || (() => {});
    this.reset();
  }

  reset() {
    this.keyEvents = [];
    this.tabSwitches = 0;
    this.pasteAttempts = 0;
    this.copyAttempts = 0;
    this.rightClickAttempts = 0;
    this.startTime = null;
    this.firstKeyTime = null;
    this.lastInputLength = 0;
    this.burstsDetected = 0;
    this.flaggedReasons = [];

    // Live Metrics
    this.wpm = 0;
    this.cps = 0;
    this.meanInterval = 0;
    this.varianceInterval = 0;
    this.authenticityScore = 100;
    this.humanConfidenceScore = 100;
    this.suspicionScore = 0;
    this.answerReliabilityScore = 100;
  }

  resetForNewQuestion() {
    this.reset();
  }

  recordKeystroke(event) {
    this.recordKey(event);
  }

  recordPaste(event) {
    this.handleBlockedEvent('paste', event);
  }

  calculateFinalMetrics() {
    return this.getMetrics();
  }

  startSession() {
    this.reset();
    this.startTime = Date.now();
  }

  // Intercept and prevent copy / paste / cut / context menu events
  handleBlockedEvent(eventName, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (eventName === 'paste') {
      this.pasteAttempts++;
      this.suspicionScore = Math.min(100, this.suspicionScore + 30);
      this.flagReason(`Zero Copy-Paste Violation: Direct paste attempt intercepted.`);
    } else if (eventName === 'copy') {
      this.copyAttempts++;
      this.suspicionScore = Math.min(100, this.suspicionScore + 15);
      this.flagReason(`Security Warning: Copying test material is restricted.`);
    } else if (eventName === 'contextmenu') {
      this.rightClickAttempts++;
      this.suspicionScore = Math.min(100, this.suspicionScore + 10);
      this.flagReason(`Security Warning: Context menu disabled.`);
    }

    this.recomputeScores();
    return false;
  }

  // Monitor Window Blur / Tab Switching
  handleTabSwitch() {
    this.tabSwitches++;
    this.suspicionScore = Math.min(100, this.suspicionScore + 25);
    this.flagReason(`Focus Breach: Tab switch or window blur detected (Occurrence #${this.tabSwitches}).`);
    this.recomputeScores();
  }

  // Record individual keystrokes for cadence and human rhythm analysis
  recordKey(event) {
    const now = Date.now();
    if (!this.startTime) this.startTime = now;
    if (!this.firstKeyTime) this.firstKeyTime = now;

    const lastKey = this.keyEvents[this.keyEvents.length - 1];
    const interval = lastKey ? now - lastKey.timestamp : 0;

    this.keyEvents.push({
      key: event.key,
      timestamp: now,
      interval
    });

    // Keep sliding window of last 100 keystrokes for real-time memory efficiency
    if (this.keyEvents.length > 200) {
      this.keyEvents.shift();
    }

    this.recomputeKeystrokeDynamics();
  }

  // Check for artificial burst injection during text changes
  onTextChange(newText) {
    const now = Date.now();
    const lenDelta = newText.length - this.lastInputLength;
    this.lastInputLength = newText.length;

    // If more than 12 characters appear instantaneously (within < 60ms) without typing events
    if (lenDelta > 12) {
      const recentKeys = this.keyEvents.filter(k => now - k.timestamp < 100);
      if (recentKeys.length < 5) {
        this.burstsDetected++;
        this.suspicionScore = Math.min(100, this.suspicionScore + 35);
        this.flagReason(`Text Injection Anomaly: Instant insertion of ${lenDelta} characters without corresponding keystrokes.`);
        this.recomputeScores();
      }
    }
  }

  // Calculate cadence, WPM, and human typing rhythm
  recomputeKeystrokeDynamics() {
    if (this.keyEvents.length < 3) return;

    const intervals = this.keyEvents.slice(-30).map(k => k.interval).filter(i => i > 0 && i < 3000);
    if (intervals.length === 0) return;

    const sum = intervals.reduce((a, b) => a + b, 0);
    this.meanInterval = Math.round(sum / intervals.length);

    // Calculate Variance (Human typing always has high natural variance, bots/scripts have near 0 variance)
    const variance = intervals.reduce((a, b) => a + Math.pow(b - this.meanInterval, 2), 0) / intervals.length;
    this.varianceInterval = Math.round(variance);

    // Calculate CPS & WPM
    const totalTimeMs = Date.now() - (this.firstKeyTime || Date.now());
    const totalMinutes = Math.max(0.05, totalTimeMs / 60000);
    const wordsTyped = this.lastInputLength / 5;
    this.wpm = Math.round(wordsTyped / totalMinutes);
    this.cps = parseFloat((this.lastInputLength / Math.max(1, totalTimeMs / 1000)).toFixed(1));

    // Human Confidence Scoring based on Variance & Speed:
    // Natural human typing speed is 20-95 WPM with interval variance > 300ms^2.
    // Superhuman speed (> 140 WPM) or robotic uniform speed (variance < 40) is flagged.
    if (this.wpm > 130) {
      this.suspicionScore = Math.min(100, this.suspicionScore + 20);
      this.flagReason(`Superhuman Typing Speed: Recorded ${this.wpm} WPM.`);
    } else if (this.keyEvents.length > 25 && this.varianceInterval < 50) {
      this.suspicionScore = Math.min(100, this.suspicionScore + 25);
      this.flagReason(`Robotic Keystroke Rhythm: Extremely low inter-key interval variance.`);
    }

    this.recomputeScores();
  }

  // AI Misuse & Linguistic Pattern Checker
  scanForAiMisuse(text) {
    if (!text || text.length < 50) return;

    const AI_CLICHES = [
      /\bdelv(e|ing) into\b/i,
      /\bit is important to note that\b/i,
      /\bit is crucial to (understand|remember|note)\b/i,
      /\bfurthermore,?\b/i,
      /\bmoreover,?\b/i,
      /\bin summary,?\b/i,
      /\ba testament to\b/i,
      /\bplays a (crucial|vital|pivotal) role\b/i,
      /\bseamlessly integrate\b/i,
      /\bholistic approach\b/i,
      /\bmultifaceted landscape\b/i,
      /\bharnessing the power of\b/i
    ];

    let aiPatternHits = 0;
    AI_CLICHES.forEach(regex => {
      if (regex.test(text)) aiPatternHits++;
    });

    if (aiPatternHits >= 3) {
      this.suspicionScore = Math.min(100, this.suspicionScore + 25);
      this.flagReason(`AI Linguistic Pattern Detected: High frequency (${aiPatternHits}) of stereotypical synthetic language markers.`);
      this.recomputeScores();
    }
  }

  flagReason(reason) {
    if (!this.flaggedReasons.includes(reason)) {
      this.flaggedReasons.push(reason);
      this.onFlag(reason, this.getMetrics());
    }
  }

  recomputeScores() {
    // Authenticity: 100 minus suspicion, paste attempts, and tab penalties
    const tabPenalty = this.tabSwitches * 15;
    const pastePenalty = this.pasteAttempts * 25;
    const burstPenalty = this.burstsDetected * 30;

    const totalDeductions = Math.min(100, this.suspicionScore * 0.5 + tabPenalty + pastePenalty + burstPenalty);
    this.authenticityScore = Math.max(0, Math.round(100 - totalDeductions));

    // Human Confidence Score: based on typing natural variance and reasonable WPM
    let humanScore = 95;
    if (this.keyEvents.length > 20) {
      if (this.varianceInterval > 200 && this.wpm < 110) humanScore = 98;
      else if (this.varianceInterval < 100) humanScore -= 30;
      if (this.wpm > 120) humanScore -= 40;
    }
    this.humanConfidenceScore = Math.max(10, Math.min(100, humanScore - this.burstsDetected * 20));

    // Answer Reliability
    this.answerReliabilityScore = Math.max(
      15,
      Math.round((this.authenticityScore * 0.6) + (this.humanConfidenceScore * 0.4))
    );
  }

    getMetrics() {
    return {
      wpm: this.wpm,
      cps: this.cps,
      meanInterval: this.meanInterval,
      varianceInterval: this.varianceInterval,
      tabSwitches: this.tabSwitches,
      pasteAttempts: this.pasteAttempts,
      copyAttempts: this.copyAttempts,
      burstsDetected: this.burstsDetected,
      authenticityScore: this.authenticityScore,
      humanConfidenceScore: this.humanConfidenceScore,
      suspicionScore: this.suspicionScore,
      answerReliabilityScore: this.answerReliabilityScore,
      flaggedReasons: [...this.flaggedReasons]
    };
  }

  // Timing Analysis & Malpractice Cross-Checking Engine
  evaluateQuestionTimingAndMalpractice(question, timeSpentSeconds, answerText, baselineAvgTime = 45, maxAllowedSeconds = 120) {
    const text = (answerText || '').trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    
    // Theoretical minimum time: 5s reading + typing at max human speed of 90 WPM
    const theoreticalMinSeconds = question.type === 'mcq' ? 4 : Math.max(8, Math.round(5 + (wordCount / 90) * 60));
    
    let timingStatus = 'NORMAL';
    let malpracticeDetected = false;
    let timingFlag = null;

    // Check 1: Superhuman speed / Instant Dumping
    if (question.type !== 'mcq' && wordCount > 25 && timeSpentSeconds < theoreticalMinSeconds * 0.3) {
      timingStatus = 'SUSPICIOUS_SUPERHUMAN';
      malpracticeDetected = true;
      timingFlag = `Timing Anomaly: Typed ${wordCount} words in only ${timeSpentSeconds}s (Theoretical human minimum is ${theoreticalMinSeconds}s). Suspected external answer dumping.`;
      this.suspicionScore = Math.min(100, this.suspicionScore + 40);
      this.flagReason(timingFlag);
    }
    // Check 2: Direct paste or text injection flag cross-check
    else if (this.pasteAttempts > 0 || this.burstsDetected > 0) {
      timingStatus = 'MALPRACTICE_CONFIRMED';
      malpracticeDetected = true;
      timingFlag = `Malpractice Detected: Intercepted ${this.pasteAttempts} clipboard paste attempts and ${this.burstsDetected} text injections.`;
    }
    // Check 3: Deadline or question limit crossed
    else if (timeSpentSeconds > maxAllowedSeconds) {
      timingStatus = 'EXCEEDED_DEADLINE';
      timingFlag = `Time Warning: Question attendance duration (${timeSpentSeconds}s) exceeded limit (${maxAllowedSeconds}s).`;
    }
    // Check 4: Abrupt deviation from student's historical baseline
    else if (baselineAvgTime > 20 && timeSpentSeconds < baselineAvgTime * 0.15 && wordCount > 20) {
      timingStatus = 'ANOMALOUS_SPEED_JUMP';
      timingFlag = `Sudden Speed Spike: Attending time ${timeSpentSeconds}s is 85%+ faster than student baseline (${baselineAvgTime}s).`;
      this.suspicionScore = Math.min(100, this.suspicionScore + 20);
      this.flagReason(timingFlag);
    }

    const deviationPercent = Math.round(((timeSpentSeconds - baselineAvgTime) / Math.max(1, baselineAvgTime)) * 100);
    this.recomputeScores();

    return {
      timeSpentSeconds,
      theoreticalMinSeconds,
      baselineAvgTime,
      deviationPercent,
      timingStatus,
      malpracticeDetected,
      timingFlag,
      authenticityScore: this.authenticityScore,
      humanConfidenceScore: this.humanConfidenceScore,
      suspicionScore: this.suspicionScore
    };
  }
}

