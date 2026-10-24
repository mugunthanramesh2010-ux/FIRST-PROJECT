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
  Activity,
  X,
  Gauge,
  Layers,
  Sparkles,
  Lock
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

  // Dedicated Proctoring & Telemetry Drawer / Modal State
  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState(false);

  // Live Anti-Cheat Tracking State
  const [tabSwitches, setTabSwitches] = useState(0);
  const [copyAttempts, setCopyAttempts] = useState(0);
  const [pasteAttempts, setPasteAttempts] = useState(0);
  const [disqualificationModal, setDisqualificationModal] = useState(false);

  // Dynamic Metrics (Real, never hardcoded)
  const totalViolations = tabSwitches + copyAttempts + pasteAttempts;
  const liveAuthenticity = Math.max(0, 100 - (tabSwitches * 20 + pasteAttempts * 25 + copyAttempts * 15));
  
  // Calculate dynamic accuracy from past answered questions
  const answeredCount = sessionQuestionHistory?.length || 0;
  const correctCount = sessionQuestionHistory?.filter(q => q.status === 'Correct').length || 0;
  const dynamicAccuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 100;

  // Determine whether this question has legitimate, non-fabricated MCQ options
  const hasValidOptions = Boolean(
    question?.options &&
    Array.isArray(question.options) &&
    question.options.length >= 2
  );

  const getInitialMode = () => {
    if (isTextOnly) return 'text';
    if (isMcqOnly) return hasValidOptions ? 'mcq' : 'text';
    if (question?.type === 'text') return 'text';
    if (question?.type === 'mcq') return hasValidOptions ? 'mcq' : 'text';
    return hasValidOptions ? 'mcq' : 'text';
  };

  // Options: Copy and shuffle options for display without mutating original question record
  const [shuffledItems, setShuffledItems] = useState([]);
  const [answerMode, setAnswerMode] = useState(getInitialMode);

  useEffect(() => {
    if (!hasValidOptions) {
      setShuffledItems([]);
      return;
    }

    const origCorrect = typeof question?.correctIndex === 'number' &&
      question.correctIndex >= 0 &&
      question.correctIndex < question.options.length
      ? question.correctIndex
      : 0;

    // Create copies with original index mapping without mutating question
    const indexed = question.options.map((opt, idx) => ({
      text: opt,
      originalIndex: idx,
      isCorrect: idx === origCorrect
    }));

    // Fisher-Yates Shuffle
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }

    setShuffledItems(indexed);
  }, [questionIndex, question, hasValidOptions]);
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
      const originalIdx = shuffledItems[selectedOption]?.originalIndex ?? selectedOption;
      onSubmitAnswer(originalIdx, metrics, questionSecondsElapsed);
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
  const adaptiveNote = question?.adaptiveNote || null;

  return (
    <div className="w-full max-w-[960px] mx-auto py-4 sm:py-6 space-y-6 animate-fade-in text-left flex flex-col items-center">
      
      {/* 1. TOP BAR: Question X / Y | Difficulty | Marks | Timer */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 px-1 text-sm font-bold text-[#2D3748]">
        
        {/* Left: Question Counter & Difficulty */}
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-sm font-black text-[#B7791F]">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-extrabold text-[#2D3748]">
            Difficulty: <span className="text-[#B7791F]">{difficulty || 'Bloom Scale'}</span>
          </span>
          {adaptiveNote && (
            <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#E6F4EA] border border-[#A8DAB5] text-xs font-bold text-[#2F855A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{adaptiveNote}</span>
            </span>
          )}
        </div>

        {/* Right: Marks, Timer, and the SEPARATE TELEMETRY / PROCTORING ICON BUTTON */}
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

          {/* SEPARATE ICON BUTTON FOR SCORES & TELEMETRY */}
          <button
            type="button"
            onClick={() => setIsTelemetryModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF3D6] border-2 border-[#E2D3A7] hover:bg-[#B7791F] hover:text-white transition-all cursor-pointer text-xs font-bold text-[#8B5E34] shadow-xs"
            title="Open Live Proctoring & Candidate Telemetry Monitor"
          >
            <ShieldAlert className="w-4 h-4 text-[#B7791F]" />
            <span className="hidden sm:inline">Telemetry & Scores</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              totalViolations === 0 ? 'bg-[#E6F4EA] text-[#2F855A]' : 'bg-[#FEE2E2] text-[#B91C1C]'
            }`}>
              {totalViolations}/3 Strikes
            </span>
          </button>
        </div>

      </div>

      {/* 2. CENTER CARD: Question Statement */}
      <div className="w-full bg-[#FFFCF4] border border-[#E2D3A7] rounded-[18px] p-6 sm:p-8 shadow-[0px_8px_24px_rgba(183,121,31,0.08)]">
        <h2 className="text-xl sm:text-[24px] font-bold text-[#2D3748] leading-[1.4] tracking-tight break-words">
          {questionTitle}
        </h2>
      </div>

      {/* 3. ANSWER MODE INDICATOR OR SWITCHER */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3">
        {isMcqOnly ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-[12px] bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-bold text-[#8B5E34]">
            <CheckSquare className="w-4 h-4 text-[#B7791F]" />
            <span>Faculty Assigned: <strong>Choice Based (MCQ)</strong></span>
          </div>
        ) : isTextOnly ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-[12px] bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-bold text-[#8B5E34]">
            <FileText className="w-4 h-4 text-[#B7791F]" />
            <span>Faculty Assigned: <strong>Conceptual Text Explanation</strong></span>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-1 bg-[#FFF3D6] rounded-[12px] border border-[#E2D3A7]">
            <button
              type="button"
              onClick={() => setAnswerMode('mcq')}
              className={`px-3.5 py-1.5 rounded-[9px] text-xs font-bold flex items-center gap-1.5 transition-all ${
                answerMode === 'mcq'
                  ? 'bg-[#B7791F] text-white shadow-xs'
                  : 'text-[#8B5E34] hover:bg-[#FFF8E8]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Choice Based (MCQ)</span>
            </button>
            <button
              type="button"
              onClick={() => setAnswerMode('text')}
              className={`px-3.5 py-1.5 rounded-[9px] text-xs font-bold flex items-center gap-1.5 transition-all ${
                answerMode === 'text'
                  ? 'bg-[#B7791F] text-white shadow-xs'
                  : 'text-[#8B5E34] hover:bg-[#FFF8E8]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Text Explanation</span>
            </button>
          </div>
        )}

        <span className="text-xs text-[#718096]">
          {answerMode === 'mcq' ? 'Select the most accurate option below' : 'Articulate your explanation in detail'}
        </span>
      </div>

      {/* 4. ANSWER AREA & BOTTOM BUTTONS */}
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        
        {answerMode === 'mcq' ? (
          <div className="space-y-3 w-full">
            <div className="grid grid-cols-1 gap-3 w-full">
              {availableOptions.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`p-5 sm:p-6 rounded-2xl border-2 cursor-pointer flex items-center gap-5 transition-all shadow-sm ${
                      isSelected
                        ? 'border-[#B7791F] bg-[#FFF3D6] ring-4 ring-[#B7791F]/20 scale-[1.008]'
                        : 'border-[#E2D3A7] bg-[#FFFCF4] hover:border-[#B7791F] hover:bg-[#FFFDF8]'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-black text-base shrink-0 ${
                      isSelected
                        ? 'border-[#B7791F] bg-[#B7791F] text-white shadow-xs'
                        : 'border-[#E2D3A7] bg-[#FFF8E8] text-[#8B5E34]'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-base font-semibold text-[#2D3748] flex-1 break-words">
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
                className="w-full h-[240px] text-lg font-medium p-6 rounded-2xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] outline-none resize-vertical leading-relaxed shadow-inner focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all"
                required
              />
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E2D3A7]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onRequestHint}
                className="px-6 py-3.5 rounded-xl bg-[#FFF3D6] hover:bg-[#B7791F] hover:text-white border-2 border-[#E2D3A7] text-[#8B5E34] font-extrabold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-5 h-5 text-[#B7791F]" />
                <span>Request Hint {activeHintCount > 0 ? `(Level ${activeHintCount}/4)` : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTelemetryModalOpen(true)}
                className="px-4 py-3.5 rounded-xl bg-[#FFF8E8] hover:bg-[#FFF3D6] border border-[#E2D3A7] text-[#718096] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Gauge className="w-4 h-4 text-[#B7791F]" />
                <span>View Live Proctoring Signals</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={answerMode === 'mcq' ? selectedOption === null : !textAnswer.trim()}
              className="px-12 py-4 rounded-xl bg-[#B7791F] hover:bg-[#975A16] disabled:opacity-50 text-white font-extrabold text-lg shadow-lg shadow-[#B7791F]/25 flex items-center gap-3 transition-all cursor-pointer"
            >
              <span>Submit Answer</span>
              <Send className="w-5 h-5 ml-1" />
            </button>
          </div>
        ) : (
          <div className="space-y-2 w-full">
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="State your technical answer clearly. Articulate physical operational mechanisms, governing laws, or analytical derivations..."
              className="w-full min-h-[220px] text-base sm:text-[18px] p-5 rounded-[14px] bg-[#FFFDF8] border border-[#E2D3A7] text-[#2D3748] outline-none resize-vertical leading-[1.6] shadow-inner focus:border-[#B7791F] focus:ring-3 focus:ring-[#B7791F]/15 transition-all font-sans break-words"
              required
            />
          </div>
        )}

        </form>

      </div>

    </div>
  );
}
