// server/src/apiDispatcher.js
// Central API Request Dispatcher for VIVA ANALYSER.
// Directly integrated into standalone server (server.cjs) and Vite dev server (vite.config.js).
// 100% OFFLINE, ZERO CLOUD.

import { accountService } from './services/accounts.js';
import { sessionService } from './services/sessions.js';
import { modelRegistry } from './ai/modelRegistry.js';
import { modelHealth } from './ai/modelHealth.js';
import { contextBuilder } from './ai/contextBuilder.js';
import { questionGenerator } from './ai/questionGenerator.js';
import { answerAnalyser } from './ai/answerAnalyser.js';
import { hintGenerator } from './ai/hintGenerator.js';
import { difficultyEngine } from './ai/difficultyEngine.js';
import { masteryEngine } from './ai/masteryEngine.js';
import { documentProcessor } from './ai/documentProcessor.js';
import { referenceRetriever } from './ai/referenceRetriever.js';
import { eventLogger } from './antiCheat/eventLogger.js';

export async function handleApiRequest(pathname, method, body, headers = {}) {
  // Extract session token from Authorization header or Cookie
  const authHeader = headers['authorization'] || headers['Authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (headers['x-session-token'] || null);
  const session = sessionService.getSession(token);

  // 1. AUTH ROUTES
  if (pathname === '/api/auth/register' && method === 'POST') {
    return accountService.register(body);
  }

  if (pathname === '/api/auth/login' && method === 'POST') {
    const authRes = accountService.authenticate(body.username, body.password);
    if (!authRes.success) {
      return { status: 401, body: authRes };
    }
    const sess = sessionService.createSession(authRes.user);
    return {
      status: 200,
      body: {
        success: true,
        user: authRes.user,
        sessionId: sess.sessionId,
        token: sess.sessionId
      }
    };
  }

  if (pathname === '/api/auth/logout' && method === 'POST') {
    sessionService.destroySession(token);
    return { status: 200, body: { success: true } };
  }

  if (pathname === '/api/auth/session' && method === 'GET') {
    if (!session) {
      return { status: 401, body: { authenticated: false, error: 'Session expired or invalid.' } };
    }
    return { status: 200, body: { authenticated: true, user: session } };
  }

  if (pathname === '/api/auth/recovery/request' && method === 'POST') {
    return { status: 200, body: accountService.generateRecoveryToken(body.username) };
  }

  if (pathname === '/api/auth/recovery/reset' && method === 'POST') {
    const resetRes = accountService.resetPasswordWithToken(body.username, body.token, body.newPassword);
    if (resetRes.success) {
      sessionService.destroyUserSessions(body.username);
    }
    return { status: resetRes.success ? 200 : 400, body: resetRes };
  }

  // 2. AI MODEL STATUS & ORCHESTRATION
  if (pathname === '/api/ai/models/status' && method === 'GET') {
    const health = await modelHealth.checkHealth();
    return { status: 200, body: { success: true, ...health } };
  }

  // 3. GROUNDED MULTIMODAL QUESTION GENERATION
  if (pathname === '/api/ai/viva/grounded-question' && method === 'POST') {
    const context = contextBuilder.buildContext({
      facultyId: session?.username || body.facultyId || 'FACULTY_DEFAULT',
      subject: body.subject || 'Engineering',
      subjectId: body.subjectId || 'ENG',
      unit: body.unit || 'Unit 1',
      topic: body.topic || 'Core Concept',
      subtopic: body.subtopic || '',
      conceptId: body.conceptId || '',
      learningOutcome: body.learningOutcome || 'Demonstrate deep conceptual and analytical understanding',
      targetDifficulty: body.difficulty || 'moderate',
      questionType: body.questionType || 'conceptual',
      previouslyAsked: body.previouslyAsked || [],
      knownMisconceptions: body.knownMisconceptions || []
    });

    const question = await questionGenerator.generateQuestion(context, body);
    return {
      status: 200,
      body: {
        success: true,
        question,
        context: {
          conceptId: context.conceptId,
          sourceType: context.sourceType,
          evidenceCount: context.referenceEvidence.length
        }
      }
    };
  }

  // 4. LAYERED ANSWER EVALUATION
  if (pathname === '/api/ai/viva/evaluate-layered' && method === 'POST') {
    const { question, studentAnswer, hintsUsed, answerTimeSec, sessionId } = body;
    const studentId = session?.username || body.studentId || 'STUDENT';

    const evaluation = await answerAnalyser.evaluateAnswer({
      question,
      studentAnswer,
      hintsUsed: hintsUsed || 0,
      answerTimeSec: answerTimeSec || 0
    });

    const masterySummary = masteryEngine.updateMastery(
      sessionId || `sess_${Date.now()}`,
      studentId,
      question,
      evaluation,
      { hintsUsed, timeSpentSec: answerTimeSec }
    );

    const adaptiveNext = difficultyEngine.determineNextStep(
      evaluation,
      question,
      masterySummary.historyCount
    );

    return {
      status: 200,
      body: {
        success: true,
        evaluation,
        adaptiveNext,
        masterySummary
      }
    };
  }

  // 5. CONCEPT-SPECIFIC PROGRESSIVE HINT
  if (pathname === '/api/ai/viva/hint' && method === 'POST') {
    const { question, currentHintLevel = 0, missingConcepts = [] } = body;
    const hint = hintGenerator.getNextHint(question, currentHintLevel, { missingConcepts });
    return { status: 200, body: { success: true, hint } };
  }

  // 6. FACULTY DOCUMENT UPLOAD & INGESTION
  if (pathname === '/api/documents/upload' && method === 'POST') {
    if (session && session.role !== 'faculty') {
      return { status: 403, body: { success: false, error: 'Only faculty members may upload reference documents.' } };
    }
    const facultyId = session?.username || body.facultyId || 'FACULTY_DEFAULT';
    const { subjectId = 'GENERAL', filename, textContent, metadata = {} } = body;

    const result = documentProcessor.processTextDocument(facultyId, subjectId, filename, textContent, metadata);
    return { status: 200, body: result };
  }

  // 7. ANTI-MALPRACTICE EVENT LOGGING
  if (pathname === '/api/anti-cheat/event' && method === 'POST') {
    const { eventType, eventData = {}, sessionId } = body;
    const studentId = session?.username || body.studentId || 'STUDENT';
    const record = eventLogger.logEvent(eventType, eventData, sessionId, studentId);
    return { status: 200, body: { success: true, loggedIndex: record.index } };
  }

  if (pathname === '/api/anti-cheat/verify' && method === 'GET') {
    const result = eventLogger.verifyAuditChain();
    return { status: 200, body: result };
  }

  // 8. OLLAMA STATUS CHECK
  if (pathname === '/api/ollama/status' && method === 'GET') {
    const discovery = await modelRegistry.discoverModels();
    const isOnline = discovery.available && discovery.installedModels.length > 0;
    const activeModel = modelRegistry.getModelForRole('fast') || modelRegistry.getModelForRole('reasoning') || 'llama3.2:1b';
    return {
      status: 200,
      body: {
        available: isOnline,
        models: discovery.installedModels || [],
        activeModel: isOnline ? activeModel : null,
        provider: isOnline ? 'ollama' : 'offline_ontology'
      }
    };
  }

  // 9. UNIFIED AI QUESTION GENERATION (/api/ai/generate proxy)
  if (pathname === '/api/ai/generate' && method === 'POST') {
    const { topic = 'Core Principles', count = 5, subject, unit, questionType, documentContext = '' } = body;
    const targetCount = Math.min(20, Math.max(1, parseInt(count, 10) || 5));
    const types = ['conceptual', 'derivation', 'numerical', 'conceptual', 'circuit_analysis'];
    const generatedQuestions = [];

    for (let i = 0; i < targetCount; i++) {
      const qType = questionType || types[i % types.length];
      const ctx = contextBuilder.buildContext({
        subject: subject || topic,
        topic: topic,
        conceptId: `${topic.replace(/[^a-zA-Z0-9]/g, '_')}_C${i + 1}`.toUpperCase(),
        learningOutcome: `Demonstrate analytical reasoning on ${topic}`,
        targetDifficulty: i === 0 ? 'foundational' : (i < 3 ? 'moderate' : 'complex'),
        questionType: qType,
        facultyText: documentContext
      });

      const q = await questionGenerator.generateQuestion(ctx, body);
      // Guarantee MCQ options if required by frontend mode
      if (!q.options && qType === 'conceptual' && i % 2 === 1) {
        q.type = 'mcq';
        q.options = [
          `Primary governing mechanism of ${topic}`,
          `Unrelated auxiliary state variable`,
          `Secondary boundary divergence condition`,
          `Non-conforming empirical hypothesis`
        ];
        q.correctIndex = 0;
      }
      generatedQuestions.push(q);
    }

    return {
      status: 200,
      body: {
        success: true,
        data: {
          questions: generatedQuestions
        }
      }
    };
  }

  // 10. UNIFIED ASSESSMENT EVALUATION (/api/assessment/evaluate)
  if (pathname === '/api/assessment/evaluate' && method === 'POST') {
    const {
      question,
      studentAnswer,
      answerText: rawAnswerText,
      correctIndex,
      options,
      type,
      expectedKeywords = [],
      hintsUsed = 0,
      answerTimeSec = 0
    } = body;
    const effectiveAnswer = studentAnswer !== undefined ? studentAnswer : rawAnswerText;

    if (type === 'mcq' && typeof correctIndex === 'number') {
      const studentIdx = typeof effectiveAnswer === 'number' ? effectiveAnswer : parseInt(effectiveAnswer, 10);
      const isCorrect = studentIdx === correctIndex;
      const penalty = Math.min(30, (hintsUsed || 0) * 8);
      const score = isCorrect ? Math.max(50, 100 - penalty) : 15;
      const selectedText = (options && options[studentIdx]) ? options[studentIdx] : `Option ${studentIdx + 1}`;
      return {
        status: 200,
        body: {
          success: true,
          isCorrect,
          score,
          feedback: isCorrect
            ? `Correct technical option selected: "${selectedText}".`
            : `Selected option does not articulate the required governing principle.`
        }
      };
    }

    // Conceptual & Multimodal Layered Evaluation
    const evaluation = await answerAnalyser.evaluateAnswer({
      question: question || {
        text: 'Assess conceptual foundation',
        topic: 'Subject Principle',
        expectedKeywords
      },
      studentAnswer: effectiveAnswer,
      hintsUsed,
      answerTimeSec
    });

    return {
      status: 200,
      body: {
        success: true,
        isCorrect: evaluation.isCorrect,
        score: evaluation.score,
        feedback: evaluation.feedback,
        demonstratedConcepts: evaluation.demonstratedConcepts,
        missingConcepts: evaluation.missingConcepts,
        evaluation
      }
    };
  }

  // Route not handled here
  return null;
}

