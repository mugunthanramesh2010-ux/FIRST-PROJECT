import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  ShieldCheck,
  Award,
  Zap,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
  Cpu,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';

export default function HomeDashboard({
  currentUser,
  topicModel,
  adaptiveEngine,
  onNavigate
}) {
  // Scores & Bar Graphs Optional Display State (Hidden by default when opening webpage)
  const [showScoresAndGraphs, setShowScoresAndGraphs] = useState(false);

  // Student Profile Data
  const student = {
    name: currentUser?.fullName || 'Kanish V',
    regNo: currentUser?.registerNumber || '714022104042',
    dept: currentUser?.department || 'Electronics & Communication Engineering',
    subject: topicModel?.domain || 'VLSI & Solid State Semiconductor Devices',
    topic: topicModel?.title || 'MOSFET'
  };

  // 4 Dashboard Score Cards (Exact: Knowledge, Curiosity, Innovation, Mastery)
  const dashboardScores = [
    {
      title: 'Mastery Score',
      score: 84,
      unit: '%',
      color: '#00F5D4', // Primary Cyan/Mint
      icon: Award,
      status: 'Advanced Mastery'
    },
    {
      title: 'Knowledge Score',
      score: 89,
      unit: '%',
      color: '#39FF14', // Cyber Lime
      icon: Brain,
      status: 'Comprehensive Recall'
    },
    {
      title: 'Curiosity Score',
      score: 92,
      unit: '%',
      color: '#FF007A', // Neon Magenta
      icon: Zap,
      status: 'High Cognitive Depth'
    },
    {
      title: 'Innovation Score',
      score: 78,
      unit: '%',
      color: '#FFB800', // Electric Amber
      icon: Sparkles,
      status: 'Practical Synthesizer'
    }
  ];

  const masteryBreakdown = [
    { area: 'Semiconductor Electrostatics & Threshold Voltage', level: 92, color: 'bg-[#39FF14]' },
    { area: 'Inversion Layer & Pinch-Off Dynamics', level: 86, color: 'bg-[#00F5D4]' },
    { area: 'Drain Current Equations & Velocity Saturation', level: 74, color: 'bg-[#FFB800]' },
    { area: 'Short Channel Effects & Body Bias (Gamma)', level: 68, color: 'bg-[#FF007A]' }
  ];

  return (
    <div className="space-y-[48px] animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* 1. STUDENT IDENTITY BANNER (Card: radius 16px, padding 24px) */}
      <div className="ent-card flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="badge-mastered">Student Portal</span>
            <span className="caption-text font-mono text-[#8B949E]">{student.regNo}</span>
          </div>
          <h1 className="text-[32px] sm:text-[40px] font-bold text-[#F0F6FC] tracking-tight leading-tight">
            Welcome back, <span className="text-[#00F5D4]">{student.name}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[14px] text-[#8B949E]">
            <span>Dept: <strong className="text-[#F0F6FC]">{student.dept}</strong></span>
            <span>•</span>
            <span>Subject: <strong className="text-[#F0F6FC]">{student.subject}</strong></span>
            <span>•</span>
            <span>Current Topic: <strong className="text-[#00F5D4]">{student.topic}</strong></span>
          </div>
        </div>

        {/* Start Viva Primary Button: H 50px, W 160-240px, Radius 12px */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('arena')}
            className="btn-primary"
          >
            <span>Start Viva</span>
            <ArrowRight className="w-4 h-4 text-[#0D1117]" />
          </button>

          <button
            onClick={() => onNavigate('graph')}
            className="btn-secondary"
          >
            <span>Knowledge Map</span>
          </button>
        </div>
      </div>

      {/* OPTIONAL SCORES & BAR GRAPHS TOGGLE ICON BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-[16px] bg-[#161B22] border border-[#30363D] gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowScoresAndGraphs(prev => !prev)}
            className="w-10 h-10 rounded-[10px] bg-[#00F5D4]/10 border border-[#00F5D4]/30 hover:bg-[#00F5D4]/20 flex items-center justify-center text-[#00F5D4] transition-all cursor-pointer shadow-sm group"
            title="Click icon to toggle scores & bar graphs"
          >
            <BarChart3 className="w-5 h-5 text-[#00F5D4] group-hover:scale-110 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[15px] font-bold text-[#F0F6FC]">Cognitive Scores & Concept Mastery Graphs</h4>
              <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-[#21262D] text-[#8B949E] border border-[#30363D]">
                Optional Telemetry
              </span>
            </div>
            <p className="caption-text text-[12px]">
              {showScoresAndGraphs
                ? 'Radial performance scores and concept bar graphs are active below. Click icon to hide.'
                : 'Hidden by default to keep workspace clean. Click the icon to view performance scores & bar graphs.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowScoresAndGraphs(prev => !prev)}
          className="btn-secondary !w-auto !h-[42px] px-4 text-[13px] flex items-center gap-2"
        >
          {showScoresAndGraphs ? <EyeOff className="w-4 h-4 text-[#8B949E]" /> : <Eye className="w-4 h-4 text-[#00F5D4]" />}
          <span>{showScoresAndGraphs ? 'Hide Scores & Graphs' : 'View Scores & Graphs'}</span>
          {showScoresAndGraphs ? <ChevronUp className="w-4 h-4 text-[#8B949E]" /> : <ChevronDown className="w-4 h-4 text-[#8B949E]" />}
        </button>
      </div>

      {/* 2. 4 DASHBOARD SCORE CARDS & MASTERY BARS (Rendered only if requested via icon) */}
      {showScoresAndGraphs && (
        <div className="space-y-[32px] animate-fade-in">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[22px] font-bold text-[#F0F6FC]">Cognitive Performance Metrics</h3>
              <span className="caption-text">Synchronized with 10 Offline Agents</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
              {dashboardScores.map((card, idx) => {
                const Icon = card.icon;
                const radius = 32;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (card.score / 100) * circumference;

                return (
                  <div
                    key={idx}
                    className="score-card w-full lg:w-[280px] xl:w-[300px] h-[160px] mx-auto"
                  >
                    {/* Left: Metric Info & Large Number */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-[8px] flex items-center justify-center"
                          style={{ backgroundColor: `${card.color}20` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: card.color }} />
                        </div>
                        <span className="text-[13px] font-semibold text-[#8B949E]">{card.title}</span>
                      </div>
                      <div className="text-[36px] font-extrabold text-[#F0F6FC] font-mono leading-tight">
                        {card.score}
                        <span className="text-[18px] font-normal text-[#8B949E] ml-1">{card.unit}</span>
                      </div>
                      <div className="text-[11px] font-medium text-[#8B949E] truncate max-w-[150px]">
                        {card.status}
                      </div>
                    </div>

                    {/* Right: Progress Ring */}
                    <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                      <svg className="w-18 h-18 -rotate-90 transform" viewBox="0 0 80 80">
                        <circle
                          cx="40"
                          cy="40"
                          r={radius}
                          stroke="#21262D"
                          strokeWidth="6"
                          fill="transparent"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r={radius}
                          stroke={card.color}
                          strokeWidth="6"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <span className="absolute text-[12px] font-bold font-mono text-[#F0F6FC]">
                        {card.score}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. ANIMATED MASTERY BARS & CURRENT TOPIC OVERVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">
            {/* Animated Topic Mastery Breakdown */}
            <div className="ent-card lg:col-span-2 space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-[20px] font-bold text-[#F0F6FC]">{student.topic} Concept Mastery Breakdown</h4>
                  <p className="caption-text">Dynamic Bloom-calibrated mastery levels across core sub-topics</p>
                </div>
                <span className="badge-mastered">78% Overall</span>
              </div>

              <div className="space-y-4 pt-2">
                {masteryBreakdown.map((item, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="font-semibold text-[#F0F6FC]">{item.area}</span>
                      <span className="font-mono font-bold text-[#00F5D4]">{item.level}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#0D1117] rounded-full overflow-hidden border border-[#30363D]">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                        style={{ width: `${item.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#30363D] flex justify-between items-center">
                <span className="caption-text">Ebbinghaus Retention Baseline: 14 Days Remaining</span>
                <button
                  onClick={() => onNavigate('dna')}
                  className="text-[13px] font-bold text-[#00F5D4] hover:underline flex items-center gap-1"
                >
                  <span>Inspect Learning DNA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Launch & Security Status Card */}
            <div className="ent-card flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-[10px] bg-[#39FF14]/15 border border-[#39FF14]/30 flex items-center justify-center text-[#39FF14] mb-3">
                  <ShieldCheck className="w-5 h-5 text-[#39FF14]" />
                </div>
                <h4 className="text-[18px] font-bold text-[#F0F6FC]">Security Telemetry Active</h4>
                <p className="caption-text mt-1">
                  Zero-Trust keystroke cadence verification is active. Copy, paste, and tab switching are continuously audited.
                </p>
              </div>

              <div className="p-3 rounded-[12px] bg-[#0D1117] border border-[#30363D] space-y-2">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-[#8B949E]">Authenticity Rating</span>
                  <span className="font-bold text-[#39FF14]">{currentUser?.authenticityScore || 100}% Clean</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-[#8B949E]">Human Variance Check</span>
                  <span className="font-bold text-[#00F5D4]">Passed</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('security')}
                className="btn-secondary w-full"
              >
                <span>View Security Center</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
