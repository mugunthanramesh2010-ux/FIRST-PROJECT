// server/src/ai/contextBuilder.js
// Assembles structured pedagogical context for domain-grounded question generation.
// 100% OFFLINE, ZERO CLOUD.

import { referenceRetriever } from './referenceRetriever.js';

export class ContextBuilder {
  /**
   * Builds complete assessment context for generation
   */
  buildContext(params = {}) {
    const {
      facultyId = 'FACULTY_DEFAULT',
      subject = 'Engineering',
      subjectId = 'ENG',
      unit = 'Unit 1',
      topic = 'General Domain Topic',
      subtopic = '',
      conceptId = '',
      learningOutcome = 'Explain, analyze, and apply core principles',
      targetDifficulty = 'moderate',
      questionType = 'conceptual',
      previouslyAsked = [],
      knownMisconceptions = [],
      studentMastery = 0.5
    } = params;

    // Retrieve local document evidence if faculty documents exist
    const retrieval = referenceRetriever.retrievePassages(facultyId, subjectId, `${topic} ${subtopic}`);

    const context = {
      subject,
      subjectId,
      unit,
      topic,
      subtopic,
      conceptId: conceptId || `${subjectId}_${topic.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`,
      learningOutcome,
      targetDifficulty,
      questionType,
      referenceEvidence: retrieval.passages || [],
      sourceType: retrieval.sourceType,
      evidenceNotice: retrieval.evidenceNotice || null,
      previouslyAskedQuestions: previouslyAsked,
      previouslyAskedConcepts: previouslyAsked.map(q => q.conceptId || q.topic).filter(Boolean),
      knownMisconceptions,
      studentMastery,
      timestamp: new Date().toISOString()
    };

    return context;
  }
}

export const contextBuilder = new ContextBuilder();
