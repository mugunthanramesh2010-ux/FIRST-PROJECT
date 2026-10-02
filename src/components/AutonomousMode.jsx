import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Cpu,
  BookOpen,
  Award,
  Download,
  AlertTriangle,
  Play
} from 'lucide-react';
import { generateUniversalTopicModel, DOMAIN_CATEGORIES } from '../services/universalOntology';

export default function AutonomousMode({ onLaunchTopicSession, onOpenReport }) {
  const [topicInput, setTopicInput] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [isGenerating, setIsGenerating] = useState(false);
  const [autonomousRoadmap, setAutonomousRoadmap] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const sampleAutonomousTopics = [
    'Satellite Communication & Orbit Mechanics',
    'Quantum Key Distribution (QKD)',
    'CRISPR-Cas9 Off-Target Mutagenesis',
    'Transformer Self-Attention Mechanisms',
    'High-Frequency Algorithmic Market Making',
    'Indian Supreme Court Basic Structure Doctrine'
  ];

  const handleGenerateRoadmap = (topicName) => {
    const target = topicName || topicInput;
    if (!target.trim()) return;

    setIsGenerating(true);
    setAutonomousRoadmap(null);

    setTimeout(() => {
      const model = generateUniversalTopicModel(target, selectedDomain);
      const roadmap = {
        topic: model.title,
        domain: model.domain,
        model,
        steps: [
          {
            id: 1,
            title: 'Prerequisite Foundation Audit',
            desc: `Examine baseline understanding of ${model.prerequisites[0]?.name || 'Foundational Principles'}.`,
            status: 'ready'
          },
          {
            id: 2,
            title: 'Dynamic Questioning Journey',
            desc: `Multi-stage adaptive viva spanning Bloom levels 1-4 with keystroke authenticity verification.`,
            status: 'pending'
          },
          {
            id: 3,
            title: 'Weak Concept Auto-Remediation',
            desc: `Backward knowledge graph traversal to patch conceptual blind spots.`,
            status: 'pending'
          },
          {
            id: 4,
            title: 'Real-World / Innovation Challenge',
            desc: model.innovationChallenge,
            status: 'pending'
          },
          {
            id: 5,
            title: 'Comprehensive Mastery Dossier',
            desc: `Export verifiable tamper-evident evaluation report with Learning DNA and Cognitive Twin forecast.`,
            status: 'pending'
          }
        ]
      };
      setAutonomousRoadmap(roadmap);
      setIsGenerating(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Autonomous Mode Banner */}
      <div className="glass-panel p-6 border-l-4 border-slate-900 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <span className="badge badge-purple">Self-Directed AI Agent</span>
          <span className="text-xs text-slate-500 font-medium">SIH Innovation Feature • Zero Faculty Required</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1 font-heading">
          Autonomous Learning & Mastery Engine
        </h2>
        <p className="text-xs text-slate-600 max-w-3xl mt-1 leading-relaxed">
          Enter <strong>ANY</strong> topic, domain, or interdisciplinary skill. The Autonomous AI orchestrates the entire learning arc: discovers dependencies, creates structured roadmap, generates progressive viva challenges, reinforces weak spots, and certifies mastery.
        </p>
      </div>

      {/* Topic Input Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Enter ANY topic (e.g. Satellite Communication, MOSFET, CRISPR, Reinforcement Learning...)"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateRoadmap()}
              className="glass-input pl-11 py-3 text-sm"
            />
          </div>

          <button
            onClick={() => handleGenerateRoadmap()}
            disabled={isGenerating || !topicInput.trim()}
            className="btn-primary py-3 px-6 text-sm font-bold shrink-0 shadow-md"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-spin" /> Synthesizing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" /> Synthesize Autonomous Roadmap
              </span>
            )}
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-bold">Try Benchmark:</span>
          {sampleAutonomousTopics.map((top) => (
            <button
              key={top}
              onClick={() => {
                setTopicInput(top);
                handleGenerateRoadmap(top);
              }}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 transition-all font-medium"
            >
              {top}
            </button>
          ))}
        </div>
      </div>

      {/* Autonomous Roadmap Display */}
      {autonomousRoadmap && (
        <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-sm animate-fade-in space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="badge badge-cyan text-xs">Automated Pipeline Generated</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 font-heading">
                {autonomousRoadmap.topic}
              </h3>
              <div className="text-xs text-slate-500 font-medium">
                Universal Domain: {autonomousRoadmap.domain} • Prerequisite Count: {autonomousRoadmap.model.prerequisites.length}
              </div>
            </div>

            <button
              onClick={() => onLaunchTopicSession(autonomousRoadmap.model)}
              className="btn-primary py-2.5 px-6 text-sm font-bold flex items-center gap-2 shadow-md"
            >
              <Play className="w-4 h-4 fill-current text-sky-400" />
              <span>Launch Autonomous Viva Now</span>
            </button>
          </div>

          {/* Stepper Pipeline */}
          <div className="space-y-3.5">
            {autonomousRoadmap.steps.map((step) => (
              <div
                key={step.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                  {step.id}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>{step.title}</span>
                    {step.id === 1 && <span className="badge badge-emerald text-[9px]">Active Step</span>}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Powered by Multi-Agent AI Pipeline (Question, Difficulty, Knowledge Gap & Security Agents)</span>
            <span className="text-emerald-700 font-bold">100% Offline Local Processing</span>
          </div>
        </div>
      )}
    </div>
  );
}
