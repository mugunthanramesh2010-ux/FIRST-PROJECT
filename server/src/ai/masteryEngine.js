// server/src/ai/masteryEngine.js
// Student Concept Mastery and Learning DNA Tracker.
// Tracks student understanding, misconceptions, and Bloom's cognitive evolution.
// 100% OFFLINE, ZERO CLOUD.

export class MasteryEngine {
  constructor() {
    this.sessionStates = new Map();
  }

  getOrCreateSessionState(sessionId, studentId) {
    const key = `${studentId}_${sessionId}`;
    if (!this.sessionStates.has(key)) {
      this.sessionStates.set(key, {
        studentId,
        sessionId,
        conceptMastery: {}, // conceptId -> { attempts, scoreAvg, mastered: bool }
        demonstratedConcepts: new Set(),
        missingConcepts: new Set(),
        detectedMisconceptions: [],
        questionHistory: [],
        hintsUsedCount: 0,
        averageTimePerQuestion: 0,
        startTime: Date.now()
      });
    }
    return this.sessionStates.get(key);
  }

  /**
   * Update student mastery record with newly evaluated answer
   */
  updateMastery(sessionId, studentId, question, evaluation, meta = {}) {
    const state = this.getOrCreateSessionState(sessionId, studentId);
    const concept = question.conceptId || question.topic || 'GENERAL';

    if (!state.conceptMastery[concept]) {
      state.conceptMastery[concept] = {
        attempts: 0,
        totalScore: 0,
        mastered: false,
        lastDifficulty: question.difficulty
      };
    }

    const cState = state.conceptMastery[concept];
    cState.attempts++;
    cState.totalScore += evaluation.score;
    cState.scoreAvg = Math.round(cState.totalScore / cState.attempts);
    cState.mastered = cState.scoreAvg >= 75;

    // Track demonstrated vs missing
    (evaluation.demonstratedConcepts || []).forEach(c => state.demonstratedConcepts.add(c));
    (evaluation.missingConcepts || []).forEach(c => state.missingConcepts.add(c));
    (evaluation.misconceptions || []).forEach(m => {
      state.detectedMisconceptions.push({ concept, misconception: m, timestamp: new Date().toISOString() });
    });

    state.hintsUsedCount += (meta.hintsUsed || 0);
    state.questionHistory.push({
      questionId: question.id,
      concept,
      score: evaluation.score,
      status: evaluation.status,
      difficulty: question.difficulty,
      questionType: question.questionType,
      timeSpentSec: meta.timeSpentSec || 0
    });

    return this.getSummary(sessionId, studentId);
  }

  getSummary(sessionId, studentId) {
    const state = this.getOrCreateSessionState(sessionId, studentId);
    const conceptsArray = Object.entries(state.conceptMastery).map(([k, v]) => ({
      conceptId: k,
      ...v
    }));

    const masteredCount = conceptsArray.filter(c => c.mastered).length;
    const overallProgress = conceptsArray.length > 0 ? Math.round((masteredCount / conceptsArray.length) * 100) : 0;

    return {
      studentId: state.studentId,
      sessionId: state.sessionId,
      overallProgress,
      conceptsAssessed: conceptsArray.length,
      masteredCount,
      demonstratedConcepts: Array.from(state.demonstratedConcepts),
      missingConcepts: Array.from(state.missingConcepts),
      misconceptions: state.detectedMisconceptions,
      historyCount: state.questionHistory.length
    };
  }
}

export const masteryEngine = new MasteryEngine();
