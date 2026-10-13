// tests/viva_system_test.mjs
// Comprehensive automated verification test suite for VIVA ANALYSER.
// Tests: Auth, Sessions, Multi-Domain Generation, Multimodal Types,
// Layered Evaluation (Anti-Gibberish / Anti-False-Positive), Anti-Leak Hints,
// Hash-Chain Integrity, and Offline Fallbacks.
// 100% OFFLINE, ZERO CLOUD.

import assert from 'assert';
import { handleApiRequest } from '../server/src/apiDispatcher.js';
import { accountService } from '../server/src/services/accounts.js';
import { sessionService } from '../server/src/services/sessions.js';
import { modelRegistry } from '../server/src/ai/modelRegistry.js';
import { modelHealth } from '../server/src/ai/modelHealth.js';
import { contextBuilder } from '../server/src/ai/contextBuilder.js';
import { questionGenerator } from '../server/src/ai/questionGenerator.js';
import { answerAnalyser } from '../server/src/ai/answerAnalyser.js';
import { hintGenerator } from '../server/src/ai/hintGenerator.js';
import { difficultyEngine } from '../server/src/ai/difficultyEngine.js';
import { masteryEngine } from '../server/src/ai/masteryEngine.js';
import { documentProcessor } from '../server/src/ai/documentProcessor.js';
import { referenceRetriever } from '../server/src/ai/referenceRetriever.js';
import { eventLogger } from '../server/src/antiCheat/eventLogger.js';

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}\n    ${err.message}`);
    throw err;
  }
}

async function itAsync(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}\n    ${err.message}`);
    throw err;
  }
}

console.log('\n========================================================');
console.log('   VIVA ANALYSER AUTOMATED COMPREHENSIVE TEST SUITE');
console.log('========================================================\n');

// --- 1. AUTH & SESSION ISOLATION TESTS ---
console.log('--- 1. Authentication, Sessions & Security ---');

const testStudentUser = `student_test_${Date.now()}`;
const testFacultyUser = `faculty_test_${Date.now()}`;

it('Registers student account with PBKDF2 hashed password', () => {
  const reg = accountService.register({
    username: testStudentUser,
    password: 'securePassword123',
    name: 'Test Student',
    role: 'student'
  });
  assert.strictEqual(reg.success, true);
  assert.strictEqual(reg.user.username, testStudentUser);
  assert.strictEqual(reg.user.role, 'student');
});

it('Registers faculty account with role isolation', () => {
  const reg = accountService.register({
    username: testFacultyUser,
    password: 'facultyPassword456',
    name: 'Dr. Test Professor',
    role: 'faculty',
    department: 'ECE'
  });
  assert.strictEqual(reg.success, true);
  assert.strictEqual(reg.user.role, 'faculty');
});

it('Rejects invalid passwords during login', () => {
  const auth = accountService.authenticate(testStudentUser, 'wrongPassword');
  assert.strictEqual(auth.success, false);
});

let studentSession = null;
it('Authenticates valid credentials and creates server-side session token', () => {
  const auth = accountService.authenticate(testStudentUser, 'securePassword123');
  assert.strictEqual(auth.success, true);
  studentSession = sessionService.createSession(auth.user);
  assert.ok(studentSession.sessionId);
  assert.strictEqual(studentSession.username, testStudentUser);
});

it('Validates server session from token', () => {
  const retrieved = sessionService.getSession(studentSession.sessionId);
  assert.ok(retrieved);
  assert.strictEqual(retrieved.username, testStudentUser);
});

it('Rejects unauthorized or fake session tokens', () => {
  const fake = sessionService.getSession('non_existent_fake_token_123');
  assert.strictEqual(fake, null);
});

it('Generates offline one-time recovery token and resets password', () => {
  const recRes = accountService.generateRecoveryToken(testStudentUser);
  assert.strictEqual(recRes.success, true);
  assert.ok(recRes.recoveryToken);

  const resetRes = accountService.resetPasswordWithToken(testStudentUser, recRes.recoveryToken, 'newPassword789');
  assert.strictEqual(resetRes.success, true);

  const newLogin = accountService.authenticate(testStudentUser, 'newPassword789');
  assert.strictEqual(newLogin.success, true);
});

