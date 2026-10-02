import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, Award, ArrowRight, BrainCircuit } from 'lucide-react';

export default function AnswerEvaluationPage({
  evaluationResult, // { status: 'Correct' | 'Partially Correct' | 'Needs Improvement', feedback, score, knowledgeChange, reasoningChange, masteryChange }
  onNextQuestion,
  isLastQuestion
}) {
  const status = evaluationResult?.status || 'Correct';
  const feedback = evaluationResult?.feedback || 'Your technical articulation demonstrates robust understanding of operational dynamics and governing laws.';
  
  const knowledgeChange = evaluationResult?.knowledgeChange ?? '+4.5%';
  const reasoningChange = evaluationResult?.reasoningChange ?? '+3.2%';
  const masteryChange = evaluationResult?.masteryChange ?? '+5.0%';

  return (
    <div className="space-y-[32px] animate-fade-in max-w-[1280px] mx-auto py-4">
      
      {/* Header */}
      <div className="border-b border-[#E2D3A7] pb-4 text-left">
        <span className="text-xs font-mono text-[#718096]">Page 14 • Evaluation Protocol</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
          Answer Evaluation
        </h1>
      </div>

      {/* Main Evaluation Card */}
      <div className="max-w-2xl mx-auto text-left">
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
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                status === 'Correct'
                  ? 'bg-[#E6F4EA] text-[#2F855A] border-[#A8DAB5]'
                  : status === 'Partially Correct'
                  ? 'bg-[#FFF3D6] text-[#C05621] border-[#E2D3A7]'
                  : 'bg-[#FFF0F0] text-[#C53030] border-[#FECACA]'
              }`}>
                {status}
              </span>
              <h2 className="text-xl font-bold text-[#2D3748] mt-1">
                {status === 'Correct' && 'Accurate Technical Synthesis'}
                {status === 'Partially Correct' && 'Partially Complete Articulation'}
                {status === 'Needs Improvement' && 'Conceptual Depth Requires Refinement'}
              </h2>
            </div>
          </div>

          {/* Feedback Body */}
          <div className="p-4 rounded-[14px] bg-[#FFF8E8] border border-[#E2D3A7] text-xs sm:text-sm text-[#4A5568] leading-relaxed">
            <span className="font-bold text-[#8B5E34] block mb-1">Evaluator Feedback:</span>
            {feedback}
          </div>

          {/* Mandated Changes: Knowledge Change, Reasoning Change, Mastery Change */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-[#718096] uppercase tracking-wider block">
              Cognitive Trajectory Delta
            </span>
            <div className="grid grid-cols-3 gap-3">
              
              <div className="p-3.5 rounded-[14px] bg-[#FFF8E8] border border-[#E2D3A7] text-center space-y-1">
                <span className="text-[11px] text-[#718096] block">Knowledge</span>
                <strong className="text-base sm:text-lg font-extrabold text-[#B7791F] flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4 text-[#2F855A]" />
                  <span>{knowledgeChange}</span>
                </strong>
                <span className="text-[10px] text-[#718096] block">Recall & Depth</span>
              </div>

              <div className="p-3.5 rounded-[14px] bg-[#FFF8E8] border border-[#E2D3A7] text-center space-y-1">
                <span className="text-[11px] text-[#718096] block">Reasoning</span>
                <strong className="text-base sm:text-lg font-extrabold text-[#8B5E34] flex items-center justify-center gap-1">
                  <BrainCircuit className="w-4 h-4 text-[#8B5E34]" />
                  <span>{reasoningChange}</span>
                </strong>
                <span className="text-[10px] text-[#718096] block">Analytical Logic</span>
              </div>

              <div className="p-3.5 rounded-[14px] bg-[#FFF8E8] border border-[#E2D3A7] text-center space-y-1">
                <span className="text-[11px] text-[#718096] block">Mastery</span>
                <strong className="text-base sm:text-lg font-extrabold text-[#D69E2E] flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-[#D69E2E]" />
                  <span>{masteryChange}</span>
                </strong>
                <span className="text-[10px] text-[#718096] block">Topic Proficiency</span>
              </div>

            </div>
          </div>

          {/* Mandated Button: Next Question (or Finalize) */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={onNextQuestion}
              className="btn-primary w-full max-w-[240px]"
            >
              <span>{isLastQuestion ? 'View Final Results' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
