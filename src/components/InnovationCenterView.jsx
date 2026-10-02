import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Award,
  TrendingUp,
  Cpu,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Briefcase,
  HelpCircle,
  CheckCircle2,
  FileCheck2,
  Rocket
} from 'lucide-react';

export default function InnovationCenterView({ topicModel, onLaunchChallenge }) {
  const [activeCategory, setActiveCategory] = useState('research'); // 'research' | 'patent' | 'industry' | 'startup' | 'future'
  const topic = topicModel?.title || 'MOSFET (Semiconductors)';

  const researchProblems = [
    {
      title: 'Sub-60 mV/decade Subthreshold Swing via Ferroelectric Negative Capacitance',
      desc: 'Developing Landau-Khalatnikov dynamic polarization models to overcome thermodynamic Boltzmann limits in ultra-low voltage sub-1nm CMOS nodes.',
      difficulty: 'Frontier PhD Level',
      novelty: '96% Novelty Index'
    },
    {
      title: 'Cryogenic 4K Carrier Mobility in FinFET & GAA Nanosheet Transistors',
      desc: 'Addressing surface roughness scattering and interface traps (Dit) for quantum computing readout control interfaces.',
      difficulty: 'Advanced Research',
      novelty: '94% Novelty Index'
    }
  ];

  const patentIdeas = [
    {
      title: 'Asymmetric Dual-Gate Dielectric with Self-Aligned Air-Gap Spacers',
      claims: 'Reduces gate-to-drain overlap capacitance (Cgd) by 42% while retaining high transconductance for mmWave RF communication.',
      filingCategory: 'Semiconductor Device Architecture (USPTO/IPO)',
      patentabilityScore: '92% Strong IP Potential'
    },
    {
      title: 'Thermal Dissipation Micro-Channel Integrated Silicon-on-Diamond (SOD) Substrate',
      claims: 'Direct hetero-epitaxial diamond heat spreading layers eliminating hotspot thermal runaway in power MOSFETs.',
      filingCategory: 'Materials & Packaging',
      patentabilityScore: '89% Strong IP Potential'
    }
  ];

  const industryChallenges = [
    {
      title: 'Automotive Grade AEC-Q101 High-Voltage GaN/Si Avalanche Ruggedness',
      company: 'Electric Vehicle Inverter Tier 1s',
      challenge: 'Preventing dynamic Rds(on) degradation during high-dv/dt short-circuit switching cycles in 800V EV powertrains.'
    },
    {
      title: '3D Monolithic Complementary FET (CFET) Parasitic RC Delay Minimization',
      company: 'Global Foundry Consortiums (TSMC / Intel)',
      challenge: 'Stacking nMOS directly above pMOS with uniform contact resistance below 1e-9 Ω·cm².'
    }
  ];

  const startupIdeas = [
    {
      name: 'NanoCool Power Systems',
      thesis: 'Next-generation Diamond-backed GaN power stages for datacenter AI racks to cut cooling energy overhead by 35%.',
      marketSize: '$12.4B Global TAM',
      stage: 'Seed Incubator Hypothesis'
    },
    {
      name: 'QubitSense Microelectronics',
      thesis: 'Ultra-low thermal noise cryogenic amplifiers for silicon spin qubit quantum sensors.',
      marketSize: '$3.8B Frontier TAM',
      stage: 'Deep-Tech Spinoff'
    }
  ];

  const futureQuestions = [
    {
      q: 'Can 2D Transition Metal Dichalcogenides (TMDs like MoS2) eliminate drain-induced barrier lowering at 0.5nm gate pitch?',
      implication: 'Fundamental quantum confinement limit vs atomic layer roughness.'
    },
    {
      q: 'How will 3D stacked back-side power delivery networks (BSPDN) reshape standard cell IR drop in sub-2nm nodes?',
      implication: 'Power integrity vs thermal bottleneck in extreme compute density.'
    }
  ];

  return (
    <div className="space-y-[48px] animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* 1. Header Card */}
      <div className="ent-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-mastered">Post-Mastery Ideation</span>
            <span className="caption-text text-[#8B949E]">Topic: {topic}</span>
          </div>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-[#F0F6FC] mt-1 tracking-tight">
            Innovation &amp; Research Center
          </h2>
          <p className="caption-text mt-1 text-[#8B949E] max-w-2xl leading-relaxed">
            Transition from foundational academic viva understanding to patent ideation, unsolved frontier problems, and venture-scale technology ventures.
          </p>
        </div>

        {onLaunchChallenge && (
          <button
            onClick={onLaunchChallenge}
            className="btn-primary"
          >
            <span>Launch Viva Arena</span>
            <ArrowRight className="w-4 h-4 text-[#0D1117]" />
          </button>
        )}
      </div>

      {/* 2. Category Nav (Sub-tabs) */}
      <div className="flex bg-[#161B22] p-1.5 rounded-[14px] border border-[#30363D] overflow-x-auto gap-1 text-[13px] font-bold">
        {[
          { id: 'research', label: 'Research Problems', icon: BookOpen },
          { id: 'patent', label: 'Patent Ideas', icon: FileCheck2 },
          { id: 'industry', label: 'Industry Challenges', icon: Briefcase },
          { id: 'startup', label: 'Startup Concepts', icon: Rocket },
          { id: 'future', label: 'Future Scope', icon: HelpCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#00F5D4] text-[#0D1117] font-bold shadow-md shadow-[#00F5D4]/20'
                  : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Dynamic Section Rendering */}
      <div className="space-y-[20px]">
        {/* RESEARCH PROBLEMS */}
        {activeCategory === 'research' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            {researchProblems.map((item, idx) => (
              <div key={idx} className="ent-card flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center text-[12px] mb-2">
                    <span className="badge-mastered">{item.difficulty}</span>
                    <span className="font-mono text-[#00F5D4] font-bold">{item.novelty}</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-[#F0F6FC] leading-snug">{item.title}</h3>
                  <p className="caption-text text-[#8B949E] text-[13px] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#30363D] flex justify-between items-center text-[12px]">
                  <span className="text-[#8B949E]">Status: Open Literature Gap</span>
                  <span className="text-[#00F5D4] font-bold">ITRS Roadmap 2030</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PATENT IDEAS */}
        {activeCategory === 'patent' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            {patentIdeas.map((item, idx) => (
              <div key={idx} className="ent-card flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center text-[12px] mb-2">
                    <span className="badge-learning">Patent Novelty</span>
                    <span className="font-mono text-[#39FF14] font-bold">{item.patentabilityScore}</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-[#F0F6FC] leading-snug">{item.title}</h3>
                  <p className="caption-text text-[#8B949E] text-[13px] mt-2 leading-relaxed">
                    <strong className="text-[#F0F6FC]">Inventive Claims:</strong> {item.claims}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#30363D] flex justify-between items-center text-[12px]">
                  <span className="text-[#8B949E]">Class: {item.filingCategory}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INDUSTRY CHALLENGES */}
        {activeCategory === 'industry' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            {industryChallenges.map((item, idx) => (
              <div key={idx} className="ent-card flex flex-col justify-between space-y-4">
                <div>
                  <span className="badge-weak mb-2 inline-block">Urgent Foundry Priority</span>
                  <h3 className="text-[18px] font-bold text-[#F0F6FC] leading-snug">{item.title}</h3>
                  <div className="text-[12px] text-[#00F5D4] font-semibold mt-1">Sponsor: {item.company}</div>
                  <p className="caption-text text-[#8B949E] text-[13px] mt-2 leading-relaxed">
                    {item.challenge}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#30363D] text-[12px] text-[#8B949E]">
                  Target Resolution: Next Generation Tapeout
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STARTUP CONCEPTS */}
        {activeCategory === 'startup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            {startupIdeas.map((item, idx) => (
              <div key={idx} className="ent-card flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center text-[12px] mb-2">
                    <span className="badge-mastered">{item.stage}</span>
                    <span className="font-mono text-[#00F5D4] font-bold">{item.marketSize}</span>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#F0F6FC] leading-snug">{item.name}</h3>
                  <p className="caption-text text-[#8B949E] text-[13px] mt-2 leading-relaxed">
                    {item.thesis}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#30363D] flex justify-between items-center text-[12px]">
                  <span className="text-[#8B949E]">Deep-Tech IP Barrier: High</span>
                  <span className="text-[#39FF14] font-bold">Venture Scale</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FUTURE SCOPE */}
        {activeCategory === 'future' && (
          <div className="space-y-[20px]">
            {futureQuestions.map((item, idx) => (
              <div key={idx} className="ent-card space-y-3">
                <div className="flex items-center gap-2">
                  <span className="badge-learning">Horizon 2035 Question</span>
                </div>
                <h3 className="text-[18px] font-bold text-[#F0F6FC] leading-relaxed">{item.q}</h3>
                <div className="p-3.5 rounded-[12px] bg-[#0D1117] border border-[#30363D] text-[13px] text-[#8B949E]">
                  <strong className="text-[#00F5D4]">Scientific Implication:</strong> {item.implication}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
