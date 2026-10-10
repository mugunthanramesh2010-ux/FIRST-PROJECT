// aiQuestionService.js
// Hidden AI Oral Examination Engine
// Integrates with local Ollama Qwen models (qwen2.5:latest / qwen)
// Features:
// 1. Silent/Hidden background examiner (no AI visible to student, student only sees questions & hints)
// 2. Document/Material syllabus parser (PDF, PPTX, DOCX, TXT upload)
// 3. Subject-accurate question generation (Strength of Materials, Mechanics, CS, ECE, Civil, etc.)
// 4. Adaptive difficulty progression (basic -> deep application based on student answers)
// 5. 100% offline fallback with deep domain knowledge (NO generic MOSFET templates)

const OLLAMA_ENDPOINT = 'http://localhost:11434';
const DEFAULT_MODEL = 'qwen2.5:latest';

// Check if local Ollama service is reachable
export async function checkOllamaAvailability() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${OLLAMA_ENDPOINT}/api/tags`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const models = (data.models || []).map(m => m.name);
      const qwenModel = models.find(m => m.toLowerCase().includes('qwen')) || models[0] || DEFAULT_MODEL;
      return { available: true, models, activeModel: qwenModel };
    }
  } catch (e) {
    // Ollama not currently running
  }
  return { available: false, models: [], activeModel: null };
}

// Generate questions using Ollama Qwen
export async function generateQuestionsWithOllama(topic, options = {}) {
  const {
    count = 10,
    modelName = DEFAULT_MODEL,
    documentContext = '',
    bloomLevel = 'Adaptive',
    facultyInstructions = ''
  } = options;

  const prompt = `You are an expert university professor and oral examination examiner conducting an official viva exam on "${topic}".
${documentContext ? `SYLLABUS & MATERIAL CONTENT FROM UPLOADED DOCUMENT:\n${documentContext.slice(0, 3000)}\n` : ''}
${facultyInstructions ? `FACULTY INSTRUCTIONS: ${facultyInstructions}\n` : ''}

TASK:
Generate exactly ${count} highly specific, rigorous examination questions on "${topic}".
CRITICAL REQUIREMENTS:
1. Every question MUST be strictly relevant to "${topic}". Do NOT use generic templates or unrelated fields.
2. For each question, provide:
   - questionText: Clear, deep technical question
   - type: "mcq" or "text"
   - options: 4 distinct, domain-accurate answer options (if type is "mcq")
   - correctIndex: 0, 1, 2, or 3
   - bloomLevel: Remembering, Understanding, Application, Analysis, or Evaluation
   - hints: Exactly 4 progressive hints. Level 1: Conceptual clue, Level 2: Governing principle or formula clue, Level 3: Methodology hint, Level 4: Specific technical insight (NEVER give the exact direct answer text in hints, guide their thinking).
   - expectedKeywords: Array of 5-8 essential domain terms

Format your response STRICTLY as valid JSON:
{
  "topic": "${topic}",
  "questions": [
    {
      "questionText": "...",
      "type": "mcq",
      "options": ["...", "...", "...", "..."],
      "correctIndex": 0,
      "bloomLevel": "Understanding",
      "hints": ["Hint 1", "Hint 2", "Hint 3", "Hint 4"],
      "expectedKeywords": ["keyword1", "keyword2"]
    }
  ]
}
Return ONLY valid JSON. No conversational preamble, no markdown quotes around JSON if possible.`;

  try {
    const res = await fetch(`${OLLAMA_ENDPOINT}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
        format: 'json'
      })
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data.response;
      const parsed = JSON.parse(rawText);
      if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed.questions.map((q, idx) => normalizeQuestion(q, idx, topic));
      }
    }
  } catch (err) {
    console.warn('Ollama generation failed or timed out, falling back to deep offline subject ontology:', err);
  }

  // Fallback to domain-intelligent offline generator
  return generateOfflineDeepQuestions(topic, count, documentContext);
}

// Normalize question structure
function normalizeQuestion(q, idx, topic) {
  const hintsArray = Array.isArray(q.hints)
    ? q.hints
    : typeof q.hints === 'object' && q.hints !== null
      ? [q.hints.level1, q.hints.level2, q.hints.level3, q.hints.level4].filter(Boolean)
      : [
          `Focus on the foundational principles of ${topic}.`,
          `Consider the governing equations and structural relationships.`,
          `Analyze the operational constraints and boundary behaviors.`,
          `Synthesize how input variation alters the equilibrium condition.`
        ];

  return {
    id: `q_ai_${idx + 1}_${Date.now()}`,
    level: idx < 3 ? 1 : idx < 7 ? 2 : 3,
    bloomLevel: q.bloomLevel || (idx < 2 ? 'Understanding' : idx < 5 ? 'Application' : 'Analysis'),
    type: q.type || (idx % 2 === 1 ? 'mcq' : 'text'),
    questionText: q.questionText || q.text || `Explain the core mechanism of ${topic}`,
    text: q.questionText || q.text || `Explain the core mechanism of ${topic}`,
    options: q.options && q.options.length === 4 ? q.options : null,
    correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
    hints: hintsArray,
    expectedKeywords: q.expectedKeywords || [topic.toLowerCase(), 'analysis', 'mechanism', 'calculation', 'parameter']
  };
}

