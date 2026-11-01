// tests/neurophysics_topic_grounding.test.mjs
// Verification Suite: Eliminates Generic Templates & Verifies Neurophysics Grounding

import assert from 'node:assert';
import {
  GenerateAcademicQuestionPackage,
  ValidateQuestion,
  createQuestionGenerationContract,
  resolveAcademicContext
} from '../src/services/academicAssessmentEngine.js';
import {
  autoDetectConcepts,
  generateConceptGroundedQuestions
} from '../src/services/subjectConceptOntology.js';

console.log('========================================================================');
console.log('  NEUROPHYSICS TOPIC-GROUNDED RELEVANCE & TEMPLATE ELIMINATION SUITE   ');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// TEST 1: Exact Bug Reproduction & Elimination for NEUROPHYSICS
// -----------------------------------------------------------------------------
runTest('Test 1 — NEUROPHYSICS must generate authentic cellular electrophysiology questions without generic templates', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Neurophysics',
    topic: 'NEUROPHYSICS',
    questionType: 'mcq'
  });

  assert.strictEqual(pkg.valid, true, 'Package must pass all 10 validation gates');
  assert.strictEqual(pkg.subject, 'Neurophysics');
  assert.strictEqual(pkg.topic, 'Neurophysics');

  // Must NOT contain the reported bug strings
  const bannedBugStrings = [
    'What operational mechanism and governing constraints define the function of',
    'Core Theoretical Foundations, Dynamic Principles, and Governing Invariants',
    'Core Theoretical Foundations',
    'Dynamic Principles, and Governing Invariants',
    'verified operational relationship and governing constraints',
    'secondary transient artifact',
    'inverts the parameter scaling relationship',
    'operates completely detached from the physical dynamics',
    'zero thermodynamic or computational cost'
  ];

  for (const b of bannedBugStrings) {
    assert.ok(!pkg.questionText.includes(b), `Question text must not contain banned string: "${b}"`);
    assert.ok(!pkg.concept.includes(b), `Concept must not contain banned string: "${b}"`);
    if (pkg.options) {
      for (const opt of pkg.options) {
        assert.ok(!opt.includes(b), `Option must not contain banned string: "${b}"`);
      }
    }
  }

  // Must contain authentic neurophysics keywords
  const textAndOptions = (pkg.questionText + ' ' + (pkg.options || []).join(' ')).toLowerCase();
  const hasNeuroKeyword = /resting|membrane|potential|nernst|potassium|sodium|permeability|leak|ion|hodgkin|action potential|axon|cable/i.test(textAndOptions);
  assert.ok(hasNeuroKeyword, 'Question must assess authentic neurophysics concepts');
});

// -----------------------------------------------------------------------------
// TEST 2: Concept Auto-Detection for Neurophysics
// -----------------------------------------------------------------------------
runTest('Test 2 — autoDetectConcepts for Neurophysics must produce domain-specific concepts', () => {
  const detected = autoDetectConcepts('Neurophysics', 'NEUROPHYSICS');
  assert.ok(detected.concepts && detected.concepts.length >= 3, 'Must detect at least 3 concepts');

  // Must not have the generic template concept
  const hasGeneric = detected.concepts.some(c => c.includes('Core Theoretical Foundations') || c.includes('Governing Invariants in NEUROPHYSICS'));
  assert.ok(!hasGeneric, 'Concepts must not contain generic Invariant template string');

  // Must have real neurophysics concepts
  const hasNeuroConcepts = detected.concepts.some(c => /membrane|potential|nernst|hodgkin|cable|synaptic|electrophysiology/i.test(c));
  assert.ok(hasNeuroConcepts, 'Concepts must be neurophysics-grounded');
});

// -----------------------------------------------------------------------------
// TEST 3: Strict Cross-Discipline Isolation: Comm Eng -> Neurophysics
// -----------------------------------------------------------------------------
runTest('Test 3 — Switching from Communication Engineering to Neurophysics must have zero cross-subject contamination', () => {
  // First generate Comm Eng
  const commPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Digital Modulation',
    questionType: 'mcq'
  });
  assert.strictEqual(commPkg.subject, 'Communication Engineering');
  assert.ok(!commPkg.questionText.toLowerCase().includes('membrane'), 'Comm Eng question must not have neuro content');
  assert.ok(!commPkg.questionText.toLowerCase().includes('bioreactor'), 'Comm Eng question must not have bioreactor content');

  // Now generate Neurophysics
  const neuroPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Neurophysics',
    topic: 'Neurophysics',
    questionType: 'mcq'
  });
  assert.strictEqual(neuroPkg.subject, 'Neurophysics');
  const neuroText = (neuroPkg.questionText + ' ' + (neuroPkg.options || []).join(' ')).toLowerCase();
  assert.ok(!neuroText.includes('qpsk') && !neuroText.includes('constellation') && !neuroText.includes('carrier modulation'),
    'Neurophysics question must not contain Communication Engineering concepts');
  assert.ok(!neuroText.includes('bioreactor') && !neuroText.includes('oxygen transfer') && !neuroText.includes('kla'),
    'Neurophysics question must not contain Biotechnology concepts');
});

// -----------------------------------------------------------------------------
// TEST 4: Batch Question Progression for Neurophysics
// -----------------------------------------------------------------------------
runTest('Test 4 — Multi-question assessment package for Neurophysics must cover multiple distinct biophysical concepts', () => {
  const batch = GenerateAcademicQuestionPackage({
    subjectName: 'Neurophysics',
    topic: 'Neurophysics',
    count: 3,
    questionType: 'mixed'
  });

  assert.strictEqual(batch.count, 3, 'Batch should generate 3 questions');
  assert.strictEqual(batch.questions.length, 3, 'Must contain 3 questions');

  // Verify all questions are valid and have distinct IDs
  const ids = new Set();
  for (const q of batch.questions) {
    assert.strictEqual(q.valid, true, `Question ${q.id} must be valid`);
    assert.strictEqual(q.subject, 'Neurophysics');
    ids.add(q.id);
  }
  assert.strictEqual(ids.size, 3, 'All 3 questions must have unique IDs');
});

// -----------------------------------------------------------------------------
// TEST 5: Arbitrary Domain Grounding Without Banned Templates
// -----------------------------------------------------------------------------
runTest('Test 5 — Arbitrary custom topic must generate clean questions without banned templates', () => {
  const customPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Applied Physics',
    topic: 'Superconductivity and Flux Quantization',
    questionType: 'mcq'
  });

  assert.strictEqual(customPkg.valid, true, 'Custom topic package must be valid');
  assert.ok(!customPkg.questionText.includes('What operational mechanism and governing constraints define the function of'),
    'Custom topic must not use banned question template');
  assert.ok(!customPkg.questionText.includes('Core Theoretical Foundations, Dynamic Principles, and Governing Invariants'),
    'Custom topic must not use banned concept template');
});

console.log('\n------------------------------------------------------------------------');
console.log(`  RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('------------------------------------------------------------------------\n');

if (failCount > 0) {
  process.exit(1);
}
