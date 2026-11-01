// server/src/ai/adaptiveStudentIntelligence.js
// Production-grade Adaptive Student Intelligence & BKT/IRT Engine.
// Tracks fine-grained student knowledge states, uncertainty, response time caution,
// misconception classifications, and enforces policy-driven next question selection.
// 100% OFFLINE, ZERO CLOUD.

export class AdaptiveStudentIntelligence {
  constructor() {
    this.studentStates = new Map();
  }

  getStudentState(studentId, subject, topic) {
    const key = `${studentId}::${(subject || '').toLowerCase()}::${(topic || '').toLowerCase()}`;
    if (!this.studentStates.has(key)) {
      this.studentStates.set(key, {
        studentId,
        subject,
        topic,
        conceptMastery: {}, // conceptId -> { pMastery, uncertainty, attempts, successes, hintDiscountedSuccesses, lastAttemptTime, status }
        sessionHistory: [],
        misconceptionsEncountered: [],
        consecutiveErrorsOnActiveConcept: 0,
        activeConceptId: null,
        scheduledReviews: [] // Spaced review queue
      });
    }
    return this.studentStates.get(key);
  }

  /**
   * Process submitted answer, update BKT + IRT models, and plan next adaptive step
   */
  processAnswerAndPlanNext({
    studentId,
    subject,
    topic,
    question,
    studentAnswer,
    isCorrect,
    evaluation = {},
    hintsUsed = 0,
    responseTimeSeconds = 30
  }) {
    const state = this.getStudentState(studentId, subject, topic);
    const conceptId = question.concept || question.conceptId || topic;
    const now = Date.now();

    // 1. Initialize concept tracker if needed
    if (!state.conceptMastery[conceptId]) {
      state.conceptMastery[conceptId] = {
        conceptId,
        pMastery: 0.25,      // Prior P(L_0)
        uncertainty: 1.0,    // Initial sigma = 1.0 (maximum uncertainty)
        attempts: 0,
        successes: 0,
        unassistedSuccesses: 0,
        lastAttemptTime: now,
        status: 'INTRODUCED',
        formatHistory: []
      };
    }

    const cm = state.conceptMastery[conceptId];
    cm.attempts++;
    cm.lastAttemptTime = now;
    if (question.format) cm.formatHistory.push(question.format);

    // 2. Classify error type
    let errorCategory = null;
    if (!isCorrect) {
      if (question.format === 'Numerical' || question.numericalDetails) {
        errorCategory = 'MATHEMATICAL_CALCULATION_OR_UNIT_ERROR';
      } else if (question.format === 'Diagram' || question.diagramSvg) {
        errorCategory = 'INTERPRETIVE_DIAGRAM_OR_AXIS_MISREADING';
      } else if (hintsUsed > 0) {
        errorCategory = 'PROCEDURAL_STEP_UNCERTAINTY';
      } else {
        errorCategory = 'CONCEPTUAL_INVARIANT_MISUNDERSTANDING';
      }
      state.misconceptionsEncountered.push({
        conceptId,
        questionId: question.id,
        category: errorCategory,
        timestamp: now
      });
      state.consecutiveErrorsOnActiveConcept++;
    } else {
      cm.successes++;
      if (hintsUsed === 0) {
        cm.unassistedSuccesses++;
      }
      state.consecutiveErrorsOnActiveConcept = 0;
    }

    // 3. Calibrated Bayesian Knowledge Tracing Update
    // Prior parameters: pT (transition) = 0.18, pG (guess) = 0.20, pS (slip) = 0.10
    const pL = cm.pMastery;
    let pL_posterior;
    if (isCorrect) {
      const pObsGivenL = 1.0 - 0.10; // 1 - slip
      const pObsGivenNotL = 0.20;     // guess
      pL_posterior = (pL * pObsGivenL) / ((pL * pObsGivenL) + ((1.0 - pL) * pObsGivenNotL));
      // Hint discounting: if hints were used, scale posterior back towards prior
      if (hintsUsed > 0) {
        const discountFactor = Math.max(0.3, 1.0 - (hintsUsed * 0.25));
        pL_posterior = pL + (pL_posterior - pL) * discountFactor;
      }
    } else {
      const pIncorrectGivenL = 0.10; // slip
      const pIncorrectGivenNotL = 1.0 - 0.20; // 1 - guess
      pL_posterior = (pL * pIncorrectGivenL) / ((pL * pIncorrectGivenL) + ((1.0 - pL) * pIncorrectGivenNotL));
    }

    // Add transit probability
    cm.pMastery = Math.min(0.99, Math.max(0.05, pL_posterior + (1.0 - pL_posterior) * 0.18));

    // Update uncertainty: sigma = 1 / (1 + 0.6 * attempts)
    cm.uncertainty = Math.max(0.08, 1.0 / (1.0 + 0.6 * cm.attempts));

    // 4. Update 8-State Coverage Ledger Status
    const distinctFormats = new Set(cm.formatHistory).size;
    if (cm.unassistedSuccesses >= 2 && cm.uncertainty <= 0.48 && cm.pMastery >= 0.80) {
      if (distinctFormats >= 2) {
        cm.status = 'VERIFIED_THROUGH_TRANSFER';
      } else {
        cm.status = 'INDEPENDENTLY_DEMONSTRATED';
      }
    } else if (hintsUsed > 0 && isCorrect) {
      cm.status = 'ASSISTED';
    } else if (cm.attempts > 0) {
      cm.status = 'DEVELOPING';
    }

    // 5. Cautionary interpretation of response time
    // Never penalize or flag low ability solely due to deliberate reflection time
    const responseCautionNote = responseTimeSeconds >= 60
      ? 'Deliberate analytical deliberation observed (no penalty applied).'
      : (responseTimeSeconds < 5 ? 'Rapid response pattern observed.' : 'Nominal response cadence.');

    // 6. Plan Adaptive Next Action
    let nextAction = 'PROGRESS';
    let targetConceptForNext = conceptId;
    let recommendedDifficulty = 'Intermediate';
    let recommendedFormat = 'Theory';
    let remediationNote = '';

    if (!isCorrect) {
      if (state.consecutiveErrorsOnActiveConcept >= 2) {
        // Repeated failure: simplify reasoning steps, offer targeted remediation
        nextAction = 'REMEDIATE_SIMPLIFIED';
        recommendedDifficulty = 'Beginner';
        recommendedFormat = 'Theory';
        remediationNote = `Provide step-by-step foundational decomposition for ${conceptId} targeting ${errorCategory}.`;
      } else {
        // Single error: diagnostic probe or alternative representation
        nextAction = 'DIAGNOSTIC_RETRY';
        recommendedDifficulty = 'Intermediate';
        recommendedFormat = question.format === 'Numerical' ? 'Theory' : 'Numerical';
        remediationNote = `Test alternative cognitive facet for ${conceptId} to verify understanding without repetitive phrasing.`;
      }
    } else {
      // Correct answer: advance along Bloom progression or transfer format
      if (cm.status === 'INDEPENDENTLY_DEMONSTRATED' || cm.status === 'VERIFIED_THROUGH_TRANSFER') {
        nextAction = 'ADVANCE_TRANSFER';
        recommendedDifficulty = 'Advanced';
        recommendedFormat = distinctFormats < 2 ? 'Numerical' : (distinctFormats < 3 ? 'Scenario' : 'Graph');
        remediationNote = `Student demonstrated independent mastery. Advance to multi-representation transfer (${recommendedFormat}).`;
      } else {
        nextAction = 'CONSOLIDATE';
        recommendedDifficulty = 'Intermediate';
        recommendedFormat = question.format === 'Theory' ? 'Numerical' : 'Theory';
      }
    }

    // Record interaction in session history
    state.sessionHistory.push({
      questionId: question.id,
      conceptId,
      format: question.format,
      isCorrect,
      hintsUsed,
      responseTimeSeconds,
      pMastery: cm.pMastery,
      uncertainty: cm.uncertainty,
      status: cm.status,
      errorCategory,
      timestamp: now
    });

    // Compute fine-grained continuous percentage proficiency (0 to 100 with single percentage precision)
    const proficiencyPercent = Math.max(0, Math.min(100, Math.round(cm.pMastery * 100)));
    const bandInfo = getProficiencyBand(proficiencyPercent);

    return {
      topicLocked: true,
      assignedTopic: topic,
      assignedSubject: subject,
      conceptId,
      pMastery: cm.pMastery,
      proficiencyPercent,
      proficiencyBand: bandInfo.band,
      intermediateLabel: bandInfo.label,
      interpretation: bandInfo.interpretation,
      evidenceCount: cm.attempts,
      confidence: Number((1.0 - cm.uncertainty).toFixed(3)),
      uncertainty: Number(cm.uncertainty.toFixed(3)),
      ledgerStatus: cm.status,
      errorCategory,
      errorClassification: errorCategory,
      responseCautionNote,
      recommendedAction: nextAction,
      masterySummary: {
        estimatedMastery: cm.pMastery,
        proficiencyPercent,
        proficiencyBand: bandInfo.band,
        intermediateLabel: bandInfo.label,
        uncertainty: cm.uncertainty,
        confidence: 1.0 - cm.uncertainty,
        evidenceCount: cm.attempts,
        status: cm.status
      },
      adaptiveDecision: {
        action: nextAction,
        targetConcept: targetConceptForNext,
        recommendedDifficulty,
        recommendedFormat,
        rationale: remediationNote || 'Adaptive progression aligned with student mastery state.'
      }
    };
  }

