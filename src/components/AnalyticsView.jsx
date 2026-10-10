import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Brain,
  Clock,
  Award,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Filter,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { getAllAssessmentSessions } from '../services/db';

export default function AnalyticsView({ topicModel, onNavigateToViva }) {
  const [selectedSubject, setSelectedSubject] = useState(topicModel?.title || 'MOSFET');
  const [timeRange, setTimeRange] = useState('month'); // 'week' | 'month' | 'semester'
  
  // Collapsible section states
  const [bloomExpanded, setBloomExpanded] = useState(true);
  const [velocityExpanded, setVelocityExpanded] = useState(true);
  const [weaknessExpanded, setWeaknessExpanded] = useState(false);
  const [predictiveExpanded, setPredictiveExpanded] = useState(false);

  const kpis = [
    {
      title: 'Subject Mastery',
      value: '78.4%',
      delta: '+5.2%',
      trend: 'up',
      subtitle: 'Based on 4 viva evaluations',
      color: 'text-[#00F5D4]'
    },
    {
      title: 'Cognitive Velocity',
      value: '3.4 c/hr',
      delta: '+0.8 c/hr',
      trend: 'up',
      subtitle: 'Concepts mastered per hour',
      color: 'text-[#39FF14]'
    },
    {
      title: '14-Day Retention',
      value: '86.2%',
      delta: '+2.1%',
      trend: 'up',
      subtitle: 'Ebbinghaus curve adherence',
      color: 'text-[#FFB800]'
    },
    {
      title: 'Attending Velocity',
      value: '42s / Q',
      delta: '-6s faster',
      trend: 'up',
      subtitle: 'Within normal human baseline',
      color: 'text-[#FF007A]'
    },
    {
      title: 'Authenticity Index',
      value: `${getAllAssessmentSessions().length ? Math.round(getAllAssessmentSessions().reduce((acc, s) => acc + (s.authenticityScore || 100), 0) / getAllAssessmentSessions().length) : 100}%`,
      delta: 'Dynamic Verified',
      trend: 'stable',
      subtitle: 'Zero malpractice detected',
      color: 'text-[#39FF14]'
    }
  ];

  const bloomLevels = [
    { level: 'Level 1: Remembering', score: 94, status: 'Mastered', color: 'bg-[#39FF14]' },
    { level: 'Level 2: Understanding', score: 88, status: 'Mastered', color: 'bg-[#39FF14]' },
    { level: 'Level 3: Applying', score: 76, status: 'Proficient', color: 'bg-[#00F5D4]' },
    { level: 'Level 4: Analyzing', score: 68, status: 'Needs Review', color: 'bg-[#FFB800]' },
    { level: 'Level 5: Evaluating', score: 55, status: 'In Progress', color: 'bg-[#FF007A]' },
    { level: 'Level 6: Creating', score: 42, status: 'Challenging', color: 'bg-[#FF007A]' }
  ];

  const topicWeaknesses = [
    { topic: 'Inversion Layer Electrostatics', weakness: 'Sub-threshold swing calculation', severity: 'Medium', rec: 'Review P-N electrostatics' },
    { topic: 'Body Effect & Gamma', weakness: 'Source-to-body reverse bias equation', severity: 'High', rec: 'Practice numerical derivation' },
    { topic: 'Velocity Saturation', weakness: 'High lateral electric field limit', severity: 'Low', rec: 'Review Short-channel effects' }
  ];

  return (
    <div className="space-y-[48px] max-w-7xl mx-auto animate-fade-in pb-12">
      
      {/* 1. Header with Controls */}
      <div className="ent-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-mastered">Academic Analytics Hub</span>
            <span className="caption-text text-[#8B949E]">Real-Time Evaluation Telemetry</span>
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-bold text-[#F0F6FC] mt-1 tracking-tight">
            Performance &amp; Cognitive Analytics
          </h1>
          <p className="caption-text mt-1 text-[#8B949E] max-w-xl">
            Detailed breakdown of knowledge acquisition, response latency, cognitive depth, and exam readiness.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0D1117] border border-[#30363D] px-3.5 py-2 rounded-[12px] text-[13px] font-semibold text-[#00F5D4]">
            <Filter className="w-3.5 h-3.5 text-[#00F5D4]" />
            <span>Subject: {selectedSubject}</span>
          </div>
          
          <div className="flex bg-[#0D1117] p-1 rounded-[12px] border border-[#30363D] text-[12px] font-bold">
            {['week', 'month', 'semester'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeRange(period)}
                className={`px-3 py-1.5 rounded-[8px] transition-all capitalize ${
                  timeRange === period
                    ? 'bg-[#00F5D4] text-[#0D1117] font-bold shadow-sm'
                    : 'text-[#8B949E] hover:text-[#F0F6FC]'
                }`}
              >
                {period === 'week' ? '7D' : period === 'month' ? '30D' : 'Semester'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Top KPI Cards (Cards: Radius 16px, Padding 24px) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[20px]">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="ent-card p-5 flex flex-col justify-between space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider">{kpi.title}</span>
              <span className="text-[10px] font-bold text-[#39FF14] bg-[#39FF14]/15 px-1.5 py-0.5 rounded border border-[#39FF14]/30">
                {kpi.delta}
              </span>
            </div>
            <div>
              <div className={`text-[32px] font-black font-mono ${kpi.color}`}>{kpi.value}</div>
              <p className="text-[11px] text-[#8B949E] mt-0.5">{kpi.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Collapsible Section: Bloom's Taxonomy Cognitive Hierarchy */}
      <div className="ent-card p-0 overflow-hidden">
        <button
          onClick={() => setBloomExpanded(!bloomExpanded)}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-[#1F242C] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#00F5D4]/15 flex items-center justify-center text-[#00F5D4]">
              <Layers className="w-5 h-5 text-[#00F5D4]" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#F0F6FC]">
                Bloom's Taxonomy Cognitive Distribution
              </h2>
              <p className="caption-text text-[#8B949E]">
                Depth of thinking demonstrated across fundamental recall to synthetic creation
              </p>
            </div>
          </div>
          {bloomExpanded ? <ChevronUp className="w-5 h-5 text-[#8B949E]" /> : <ChevronDown className="w-5 h-5 text-[#8B949E]" />}
        </button>

        {bloomExpanded && (
          <div className="p-6 pt-0 border-t border-[#30363D] space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {bloomLevels.map((lvl, index) => (
                <div key={index} className="p-4 bg-[#0D1117] rounded-[12px] border border-[#30363D] space-y-2">
                  <div className="flex justify-between items-center text-[13px] font-bold">
                    <span className="text-[#F0F6FC]">{lvl.level}</span>
                    <span className="font-mono text-[#00F5D4]">{lvl.score}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#161B22] rounded-full overflow-hidden border border-[#30363D]">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${lvl.color}`}
                      style={{ width: `${lvl.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#8B949E]">
                    <span>Status: <strong className="text-[#F0F6FC]">{lvl.status}</strong></span>
                    <span>Target: 80%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Collapsible Section: Attending Velocity & Response Latency Analysis */}
      <div className="ent-card p-0 overflow-hidden">
        <button
          onClick={() => setVelocityExpanded(!velocityExpanded)}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-[#1F242C] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#FFB800]/15 flex items-center justify-center text-[#FFB800]">
              <Clock className="w-5 h-5 text-[#FFB800]" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#F0F6FC]">
                Attending Time vs Difficulty Calibration
              </h2>
              <p className="caption-text text-[#8B949E]">
                Verification that answer times correlate organically with question complexity (anti-fraud telemetry)
              </p>
            </div>
          </div>
          {velocityExpanded ? <ChevronUp className="w-5 h-5 text-[#8B949E]" /> : <ChevronDown className="w-5 h-5 text-[#8B949E]" />}
        </button>

        {velocityExpanded && (
          <div className="p-6 pt-0 border-t border-[#30363D] space-y-4">
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#0D1117] rounded-[12px] border border-[#30363D] text-center space-y-1">
                <span className="text-[11px] font-bold text-[#8B949E] uppercase">Easy Questions (Diff 1-2)</span>
                <div className="text-[24px] font-black font-mono text-[#39FF14]">24 sec avg</div>
                <p className="text-[11px] text-[#39FF14]">Fast, confident retrieval</p>
              </div>

              <div className="p-4 bg-[#0D1117] rounded-[12px] border border-[#30363D] text-center space-y-1">
                <span className="text-[11px] font-bold text-[#8B949E] uppercase">Intermediate (Diff 3)</span>
                <div className="text-[24px] font-black font-mono text-[#00F5D4]">48 sec avg</div>
                <p className="text-[11px] text-[#00F5D4]">Standard analytical processing</p>
              </div>

              <div className="p-4 bg-[#0D1117] rounded-[12px] border border-[#30363D] text-center space-y-1">
                <span className="text-[11px] font-bold text-[#8B949E] uppercase">Complex Synthesis (Diff 4-5)</span>
                <div className="text-[24px] font-black font-mono text-[#FF007A]">76 sec avg</div>
                <p className="text-[11px] text-[#FF007A]">Deep cognitive formulation</p>
              </div>
            </div>

            <div className="p-4 bg-[#0D1117] rounded-[12px] border border-[#30363D] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#39FF14]" />
                <span className="text-[13px] text-[#F0F6FC] font-semibold">
                  Cognitive velocity matches standard organic human distribution across all viva sessions.
                </span>
              </div>
              <span className="badge-mastered">100% Authentic</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Collapsible Section: Topic Weaknesses & Remediation Plan */}
      <div className="ent-card p-0 overflow-hidden">
        <button
          onClick={() => setWeaknessExpanded(!weaknessExpanded)}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-[#1F242C] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#FF007A]/15 flex items-center justify-center text-[#FF007A]">
              <Brain className="w-5 h-5 text-[#FF007A]" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#F0F6FC]">
                Weak Area Diagnosis &amp; Remediation Plan
              </h2>
              <p className="caption-text text-[#8B949E]">
                Targeted concepts identified by the Knowledge Graph AI for proactive review
              </p>
            </div>
          </div>
          {weaknessExpanded ? <ChevronUp className="w-5 h-5 text-[#8B949E]" /> : <ChevronDown className="w-5 h-5 text-[#8B949E]" />}
        </button>

        {weaknessExpanded && (
          <div className="p-6 pt-0 border-t border-[#30363D] space-y-3">
            <div className="pt-4 divide-y divide-[#30363D]">
              {topicWeaknesses.map((item, idx) => (
                <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-[#F0F6FC]">{item.topic}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.severity === 'High' ? 'bg-[#FF007A]/20 text-[#FF007A]' :
                        item.severity === 'Medium' ? 'bg-[#FFB800]/20 text-[#FFB800]' :
                        'bg-[#00F5D4]/20 text-[#00F5D4]'
                      }`}>
                        {item.severity} Priority
                      </span>
                    </div>
                    <p className="caption-text text-[#8B949E] text-[12px] mt-0.5">{item.weakness}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[12px] font-semibold text-[#00F5D4] bg-[#0D1117] px-3 py-1 rounded-[8px] border border-[#30363D]">
                      {item.rec}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {onNavigateToViva && (
              <div className="pt-2 text-right">
                <button
                  onClick={onNavigateToViva}
                  className="btn-primary"
                >
                  <span>Practice in Viva Arena</span>
                  <ArrowUpRight className="w-4 h-4 text-[#0D1117]" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
