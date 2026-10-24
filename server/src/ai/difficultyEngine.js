// server/src/ai/difficultyEngine.js
// Adaptive Difficulty Engine for Viva Examination.
// Selects next difficulty and question representation based on student trajectory.
// 100% OFFLINE, ZERO CLOUD.

import { DIFFICULTY_LEVELS, QUESTION_TYPES } from './questionSchemas.js';

export class DifficultyEngine {
  /**
   * Determine next difficulty and representation
   */
  determineNextStep(lastEvaluation, currentQuestion, history = []) {
    const lastScore = lastEvaluation ? lastEvaluation.score : 70;
    const currentDiff = currentQuestion?.difficulty || DIFFICULTY_LEVELS.MODERATE;

    let nextDifficulty = currentDiff;
    let nextAction = 'continue_assessment';
    let recommendedType = QUESTION_TYPES.CONCEPTUAL;

    if (lastScore >= 85) {
      // Demonstrated strong mastery -> Advance difficulty or move to derivation/design
      if (currentDiff === DIFFICULTY_LEVELS.EASY) nextDifficulty = DIFFICULTY_LEVELS.MODERATE;
      else if (currentDiff === DIFFICULTY_LEVELS.MODERATE) nextDifficulty = DIFFICULTY_LEVELS.TOUGH;
      else nextDifficulty = DIFFICULTY_LEVELS.COMPLEX;

      nextAction = 'advance_to_deeper_problem';
      recommendedType = nextDifficulty === DIFFICULTY_LEVELS.COMPLEX
        ? QUESTION_TYPES.DESIGN_TROUBLESHOOTING
        : QUESTION_TYPES.DERIVATION;
    } else if (lastScore >= 55) {
      // Partial understanding -> Maintain difficulty, ask targeted follow-up on missing concept
      nextDifficulty = currentDiff;
      nextAction = 'targeted_follow_up';
      recommendedType = QUESTION_TYPES.EQUATION_INTERPRETATION;
    } else {
      // Misconceptions or major gaps -> Step down difficulty or provide prerequisite remediation
      if (currentDiff === DIFFICULTY_LEVELS.COMPLEX) nextDifficulty = DIFFICULTY_LEVELS.TOUGH;
      else if (currentDiff === DIFFICULTY_LEVELS.TOUGH) nextDifficulty = DIFFICULTY_LEVELS.MODERATE;
      else nextDifficulty = DIFFICULTY_LEVELS.EASY;

      nextAction = 'prerequisite_remediation';
      recommendedType = QUESTION_TYPES.DEFINITION;
    }

    return {
      nextDifficulty,
      nextAction,
      recommendedType,
      reasoning: `Score ${lastScore}% on ${currentQuestion?.conceptId || 'current concept'} triggered ${nextAction} at difficulty ${nextDifficulty}.`
    };
  }
}

export const difficultyEngine = new DifficultyEngine();