// --- 2. LOCAL AI ORCHESTRATION & DISCOVERY TESTS ---
console.log('\n--- 2. Local AI Orchestration & Discovery ---');

await itAsync('Discovers Ollama models or activates airgap procedural fallback', async () => {
  const discovery = await modelRegistry.discoverModels();
  assert.ok(discovery);
  assert.ok(Array.isArray(discovery.installedModels));
  assert.ok(discovery.assignments);
});

await itAsync('Monitors AI health and records telemetry', async () => {
  const health = await modelHealth.checkHealth();
  assert.ok(health);
  assert.ok(typeof health.healthy === 'boolean');
});

// --- 3. UNIVERSAL DOMAIN-GROUNDED QUESTION GENERATION ---
console.log('\n--- 3. Universal Domain-Grounded Question Generation ---');

const domains = [
  {
    name: 'Control Systems (Engineering)',
    subject: 'Control Systems',
    topic: 'Second-Order System Response',
    conceptId: 'CS_DAMPING_RATIO_OVERSHOOT',
    questionType: 'derivation'
  },
  {
    name: 'Cardiovascular Physiology (Medicine)',
    subject: 'Physiology',
    topic: 'Frank-Starling Law of the Heart',
    conceptId: 'MED_STARLING_CARDIAC_OUTPUT',
    questionType: 'conceptual'
  },
  {
    name: 'Contract Law (Law)',
    subject: 'Contract Law',
    topic: 'Doctrine of Promissory Estoppel',
    conceptId: 'LAW_PROMISSORY_ESTOPPEL',
    questionType: 'case_study'
  },
  {
    name: 'Operating Systems (Computer Science)',
    subject: 'Operating Systems',
    topic: 'Virtual Memory and Page Replacement',
    conceptId: 'CS_LRU_PAGE_REPLACEMENT',
    questionType: 'numerical'
  }
];

for (const d of domains) {
  await itAsync(`Generates grounded question for ${d.name} (${d.questionType})`, async () => {
    const ctx = contextBuilder.buildContext({
      subject: d.subject,
      topic: d.topic,
      conceptId: d.conceptId,
      questionType: d.questionType,
      targetDifficulty: 'moderate'
    });
    const q = await questionGenerator.generateQuestion(ctx);
    assert.ok(q);
    assert.ok(q.questionText && q.questionText.length > 15);
    assert.ok(Array.isArray(q.hints) && q.hints.length >= 3);
    assert.ok(q.expectedKeywords && q.expectedKeywords.length > 0);
  });
}

// --- 4. LAYERED ANSWER EVALUATION (ANTI-FALSE-POSITIVE) ---
console.log('\n--- 4. Layered Answer Evaluation & Gibberish Filtering ---');

const sampleQuestion = {
  id: 'q_test_1',
  subject: 'Control Systems',
  topic: 'Second-Order System Response',
  conceptId: 'CS_DAMPING_RATIO',
  questionText: 'Derive the percentage overshoot expression for an underdamped second-order system and explain how the damping ratio governs transient peak.',
  questionType: 'derivation',
  expectedKeywords: ['damping', 'overshoot', 'zeta', 'transient', 'peak'],
  requiredAnswerConcepts: ['Damping ratio zeta definition', 'Exponential decay envelope', 'Peak time calculation']
};

await itAsync('Rejects gibberish input (e.g. "asdfghjk qwerty")', async () => {
  const evalResult = await answerAnalyser.evaluateAnswer({
    question: sampleQuestion,
    studentAnswer: 'asdfghjk zxcvbnm qwertyuiop'
  });
  assert.strictEqual(evalResult.isCorrect, false);
  assert.ok(evalResult.score <= 10);
  assert.strictEqual(evalResult.evaluationType, 'gibberish_filter');
});