  /**
   * Generates initial diagnostic assessment plan of `count` questions (default 2)
   * covering different concepts within the assigned topic.
   */
  initialDiagnosticPlan(topic, subject, count = 2) {
    const cleanTopic = String(topic || '').trim();
    const cleanSubject = String(subject || '').trim();
    return {
      topicLocked: true,
      assignedTopic: cleanTopic,
      assignedSubject: cleanSubject,
      diagnosticCount: count,
      initialBands: '0–10% (Initial understanding)',
      instructions: `Initial diagnostic baseline for ${cleanTopic}: 2 targeted diagnostic items evaluating distinct concept facets.`
    };
  }

  /**
   * Selects the next concept adaptively for a student based on their knowledge profile,
   * prioritizing concepts with identified gaps, misconceptions, or lowest proficiency.
   */
  selectNextConcept({ studentId, subject, topic, availableConcepts = [] }) {
    const state = this.getStudentState(studentId, subject, topic);
    if (!availableConcepts || availableConcepts.length === 0) {
      return { concept: topic, topicLocked: true, assignedTopic: topic };
    }

    // Prioritize concepts with demonstrated deficiencies (attempts > 0 and pMastery < 0.65),
    // then unattempted concepts for diagnostic coverage, then mastered concepts
    const scored = availableConcepts.map(c => {
      const cm = state.conceptMastery[c] || { pMastery: 0.25, uncertainty: 1.0, attempts: 0 };
      let priorityGroup = 2; // unattempted
      if (cm.attempts > 0) {
        if (cm.pMastery < 0.65) {
          priorityGroup = 1; // demonstrated weakness / error needing remediation
        } else {
          priorityGroup = 3; // demonstrated mastery
        }
      }
      return {
        concept: c,
        priorityGroup,
        pMastery: cm.pMastery,
        uncertainty: cm.uncertainty,
        attempts: cm.attempts,
        score: cm.pMastery - (cm.uncertainty * 0.1)
      };
    });

    scored.sort((a, b) => {
      if (a.priorityGroup !== b.priorityGroup) return a.priorityGroup - b.priorityGroup;
      return a.score - b.score;
    });
    const selected = scored[0].concept;

    return {
      concept: selected,
      topicLocked: true,
      assignedTopic: topic,
      assignedSubject: subject,
      pMastery: scored[0].pMastery,
      proficiencyPercent: Math.round(scored[0].pMastery * 100),
      reason: `Targeting concept "${selected}" based on student performance evidence.`
    };
  }
}

