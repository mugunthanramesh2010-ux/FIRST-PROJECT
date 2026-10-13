// server/src/ai/outputValidator.js
// Validates generated questions for topic grounding, anti-leak, schema validity, and safe rendering.
// 100% OFFLINE, ZERO CLOUD.

import { validateQuestionSchema } from './questionSchemas.js';

export class OutputValidator {
  /**
   * Validate question before it reaches the student
   */
  validate(question, context = {}) {
    const checks = {
      schemaValid: false,
      antiLeakPassed: true,
      notDuplicate: true,
      safeRendering: true,
      topicGrounded: true,
      reasons: []
    };

    // 1. Schema Check
    const schemaRes = validateQuestionSchema(question);
    checks.schemaValid = schemaRes.valid;
    if (!schemaRes.valid) {
      checks.reasons.push(...schemaRes.errors);
    }

    // 2. Anti-Leak Check: Verify hints do NOT give away the exact MCQ option or answer
    if (question.type === 'mcq' && Array.isArray(question.options) && typeof question.correctIndex === 'number') {
      const correctText = String(question.options[question.correctIndex] || '').toLowerCase().trim();
      const hints = Array.isArray(question.hints) ? question.hints : [];

      hints.forEach((h, hIdx) => {
        const lowerH = String(h).toLowerCase();
        // If hint literally repeats the entire correct answer option
        if (correctText.length > 5 && lowerH.includes(correctText)) {
          checks.antiLeakPassed = false;
          checks.reasons.push(`Hint ${hIdx + 1} leaks the exact correct answer.`);
        }
      });
    }

    // 3. Duplicate Detection Check
    const history = context.previouslyAskedQuestions || [];
    const currentText = String(question.questionText || question.text || '').toLowerCase().trim();
    const isDup = history.some(prev => {
      const prevText = String(prev.questionText || prev.text || '').toLowerCase().trim();
      return prevText === currentText || (currentText.length > 20 && prevText.includes(currentText.slice(0, 40)));
    });

    if (isDup) {
      checks.notDuplicate = false;
      checks.reasons.push('Question is a duplicate of a previously asked question in this session.');
    }

    // 4. Safe Rendering Check: Disallow raw HTML or script tags
    const fullText = JSON.stringify(question);
    if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(fullText) || /javascript:/i.test(fullText)) {
      checks.safeRendering = false;
      checks.reasons.push('Model output contains unsafe scripts or dangerous markup.');
    }

    // 5. Topic Grounding Check: Topic must be relevant
    const topic = String(context.topic || '').toLowerCase();
    if (topic && topic.length > 3) {
      const qLower = currentText.toLowerCase();
      // Check if topic or its principal root word is reflected in question, concept, or expected keywords
      const topicWords = topic.split(/\s+/).filter(w => w.length > 3);
      const matchedWord = topicWords.some(w => qLower.includes(w) || (question.expectedKeywords || []).some(k => String(k).toLowerCase().includes(w)));
      if (!matchedWord && !context.referenceEvidence?.length) {
        // Warning, might be loosely grounded
        checks.reasons.push(`Question lacks direct lexical alignment with target topic "${context.topic}".`);
      }
    }

    const isValid = checks.schemaValid && checks.antiLeakPassed && checks.notDuplicate && checks.safeRendering;
    return {
      isValid,
      checks,
      sanitizedQuestion: isValid ? this.sanitizeQuestion(question) : null
    };
  }

  /**
   * Sanitize question content for safe React rendering
   */
  sanitizeQuestion(q) {
    const clone = JSON.parse(JSON.stringify(q));
    // Ensure all strings are safe and trimmed
    clone.questionText = String(clone.questionText || clone.text || '').trim();
    if (Array.isArray(clone.options)) {
      clone.options = clone.options.map(opt => String(opt || '').trim());
    }
    if (Array.isArray(clone.hints)) {
      clone.hints = clone.hints.map(h => String(h || '').trim());
    }
    return clone;
  }
}

export const outputValidator = new OutputValidator();