await itAsync('Rejects single-letter spam (e.g. "aaaaa")', async () => {
  const evalResult = await answerAnalyser.evaluateAnswer({
    question: sampleQuestion,
    studentAnswer: 'aaaaaaaaaaaaaaaaaaaaaaaa'
  });
  assert.strictEqual(evalResult.isCorrect, false);
  assert.ok(evalResult.score <= 10);
});

await itAsync('Rejects off-topic answers (e.g. discussing pizza recipes)', async () => {
  const evalResult = await answerAnalyser.evaluateAnswer({
    question: sampleQuestion,
    studentAnswer: 'To make the best pizza recipe you need flour, mozzarella cheese, and tomato sauce baked in the oven.'
  });
  assert.strictEqual(evalResult.isCorrect, false);
  assert.strictEqual(evalResult.status, 'Off-Topic');
  assert.ok(evalResult.score <= 20);
});

await itAsync('Awards high score to technically rigorous derivation answer', async () => {
  const validAnswer = 'In an underdamped second-order system, the peak overshoot Mp is determined by the damping ratio zeta. Solving the differential equation gives the transient envelope e^(-zeta*omega_n*t). At peak time tp = pi/(omega_d), the maximum peak occurs, yielding Mp = exp(-pi*zeta / sqrt(1 - zeta^2)) * 100%. As zeta increases towards 1, overshoot approaches zero.';
  const evalResult = await answerAnalyser.evaluateAnswer({
    question: sampleQuestion,
    studentAnswer: validAnswer
  });
  assert.strictEqual(evalResult.isCorrect, true);
  assert.ok(evalResult.score >= 75);
  assert.ok(evalResult.demonstratedConcepts.length >= 2);
});

await itAsync('Awards partial credit to incomplete but valid reasoning', async () => {
  const partialAnswer = 'The damping ratio zeta controls the overshoot. When zeta is small, the system oscillates with higher peak overshoot.';
  const evalResult = await answerAnalyser.evaluateAnswer({
    question: sampleQuestion,
    studentAnswer: partialAnswer
  });
  assert.ok(evalResult.score >= 40);
  assert.ok(evalResult.status === 'Partially Correct' || evalResult.status === 'Correct');
});

// --- 5. PROGRESSIVE HINTS & ANTI-LEAKAGE ---
console.log('\n--- 5. Progressive Hints & Anti-Leakage ---');

it('Generates progressive 4-tier hints without answer leakage', () => {
  for (let lvl = 0; lvl < 4; lvl++) {
    const hintRes = hintGenerator.getNextHint(sampleQuestion, lvl);
    assert.ok(hintRes.hintText);
    assert.strictEqual(hintRes.level, lvl + 1);
    assert.strictEqual(hintRes.antiLeakVerified, true);
  }
});

// --- 6. ADAPTIVE PROGRESSION & MASTERY TRACKING ---
console.log('\n--- 6. Adaptive Difficulty & Mastery State ---');

it('Increases difficulty after strong student performance', () => {
  const nextStep = difficultyEngine.determineNextStep({ score: 92 }, sampleQuestion);
  assert.strictEqual(nextStep.nextDifficulty, 'tough');
  assert.strictEqual(nextStep.nextAction, 'advance_to_deeper_problem');
});

it('Maintains difficulty and asks targeted follow-up on partial answer', () => {
  const nextStep = difficultyEngine.determineNextStep({ score: 62 }, sampleQuestion);
  assert.strictEqual(nextStep.nextAction, 'targeted_follow_up');
});

it('Reduces difficulty or provides prerequisite remediation on low score', () => {
  const nextStep = difficultyEngine.determineNextStep({ score: 25 }, sampleQuestion);
  assert.strictEqual(nextStep.nextAction, 'prerequisite_remediation');
});

it('Tracks concept mastery state and demonstrated concepts', () => {
  const summary = masteryEngine.updateMastery('session_test_1', testStudentUser, sampleQuestion, {
    score: 88,
    status: 'Correct',
    demonstratedConcepts: ['Damping ratio zeta'],
    missingConcepts: []
  });
  assert.ok(summary);
  assert.strictEqual(summary.studentId, testStudentUser);
  assert.ok(summary.demonstratedConcepts.includes('Damping ratio zeta'));
});

