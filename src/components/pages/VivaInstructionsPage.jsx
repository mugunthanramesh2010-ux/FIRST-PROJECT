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
  const subject = topicModel?.domain || 'Electronics and Communication Engineering (ECE)';
  const topic = topicModel?.title || 'Communication Engineering';
  const questionCount = topicModel?.questions?.length || 10;
  const marks = 100;
  const timeLimit = '15 Minutes';
  const difficultyPolicy = 'Bloom Dynamic Scale (Remembering → Creation)';
  const hintPolicy = 'Progressive 4-Tier Guidance (No direct answers)';

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

      {/* Main Instructions Card */}
      <div className="w-full max-w-4xl mx-auto text-left space-y-6">
        
        {/* Card 1: Examination Parameters Grid */}
        <div className="ent-card p-6 sm:p-7 space-y-4 bg-[#FFFCF4] border-[#E2D3A7]">
          <div className="flex items-center gap-2 border-b border-[#E2D3A7] pb-3 text-[#2D3748]">
            <BookOpen className="w-5 h-5 text-[#B7791F]" />
            <h3 className="text-base font-extrabold uppercase tracking-wide">
              Examination Parameters & Syllabus Scope
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {instructionItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#E2D3A7] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8B5E34]">
                    <Icon className="w-4 h-4 text-[#B7791F]" />
                    <span>{item.label}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#2D3748] truncate">
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Integrity & Malpractice Rules */}
        <div className="ent-card p-6 sm:p-7 space-y-4 bg-[#FFFCF4] border-[#E2D3A7]">
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

          <div className="p-4 rounded-2xl bg-[#E6F4EA] border-2 border-[#A8DAB5] flex items-center gap-3 text-xs font-bold text-[#2F855A]">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <span>
              All answers evaluated locally in real-time. Zero latency, 100% offline accuracy.
            </span>
          </div>
        </div>

        {/* Card 3: Prominent Start Assessment Call-to-Action */}
        <div className="ent-card p-6 sm:p-7 bg-[#FFF8E8] border-2 border-[#B7791F] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-[#B7791F]/15">
          <div className="text-left space-y-1">
            <h4 className="text-base font-black text-[#2D3748]">
              Ready to Begin Your Assessment?
            </h4>
            <p className="text-xs text-[#718096]">
              Focus lock will activate and session timing will begin immediately.
            </p>
          </div>

          <button
            id="start-viva-assessment-btn"
            type="button"
            onClick={onBeginViva}
            className="btn-primary w-full sm:w-auto h-[52px] px-8 text-base font-black flex items-center justify-center gap-2.5 shadow-md shadow-[#B7791F]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Start Viva Assessment</span>
            <Play className="w-5 h-5 fill-current" />
          </button>
        </div>

      </div>

    </div>
  );
}
