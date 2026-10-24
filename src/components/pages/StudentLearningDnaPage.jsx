import React from 'react';
import { BrainCircuit, Sparkles, TrendingUp, Award, Layers } from 'lucide-react';

export default function StudentLearningDnaPage({ user, adaptiveEngine }) {
  const dna = adaptiveEngine?.dna || user?.dnaProfile || {
    visual: 78,
    analytical: 88,
    practical: 82,
    research: 85,
    memory: 70,
    learningVelocity: 1.4
  };

  // Metrics mandated in SIH prompt: Visual, Analytical, Practical, Research, Memory, Learning Velocity
  const metrics = [
    { label: 'Visual', value: dna.visual || 78, max: 100, desc: 'Spatial diagram and waveform interpretation' },
    { label: 'Analytical', value: dna.analytical || 88, max: 100, desc: 'Mathematical modeling and derivation strength' },
    { label: 'Practical', value: dna.practical || 82, max: 100, desc: 'Industry implementation & circuit design logic' },
    { label: 'Research', value: dna.research || 85, max: 100, desc: 'Exploratory hypothesis formulation & inquiry' },
    { label: 'Memory', value: dna.memory || 70, max: 100, desc: 'Factual recall and definition precision' },
    { label: 'Learning Velocity', value: Math.round((dna.learningVelocity || 1.4) * 50), rawValue: `${dna.learningVelocity || 1.4}x`, max: 100, desc: 'Rate of conceptual convergence across questions' }
  ];

  // SVG Radar Polygon calculations (Center 160, 160; Radius 105)
  const centerX = 160;
  const centerY = 160;
  const radius = 105;
  const angles = [0, 60, 120, 180, 240, 300].map(deg => (deg - 90) * (Math.PI / 180));

  const radarPoints = metrics.map((m, idx) => {
    const r = (m.value / 100) * radius;
    const x = centerX + r * Math.cos(angles[idx]);
    const y = centerY + r * Math.sin(angles[idx]);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="space-y-[32px] animate-fade-in w-full py-4 text-left">
      
      {/* Header */}
      <div className="border-b border-[#E2D3A7] pb-4">
        <span className="text-xs font-mono text-[#718096]">Page 16 • Cognitive Architecture</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
          Learning DNA
        </h1>
        <p className="text-xs text-[#718096]">
          Multi-dimensional cognitive profile calibrated by offline question interactions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
        
        {/* Radar Chart Card (lg:col-span-5) */}
        <div className="lg:col-span-5 ent-card p-6 flex flex-col items-center justify-between text-center space-y-4 bg-[#FFFCF4] border-[#E2D3A7]">
          <div className="w-full flex items-center justify-between border-b border-[#E2D3A7] pb-3">
            <span className="text-xs font-bold text-[#718096] uppercase tracking-wider">
              Cognitive Radar
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#FFF3D6] border border-[#E2D3A7] text-[11px] font-bold text-[#8B5E34]">
              Calibrated
            </span>
          </div>

          <div className="relative py-2">
            <svg width="320" height="320" className="overflow-visible">
              {/* Concentric Hexagons */}
              {gridLevels.map((lvl, lIdx) => {
                const pts = angles.map(a => {
                  const x = centerX + (radius * lvl) * Math.cos(a);
                  const y = centerY + (radius * lvl) * Math.sin(a);
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <polygon
                    key={lIdx}
                    points={pts}
                    fill="none"
                    stroke="#E2D3A7"
                    strokeWidth="1"
                    strokeDasharray={lIdx < 3 ? '3 3' : 'none'}
                  />
                );
              })}

              {/* Axis spokes */}
              {angles.map((a, aIdx) => {
                const x = centerX + radius * Math.cos(a);
                const y = centerY + radius * Math.sin(a);
                return (
                  <line
                    key={aIdx}
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke="#E2D3A7"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Filled Radar Area in Honey Gold */}
              <polygon
                points={radarPoints}
                fill="rgba(183, 121, 31, 0.2)"
                stroke="#B7791F"
                strokeWidth="2.5"
              />

              {/* Vertex Dots */}
              {metrics.map((m, idx) => {
                const r = (m.value / 100) * radius;
                const x = centerX + r * Math.cos(angles[idx]);
                const y = centerY + r * Math.sin(angles[idx]);
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill="#B7791F"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Axis Labels */}
              {metrics.map((m, idx) => {
                const labelR = radius + 22;
                const x = centerX + labelR * Math.cos(angles[idx]);
                const y = centerY + labelR * Math.sin(angles[idx]);
                return (
                  <text
                    key={idx}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[11px] font-bold fill-[#4A5568]"
                  >
                    {m.label}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="p-3 rounded-[12px] bg-[#FFF8E8] border border-[#E2D3A7] text-[11px] text-[#4A5568] w-full text-center">
            Cognitive Archetype: <strong className="text-[#B7791F]">Analytical Synthesizer</strong> (High Velocity)
          </div>
        </div>

        {/* Breakdown Metric Bars (lg:col-span-7) */}
        <div className="lg:col-span-7 ent-card p-6 space-y-4 bg-[#FFFCF4] border-[#E2D3A7]">
          <div className="border-b border-[#E2D3A7] pb-3">
            <h3 className="text-base font-bold text-[#2D3748]">Dimension Scores & Cognitive Velocity</h3>
            <p className="text-[11px] text-[#718096]">Real-time weightings calibrated continuously by the adaptive AI engine</p>
          </div>

          <div className="space-y-4 pt-1">
            {metrics.map((m, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#2D3748]">{m.label}</span>
                  <span className="text-[#B7791F] font-mono">{m.rawValue || `${m.value}%`}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#FFF3D6] overflow-hidden border border-[#E2D3A7]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#B7791F] to-[#D69E2E] transition-all duration-500"
                    style={{ width: `${m.value}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-[#718096]">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
