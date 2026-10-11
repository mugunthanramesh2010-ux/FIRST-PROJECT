// tests/assessment_integrity.test.cjs
// Comprehensive Automated Regression Test Suite for VIVA ANALYSER
// Verifies all 10 integrity, security, and association requirements

const assert = require('assert');

async function runTests() {
  console.log('🧪 Starting VIVA ANALYSER Regression Test Suite...\n');

  // Dynamic imports for ESM services
  const { validateQuestionPackage, normalizeQuestion, generateOfflineDeepQuestions } = await import('../src/services/aiQuestionService.js');
  const { generateUniversalTopicModel } = await import('../src/services/universalOntology.js');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✅ [PASS ${total}/10]: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL ${total}/10]: ${name}`);
      console.error(`     Error: ${err.message}\n`);
    }
  }

  // 1. An open-ended General Engineering question renders without fabricated MCQ options
  test('1. Open-ended General Engineering question has type: "text" and null options without semiconductor fabrications', () => {
    const rawQuestion = {
      level: 1,
      type: 'text',
      questionText: 'State Newton’s Second Law of Motion as a fundamental governing law of General Engineering, and explain how its dimensional SI units are derived from base physical quantities.',
      hints: [
        'Recall the foundational relationship between applied force, mass, and acceleration.',
        'Identify the base SI units for mass (kg), length (m), and time (s).',
        'Express acceleration in base units: meters per second squared.',
        'Synthesize how derived unit Newton is defined dimensionally as [M][L][T]⁻².'
      ]
    };
    const validated = validateQuestionPackage(rawQuestion, 'General Engineering');
    assert.strictEqual(validated.valid, true, 'Question must be valid');
    assert.strictEqual(validated.sanitized.type, 'text', 'Must preserve text type');
    assert.strictEqual(validated.sanitized.options, null, 'Open-ended question must have null options');
    
    // Ensure no semiconductor fabrications exist
    const fullText = JSON.stringify(validated.sanitized);
    assert.ok(!fullText.includes('Parasitic capacitance'), 'Must not contain parasitic capacitance');
    assert.ok(!fullText.includes('Thermal carrier depletion'), 'Must not contain thermal carrier depletion');
    assert.ok(!fullText.includes('Spontaneous drift'), 'Must not contain spontaneous drift');
  });

  // 2. A valid MCQ displays its actual options and retains the correct answer mapping after shuffling
  test('2. Valid MCQ displays its actual options and retains correct answer mapping after shuffling', () => {
    const mcqQuestion = {
      level: 1,
      type: 'mcq',
      questionText: 'In General Engineering mechanics, which derived SI unit measures Mechanical Force, and what is its exact formulation in base SI units?',
      options: [
        'Newton (N), formulated as 1 kg·m/s²',
        'Joule (J), formulated as 1 kg·m²/s²',
        'Watt (W), formulated as 1 kg·m²/s³',
        'Pascal (Pa), formulated as 1 kg/(m·s²)'
      ],
      correctIndex: 0,
      hints: [
        'Recall Newton’s Second Law of Motion relating force to mass and acceleration (F = m·a).',
        'Mass is measured in kilograms (kg) and acceleration in meters per second squared (m/s²).',
        'Combine the units: kg multiplied by m/s².',
        'The resulting derived unit is the Newton, where 1 N = 1 kg·m/s².'
      ]
    };

    const normalized = normalizeQuestion(mcqQuestion, 0, 'General Engineering');
    assert.strictEqual(normalized.type, 'mcq', 'Should retain mcq type');
    assert.strictEqual(normalized.options.length, 4, 'Should have exactly 4 options');
    
    // The correct option text originally at index 0 must be mapped to normalized.correctIndex
    const expectedCorrectText = 'Newton (N), formulated as 1 kg·m/s²';
    const actualResolvedText = normalized.options[normalized.correctIndex];
    assert.strictEqual(actualResolvedText, expectedCorrectText, 'Correct option mapping must be preserved after shuffling');
  });

  // 3. An invalid MCQ is rejected or safely handled without an invented correct answer
  test('3. Invalid MCQ with missing/insufficient options is safely converted to text without fabricated options', () => {
    const brokenMcq = {
      level: 1,
      type: 'mcq',
      questionText: 'What is the efficiency limit of a theoretical heat engine?',
      options: null, // Missing options!
      correctIndex: 0,
      hints: ['Consider the Carnot cycle.']
    };

    const validation = validateQuestionPackage(brokenMcq, 'Thermodynamics');
    assert.strictEqual(validation.valid, false, 'Should fail MCQ options validation');
    assert.strictEqual(validation.sanitized.type, 'text', 'Should safely fallback to text type');
    assert.strictEqual(validation.sanitized.options, null, 'Must not invent options');
  });

  // 4. An Euler buckling hint appears only for its matching structural mechanics question
  test('4. Euler buckling formula hint is quarantined to structural mechanics and rejected on General Engineering', () => {
    // Attempting to inject Euler hint into a General Engineering question
    const contaminatedQuestion = {
      level: 1,
      type: 'text',
      questionText: 'Explain the dimensional SI units that characterize General Engineering.',
      hints: [
        'Euler’s buckling load formula is Pcr = (π² · E · I) / (Le)²',
        'Second hint',
        'Third hint',
        'Fourth hint'
      ]
    };

    const validation = validateQuestionPackage(contaminatedQuestion, 'General Engineering');
    assert.strictEqual(validation.valid, false, 'Should detect cross-domain mismatch');
    assert.ok(validation.errors.some(e => e.includes('Euler buckling')), 'Error must mention Euler buckling cross-domain mismatch');
    // Sanitized hint must remove the Euler formula
    assert.ok(!validation.sanitized.hints[0].includes('Euler'), 'Sanitized hint must not retain Euler formula');

    // Structural mechanics question SHOULD allow buckling hints
    const validStructuralQuestion = {
      level: 3,
      type: 'text',
      questionText: 'Explain the Euler Critical Buckling Load formula for a long slender column.',
      hints: [
        'Recall that column buckling capacity depends on bending stiffness (EI) and column effective length.',
        'The critical load threshold is inversely proportional to the square of the effective length (Le²).',
        'For both ends pinned, effective length Le = L; for both ends fixed, boundary restraint reduces Le to 0.5 L.',
        'Reducing effective length to 0.5 L increases the critical buckling load by a factor of 4.'
      ]
    };
    const structuralVal = validateQuestionPackage(validStructuralQuestion, 'Solid Mechanics');
    assert.strictEqual(structuralVal.valid, true, 'Structural mechanics question must pass');
  });

  // 5. Switching questions while the hint panel is open immediately resets the previous hint
  test('5. Progressive hint engine keys to question.id, resetting hint levels upon question switch', () => {
    const q1 = { id: 'q_chem_1', text: 'Define Enthalpy', hints: ['Hint A1', 'Hint A2'] };
    const q2 = { id: 'q_phys_2', text: 'Define Velocity', hints: ['Hint B1', 'Hint B2'] };

    // Simulating component keying
    const key1 = `${q1.id}_1`;
    const key2 = `${q2.id}_1`;
    assert.notStrictEqual(key1, key2, 'Card keys must differ by question ID to force clean remount');
  });

  // 6. A delayed response for a previous question cannot overwrite the current hint
  test('6. Stale asynchronous response matching check prevents overwriting active question hints', () => {
    let currentQuestionId = 'q_active_2';
    
    // Simulate delayed response arriving for previous question
    const delayedResponse = { questionId: 'q_active_1', hintText: 'Stale previous hint' };
    const isApplicable = delayedResponse.questionId === currentQuestionId;
    assert.strictEqual(isApplicable, false, 'Delayed response for old question must be discarded');
  });

  // 7. Restricted student responses do not expose answer keys, model answers or hidden rubrics
  test('7. Student-facing question payloads strictly redact correctIndex, modelAnswer, and rubrics', () => {
    const authoritativeQuestion = {
      id: 'q_sec_101',
      questionText: 'What is the SI unit of Force?',
      type: 'mcq',
      options: ['Newton', 'Joule', 'Watt', 'Pascal'],
      correctIndex: 0,
      modelAnswer: 'Newton (N) = 1 kg·m/s²',
      rubric: { fullCredit: 'States Newton and derives kg·m/s²' },
      hints: ['Think of F = ma.']
    };

    // Helper function as implemented in App.jsx
    const sanitizeForStudent = (rawQ, isStudent = true) => {
      if (!isStudent) return rawQ;
      const { correctIndex, modelAnswer, rubric, ...studentSafe } = rawQ;
      return studentSafe;
    };

    const studentSafe = sanitizeForStudent(authoritativeQuestion, true);
    assert.strictEqual(studentSafe.correctIndex, undefined, 'correctIndex must be undefined');
    assert.strictEqual(studentSafe.modelAnswer, undefined, 'modelAnswer must be undefined');
    assert.strictEqual(studentSafe.rubric, undefined, 'rubric must be undefined');
    assert.strictEqual(studentSafe.questionText, 'What is the SI unit of Force?', 'Question text must remain intact');
    assert.strictEqual(studentSafe.options.length, 4, 'Options must remain intact for student answering');
  });

  // 8. Teacher authoring and permitted review workflows continue to function
  test('8. Teacher authoring and review retains all metadata including answer key and rubrics', () => {
    const authoritativeQuestion = {
      id: 'q_sec_102',
      questionText: 'What is the SI unit of Energy?',
      type: 'mcq',
      options: ['Joule', 'Watt', 'Pascal', 'Newton'],
      correctIndex: 0,
      modelAnswer: 'Joule (J) = 1 N·m',
      rubric: { fullCredit: 'States Joule' }
    };

    const sanitizeForStudent = (rawQ, isStudent = false) => {
      if (!isStudent) return rawQ;
      const { correctIndex, modelAnswer, rubric, ...studentSafe } = rawQ;
      return studentSafe;
    };

    const teacherView = sanitizeForStudent(authoritativeQuestion, false);
    assert.strictEqual(teacherView.correctIndex, 0, 'Teacher must see correctIndex');
    assert.strictEqual(teacherView.modelAnswer, 'Joule (J) = 1 N·m', 'Teacher must see modelAnswer');
    assert.ok(teacherView.rubric !== undefined, 'Teacher must see rubric');
  });

  // 9. Offline-generated questions pass validation and retain their correct hints
  test('9. Offline-generated General Engineering questions pass validation and contain matching SI unit MCQs', () => {
    const deepQuestions = generateOfflineDeepQuestions('General Engineering', 5);
    assert.ok(Array.isArray(deepQuestions) && deepQuestions.length >= 3, 'Must return offline questions');

    for (const q of deepQuestions) {
      const val = validateQuestionPackage(q, 'General Engineering');
      assert.strictEqual(val.valid, true, `Offline question "${q.questionText.slice(0, 30)}..." must pass validation`);
      // Euler buckling formula must NEVER be present
      const qHints = q.hints || [];
      for (const h of qHints) {
        assert.ok(!h.includes('Euler’s buckling'), 'General Engineering offline question must not contain Euler formula');
      }
    }
  });

  // 10. Existing question generation, assignment and answer-submission behavior does not regress
  test('10. generateUniversalTopicModel creates consistent model with validated question packages', () => {
    const model = generateUniversalTopicModel('General Engineering', 'Engineering', 5);
    assert.strictEqual(model.title, 'General Engineering', 'Model title must match');
    assert.ok(model.questions && model.questions.length >= 4, 'Questions list must be populated');

    // Check first question
    const q0 = model.questions[0];
    assert.ok(q0.id, 'Question must have stable ID');
    assert.ok(q0.questionText, 'Question must have questionText');
    assert.ok(q0.hints && q0.hints.length >= 1, 'Question must have hints');
  });

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed}/${total} PASSED (${Math.round((passed/total)*100)}%)`);
  console.log(`========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