// --- 7. DOCUMENT INGESTION & LOCAL REFERENCE RETRIEVAL ---
console.log('\n--- 7. Document Ingestion & Reference Retrieval ---');

it('Ingests and chunks faculty reference document locally', () => {
  const docText = `UNIT II: TIME-DOMAIN ANALYSIS OF CONTROL SYSTEMS
Section 2.1: Transient Response of Second Order Systems.
The damping ratio zeta is defined as the ratio of actual damping to critical damping.
For zeta between 0 and 1, the closed loop poles are complex conjugates -zeta*omega_n +/- j*omega_d.
The maximum peak overshoot Mp is given by Mp = exp(-pi*zeta / sqrt(1 - zeta^2)) * 100%.
Settling time ts for 2% tolerance criterion is approximately 4 / (zeta * omega_n).`;

  const processed = documentProcessor.processTextDocument(testFacultyUser, 'CS101', 'control_notes.txt', docText);
  assert.strictEqual(processed.success, true);
  assert.ok(processed.chunksCount >= 1);

  const retrieval = referenceRetriever.retrievePassages(testFacultyUser, 'CS101', 'damping ratio peak overshoot');
  assert.strictEqual(retrieval.found, true);
  assert.strictEqual(retrieval.sourceType, 'reference_grounded');
  assert.ok(retrieval.passages.length >= 1);
  assert.strictEqual(retrieval.passages[0].sourceFile, 'control_notes.txt');
});

// --- 8. ANTI-MALPRACTICE EVENT LOGGING & HASH-CHAIN INTEGRITY ---
console.log('\n--- 8. Anti-Malpractice & SHA-256 Hash Chaining ---');

it('Logs behavioral events into tamper-evident hash chain and verifies cryptographically', () => {
  eventLogger.logEvent('paste_blocked', { key: 'Ctrl+V', target: 'answer_input' }, 'sess_1', testStudentUser);
  eventLogger.logEvent('tab_hidden', { durationMs: 2500 }, 'sess_1', testStudentUser);
  eventLogger.logEvent('answer_submitted', { timeSec: 45 }, 'sess_1', testStudentUser);

  const verification = eventLogger.verifyAuditChain();
  assert.strictEqual(verification.verified, true);
  assert.ok(verification.count >= 3);
});

// --- 9. CENTRAL API DISPATCHER VERIFICATION ---
console.log('\n--- 9. Central API Dispatcher Integration ---');

await itAsync('Handles /api/ai/models/status via dispatcher', async () => {
  const res = await handleApiRequest('/api/ai/models/status', 'GET', {});
  assert.ok(res);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
});

await itAsync('Handles /api/ai/viva/grounded-question via dispatcher', async () => {
  const res = await handleApiRequest('/api/ai/viva/grounded-question', 'POST', {
    subject: 'Analog Electronics',
    topic: 'MOSFET Small Signal Amplifiers',
    questionType: 'circuit_analysis',
    difficulty: 'moderate'
  });
  assert.ok(res);
  assert.strictEqual(res.status, 200);
  assert.ok(res.body.question);
  assert.ok(res.body.question.questionText);
});

await itAsync('Handles /api/ai/viva/evaluate-layered via dispatcher', async () => {
  const res = await handleApiRequest('/api/ai/viva/evaluate-layered', 'POST', {
    question: sampleQuestion,
    studentAnswer: 'Damping ratio controls overshoot through exponential envelope decay e^(-zeta*omega_n*t).',
    hintsUsed: 1,
    answerTimeSec: 35
  });
  assert.ok(res);
  assert.strictEqual(res.status, 200);
  assert.ok(res.body.evaluation);
  assert.ok(res.body.adaptiveNext);
});

console.log('\n========================================================');
console.log(`  ALL ${passedTests}/${totalTests} AUTOMATED TESTS EXECUTED AND PASSED!`);
console.log('========================================================\n');
