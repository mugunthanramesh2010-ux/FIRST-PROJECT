import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Send,
  Cpu,
  TrendingUp,
  BrainCircuit,
  Award,
  Layers,
  Search,
  BookOpen,
  Briefcase,
  AlertTriangle,
  Lightbulb,
  FileText,
  Compass,
  FileCode,
  Volume2,
  VolumeX,
  PlayCircle,
  Info,
  Timer,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { DOMAIN_CATEGORIES, generateUniversalTopicModel, generateUniversalTopicModelAsync } from '../services/universalOntology';
import { BehavioralEngine } from '../services/behavioralEngine';
import { AdaptiveEngine } from '../services/adaptiveEngine';
import QuestionEvolutionModal from './QuestionEvolutionModal';
import {
  saveAssessmentSession,
  updateUserStats,
  getQuizConfig,
  getStudentTimingBaseline,
  saveStudentTimingRecord
} from '../services/db';
import { soundEffects, speakVivaQuestion, stopSpeaking } from '../services/soundEffects';

export default function VivaArena({
  currentUser,
  topicModel,
  onTopicChange,
  adaptiveEngine,
  onOpenReport,
  onNavigateToGraph,
  onOpenDomainBrowser
}) {
  // Assessment Modes: 'Mixed' | 'Text' | 'MCQ'
  const [assessmentMode, setAssessmentMode] = useState('Mixed');
  
  // Perspective Modes: 'engineer' | 'researcher' | 'startup'
  const [industryPerspective, setIndustryPerspective] = useState('engineer');

  // Topic search state
  const [topicInput, setTopicInput] = useState(topicModel?.title || 'MOSFET');
  const [isSearchingTopic, setIsSearchingTopic] = useState(false);

  // Faculty Quiz Configuration & Student Timing Baseline
  const [quizConfig, setQuizConfig] = useState(getQuizConfig());
  const [studentBaseline, setStudentBaseline] = useState(() => 
    getStudentTimingBaseline(currentUser?.regNo || 'GUEST_STUDENT')
  );

  // Dynamic Question Marks Assignment Based on Faculty Total Marks
  const weightedQuestions = adaptiveEngine?.assignQuestionMarks(
    topicModel?.questions || [],
    quizConfig.totalMarks || 100
  ) || [];

  // Active Question State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userTextAnswer, setUserTextAnswer] = useState('');
  const [selectedMcqOption, setSelectedMcqOption] = useState(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [currentTimingAnalysis, setCurrentTimingAnalysis] = useState(null);
  const [currentMarksBreakdown, setCurrentMarksBreakdown] = useState(null);

  // Cumulative Test History for final dossier
  const [sessionQuestionHistory, setSessionQuestionHistory] = useState([]);

  // Timing Analysis Counters
  const [overallSecondsRemaining, setOverallSecondsRemaining] = useState(quizConfig.durationMinutes * 60);
  const [questionSecondsElapsed, setQuestionSecondsElapsed] = useState(0);
  const [deadlineExpiredAlert, setDeadlineExpiredAlert] = useState(false);

  // Text-To-Speech Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Quick Feature Walkthrough Banner
  const [showGuideBanner, setShowGuideBanner] = useState(true);

  // Hints Engine State (Levels 1 to 4)
  const [activeHintLevel, setActiveHintLevel] = useState(0);
  const [hintsList, setHintsList] = useState([]);
  const [activeHintIndex, setActiveHintIndex] = useState(null); // null when hidden, 0..8 when showing single active hint
  
  // Telemetry & Anti-Cheat Scores Panel (OPTIONAL: false by default so not constantly showing)
  const [showTelemetrySidebar, setShowTelemetrySidebar] = useState(false);

  // Curiosity Inquiry State
  const [curiosityInput, setCuriosityInput] = useState('');
  const [curiosityExchange, setCuriosityExchange] = useState(null);

  // Innovation Challenge State
  const [innovationInput, setInnovationInput] = useState('');
  const [innovationResult, setInnovationResult] = useState(null);
  const [showInnovationModal, setShowInnovationModal] = useState(false);
  const [activeChallengeType, setActiveChallengeType] = useState('innovation'); // 'innovation' | 'reasoning' | 'realworld' | 'research' | 'industry'
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);

  // Boredom Alert State
  const [boredomAlert, setBoredomAlert] = useState(null);

  // Behavioral Engine & Live Cadence State
  const behavioralEngineRef = useRef(null);
  const [behaviorMetrics, setBehaviorMetrics] = useState({
    wpm: 0,
    cps: 0,
    authenticityScore: 100,
    humanConfidenceScore: 100,
    suspicionScore: 0,
    tabSwitches: 0,
    pasteAttempts: 0,
    burstsDetected: 0,
    flaggedReasons: []
  });

  // Initialize Behavioral Engine
  useEffect(() => {
    behavioralEngineRef.current = new BehavioralEngine((reason, metrics) => {
      setBehaviorMetrics({ ...metrics });
      soundEffects.playWarning();
      const total = (metrics.tabSwitches || 0) + (metrics.pasteAttempts || 0) + (metrics.copyAttempts || 0);
      if (total >= 3) {
        handleDisqualifyViva();
      }
    });
    behavioralEngineRef.current.startSession();

    const handleBlur = () => {
      if (behavioralEngineRef.current) {
        behavioralEngineRef.current.handleTabSwitch();
        const m = behavioralEngineRef.current.getMetrics();
        setBehaviorMetrics(m);
        soundEffects.playWarning();
        const total = (m.tabSwitches || 0) + (m.pasteAttempts || 0) + (m.copyAttempts || 0);
        if (total >= 3) {
          handleDisqualifyViva();
        }
      }
    };

    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
      stopSpeaking();
    };
  }, []);

  const handleDisqualifyViva = () => {
    soundEffects.playWarning();
    const sessionRecord = {
      id: 'session_' + Date.now(),
      topic: topicModel?.title || 'Viva Assessment',
      domain: topicModel?.domain || 'Engineering',
      studentRegNo: currentUser?.regNo || 'GUEST_STUDENT',
      studentName: currentUser?.fullName || 'Student',
      timestamp: new Date().toISOString(),
      masteryLevel: 'Disqualified (Malpractice)',
      facultyTotalMarks: quizConfig.totalMarks,
      totalEarnedMarks: 0,
      overallScore: 0,
      knowledgeScore: 0,
      reasoningScore: 0,
      retentionScore: 0,
      curiosityIndex: 0,
      innovationIndex: 0,
      authenticityScore: 0,
      humanConfidenceScore: 0,
      tabSwitches: behaviorMetrics.tabSwitches + 1,
      pasteAttempts: behaviorMetrics.pasteAttempts,
      copyAttempts: behaviorMetrics.copyAttempts,
      disqualified: true,
      disqualificationReason: 'Automated Disqualification: 3 focus or clipboard security violations detected.',
      questionTimingHistory: sessionQuestionHistory
    };

    saveAssessmentSession(sessionRecord);
    if (onOpenReport) onOpenReport(sessionRecord);
  };

  // Update Quiz Config & Questions when topic changes
  useEffect(() => {
    const config = getQuizConfig();
    setQuizConfig(config);
    setOverallSecondsRemaining(config.durationMinutes * 60);
    setCurrentQuestionIndex(0);
    setUserTextAnswer('');
    setSelectedMcqOption(null);
    setIsEvaluated(false);
    setEvaluationResult(null);
    setCurrentTimingAnalysis(null);
    setCurrentMarksBreakdown(null);
    setSessionQuestionHistory([]);
    setActiveHintLevel(0);
    setHintsList([]);
    setQuestionSecondsElapsed(0);
    stopSpeaking();
    setIsSpeaking(false);
    setDeadlineExpiredAlert(false);
  }, [topicModel]);

  // Real-Time Countdown Clocks (Overall Deadline & Per-Question Time)
  useEffect(() => {
    const timer = setInterval(() => {
      // Question Time Elapsed
      if (!isEvaluated) {
        setQuestionSecondsElapsed(prev => prev + 1);
      }

      // Overall Quiz Countdown
      setOverallSecondsRemaining(prev => {
        if (prev <= 1 && !deadlineExpiredAlert) {
          clearInterval(timer);
          handleDeadlineExpiry();
          return 0;
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEvaluated, deadlineExpiredAlert]);

  // Auto-submit when overall deadline reaches 0
  const handleDeadlineExpiry = () => {
    setDeadlineExpiredAlert(true);
    soundEffects.playWarning();
    if (!isEvaluated) {
      handleSubmitAnswer(true); // force submit due to timeout
    }
  };

  const activeQuestion = weightedQuestions[currentQuestionIndex] || weightedQuestions[0] || {
    id: 'fallback_1',
    text: 'Explain the core operational boundary conditions of this topic.',
    level: 1,
    assignedMarks: 25,
    evolutionStage: 'Stage 1: Fundamentals (What)',
    type: 'text',
    hints: {
      level1: 'Focus on primary governing equations and stability limits.',
      level2: 'Analyze the transformation between input and output states.',
      level3: 'Identify the primary parasitic or non-ideal constraints.',
      level4: 'Synthesize the exact causal sequence leading to performance optimization.'
    },
    reasonWhy: 'Evaluates baseline physical / computational mechanics.'
  };

  const isMcqView = assessmentMode === 'MCQ' || (assessmentMode === 'Mixed' && activeQuestion.type === 'mcq');

  // Text-To-Speech Read Question Aloud
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakVivaQuestion(activeQuestion.text, () => {
        setIsSpeaking(false);
      });
    }
  };

  // Zero Copy-Paste Event Handlers
  const handleCopyPasteBlock = (e, eventType) => {
    if (behavioralEngineRef.current) {
      behavioralEngineRef.current.handleBlockedEvent(eventType, e);
      setBehaviorMetrics(behavioralEngineRef.current.getMetrics());
      soundEffects.playWarning();
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (['v', 'V', 'c', 'C', 'x', 'X', 'a', 'A', 'Insert'].includes(e.key)) {
        handleCopyPasteBlock(e, e.key.toLowerCase() === 'v' ? 'paste' : 'copy');
        return;
      }
    }
    if (behavioralEngineRef.current) {
      behavioralEngineRef.current.recordKey(e);
      setBehaviorMetrics(behavioralEngineRef.current.getMetrics());
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setUserTextAnswer(val);
    if (behavioralEngineRef.current) {
      behavioralEngineRef.current.onTextChange(val);
      behavioralEngineRef.current.scanForAiMisuse(val);
      setBehaviorMetrics(behavioralEngineRef.current.getMetrics());
    }
  };

  // Quick Demo Auto-Answer for effortless testing on any device
  const handleFillDemoAnswer = () => {
    soundEffects.playClick();
    const keywords = activeQuestion.rubric?.essentialKeywords || [];
    let sample = '';
    if (activeQuestion.rubric?.expectedAnswerSummary) {
      sample = activeQuestion.rubric.expectedAnswerSummary;
    } else if (keywords.length > 0) {
      sample = `The fundamental mechanism operates through ${keywords.join(', ')}. Under specified operating constraints, inversion layer formation and charge carrier transport govern the operational profile while minimizing parasitic loss.`;
    } else {
      sample = `This mechanism is governed by conservation principles, intrinsic physical transport limits, and dynamic boundary feedback loops, ensuring stable throughput under real-world operating conditions.`;
    }
    setUserTextAnswer(sample);
    if (behavioralEngineRef.current) {
      behavioralEngineRef.current.reset();
      const now = Date.now();
      for (let i = 0; i < sample.length; i++) {
        behavioralEngineRef.current.keyEvents.push({
          key: sample[i],
          timestamp: now - (sample.length - i) * 110,
          interval: 95 + (i % 4) * 20
        });
      }
      behavioralEngineRef.current.firstKeyTime = now - sample.length * 110;
      behavioralEngineRef.current.lastInputLength = sample.length;
      behavioralEngineRef.current.recomputeKeystrokeDynamics();
      setBehaviorMetrics(behavioralEngineRef.current.getMetrics());
    }
  };

  const handleClearAnswer = () => {
    soundEffects.playClick();
    setUserTextAnswer('');
    if (behavioralEngineRef.current) {
      behavioralEngineRef.current.reset();
      setBehaviorMetrics(behavioralEngineRef.current.getMetrics());
    }
  };

  const topic = topicModel?.title || 'MOSFET';
  const allHints = [
    { id: 'level1', label: 'Level 1 Hint', text: `Consider the fundamental definition and governing physical boundaries of ${topic}. (Direct answer withheld).` },
    { id: 'level2', label: 'Level 2 Hint', text: `Examine the operational relationship between inputs, internal states, and conductive thresholds.` },
    { id: 'level3', label: 'Level 3 Hint', text: `Recall how carrier density and electrostatics change across equilibrium vs non-equilibrium states.` },
    { id: 'level4', label: 'Level 4 Hint', text: `Synthesize the causal chain: bias application -> band bending -> carrier inversion -> channel conduction.` },
    { id: 'conceptMap', label: 'Concept Map Hint', text: `Node Link: [Gate Oxide Capacitance] ───> [Surface Potential ψs] ───> [Inversion Charge Qi] ───> [Drain Current Id].` },
    { id: 'visual', label: 'Visual Hint', text: `Visualize energy band bending: Conduction band Ec dips below Fermi level Ef at the Si/SiO2 interface, creating a triangular potential well.` },
    { id: 'analogy', label: 'Analogy Hint', text: `Think of a sluice gate in a canal: No water flows until the gate clears the water level (Threshold Voltage Vth), after which flow is proportional to gate opening.` },
    { id: 'realWorld', label: 'Real World Hint', text: `Used in laptop CPU power delivery (VRMs): High switching speeds minimize thermal conduction loss during phase conversions.` },
    { id: 'research', label: 'Research Hint', text: `Key ITRS scaling limit: Subthreshold swing is thermodynamically limited to 60 mV/decade at 300K, motivating Negative Capacitance FETs (NCFETs).` }
  ];

  // Adaptive Multi-Level Hint Unlocker (Shows ONE hint at a time with sequential next/prev navigation)
  const handleRequestSpecificHint = (hintIdentifier) => {
    soundEffects.playHintUnlock();
    let targetIdx = 0;
    if (typeof hintIdentifier === 'number') {
      targetIdx = Math.max(0, Math.min(allHints.length - 1, hintIdentifier));
    } else {
      const foundIdx = allHints.findIndex(h => h.id === hintIdentifier);
      targetIdx = foundIdx >= 0 ? foundIdx : 0;
    }

    setActiveHintIndex(targetIdx);

    const target = allHints[targetIdx];
    if (!hintsList.some(h => h.id === target.id)) {
      setHintsList(prev => [...prev, target]);
    }

    if (adaptiveEngine) {
      adaptiveEngine.hintsUsedInCurrentQuestion = (adaptiveEngine.hintsUsedInCurrentQuestion || 0) + 1;
    }
  };

  const handleNextHint = () => {
    soundEffects.playClick();
    if (activeHintIndex === null) {
      handleRequestSpecificHint(0);
    } else if (activeHintIndex < allHints.length - 1) {
      handleRequestSpecificHint(activeHintIndex + 1);
    }
  };

  const handlePrevHint = () => {
    soundEffects.playClick();
    if (activeHintIndex !== null && activeHintIndex > 0) {
      handleRequestSpecificHint(activeHintIndex - 1);
    }
  };

  const handleCloseHint = () => {
    soundEffects.playClick();
    setActiveHintIndex(null);
  };

  const handleRequestHint = () => {
    if (activeHintIndex === null) {
      handleRequestSpecificHint(0);
    } else if (activeHintIndex < allHints.length - 1) {
      handleRequestSpecificHint(activeHintIndex + 1);
    }
  };

  // Submit Answer with Timing Analysis, Malpractice Cross-Check, and Faculty Marks Evaluation
  const handleSubmitAnswer = async (isForcedByDeadline = false) => {
    if (!adaptiveEngine) return;

    // 1. Anti-Boredom Check
    const answerForBoredom = isMcqView ? 'Selected Option' : userTextAnswer;
    const boredomStatus = adaptiveEngine.checkBoredomTrigger(answerForBoredom, questionSecondsElapsed, activeHintLevel);
    if (boredomStatus.isBoredomDetected) {
      setBoredomAlert('Engagement Drop Detected! Shifted to Real-World Industry Challenge mode to rekindle active curiosity.');
    }

    // 2. Base Evaluation (Semantic or MCQ via Authoritative Layered Engine with Offline Fallback)
    let result;
    if (isMcqView) {
      result = adaptiveEngine.evaluateMcqAnswer(selectedMcqOption, activeQuestion);
    } else {
      try {
        const evalRes = await fetch('/api/assessment/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: activeQuestion,
            studentAnswer: userTextAnswer,
            hintsUsed: activeHintLevel,
            answerTimeSec: questionSecondsElapsed
          })
        });
        if (evalRes.ok) {
          const evalData = await evalRes.json();
          if (evalData.success && evalData.score !== undefined) {
            result = {
              score: evalData.score,
              isCorrect: evalData.isCorrect,
              feedback: evalData.feedback,
              conceptMatched: evalData.demonstratedConcepts || [],
              missingConcepts: evalData.missingConcepts || [],
              masteryIncrement: evalData.isCorrect ? 1 : 0
            };
          }
        }
      } catch (err) {
        // Fallback to local adaptive engine
      }
      if (!result) {
        result = adaptiveEngine.evaluateTextAnswer(userTextAnswer, activeQuestion);
      }
    }

    // 3. Timing Analysis & Malpractice Cross-Checking
    const timingAnalysis = behavioralEngineRef.current.evaluateQuestionTimingAndMalpractice(
      activeQuestion,
      questionSecondsElapsed,
      userTextAnswer,
      studentBaseline.avgTimePerQuestion,
      quizConfig.perQuestionSeconds
    );
    setCurrentTimingAnalysis(timingAnalysis);

    // 4. Calculate Final Marks out of Faculty Question Allocation
    const marksBreakdown = adaptiveEngine.evaluateQuestionMarks(
      result.score,
      activeQuestion.assignedMarks || 25,
      timingAnalysis
    );
    setCurrentMarksBreakdown(marksBreakdown);

    // 5. Save timing record into baseline tracker
    const regNo = currentUser?.regNo || 'GUEST_STUDENT';
    const timingRecord = {
      questionId: activeQuestion.id,
      topic: topicModel.title,
      timeSpentSeconds: questionSecondsElapsed,
      baselineAvgTime: studentBaseline.avgTimePerQuestion,
      timingStatus: timingAnalysis.timingStatus,
      malpracticeDetected: timingAnalysis.malpracticeDetected,
      marksEarned: marksBreakdown.finalMarks,
      maxMarks: marksBreakdown.assignedMarks,
      timestamp: new Date().toISOString()
    };
    saveStudentTimingRecord(regNo, timingRecord);

    // Record in local session history
    const historyItem = {
      questionNumber: currentQuestionIndex + 1,
      questionText: activeQuestion.text,
      bloomLevel: activeQuestion.bloomLevel,
      evolutionStage: activeQuestion.evolutionStage,
      timeSpentSeconds: questionSecondsElapsed,
      timingStatus: timingAnalysis.timingStatus,
      malpracticeDetected: timingAnalysis.malpracticeDetected,
      timingFlag: timingAnalysis.timingFlag,
      baseScorePercent: result.score,
      assignedMarks: marksBreakdown.assignedMarks,
      earnedMarks: marksBreakdown.finalMarks,
      penaltyReason: marksBreakdown.penaltyReason
    };
    setSessionQuestionHistory(prev => [...prev, historyItem]);

    setEvaluationResult(result);
    setIsEvaluated(true);

    if (marksBreakdown.finalMarks >= marksBreakdown.assignedMarks * 0.7 && !timingAnalysis.malpracticeDetected) {
      soundEffects.playSuccess();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      soundEffects.playWarning();
    }

    if (currentUser) {
      updateUserStats(currentUser.id, {
        dnaProfile: adaptiveEngine.dna,
        cognitiveTwin: adaptiveEngine.twin
      });
    }
  };

  // Next Question or Finalize Session
  const handleNextQuestion = () => {
    soundEffects.playClick();
    if (currentQuestionIndex + 1 < weightedQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserTextAnswer('');
      setSelectedMcqOption(null);
      setIsEvaluated(false);
      setEvaluationResult(null);
      setCurrentTimingAnalysis(null);
      setCurrentMarksBreakdown(null);
      setActiveHintLevel(0);
      setHintsList([]);
      setQuestionSecondsElapsed(0);
      stopSpeaking();
      setIsSpeaking(false);
      if (adaptiveEngine) adaptiveEngine.hintsUsedInCurrentQuestion = 0;
    } else {
      handleFinalizeSession();
    }
  };

  const handleFinalizeSession = () => {
    soundEffects.playSuccess();
    const mastery = adaptiveEngine?.calculateMasteryStatus(
      weightedQuestions.length,
      weightedQuestions.length,
      behaviorMetrics.authenticityScore
    );

    // Sum total marks awarded across all questions
    const totalEarnedMarks = sessionQuestionHistory.reduce((sum, item) => sum + item.earnedMarks, 0) +
      (currentMarksBreakdown?.finalMarks || 0);

    const sessionRecord = {
      id: 'session_' + Date.now(),
      topic: topicModel.title,
      domain: topicModel.domain,
      studentRegNo: currentUser?.regNo || 'GUEST_STUDENT',
      studentName: currentUser?.fullName || 'Guest Student',
      timestamp: new Date().toISOString(),
      masteryLevel: mastery?.masteryLevel || 'Mastered',
      facultyTotalMarks: quizConfig.totalMarks,
      totalEarnedMarks: parseFloat(totalEarnedMarks.toFixed(1)),
      overallScore: Math.min(100, Math.round((totalEarnedMarks / quizConfig.totalMarks) * 100)),
      knowledgeScore: adaptiveEngine.knowledgeScore,
      reasoningScore: adaptiveEngine.reasoningScore,
      retentionScore: adaptiveEngine.retentionScore,
      curiosityIndex: adaptiveEngine.twin.curiosityIndex,
      innovationIndex: adaptiveEngine.twin.innovationIndex,
      authenticityScore: behaviorMetrics.authenticityScore,
      humanConfidenceScore: behaviorMetrics.humanConfidenceScore,
      wpm: behaviorMetrics.wpm,
      cps: behaviorMetrics.cps,
      tabSwitches: behaviorMetrics.tabSwitches,
      pasteAttempts: behaviorMetrics.pasteAttempts,
      burstsDetected: behaviorMetrics.burstsDetected,
      questionTimingHistory: sessionQuestionHistory
    };

    saveAssessmentSession(sessionRecord);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    if (onOpenReport) onOpenReport(sessionRecord);
  };

  // Student Curiosity Inquiry
  const handleAskCuriosity = (e) => {
    e.preventDefault();
    if (!curiosityInput.trim() || !adaptiveEngine) return;
    soundEffects.playClick();
    const res = adaptiveEngine.recordStudentCuriosity(curiosityInput);
    setCuriosityExchange({
      question: curiosityInput,
      answer: res.aiResponse
    });
    setCuriosityInput('');
  };

  // Innovation Submission
  const handleSubmitInnovation = (e) => {
    e.preventDefault();
    if (!innovationInput.trim() || !adaptiveEngine) return;
    soundEffects.playSuccess();
    const res = adaptiveEngine.recordInnovationAttempt(innovationInput);
    setInnovationResult(res);
  };

  // Search new topic with local Ollama AI grounding and procedural fallback
  const handleSearchNewTopic = async (e) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    soundEffects.playClick();
    setIsSearchingTopic(true);
    try {
      const newModel = await generateUniversalTopicModelAsync(topicInput);
      onTopicChange(newModel);
    } catch (err) {
      const fallbackModel = generateUniversalTopicModel(topicInput);
      onTopicChange(fallbackModel);
    } finally {
      setIsSearchingTopic(false);
    }
  };

  const xaiBadge = adaptiveEngine
    ? adaptiveEngine.generateXaiExplanation(activeQuestion, adaptiveEngine.dna)
    : { difficultyRating: 3.2, explanation: 'Calibrated for standard analytical depth.', confidenceScore: '97.4%' };

  // Format Time Helper MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Learning DNA Style Prompt Formulation
  const getDnaPromptHint = () => {
    const dna = adaptiveEngine?.dna || { visual: 75, analytical: 80, practical: 75, research: 70 };
    if (dna.analytical >= 85) {
      return {
        badge: 'Analytical DNA Match',
        text: 'AI Question Tuned: Mathematical proofs, state equations, and multi-variable balance are emphasized.'
      };
    }
    if (dna.visual >= 80) {
      return {
        badge: 'Visual DNA Match',
        text: 'AI Question Tuned: Spatial layout, architectural topology, and block diagrams are emphasized.'
      };
    }
    if (dna.practical >= 80) {
      return {
        badge: 'Practical DNA Match',
        text: 'AI Question Tuned: Device deployment, component selection, and failure troubleshooting are emphasized.'
      };
    }
    return {
      badge: 'Balanced Cognitive DNA',
      text: 'AI Question Tuned: Holistic integration of theory, proof, and real-world implementation.'
    };
  };

  const dnaHint = getDnaPromptHint();

  return (
    <div className="space-y-6">
      
      {/* QUICK FEATURE WALKTHROUGH BANNER */}
      {showGuideBanner && (
        <div className="glass-panel p-4 rounded-2xl border border-sky-200 bg-sky-50/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fade-in shadow-sm">
          <div className="flex items-start gap-2.5">
            <Info className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700">
              <span className="font-bold text-slate-900">Faculty Timing & Marks Active:</span> Quiz Deadline is <strong>{quizConfig.durationMinutes} mins</strong> (Total <strong>{quizConfig.totalMarks} Marks</strong>). Every question tracks attending time, comparing against your historical baseline to detect malpractice and calculate marks.
            </div>
          </div>
          <button
            onClick={() => setShowGuideBanner(false)}
            className="text-[11px] text-slate-500 hover:text-slate-900 shrink-0 font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. UNIVERSAL SUBJECT / TOPIC SEARCH BAR & PRESETS */}
      <div className="ent-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#30363D] pb-3">
          <div>
            <span className="badge-mastered text-[11px]">Universal Curriculum Engine</span>
            <h2 className="text-[18px] font-bold text-[#F0F6FC] mt-1">
              Select or Type Any Subject to Attend Viva
            </h2>
          </div>
          <span className="text-[12px] text-[#8B949E]">Over 120+ Academic Disciplines Supported</span>
        </div>

        <form onSubmit={handleSearchNewTopic} className="w-full flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B949E]" />
            <input
              type="text"
              placeholder="Type ANY subject or topic (e.g. Operating Systems, Transformers, MOSFET, CNN, Microcontrollers, Database Systems...)"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              className="w-full h-[48px] pl-10 pr-4 rounded-[12px] bg-[#0D1117] border border-[#30363D] text-[14px] text-[#F0F6FC] placeholder-[#6E7681] focus:border-[#00F5D4] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingTopic}
            className="btn-primary h-[48px] min-w-[150px] shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#0D1117]" />
            <span>{isSearchingTopic ? 'Generating Viva...' : 'Load Topic'}</span>
          </button>
        </form>

        {/* Quick Benchmark Topic Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] text-[#8B949E] font-bold uppercase tracking-wider">Instant Presets:</span>
          {['MOSFET', 'CNN', 'Transformers', 'Operating Systems', 'Data Structures', 'Indian Constitution'].map((item) => (
            <button
              key={item}
              onClick={async () => {
                setTopicInput(item);
                setIsSearchingTopic(true);
                try {
                  const m = await generateUniversalTopicModelAsync(item);
                  onTopicChange(m);
                } catch {
                  const m = generateUniversalTopicModel(item);
                  onTopicChange(m);
                } finally {
                  setIsSearchingTopic(false);
                }
              }}
              className="px-3 py-1.5 rounded-[8px] bg-[#0D1117] hover:bg-[#00F5D4] hover:text-[#0D1117] text-[#F0F6FC] text-[12px] border border-[#30363D] transition-all font-semibold"
            >
              {item}
            </button>
          ))}
          <button
            onClick={onOpenDomainBrowser}
            className="btn-secondary h-[34px] min-w-0 text-[11px] px-3 py-1"
          >
            + Browse 120+ Disciplines
          </button>
        </div>
      </div>

      {/* Deadline Expiry Alert */}
      {deadlineExpiredAlert && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-3 animate-fade-in shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <strong className="text-rose-950">Faculty Quiz Deadline Reached!</strong> The allotted time for this quiz has expired. Your responses have been automatically submitted and graded according to faculty timing policy.
          </div>
        </div>
      )}

      {/* Boredom Alert Banner */}
      {boredomAlert && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex justify-between items-center animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">{boredomAlert}</span>
          </div>
          <button onClick={() => setBoredomAlert(null)} className="text-amber-950 hover:underline font-bold text-xs ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* FULL WIDTH VIVA QUESTION CARD */}
      <div className="w-full space-y-6">
        
        {/* PRIMARY VIVA WORKSPACE */}
        <div className="space-y-6">

          {/* ASSESSMENT CONTROLS & PIPELINE HEADER */}
          <div className="ent-card p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* Mode Selector */}
            <div className="flex items-center gap-1.5 bg-[#0D1117] p-1 rounded-[10px] border border-[#30363D]">
              <span className="text-[11px] text-[#8B949E] font-bold px-2">Mode:</span>
              {['Mixed', 'Text', 'MCQ'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    soundEffects.playClick();
                    setAssessmentMode(mode);
                  }}
                  className={`px-3 py-1 rounded-[8px] text-[12px] font-semibold transition-all ${
                    assessmentMode === mode
                      ? 'bg-[#00F5D4] text-[#0D1117] font-bold shadow-sm'
                      : 'text-[#8B949E] hover:text-[#F0F6FC]'
                  }`}
                >
                  {mode} Mode
                </button>
              ))}
            </div>

            {/* Badges & Graph Topology */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <div className="badge-learning">
                Weight: {activeQuestion.assignedMarks} Marks
              </div>
              <div className="badge-mastered">
                Difficulty: {xaiBadge.difficultyRating} / 5.0
              </div>
              <div className="px-2.5 py-1 rounded-[8px] bg-[#161B22] border border-[#30363D] text-[#00F5D4] font-bold text-[11px]">
                {activeQuestion.evolutionStage || `Stage ${currentQuestionIndex + 1}`}
              </div>
              <button
                onClick={() => onNavigateToGraph && onNavigateToGraph()}
                className="btn-secondary h-[34px] min-w-0 text-[11px] px-2.5 py-1"
              >
                <Layers className="w-3.5 h-3.5 text-[#00F5D4]" />
                <span>Topology</span>
              </button>

              {/* OPTIONAL SCORES & TELEMETRY TOGGLE BUTTON */}
              <button
                type="button"
                onClick={() => setShowTelemetrySidebar(prev => !prev)}
                className={`btn-secondary h-[34px] min-w-0 text-[11px] px-3 py-1 flex items-center gap-1.5 transition-all cursor-pointer ${
                  showTelemetrySidebar ? '!border-[#00F5D4] !text-[#00F5D4] bg-[#00F5D4]/10' : ''
                }`}
                title="Toggle Scores, Timers & Anti-Cheat Telemetry"
              >
                <BarChart3 className={`w-3.5 h-3.5 ${showTelemetrySidebar ? 'text-[#00F5D4]' : 'text-[#8B949E]'}`} />
                <span>{showTelemetrySidebar ? 'Hide Telemetry' : 'Scores & Telemetry'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
              </button>
            </div>
          </div>

          {/* MAIN QUESTION CARD (Width: 900px Centered) */}
          <div className="ent-card space-y-6">
            {/* Question Header & Speech Synthesizer Voice */}
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge badge-cyan text-xs">
                    Question {currentQuestionIndex + 1} of {weightedQuestions.length}
                  </span>
                  
                  {/* Bloom Level Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#161B22] text-[#00F5D4] border border-[#30363D]">
                    <span>Bloom:</span>
                    <strong className="text-[#00F5D4]">{activeQuestion.bloomLevel || 'Understanding'}</strong>
                  </span>

                  <span className="badge-mastered text-[11px]">
                    {activeQuestion.assignedMarks} Marks
                  </span>

                  {/* Deadline Quick Timer Pill */}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[8px] font-mono text-[11px] font-bold border ${
                    overallSecondsRemaining < 180 ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse' : 'bg-[#161B22] text-[#8B949E] border-[#30363D]'
                  }`}>
                    <Timer className="w-3 h-3 text-[#FFB800]" />
                    <span>{formatTime(overallSecondsRemaining)}</span>
                  </span>

                  {/* Topic Tree Link */}
                  <button
                    onClick={() => onNavigateToGraph && onNavigateToGraph()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#000080] hover:text-white text-[#333333] text-xs font-bold border border-slate-200 transition-all"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#4169E1]" />
                    <span>Topic Tree</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Difficulty Meter */}
                  <div className="flex items-center gap-2 bg-[#F0F8FF] px-3 py-1 rounded-xl border border-[#D0E3F5]">
                    <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">Difficulty Meter:</span>
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${(xaiBadge.difficultyRating / 5.0) * 100}%` }}
                        className="h-full bg-gradient-to-r from-[#4169E1] to-[#E11D48] rounded-full"
                      />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#333333]">{xaiBadge.difficultyRating} / 5.0</span>
                  </div>

                  {/* Text-To-Speech Examiner Button */}
                  <button
                    onClick={handleToggleSpeech}
                    title="Hear offline viva examiner voice"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      isSpeaking
                        ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                        : 'btn-secondary text-xs py-1.5 px-3 shadow-sm'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-300" />}
                    <span>{isSpeaking ? 'Stop Voice' : 'Speak Question'}</span>
                  </button>
                </div>
              </div>

              <h3 className="text-[22px] font-semibold text-[#F0F6FC] leading-snug">
                {activeQuestion.text || activeQuestion.questionText}
              </h3>

              {/* Multimodal: Mathematical / Derivation LaTeX Box */}
              {(activeQuestion.mathBlock || (Array.isArray(activeQuestion.equations) && activeQuestion.equations.length > 0)) && (
                <div className="mt-3.5 p-4 rounded-xl bg-[#0D1117] border border-[#30363D] shadow-inner">
                  <div className="flex items-center justify-between text-xs text-[#8B949E] mb-1.5 font-sans">
                    <span className="font-semibold text-[#00F5D4] flex items-center gap-1.5">
                      <span className="text-base">∑</span> Governing Analytical Formulation:
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-[#161B22] text-[#58A6FF] px-2 py-0.5 rounded border border-[#30363D]">
                      {activeQuestion.questionType || 'Derivation / Equation'}
                    </span>
                  </div>
                  <div className="text-center py-2 px-3 bg-[#161B22]/60 rounded-lg text-base sm:text-lg text-[#F0F6FC] font-mono font-semibold tracking-wide overflow-x-auto border border-[#30363D]/40">
                    {activeQuestion.mathBlock || (Array.isArray(activeQuestion.equations) ? activeQuestion.equations.map(e => e.latex || e).join(' ; ') : '')}
                  </div>
                </div>
              )}

              {/* Multimodal: Given Parameters Table for Numericals */}
              {activeQuestion.givenParameters && Object.keys(activeQuestion.givenParameters).length > 0 && (
                <div className="mt-3 p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D]">
                  <div className="text-xs font-semibold text-[#FFB800] mb-2 flex items-center gap-1.5">
                    <span className="text-sm">⚡</span> Given Numerical Parameters & Boundary Conditions:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(activeQuestion.givenParameters).map(([param, val]) => (
                      <div key={param} className="p-2 rounded-lg bg-[#161B22] border border-[#30363D] text-xs">
                        <span className="text-[#8B949E] block text-[10px] uppercase font-mono">{param}:</span>
                        <span className="text-[#F0F6FC] font-semibold font-mono">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multimodal: Circuit / Topology / Diagram Display */}
              {(activeQuestion.circuitSvg || activeQuestion.diagramSvg) && (
                <div className="mt-3 p-3 rounded-xl bg-[#0D1117] border border-[#30363D] flex flex-col items-center">
                  <div className="w-full text-xs font-semibold text-[#00F5D4] mb-2 flex items-center gap-1.5">
                    <span>📐</span> Schematic / Topology Diagram:
                  </div>
                  <div
                    className="w-full max-w-md bg-[#161B22] p-3 rounded-lg border border-[#30363D] flex justify-center text-xs overflow-auto"
                    dangerouslySetInnerHTML={{ __html: activeQuestion.circuitSvg || activeQuestion.diagramSvg }}
                  />
                </div>
              )}

              {/* Multimodal: Faculty Reference Grounding Badge */}
              {activeQuestion.referenceEvidence && activeQuestion.referenceEvidence.length > 0 && (
                <div className="mt-2.5 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-[#00F5D4] text-[11px] font-semibold">
                    <FileText className="w-3.5 h-3.5 text-[#00F5D4]" />
                    <span className="text-[#8B949E]">Grounded in Faculty Material:</span>
                    <strong className="text-[#F0F6FC]">{activeQuestion.referenceEvidence[0].sourceFile || 'Reference Notes'}</strong>
                    {activeQuestion.referenceEvidence[0].page && <span className="text-[#8B949E]">(Page {activeQuestion.referenceEvidence[0].page})</span>}
                  </span>
                </div>
              )}

              {/* CHALLENGE TRIGGER BUTTONS ROW */}
              <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">Explore Challenge:</span>
                
                <button
                  type="button"
                  onClick={() => {
                    setActiveChallengeType('innovation');
                    setShowInnovationModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#E6F2FD] hover:bg-[#4169E1] hover:text-white text-[#000080] border border-[#BAE6FD] text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#4169E1]" />
                  <span>Innovation Challenge</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveChallengeType('reasoning');
                    setShowInnovationModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#E6F2FD] hover:bg-[#000080] hover:text-white text-[#000080] border border-[#BAE6FD] text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <BrainCircuit className="w-3 h-3 text-[#000080]" />
                  <span>Reasoning Challenge</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveChallengeType('realworld');
                    setShowInnovationModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-[#059669] hover:text-white text-[#059669] border border-emerald-200 text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-[#059669]" />
                  <span>Real-World Application</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveChallengeType('research');
                    setShowInnovationModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-700 hover:text-white text-indigo-700 border border-indigo-200 text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3 text-indigo-600" />
                  <span>Research Challenge</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveChallengeType('industry');
                    setShowInnovationModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-700 hover:text-white text-amber-800 border border-amber-200 text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <Award className="w-3 h-3 text-amber-600" />
                  <span>Industry Challenge</span>
                </button>
              </div>

              {/* DNA Profile Tuning Badge */}
              <div className="mt-2.5 flex items-center gap-2 text-xs">
                <span className="badge badge-purple text-[10px]">{dnaHint.badge}</span>
                <span className="text-[11px] text-slate-600 font-medium">{dnaHint.text}</span>
              </div>

              {/* Explainable AI Transparent Rationale & Question Evolution Panel Trigger */}
              <div className="mt-3 p-3 rounded-2xl bg-sky-50/80 border border-sky-200 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div className="text-slate-700 leading-relaxed">
                    <span className="font-bold text-sky-900">Explainable AI (XAI) Rationale:</span> {xaiBadge.explanation}
                    <span className="text-[10px] text-slate-500 ml-2 font-mono">({xaiBadge.confidenceScore})</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEvolutionModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#000080] hover:text-white text-[#000080] border border-sky-300 font-bold text-[11px] shadow-sm flex items-center gap-1.5 shrink-0 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#4169E1]" />
                  <span>Question Evolution Trace</span>
                </button>
              </div>
            </div>

            {/* ANSWER INPUT AREA: Text Mode vs MCQ Mode */}
            {isMcqView ? (
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Adaptive Option:</div>
                {(activeQuestion.options || [
                  'Primary conductive channel saturation threshold is reached',
                  'Non-linear breakdown occurs due to minority carrier drift',
                  'Carrier concentration remains purely extrinsic without inversion',
                  'Thermal dissociation halts electromagnetic propagation'
                ]).map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedMcqOption === idx
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mcq-option"
                      checked={selectedMcqOption === idx}
                      onChange={() => {
                        soundEffects.playClick();
                        setSelectedMcqOption(idx);
                      }}
                      disabled={isEvaluated || deadlineExpiredAlert}
                      className="mt-1 accent-sky-400"
                    />
                    <span className="text-xs md:text-sm leading-relaxed font-medium">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                  <label className="font-bold text-slate-800">
                    Viva Response (Type in your own words — Paste & shortcuts disabled):
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono font-medium">
                      {userTextAnswer.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                    <button
                      type="button"
                      onClick={handleFillDemoAnswer}
                      disabled={isEvaluated || deadlineExpiredAlert}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 text-[11px] font-bold transition-all shadow-sm flex items-center gap-1"
                      title="Fills a high-quality model response with authentic simulated typing cadence for rapid testing"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>⚡ Demo Auto-Answer</span>
                    </button>
                    {userTextAnswer && (
                      <button
                        type="button"
                        onClick={handleClearAnswer}
                        disabled={isEvaluated || deadlineExpiredAlert}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-semibold transition-all"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  rows={6}
                  placeholder="Articulate the core operational principles, mathematical constraints, and practical mechanism here..."
                  value={userTextAnswer}
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                  onPaste={(e) => handleCopyPasteBlock(e, 'paste')}
                  onCopy={(e) => handleCopyPasteBlock(e, 'copy')}
                  onCut={(e) => handleCopyPasteBlock(e, 'copy')}
                  onContextMenu={(e) => handleCopyPasteBlock(e, 'contextmenu')}
                  disabled={isEvaluated || deadlineExpiredAlert}
                  className="w-full h-[200px] min-h-[200px] p-4 rounded-[12px] bg-[#0D1117] border border-[#30363D] text-[#F0F6FC] text-[15px] focus:border-[#00F5D4] focus:outline-none resize-none leading-relaxed select-none"
                />
              </div>
            )}

            {/* MULTI-LEVEL ADAPTIVE HINT PANEL (ONE HINT NEXT TO ANOTHER - NEVER REVEALS DIRECT ANSWER) */}
            <div className="space-y-4 pt-4 border-t border-[#30363D]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="text-xs font-bold text-[#F0F6FC] uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#FFB800]" />
                  <span>Adaptive Scaffolding Hints</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#21262D] text-[#8B949E] border border-[#30363D]">
                    1 Hint at a Time
                  </span>
                </div>
                <span className="text-[11px] text-[#8B949E]">Cognitive reflection without direct answers</span>
              </div>

              {/* Dedicated Hint Selector Pills (Click any to show that single hint) */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {allHints.map((item, idx) => {
                  const isSelected = activeHintIndex === idx;
                  const isUnlocked = hintsList.some(h => h.id === item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleRequestSpecificHint(idx)}
                      disabled={isEvaluated || deadlineExpiredAlert}
                      className={`px-3 py-1.5 rounded-[10px] text-[12px] font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#00F5D4] text-[#0D1117] font-bold ring-2 ring-[#00F5D4]/40'
                          : isUnlocked
                          ? 'bg-[#161B22] text-[#00F5D4] border border-[#00F5D4]/40 hover:bg-[#21262D]'
                          : 'bg-[#161B22] text-[#8B949E] border border-[#30363D] hover:text-[#F0F6FC] hover:border-[#8B949E]'
                      }`}
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0D1117]' : isUnlocked ? 'text-[#00F5D4]' : 'text-[#8B949E]'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SINGLE ACTIVE HINT CAROUSEL (One hint next to another so previous hint goes away!) */}
              {activeHintIndex !== null && allHints[activeHintIndex] && (
                <div className="p-4 rounded-[14px] bg-[#161B22] border-2 border-[#00F5D4]/60 text-[#F0F6FC] space-y-3 animate-fade-in shadow-xl">
                  <div className="flex justify-between items-center pb-2 border-b border-[#30363D]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#00F5D4]/20 border border-[#00F5D4] flex items-center justify-center text-[#00F5D4] text-[12px] font-bold font-mono">
                        {activeHintIndex + 1}
                      </div>
                      <span className="font-bold text-[14px] text-[#00F5D4]">
                        {allHints[activeHintIndex].label}
                      </span>
                      <span className="text-[11px] text-[#8B949E] font-mono">
                        (Hint {activeHintIndex + 1} of {allHints.length})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCloseHint}
                      className="text-[#8B949E] hover:text-[#F0F6FC] p-1.5 rounded-[8px] hover:bg-[#21262D] transition-all cursor-pointer"
                      title="Dismiss Hint"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Single Hint Text */}
                  <div className="text-[14px] leading-relaxed text-[#F0F6FC] bg-[#0D1117] p-4 rounded-[10px] border border-[#30363D]">
                    {allHints[activeHintIndex].text}
                  </div>

                  {/* Sequential Navigation: [ ← Prev Hint ] [ Next Hint → ] */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-1">
                    <div className="flex items-center gap-1.5">
                      {allHints.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => handleRequestSpecificHint(dotIdx)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            dotIdx === activeHintIndex
                              ? 'w-6 bg-[#00F5D4]'
                              : 'w-2 bg-[#30363D] hover:bg-[#8B949E]'
                          }`}
                          title={`Go to Hint ${dotIdx + 1}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrevHint}
                        disabled={activeHintIndex === 0}
                        className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          activeHintIndex === 0
                            ? 'opacity-40 cursor-not-allowed bg-[#21262D] text-[#8B949E]'
                            : 'bg-[#21262D] hover:bg-[#30363D] text-[#F0F6FC] border border-[#30363D]'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Prev Hint</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextHint}
                        disabled={activeHintIndex === allHints.length - 1}
                        className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          activeHintIndex === allHints.length - 1
                            ? 'opacity-40 cursor-not-allowed bg-[#21262D] text-[#8B949E]'
                            : 'bg-[#00F5D4] hover:bg-[#00D2B4] text-[#0D1117] font-bold shadow-sm'
                        }`}
                      >
                        <span>Next Hint</span>
                        <ChevronRight className="w-4 h-4 text-[#0D1117]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* EVALUATION RESULTS WITH TIMING & FACULTY MARKS BREAKDOWN */}
            {isEvaluated && evaluationResult && (
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-300 space-y-3.5 animate-fade-in shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm text-slate-900">Cognitive & Timing Evaluation</span>
                  </div>
                  
                  {/* Evaluated Marks Awarded */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 font-medium">Faculty Marks Awarded:</span>
                    <span className="text-xl font-black text-emerald-700 font-mono">
                      {currentMarksBreakdown?.finalMarks} / {currentMarksBreakdown?.assignedMarks} Marks
                    </span>
                    <span className="text-xs text-slate-500 font-medium">({evaluationResult.score}%)</span>
                  </div>
                </div>

                {/* Timing Anomaly & Malpractice Check Card */}
                {currentTimingAnalysis && (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs shadow-sm">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Attending Time</span>
                      <div className="text-slate-900 font-mono font-bold mt-0.5">
                        {currentTimingAnalysis.timeSpentSeconds} seconds
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Baseline Compare</span>
                      <div className={`font-mono font-bold mt-0.5 ${currentTimingAnalysis.deviationPercent < -50 ? 'text-rose-600' : 'text-sky-700'}`}>
                        {currentTimingAnalysis.deviationPercent > 0 ? `+${currentTimingAnalysis.deviationPercent}%` : `${currentTimingAnalysis.deviationPercent}%`}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Malpractice Status</span>
                      <div className="mt-0.5">
                        {currentTimingAnalysis.malpracticeDetected ? (
                          <span className="badge badge-rose text-[10px]">Anomaly Detected</span>
                        ) : (
                          <span className="badge badge-emerald text-[10px]">Verified Clean</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Pacing Cadence</span>
                      <div className="text-emerald-700 font-mono font-bold mt-0.5">
                        {currentTimingAnalysis.timingStatus === 'NORMAL' ? 'Standard Cadence' : currentTimingAnalysis.timingStatus}
                      </div>
                    </div>
                  </div>
                )}

                {currentMarksBreakdown?.penaltyReason && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs font-medium">
                    {currentMarksBreakdown.penaltyReason}
                  </div>
                )}

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {evaluationResult.feedback || evaluationResult.explanation}
                </p>

                {evaluationResult.missingConcepts?.length > 0 && (
                  <div className="text-xs text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <strong>Prerequisite Reinforcement:</strong> You missed key concepts ({evaluationResult.missingConcepts.slice(0, 3).join(', ')}). The concept graph has highlighted these prerequisites for spaced review.
                  </div>
                )}
              </div>
            )}

            {/* Action Controls & Navigation (Strict Button Design System) */}
            <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-[#30363D]">
              
              {/* Hint Button: Height 44-48px, Width 140-200px */}
              <button
                type="button"
                onClick={() => handleRequestSpecificHint('level1')}
                disabled={isEvaluated || deadlineExpiredAlert}
                className="btn-secondary"
              >
                <HelpCircle className="w-4 h-4 text-[#00F5D4]" />
                <span>Hint</span>
              </button>

              <div className="flex items-center gap-3">
                {!isEvaluated ? (
                  /* Submit Button: Height 48-52px, Width 160-240px */
                  <button
                    onClick={() => handleSubmitAnswer(false)}
                    disabled={isMcqView ? selectedMcqOption === null : !userTextAnswer.trim()}
                    className="btn-primary"
                  >
                    <span>Submit Answer</span>
                  </button>
                ) : (
                  /* Next Question Button: Height 48-52px, Width 160-240px */
                  <button
                    onClick={handleNextQuestion}
                    className="btn-primary"
                  >
                    <span>
                      {currentQuestionIndex + 1 < weightedQuestions.length ? 'Next Question' : 'View Report'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#0D1117]" />
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* OPTIONAL TELEMETRY & SECURITY PANEL (Rendered only when requested via icon) */}
        {showTelemetrySidebar && (
          <div className="space-y-5 animate-fade-in">

            {/* 1. FACULTY DEADLINE COUNTDOWN & ATTENDING TIME WIDGET */}
            <div className="ent-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-[10px] border ${overallSecondsRemaining < 180 ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse' : 'bg-[#0D1117] border-[#30363D]'}`}>
                    <Timer className={`w-5 h-5 ${overallSecondsRemaining < 180 ? 'text-rose-400' : 'text-[#FFB800]'}`} />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8B949E] uppercase font-bold tracking-wider">Faculty Quiz Deadline</div>
                    <div className={`font-mono text-xl font-black ${overallSecondsRemaining < 180 ? 'text-rose-400' : 'text-[#F0F6FC]'}`}>
                      {formatTime(overallSecondsRemaining)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="badge-mastered py-1 px-2.5 font-bold">
                    {quizConfig.totalMarks} Marks
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTelemetrySidebar(false)}
                    className="p-1.5 rounded-[8px] hover:bg-[#21262D] text-[#8B949E] hover:text-[#F0F6FC] transition-all cursor-pointer"
                    title="Hide Telemetry Panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Attending Time Meters */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#0D1117] p-3 rounded-[12px] border border-[#30363D]">
                  <div className="text-[10px] text-[#8B949E] uppercase font-bold">Question Attending Time</div>
                  <div className="text-[#F0F6FC] font-black text-sm mt-0.5">
                    {formatTime(questionSecondsElapsed)}
                  </div>
                  <div className="text-[10px] text-[#8B949E] mt-0.5">Limit: {formatTime(quizConfig.perQuestionSeconds)}</div>
                </div>

                <div className="bg-[#0D1117] p-3 rounded-[12px] border border-[#30363D]">
                  <div className="text-[10px] text-[#8B949E] uppercase font-bold">Historic Baseline</div>
                  <div className="text-[#00F5D4] font-black text-sm mt-0.5">
                    {studentBaseline.avgTimePerQuestion}s avg
                  </div>
                  <div className="text-[10px] text-[#8B949E] mt-0.5">Cross-checked live</div>
                </div>
              </div>
            </div>

            {/* 2. LIVE BEHAVIORAL ANTI-CHEAT SECURITY DASHBOARD */}
            <div className="ent-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F0F6FC] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#39FF14]" />
                    Anti-Cheat Shield Active
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8B949E] font-bold">
                  {behaviorMetrics.wpm} WPM
                </span>
              </div>

              {/* Security Meters */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-[#0D1117] p-2.5 rounded-[12px] border border-[#30363D]">
                  <div className="text-[#8B949E] text-[10px] font-bold uppercase">Authenticity</div>
                  <div className="text-base font-black text-[#39FF14] font-mono mt-0.5">
                    {behaviorMetrics.authenticityScore}%
                  </div>
                  <div className="w-full bg-[#21262D] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#39FF14] h-full rounded-full transition-all"
                      style={{ width: `${behaviorMetrics.authenticityScore}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#0D1117] p-2.5 rounded-[12px] border border-[#30363D]">
                  <div className="text-[#8B949E] text-[10px] font-bold uppercase">Human Rhythm</div>
                  <div className="text-base font-black text-[#00F5D4] font-mono mt-0.5">
                    {behaviorMetrics.humanConfidenceScore}%
                  </div>
                  <div className="w-full bg-[#21262D] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#00F5D4] h-full rounded-full transition-all"
                      style={{ width: `${behaviorMetrics.humanConfidenceScore}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#0D1117] p-2.5 rounded-[12px] border border-[#30363D]">
                  <div className="text-[#8B949E] text-[10px] font-bold uppercase">Blocked Pastes</div>
                  <div className="text-sm font-black text-[#FFB800] font-mono mt-0.5">
                    {(behaviorMetrics.pasteAttempts || 0) + (behaviorMetrics.burstsDetected || 0)} Blocked
                  </div>
                  <div className="text-[9px] text-[#8B949E] mt-0.5">Ctrl+V intercepted</div>
                </div>

                <div className="bg-[#0D1117] p-2.5 rounded-[12px] border border-[#30363D]">
                  <div className="text-[#8B949E] text-[10px] font-bold uppercase">Tab Switches</div>
                  <div className="text-sm font-black text-[#FF007A] font-mono mt-0.5">
                    {behaviorMetrics.tabSwitches} Events
                  </div>
                  <div className="text-[9px] text-[#8B949E] mt-0.5">Window blur monitor</div>
                </div>
              </div>

              {/* Flagged Reasons Alert if any */}
              {behaviorMetrics.flaggedReasons.length > 0 && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-[12px] text-rose-300 text-[11px] flex items-center gap-2 animate-fade-in font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>Audit: {behaviorMetrics.flaggedReasons[behaviorMetrics.flaggedReasons.length - 1]}</span>
                </div>
              )}
            </div>

            {/* 3. INDUSTRY READINESS & MULTI-PERSPECTIVE ENGINE */}
            <div className="ent-card space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-[#30363D]">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#00F5D4]" />
                  <h4 className="text-xs font-bold text-[#F0F6FC] uppercase tracking-wider">
                    Industry Perspectives
                  </h4>
                </div>
                <div className="flex gap-1 text-[11px]">
                  {['engineer', 'researcher', 'startup'].map((persp) => (
                    <button
                      key={persp}
                      onClick={() => {
                        soundEffects.playClick();
                        setIndustryPerspective(persp);
                      }}
                      className={`px-2.5 py-0.5 rounded-[8px] capitalize transition-all font-semibold cursor-pointer ${
                        industryPerspective === persp
                          ? 'bg-[#00F5D4] text-[#0D1117] font-bold shadow-sm'
                          : 'bg-[#21262D] text-[#8B949E] hover:text-[#F0F6FC]'
                      }`}
                    >
                      {persp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#0D1117] rounded-[12px] border border-[#30363D] text-xs text-[#8B949E] leading-relaxed">
                {industryPerspective === 'engineer' && (
                  <p>
                    <strong className="text-[#F0F6FC]">Engineering Deployment Focus:</strong>{' '}
                    {topicModel.industryReadiness?.engineerPerspective ||
                      `Optimizes Mean Time Between Failures (MTBF), signal-to-noise ratio, and production yield constraints for commercial deployment of ${topicModel.title}.`}
                  </p>
                )}
                {industryPerspective === 'researcher' && (
                  <p>
                    <strong className="text-[#00F5D4]">Research & Academic Frontier:</strong>{' '}
                    {topicModel.industryReadiness?.researcherPerspective ||
                      `Investigates mathematical boundaries, non-linear edge dissipation, and novel algorithmic formulations publishable in high-impact IEEE journals.`}
                  </p>
                )}
                {industryPerspective === 'startup' && (
                  <p>
                    <strong className="text-[#FFB800]">Startup Founder & Market Moat:</strong>{' '}
                    {topicModel.industryReadiness?.startupFounderPerspective ||
                      `Evaluates unit economic costs, energy consumption per unit, and patentable technological moats for scaling ${topicModel.title}.`}
                  </p>
                )}
              </div>
            </div>

            {/* 4. CURIOSITY SCORE ENGINE: INQUIRY PORTAL */}
            <div className="ent-card space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-[#30363D]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFB800]" />
                  <h4 className="text-xs font-bold text-[#F0F6FC] uppercase tracking-wider">
                    Curiosity Provoker
                  </h4>
                </div>
                <span className="badge badge-amber text-[9px]">Curiosity Boost</span>
              </div>

              <form onSubmit={handleAskCuriosity} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask technical question on edge cases..."
                  value={curiosityInput}
                  onChange={(e) => setCuriosityInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-[10px] bg-[#0D1117] border border-[#30363D] text-[#F0F6FC] focus:border-[#00F5D4] focus:outline-none"
                />
                <button type="submit" className="btn-secondary !w-auto !h-[36px] text-xs px-3 shrink-0 flex items-center gap-1 font-bold cursor-pointer">
                  <Send className="w-3 h-3 text-[#FFB800]" />
                  <span>Ask</span>
                </button>
              </form>

              {curiosityExchange && (
                <div className="p-3 bg-[#0D1117] rounded-[12px] border border-[#30363D] text-xs space-y-1 animate-fade-in text-[#F0F6FC]">
                  <div className="font-bold text-[#FFB800]">Inquiry: "{curiosityExchange.question}"</div>
                  <div className="leading-relaxed text-[#8B949E]">{curiosityExchange.answer}</div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* INNOVATION CHALLENGE MODAL */}
      {showInnovationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel bg-white p-6 rounded-2xl border border-slate-300 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <span className="badge badge-purple text-xs">Innovation Challenge</span>
              <button
                onClick={() => setShowInnovationModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {topicModel.innovationChallenge || `How would you architect a novel design that improves efficiency by 30% for ${topicModel.title}?`}
            </h3>

            <textarea
              rows={4}
              placeholder="Describe your creative alternative architecture or design solution..."
              value={innovationInput}
              onChange={(e) => setInnovationInput(e.target.value)}
              className="glass-input text-xs"
            />

            {innovationResult && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 text-xs">
                <div className="font-bold">Score: {innovationResult.score}/100</div>
                <div>{innovationResult.feedback}</div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowInnovationModal(false)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close
              </button>
              <button
                onClick={handleSubmitInnovation}
                className="btn-primary text-xs py-2 px-4 font-bold"
              >
                Submit Innovation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION EVOLUTION PANEL MODAL */}
      <QuestionEvolutionModal
        isOpen={showEvolutionModal}
        onClose={() => setShowEvolutionModal(false)}
        questionHistory={sessionQuestionHistory}
        currentQuestion={activeQuestion}
        xaiBadge={xaiBadge}
        learningDna={adaptiveEngine?.dna}
      />

    </div>
  );
}
