import React from 'react';
import { HelpCircle, ChevronRight, BrainCircuit, ShieldAlert } from 'lucide-react';

export default function ProgressiveHintEngine({
  isOpen,
  onClose,
  currentLevel, // 1 to 4
  onRequestNextHint,
  question,
  adaptiveEngine
}) {
  if (!isOpen) return null;

  const hintTiers = [
    {
      level: 1,
      title: 'Level 1: Tiny Clue',
      description: question?.hints?.[0] || 'Consider the boundary condition at the semiconductor-oxide interface under equilibrium.',
      note: 'Foundational concept reminder'
    },
    {
      level: 2,
      title: 'Level 2: Concept Direction',
      description: question?.hints?.[1] || 'Relate the applied gate bias directly to band bending and surface potential (ψs = 2ψB).',
      note: 'Directional principle hint'
    },
    {
      level: 3,
      title: 'Level 3: Structured Guidance',
      description: question?.hints?.[2] || 'Examine how mobile carrier inversion alters the electric field gradient across the depletion region.',
      note: 'Structural analytical guidance'
    },
    {
      level: 4,
      title: 'Level 4: Reasoning Path',
      description: question?.hints?.[3] || 'Combine Gauss law with Poisson equation to derive the channel charge proportionality equation.',
      note: 'Final cognitive pathway'
    }
  ];

  const currentHint = hintTiers[currentLevel - 1] || hintTiers[0];
  const isMaxLevel = currentLevel >= 4;

  return (
    <div className="fixed inset-0 z-50 bg-[#2D3748]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="ent-card max-w-lg w-full bg-[#FFFCF4] border-[#E2D3A7] p-6 sm:p-8 space-y-6 shadow-[0px_12px_32px_rgba(183,121,31,0.15)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[12px] bg-[#FFF3D6] border border-[#E2D3A7] flex items-center justify-center text-[#B7791F]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2D3748]">Adaptive Hint Engine</h3>
              <p className="text-[11px] text-[#718096]">Strictly 1 Hint at a Time • Previous Hint Replaced</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#718096] hover:text-[#2D3748] p-1 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Level Indicator Steps */}
        <div className="flex items-center justify-between text-xs px-1">
          {[1, 2, 3, 4].map((lvl) => (
            <div key={lvl} className="flex items-center gap-1.5">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                lvl === currentLevel
                  ? 'bg-[#B7791F] text-white shadow-xs'
                  : lvl < currentLevel
                  ? 'bg-[#2F855A] text-white'
                  : 'bg-[#FFF3D6] text-[#718096] border border-[#E2D3A7]'
              }`}>
                {lvl < currentLevel ? '✓' : lvl}
              </span>
              <span className={`text-[11px] hidden sm:inline ${
                lvl === currentLevel ? 'font-bold text-[#2D3748]' : 'text-[#718096]'
              }`}>
                Level {lvl}
              </span>
            </div>
          ))}
        </div>

        {/* Active Hint Content Card (Previous Hint is Gone) */}
        <div key={currentLevel} className="p-5 rounded-[16px] bg-[#FFF8E8] border border-[#E2D3A7] space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-md bg-[#FFF3D6] border border-[#E2D3A7] text-[11px] font-bold text-[#8B5E34]">
              {currentHint.title}
            </span>
            <span className="text-[10px] font-bold text-[#2F855A] bg-[#E6F4EA] px-2 py-0.5 rounded-md border border-[#A8DAB5]">
              Active (Previous Hint Gone)
            </span>
          </div>

          <p className="text-base text-[#2D3748] font-semibold leading-relaxed">
            {currentHint.description}
          </p>

          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#718096]">
            <BrainCircuit className="w-3.5 h-3.5 text-[#B7791F]" />
            <span>{currentHint.note}</span>
          </div>
        </div>

        {/* Direct Answer Disclaimer */}
        <div className="p-3 rounded-[12px] bg-[#FFF3D6] border border-[#E2D3A7] text-[11px] text-[#C05621] flex items-center gap-2 font-medium">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Strict SIH Policy: Direct answers are never revealed. Conceptual synthesis required.</span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={onClose}
            className="btn-outline text-xs h-[44px]"
          >
            Return to Question
          </button>

          {!isMaxLevel ? (
            <button
              onClick={onRequestNextHint}
              className="btn-primary text-xs h-[44px] min-w-0 px-4"
            >
              <span>Next Hint (Level {currentLevel + 1})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs font-bold text-[#C53030] px-3.5 py-2 rounded-[12px] bg-[#FFF0F0] border border-[#FECACA]">
              Stop • Maximum 4 Hints Reached
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
