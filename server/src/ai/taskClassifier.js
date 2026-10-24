// server/src/ai/taskClassifier.js
// Classifies viva tasks to route them to the most suitable local AI model.
// 100% OFFLINE, ZERO CLOUD.

import { TASK_ROLES } from './modelRegistry.js';

export const TASK_TYPES = {
  FAST_QUESTION: 'fast_question',
  COMPLEX_REASONING_QUESTION: 'complex_reasoning_question',
  MATHEMATICAL_DERIVATION: 'mathematical_derivation',
  NUMERICAL_CALCULATION: 'numerical_calculation',
  CIRCUIT_OR_DIAGRAM_ANALYSIS: 'circuit_or_diagram_analysis',
  CODE_ALGORITHM_ANALYSIS: 'code_algorithm_analysis',
  PROGRESSIVE_HINT: 'progressive_hint',
  ANSWER_EVALUATION: 'answer_evaluation',
  MISCONCEPTION_DIAGNOSIS: 'misconception_diagnosis',
  INDEPENDENT_REVIEW: 'independent_review',
  TOPIC_CLASSIFICATION: 'topic_classification'
};

export class TaskClassifier {
  /**
   * Determine task category and required AI role
   */
  classify(taskType, context = {}) {
    const questionType = context.questionType || 'conceptual';

    switch (taskType) {
      case TASK_TYPES.FAST_QUESTION:
      case TASK_TYPES.TOPIC_CLASSIFICATION:
        return {
          role: TASK_ROLES.FAST,
          temperature: 0.6,
          timeoutMs: 15000,
          maxTokens: 1024,
          requiresStrictJson: true
        };

      case TASK_TYPES.PROGRESSIVE_HINT:
        return {
          role: TASK_ROLES.FAST,
          temperature: 0.5,
          timeoutMs: 12000,
          maxTokens: 512,
          requiresStrictJson: true
        };

      case TASK_TYPES.COMPLEX_REASONING_QUESTION:
      case TASK_TYPES.MATHEMATICAL_DERIVATION:
      case TASK_TYPES.NUMERICAL_CALCULATION:
      case TASK_TYPES.CIRCUIT_OR_DIAGRAM_ANALYSIS:
      case TASK_TYPES.CODE_ALGORITHM_ANALYSIS:
        return {
          role: TASK_ROLES.REASONING,
          temperature: 0.7,
          timeoutMs: 40000,
          maxTokens: 2048,
          requiresStrictJson: true
        };

      case TASK_TYPES.ANSWER_EVALUATION:
        // If question is a derivation or complex problem, use reasoning model
        const needsDeepReasoning = ['derivation', 'numerical', 'circuit', 'code', 'proof'].includes(questionType);
        return {
          role: needsDeepReasoning ? TASK_ROLES.REASONING : TASK_ROLES.FAST,
          temperature: 0.2, // Low temperature for deterministic, consistent grading
          timeoutMs: 30000,
          maxTokens: 1024,
          requiresStrictJson: true
        };

      case TASK_TYPES.MISCONCEPTION_DIAGNOSIS:
        return {
          role: TASK_ROLES.REASONING,
          temperature: 0.3,
          timeoutMs: 25000,
          maxTokens: 1024,
          requiresStrictJson: true
        };

      case TASK_TYPES.INDEPENDENT_REVIEW:
        return {
          role: TASK_ROLES.REVIEW,
          temperature: 0.1,
          timeoutMs: 35000,
          maxTokens: 1024,
          requiresStrictJson: true
        };

      default:
        return {
          role: TASK_ROLES.FAST,
          temperature: 0.6,
          timeoutMs: 20000,
          maxTokens: 1024,
          requiresStrictJson: true
        };
    }
  }
}

export const taskClassifier = new TaskClassifier();
