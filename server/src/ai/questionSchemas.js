// server/src/ai/questionSchemas.js
// Standard schemas and content blocks for multimodal viva questions.
// 100% OFFLINE, ZERO CLOUD.

export const QUESTION_TYPES = {
  CONCEPTUAL: 'conceptual',
  DEFINITION: 'definition',
  EQUATION_INTERPRETATION: 'equation_interpretation',
  DERIVATION: 'derivation',
  NUMERICAL: 'numerical',
  GRAPH_INTERPRETATION: 'graph_interpretation',
  CIRCUIT_ANALYSIS: 'circuit_analysis',
  BLOCK_DIAGRAM: 'block_diagram',
  CODE_REASONING: 'code_reasoning',
  CASE_STUDY: 'case_study',
  DESIGN_TROUBLESHOOTING: 'design_troubleshooting',
  COMPARE_CONTRAST: 'compare_contrast'
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MODERATE: 'moderate',
  TOUGH: 'tough',
  COMPLEX: 'complex'
};

/**
 * Validate question structure
 */
export function validateQuestionSchema(q) {
  const errors = [];
  if (!q.questionText || typeof q.questionText !== 'string' || q.questionText.trim().length < 10) {
    errors.push('Missing or invalid questionText (min 10 chars required)');
  }
  if (!q.conceptId && !q.topic) {
    errors.push('Missing conceptId or topic reference');
  }
  if (!Array.isArray(q.hints) || q.hints.length === 0) {
    errors.push('Missing progressive hints array');
  }
  if (q.type === 'mcq') {
    if (!Array.isArray(q.options) || q.options.length < 2) {
      errors.push('MCQ question requires at least 2 options');
    }
    if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      errors.push('Invalid correctIndex for MCQ options');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
