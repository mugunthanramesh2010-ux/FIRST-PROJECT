import React from 'react';
import { Play, Clock, Award, ShieldCheck, HelpCircle, Layers, ArrowLeft } from 'lucide-react';

export default function VivaInstructionsPage({
  topicModel,
  onBeginViva,
  onBack
}) {
  const subject = topicModel?.domain || 'Electronics and Communication Engineering (ECE)';
  const topic = topicModel?.title || 'MOSFET';
  const questionCount = topicModel?.questions?.length || 10;
  const marks = 100;
  const timeLimit = '15 Minutes';
  const difficultyPolicy = 'Bloom Dynamic Scale (Remembering → Creation)';
  const hintPolicy = 'Progressive 4-Tier Guidance (No direct answers)';

  const instructionItems = [
    { label: 'Subject', value: subject, icon: Layers },
    { label: 'Topic', value: topic, icon: Layers },
    { label: 'Question Count', value: `${questionCount} Adaptive Questions`, icon: Layers },
    { label: 'Marks', value: `${marks} Total Marks`, icon: Award },
    { label: 'Time Limit', value: timeLimit, icon: Clock },
    { label: 'Difficulty Policy', value: difficultyPolicy, icon: ShieldCheck },
    { label: 'Hint Policy', value: hintPolicy, icon: HelpCircle }
  ];

  return (
    <div className="space-y-[32px] animate-fade-in max-w-[1280px] mx-auto py-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-4">
        <div className="text-left">
          <span className="text-xs font-mono text-[#718096]">Page 11 • Examination Protocol</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
            Viva Instructions
          </h1>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="btn-outline text-xs h-[40px]"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back
          </button>
        )}
      </div>

      {/* Main Instructions Card */}
      <div className="max-w-2xl mx-auto text-left">
        <div className="ent-card p-6 sm:p-8 space-y-6 bg-[#FFFCF4] border-[#E2D3A7]">
          
          <div className="space-y-1 border-b border-[#E2D3A7] pb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E6F4EA] border border-[#A8DAB5] text-[#2F855A] text-xs font-bold">
              Ready For Examination
            </span>
            <h2 className="text-xl font-bold text-[#2D3748] mt-2">
              Oral Assessment Protocol
            </h2>
            <p className="text-xs text-[#718096]">
              Please review assessment parameters before initializing the autonomous oral evaluator.
            </p>
          </div>

          {/* Mandated Fields List */}
          <div className="space-y-3">
            {instructionItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-[12px] bg-[#FFF8E8] border border-[#E2D3A7] text-xs font-bold"
                >
                  <span className="text-[#4A5568] flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#B7791F]" />
                    <span>{item.label}</span>
                  </span>
                  <strong className="text-[#2D3748] text-right font-semibold max-w-[60%]">
                    {item.value}
                  </strong>
                </div>
              );
            })}
          </div>

          {/* Mandated Button: Begin Viva */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={onBeginViva}
              className="btn-primary w-full max-w-[240px]"
            >
              <Play className="w-4 h-4 mr-1 text-[#FFF3D6]" />
              Begin Viva
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