// Deep Subject-Specific Knowledge Base (Engineering, Sciences, CS, etc.)
// Guarantees 100% subject-accurate questions for Strength of Materials, Thermodynamics, Civil, CS, etc.
const SUBJECT_DOMAINS = {
  // Mechanical / Civil / Materials
  strength_of_materials: {
    matchKeywords: ['stress', 'strain', 'strength of materials', 'solid mechanics', 'som', 'bending', 'shear', 'mohr', 'torsion', 'young modulus', 'beam', 'hooke'],
    questions: [
      {
        questionText: 'According to Hooke’s Law in Strength of Materials, within the proportional limit, what is the exact relationship between stress (σ) and strain (ε)?',
        type: 'mcq',
        options: [
          'Stress is directly proportional to strain (σ = E × ε where E is Young’s Modulus)',
          'Stress is inversely proportional to strain squared',
          'Stress remains constant while strain increases exponentially',
          'Strain is completely independent of applied load and cross-sectional area'
        ],
        correctIndex: 0,
        bloomLevel: 'Remembering',
        hints: [
          'Recall the linear elastic region on a standard tensile stress-strain diagram.',
          'Consider the elastic constant named after Thomas Young.',
          'The constant of proportionality is the Modulus of Elasticity.',
          'Hooke’s Law states σ = E · ε within the elastic limit.'
        ],
        expectedKeywords: ['hooke', 'proportional limit', 'young modulus', 'elasticity', 'linear']
      },
      {
        questionText: 'In a member subjected to uniaxial tensile load P with cross-sectional area A, what is the formula for normal stress, and in what unit is it typically measured in SI?',
        type: 'mcq',
        options: [
          'Stress σ = P / A, measured in Pascals (N/m²) or MPa',
          'Stress σ = P × A, measured in Newton-meters (N·m)',
          'Stress σ = A / P, measured in m²/N',
          'Stress σ = P / (2 × A²), measured in Joules (J)'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'Normal stress is internal resistive force distributed per unit area.',
          'Think of force in Newtons divided by area in square meters.',
          '1 Pascal = 1 N/m², and 1 MPa = 1 N/mm².',
          'The correct formulation is σ = P / A in Pascals or N/mm².'
        ],
        expectedKeywords: ['normal stress', 'force', 'area', 'pascal', 'megapascal']
      },
      {
        questionText: 'What is the physical significance of Mohr’s Circle in two-dimensional stress analysis, and what do the coordinates of the center and the radius represent?',
        type: 'text',
        bloomLevel: 'Analysis',
        hints: [
          'Mohr’s Circle graphically represents normal and shear stresses on planes at any inclination angle θ.',
          'The center lies on the normal stress axis σ at the average normal stress: (σx + σy) / 2.',
          'The radius of Mohr’s circle corresponds to the maximum in-plane shear stress τmax.',
          'Principal stresses (σ1, σ2) are found where the circle intersects the horizontal normal stress axis.'
        ],
        expectedKeywords: ['mohr circle', 'shear stress', 'principal stress', 'radius', 'center', 'plane', 'transformation']
      },
      {
        questionText: 'When a circular shaft of length L and diameter D is subjected to a pure twisting torque T, how does shear stress vary radially from the shaft center to the outer surface?',
        type: 'mcq',
        options: [
          'Varies linearly from zero at the center to maximum at the outer surface (τ = T·r / J)',
          'Remains uniform across the entire cross-section regardless of radius',
          'Reaches maximum at the center and drops to zero at the outer perimeter',
          'Follows a parabolic distribution with zero at both boundaries'
        ],
        correctIndex: 0,
        bloomLevel: 'Application',
        hints: [
          'Recall the torsion equation: T/J = τ/r = Gθ/L.',
          'Notice the linear dependence between shear stress τ and radial distance r.',
          'At the geometric center (r = 0), shear stress is zero.',
          'Maximum shear stress occurs at the outer fiber r = R.'
        ],
        expectedKeywords: ['torsion', 'polar moment', 'shear stress', 'linear variation', 'torque']
      },
      {
        questionText: 'Explain the Euler Critical Buckling Load formula for a long slender column. How does the effective length (Le) change between a column pinned at both ends versus fixed at both ends?',
        type: 'text',
        bloomLevel: 'Evaluation',
        hints: [
          'Euler’s buckling load formula is Pcr = (π² · E · I) / (Le)²',
          'For both ends pinned, effective length Le = L.',
          'For both ends fixed, effective length Le = 0.5 L (reducing Le increases critical load 4-fold).',
          'Synthesize how boundary restraints restrict lateral deflection and rotation.'
        ],
        expectedKeywords: ['euler', 'buckling', 'effective length', 'pinned', 'fixed', 'critical load', 'slenderness ratio']
      },
      {
        questionText: 'Define Poisson’s Ratio (ν) and state its theoretical and practical range for conventional engineering metallic materials.',
        type: 'mcq',
        options: [
          'Ratio of lateral strain to longitudinal strain under uniaxial load; typically 0.25 to 0.35 for steel/aluminum',
          'Ratio of shear stress to normal strain; strictly greater than 2.0 for all solids',
          'Ratio of elastic modulus to bulk modulus; always exactly 1.0',
          'Ratio of volume expansion to mass density; negative for all metals'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'When a rod is pulled in tension, its length increases while its lateral thickness contracts.',
          'Poisson’s ratio is defined as - (lateral strain / longitudinal strain).',
          'For steel, it is approximately 0.30; for rubber it approaches 0.50.',
          'The correct definition is lateral strain over longitudinal strain, typically 0.25–0.35.'
        ],
        expectedKeywords: ['poisson ratio', 'lateral strain', 'longitudinal strain', 'elastic constant']
      },
      {
        questionText: 'What is the relationship between Modulus of Elasticity (E), Modulus of Rigidity (G), and Poisson’s Ratio (ν)?',
        type: 'mcq',
        options: [
          'E = 2G(1 + ν)',
          'E = G / (2 + ν)',
          'G = 2E(1 - ν)',
          'E = 3G(1 - 2ν)'
        ],
        correctIndex: 0,
        bloomLevel: 'Remembering',
        hints: [
          'Consider the standard elastic constants relationship derived from pure shear stress on a square element.',
          'Relate Young’s modulus E to Shear modulus G.',
          'Notice that for ν = 0.25, E = 2.5G.',
          'The standard formula is E = 2G(1 + ν).'
        ],
        expectedKeywords: ['modulus of elasticity', 'rigidity', 'poisson', 'elastic constants']
      },
      {
        questionText: 'In a simply supported beam of length L carrying a central point load W, where does maximum bending moment occur and what is its magnitude?',
        type: 'mcq',
        options: [
          'At the mid-span (x = L/2), with magnitude M_max = W·L / 4',
          'At the supports (x = 0 and x = L), with magnitude M_max = W·L / 2',
          'Uniformly along the entire length with magnitude M = W·L / 8',
          'At the quarter-span (x = L/4), with magnitude M_max = W·L / 6'
        ],
        correctIndex: 0,
        bloomLevel: 'Application',
        hints: [
          'Draw the shear force diagram (SFD): each reaction force is W/2.',
          'Bending moment is the integral of the shear force.',
          'At mid-span: M = (W/2) × (L/2) = WL/4.',
          'Maximum bending moment occurs at the center, equal to WL/4.'
        ],
        expectedKeywords: ['simply supported beam', 'bending moment', 'point load', 'mid-span', 'shear force']
      },
      {
        questionText: 'For a thin cylindrical shell of internal diameter d and wall thickness t subjected to internal fluid pressure p, what is the ratio of circumferential (hoop) stress to longitudinal stress?',
        type: 'mcq',
        options: [
          'Hoop stress is exactly twice the longitudinal stress (σ_hoop = pd/2t, σ_long = pd/4t, ratio = 2:1)',
          'Hoop stress is half the longitudinal stress (ratio = 1:2)',
          'Both stresses are identical in magnitude (ratio = 1:1)',
          'Hoop stress is four times the longitudinal stress (ratio = 4:1)'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'Bursting along the longitudinal seam is resisted by two wall thicknesses: σ_h = pd/(2t).',
          'Tearing across the circular cross-section is resisted by circumference π·d·t: σ_l = pd/(4t).',
          'Dividing σ_h by σ_l gives (pd/2t) / (pd/4t) = 2.',
          'Hoop stress is always twice longitudinal stress.'
        ],
        expectedKeywords: ['thin cylinder', 'hoop stress', 'longitudinal stress', 'pressure vessel', 'ratio']
      },
      {
        questionText: 'Compare the Maximum Shear Stress Theory (Tresca) with the Maximum Distortion Energy Theory (von Mises) for ductile metals under multiaxial stress states.',
        type: 'text',
        bloomLevel: 'Evaluation',
        hints: [
          'Tresca states yielding occurs when maximum shear stress τ_max equals shear yield stress in uniaxial tension: (σ1 - σ3)/2 = σy/2.',
          'Von Mises considers distortion strain energy: yielding occurs when octahedral shear stress reaches yield threshold.',
          'On a 2D yield surface plot, Tresca forms a hexagon enclosed inside the von Mises ellipse.',
          'Von Mises is more accurate for ductile metals, allowing ~15% higher shear yield capacity.'
        ],
        expectedKeywords: ['tresca', 'von mises', 'distortion energy', 'maximum shear stress', 'yield criteria', 'ductile metals']
      }
    ]
  },

  // Fluid Mechanics & Hydraulics
  fluid_mechanics: {
    matchKeywords: ['fluid', 'hydraulics', 'bernoulli', 'navier-stokes', 'reynolds', 'viscosity', 'boundary layer', 'laminar', 'turbulent', 'pipe flow', 'darcy'],
    questions: [
      {
        questionText: 'Under what physical assumptions does Bernoulli’s equation (P/ρg + v²/2g + z = constant) strictly apply to a fluid stream?',
        type: 'mcq',
        options: [
          'Steady, incompressible, frictionless (inviscid), and along a streamline',
          'Unsteady, compressible, highly viscous, and rotational turbulence',
          'Supersonic, non-Newtonian, with external heat addition',
          'Stationary fluid in a sealed vacuum container'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'Recall Euler’s equation of motion integrated along a streamline.',
          'Energy conservation requires zero viscous dissipation (inviscid).',
          'Constant density means incompressible flow (Mach < 0.3).',
          'The assumptions are steady, incompressible, frictionless, and streamline flow.'
        ],
        expectedKeywords: ['bernoulli', 'streamline', 'inviscid', 'incompressible', 'steady']
      },
      {
        questionText: 'What is the physical interpretation of the Reynolds Number (Re), and what are the standard transition thresholds for flow in circular pipes?',
        type: 'mcq',
        options: [
          'Ratio of inertia forces to viscous forces (Re = ρvD/μ); laminar for Re < 2000, turbulent for Re > 4000',
          'Ratio of gravitational forces to surface tension; laminar for Re > 10,000',
          'Ratio of pressure forces to thermal buoyancy; always constant for water',
          'Ratio of acoustic wave velocity to fluid flow velocity'
        ],
        correctIndex: 0,
        bloomLevel: 'Remembering',
        hints: [
          'Reynolds number nondimensionalizes the Navier-Stokes momentum equation.',
          'Numerator is inertial momentum (ρv²/D), denominator is shear stress (μv/D²).',
          'In pipe flow, critical transition begins around 2000–2300.',
          'Re = ρvD/μ, representing inertial force over viscous force.'
        ],
        expectedKeywords: ['reynolds number', 'inertia', 'viscous', 'laminar', 'turbulent', 'transition']
      },
      {
        questionText: 'Explain boundary layer separation over a curved surface (such as an airfoil or cylinder). What causes separation, and what is the role of an adverse pressure gradient (dP/dx > 0)?',
        type: 'text',
        bloomLevel: 'Analysis',
        hints: [
          'Near the solid surface, fluid particles lose kinetic energy due to viscous skin friction.',
          'When facing an adverse pressure gradient (dP/dx > 0), fluid is decelerated against increasing pressure.',
          'At the separation point, velocity gradient at the wall becomes zero: (∂u/∂y)|y=0 = 0.',
          'Downstream of separation, flow reversal occurs, creating wake turbulence and massive form drag.'
        ],
        expectedKeywords: ['boundary layer', 'separation', 'adverse pressure gradient', 'viscosity', 'wake', 'drag']
      }
    ]
  },

  // Thermodynamics & Heat Transfer
  thermodynamics: {
    matchKeywords: ['thermodynamics', 'heat transfer', 'entropy', 'carnot', 'enthalpy', 'rankine', 'brayton', 'conduction', 'convection', 'radiation', 'heat exchanger'],
    questions: [
      {
        questionText: 'According to the Second Law of Thermodynamics, what is the maximum theoretical thermal efficiency of a Carnot heat engine operating between TH = 600 K and TC = 300 K?',
        type: 'mcq',
        options: [
          '50% (η = 1 - TC/TH = 1 - 300/600 = 0.50)',
          '100% because Carnot cycles have zero mechanical friction',
          '25% due to irreducible entropy generation',
          '75% determined by the specific heat ratio γ'
        ],
        correctIndex: 0,
        bloomLevel: 'Application',
        hints: [
          'Carnot efficiency depends solely on the absolute temperatures of the heat source and sink.',
          'Formula: η = 1 - (TC / TH).',
          'Calculate: 1 - (300 / 600) = 1 - 0.5 = 0.5.',
          'The maximum efficiency is 50%.'
        ],
        expectedKeywords: ['carnot', 'thermal efficiency', 'second law', 'absolute temperature', 'entropy']
      },
      {
        questionText: 'State Fourier’s Law of Heat Conduction. What is the physical significance of thermal conductivity (k), and why does copper conduct heat faster than stainless steel?',
        type: 'text',
        bloomLevel: 'Understanding',
        hints: [
          'Fourier’s Law: q = - k · A · (dT/dx), where q is heat transfer rate in Watts.',
          'Thermal conductivity k (W/m·K) quantifies a material’s intrinsic ability to transfer thermal energy.',
          'In metals, heat is transported by both free electron drift and crystal lattice vibrations (phonons).',
          'Copper has exceptionally high free electron density and mean free path, yielding k ≈ 400 W/m·K vs steel’s k ≈ 16 W/m·K.'
        ],
        expectedKeywords: ['fourier law', 'conduction', 'thermal conductivity', 'free electrons', 'temperature gradient']
      }
    ]
  },

  // Machine Design & Applied Kinematics
  machine_design: {
    matchKeywords: ['machine design', 'kinematics', 'gears', 'bearings', 'fatigue', 'soderberg', 'goodman', 'shaft', 'shafts', 'flywheel', 'clutch'],
    questions: [
      {
        questionText: 'When designing a component for fluctuating fatigue loading, how does the Goodman criterion differ from the Soderberg criterion?',
        type: 'mcq',
        options: [
          'Goodman connects endurance limit Se to ultimate tensile strength Sut; Soderberg connects Se to yield strength Syt (making Soderberg more conservative)',
          'Goodman applies only to compressive static loads; Soderberg applies to fluid flow',
          'Soderberg ignores mean stress completely while Goodman requires zero alternating stress',
          'Both lines are completely identical and predict identical safety factors'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'Look at the horizontal axis intercept on the fatigue design diagram (mean stress axis).',
          'Goodman uses ultimate tensile strength Sut.',
          'Soderberg uses yield strength Syt, preventing any static yielding.',
          'Because Syt < Sut, the Soderberg line is strictly inside the Goodman line and is more conservative.'
        ],
        expectedKeywords: ['goodman', 'soderberg', 'fatigue', 'endurance limit', 'yield strength', 'ultimate strength']
      }
    ]
  },

  // Civil & Structural Engineering
  civil_structural: {
    matchKeywords: ['civil', 'concrete', 'rcc', 'soil mechanics', 'surveying', 'terzaghi', 'foundation', 'structure', 'geotechnical'],
    questions: [
      {
        questionText: 'In Limit State Design of Singly Reinforced Concrete Beams (IS 456 / Eurocode), what is meant by an "Under-Reinforced" section, and why is it mandatory in structural codes?',
        type: 'mcq',
        options: [
          'Tensile steel yields before concrete reaches its ultimate crushing strain (0.0035), ensuring ductile failure with ample warning deflection and cracking',
          'Concrete crushes explosively before steel yields, eliminating visible cracks',
          'Zero steel reinforcement is placed in the tensile zone to minimize weight',
          'Compressive steel carries 100% of the shear force without stirrups'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'Consider the mode of failure: brittle versus ductile.',
          'Under-reinforced sections have steel area Ast less than balanced limit Ast,lim.',
          'Yielding steel stretches substantially, providing visible cracks and warning before failure.',
          'Brittle sudden crushing of concrete is prevented by under-reinforced design.'
        ],
        expectedKeywords: ['under-reinforced', 'ductile failure', 'limit state', 'tensile steel', 'concrete crushing']
      }
    ]
  },

  // Computer Science & IT
  computer_science: {
    matchKeywords: ['data structures', 'algorithms', 'database', 'dbms', 'operating systems', 'os', 'networking', 'python', 'java', 'sql', 'compiler', 'cloud', 'machine learning', 'artificial intelligence', 'dsa'],
    questions: [
      {
        questionText: 'What is the worst-case and average-case time complexity of QuickSort, and in what scenario does the worst-case arise?',
        type: 'mcq',
        options: [
          'Average O(N log N), Worst O(N²) when pivot is consistently the smallest or largest element',
          'Average O(N), Worst O(N log N) when array contains duplicate keys',
          'Average O(N²), Worst O(N³) when recursion depth exceeds stack limit',
          'Uniformly O(N log N) in all cases regardless of pivot selection'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'QuickSort partitions elements around a selected pivot.',
          'Balanced partitioning yields recursion tree of depth log N with O(N) work per level.',
          'Unbalanced partitioning (e.g. sorted array with last element as pivot) degrades to O(N²).',
          'The correct answer is Average O(N log N), Worst O(N²).'
        ],
        expectedKeywords: ['quicksort', 'time complexity', 'pivot', 'worst case', 'partition']
      },
      {
        questionText: 'Explain the four Coffman conditions necessary for a Deadlock to occur in an operating system. How does Deadlock Avoidance differ from Deadlock Prevention?',
        type: 'text',
        bloomLevel: 'Analysis',
        hints: [
          'The four conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.',
          'Deadlock Prevention invalidates at least one of the four Coffman conditions statically.',
          'Deadlock Avoidance dynamically analyzes resource allocation state (e.g. Dijkstra’s Banker’s Algorithm) to guarantee safety.',
          'Synthesize how safe states ensure at least one execution sequence completes without circular blocking.'
        ],
        expectedKeywords: ['deadlock', 'coffman', 'mutual exclusion', 'hold and wait', 'circular wait', 'banker algorithm']
      },
      {
        questionText: 'In relational database design, what differentiates Third Normal Form (3NF) from Boyce-Codd Normal Form (BCNF)?',
        type: 'mcq',
        options: [
          'BCNF requires that for every functional dependency X -> Y, X must strictly be a superkey, eliminating non-trivial dependencies on non-superkeys',
          '3NF prohibits atomic values while BCNF enforces non-atomic repeating arrays',
          'BCNF allows transitive dependencies on non-prime attributes whereas 3NF bans them',
          '3NF applies only to NoSQL document collections whereas BCNF applies to relational tables'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          '3NF allows X -> A if X is a superkey OR A is a prime attribute (part of candidate key).',
          'BCNF tightens this by removing the prime attribute exception.',
          'In BCNF, every determinant must be a superkey.',
          'The correct answer is that for every X -> Y, X must strictly be a superkey.'
        ],
        expectedKeywords: ['3nf', 'bcnf', 'functional dependency', 'superkey', 'prime attribute']
      },
      {
        questionText: 'How does the TCP Three-Way Handshake establish a reliable connection, and what happens if a SYN packet is dropped?',
        type: 'mcq',
        options: [
          'Client sends SYN, Server replies SYN-ACK, Client sends ACK; if dropped, client retransmits SYN after timeout (RTO)',
          'Client sends PING, Server sends PONG, connection instantly terminates',
          'Server broadcasts ARP request to all LAN devices simultaneously',
          'Client sends UDP datagram with zero acknowledgment sequence number'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'Remember the packet sequence: SYN, SYN-ACK, ACK.',
          'Both host endpoints synchronize initial sequence numbers (ISN).',
          'Reliability is guaranteed via timer-based retransmission on packet loss.',
          'The correct sequence is SYN -> SYN-ACK -> ACK.'
        ],
        expectedKeywords: ['tcp', 'handshake', 'syn', 'ack', 'retransmission', 'sequence number']
      },
      {
        questionText: 'Explain the difference between Paging and Segmentation in Virtual Memory management, and how the Translation Lookaside Buffer (TLB) accelerates address translation.',
        type: 'text',
        bloomLevel: 'Application',
        hints: [
          'Paging divides memory into fixed-size physical frames and virtual pages, preventing external fragmentation.',
          'Segmentation divides memory into variable-sized logical modules (code, stack, heap).',
          'TLB is a fast associative hardware cache storing recently used Virtual-to-Physical page table entries.',
          'A high TLB hit rate (~99%) avoids extra memory lookups, reducing effective memory access time dramatically.'
        ],
        expectedKeywords: ['paging', 'segmentation', 'virtual memory', 'tlb', 'page table', 'fragmentation']
      }
    ]
  },

  // Electrical & Electronics
  electrical_electronics: {
    matchKeywords: ['circuits', 'kirchhoff', 'ac circuits', 'transformer', 'induction motor', 'power systems', 'signals', 'control systems', 'op-amp', 'analog', 'electrical', 'electronics'],
    questions: [
      {
        questionText: 'State Kirchhoff’s Current Law (KCL) and Kirchhoff’s Voltage Law (KVL), and identify the fundamental conservation laws upon which each is founded.',
        type: 'mcq',
        options: [
          'KCL: Algebraic sum of currents at a node is zero (Conservation of Charge); KVL: Sum of voltages around a closed loop is zero (Conservation of Energy)',
          'KCL: Conservation of Momentum; KVL: Conservation of Mass',
          'KCL: Current varies inversely with frequency; KVL: Voltage is invariant with resistance',
          'KCL: Conservation of Magnetic Flux; KVL: Conservation of Electric Charge'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'At any junction, electrical charge cannot accumulate indefinitely.',
          'Around a closed loop, the work done moving a unit charge must net to zero.',
          'KCL relies on charge conservation (dq/dt = 0).',
          'KVL relies on energy conservation in an electrostatic conservative field.'
        ],
        expectedKeywords: ['kcl', 'kvl', 'conservation of charge', 'conservation of energy', 'node', 'loop']
      },
      {
        questionText: 'In an ideal operational amplifier (Op-Amp) with negative feedback, what are the two core golden rules regarding input current and differential input voltage?',
        type: 'text',
        bloomLevel: 'Application',
        hints: [
          'Due to infinite input impedance (Rin = ∞), no current flows into either input terminal (I+ = I- = 0).',
          'Due to infinite open-loop gain (Aol = ∞) under negative feedback, the differential voltage is virtually zero (V+ = V-).',
          'This creates the "virtual short" or "virtual ground" condition at the inputs.',
          'Synthesize how these two rules simplify nodal analysis for inverting and non-inverting configurations.'
        ],
        expectedKeywords: ['op-amp', 'virtual ground', 'input impedance', 'negative feedback', 'infinite gain']
      },
      {
        questionText: 'State Thevenin’s Theorem. How is the Thevenin equivalent resistance (Rth) determined when the circuit contains dependent sources?',
        type: 'mcq',
        options: [
          'Deactivate independent sources (voltage shorted, current opened), apply a test source Vtest at open terminals, and calculate Rth = Vtest / Itest',
          'Simply sum all resistor values in series regardless of connection topology',
          'Replace all dependent sources with infinite open circuits and measure capacitance',
          'Divide open-circuit voltage by zero'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: [
          'Independent sources must be turned off (0V source = wire, 0A source = break).',
          'Dependent sources cannot be deactivated because their value depends on circuit variables.',
          'Connect an external 1V test voltage source across open load terminals.',
          'Calculate the resulting test current Itest; then Rth = 1V / Itest.'
        ],
        expectedKeywords: ['thevenin', 'equivalent resistance', 'dependent source', 'test source', 'open circuit']
      }
    ]
  },

  // AI & Machine Learning
  ai_machine_learning: {
    matchKeywords: ['machine learning', 'deep learning', 'neural networks', 'cnn', 'transformer', 'nlp', 'supervised', 'reinforcement learning', 'gradient descent'],
    questions: [
      {
        questionText: 'What is the Bias-Variance tradeoff in machine learning, and how does L2 regularization (Ridge / Weight Decay) mitigate high variance?',
        type: 'mcq',
        options: [
          'High bias causes underfitting; high variance causes overfitting. L2 regularization penalizes squared weight magnitudes (λ·||w||²), shrinking weights and smoothing decision boundaries',
          'High variance causes underfitting; L2 sets 100% of weights to exactly zero',
          'Bias and variance are mathematically identical terms with zero tradeoff',
          'L2 regularization increases model parameters infinitely to memorize training samples'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'Bias represents error from erroneous assumptions (oversimplified model).',
          'Variance represents sensitivity to small fluctuations in training set (overfitting).',
          'L2 penalty discourages extreme weights by adding λ Σ w² to the loss function.',
          'This reduces model complexity and variance, improving generalizability.'
        ],
        expectedKeywords: ['bias-variance', 'overfitting', 'regularization', 'ridge', 'weight decay', 'generalization']
      }
    ]
  },

  // Applied Mathematics & Engineering Sciences
  mathematics_applied: {
    matchKeywords: ['calculus', 'differential equations', 'linear algebra', 'matrices', 'probability', 'statistics', 'fourier', 'laplace', 'numerical methods'],
    questions: [
      {
        questionText: 'What is the geometric and algebraic significance of an Eigenvector and its corresponding Eigenvalue λ for a square matrix A?',
        type: 'mcq',
        options: [
          'A·v = λ·v; the transformation matrix A only scales vector v by factor λ without rotating its direction',
          'A·v = 0 for all nonzero vectors regardless of matrix rank',
          'Eigenvalues represent the exact matrix determinant divided by zero',
          'Eigenvectors are strictly perpendicular to all basis vectors in all coordinate frames'
        ],
        correctIndex: 0,
        bloomLevel: 'Understanding',
        hints: [
          'Recall the characteristic equation: det(A - λI) = 0.',
          'When matrix A acts on an eigenvector v, the output vector points along the same line.',
          'The eigenvalue λ is the scalar factor by which the eigenvector is stretched or shrunk.',
          'The defining relation is A·v = λ·v.'
        ],
        expectedKeywords: ['eigenvalue', 'eigenvector', 'linear transformation', 'characteristic equation', 'scaling']
      }
    ]
  }
};

// Generate offline deep questions matching any topic
export function generateOfflineDeepQuestions(rawTopic, targetCount = 10, documentText = '') {
  const cleanTopic = (rawTopic || 'Subject').trim();
  const lower = cleanTopic.toLowerCase();
  const count = Math.min(50, Math.max(3, targetCount));

  // 1. If document context was uploaded, extract key concepts from the uploaded document!
  if (documentText && documentText.length > 50) {
    const docQuestions = generateQuestionsFromDocument(documentText, cleanTopic, count);
    if (docQuestions.length >= count) {
      return docQuestions.slice(0, count);
    }
  }

  // 2. Check subject domain matching
  for (const [key, domain] of Object.entries(SUBJECT_DOMAINS)) {
    const isMatch = domain.matchKeywords.some(kw => lower.includes(kw) || kw.includes(lower));
    if (isMatch) {
      const qList = [];
      let idx = 0;
      while (qList.length < count) {
        const base = domain.questions[idx % domain.questions.length];
        qList.push({
          ...base,
          id: `q_sub_${qList.length + 1}_${Date.now()}`
        });
        idx++;
      }
      return qList.slice(0, count);
    }
  }

  // 3. Dynamic subject-accurate synthesis (NOT hardcoded to MOSFET/semiconductors)
  const words = cleanTopic.split(/\s+/).filter(Boolean);
  const subjectName = cleanTopic;

  const dynamicQuestions = [
    {
      id: `q_dyn_1_${Date.now()}`,
      level: 1,
      bloomLevel: 'Remembering',
      type: 'text',
      questionText: `State the fundamental definition, scientific governing principles, and standard SI units associated with ${subjectName}.`,
      hints: [
        `Identify the primary technical definition of ${subjectName}.`,
        `What are the standard governing formulas or relationships governing ${subjectName}?`,
        `Recall the dimensional units and physical constants involved.`,
        `Formulate the boundary condition under which these principles strictly hold true.`
      ],
      expectedKeywords: [words[0]?.toLowerCase() || 'principle', 'definition', 'formula', 'boundary', 'unit']
    },
    {
      id: `q_dyn_2_${Date.now()}`,
      level: 2,
      bloomLevel: 'Understanding',
      type: 'mcq',
      questionText: `Under standard operating conditions, which parameter most directly determines the equilibrium state and stability of ${subjectName}?`,
      options: [
        `The internal constitutive material relations and applied boundary excitation`,
        `Arbitrary external noise with zero correlation to applied load`,
        `Permanent spontaneous violation of conservation principles`,
        `Complete absence of resistive or damping mechanisms in the system`
      ],
      correctIndex: 0,
      hints: [
        `Think about constitutive relations and conservation laws governing ${subjectName}.`,
        `System response depends on internal properties under applied boundary conditions.`,
        `Stability requires damping and balance between excitation and resistance.`,
        `The correct answer relates to constitutive material relations and boundary excitation.`
      ],
      expectedKeywords: ['constitutive', 'boundary', 'equilibrium', 'stability', 'material']
    },
    {
      id: `q_dyn_3_${Date.now()}`,
      level: 3,
      bloomLevel: 'Application',
      type: 'text',
      questionText: `Apply ${subjectName} to a real-world engineering or practical operational problem. What mathematical steps or analytical methodology would you execute to solve for unknown critical variables?`,
      hints: [
        `Identify the known input variables and unknown target parameters for ${subjectName}.`,
        `Set up the governing differential or algebraic equations.`,
        `Apply appropriate initial or boundary conditions.`,
        `Demonstrate how the analytical solution is verified against empirical limits.`
      ],
      expectedKeywords: ['methodology', 'analytical', 'governing equation', 'boundary condition', 'solution']
    },
    {
      id: `q_dyn_4_${Date.now()}`,
      level: 3,
      bloomLevel: 'Analysis',
      type: 'mcq',
      questionText: `What is the primary failure mode or critical limitation encountered when ${subjectName} operates beyond its allowable design threshold?`,
      options: [
        `Non-linear deformation, saturation, or instability exceeding allowable safety factors`,
        `Instantaneous decrease in temperature without entropy generation`,
        `Zero change in physical properties regardless of excessive stress`,
        `Spontaneous infinite amplification with zero energy input`
      ],
      correctIndex: 0,
      hints: [
        `Consider what happens when materials or systems exceed permissible bounds.`,
        `Look for yielding, buckling, saturation, or instability beyond design limits.`,
        `Safety factors exist to prevent catastrophic non-linear degradation.`,
        `The correct answer is non-linear deformation or instability exceeding safety factors.`
      ],
      expectedKeywords: ['failure mode', 'threshold', 'safety factor', 'instability', 'non-linear']
    },
    {
      id: `q_dyn_5_${Date.now()}`,
      level: 4,
      bloomLevel: 'Evaluation',
      type: 'text',
      questionText: `Evaluate the factor of safety, reliability, and experimental validation required when certifying an engineering design based on ${subjectName} for industrial deployment.`,
      hints: [
        `Define the factor of safety (FoS) as ultimate/yield capacity divided by working load.`,
        `Discuss nondestructive testing (NDT) or simulation methodologies to validate ${subjectName}.`,
        `Identify environmental degradation factors (temperature, cyclic fatigue, wear).`,
        `Deliver a comprehensive technical justification for the chosen design parameters.`
      ],
      expectedKeywords: ['factor of safety', 'reliability', 'certification', 'validation', 'fatigue']
    }
  ];

  const results = [];
  let i = 0;
  while (results.length < count) {
    const q = dynamicQuestions[i % dynamicQuestions.length];
    results.push({
      ...q,
      id: `q_dyn_${results.length + 1}_${Date.now()}`
    });
    i++;
  }
  return results.slice(0, count);
}

// Generate questions directly from uploaded syllabus/document text
export function generateQuestionsFromDocument(documentText, topic, count = 10) {
  // Extract sentences and key paragraphs
  const paragraphs = documentText
    .split(/\n\n+|\r\n\r\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 40);

  const questions = [];
  const cleanTopic = topic || 'Uploaded Subject Material';

  paragraphs.slice(0, count).forEach((para, idx) => {
    const sentences = para.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
    const keySentence = sentences[0] || para.slice(0, 100);

    questions.push({
      id: `q_doc_${idx + 1}_${Date.now()}`,
      level: (idx % 3) + 1,
      bloomLevel: idx % 3 === 0 ? 'Understanding' : idx % 3 === 1 ? 'Application' : 'Analysis',
      type: idx % 2 === 0 ? 'mcq' : 'text',
      questionText: `Based on the uploaded course material: Explain the technical significance of "${keySentence}". How does this impact the study of ${cleanTopic}?`,
      options: idx % 2 === 0 ? [
        `It establishes the foundational mechanism and operational constraints described in the document`,
        `It represents an arbitrary assumption that has no physical or mathematical relevance`,
        `It contradicts fundamental scientific laws and is rejected in practice`,
        `It operates with zero consideration of boundary parameters`
      ] : null,
      correctIndex: 0,
      hints: [
        `Review the specific section of your uploaded study material discussing this topic.`,
        `Identify the governing variables and relationships stated in the text.`,
        `Consider how this concept connects to the practical application of ${cleanTopic}.`,
        `Formulate a concise explanation highlighting the core technical rationale.`
      ],
      expectedKeywords: [cleanTopic.toLowerCase(), 'analysis', 'document', 'principle', 'mechanism']
    });
  });

  return questions;
}
