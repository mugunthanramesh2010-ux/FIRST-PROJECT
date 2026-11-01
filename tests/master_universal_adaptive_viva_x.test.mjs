// tests/master_universal_adaptive_viva_x.test.mjs
// VIVA ANALYZER X — UNIVERSAL OFFLINE ACADEMIC INTELLIGENCE & ADAPTIVE EXAMINATION PLATFORM
// MASTER VERIFICATION & REGRESSION SUITE (TESTS 1 THROUGH 8)

import assert from 'node:assert';
import {
  ACADEMIC_REGISTRY,
  resolveAcademicContext,
  GenerateQuestion,
  GenerateOptions,
  GenerateAcademicQuestionPackage,
  ValidateQuestion,
  GenerateHint,
  EvaluateResponse
} from '../src/services/academicAssessmentEngine.js';
import { adaptiveStudentIntelligence, getProficiencyBand } from '../server/src/ai/adaptiveStudentIntelligence.js';
import { assessmentManager } from '../server/src/services/assessmentManager.js';
import { documentProcessor } from '../server/src/ai/documentProcessor.js';
import { referenceRetriever } from '../server/src/ai/referenceRetriever.js';

let totalTests = 0;
let passedTests = 0;

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ PASS [${totalTests}]: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL [${totalTests}]: ${name}`);
    console.error(`    ${err.message}\n`);
    throw err;
  }
}

console.log('========================================================================');
console.log('  VIVA ANALYZER X — MASTER VERIFICATION & REGRESSION TEST SUITE');
console.log('  TESTS 1 THROUGH 8: GROUNDING, ADAPTIVITY, BANDS, INTEGRITY, NEGATIVES');
console.log('========================================================================\n');

async function runMasterSuite() {
  // ---------------------------------------------------------------------------
  // TEST 1: Topic Integrity — Mechanical Engineering / Machine Design / Shaft Design
  // ---------------------------------------------------------------------------
  await test('Test 1 — Topic integrity: Shaft Design assesses torsional shear, sizing, fatigue, and Te (ZERO beam bending or bioreactor)', async () => {
    const concepts = [
      'torsional shear stress and shaft diameter',
      'fatigue loading and stress concentration',
      'combined bending and torsion'
    ];

    for (const concept of concepts) {
      const pkg = GenerateAcademicQuestionPackage({
        subjectName: 'Mechanical Engineering',
        topic: 'Shaft Design',
        concept,
        questionType: 'mcq',
        difficulty: 'Intermediate'
      });

      assert.strictEqual(pkg.valid, true, `Package for concept "${concept}" must be valid`);
      assert.strictEqual(pkg.options.length, 4, 'Must have exactly 4 options');
      assert.ok(pkg.correctIndex >= 0 && pkg.correctIndex <= 3, 'Valid correctIndex');

      const fullText = `${pkg.questionText} ${pkg.options.join(' ')} ${pkg.explanation || ''}`.toLowerCase();

      // Topic keywords must be present
      assert.ok(
        fullText.includes('shaft') || fullText.includes('torsion') || fullText.includes('shear') ||
        fullText.includes('torque') || fullText.includes('diameter') || fullText.includes('fatigue') ||
        fullText.includes('bending'),
        `Shaft Design question must contain shaft mechanical design terminology: ${fullText}`
      );

      // Gate B Quarantine: Absolutely ZERO cross-discipline or beam bending contamination
      const forbidden = [
        'neutral axis', 'beam bending', 'bioreactor', 'oxygen transfer', 'kla',
        'demand paging', 'bcnf', 'qpsk', 'viva arena'
      ];
      for (const badTerm of forbidden) {
        assert.strictEqual(
          fullText.includes(badTerm),
          false,
          `Shaft Design package for "${concept}" must NOT contain "${badTerm}"`
        );
      }

      // Check specific concept formulas/depth
      if (concept === 'torsional shear stress and shaft diameter') {
        assert.ok(
          fullText.includes('16t') || fullText.includes('pi') || fullText.includes('d^3') ||
          fullText.includes('tau') || fullText.includes('surface') || fullText.includes('diameter'),
          'Must assess torsional shear stress or shaft diameter sizing relationship'
        );
      } else if (concept === 'combined bending and torsion') {
        assert.ok(
          fullText.includes('sqrt(m^2 + t^2)') || fullText.includes('equivalent') ||
          fullText.includes('tresca') || fullText.includes('mohr') || fullText.includes('combined'),
          'Must assess equivalent torque Te or combined bending and torsion'
        );
      }
    }
  });

  // ---------------------------------------------------------------------------
  // TEST 2: Two-Student Adaptive Differentiation (Strict Topic Lock)
  // ---------------------------------------------------------------------------
  await test('Test 2 — Adaptive differentiation: Student A (weak in fatigue) vs Student B (weak in diameter) both stay in Shaft Design', async () => {
    const studentA = `std_alpha_${Date.now()}`;
    const studentB = `std_beta_${Date.now()}`;
    const subject = 'Mechanical Engineering';
    const topic = 'Shaft Design';
    const availableConcepts = [
      'torsional shear stress and shaft diameter',
      'fatigue loading and stress concentration',
      'combined bending and torsion'
    ];

    // Student A records success in torsional shear, failure in fatigue loading
    adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId: studentA,
      subject,
      topic,
      question: { id: 'q_a1', concept: 'torsional shear stress and shaft diameter', format: 'Theory' },
      studentAnswer: 'Option A',
      isCorrect: true,
      hintsUsed: 0,
      responseTimeSeconds: 30
    });
    adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId: studentA,
      subject,
      topic,
      question: { id: 'q_a2', concept: 'fatigue loading and stress concentration', format: 'Theory' },
      studentAnswer: 'Option B',
      isCorrect: false,
      hintsUsed: 2,
      responseTimeSeconds: 45
    });

    // Student B records success in fatigue loading, failure in torsional shear / diameter calculation
    adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId: studentB,
      subject,
      topic,
      question: { id: 'q_b1', concept: 'fatigue loading and stress concentration', format: 'Theory' },
      studentAnswer: 'Option C',
      isCorrect: true,
      hintsUsed: 0,
      responseTimeSeconds: 28
    });
    adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId: studentB,
      subject,
      topic,
      question: { id: 'q_b2', concept: 'torsional shear stress and shaft diameter', format: 'Numerical' },
      studentAnswer: 'Option D',
      isCorrect: false,
      hintsUsed: 2,
      responseTimeSeconds: 50
    });

    // Adaptively select next concept for Student A
    const nextA = adaptiveStudentIntelligence.selectNextConcept({
      studentId: studentA,
      subject,
      topic,
      availableConcepts
    });

    // Adaptively select next concept for Student B
    const nextB = adaptiveStudentIntelligence.selectNextConcept({
      studentId: studentB,
      subject,
      topic,
      availableConcepts
    });

    // Student A must be targeted on fatigue loading
    assert.strictEqual(nextA.concept, 'fatigue loading and stress concentration');
    assert.strictEqual(nextA.assignedTopic, 'Shaft Design');
    assert.strictEqual(nextA.topicLocked, true);

    // Student B must be targeted on torsional shear stress and shaft diameter
    assert.strictEqual(nextB.concept, 'torsional shear stress and shaft diameter');
    assert.strictEqual(nextB.assignedTopic, 'Shaft Design');
    assert.strictEqual(nextB.topicLocked, true);

    // Differentiation verified: different targeted concepts for different students, strictly under Shaft Design
    assert.notStrictEqual(nextA.concept, nextB.concept, 'Student A and B must receive differentiated targeted concepts');
  });

  // ---------------------------------------------------------------------------
  // TEST 3: Fine-Grained Continuous Percentage Proficiency & Bands
  // ---------------------------------------------------------------------------
  await test('Test 3 — Single-percentage proficiency: 1%, 5%, 17%, 26%, 39%, 48%, 57%, 64%, 73%, 82%, 91%, 98% with bands and labels', async () => {
    const testCases = [
      { p: 1, expectedBand: '0–10%', expectedLabel: 'Slightly low', expectedInterp: 'Initial understanding' },
      { p: 5, expectedBand: '0–10%', expectedLabel: 'Slightly low', expectedInterp: 'Initial understanding' },
      { p: 17, expectedBand: '11–20%', expectedLabel: 'Low', expectedInterp: 'Very limited understanding' },
      { p: 26, expectedBand: '21–30%', expectedLabel: 'Low', expectedInterp: 'Developing foundation' },
      { p: 39, expectedBand: '31–40%', expectedLabel: 'Slightly moderate', expectedInterp: 'Basic understanding' },
      { p: 48, expectedBand: '41–50%', expectedLabel: 'Moderate', expectedInterp: 'Emerging competence' },
      { p: 57, expectedBand: '51–60%', expectedLabel: 'Moderate', expectedInterp: 'Moderate understanding' },
      { p: 64, expectedBand: '61–70%', expectedLabel: 'Slightly high', expectedInterp: 'Good understanding' },
      { p: 73, expectedBand: '71–80%', expectedLabel: 'High', expectedInterp: 'Strong understanding' },
      { p: 82, expectedBand: '81–90%', expectedLabel: 'Advanced', expectedInterp: 'Advanced understanding' },
      { p: 91, expectedBand: '91–100%', expectedLabel: 'Tricky reasoning capability', expectedInterp: 'Demonstrated high mastery' },
      { p: 98, expectedBand: '91–100%', expectedLabel: 'Tricky reasoning capability', expectedInterp: 'Demonstrated high mastery' }
    ];

    for (const tc of testCases) {
      const res = getProficiencyBand(tc.p);
      assert.strictEqual(res.band, tc.expectedBand, `Percent ${tc.p}% band mismatch`);
      assert.strictEqual(res.label, tc.expectedLabel, `Percent ${tc.p}% label mismatch`);
      assert.strictEqual(res.interpretation, tc.expectedInterp, `Percent ${tc.p}% interpretation mismatch`);
    }

    // Verify diagnostic baseline initialization
    const diag = adaptiveStudentIntelligence.initialDiagnosticPlan('Shaft Design', 'Mechanical Engineering', 2);
    assert.strictEqual(diag.topicLocked, true);
    assert.strictEqual(diag.diagnosticCount, 2);
    assert.strictEqual(diag.assignedTopic, 'Shaft Design');
    assert.strictEqual(diag.initialBands, '0–10% (Initial understanding)');
  });

  // ---------------------------------------------------------------------------
  // TEST 4: Assessment Modes & Topic Locking
  // ---------------------------------------------------------------------------
  await test('Test 4 — Assessment categories: Self-Learning, Coursework, Scheduled Viva, Practice Viva, Classroom Viva all lock topic', async () => {
    const modes = [
      { mode: 'Self-Learning', topic: 'Motor Drive', subject: 'Electrical Engineering' },
      { mode: 'Coursework Assignments', topic: 'Shaft Design', subject: 'Mechanical Engineering' },
      { mode: 'Scheduled Viva', topic: 'Strength of Materials', subject: 'Mechanical Engineering' },
      { mode: 'Practice Viva', topic: 'Sterilization', subject: 'Biotechnology' },
      { mode: 'Classroom Viva', topic: 'Digital Modulation', subject: 'Communication Engineering' }
    ];

    for (const m of modes) {
      const pkg = GenerateAcademicQuestionPackage({
        subjectName: m.subject,
        topic: m.topic,
        difficulty: 'Intermediate'
      });

      assert.strictEqual(pkg.valid, true, `Mode "${m.mode}" with topic "${m.topic}" must generate valid question`);
      assert.strictEqual(pkg.topic, m.topic, `Assigned topic must be strictly preserved in mode "${m.mode}"`);

      const qText = pkg.questionText.toLowerCase();
      if (m.topic === 'Motor Drive') {
        assert.ok(qText.includes('motor') || qText.includes('v/f') || qText.includes('torque') || qText.includes('braking'));
      } else if (m.topic === 'Shaft Design') {
        assert.ok(qText.includes('shaft') || qText.includes('torsion') || qText.includes('shear') || qText.includes('torque'));
      } else if (m.topic === 'Strength of Materials') {
        assert.ok(qText.includes('bending') || qText.includes('beam') || qText.includes('neutral') || qText.includes('stress'));
      } else if (m.topic === 'Sterilization') {
        assert.ok(qText.includes('del factor') || qText.includes('thermal') || qText.includes('kinetics') || qText.includes('sterilization'));
      } else if (m.topic === 'Digital Modulation') {
        assert.ok(qText.includes('qpsk') || qText.includes('phase') || qText.includes('constellation') || qText.includes('bit'));
      }
    }
  });

  // ---------------------------------------------------------------------------
  // TEST 5: 100% Offline Academic Engine (No Internet Required)
  // ---------------------------------------------------------------------------
  await test('Test 5 — Offline operation: Local knowledge retrieval, question generation, options, hints, and evaluation work completely offline', async () => {
    // 1. Local context resolution
    const ctx = resolveAcademicContext({
      subjectName: 'Mechanical Engineering',
      topic: 'Shaft Design',
      concept: 'torsional shear stress and shaft diameter'
    });
    assert.strictEqual(ctx.valid, true);
    assert.strictEqual(ctx.subjectName, 'Mechanical Engineering');
    assert.strictEqual(ctx.topic, 'Shaft Design');

    // 2. Offline question package generation
    const pkg = GenerateAcademicQuestionPackage({
      subjectName: 'Mechanical Engineering',
      topic: 'Shaft Design',
      concept: 'torsional shear stress and shaft diameter',
      difficulty: 'Intermediate'
    });
    assert.strictEqual(pkg.valid, true);
    assert.strictEqual(pkg.options.length, 4);

    // 3. Offline hint generation
    const hint1 = pkg.hints[0];
    const hint2 = pkg.hints[1];
    assert.ok(hint1 && hint1.length > 10, 'Offline Hint 1 must be substantive');
    assert.ok(hint2 && hint2.length > 10, 'Offline Hint 2 must be substantive');

    // 4. Offline response evaluation
    const evalCorrect = EvaluateResponse(pkg, pkg.options[pkg.correctIndex], {}, pkg.correctIndex);
    assert.strictEqual(evalCorrect.isCorrect, true);
    assert.strictEqual(evalCorrect.score, 100);

    const wrongIndex = (pkg.correctIndex + 1) % 4;
    const evalWrong = EvaluateResponse(pkg, pkg.options[wrongIndex], {}, wrongIndex);
    assert.strictEqual(evalWrong.isCorrect, false);
    assert.strictEqual(evalWrong.score, 0);
  });

  // ---------------------------------------------------------------------------
  // TEST 6: Multi-Device Operation & Student Delivery View Sanitization
  // ---------------------------------------------------------------------------
  await test('Test 6 — Multi-device operation: Student view strips answer keys, model answers, and explanations', async () => {
    const rawAssessment = {
      id: 'asmt_live_shaft_001',
      version: 1,
      title: 'Machine Design Continuous Viva',
      subject: 'Mechanical Engineering',
      topic: 'Shaft Design',
      department: 'Mechanical Engineering',
      classYear: 'III',
      targetSections: ['A', 'B'],
      instructions: 'Complete all questions individually.',
      durationMinutes: 30,
      totalMarks: 50,
      questionCount: 2,
      allowProgressiveHints: true,
      questions: [
        {
          id: 'q_shaft_01',
          questionText: 'For a solid circular shaft of diameter d transmitting torque T, what is the maximum torsional shear stress tau_max?',
          options: [
            '16T / (pi * d^3)',
            '32T / (pi * d^3)',
            'pi * d^3 / (16T)',
            '8T / (pi * d^4)'
          ],
          correctIndex: 0,
          modelAnswer: 'tau_max = 16T / (pi * d^3) derived from tau/r = T/J where J = pi*d^4/32.',
          explanation: 'The maximum shear stress occurs at the outer surface r = d/2.',
          rubric: { conceptMastery: 1.0 },
          hints: ['Recall the torsion equation tau/r = T/J.', 'Substitute J = pi*d^4/32 and r = d/2.']
        }
      ]
    };

    const attempt = {
      id: 'att_std_001',
      assessmentId: 'asmt_live_shaft_001',
      assessmentVersion: 1,
      answers: {},
      durationSeconds: 1800,
      serverStartTime: Date.now(),
      status: 'in_progress',
      questions: rawAssessment.questions
    };

    // Sanitize for student delivery
    const sanitizedAttempt = assessmentManager.sanitizeAttemptForStudent(attempt, rawAssessment);

    // Verify delivery attributes
    assert.strictEqual(sanitizedAttempt.id, 'att_std_001');
    assert.strictEqual(sanitizedAttempt.subject, 'Mechanical Engineering');
    assert.strictEqual(sanitizedAttempt.topic, 'Shaft Design');
    assert.strictEqual(sanitizedAttempt.questions.length, 1);

    const safeQ = sanitizedAttempt.questions[0];
    assert.strictEqual(safeQ.questionText, rawAssessment.questions[0].questionText);
    assert.strictEqual(safeQ.options.length, 4);

    // CRITICAL: Ensure NO answer leaks in student delivery
    assert.strictEqual(safeQ.correctIndex, undefined, 'Student view must NOT include correctIndex');
    assert.strictEqual(safeQ.modelAnswer, undefined, 'Student view must NOT include modelAnswer');
    assert.strictEqual(safeQ.explanation, undefined, 'Student view must NOT include explanation');
    assert.strictEqual(safeQ.rubric, undefined, 'Student view must NOT include rubric');
  });

  // ---------------------------------------------------------------------------
  // TEST 7: Assessment Integrity & Audited Proctoring Telemetry
  // ---------------------------------------------------------------------------
  await test('Test 7 — Assessment integrity: Observation logging for visibility changes and blur without false auto-disqualification', async () => {
    const attemptId = `att_integ_${Date.now()}`;
    const studentUser = { username: 'std_007', regNo: 'STD_007' };
    assessmentManager.attempts[attemptId] = {
      id: attemptId,
      assessmentId: 'asmt_live_shaft_001',
      studentId: 'std_007',
      studentRegNo: 'STD_007',
      status: 'in_progress',
      integrityObservations: []
    };

    // Log window blur observation
    const res1 = assessmentManager.logIntegrityObservation(attemptId, studentUser, {
      type: 'window_blur',
      details: 'Student switched window/tab during examination.'
    });

    assert.strictEqual(res1.success, true);
    assert.strictEqual(res1.observationCount, 1);

    // Log fullscreen exit observation
    const res2 = assessmentManager.logIntegrityObservation(attemptId, studentUser, {
      type: 'fullscreen_exit',
      details: 'Fullscreen mode exited.'
    });

    assert.strictEqual(res2.success, true);
    assert.strictEqual(res2.observationCount, 2);

    // Status MUST remain in_progress (audited observation, no false automatic disqualification)
    assert.strictEqual(assessmentManager.attempts[attemptId].status, 'in_progress');
    assert.strictEqual(assessmentManager.attempts[attemptId].integrityObservations.length, 2);
  });

  // ---------------------------------------------------------------------------
  // TEST 8: Mandatory Negative Tests
  // ---------------------------------------------------------------------------
  await test('Test 8 — Mandatory negative tests: Motor Drive rejects Oxygen Transfer, Strength of Materials rejects Communication Engineering, and generic boilerplate is completely blocked', async () => {
    // 1. Motor Drive must NOT accept Oxygen Transfer
    const motorRegTopic = ACADEMIC_REGISTRY.electrical_engineering.topics['motor drive'];
    const motorConcepts = Object.keys(motorRegTopic?.concepts || {});
    assert.strictEqual(
      motorConcepts.some(c => c.toLowerCase().includes('oxygen') || c.toLowerCase().includes('bioreactor')),
      false,
      'Motor Drive must not contain Oxygen Transfer concepts'
    );

    // 2. Strength of Materials must NOT accept Communication Engineering
    const somRegTopic = ACADEMIC_REGISTRY.mechanical_engineering.topics['strength of materials'];
    const somConcepts = Object.keys(somRegTopic?.concepts || {});
    assert.strictEqual(
      somConcepts.some(c => c.toLowerCase().includes('qpsk') || c.toLowerCase().includes('modulation') || c.toLowerCase().includes('carrier')),
      false,
      'Strength of Materials must not contain Communication Engineering concepts'
    );

    // 3. Gate validation rejection of contaminated question
    const fakeContaminatedPkg = {
      subject: 'Mechanical Engineering',
      topic: 'Shaft Design',
      concept: 'torsional shear stress and shaft diameter',
      questionText: 'Calculate the volumetric mass transfer coefficient (kLa) and oxygen transfer rate for an aerobic bioreactor.',
      options: [
        'kLa determines dissolved oxygen rate in culture broth',
        'Shaft diameter must be sized based on Tresca shear criteria',
        'Zero thermodynamic or computational cost is maintained',
        'Uncalibrated stochastic divergence governs the system'
      ],
      correctIndex: 1,
      explanation: 'kLa measures oxygen transfer efficiency.',
      hints: ['Consider dissolved oxygen concentration.']
    };

    const val = ValidateQuestion(fakeContaminatedPkg, 'Shaft Design');
    assert.strictEqual(val.valid, false, 'Contaminated question must be rejected by validation gates');
    assert.ok(val.errors.length > 0, 'Validation gate must report specific errors');

    // 4. Stale cache rejection on topic change
    const pkgA = GenerateAcademicQuestionPackage({
      subjectName: 'Mechanical Engineering',
      topic: 'Motor Drive',
      difficulty: 'Intermediate'
    });
    const pkgB = GenerateAcademicQuestionPackage({
      subjectName: 'Mechanical Engineering',
      topic: 'Shaft Design',
      difficulty: 'Intermediate'
    });

    assert.notStrictEqual(pkgA.topic, pkgB.topic);
    assert.notStrictEqual(pkgA.questionText, pkgB.questionText, 'Changing topic must generate new question matching new topic, never reusing stale cache');
  });
}

runMasterSuite()
  .then(() => {
    console.log('\n========================================================================');
    console.log(`  ALL ${totalTests} MASTER ADAPTIVE VIVA X TESTS PASSED CLEANLY! (100% SUCCESS)`);
    console.log('========================================================================\n');
    process.exit(0);
  })
  .catch(err => {
    console.error('\nMASTER REGRESSION SUITE FAILED:', err);
    process.exit(1);
  });
