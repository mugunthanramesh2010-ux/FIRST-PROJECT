import React, { useState, useEffect, useRef } from 'react';
import { Clock, HelpCircle, Send, CheckSquare, FileText } from 'lucide-react';
import { BehavioralEngine } from '../../services/behavioralEngine';

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
  activeHintCount = 0
}) {
  const isMcqOnly = assignedMode === 'Choice Based (MCQ)' || assignedMode === 'mcq';
  const isTextOnly = assignedMode === 'Conceptual Text' || assignedMode === 'text';

  const [textAnswer, setTextAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(120);

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

  // Initial answer mode based on faculty assigned mode
  const getInitialMode = () => {
    if (isTextOnly) return 'text';
    if (isMcqOnly) return 'mcq';
    return (question?.options && question.options.length > 0) ? 'mcq' : 'mcq';
  };

  const [answerMode, setAnswerMode] = useState(getInitialMode);

  // Silent Anti-Cheat tracking in background (zero visual clutter)
  const [behaviorEngine] = useState(() => new BehavioralEngine());
  const timerRef = useRef(null);

  useEffect(() => {
    setTextAnswer('');
    setSelectedOption(null);
    setSecondsRemaining(120);
    setAnswerMode(getInitialMode());
    behaviorEngine.resetForNewQuestion();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [questionIndex, question]);

  const handleKeyDown = (e) => {
    behaviorEngine.recordKeystroke(e);
  };

  const handlePaste = (e) => {
    behaviorEngine.recordPaste(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answerMode === 'mcq') {
      if (selectedOption === null || selectedOption === undefined) return;
      const metrics = behaviorEngine.calculateFinalMetrics();
      onSubmitAnswer(selectedOption, metrics, Math.max(1, 120 - secondsRemaining));
    } else {
      if (!textAnswer.trim()) return;
      const metrics = behaviorEngine.calculateFinalMetrics();
      onSubmitAnswer(textAnswer.trim(), metrics, Math.max(1, 120 - secondsRemaining));
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const questionTitle = question?.questionText || question?.text || 'Explain the conceptual mechanism and governing equations for this topic.';

  return (
    <div className="w-full max-w-[960px] mx-auto py-4 sm:py-6 space-y-6 animate-fade-in text-left flex flex-col items-center">
      
      {/* 1. TOP BAR: Question X / Y | Difficulty | Marks | Timer */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 px-1 text-sm font-bold text-[#2D3748]">
        
        {/* Question Counter */}
        <div className="text-lg font-extrabold text-[#2D3748]">
          Question {questionIndex + 1} / {totalQuestions}
        </div>

        {/* Top Bar Details */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
          
          <div className="px-3.5 py-1.5 rounded-[12px] bg-[#FFFCF4] border border-[#E2D3A7] text-[#4A5568] shadow-xs">
            Difficulty: <strong className="text-[#B7791F] font-bold">{difficulty || 'Bloom Scale'}</strong>
          </div>

          <div className="px-3.5 py-1.5 rounded-[12px] bg-[#FFFCF4] border border-[#E2D3A7] text-[#4A5568] shadow-xs">
            Marks: <strong className="text-[#8B5E34] font-bold">{assignedMarks} pts</strong>
          </div>

          <div className={`px-3.5 py-1.5 rounded-[12px] border font-mono font-bold flex items-center gap-1.5 shadow-xs ${
            secondsRemaining < 30
              ? 'bg-[#FFF0F0] border-[#FECACA] text-[#C53030] animate-pulse'
              : 'bg-[#FFFCF4] border-[#E2D3A7] text-[#2D3748]'
          }`}>
            <Clock className="w-4 h-4 text-[#8B5E34]" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

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
                    className={`p-4 rounded-[14px] border cursor-pointer flex items-center gap-3.5 transition-all ${
                      isSelected
                        ? 'border-[#B7791F] bg-[#FFF3D6] ring-2 ring-[#B7791F]/30 shadow-xs'
                        : 'border-[#E2D3A7] bg-[#FFFCF4] hover:border-[#B7791F]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'border-[#B7791F] bg-[#B7791F] text-white'
                        : 'border-[#E2D3A7] text-[#718096]'
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

        {/* 5. BOTTOM BUTTONS: Get Hint & Submit Answer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          
          <button
            type="button"
            onClick={onRequestHint}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-5 h-5 text-[#FFF3D6]" />
            <span>Get Hint {activeHintCount > 0 ? `(${activeHintCount}/4)` : ''}</span>
          </button>

          <button
            type="submit"
            disabled={answerMode === 'mcq' ? selectedOption === null : !textAnswer.trim()}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <span>Submit Answer</span>
            <Send className="w-4 h-4 ml-1" />
          </button>

        </div>

      </form>

    </div>
  );
}
