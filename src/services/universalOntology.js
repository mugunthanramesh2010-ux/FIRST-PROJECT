// Universal Domain & Subject Ontology Engine
import { generateOfflineDeepQuestions, generateQuestionsWithAI, validateQuestionPackage } from './aiQuestionService.js';


export const DOMAIN_CATEGORIES = [
  {
    id: 'engineering',
    name: 'Engineering & Technology',
    icon: 'Cpu',
    branches: [
      'Electronics and Communication Engineering (ECE)',
      'Electrical and Electronics Engineering (EEE)',
      'Electrical Engineering',
      'Computer Science Engineering (CSE)',
      'Information Technology (IT)',
      'Artificial Intelligence',
      'Artificial Intelligence and Machine Learning',
      'Machine Learning',
      'Deep Learning',
      'Data Science',
      'Cyber Security',
      'Cloud Computing',
      'Internet of Things (IoT)',
      'Embedded Systems',
      'Robotics',
      'Mechatronics',
      'Mechanical Engineering',
      'Civil Engineering',
      'Automobile Engineering',
      'Aerospace Engineering',
      'Aeronautical Engineering',
      'Avionics',
      'Marine Engineering',
      'Petroleum Engineering',
      'Mining Engineering',
      'Metallurgical Engineering',
      'Chemical Engineering',
      'Industrial Engineering',
      'Production Engineering',
      'Manufacturing Engineering',
      'Instrumentation Engineering',
      'Agricultural Engineering',
      'Environmental Engineering',
      'Biomedical Engineering',
      'Biotechnology Engineering',
      'Nanotechnology',
      'Quantum Computing',
      'AR/VR',
      'Game Development',
      'Software Engineering'
    ]
  },
  {
    id: 'science',
    name: 'Science & Mathematics',
    icon: 'Atom',
    branches: [
      'Physics',
      'Chemistry',
      'Mathematics',
      'Statistics',
      'Biology',
      'Botany',
      'Zoology',
      'Biotechnology',
      'Microbiology',
      'Genetics',
      'Biochemistry',
      'Environmental Science',
      'Earth Science',
      'Geology',
      'Astronomy',
      'Astrophysics',
      'Oceanography'
    ]
  },
  {
    id: 'medical',
    name: 'Medical & Healthcare',
    icon: 'HeartPulse',
    branches: [
      'Medicine',
      'Anatomy',
      'Physiology',
      'Pathology',
      'Pharmacology',
      'Nursing',
      'Dentistry',
      'Physiotherapy',
      'Psychology',
      'Psychiatry',
      'Public Health',
      'Nutrition',
      'Healthcare Management',
      'Medical Laboratory Technology',
      'Radiology',
      'Medical Imaging'
    ]
  },
  {
    id: 'commerce',
    name: 'Commerce & Business',
    icon: 'TrendingUp',
    branches: [
      'Commerce',
      'Accounting',
      'Financial Accounting',
      'Cost Accounting',
      'Taxation',
      'Economics',
      'Banking',
      'Finance',
      'Investment',
      'Insurance',
      'Auditing',
      'Business Administration',
      'Marketing',
      'Human Resources',
      'Entrepreneurship',
      'Supply Chain Management',
      'Operations Management'
    ]
  },
  {
    id: 'humanities',
    name: 'Humanities & Social Sciences',
    icon: 'BookOpen',
    branches: [
      'History',
      'Geography',
      'Political Science',
      'Sociology',
      'Anthropology',
      'Philosophy',
      'Psychology',
      'Public Administration',
      'International Relations',
      'Social Work',
      'Ethics'
    ]
  },
  {
    id: 'law',
    name: 'Law & Jurisprudence',
    icon: 'Scale',
    branches: [
      'Constitutional Law',
      'Criminal Law',
      'Civil Law',
      'Corporate Law',
      'Intellectual Property Law',
      'Cyber Law',
      'Environmental Law',
      'International Law',
      'Legal Studies'
    ]
  },
  {
    id: 'languages',
    name: 'Language & Literature',
    icon: 'Languages',
    branches: [
      'English',
      'Tamil',
      'Hindi',
      'Sanskrit',
      'French',
      'German',
      'Japanese',
      'Chinese',
      'Spanish',
      'Arabic',
      'Linguistics',
      'Literature',
      'Grammar',
      'Communication Skills'
    ]
  },
  {
    id: 'education',
    name: 'Education & Pedagogy',
    icon: 'GraduationCap',
    branches: [
      'Teaching Methodology',
      'Curriculum Design',
      'Educational Psychology',
      'Assessment Methods',
      'Learning Sciences'
    ]
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Food Processing',
    icon: 'Sprout',
    branches: [
      'Agronomy',
      'Horticulture',
      'Soil Science',
      'Agricultural Economics',
      'Agricultural Technology',
      'Food Processing',
      'Dairy Technology'
    ]
  },
  {
    id: 'design',
    name: 'Design & Creative Fields',
    icon: 'Palette',
    branches: [
      'Graphic Design',
      'UI/UX Design',
      'Product Design',
      'Industrial Design',
      'Animation',
      'Film Studies',
      'Photography',
      'Multimedia',
      'Visual Communication'
    ]
  },
  {
    id: 'skills',
    name: 'Skill Development & Aptitude',
    icon: 'CheckSquare',
    branches: [
      'Programming',
      'Coding',
      'Problem Solving',
      'Aptitude',
      'Logical Reasoning',
      'Communication',
      'Leadership',
      'Project Management',
      'Team Management',
      'Innovation',
      'Research Methodology'
    ]
  },
  {
    id: 'competitive',
    name: 'Competitive Exams',
    icon: 'Award',
    branches: [
      'UPSC',
      'TNPSC',
      'SSC',
      'Banking Exams',
      'Railway Exams',
      'GATE',
      'CAT',
      'GRE',
      'TOEFL',
      'IELTS',
      'JEE',
      'NEET',
      'Defence Exams',
      'University Entrance Exams'
    ]
  },
  {
    id: 'research',
    name: 'Research & Higher Education',
    icon: 'FileSearch',
    branches: [
      'Research Methodology',
      'Scientific Writing',
      'Thesis Development',
      'Journal Analysis',
      'Patent Analysis',
      'Literature Review',
      'Innovation Research',
      'Technology Research'
    ]
  },
  {
    id: 'future',
    name: 'Future & Deep Tech Frontiers',
    icon: 'Sparkles',
    branches: [
      'Artificial General Intelligence',
      'Autonomous Systems',
      'Space Technology',
      'Satellite Technology',
      'Remote Sensing',
      'GIS',
      'Smart Cities',
      'Industry 4.0',
      'Industry 5.0',
      'Digital Twins',
      'Edge AI',
      'Quantum Technologies'
    ]
  }
];