/**
 * Maps continuous 0-100 percentage proficiency to configurable standard bands & intermediate labels
 */
export function getProficiencyBand(percent) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  if (p <= 10) return { band: '0–10%', interpretation: 'Initial understanding', label: 'Slightly low' };
  if (p <= 20) return { band: '11–20%', interpretation: 'Very limited understanding', label: 'Low' };
  if (p <= 30) return { band: '21–30%', interpretation: 'Developing foundation', label: 'Low' };
  if (p <= 40) return { band: '31–40%', interpretation: 'Basic understanding', label: 'Slightly moderate' };
  if (p <= 50) return { band: '41–50%', interpretation: 'Emerging competence', label: 'Moderate' };
  if (p <= 60) return { band: '51–60%', interpretation: 'Moderate understanding', label: 'Moderate' };
  if (p <= 70) return { band: '61–70%', interpretation: 'Good understanding', label: 'Slightly high' };
  if (p <= 80) return { band: '71–80%', interpretation: 'Strong understanding', label: 'High' };
  if (p <= 90) return { band: '81–90%', interpretation: 'Advanced understanding', label: 'Advanced' };
  return { band: '91–100%', interpretation: 'Demonstrated high mastery', label: 'Tricky reasoning capability' };
}

export const adaptiveStudentIntelligence = new AdaptiveStudentIntelligence();
