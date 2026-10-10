import React from 'react';
import {
  BookOpen,
  Layers,
  Award,
  Clock,
  ShieldCheck,
  HelpCircle,
  Play,
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Eye,
  Copy
} from 'lucide-react';

export default function VivaInstructionsPage({
  topicModel,
  onBeginViva,
  onBack,
  assignedSubject,
  assignedMarks,
  assignedCount,
  assignedTime
}) {
  const topic = topicModel?.title || assignedSubject || 'Engineering Assessment';
  const questionCount = assignedCount || topicModel?.questions?.length || 10;
  const marks = assignedMarks || 100;
  const timeLimit = assignedTime ? `${assignedTime} Minutes` : '15 Minutes';
  const difficultyPolicy = 'Bloom Dynamic Scale (Adaptive)';
  const hintPolicy = 'Progressive 4-Level Hints';

  const instructionItems = [
    { label: 'Subject / Syllabus Topic', value: topic, icon: BookOpen },
    { label: 'Total Examination Questions', value: `${questionCount} Structured Questions`, icon: Layers },
    { label: 'Total Available Marks', value: `${marks} Marks`, icon: Award },
    { label: 'Session Time Budget', value: timeLimit, icon: Clock },
    { label: 'Evaluation Methodology', value: difficultyPolicy, icon: ShieldCheck },
    { label: 'Hint Assistance Tier', value: hintPolicy, icon: HelpCircle }
  ];

  const securityGuidelines = [
    { title: 'Zero Tab Switching (Focus Locked)', desc: 'Switching away from the examination window or minimizing it triggers an immediate violation strike.', icon: Eye },
    { title: 'Clipboard Pasting Blocked (Ctrl+V)', desc: 'Pasting external or generated content into answer boxes is actively intercepted and logged.', icon: Lock },
    { title: 'Clipboard Copying Blocked (Ctrl+C)', desc: 'Copying or cutting question text from the assessment viewport is restricted.', icon: Copy },
    { title: 'Automatic Disqualification Threshold', desc: 'Any student reaching a total of 3 security violations will have the exam terminated immediately with a score of 0 / 100.', icon: AlertTriangle }
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in py-2 text-left">
      
      {/* Header Banner - Full Width */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2D3A7] pb-4 gap-3">
        <div>
          <span className="text-xs font-mono font-bold text-[#8B5E34]">Page 11 • Official Examination Protocol</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2D3748] tracking-tight mt-1">
            Viva Assessment Instructions
          </h1>
          <p className="text-xs sm:text-sm text-[#718096]">
            Review all examination parameters, rubric criteria, and anti-cheat policies before commencing the viva.
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="self-start sm:self-auto px-4 py-2 rounded-xl border border-[#E2D3A7] bg-[#FFF8E8] text-xs font-bold text-[#8B5E34] hover:bg-[#B7791F] hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Arena</span>
          </button>
        )}
      </div>

      {/* FULL-SCREEN 12-COLUMN WIDESCREEN GRID - Covers 100% of Width */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        
        {/* LEFT COLUMN (7 of 12 columns): Oral Assessment Protocol Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="ent-card p-6 sm:p-8 space-y-6 bg-[#FFFCF4] border-2 border-[#E2D3A7] rounded-3xl shadow-lg shadow-[#B7791F]/10">
            
            <div className="flex items-center gap-4 border-b border-[#E2D3A7] pb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF3D6] border-2 border-[#E2D3A7] flex items-center justify-center text-[#B7791F] shrink-0 shadow-sm">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-[#E6F4EA] border border-[#A8DAB5] text-[#2F855A] text-xs font-black uppercase tracking-wider inline-block">
                  Verified Ready for Examination
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#2D3748] mt-1">
                  Examination Configuration Parameters
                </h2>
              </div>
            </div>

            {/* Instruction Items List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {instructionItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FFFDF8] border-2 border-[#E2D3A7] space-y-1 shadow-xs"
                  >
                    <span className="text-xs font-extrabold text-[#718096] uppercase tracking-wider flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#B7791F]" />
                      <span>{item.label}</span>
                    </span>
                    <strong className="text-base font-black text-[#2D3748] block truncate">
                      {item.value}
                    </strong>
                  </div>
                );
              })}
            </div>

            {/* Big Begin Viva Button */}
            <div className="pt-4 border-t border-[#E2D3A7]">
              <button
                onClick={onBeginViva}
                className="w-full py-4.5 rounded-2xl bg-[#B7791F] hover:bg-[#975A16] text-white text-base sm:text-lg font-black shadow-lg shadow-[#B7791F]/25 flex items-center justify-center gap-3 transition-all cursor-pointer text-center"
              >
                <Play className="w-5 h-5 text-[#FFF3D6]" />
                <span>Begin Viva Examination Now ({questionCount} Questions)</span>
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN (5 of 12 columns): Real-Time Anti-Cheat Policy & Security Protocol */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="p-6 rounded-3xl bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-4 shadow-md">
            <div className="flex items-center gap-2 border-b border-[#E2D3A7] pb-3 text-[#C53030]">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-black uppercase tracking-wide">
                Integrity & Malpractice Rules
              </h3>
            </div>

            <div className="space-y-3">
              {securityGuidelines.map((rule, idx) => {
                const Icon = rule.icon;
                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#E2D3A7] space-y-1">
                    <div className="flex items-center gap-2 text-xs font-black text-[#2D3748]">
                      <Icon className="w-4 h-4 text-[#C53030]" />
                      <span>{rule.title}</span>
                    </div>
                    <p className="text-[11px] text-[#718096] leading-relaxed pl-6">
                      {rule.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF0F0] border-2 border-[#FECACA] flex items-center gap-3 text-xs font-bold text-[#C53030]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <span>
                3 Violations Strike Limit: Exam automatically closes, score stamped as 0, and logged as Disqualified.
              </span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#E6F4EA] border-2 border-[#A8DAB5] flex items-center gap-3 text-xs font-bold text-[#2F855A]">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <span>
              All answers evaluated locally in real-time. Zero latency, 100% offline accuracy.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