// Rich Curated Ontologies for Benchmark Topics Requested in Prompt:
// MOSFET, CNN, Transformers, Satellite Communication, Quantum Cryptography, Reinforcement Learning,
// Thermodynamics, Organic Chemistry, Indian Constitution, Financial Derivatives, Human Anatomy,
// Machine Design, Remote Sensing, Embedded AI, Robotics Navigation, Climate Change, Supply Chain Optimization.

const BENCHMARK_TOPICS = {
  mosfet: {
    title: 'MOSFET',
    fullName: 'Metal-Oxide-Semiconductor Field-Effect Transistor',
    domain: 'Electronics and Communication Engineering (ECE)',
    category: 'Solid-State Devices & Power Electronics',
    complexity: 4,
    prerequisites: [
      { id: 'semi', name: 'Semiconductor Physics', level: 'Fundamental', desc: 'Intrinsic/extrinsic silicon, Fermi-Dirac distribution, carrier drift & diffusion.' },
      { id: 'pn', name: 'P-N Junction & Depletion Region', level: 'Intermediate', desc: 'Built-in potential, barrier width, capacitance characteristics.' },
      { id: 'cap', name: 'MOS Capacitor Electrostatics', level: 'Intermediate', desc: 'Accumulation, depletion, and strong inversion thresholds.' }
    ],
    graphNodes: [
      { id: 'semi', label: 'Semiconductor Physics', status: 'mastered', x: 80, y: 180 },
      { id: 'pn', label: 'P-N Junction Barrier', status: 'mastered', x: 220, y: 120 },
      { id: 'mos_cap', label: 'MOS Capacitor Inversion', status: 'active', x: 400, y: 160 },
      { id: 'pinch_off', label: 'Channel Pinch-Off & Saturation', status: 'unvisited', x: 580, y: 110 },
      { id: 'short_channel', label: 'Short-Channel Effects (DIBL)', status: 'unvisited', x: 740, y: 180 },
      { id: 'finfet', label: 'FinFET & GAA Nanosheet', status: 'unvisited', x: 900, y: 140 }
    ],
    graphEdges: [
      { from: 'semi', to: 'pn' },
      { from: 'pn', to: 'mos_cap' },
      { from: 'mos_cap', to: 'pinch_off' },
      { from: 'pinch_off', to: 'short_channel' },
      { from: 'short_channel', to: 'finfet' }
    ],
    questions: [
      {
        id: 'mosfet_q1',
        level: 1,
        evolutionStage: 'Stage 1: Fundamentals (What)',
        type: 'text',
        mode: 'Text',
        text: 'What is a MOSFET? Explain the electrostatics of how a positive gate voltage Vgs above threshold Vth induces an n-channel inversion layer in a p-type substrate.',
        bloomLevel: 'Understanding',
        expectedKeywords: ['threshold voltage', 'gate oxide', 'inversion layer', 'electrons', 'minority carriers', 'depletion', 'capacitance'],
        hints: {
          level1: 'Focus on the dielectric gate oxide and the electric field generated across SiO2.',
          level2: 'Consider what happens to the holes (majority carriers) near the semiconductor surface as gate voltage rises.',
          level3: 'A depletion layer of uncompensated ionized acceptor atoms forms first; when surface potential reaches 2*phi_B, electron density exceeds hole density.',
          level4: 'Analyze band bending at the silicon-oxide interface until the conduction band edge approaches the Fermi level.'
        },
        reasonWhy: 'Stage 1 Fundamental check: Verifies electrostatic inversion mechanics before drain conduction formulas.',
        industryApplication: 'Crucial for gate driver voltage selection in EV battery management & phone chargers.'
      },
      {
        id: 'mosfet_q2',
        level: 2,
        evolutionStage: 'Stage 2: Comparative & Causal (Why)',
        type: 'mcq',
        mode: 'MCQ',
        text: 'Why do modern switching power supplies favor MOSFETs over Bipolar Junction Transistors (BJTs) at high frequencies (>100 kHz)?',
        options: [
          'MOSFETs are majority-carrier voltage-controlled devices with zero minority-carrier storage delay',
          'MOSFETs require higher DC base current to sustain conduction',
          'BJTs have zero thermal runaway risk compared to silicon devices',
          'MOSFETs have lower input impedance that eliminates gate drive requirements'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: {
          level1: 'Contrast minority-carrier recombination in BJTs with majority-carrier drift in MOSFETs.',
          level2: 'What causes turn-off delay in a saturated BJT when base drive is removed?',
          level3: 'Because MOSFETs rely purely on drift of majority carriers, they have no minority carrier storage time, allowing MHz switching.',
          level4: 'Voltage control also means gate draws virtually zero steady-state DC power, dramatically reducing driving circuit dissipation.'
        },
        reasonWhy: 'Stage 2 Comparative reasoning: Evaluates why MOSFET topology displaced bipolar transistors in modern power conversion.',
        industryApplication: 'Directly applied by power supply designers for smartphone chargers and server power shelves.'
      },
      {
        id: 'mosfet_q3',
        level: 3,
        evolutionStage: 'Stage 3: Engineering Design & Case Study',
        type: 'mixed',
        mode: 'Case Study',
        text: 'Case Study: A 400V Electric Vehicle traction inverter experiences destructive voltage ringing and excessive switching losses during rapid turn-off (dV/dt > 50 V/ns). How does the parasitic gate-drain Miller capacitance (Cgd) cause this, and what gate driver circuit design remediation would you implement?',
        bloomLevel: 'Application & Synthesis',
        expectedKeywords: ['miller plateau', 'cgd', 'dv/dt', 'ringing', 'gate resistance', 'snubber', 'parasitic inductance', 'cross-conduction'],
        hints: {
          level1: 'Analyze the displacement current i = Cgd * (dVds / dt) injected back into the gate terminal.',
          level2: 'If this displacement current flows through gate loop impedance, can it elevate Vgs back above threshold Vth?',
          level3: 'This false turn-on (parasitic re-turn-on) causes severe shoot-through cross-conduction with the complementary switch.',
          level4: 'Remediation involves active Miller clamping, split gate resistors for turn-on/turn-off, or negative gate bias (-4V) during off-state.'
        },
        reasonWhy: 'Stage 3 Practical Design: Tests high-voltage EV powertrain power electronics engineering competency.',
        industryApplication: 'Directly used by automotive silicon carbide (SiC) inverter engineers at Tesla and Lucid.'
      },
      {
        id: 'mosfet_q4',
        level: 4,
        evolutionStage: 'Stage 4: Optimization & Research Frontier',
        type: 'mixed',
        mode: 'Research Paper Mode',
        text: 'Research Inquiry: In sub-3nm Gate-All-Around (GAA) nanosheet architectures, Drain-Induced Barrier Lowering (DIBL) and quantum mechanical carrier confinement dominate. Formulate an optimization methodology to mitigate subthreshold leakage while maintaining I_on/I_off > 10^5.',
        bloomLevel: 'Creation & Evaluation',
        expectedKeywords: ['nanosheet', 'dibl', 'subthreshold swing', 'work function', 'quantum confinement', 'high-k metal gate', 'leakage'],
        hints: {
          level1: 'Consider wrapping the gate material 360 degrees around each individual silicon nanosheet channel.',
          level2: 'How does nanosheet sheet thickness (T_ns < 5nm) suppress capacitive drain-to-channel electric field lines?',
          level3: 'Explore dipole-engineered high-k gate stacks and dual-work-function metal gates to tune threshold voltage without heavy channel doping.',
          level4: 'Analyze how eliminating dopant atoms from the channel suppresses random dopant fluctuation (RDF) noise.'
        },
        reasonWhy: 'Stage 4 Frontier Research: Evaluates cutting-edge semiconductor node research capabilities.',
        industryApplication: 'Standard benchmark for TSMC N2/A16 and Intel 18A process node R&D teams.'
      }
    ],
    innovationChallenge: 'Propose an alternative 2D material (such as MoS2 or Carbon Nanotubes) to replace silicon in the MOSFET channel to circumvent Boltzmann tyranny (Subthreshold Swing < 60 mV/decade).',
    industryReadiness: {
      engineerPerspective: 'Selects optimal R_ds(on) vs Q_g figures-of-merit for 98% efficiency GaN/Si microinverters.',
      researcherPerspective: 'Models quantum transport in 2D transition metal dichalcogenide channels using Non-Equilibrium Green Function (NEGF).',
      startupFounderPerspective: 'Evaluates 8-inch SiC wafer fab CAPEX vs foundry outsourcing for commercial EV charger modules.'
    }
  },

  cnn: {
    title: 'CNN',
    fullName: 'Convolutional Neural Networks',
    domain: 'Computer Science Engineering / AI & ML',
    category: 'Computer Vision & Deep Learning',
    complexity: 4,
    prerequisites: [
      { id: 'linalg', name: 'Linear Algebra & Tensors', level: 'Fundamental', desc: 'Dot products, matrix multiplication, multidimensional tensor operations.' },
      { id: 'grad', name: 'Gradient Descent & Backprop', level: 'Fundamental', desc: 'Chain rule of calculus, loss surfaces, weight update dynamics.' },
      { id: 'mlp', name: 'Multilayer Perceptrons (MLP)', level: 'Intermediate', desc: 'Fully connected feedforward networks, activation functions, vanishing gradients.' }
    ],
    graphNodes: [
      { id: 'linalg', label: 'Linear Algebra & Tensors', status: 'mastered', x: 80, y: 150 },
      { id: 'mlp', label: 'Fully Connected MLP', status: 'mastered', x: 220, y: 220 },
      { id: 'conv_kernel', label: '2D Convolution & Kernels', status: 'active', x: 380, y: 140 },
      { id: 'pooling', label: 'Stride, Padding & Pooling', status: 'unvisited', x: 550, y: 190 },
      { id: 'receptive', label: 'Receptive Field & Translation Invariance', status: 'unvisited', x: 720, y: 130 },
      { id: 'resnet', label: 'Residual Skip Connections', status: 'unvisited', x: 890, y: 200 }
    ],
    graphEdges: [
      { from: 'linalg', to: 'mlp' },
      { from: 'mlp', to: 'conv_kernel' },
      { from: 'conv_kernel', to: 'pooling' },
      { from: 'pooling', to: 'receptive' },
      { from: 'receptive', to: 'resnet' }
    ],
    questions: [
      {
        id: 'cnn_q1',
        level: 1,
        evolutionStage: 'Stage 1: Fundamentals (What)',
        type: 'text',
        mode: 'Text',
        text: 'What is a Convolutional Neural Network (CNN)? Explain the mathematical operation of sliding a 2D filter kernel over an input feature map.',
        bloomLevel: 'Understanding',
        expectedKeywords: ['kernel', 'filter', 'dot product', 'sliding window', 'feature map', 'stride', 'weights', 'bias'],
        hints: {
          level1: 'Think of the kernel as a small matrix of learnable weights (e.g., 3x3).',
          level2: 'At each position, compute the element-wise product of the kernel and local image patch, then sum them together.',
          level3: 'Add a scalar bias term and pass the result through a non-linear activation like ReLU.',
          level4: 'Systematically shift the window by the stride value until the entire 2D spatial grid is covered.'
        },
        reasonWhy: 'Stage 1 Fundamental: Validates discrete 2D spatial cross-correlation mathematics.',
        industryApplication: 'Foundational for edge camera edge-detection and feature extraction.'
      },
      {
        id: 'cnn_q2',
        level: 2,
        evolutionStage: 'Stage 2: Comparative & Causal (Why)',
        type: 'mcq',
        mode: 'MCQ',
        text: 'Why does a CNN exhibit translation invariance and parameter efficiency compared to a fully connected dense neural network for image recognition?',
        options: [
          'Through weight sharing across all spatial locations and localized sparse receptive fields',
          'Because CNNs completely eliminate backpropagation and gradient descent updates',
          'By flattening all 2D pixel coordinates into a 1D vector before performing linear transformations',
          'Because CNN filters only activate on random noise rather than edge patterns'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: {
          level1: 'Does a cat ear at the top-left of an image look different from a cat ear at the bottom-right?',
          level2: 'Because the same filter weights are applied across all pixel patches (parameter sharing), spatial location does not alter feature detection.',
          level3: 'Sparse connectivity also means each neuron only connects to a tiny local window instead of every pixel.',
          level4: 'This drastically reduces trainable parameter count from billions to thousands while maintaining inductive spatial bias.'
        },
        reasonWhy: 'Stage 2 Comparative: Checks mastery of inductive biases and computational complexity.',
        industryApplication: 'Enables real-time inference on mobile devices with limited battery capacity.'
      },
      {
        id: 'cnn_q3',
        level: 3,
        evolutionStage: 'Stage 3: Engineering Design & Case Study',
        type: 'mixed',
        mode: 'Case Study',
        text: 'Case Study: You are architecting a CNN for an autonomous drone camera running on an onboard 5W embedded Jetson chip. Frame rate must exceed 45 FPS with <100MB RAM. How would you redesign standard 3x3 convolutions using Depthwise Separable Convolutions (MobileNet style) to achieve this?',
        bloomLevel: 'Application & Synthesis',
        expectedKeywords: ['depthwise', 'pointwise', 'separable', 'macs', 'flops', 'compression', '1x1 convolution', 'latency'],
        hints: {
          level1: 'Decompose the standard convolution into two separate stages: spatial filtering and channel combining.',
          level2: 'Stage 1: Apply one single 3x3 filter per input channel (Depthwise convolution).',
          level3: 'Stage 2: Apply a 1x1 convolution across all channels (Pointwise convolution) to linearly combine the features.',
          level4: 'Calculate computational reduction: (1/N + 1/K^2), yielding ~8x to 9x reduction in FLOPs for 3x3 filters.'
        },
        reasonWhy: 'Stage 3 Practical Design: Essential for deploying real-world computer vision on edge robotics.',
        industryApplication: 'Standard architecture utilized in DJI drones, autonomous vacuum cleaners, and smart doorbells.'
      },
      {
        id: 'cnn_q4',
        level: 4,
        evolutionStage: 'Stage 4: Optimization & Research Frontier',
        type: 'mixed',
        mode: 'Research Paper Mode',
        text: 'Research Paper Analysis: In deep ResNet architectures, explain how identity skip connections (y = F(x) + x) resolve the vanishing gradient problem in backpropagation from a gradient highway perspective (dE/dx = dE/dy * (dF/dx + 1)).',
        bloomLevel: 'Evaluation & Creation',
        expectedKeywords: ['residual', 'skip connection', 'vanishing gradient', 'gradient highway', 'identity mapping', 'chain rule', 'degradation'],
        hints: {
          level1: 'Examine the derivative of the residual block with respect to input x: d(F(x) + x)/dx = F\'(x) + 1.',
          level2: 'Notice the "+ 1" term in the gradient expression.',
          level3: 'Even if F\'(x) vanishes or approaches zero, the gradient dE/dy is directly propagated back to earlier layers via the +1 identity path.',
          level4: 'This enables networks to train smoothly at depths beyond 1000 layers without degradation.'
        },
        reasonWhy: 'Stage 4 Research Frontier: Deep mathematical insight into modern deep learning optimization theory.',
        industryApplication: 'Backbone for state-of-the-art vision foundations (ConvNeXt, Diffusion U-Nets, ResNet-RS).'
      }
    ],
    innovationChallenge: 'Design a novel hybrid Attention-Convolution block that captures long-range spatial dependencies with linear O(N) complexity instead of quadratic ViT self-attention.',
    industryReadiness: {
      engineerPerspective: 'Profiles INT8 quantization, TensorRT layer fusion, and DMA memory transfers for zero latency.',
      researcherPerspective: 'Investigates inductive biases of CNNs vs isotropic Vision Transformers on low-data regimes.',
      startupFounderPerspective: 'Evaluates AWS EC2 G5 instance inference cloud cost per 10 million API calls.'
    }
  },

  transformers: {
    title: 'Transformers',
    fullName: 'Transformer Attention Architecture',
    domain: 'Computer Science & AI',
    category: 'Natural Language Processing & Generative AI',
    complexity: 5,
    prerequisites: [
      { id: 'seq', name: 'Sequence Models & RNNs', level: 'Fundamental', desc: 'Recurrent hidden states, sequential bottlenecks, vanishing gradients over long horizons.' },
      { id: 'attn', name: 'Attention Mechanism (Bahdanau)', level: 'Intermediate', desc: 'Query-key alignment scores, soft attention weights.' }
    ],
    graphNodes: [
      { id: 'seq', label: 'RNN & Seq2Seq Limits', status: 'mastered', x: 80, y: 160 },
      { id: 'qkv', label: 'Query-Key-Value Projection', status: 'active', x: 260, y: 120 },
      { id: 'scaled_dot', label: 'Scaled Dot-Product Attention', status: 'unvisited', x: 440, y: 180 },
      { id: 'multi_head', label: 'Multi-Head Attention (MHA)', status: 'unvisited', x: 620, y: 130 },
      { id: 'flash_attn', label: 'FlashAttention & KV-Cache', status: 'unvisited', x: 800, y: 190 },
      { id: 'moe', label: 'Mixture of Experts (MoE)', status: 'unvisited', x: 920, y: 140 }
    ],
    graphEdges: [
      { from: 'seq', to: 'qkv' },
      { from: 'qkv', to: 'scaled_dot' },
      { from: 'scaled_dot', to: 'multi_head' },
      { from: 'multi_head', to: 'flash_attn' },
      { from: 'flash_attn', to: 'moe' }
    ],
    questions: [
      {
        id: 'trans_q1',
        level: 1,
        evolutionStage: 'Stage 1: Fundamentals (What)',
        type: 'text',
        mode: 'Text',
        text: 'What is the Transformer architecture? Explain the formula Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V and why the scaling factor sqrt(d_k) is required.',
        bloomLevel: 'Understanding',
        expectedKeywords: ['query', 'key', 'value', 'softmax', 'scaling factor', 'dimension', 'vanishing gradients', 'dot product'],
        hints: {
          level1: 'Recall that for large values of d_k, the dot products grow large in magnitude.',
          level2: 'When inputs to the softmax function are extremely large, what happens to the output distribution and its gradients?',
          level3: 'Softmax pushes outputs toward regions with extremely small gradients (gradient vanishing).',
          level4: 'Dividing by sqrt(d_k) ensures the variance of the dot product remains approximately 1, stabilizing training.'
        },
        reasonWhy: 'Stage 1 Fundamental: Validates attention electrostatics and numerical gradient stability.',
        industryApplication: 'Foundation of modern LLMs (GPT-4, Gemini, Claude, LLaMA).'
      },
      {
        id: 'trans_q2',
        level: 2,
        evolutionStage: 'Stage 2: Comparative & Causal (Why)',
        type: 'mcq',
        mode: 'MCQ',
        text: 'Why do Transformers outperform LSTMs in training speed on large-scale datasets?',
        options: [
          'Because self-attention processes all sequence tokens in parallel without sequential recurrent time steps',
          'Because Transformers do not use matrices or floating-point calculations',
          'Because Transformers require zero positional encodings to understand word order',
          'Because Transformers operate purely on CPU caches without GPU memory requirements'
        ],
        correctIndex: 0,
        bloomLevel: 'Analysis',
        hints: {
          level1: 'Consider how an LSTM processes word t: it must wait until hidden state h_(t-1) is computed.',
          level2: 'This sequential dependency creates an unparallelizable bottleneck during GPU execution.',
          level3: 'Transformers calculate self-attention across the full sequence simultaneously as a parallel matrix multiplication.',
          level4: 'Parallel matrix execution fully utilizes GPU Tensor Cores, enabling training on trillions of tokens.'
        },
        reasonWhy: 'Stage 2 Comparative: Tests understanding of parallel compute economics.',
        industryApplication: 'Allows hyperscalers to scale generative foundation models on clusters of thousands of GPUs.'
      }
    ],
    innovationChallenge: 'Formulate an algorithmic memory mechanism that replaces quadratic O(N^2) KV cache growth during 1-million-token context generation.',
    industryReadiness: {
      engineerPerspective: 'Implements vLLM PagedAttention and FP8 weight quantization for high-concurrency serving.',
      researcherPerspective: 'Investigates State Space Models (Mamba) vs Attention mechanisms on reasoning tasks.',
      startupFounderPerspective: 'Calculates tokens/second/dollar GPU operating cost for enterprise deployment.'
    }
  },

  constitution: {
    title: 'Indian Constitution',
    fullName: 'Indian Constitutional Jurisprudence & Basic Structure',
    domain: 'Law & Governance',
    category: 'Constitutional Law & Civil Rights',
    complexity: 4,
    prerequisites: [
      { id: 'rule_law', name: 'Rule of Law & Montesquieu Separation of Powers', level: 'Fundamental', desc: 'Checks and balances among Legislature, Executive, and Judiciary.' },
      { id: 'preamble', name: 'Constitutional Preamble & Sovereign Philosophy', level: 'Fundamental', desc: 'Justice, Liberty, Equality, Fraternity, Socialist, Secular, Democratic Republic.' }
    ],
    graphNodes: [
      { id: 'preamble', label: 'Preamble & Sovereign Values', status: 'mastered', x: 80, y: 160 },
      { id: 'part3', label: 'Fundamental Rights (Part III)', status: 'mastered', x: 260, y: 120 },
      { id: 'art21', label: 'Article 21 & Due Process', status: 'active', x: 440, y: 180 },
      { id: 'art32', label: 'Writ Jurisdiction (Art 32 & 226)', status: 'unvisited', x: 620, y: 130 },
      { id: 'basic_struct', label: 'Basic Structure Doctrine', status: 'unvisited', x: 800, y: 190 },
      { id: 'judicial_rev', label: 'Judicial Independence & Review', status: 'unvisited', x: 920, y: 140 }
    ],
    graphEdges: [
      { from: 'preamble', to: 'part3' },
      { from: 'part3', to: 'art21' },
      { from: 'art21', to: 'art32' },
      { from: 'art32', to: 'basic_struct' },
      { from: 'basic_struct', to: 'judicial_rev' }
    ],
    questions: [
      {
        id: 'const_q1',
        level: 1,
        evolutionStage: 'Stage 1: Fundamentals (What)',
        type: 'text',
        mode: 'Text',
        text: 'What is the Basic Structure Doctrine in Indian Constitutional Law? Summarize the 1973 Kesavananda Bharati verdict regarding Parliament’s constituent amendment power under Article 368.',
        bloomLevel: 'Understanding',
        expectedKeywords: ['kesavananda bharati', 'article 368', 'basic structure', 'amendment', 'supremacy', 'judicial review', 'fundamental rights'],
        hints: {
          level1: 'Contrast the amending power in Article 368 with the constituent destruction of the Constitution.',
          level2: 'Can Parliament amend every single article of the Constitution, or are there inviolable core features?',
          level3: 'The 13-judge bench held that Parliament has broad power to amend, but cannot alter the basic identity or structural framework.',
          level4: 'Inviolable features include democracy, rule of law, federalism, secularism, and judicial review.'
        },
        reasonWhy: 'Stage 1 Fundamental: Tests foundational jurisprudence of Indian constitutional supremacy.',
        industryApplication: 'Essential for administrative law, public policy analysis, and UPSC civil services.'
      }
    ],
    innovationChallenge: 'Draft a constitutional framework for regulating AI algorithmic automated governance decisions while preserving Article 14 and Article 21 natural justice rights.',
    industryReadiness: {
      engineerPerspective: 'Ensures algorithmic systems comply with digital data protection and constitutional privacy mandates.',
      researcherPerspective: 'Compares comparative constitutional judicial review between India, USA, and South Africa.',
      startupFounderPerspective: 'Navigates regulatory compliance and digital constitutional rights for public tech platforms.'
    }
  }
};

// Universal Dynamic Topic Synthesizer:
// Supports customizable question counts: 5, 10, 20, up to 100 questions on demand!
export function generateUniversalTopicModel(rawTopic, domainHint = 'Universal Domain', targetCount = null, documentText = '') {
  const cleanTopic = (rawTopic || 'Subject').trim();
  const lower = cleanTopic.toLowerCase();

  let model = null;
  // Check if topic matches curated library with strict key matching
  for (const [key, bModel] of Object.entries(BENCHMARK_TOPICS)) {
    if (lower === key || (key.length >= 4 && lower.includes(key))) {
      model = JSON.parse(JSON.stringify(bModel));
      break;
    }
  }

  // Synthesize dynamically if not curated
  if (!model) {
    const words = cleanTopic.split(/\s+/).filter(Boolean);
    const primaryTerm = words.slice(0, 3).join(' ');

    const synthesized = {
      title: cleanTopic,
      fullName: cleanTopic,
      domain: domainHint || 'Universal Cognitive Domain',
      category: 'Universal Dynamic Synthesis',
      complexity: Math.min(5, Math.max(3, Math.ceil(words.length / 2) + 2)),
      prerequisites: [
        {
          id: 'prereq_1',
          name: `Foundational Axioms of ${words[0] || 'Core Subject'}`,
          level: 'Fundamental',
          desc: `Underlying mathematical, empirical, or theoretical tenets required before analyzing ${cleanTopic}.`
        },
        {
          id: 'prereq_2',
          name: `Mechanisms & Boundary Equations of ${primaryTerm}`,
          level: 'Intermediate',
          desc: `Core operational parameters, protocol dynamics, and causal relationships in ${cleanTopic}.`
        },
        {
          id: 'prereq_3',
          name: `Applied Synthesis & Stress Testing of ${cleanTopic}`,
          level: 'Advanced',
          desc: `Empirical edge conditions, trade-offs, and industrial reliability parameters.`
        }
      ],
      graphNodes: [
        { id: 'node_base', label: `Fundamentals of ${words[0] || 'Domain'}`, status: 'mastered', x: 80, y: 160 },
        { id: 'node_arch', label: `Core Architecture of ${primaryTerm}`, status: 'mastered', x: 260, y: 120 },
        { id: 'node_curr', label: `${cleanTopic} Dynamics`, status: 'active', x: 440, y: 180 },
        { id: 'node_inter', label: `Boundary Conditions & Limits`, status: 'unvisited', x: 620, y: 130 },
        { id: 'node_adv', label: `Stress Scaling & Edge Failure`, status: 'unvisited', x: 800, y: 190 },
        { id: 'node_future', label: `Frontier Innovation in ${cleanTopic}`, status: 'unvisited', x: 920, y: 140 }
      ],
      graphEdges: [
        { from: 'node_base', to: 'node_arch' },
        { from: 'node_arch', to: 'node_curr' },
        { from: 'node_curr', to: 'node_inter' },
        { from: 'node_inter', to: 'node_adv' },
        { from: 'node_adv', to: 'node_future' }
      ],
      questions: generateOfflineDeepQuestions(cleanTopic, targetCount || 10, documentText),
      innovationChallenge: `What disruptive paradigm or analytical modification could advance our understanding and application of ${cleanTopic}?`,
      industryReadiness: {
        engineerPerspective: `Focuses on reliability, safety factor, and structural integrity for ${cleanTopic}.`,
        researcherPerspective: `Analyzes mathematical models, governing equations, and novel theoretical approaches for ${cleanTopic}.`,
        startupFounderPerspective: `Identifies real-world industrial deployment, efficiency gains, and operational economics for ${cleanTopic}.`
      }
    };
    model = synthesized;
  }

  // Expand questions to requested count (e.g. 5, 10, 20, up to 100)
  const qCount = targetCount ? Math.min(100, Math.max(1, targetCount)) : Math.max(5, model.questions?.length || 5);
  model.questions = expandQuestionsForTopic(model.questions || [], model.title || cleanTopic, qCount, documentText);

  return model;
}

// Asynchronously generates topic model using Ollama / OpenAI API with fallback
export async function generateUniversalTopicModelAsync(rawTopic, domainCategory = 'Universal Domain', targetCount = 10, documentText = '', aiOptions = {}) {
  const model = generateUniversalTopicModel(rawTopic, domainCategory, targetCount, documentText);
  try {
    const aiQuestions = await generateQuestionsWithAI(rawTopic, {
      count: targetCount,
      documentContext: documentText,
      ...aiOptions
    });
    if (aiQuestions && Array.isArray(aiQuestions) && aiQuestions.length > 0) {
      const validatedList = aiQuestions
        .map(q => {
          const res = validateQuestionPackage(q, rawTopic);
          return res.sanitized;
        })
        .filter(Boolean);
      if (validatedList.length > 0) {
        model.questions = validatedList;
      }
    }
  } catch (err) {
    console.warn('Async AI question generation bypassed, using instant generative model:', err.message);
  }
  return model;
}

// Generates and expands questions up to 100 for any topic across Bloom's Taxonomy
export function expandQuestionsForTopic(baseQuestions = [], topicName = 'Topic', targetCount = 10, documentText = '') {
  const t = topicName || 'Topic';
  const count = Math.min(100, Math.max(1, targetCount || 5));

  // Subject-accurate AI domain generator (100% subject-pure questions, options, hints)
  const deepQuestions = generateOfflineDeepQuestions(t, count, documentText);
  if (deepQuestions && deepQuestions.length > 0) {
    return deepQuestions.slice(0, count);
  }

  return baseQuestions.slice(0, count);

  const templates = [
    {
      level: 1,
      bloomLevel: 'Remembering',
      type: 'text',
      text: (t) => `Define the foundational laws, operational axioms, and boundary conditions governing ${t}. What are the primary mathematical parameters involved?`,
      hints: [
        `State the standard canonical definition of ${t}.`,
        `Identify the physical constants or mathematical symbols used in the equation.`,
        `Recall how the input state relates to the activation threshold.`,
        `Synthesize the exact boundary condition under which the equation holds true.`
      ]
    },
    {
      level: 2,
      bloomLevel: 'Understanding',
      type: 'text',
      text: (t) => `Explain the internal physical or computational mechanism of ${t}. How do transient dynamics transition into steady-state equilibrium?`,
      hints: [
        `Focus on internal energy or data flow dynamics in ${t}.`,
        `Contrast the non-equilibrium start state with steady-state behavior.`,
        `Identify the feedback mechanisms that stabilize the response.`,
        `Detail the relationship between applied excitation and resulting output gradient.`
      ]
    },
    {
      level: 2,
      bloomLevel: 'Understanding',
      type: 'mcq',
      text: (t) => `Under nominal operating conditions, which parameter primary dictates the operational stability of ${t}?`,
      options: [
        `Thermal dissipation gradient and internal feedback damping`,
        `Uncorrelated random thermal noise without baseline bounds`,
        `Complete absence of electrical or algorithmic resistance`,
        `Arbitrary external voltage fluctuations without clamping`
      ],
      correctIndex: 0,
      hints: [
        `Think about stabilization and regulatory damping in ${t}.`,
        `Look for the option addressing thermodynamic or feedback damping.`,
        `Physical and computational systems require controlled feedback damping for stability.`,
        `The correct answer is thermal dissipation gradient and internal feedback damping.`
      ]
    },
    {
      level: 3,
      bloomLevel: 'Application',
      type: 'text',
      text: (t) => `Apply ${t} to an industrial high-throughput scenario. What mitigation techniques prevent bottlenecking when input demand surges by 300%?`,
      hints: [
        `Consider buffer capacity, parallel pipelines, and load distribution in ${t}.`,
        `Identify where saturation or clipping occurs under heavy load.`,
        `Explain how dynamic scaling or negative feedback limits degradation.`,
        `Synthesize a complete industrial surge mitigation protocol.`
      ]
    },
    {
      level: 3,
      bloomLevel: 'Application',
      type: 'text',
      text: (t) => `Calculate or mathematically evaluate how environmental temperature variation (-40°C to +85°C) impacts the operational precision of ${t}.`,
      hints: [
        `Consider thermal coefficient effects on carrier mobility, clock drift, or material properties.`,
        `Does higher temperature accelerate or impede transport dynamics in ${t}?`,
        `Identify standard temperature-compensation topologies used in engineering.`,
        `Formulate the analytical temperature drift coefficient.`
      ]
    },
    {
      level: 4,
      bloomLevel: 'Analysis',
      type: 'text',
      text: (t) => `Perform a comparative trade-off analysis between ${t} and its closest competitor paradigm. Under what specific constraints would you strictly reject ${t}?`,
      hints: [
        `Identify 2 competing technologies or alternative methods to ${t}.`,
        `Compare power consumption, latency, silicon area, or mathematical complexity.`,
        `Identify extreme edge conditions where the alternative paradigm outperforms ${t}.`,
        `Provide an architectural decision matrix with quantitative justification.`
      ]
    },
    {
      level: 4,
      bloomLevel: 'Analysis',
      type: 'text',
      text: (t) => `Analyze the harmonic distortion, noise figure, or algorithmic error propagation when ${t} operates near its critical cutoff frequency/threshold.`,
      hints: [
        `What non-linear phenomena emerge as signal magnitude approaches cutoff in ${t}?`,
        `Discuss intermodulation, phase noise, quantization noise, or numerical instability.`,
        `Explain how higher-order terms in the Taylor series expansion become dominant.`,
        `Propose filtering or linearization feedback to suppress parasitic harmonics.`
      ]
    },
    {
      level: 4,
      bloomLevel: 'Analysis',
      type: 'mcq',
      text: (t) => `What is the dominant failure mode when ${t} is subjected to continuous over-voltage or excessive algorithmic recursion?`,
      options: [
        `Avalanche breakdown / stack overflow due to critical threshold violation`,
        `Spontaneous self-healing without any energy dissipation`,
        `Reversal of entropy without localized heating`,
        `Zero degradation regardless of applied electrical or compute stress`
      ],
      correctIndex: 0,
      hints: [
        `Consider the physical or computational limits of sustained over-stress.`,
        `Look for the option describing breakdown or resource exhaustion.`,
        `Extreme stress causes dielectric rupture, avalanche breakdown, or memory exhaustion.`,
        `The correct answer is avalanche breakdown / stack overflow.`
      ]
    },
    {
      level: 5,
      bloomLevel: 'Evaluation',
      type: 'text',
      text: (t) => `Evaluate the safety, reliability, and Mean Time Between Failures (MTBF) of deploying ${t} in mission-critical aerospace or biomedical hardware.`,
      hints: [
        `Consider single-event upsets (SEU), radiation hardening, or fail-safe modes.`,
        `Evaluate redundancy schemes (e.g. Triple Modular Redundancy - TMR).`,
        `How do you perform accelerated lifecycle testing for ${t}?`,
        `Deliver a formal reliability engineering certification audit.`
      ]
    },
    {
      level: 5,
      bloomLevel: 'Evaluation',
      type: 'text',
      text: (t) => `Critique the theoretical upper bound (e.g. Shannon limit, Carnot efficiency, or Big-O complexity) of ${t}. Why does scaling beyond this limit fail?`,
      hints: [
        `State the asymptotic bound governing ${t}.`,
        `Explain the physical law enforcing this bound.`,
        `Why do conventional hardware/software optimizations hit diminishing returns?`,
        `Formulate the mathematical proof of the asymptotic limit.`
      ]
    },
    {
      level: 5,
      bloomLevel: 'Creation',
      type: 'text',
      text: (t) => `Architect a novel architectural variant of ${t} utilizing sub-3nm nanosheets, quantum tunneling, or neuromorphic spiking dynamics to achieve 10x energy efficiency.`,
      hints: [
        `Select an emerging technological paradigm to integrate with ${t}.`,
        `Explain how this hybrid architecture mathematically bypasses the legacy bottleneck.`,
        `Detail the interface between conventional controllers and the novel structure.`,
        `Provide a full schematic and block diagram explanation.`
      ]
    },
    {
      level: 3,
      bloomLevel: 'Application',
      type: 'text',
      text: (t) => `Develop a practical laboratory calibration procedure for ${t}. What instrumentation and test vectors are strictly mandatory?`,
      hints: [
        `Specify measurement tools (e.g., oscilloscope, logic analyzer, profiling harness).`,
        `Describe zero-point calibration and baseline offset nullification.`,
        `How do you measure signal-to-noise ratio (SNR) or throughput under calibrated load?`,
        `Write the step-by-step standard operating procedure (SOP).`
      ]
    },
    {
      level: 4,
      bloomLevel: 'Analysis',
      type: 'text',
      text: (t) => `Investigate the transient step response of ${t}. Formulate the damping ratio, rise time, and settling time equations.`,
      hints: [
        `Model ${t} as a second-order linear dynamic system.`,
        `Explain the difference between underdamped, critically damped, and overdamped conditions.`,
        `How do parasitic capacitances, inductances, or latency lags influence overshoot?`,
        `Derive the transfer function H(s) in the Laplace s-domain.`
      ]
    },
    {
      level: 4,
      bloomLevel: 'Analysis',
      type: 'text',
      text: (t) => `Analyze parasitic coupling and cross-talk when multiple instances of ${t} are placed in ultra-dense spatial proximity.`,
      hints: [
        `Consider electromagnetic interference (EMI), capacitive coupling, or shared cache thrashing.`,
        `What shielding or guard-ring topologies isolate adjacent channels in ${t}?`,
        `Formulate the cross-talk attenuation formula in decibels (dB).`,
        `Explain layout techniques for high-frequency differential isolation.`
      ]
    },
    {
      level: 5,
      bloomLevel: 'Creation',
      type: 'text',
      text: (t) => `Formulate an autonomous self-healing or adaptive calibration loop for ${t} using real-time Bayesian optimization.`,
      hints: [
        `Describe the telemetry sensor network measuring drift in ${t}.`,
        `Explain how the microcontroller or algorithm calculates error variance.`,
        `What actuator or parameter adjustment corrects the drift in real-time?`,
        `Prove that the adaptive closed-loop system is asymptotically stable (Lyapunov stability).`
      ]
    },
    {
      level: 3,
      bloomLevel: 'Application',
      type: 'text',
      text: (t) => `Explain the packaging, thermal interface material (TIM), and heat-sink sizing calculations required for continuous 100W operation of ${t}.`,
      hints: [
        `Define thermal resistance θJA, θJC, and θCS in °C/Watt.`,
        `Calculate junction temperature Tj given ambient temperature Ta = 50°C.`,
        `Contrast forced-air convection with vapor chamber or liquid cooling for ${t}.`,
        `Synthesize the complete thermal budget verification.`
      ]
    },
    {
      level: 4,
      bloomLevel: 'Analysis',
      type: 'text',
      text: (t) => `Diagnose an intermittent signal glitch observed only under high electromagnetic interference in an embedded system deploying ${t}.`,
      hints: [
        `How do ground bounce and power-rail droop induce false triggering in ${t}?`,
        `Explain decoupling capacitor placement and ferrite bead filtering.`,
        `How do you capture non-repetitive runt pulses on a high-bandwidth digital oscilloscope?`,
        `Synthesize the root-cause diagnosis and hardware redesign protocol.`
      ]
    },
    {
      level: 5,
      bloomLevel: 'Evaluation',
      type: 'text',
      text: (t) => `Conduct a cradle-to-grave lifecycle assessment (LCA) and environmental sustainability analysis of manufacturing and disposing ${t}.`,
      hints: [
        `Evaluate rare earth elements, toxic precursors, or energy-intensive fabrication steps.`,
        `Compare embodied carbon against operational carbon savings over a 10-year lifespan.`,
        `What recycling or material reclamation pathways exist for decommissioned units?`,
        `Deliver the ISO 14040 environmental impact scorecard.`
      ]
    },
    {
      level: 5,
      bloomLevel: 'Creation',
      type: 'text',
      text: (t) => `Synthesize an ultra-low-power zero-standby sleep state for ${t}, enabling sub-microampere leakage with instantaneous microsecond wake-up.`,
      hints: [
        `Consider power gating with high-threshold sleep transistors or non-volatile state retention.`,
        `How do you prevent floating nodes and intermediate voltage states during wake-up?`,
        `Describe the energy-harvesting capacitor reserve powering the wake-up detector.`,
        `Provide the circuit state transition diagram and timing analysis.`
      ]
    },
    {
      level: 4,
      bloomLevel: 'Analysis',
      type: 'text',
      text: (t) => `Examine the cryptographic side-channel vulnerability of ${t}. Can differential power analysis (DPA) or electromagnetic leakage extract secret states?`,
      hints: [
        `How does instantaneous current draw correlate with processing operands in ${t}?`,
        `Explain masking, dual-rail precharge logic, and noise injection countermeasures.`,
        `Describe how physical isolation and Faraday cages defeat electromagnetic sniffing.`,
        `Deliver a formal side-channel security verification report.`
      ]
    },
    {
      level: 3,
      bloomLevel: 'Application',
      type: 'text',
      text: (t) => `Construct a complete automated Hardware-in-the-Loop (HIL) test regression suite for validating firmware releases interfacing with ${t}.`,
      hints: [
        `Describe the real-time simulator emulating edge sensors and load dynamics.`,
        `How do you automate boundary condition injection and fault injection testing?`,
        `Define the continuous integration / continuous deployment (CI/CD) test metrics.`,
        `Provide the test matrix covering 100% of functional requirements.`
      ]
    },
    {
      level: 4,
      bloomLevel: 'Evaluation',
      type: 'text',
      text: (t) => `Analyze the unit economics and bill-of-materials (BOM) cost scaling when ramping production of ${t} from 1,000 units to 10,000,000 units.`,
      hints: [
        `Calculate non-recurring engineering (NRE) tooling amortization vs marginal silicon/material cost.`,
        `How does yield percentage impact wafer cost?`,
        `Identify tier-1 supplier negotiation strategies for volume semiconductor procurement.`,
        `Provide the complete economies-of-scale cost curve.`
      ]
    },
    {
      level: 5,
      bloomLevel: 'Creation',
      type: 'text',
      text: (t) => `Design a fault-tolerant distributed consensus protocol integrating ${t} across a decentralized cluster of 1,000 edge nodes.`,
      hints: [
        `How do you handle asynchronous network partitions and Byzantine node failures?`,
        `Formulate the state replication mechanism with bounded latency.`,
        `Explain how cryptographic proof-of-state verifies integrity without central authority.`,
        `Synthesize the mathematical convergence proof under 33% malicious node presence.`
      ]
    },
    {
      level: 4,
      bloomLevel: 'Analysis',
      type: 'text',
      text: (t) => `Investigate the quantum tunneling, ballistic transport, or nanoscale quantum confinement phenomena emerging in ultra-scaled versions of ${t}.`,
      hints: [
        `What happens when physical dimensions approach the de Broglie wavelength of electrons?`,
        `Explain direct source-to-drain tunneling and subthreshold swing degradation.`,
        `Discuss discrete dopant fluctuations and threshold voltage variability across dies.`,
        `Synthesize novel materials (e.g. 2D MoS2, carbon nanotubes) bypassing silicon limits.`
      ]
    },
    {
      level: 5,
      bloomLevel: 'Creation',
      type: 'text',
      text: (t) => `Grand Architecture Challenge: Synthesize the next-generation specification for ${t} to be deployed in deep-space autonomous probes with a 50-year zero-maintenance lifespan.`,
      hints: [
        `Integrate radiation hardening, self-reconfiguring redundant circuitry, and autonomous diagnostic agents.`,
        `How does the system compensate for cosmic ray bit-flips and material degradation over 50 years?`,
        `Describe the autonomous self-test and graceful degradation protocol.`,
        `Deliver the complete architectural blueprint for the space probe system.`
      ]
    }
  ];

  let tIdx = 0;
  while (questions.length < count) {
    const tmpl = templates[tIdx % templates.length];
    const qNum = questions.length + 1;
    const cycle = Math.floor(tIdx / templates.length);
    let baseText = typeof tmpl.text === 'function' ? tmpl.text(topicName) : (tmpl.text || `Explain core concepts of ${topicName}`);
    if (cycle > 0) {
      const prefixes = [
        `[Advanced Deep Dive #${cycle}]: `,
        `[System Diagnostic Case #${cycle}]: `,
        `[Comparative Architecture Analysis #${cycle}]: `,
        `[Industry Deployment Problem #${cycle}]: `
      ];
      baseText = `${prefixes[cycle % prefixes.length]}${baseText}`;
    }
    
    let qOptions = tmpl.options || null;
    let qCorrectIndex = tmpl.correctIndex ?? null;

    if (qOptions && Array.isArray(qOptions) && qOptions.length >= 2) {
      const origCorrect = typeof qCorrectIndex === 'number' ? qCorrectIndex : 0;
      const indexed = qOptions.map((opt, idx) => ({ text: opt, isCorrect: idx === origCorrect }));
      for (let i = indexed.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
      }
      qOptions = indexed.map(item => item.text);
      qCorrectIndex = indexed.findIndex(item => item.isCorrect);
    }

    questions.push({
      id: `q_dyn_${qNum}_${Date.now()}_${tIdx}`,
      level: tmpl.level,
      questionText: baseText,
      text: baseText,
      bloomLevel: tmpl.bloomLevel,
      type: tmpl.type,
      options: qOptions,
      correctIndex: qCorrectIndex,
      hints: tmpl.hints,
      expectedKeywords: [topicName.toLowerCase(), 'analysis', 'mechanism', 'design', 'optimization', 'stability', 'protocol']
    });
    tIdx++;
  }

  return questions.slice(0, count).map(q => ({
    ...q,
    questionText: q.questionText || q.text || `Explain conceptual principles of ${topicName}`,
    text: q.text || q.questionText,
    hints: Array.isArray(q.hints) 
      ? q.hints 
      : (typeof q.hints === 'object' && q.hints !== null
          ? [q.hints.level1, q.hints.level2, q.hints.level3, q.hints.level4].filter(Boolean)
          : [`Examine core principles of ${topicName}`, `Consider fundamental governing equations`, `Analyze boundary conditions`, `Synthesize causal pathway`])
  }));
}
