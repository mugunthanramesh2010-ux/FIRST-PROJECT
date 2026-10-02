import React, { useState } from 'react';
import {
  BrainCircuit,
  TrendingUp,
  Sparkles,
  Compass,
  Calendar,
  Clock,
  Zap,
  Award,
  Layers,
  CheckCircle2,
  BarChart3,
  ArrowRight
} from 'lucide-react';

export default function LearningDnaView({ user, adaptiveEngine }) {
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'timeline' | 'skills' | 'growth'

  const dna = user?.dnaProfile || adaptiveEngine?.dna || {
    visual: 82,
    analytical: 88,
    practical: 79,
    research: 85,
    memory: 74,
    learningVelocity: 1.4
  };

  const coreLearnerDimensions = [
    {
      key: 'visual',
      label: 'Visual Learner',
      val: dna.visual,
      color: '#00F5D4', // Primary Cyan/Mint
      desc: 'Excels with spatial band diagrams, MOSFET electric field cross-sections, and topology graphs.'
    },
    {
      key: 'analytical',
      label: 'Analytical Learner',
      val: dna.analytical,
      color: '#39FF14', // Cyber Lime
      desc: 'Thrives on electrostatic proofs, differential equations, and quantitative transfer functions.'
    },
    {
      key: 'research',
      label: 'Research Learner',
      val: dna.research,
      color: '#FF007A', // Neon Magenta
      desc: 'Pushes into advanced GAA nanosheets, ITRS scaling limits, and frontier semiconductor literature.'
    },
    {
      key: 'practical',
      label: 'Practical Learner',
      val: dna.practical,
      color: '#FFB800', // Electric Amber
      desc: 'Focussed on real-world switching losses, heat sink thermal resistance, and circuit reliability.'
    }
  ];

  // SVG Radar Polygon calculations centered for 500px x 500px
  const cx = 250;
  const cy = 250;
  const r = 180;
  const totalPoints = coreLearnerDimensions.length;

  const radarPoints = coreLearnerDimensions.map((m, idx) => {
    const angle = (Math.PI * 2 / totalPoints) * idx - Math.PI / 2;
    const distance = (m.val / 100) * r;
    const x = cx + distance * Math.cos(angle);
    const y = cy + distance * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Growth Analysis Milestones
  const growthTimeline = [
    {
      stage: 'Month 1',
      title: 'Foundational Knowledge',
      score: 65,
      velocity: '1.0x',
      desc: 'Core valence bands, Fermi-Dirac statistics, and basic junction electrostatics.'
    },
    {
      stage: 'Month 2',
      title: 'Electrostatic Mastery',
      score: 76,
      velocity: '1.2x',
      desc: 'Threshold voltage Vth derivation, inversion layer formation, and drain current equations.'
    },
    {
      stage: 'Month 3',
      title: 'Analytical & Viva Synthesis',
      score: 88,
      velocity: '1.4x',
      desc: 'Multi-variable drift-diffusion, velocity saturation, and high-frequency Miller capacitance.'
    },
    {
      stage: 'Month 4 (Target)',
      title: 'Research & Innovation Tier',
      score: 95,
      velocity: '1.6x',
      desc: 'Next-gen GaN/SiC power converters, cryogenic quantum CMOS, and patent challenge formulation.'
    }
  ];

  return (
    <div className="space-y-[48px] animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* 1. Header Card */}
      <div className="ent-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-mastered">Cognitive Profile</span>
            <span className="caption-text text-[#8B949E]">Dynamic 4-Axis Adaptive DNA</span>
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-bold text-[#F0F6FC] mt-1 tracking-tight">
            Cognitive Learning DNA &amp; Growth Analysis
          </h1>
          <p className="caption-text mt-1 text-[#8B949E] max-w-2xl">
            Empirically mapped cognitive traits continuously tuned by 10 offline autonomous evaluation agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-[12px] bg-[#0D1117] border border-[#30363D] text-right font-mono">
            <span className="text-[10px] text-[#8B949E] block uppercase font-bold">Velocity Factor</span>
            <span className="text-[20px] font-bold text-[#00F5D4]">1.4x Standard</span>
          </div>
        </div>
      </div>

      {/* 2. RADAR CHART (500px × 500px) & SKILL DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] items-center">
        
        {/* Radar Chart Centerpiece: Exactly 500px × 500px */}
        <div className="lg:col-span-7 ent-card flex flex-col items-center justify-center p-6 sm:p-8 min-h-[560px]">
          <div className="w-full flex justify-between items-center mb-4">
            <h3 className="text-[20px] font-bold text-[#F0F6FC]">Multi-Axis Cognitive Radar</h3>
            <span className="caption-text text-[#00F5D4] font-mono font-bold">500px × 500px Canvas</span>
          </div>

          <div className="w-full max-w-[500px] h-[500px] flex items-center justify-center relative">
            <svg
              className="w-full h-full"
              viewBox="0 0 500 500"
            >
              {/* Concentric Guide Circles (25%, 50%, 75%, 100%) */}
              {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r * level}
                  fill="none"
                  stroke="#30363D"
                  strokeWidth="1"
                  strokeDasharray={level === 1.0 ? 'none' : '4 4'}
                />
              ))}

              {/* Axis Spokes */}
              {coreLearnerDimensions.map((m, idx) => {
                const angle = (Math.PI * 2 / totalPoints) * idx - Math.PI / 2;
                const x2 = cx + r * Math.cos(angle);
                const y2 = cy + r * Math.sin(angle);
                return (
                  <line
                    key={idx}
                    x1={cx}
                    y1={cy}
                    x2={x2}
                    y2={y2}
                    stroke="#30363D"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Dynamic Filled Polygon */}
              <polygon
                points={radarPoints}
                fill="rgba(0, 245, 212, 0.18)"
                stroke="#00F5D4"
                strokeWidth="2.5"
              />

              {/* Data Point Nodes on Spokes */}
              {coreLearnerDimensions.map((m, idx) => {
                const angle = (Math.PI * 2 / totalPoints) * idx - Math.PI / 2;
                const distance = (m.val / 100) * r;
                const px = cx + distance * Math.cos(angle);
                const py = cy + distance * Math.sin(angle);

                // Label offsets
                const lx = cx + (r + 35) * Math.cos(angle);
                const ly = cy + (r + 25) * Math.sin(angle);

                return (
                  <g key={idx}>
                    <circle
                      cx={px}
                      cy={py}
                      r="6"
                      fill={m.color}
                      stroke="#0D1117"
                      strokeWidth="2"
                    />
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      fill="#F0F6FC"
                      fontSize="13"
                      fontWeight="700"
                      fontFamily="Inter, sans-serif"
                    >
                      {m.label} ({m.val}%)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Skill Distribution Breakdown Cards */}
        <div className="lg:col-span-5 space-y-[16px]">
          <h3 className="text-[20px] font-bold text-[#F0F6FC]">Skill Distribution Spectrum</h3>

          {coreLearnerDimensions.map((dim) => (
            <div key={dim.key} className="ent-card p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dim.color }}></span>
                  <strong className="text-[#F0F6FC] text-[15px]">{dim.label}</strong>
                </div>
                <span className="font-mono font-bold text-[16px]" style={{ color: dim.color }}>
                  {dim.val}%
                </span>
              </div>
              <p className="caption-text text-[#8B949E] text-[13px]">{dim.desc}</p>
              <div className="w-full h-2 bg-[#0D1117] rounded-full overflow-hidden border border-[#30363D]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${dim.val}%`, backgroundColor: dim.color }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 3. PROGRESS TIMELINE & GROWTH ANALYSIS */}
      <div className="ent-card space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-[22px] font-bold text-[#F0F6FC]">Progress Timeline &amp; Growth Analysis</h3>
            <p className="caption-text text-[#8B949E]">Historical milestone trajectory and cognitive acceleration</p>
          </div>
          <span className="badge-mastered">Tier 3 Verified</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] pt-2">
          {growthTimeline.map((item, idx) => (
            <div key={idx} className="p-5 rounded-[16px] bg-[#0D1117] border border-[#30363D] space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="font-mono text-[#00F5D4] font-bold">{item.stage}</span>
                  <span className="font-bold text-[#39FF14]">{item.velocity}</span>
                </div>
                <h4 className="text-[16px] font-bold text-[#F0F6FC] mt-1">{item.title}</h4>
                <p className="caption-text text-[#8B949E] text-[12px] mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#30363D] flex justify-between items-center text-[12px]">
                <span className="text-[#8B949E]">Score Index</span>
                <span className="font-mono font-bold text-[#00F5D4] text-[15px]">{item.score} / 100</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
