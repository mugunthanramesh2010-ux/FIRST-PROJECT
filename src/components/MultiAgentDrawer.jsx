import React from 'react';
import {
  X,
  Bot,
  ShieldCheck,
  Cpu,
  TrendingUp,
  BrainCircuit,
  Award,
  Sparkles,
  Layers,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  Activity,
  Zap
} from 'lucide-react';

export default function MultiAgentDrawer({ isOpen, onClose, agentStates }) {
  if (!isOpen) return null;

  // The 10 Specialized Agents Requested:
  // Question Agent, Difficulty Agent, Hint Agent, Mastery Agent, Knowledge Graph Agent,
  // Security Agent, Innovation Agent, Curiosity Agent, Research Agent, Assessment Agent
  const agents = [
    {
      id: 'question',
      name: 'Question Agent',
      role: 'Bloom Taxonomy Evolution',
      status: 'Online',
      statusColor: 'text-[#059669] bg-emerald-50 border-emerald-200',
      confidence: 98,
      icon: Cpu,
      color: 'text-[#4169E1]',
      action: 'Synthesizing progressive multi-stage Bloom questions calibrated to student Learning DNA.'
    },
    {
      id: 'difficulty',
      name: 'Difficulty Agent',
      role: 'Dynamic Equilibrium',
      status: 'Processing',
      statusColor: 'text-[#4169E1] bg-blue-50 border-blue-200',
      confidence: 96,
      icon: TrendingUp,
      color: 'text-[#000080]',
      action: 'Computing real-time formula: Knowledge + Reasoning + Retention + Velocity + Complexity + Curiosity.'
    },
    {
      id: 'hint',
      name: 'Hint Agent',
      role: 'Cognitive Scaffolding (No Direct Answers)',
      status: 'Online',
      statusColor: 'text-[#059669] bg-emerald-50 border-emerald-200',
      confidence: 97,
      icon: HelpCircle,
      color: 'text-[#D97706]',
      action: 'Serves Level 1-4, Concept Map, Visual, Analogy, Real-World, and Research clues without revealing solutions.'
    },
    {
      id: 'mastery',
      name: 'Mastery Agent',
      role: '5-Threshold Verification',
      status: 'Online',
      statusColor: 'text-[#059669] bg-emerald-50 border-emerald-200',
      confidence: 99,
      icon: Award,
      color: 'text-[#059669]',
      action: 'Assessing Knowledge, Understanding, Reasoning, Application, and Retention mastery thresholds.'
    },
    {
      id: 'kg',
      name: 'Knowledge Graph Agent',
      role: 'Prerequisite Dependency Traversal',
      status: 'Online',
      statusColor: 'text-[#059669] bg-emerald-50 border-emerald-200',
      confidence: 95,
      icon: Layers,
      color: 'text-[#4169E1]',
      action: 'Maps concepts into Completed, In Progress, and Weak Area graph topologies for reinforcement.'
    },
    {
      id: 'security',
      name: 'Security Agent',
      role: 'Zero Copy-Paste & Keystroke Shield',
      status: 'Online',
      statusColor: 'text-[#059669] bg-emerald-50 border-emerald-200',
      confidence: 100,
      icon: ShieldCheck,
      color: 'text-[#E11D48]',
      action: 'Intercepts clipboard paste, tab blur switches, abnormal typing bursts, and scans for AI clichés.'
    },
    {
      id: 'innovation',
      name: 'Innovation Agent',
      role: 'Creative Ideation & Patents',
      status: 'Idle',
      statusColor: 'text-[#777777] bg-slate-100 border-slate-200',
      confidence: 92,
      icon: Sparkles,
      color: 'text-[#4169E1]',
      action: 'Generates real-world patent ideas, industry challenges, startup hypotheses, and future scope inquiry.'
    },
    {
      id: 'curiosity',
      name: 'Curiosity Agent',
      role: 'Student Question Scoring',
      status: 'Processing',
      statusColor: 'text-[#4169E1] bg-blue-50 border-blue-200',
      confidence: 94,
      icon: BrainCircuit,
      color: 'text-[#000080]',
      action: 'Scores student proactive curiosity inquiries and dynamically updates Cognitive Twin curiosity index.'
    },
    {
      id: 'research',
      name: 'Research Agent',
      role: 'Frontier Boundary Exploration',
      status: 'Online',
      statusColor: 'text-[#059669] bg-emerald-50 border-emerald-200',
      confidence: 96,
      icon: BookOpen,
      color: 'text-[#000080]',
      action: 'Cross-checks peer-reviewed ITRS semiconductor limits, subthreshold swing physics, and novel materials.'
    },
    {
      id: 'assessment',
      name: 'Assessment Agent',
      role: 'Attending Time & Marks Evaluator',
      status: 'Online',
      statusColor: 'text-[#059669] bg-emerald-50 border-emerald-200',
      confidence: 99,
      icon: Activity,
      color: 'text-[#059669]',
      action: 'Evaluates answering time vs historic baseline, checks malpractice flags, and awards weighted faculty marks.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border border-[#D0E3F5] max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#D0E3F5] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-cyan text-xs">Autonomous Agent Swarm</span>
              <span className="badge badge-emerald text-xs">100% Offline Local Pipeline</span>
            </div>
            <h2 className="text-2xl font-bold text-[#333333] mt-1 font-heading">
              10 Cooperating Local AI Agents
            </h2>
            <p className="text-xs text-[#555555] mt-0.5 font-medium">
              Cooperative multi-agent intelligence operating locally without external cloud dependencies.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#333333] flex items-center justify-center font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 10 Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="p-4 rounded-2xl border border-[#D0E3F5] bg-[#F0F8FF] flex flex-col justify-between space-y-3 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-[#D0E3F5] shrink-0 shadow-sm">
                      <Icon className={`w-5 h-5 ${agent.color}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#333333]">{agent.name}</h4>
                      <p className="text-[11px] text-[#777777] font-medium">{agent.role}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${agent.statusColor}`}>
                    {agent.status}
                  </span>
                </div>

                <p className="text-xs text-[#555555] leading-relaxed">
                  {agent.action}
                </p>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs">
                  <span className="text-[11px] text-[#777777]">Agent Confidence:</span>
                  <span className="font-mono font-bold text-[#000080]">{agent.confidence}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-[#D0E3F5]">
          <span className="text-xs text-[#777777]">
            All 10 agents maintain state locally via encrypted indexedDB ledger.
          </span>
          <button
            onClick={onClose}
            className="btn-primary text-xs py-2 px-6 font-bold shadow-md"
          >
            Close Agent Monitor
          </button>
        </div>

      </div>
    </div>
  );
}
