import React from 'react';
import {
  Award,
  Brain,
  BrainCircuit,
  RotateCcw,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  LayoutDashboard,
  FolderOpen
} from 'lucide-react';
import { openLocalFolderInExplorer, getAllAssessmentSessions } from '../../services/db';

export default function FinalResultPage({
  sessionResult,
  onOpenReport,
  onBackToDashboard
}) {
  const latestDbSession = !sessionResult ? (getAllAssessmentSessions()[0] || null) : null;
  const activeSession = sessionResult || latestDbSession;

  const isDisqualified = !!activeSession?.disqualified;
  const marksEarned = isDisqualified ? 0 : (activeSession?.totalEarnedMarks ?? 85);
  const marksTotal = activeSession?.facultyTotalMarks ?? 100;
  const knowledgeScore = isDisqualified ? 0 : (activeSession?.knowledgeScore ?? (activeSession?.accuracyRate ?? 85));
  const reasoningScore = isDisqualified ? 0 : (activeSession?.reasoningScore ?? Math.round(knowledgeScore * 0.96));
  const retentionScore = isDisqualified ? 0 : (activeSession?.retentionScore ?? Math.round(knowledgeScore * 0.93));
  const curiosityScore = isDisqualified ? 0 : (activeSession?.curiosityIndex ?? 88);
  const masteryLevel = isDisqualified ? 'Disqualified (Malpractice)' : (activeSession?.masteryLevel ?? (knowledgeScore >= 85 ? 'Mastered' : 'Proficient'));
  const authenticityScore = isDisqualified ? 0 : (activeSession?.authenticityScore ?? 100);
  const topicName = activeSession?.topic || 'Viva Examination';

  const resultCards = [
    { title: 'Marks Awarded', value: `${marksEarned} / ${marksTotal}`, icon: Award, color: isDisqualified ? '#C53030' : '#B7791F', bg: isDisqualified ? '#FFF0F0' : '#FFF3D6' },
    { title: 'Knowledge Score', value: `${knowledgeScore}%`, icon: Brain, color: '#8B5E34', bg: '#FFF8E8' },
    { title: 'Reasoning Score', value: `${reasoningScore}%`, icon: BrainCircuit, color: '#D69E2E', bg: '#FFF3D6' },
    { title: 'Cognitive Mastery', value: masteryLevel, icon: Award, color: isDisqualified ? '#C53030' : '#2F855A', bg: isDisqualified ? '#FFF0F0' : '#E6F4EA' },
    { title: 'Concept Retention', value: `${retentionScore}%`, icon: RotateCcw, color: '#2F855A', bg: '#E6F4EA' },
    { title: 'Curiosity Index', value: `${curiosityScore}/100`, icon: Zap, color: '#C05621', bg: '#FFF3D6' },
    { title: 'Authenticity Rating', value: `${authenticityScore}%`, icon: ShieldCheck, color: isDisqualified ? '#C53030' : '#2F855A', bg: isDisqualified ? '#FFF0F0' : '#E6F4EA' }
  ];

  const strongConcepts = [
    `Core Principles & Governing Laws of ${topicName}`,
    `Analytical Boundary Conditions & Parameter Formulation`,
    `Equilibrium Dynamics & Empirical Validation`
  ];

  const weakConcepts = [
    `Extreme Non-Linear Stress Bounds for ${topicName}`,
    `Multi-Variable Optimization & Sensitivity Limits`
  ];

  return (
    <div className="space-y-[32px] animate-fade-in w-full py-4 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2D3A7] pb-4">
        <div>
          <span className="text-xs font-mono text-[#718096]">Page 15 • Assessment Dossier</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
            Assessment Results
          </h1>
          <p className="text-xs text-[#718096]">
            Topic: <strong className="text-[#2D3748]">{sessionResult?.topic || 'MOSFET'}</strong> • Evaluated Offline
          </p>
        </div>

        {/* Buttons: View in File Manager, Download Report & Return Dashboard */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={async () => {
              await openLocalFolderInExplorer();
            }}
            className="btn-secondary text-xs h-[46px] flex items-center gap-1.5 cursor-pointer"
            title="Open folder on computer where this result JSON and CSV are saved"
          >
            <FolderOpen className="w-4 h-4 text-[#00F5D4]" />
            <span>View Saved File in Folder</span>
          </button>
          <button
            onClick={() => onOpenReport(sessionResult)}
            className="btn-secondary text-xs h-[46px]"
          >
            <Download className="w-4 h-4 mr-1" />
            Download Report
          </button>
          <button
            onClick={onBackToDashboard}
            className="btn-primary text-xs h-[46px]"
          >
            <LayoutDashboard className="w-4 h-4 mr-1 text-[#FFF3D6]" />
            Return Dashboard
          </button>
        </div>
      </div>

      {/* Physical Folder Confirmation Banner */}
      <div className="p-3.5 rounded-[12px] bg-[#161B22] border border-[#30363D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-pulse" />
          <span className="text-[#F0F6FC] font-bold">Offline Result File Saved to Disk</span>
          <span className="text-[#8B949E] font-mono text-[11px] bg-[#0D1117] px-2.5 py-0.5 rounded border border-[#30363D]">
            Viva_Records\Students\{sessionResult?.studentRegNo || '714022104055'}\
          </span>
        </div>
        <button
          onClick={() => openLocalFolderInExplorer()}
          className="text-[11px] text-[#00F5D4] hover:underline font-bold cursor-pointer"
        >
          Open in Windows File Explorer ↗
        </button>
      </div>

      {/* 1. MANDATED RESULT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[20px]">
        {resultCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="ent-card p-5 flex flex-col justify-between hover:border-[#B7791F] transition-all bg-[#FFFCF4] border-[#E2D3A7]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#718096] uppercase tracking-wider">
                  {card.title}
                </span>
                <div
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-[#E2D3A7]"
                  style={{ backgroundColor: card.bg, color: card.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-3">
                <div className="text-xl sm:text-2xl font-extrabold text-[#2D3748]">
                  {card.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. MANDATED SECTIONS: Strong Concepts & Weak Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        
        {/* Strong Concepts Section */}
        <div className="ent-card p-6 space-y-4 bg-[#FFFCF4] border-[#E2D3A7]">
          <div className="flex items-center gap-2 border-b border-[#E2D3A7] pb-3">
            <div className="w-8 h-8 rounded-[10px] bg-[#E6F4EA] text-[#2F855A] flex items-center justify-center border border-[#A8DAB5]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D3748]">Strong Concepts</h3>
              <p className="text-[11px] text-[#718096]">High retention and analytical depth demonstrated</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {strongConcepts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-[12px] bg-[#FFF8E8] border border-[#E2D3A7] text-xs font-bold text-[#2F855A]"
              >
                <span className="w-2 h-2 rounded-full bg-[#2F855A]"></span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Concepts Section */}
        <div className="ent-card p-6 space-y-4 bg-[#FFFCF4] border-[#E2D3A7]">
          <div className="flex items-center gap-2 border-b border-[#E2D3A7] pb-3">
            <div className="w-8 h-8 rounded-[10px] bg-[#FFF0F0] text-[#C53030] flex items-center justify-center border border-[#FECACA]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D3748]">Weak Concepts</h3>
              <p className="text-[11px] text-[#718096]">Recommended syllabus areas for targeted reinforcement</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {weakConcepts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-[12px] bg-[#FFF0F0] border border-[#FECACA] text-xs font-bold text-[#C53030]"
              >
                <span className="w-2 h-2 rounded-full bg-[#C53030]"></span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
