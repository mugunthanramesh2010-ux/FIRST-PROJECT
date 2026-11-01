// tests/critical_academic_context_isolation.test.mjs
// VIVA ANALYZER — CRITICAL ACADEMIC CONTEXT ISOLATION & ACCURACY REPAIR TEST SUITE

import assert from 'node:assert';
import {
  ValidateQuestion,
  GenerateAcademicQuestionPackage,
  resolveAcademicContext
} from '../src/services/academicAssessmentEngine.js';
import { generateUniversalTopicModel } from '../src/services/universalOntology.js';
import { getTopicKnowledgeMap } from '../src/services/topicMasteryEngine.js';
import { adaptiveStudentIntelligence } from '../server/src/ai/adaptiveStudentIntelligence.js';

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
console.log('  CRITICAL ACADEMIC CONTEXT ISOLATION & ACCURACY REGRESSION SUITE');
console.log('========================================================================\n');

async function runSuite() {
  // ---------------------------------------------------------------------------
  // TEST 1: The Exact Reported Bug — Injected Bioreactor Candidate in Communication Engineering
  // ---------------------------------------------------------------------------
  await test('Test 1 — Exact bug reproduction: Bioreactor oxygen transfer question and diagram rejected for Communication Engineering', async () => {
    const faultyCandidate = {
      id: 'faulty_comm_bio_001',
      subject: 'Communication Engineering',
      topic: 'Communication Engineering Core Topics',
      concept: 'Oxygen Transfer',
      questionText: 'Explain the mechanism of oxygen mass transfer in an aerobic bioreactor and the role of the volumetric mass transfer coefficient kLa.',
      options: [
        'kLa governs oxygen absorption into culture broth across the gas-liquid interface',
        'kLa determines antenna beamwidth in RF transmission systems',
        'kLa measures carrier frequency offset in QPSK modulation',
        'kLa represents baud rate in asynchronous serial communication'
      ],
      correctIndex: 0,
      format: 'Diagram',
      diagramSvg: '<svg><text>Gas-liquid bioreactor oxygen-transfer schematic</text><path d="M0,0 L10,10"/></svg>',
      diagramCaption: 'Gas-liquid bioreactor oxygen-transfer schematic showing bubble interface',
      hints: [
        'Consider two-film theory of gas-liquid transfer.',
        'Recall volumetric mass transfer coefficient kLa.',
        'Evaluate oxygen driving force (C* - CL).',
        'Identify gas-liquid boundary layer resistance.'
      ],
      explanation: 'In aerobic bioreactors, oxygen transfer across the gas-liquid film is governed by kLa.'
    };

    const validation = ValidateQuestion(faultyCandidate, {
      subjectName: 'Communication Engineering',
      topic: 'Communication Engineering Core Topics'
    });

    assert.strictEqual(validation.valid, false, 'Candidate must be rejected');
    assert.ok(validation.errors.length >= 1, 'Must record specific validation errors');

    // Verify Gate B or Gate H caught the cross-discipline violation
    const hasCrossDisciplineError = validation.errors.some(e =>
      e.toLowerCase().includes('cross-discipline') ||
      e.toLowerCase().includes('bioreactor') ||
      e.toLowerCase().includes('oxygen transfer')
    );
    assert.ok(hasCrossDisciplineError, `Expected cross-discipline error, got: ${validation.errors.join('; ')}`);
  });

  // ---------------------------------------------------------------------------
  // TEST 2: Valid Communication Engineering Item Passes All Quality Gates
  // ---------------------------------------------------------------------------
  await test('Test 2 — Valid Communication Engineering item: QPSK package passes all quality gates without Biotechnology terms', async () => {
    const pkg = GenerateAcademicQuestionPackage({
      subjectName: 'Communication Engineering',
      topic: 'Digital Modulation',
      concept: 'QPSK (Quadrature Phase Shift Keying)',
      questionType: 'mcq',
      difficulty: 'Intermediate'
    });

    assert.strictEqual(pkg.valid, true, 'Valid QPSK package must pass all gates');
    assert.strictEqual(pkg.subject, 'Communication Engineering');
    assert.strictEqual(pkg.options.length, 4);

    const fullText = `${pkg.questionText} ${pkg.options.join(' ')} ${pkg.explanation || ''}`.toLowerCase();

    // Verify presence of modulation concepts
    assert.ok(fullText.includes('phase') || fullText.includes('bit') || fullText.includes('symbol') || fullText.includes('constellation'));

    // Verify ZERO biotechnology contamination
    const forbidden = ['bioreactor', 'oxygen transfer', 'kla', 'fermentation', 'sparged', 'culture broth'];
    for (const term of forbidden) {
      assert.strictEqual(fullText.includes(term), false, `Must NOT contain "${term}"`);
    }
  });

  // ---------------------------------------------------------------------------
  // TEST 3: Valid Biotechnology Item Passes All Quality Gates
  // ---------------------------------------------------------------------------
  await test('Test 3 — Valid Biotechnology item: Oxygen Transfer passes without Communication Engineering terms', async () => {
    const pkg = GenerateAcademicQuestionPackage({
      subjectName: 'Biotechnology',
      topic: 'Bioreactor Design',
      concept: 'Oxygen Transfer',
      questionType: 'mcq',
      difficulty: 'Intermediate'
    });

    assert.strictEqual(pkg.valid, true, 'Valid Oxygen Transfer package must pass all gates');
    assert.strictEqual(pkg.subject, 'Biotechnology');
    assert.strictEqual(pkg.options.length, 4);

    const fullText = `${pkg.questionText} ${pkg.options.join(' ')} ${pkg.explanation || ''}`.toLowerCase();

    // Verify presence of biotech concepts
    assert.ok(fullText.includes('oxygen') || fullText.includes('kla') || fullText.includes('bioreactor') || fullText.includes('mass transfer'));

    // Verify ZERO communication engineering contamination
    const forbidden = ['qpsk', 'constellation', 'carrier frequency', 'antenna', 'bode plot', 'modulation'];
    for (const term of forbidden) {
      assert.strictEqual(fullText.includes(term), false, `Must NOT contain "${term}"`);
    }
  });

  // ---------------------------------------------------------------------------
  // TEST 4: Universal Topic Model Subject/Topic Binding
  // ---------------------------------------------------------------------------
  await test('Test 4 — generateUniversalTopicModel binds subject and topic onto model and all questions', async () => {
    const model = generateUniversalTopicModel('Communication Engineering', 'Communication Engineering', 5);

    assert.strictEqual(model.subject, 'Communication Engineering');
    assert.strictEqual(model.topic, 'Communication Engineering');
    assert.ok(Array.isArray(model.questions) && model.questions.length >= 5);

    for (const q of model.questions) {
      assert.strictEqual(q.subject, 'Communication Engineering', 'Every question must carry subject');
      assert.ok(q.topic, 'Every question must carry topic');
      assert.ok(q.concept, 'Every question must have a concept');
      assert.strictEqual(q.concept.toLowerCase().includes('oxygen transfer'), false, 'Question concept cannot be Oxygen Transfer');
    }
  });

  // ---------------------------------------------------------------------------
  // TEST 5: getTopicKnowledgeMap Guard Against Empty or Short Inputs
  // ---------------------------------------------------------------------------
  await test('Test 5 — getTopicKnowledgeMap with empty or non-matching inputs does not return arbitrary curated maps', async () => {
    const emptyMap = getTopicKnowledgeMap('', '');
    assert.notStrictEqual(emptyMap.topicName, 'Bioreactor Design', 'Empty input must not match Bioreactor Design');

    const customMap = getTopicKnowledgeMap('Robotics', 'Kinematics');
    assert.strictEqual(customMap.topicName, 'Kinematics');
    assert.ok(customMap.concepts.length >= 1);
  });

  // ---------------------------------------------------------------------------
  // TEST 6: Media and Diagram Cross-Discipline Quarantine (Gate H)
  // ---------------------------------------------------------------------------
  await test('Test 6 — Gate H rejects cross-discipline diagrams across all subjects', async () => {
    // 1. Bioreactor diagram attached to Communication Engineering question -> MUST REJECT
    const commWithBioDiagram = {
      subject: 'Communication Engineering',
      topic: 'Digital Modulation',
      concept: 'QPSK',
      questionText: 'What is the phase constellation of QPSK modulation?',
      options: ['Four distinct phase states', 'Two phase states', 'Eight phase states', 'Continuous phase frequency'],
      correctIndex: 0,
      format: 'Diagram',
      diagramSvg: '<svg><text>Gas-liquid bioreactor oxygen mass transfer</text></svg>',
      hints: ['Consider signal constellation.', 'Four quadrant representation.', 'pi/2 separation.', 'Gray mapped bits.'],
      explanation: 'QPSK modulates two bits per symbol using four phases.'
    };
    const valComm = ValidateQuestion(commWithBioDiagram);
    assert.strictEqual(valComm.valid, false, 'Bioreactor diagram on Communication Engineering must be rejected');

    // 2. QPSK diagram attached to Biotechnology question -> MUST REJECT
    const bioWithCommDiagram = {
      subject: 'Biotechnology',
      topic: 'Bioreactor Design',
      concept: 'Oxygen Transfer',
      questionText: 'What is the volumetric mass transfer coefficient kLa?',
      options: ['Gas-liquid oxygen absorption rate coefficient', 'Enzyme saturation limit', 'Substrate uptake rate', 'Impeller tip velocity'],
      correctIndex: 0,
      format: 'Diagram',
      diagramSvg: '<svg><text>QPSK Constellation Diagram in I-Q Plane</text></svg>',
      hints: ['Recall mass transfer equations.', 'Dissolved oxygen driving force.', 'Two film theory.', 'kLa units of 1/s.'],
      explanation: 'kLa measures the rate of oxygen transfer in aerated culture.'
    };
    const valBio = ValidateQuestion(bioWithCommDiagram);
    assert.strictEqual(valBio.valid, false, 'QPSK diagram on Biotechnology must be rejected');
  });

  // ---------------------------------------------------------------------------
  // TEST 7: Multi-Subject Dynamic Accuracy Across Multiple Domains
  // ---------------------------------------------------------------------------
  await test('Test 7 — Multi-subject dynamic generation across Control Systems, Mathematics, CS, and Mechanical Engineering', async () => {
    const domains = [
      { subject: 'Control Systems', topic: 'Bode Plot Stability', expectedKeyword: 'margin' },
      { subject: 'Linear Algebra', topic: 'Eigenvalues and Eigenvectors', expectedKeyword: 'eigenvalue' },
      { subject: 'Computer Science', topic: 'Database Normalization', expectedKeyword: 'normal form' },
      { subject: 'Mechanical Engineering', topic: 'Shaft Design', expectedKeyword: 'shaft' }
    ];

    for (const d of domains) {
      const pkg = GenerateAcademicQuestionPackage({
        subjectName: d.subject,
        topic: d.topic,
        questionType: 'mcq',
        difficulty: 'Intermediate'
      });

      assert.strictEqual(pkg.valid, true, `Package for ${d.subject} -> ${d.topic} must be valid`);
      assert.ok(pkg.subject.toLowerCase().includes(d.subject.toLowerCase().split(' ')[0]), `Subject match: ${pkg.subject}`);
      assert.ok(pkg.topic.toLowerCase().includes(d.topic.toLowerCase().split(' ')[0]), `Topic match: ${pkg.topic}`);
      assert.strictEqual(pkg.options.length, 4);

      const fullText = `${pkg.questionText} ${pkg.options.join(' ')}`.toLowerCase();
      assert.ok(
        fullText.includes(d.expectedKeyword) || fullText.includes(d.topic.toLowerCase().split(' ')[0]),
        `Must assess ${d.topic} domain content: ${fullText}`
      );
    }
  });

  // ---------------------------------------------------------------------------
  // TEST 8: Two-Student Adaptive Differentiation Strictly Topic-Locked
  // ---------------------------------------------------------------------------
  await test('Test 8 — Adaptive progression targets student-specific weaknesses while strictly locking topic', async () => {
    const student1 = `std_comm_1_${Date.now()}`;
    const student2 = `std_comm_2_${Date.now()}`;
    const subject = 'Communication Engineering';
    const topic = 'Digital Modulation';
    const availableConcepts = [
      'QPSK (Quadrature Phase Shift Keying)',
      'GMSK (Gaussian Minimum Shift Keying)',
      '16-QAM Constellation and Noise Margin'
    ];

    // Student 1 demonstrates weakness in GMSK
    adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId: student1,
      subject,
      topic,
      question: { id: 'q_c1', concept: 'QPSK (Quadrature Phase Shift Keying)', format: 'Theory' },
      studentAnswer: 'Option A',
      isCorrect: true,
      hintsUsed: 0,
      responseTimeSeconds: 25
    });
    adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId: student1,
      subject,
      topic,
      question: { id: 'q_c2', concept: 'GMSK (Gaussian Minimum Shift Keying)', format: 'Theory' },
      studentAnswer: 'Option B',
      isCorrect: false,
      hintsUsed: 2,
      responseTimeSeconds: 40
    });

    // Student 2 demonstrates weakness in 16-QAM
    adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId: student2,
      subject,
      topic,
      question: { id: 'q_c3', concept: 'GMSK (Gaussian Minimum Shift Keying)', format: 'Theory' },
      studentAnswer: 'Option C',
      isCorrect: true,
      hintsUsed: 0,
      responseTimeSeconds: 22
    });
    adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId: student2,
      subject,
      topic,
      question: { id: 'q_c4', concept: '16-QAM Constellation and Noise Margin', format: 'Numerical' },
      studentAnswer: 'Option D',
      isCorrect: false,
      hintsUsed: 2,
      responseTimeSeconds: 45
    });

    const next1 = adaptiveStudentIntelligence.selectNextConcept({
      studentId: student1,
      subject,
      topic,
      availableConcepts
    });

    const next2 = adaptiveStudentIntelligence.selectNextConcept({
      studentId: student2,
      subject,
      topic,
      availableConcepts
    });

    assert.strictEqual(next1.assignedTopic, 'Digital Modulation');
    assert.strictEqual(next1.topicLocked, true);
    assert.strictEqual(next1.concept, 'GMSK (Gaussian Minimum Shift Keying)');

    assert.strictEqual(next2.assignedTopic, 'Digital Modulation');
    assert.strictEqual(next2.topicLocked, true);
    assert.strictEqual(next2.concept, '16-QAM Constellation and Noise Margin');

    assert.notStrictEqual(next1.concept, next2.concept, 'Both students receive differentiated questions');
  });
}

runSuite()
  .then(() => {
    console.log('\n========================================================================');
    console.log(`  ALL ${totalTests} CRITICAL ACADEMIC ISOLATION TESTS PASSED (100% SUCCESS)`);
    console.log('========================================================================\n');
    process.exit(0);
  })
  .catch(err => {
    console.error('\nSUITE FAILED:', err);
    process.exit(1);
  });
