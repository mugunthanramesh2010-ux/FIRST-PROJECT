import React from 'react';
import {
  X,
  Sparkles,
  BrainCircuit,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Layers,
  HelpCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function QuestionEvolutionModal({
  isOpen,
  onClose,
  questionHistory = [],
  currentQuestion,
  xaiBadge,
  learningDna
}) {
  if (!isOpen) return null;

  // Default Evolution History
  const history = questionHistory.length > 0 ? questionHistory : [
    {
      qIndex: 1,
      text: 'What is a MOSFET? Explain the electrostatics of how a positive gate voltage Vgs above threshold Vth induces an n-channel inversion layer in a p-type substrate.',
      whyAsked: 'Establishes baseline foundation in MOS electrostatics and carrier thermodynamics.',
      gapIdentified: 'Surface potential ψs bending threshold and depletion approximation.',
      diffReason: 'Scaled to 3.92/5.0 based on 75% reasoning mastery and zero prior security infractions.',
      bloomReason: 'Level 2 (Understanding) required before evaluating non-linear switching derivatives.',
      dnaInfluence: 'Analytical DNA (88%) prompted mathematical proof of band-bending constraints.',
      xaiTrace: 'Root: Physics ──> MOS Diode ──> Inversion Charge. Confidence: 97.4%'
    },
    {
      qIndex: 2,
      text: 'Compare MOSFET vs BJT in high-frequency switching converters. Why does the absence of minority carrier storage give MOSFETs lower switching loss?',
      whyAsked: 'Tests comparative synthesis and practical circuit implementation tradeoffs.',
      gapIdentified: 'Reverse recovery charge Qrr in body diodes and gate charge Qg losses.',
      diffReason: 'Progressed to 4.2/5.0 following 92% accurate response on gate dielectric electrostatics.',
      bloomReason: 'Level 4 (Analysis): Requires cross-device topology comparison.',
      dnaInfluence: 'Practical DNA (79%) tuned question towards power converter heat dissipation.',
      xaiTrace: 'Traversal: Conduction ──> Storage Delay ──> Switching Figures of Merit.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-[#D0E3F5] shadow-2xl animate-fade-in my-8 text-xs">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#D0E3F5] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E6F2FD] border border-[#BAE6FD] flex items-center justify-center text-[#4169E1]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#333333] font-heading">
                Question Evolution Panel
              </h3>
              <p className="text-xs text-[#555555]">
                Explainable AI (XAI) transparent trace showing why and how questions evolve
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#333333] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Question History Evolution Trace */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {history.map((item, idx) => (
            <div key={idx} className="p-5 bg-[#F0F8FF] rounded-2xl border border-[#D0E3F5] space-y-3">
              <div className="flex justify-between items-center">
                <span className="badge badge-cyan text-[10px]">
                  Question {item.qIndex || idx + 1} Evolution Step
                </span>
                <span className="text-[11px] font-mono text-[#059669] font-bold">
                  Certified Explainable Trace
                </span>
              </div>

              <div className="font-bold text-sm text-[#333333] leading-relaxed">
                "{item.text}"
              </div>

              {/* 6 Required Explainable Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-[#000080] block">1. Why AI asked this question:</strong>
                  <p className="text-[#555555]">{item.whyAsked}</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-[#E11D48] block">2. Knowledge Gap Identified:</strong>
                  <p className="text-[#555555]">{item.gapIdentified}</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-[#4169E1] block">3. Difficulty Reason:</strong>
                  <p className="text-[#555555]">{item.diffReason}</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-[#059669] block">4. Bloom Level Reason:</strong>
                  <p className="text-[#555555]">{item.bloomReason}</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-[#D97706] block">5. Learning DNA Influence:</strong>
                  <p className="text-[#555555]">{item.dnaInfluence}</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-[#6366F1] block">6. Explainable AI Trace:</strong>
                  <p className="font-mono text-[#333333]">{item.xaiTrace}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end border-t border-[#D0E3F5]">
          <button
            onClick={onClose}
            className="btn-primary py-2 px-6 text-xs font-bold"
          >
            Close Trace Panel
          </button>
        </div>

      </div>
    </div>
  );
}
