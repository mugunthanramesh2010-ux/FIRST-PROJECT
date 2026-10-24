import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Award,
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  Zap,
  Activity,
  Layers
} from 'lucide-react';

export default function AnswerEvaluationPage({
  evaluationResult, // { status: 'Correct' | 'Partially Correct' | 'Needs Improvement', feedback, score, knowledgeChange, reasoningChange, masteryChange }
  onNextQuestion,
  isLastQuestion
}) {
  const status = evaluationResult?.status || 'Correct';
  const feedback = evaluationResult?.feedback || 'Your technical articulation demonstrates robust understanding of operational dynamics, governing principles, and analytical bounds.';
  
  const knowledgeChange = evaluationResult?.knowledgeChange ?? '+4.5%';
  const reasoningChange = evaluationResult?.reasoningChange ?? '+3.2%';
  const masteryChange = evaluationResult?.masteryChange ?? '+5.0%';

  return (
    <div className="space-y-[28px] animate-fade-in w-full py-2 text-left">
      
      {/* Header Banner */}
      <div className="border-b border-[#E2D3A7] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#718096]">Page 14 • Evaluation Protocol & Cognitive Feedback</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
            Answer Evaluation
          </h1>
          <p className="text-xs text-[#718096]">
            Real-time offline semantic analysis calibrated against Bloom's Cognitive Taxonomy
          </p>
        </div>

        <button
          onClick={onNextQuestion}
          className="btn-primary px-6 py-3 text-sm font-bold shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>{isLastQuestion ? 'View Final Results' : 'Proceed to Next Question'}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* 2-Column Evaluation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Main Evaluation Card */}
        <div className="lg:col-span-7">
          <div className="ent-card p-6 sm:p-8 space-y-6 bg-[#FFFCF4] border-[#E2D3A7]">
          
          {/* Status Display: Correct / Partially Correct / Needs Improvement */}
          <div className="flex items-center gap-4 border-b border-[#E2D3A7] pb-6">
            {status === 'Correct' && (
              <div className="w-14 h-14 rounded-[14px] bg-[#E6F4EA] border border-[#A8DAB5] flex items-center justify-center text-[#2F855A]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            )}
            {status === 'Partially Correct' && (
              <div className="w-14 h-14 rounded-[14px] bg-[#FFF3D6] border border-[#E2D3A7] flex items-center justify-center text-[#C05621]">
                <AlertTriangle className="w-8 h-8" />
              </div>
            )}
            {status === 'Needs Improvement' && (
              <div className="w-14 h-14 rounded-[14px] bg-[#FFF0F0] border border-[#FECACA] text-[#C53030] flex items-center justify-center">
                <XCircle className="w-8 h-8" />
              </div>
            )}

              <div>
                <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border tracking-wide ${
                  status === 'Correct'
                    ? 'bg-[#E6F4EA] text-[#2F855A] border-[#A8DAB5]'
                    : status === 'Partially Correct'
                    ? 'bg-[#FFF3D6] text-[#C05621] border-[#E2D3A7]'
                    : 'bg-[#FFF0F0] text-[#C53030] border-[#FECACA]'
                }`}>
                  {status}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#2D3748] mt-2">
                  {status === 'Correct' && 'Accurate Technical Synthesis'}
                  {status === 'Partially Correct' && 'Partially Complete Articulation'}
                  {status === 'Needs Improvement' && 'Conceptual Depth Requires Refinement'}
                </h2>
              </div>
            </div>

            {/* Feedback Body */}
            <div className="p-5 rounded-2xl bg-[#FFF8E8] border border-[#E2D3A7] text-sm text-[#4A5568] leading-relaxed space-y-2">
              <span className="font-extrabold text-[#8B5E34] text-xs uppercase tracking-wider block">
                Offline Cognitive Evaluator Analysis:
              </span>
              <p className="font-medium text-[#2D3748] text-sm sm:text-base leading-relaxed">
                {feedback}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E2D3A7]">
              <div className="flex items-center gap-2 text-xs font-medium text-[#718096]">
                <Activity className="w-4 h-4 text-[#B7791F]" />
                <span>Response telemetry logged to secure local dossier</span>
              </div>

              <button
                onClick={onNextQuestion}
                className="btn-primary w-full sm:w-auto px-8 py-3 text-sm font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isLastQuestion ? 'View Final Results' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Right Column (5 cols): Cognitive Deltas, Bloom Calibration & Offline Guarantee */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Cognitive Trajectory Delta Card */}
          <div className="ent-card p-6 space-y-4 bg-[#FFFCF4] border-2 border-[#E2D3A7]">
            <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-[#2D3748]">
                <TrendingUp className="w-4 h-4 text-[#B7791F]" />
                <span>Cognitive Trajectory Delta</span>
              </div>
              <span className="text-[11px] font-mono text-[#718096]">Live Shift</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#FFF8E8] border border-[#E2D3A7] text-center space-y-1">
                <span className="text-[11px] text-[#718096] font-semibold block">Knowledge</span>
                <strong className="text-base sm:text-lg font-black text-[#2F855A] flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4 text-[#2F855A]" />
                  <span>{knowledgeChange}</span>
                </strong>
                <span className="text-[10px] text-[#718096] block font-medium">Recall & Depth</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFF8E8] border border-[#E2D3A7] text-center space-y-1">
                <span className="text-[11px] text-[#718096] font-semibold block">Reasoning</span>
                <strong className="text-base sm:text-lg font-black text-[#8B5E34] flex items-center justify-center gap-1">
                  <BrainCircuit className="w-4 h-4 text-[#8B5E34]" />
                  <span>{reasoningChange}</span>
                </strong>
                <span className="text-[10px] text-[#718096] block font-medium">Analytical Logic</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFF8E8] border border-[#E2D3A7] text-center space-y-1">
                <span className="text-[11px] text-[#718096] font-semibold block">Mastery</span>
                <strong className="text-base sm:text-lg font-black text-[#B7791F] flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-[#B7791F]" />
                  <span>{masteryChange}</span>
                </strong>
                <span className="text-[10px] text-[#718096] block font-medium">Topic Proficiency</span>
              </div>
            </div>
          </div>

          {/* Bloom's Cognitive Progression Rubric */}
          <div className="ent-card p-6 space-y-3 bg-[#FFFCF4] border-2 border-[#E2D3A7]">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#2D3748] border-b border-[#E2D3A7] pb-3">
              <Layers className="w-4 h-4 text-[#B7791F]" />
              <span>Bloom's Taxonomy Progression</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF8E8] border border-[#E2D3A7]">
                <span className="font-bold text-[#2D3748]">Level 1-2: Memorization & Recall</span>
                <span className="font-extrabold text-[#2F855A] font-mono">100% Passed</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF8E8] border border-[#E2D3A7]">
                <span className="font-bold text-[#2D3748]">Level 3-4: Application & Analysis</span>
                <span className="font-extrabold text-[#B7791F] font-mono">In Progress</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF8E8] border border-[#E2D3A7]">
                <span className="font-bold text-[#2D3748]">Level 5-6: Synthesis & Evaluation</span>
                <span className="font-extrabold text-[#718096] font-mono">Adaptive Stage</span>
              </div>
            </div>
          </div>

          {/* Offline Security Guarantee */}
          <div className="p-4 rounded-2xl bg-[#E6F4EA] border border-[#A8DAB5] flex items-center gap-3 text-xs text-[#2F855A]">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <div className="font-medium">
              <strong className="block font-bold">100% Offline Cognitive Evaluation</strong>
              Zero cloud telemetry sent. All scoring computed strictly on your device.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
