import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  HelpCircle,
  Send,
  CheckSquare,
  FileText,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  RotateCcw,
  EyeOff,
  Copy,
  Terminal,
  Activity
} from 'lucide-react';
import { BehavioralEngine } from '../../services/behavioralEngine';
import { soundEffects } from '../../services/soundEffects';

export default function QuestionPage({
  question,
  questionIndex,
  totalQuestions,
  assignedMarks = 25,
  difficulty = '3.5 / 5',
  bloomLevel = 'Understanding',
  assignedMode = 'Mixed',
  onRequestHint,
  onSubmitAnswer,
  activeHintCount = 0,
  onDisqualify,
  sessionQuestionHistory = []
}) {
  const isMcqOnly = assignedMode === 'Choice Based (MCQ)' || assignedMode === 'mcq';
  const isTextOnly = assignedMode === 'Conceptual Text' || assignedMode === 'text';

  const [textAnswer, setTextAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionSecondsElapsed, setQuestionSecondsElapsed] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(120);

  // Live Anti-Cheat Tracking State
  const [tabSwitches, setTabSwitches] = useState(0);
  const [copyAttempts, setCopyAttempts] = useState(0);
  const [pasteAttempts, setPasteAttempts] = useState(0);
  const [disqualificationModal, setDisqualificationModal] = useState(false);

  // Dynamic Metrics (Real, never hardcoded 98%)
  const totalViolations = tabSwitches + copyAttempts + pasteAttempts;
  const liveAuthenticity = Math.max(0, 100 - (tabSwitches * 20 + pasteAttempts * 25 + copyAttempts * 15));
  
  // Calculate dynamic accuracy from past answered questions
  const answeredCount = sessionQuestionHistory?.length || 0;
  const correctCount = sessionQuestionHistory?.filter(q => q.status === 'Correct').length || 0;
  const dynamicAccuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 100;

  // Fallback options if question does not have options defined
  const topicTerm = question?.expectedKeywords?.[0] || 'the core mechanism';
  const defaultOptions = [
    `Primary operating mechanism governed by ${topicTerm} and boundary electrostatic conditions`,
    `Thermal carrier depletion and non-linear saturation preventing sustained equilibrium`,
    `Spontaneous drift without closed-loop regulatory damping or boundary enforcement`,
    `Parasitic capacitance feedback limiting bandwidth and high-frequency dynamic response`
  ];

  const availableOptions = (question?.options && question.options.length > 0)
    ? question.options
    : defaultOptions;

  const getInitialMode = () => {
    if (isTextOnly) return 'text';
    if (isMcqOnly) return 'mcq';
    return (question?.options && question.options.length > 0) ? 'mcq' : 'mcq';
  };

  const [answerMode, setAnswerMode] = useState(getInitialMode);
  const [behaviorEngine] = useState(() => new BehavioralEngine());
  const timerRef = useRef(null);

  // ANTI-CHEAT: Real event listeners for tab switch, copy, paste
  useEffect(() => {
    const handleBlur = () => {
      setTabSwitches(prev => {
        const next = prev + 1;
        soundEffects.playWarning();
        checkViolationLimit(next, copyAttempts, pasteAttempts, 'Tab switch / Window blur breach');
        return next;
      });
    };

    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitches(prev => {
          const next = prev + 1;
          soundEffects.playWarning();
          checkViolationLimit(next, copyAttempts, pasteAttempts, 'Tab switch breach');
          return next;
        });
      }
    };

    const handleCopy = (e) => {
      e.preventDefault();
      setCopyAttempts(prev => {
        const next = prev + 1;
        soundEffects.playWarning();
        checkViolationLimit(tabSwitches, next, pasteAttempts, 'Copy attempt intercepted');
        return next;
      });
    };

    const handlePaste = (e) => {
      e.preventDefault();
      setPasteAttempts(prev => {
        const next = prev + 1;
        soundEffects.playWarning();
        checkViolationLimit(tabSwitches, copyAttempts, next, 'Paste attempt intercepted');
        return next;
      });
    };

    const handleGlobalKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === 'c' || key === 'x') {
          handleCopy(e);
        } else if (key === 'v') {
          handlePaste(e);
        }
      }
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [tabSwitches, copyAttempts, pasteAttempts]);

  // Check if 3 violations reached -> Immediately terminate viva!
  const checkViolationLimit = (tabs, copies, pastes, triggerReason) => {
    const total = tabs + copies + pastes;
    if (total >= 3) {
      setDisqualificationModal(true);
      soundEffects.playWarning();
      setTimeout(() => {
        if (onDisqualify) {
          onDisqualify(
            `Automated Disqualification: 3 Security Violations (${tabs} Tab Switches, ${pastes} Pastes, ${copies} Copies). Reason: ${triggerReason}`,
            { tabSwitches: tabs, pasteAttempts: pastes, copyAttempts: copies }
          );
        }
      }, 1800);
    }
  };

  useEffect(() => {
    setTextAnswer('');
    setSelectedOption(null);
    setSecondsRemaining(120);
    setQuestionSecondsElapsed(0);
    setAnswerMode(getInitialMode());
    behaviorEngine.resetForNewQuestion();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setQuestionSecondsElapsed(prev => prev + 1);
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [questionIndex, question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const metrics = behaviorEngine.calculateFinalMetrics();
    metrics.tabSwitches = tabSwitches;
    metrics.pasteAttempts = pasteAttempts;
    metrics.copyAttempts = copyAttempts;
    metrics.authenticityScore = liveAuthenticity;

    if (answerMode === 'mcq') {
      if (selectedOption === null || selectedOption === undefined) return;
      onSubmitAnswer(selectedOption, metrics, questionSecondsElapsed);
    } else {
      if (!textAnswer.trim()) return;
      onSubmitAnswer(textAnswer.trim(), metrics, questionSecondsElapsed);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const questionTitle = question?.questionText || question?.text || 'Explain the conceptual mechanism and governing equations for this topic.';

  return (
    <div className="w-full max-w-none py-2 px-2 sm:px-4 space-y-6 animate-fade-in text-left">
      
      {/* DISQUALIFICATION MODAL (AUTO-TERMINATES ON 3 VIOLATIONS) */}
      {disqualificationModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-[540px] w-full bg-[#FFF0F0] border-4 border-[#C53030] rounded-3xl p-8 text-center space-y-5 shadow-2xl animate-bounce">
            <div className="w-20 h-20 rounded-full bg-[#FED7D7] border-2 border-[#C53030] flex items-center justify-center mx-auto text-[#C53030]">
              <ShieldAlert className="w-12 h-12" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#C53030] uppercase tracking-wide">
              VIVA AUTOMATICALLY TERMINATED
            </h2>
            <div className="text-base font-bold text-[#742A2A] leading-relaxed">
              3 Malpractice Violations Detected!
              <div className="mt-2 text-sm font-mono bg-[#FED7D7] p-3 rounded-xl">
                • Tab Switches: {tabSwitches}<br />
                • Clipboard Pastes: {pasteAttempts}<br />
                • Restricted Copies: {copyAttempts}
              </div>
            </div>
            <div className="p-4 bg-[#C53030] text-white rounded-2xl font-black text-lg">
              FINAL SCORE: 0 / 100 (DISQUALIFIED)
            </div>
            <p className="text-xs text-[#9B2C2C]">
              Your session has been logged and forwarded directly to the Faculty Portal.
            </p>
          </div>
        </div>
      )}

      {/* TOP PIPELINE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFFCF4] border-2 border-[#E2D3A7] shadow-sm">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-sm font-black text-[#B7791F]">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-extrabold text-[#2D3748]">
            Difficulty: <span className="text-[#B7791F]">{difficulty || 'Bloom Scale'}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-black text-[#8B5E34]">
            {assignedMarks} Marks Available
          </div>

          <div className={`px-4 py-1.5 rounded-xl border-2 font-mono font-black text-sm flex items-center gap-2 shadow-xs ${
            secondsRemaining < 30
              ? 'bg-[#FFF0F0] border-[#FECACA] text-[#C53030] animate-pulse'
              : 'bg-[#FFFDF8] border-[#E2D3A7] text-[#2D3748]'
          }`}>
            <Clock className="w-4 h-4 text-[#B7791F]" />
            <span>Time Left: {formatTimer(secondsRemaining)}</span>
          </div>
        </div>
      </div>

      {/* MAIN WIDE 2-COLUMN WORKSPACE: LEFT (Question & Input) | RIGHT (The 8 Big Status Boxes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (8 of 12 columns): Question Statement, Options, Textarea, Hints, Submit */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Question Card with Slightly Big Letters */}
          <div className="bg-[#FFFCF4] border-2 border-[#E2D3A7] rounded-3xl p-6 sm:p-8 shadow-md shadow-[#B7791F]/5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-3">
              <span className="text-xs font-mono font-bold text-[#8B5E34] uppercase tracking-wider">
                Cognitive Depth: {bloomLevel}
              </span>
              <span className="text-xs font-bold text-[#718096]">
                Question #{questionIndex + 1}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D3748] leading-relaxed tracking-tight">
              {questionTitle}
            </h2>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            {isMcqOnly ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-bold text-[#8B5E34]">
                <CheckSquare className="w-4 h-4 text-[#B7791F]" />
                <span>Format: <strong>Choice Based (MCQ)</strong></span>
              </div>
            ) : isTextOnly ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-bold text-[#8B5E34]">
                <FileText className="w-4 h-4 text-[#B7791F]" />
                <span>Format: <strong>Conceptual Text Explanation</strong></span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-1 bg-[#FFF3D6] rounded-xl border border-[#E2D3A7]">
                <button
                  type="button"
                  onClick={() => setAnswerMode('mcq')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    answerMode === 'mcq'
                      ? 'bg-[#B7791F] text-white shadow-xs'
                      : 'text-[#8B5E34] hover:bg-[#FFF8E8]'
                  }`}
                >
                  Choice Based (MCQ)
                </button>
                <button
                  type="button"
                  onClick={() => setAnswerMode('text')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    answerMode === 'text'
                      ? 'bg-[#B7791F] text-white shadow-xs'
                      : 'text-[#8B5E34] hover:bg-[#FFF8E8]'
                  }`}
                >
                  Text Explanation
                </button>
              </div>
            )}

            <span className="text-xs font-bold text-[#718096]">
              {answerMode === 'mcq' ? 'Select matching option below' : 'Type explanation in your own words (Paste blocked)'}
            </span>
          </div>

          {/* Answer Input Area */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {answerMode === 'mcq' ? (
              <div className="grid grid-cols-1 gap-3.5">
                {availableOptions.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedOption(idx)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all shadow-sm ${
                        isSelected
                          ? 'border-[#B7791F] bg-[#FFF3D6] ring-4 ring-[#B7791F]/20 scale-[1.01]'
                          : 'border-[#E2D3A7] bg-[#FFFCF4] hover:border-[#B7791F] hover:bg-[#FFFDF8]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-sm shrink-0 ${
                        isSelected
                          ? 'border-[#B7791F] bg-[#B7791F] text-white shadow-xs'
                          : 'border-[#E2D3A7] bg-[#FFF8E8] text-[#8B5E34]'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-base sm:text-lg font-bold text-[#2D3748] flex-1 leading-snug">
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="State your technical answer clearly. Articulate physical operational mechanisms, governing laws, or analytical derivations..."
                  className="w-full h-[220px] text-base sm:text-lg font-medium p-5 rounded-2xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] outline-none resize-vertical leading-relaxed shadow-inner focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all"
                  required
                />
              </div>
            )}

            {/* Bottom Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={onRequestHint}
                className="px-6 py-3.5 rounded-xl bg-[#FFF3D6] hover:bg-[#B7791F] hover:text-white border-2 border-[#E2D3A7] text-[#8B5E34] font-extrabold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-5 h-5 text-[#B7791F]" />
                <span>Request Hint {activeHintCount > 0 ? `(Level ${activeHintCount}/4)` : ''}</span>
              </button>

              <button
                type="submit"
                disabled={answerMode === 'mcq' ? selectedOption === null : !textAnswer.trim()}
                className="px-10 py-4 rounded-xl bg-[#B7791F] hover:bg-[#975A16] disabled:opacity-50 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-[#B7791F]/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Submit Answer</span>
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
          </form>

        </div>

        {/* RIGHT COLUMN (4 of 12 columns): 4 BIG CORE STATUS BOXES */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="flex items-center gap-2 px-2 pb-1 border-b border-[#E2D3A7]">
            <Activity className="w-5 h-5 text-[#B7791F]" />
            <h3 className="text-sm font-extrabold text-[#2D3748] uppercase tracking-wider">
              Live Examination Status (Right Side)
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            
            {/* BOX 1: ATTENDING TIMER */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFCF4] border-2 border-[#E2D3A7] shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-extrabold text-[#718096] uppercase tracking-wider block">
                  1. Attending Time
                </span>
                <span className="text-3xl sm:text-4xl font-black font-mono text-[#B7791F] tracking-tight block mt-1">
                  {formatTimer(questionSecondsElapsed)}
                </span>
                <span className="text-xs font-bold text-[#718096] block mt-1">
                  120s Question Budget
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#FFF3D6] border-2 border-[#E2D3A7] flex items-center justify-center text-[#B7791F]">
                <Clock className="w-8 h-8" />
              </div>
            </div>

            {/* BOX 2: DYNAMIC AUTHENTICITY SCORE */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFCF4] border-2 border-[#E2D3A7] shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-extrabold text-[#718096] uppercase tracking-wider block">
                  2. Authenticity Shield
                </span>
                <span className={`text-3xl sm:text-4xl font-black font-mono tracking-tight block mt-1 ${
                  liveAuthenticity > 70 ? 'text-[#2F855A]' : 'text-[#C53030]'
                }`}>
                  {liveAuthenticity}%
                </span>
                <span className="text-xs font-bold text-[#718096] block mt-1">
                  Live Behavioral Integrity
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#E6F4EA] border-2 border-[#A8DAB5] flex items-center justify-center text-[#2F855A]">
                <ShieldCheck className="w-8 h-8" />
              </div>
            </div>

            {/* BOX 3: LIVE DYNAMIC ACCURACY */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFCF4] border-2 border-[#E2D3A7] shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-extrabold text-[#718096] uppercase tracking-wider block">
                  3. Live Accuracy
                </span>
                <span className="text-3xl sm:text-4xl font-black font-mono text-[#1E3A8A] tracking-tight block mt-1">
                  {dynamicAccuracy}%
                </span>
                <span className="text-xs font-bold text-[#718096] block mt-1">
                  Calculated from Responses
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#EBF8FF] border-2 border-[#BEE3F8] flex items-center justify-center text-[#1E3A8A]">
                <CheckSquare className="w-8 h-8" />
              </div>
            </div>

            {/* BOX 4: TOTAL VIOLATIONS & 3-VIOLATION QUOTA */}
            <div className={`p-5 sm:p-6 rounded-3xl border-2 shadow-md flex items-center justify-between ${
              totalViolations >= 2
                ? 'bg-[#FFF0F0] border-[#C53030] text-[#C53030]'
                : 'bg-[#FFFCF4] border-[#E2D3A7]'
            }`}>
              <div>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider block">
                  4. Malpractice Quota
                </span>
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight block mt-1">
                  {totalViolations} / 3 Strikes
                </span>
                <span className="text-xs font-bold block mt-1">
                  {3 - totalViolations} remaining before Disqualification
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#FED7D7] border-2 border-[#C53030] flex items-center justify-center text-[#C53030]">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* DOWNSIDE SPACE COVER: 4 WIDE TELEMETRY INTERCEPTION BOXES (Spans Full Width) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 px-2 pb-1 border-b border-[#E2D3A7]">
          <ShieldAlert className="w-5 h-5 text-[#B7791F]" />
          <h3 className="text-sm font-extrabold text-[#2D3748] uppercase tracking-wider">
            Downside Telemetry & Anti-Cheat Interceptors (Covering Bottom Space)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* BOX 5: BLOCKED PASTES */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFCF4] border-2 border-[#E2D3A7] shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-extrabold text-[#718096] uppercase tracking-wider block">
                5. Blocked Pastes
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#C53030] block mt-1">
                {pasteAttempts} Blocked
              </span>
              <span className="text-xs font-bold text-[#718096] block mt-1">
                Ctrl+V Real-Time Guard
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFF0F0] border border-[#FECACA] flex items-center justify-center text-[#C53030]">
              <ShieldAlert className="w-7 h-7" />
            </div>
          </div>

          {/* BOX 6: BLOCKED COPIES */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFCF4] border-2 border-[#E2D3A7] shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-extrabold text-[#718096] uppercase tracking-wider block">
                6. Blocked Copies
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#D97706] block mt-1">
                {copyAttempts} Blocked
              </span>
              <span className="text-xs font-bold text-[#718096] block mt-1">
                Clipboard Security Lock
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
              <Copy className="w-7 h-7" />
            </div>
          </div>

          {/* BOX 7: WINDOW TAB SWITCHES */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFCF4] border-2 border-[#E2D3A7] shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-extrabold text-[#718096] uppercase tracking-wider block">
                7. Tab Switches
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#9333EA] block mt-1">
                {tabSwitches} Events
              </span>
              <span className="text-xs font-bold text-[#718096] block mt-1">
                Window Blur / Alt+Tab
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF5FF] border border-[#E9D5FF] flex items-center justify-center text-[#9333EA]">
              <EyeOff className="w-7 h-7" />
            </div>
          </div>

          {/* BOX 8: STUDENT PACE & BASELINE */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFCF4] border-2 border-[#E2D3A7] shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-extrabold text-[#718096] uppercase tracking-wider block">
                8. Answering Pace
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#2D3748] block mt-1">
                {questionSecondsElapsed < 60 ? 'Optimal Pace' : 'Extended Time'}
              </span>
              <span className="text-xs font-bold text-[#718096] block mt-1">
                Target 45s per Question
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] flex items-center justify-center text-[#B7791F]">
              <Zap className="w-7 h-7" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
