import React, { useState, useEffect } from 'react';
import { Cpu, Search, Sparkles, BookOpen, Layers, ShieldCheck, CheckCircle2, Zap, Brain, ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import { generateUniversalTopicModel, generateUniversalTopicModelAsync } from '../../services/universalOntology';
import { checkOllamaAvailability } from '../../services/aiQuestionService';

export default function SelfLearningPage({ onTopicSelected }) {
  const [topicInput, setTopicInput] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [ollamaStatus, setOllamaStatus] = useState({ available: false, models: [], activeModel: null });
  const [selectedModel, setSelectedModel] = useState('llama3.2:1b');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    checkOllamaAvailability().then(res => {
      setOllamaStatus(res);
      if (res.activeModel) setSelectedModel(res.activeModel);
    });
  }, []);

  const exampleTopics = [
    'Communication Engineering',
    'FPGA-Based VLSI',
    'MOSFET & CMOS',
    'Convolutional Neural Networks',
    'Deep Learning',
    'Constitutional Law',
    'Satellite Communication',
    'Robotics & Control',
    'Biomedical Engineering'
  ];

  const engineeringDomains = [
    { name: 'Communication Eng.', topic: 'Communication Engineering', icon: '📡' },
    { name: 'FPGA & VLSI Design', topic: 'FPGA-Based VLSI', icon: '⚡' },
    { name: 'Semiconductor Physics', topic: 'Semiconductor Devices', icon: '🔬' },
    { name: 'Control Systems', topic: 'Control Systems', icon: '🎛️' },
    { name: 'Computer Networks', topic: 'Computer Networks', icon: '🌐' },
    { name: 'Operating Systems', topic: 'Operating Systems', icon: '💻' },
    { name: 'Digital Signal Proc.', topic: 'Digital Signal Processing', icon: '📊' },
    { name: 'AI & Neural Nets', topic: 'Deep Learning', icon: '🧠' }
  ];

  const questionPresets = [5, 10, 15, 20, 25, 30, 50, 75, 100];

  const handleStart = async (topicName) => {
    const chosen = topicName || topicInput.trim() || 'Communication Engineering';
    const count = Math.min(100, Math.max(1, parseInt(questionCount, 10) || 10));

    setIsGenerating(true);
    try {
      // Generate dynamically with selected Ollama model or instant dynamic synthesizer
      const model = await generateUniversalTopicModelAsync(chosen, 'Universal Domain', count, '', {
        model: selectedModel
      });
      onTopicSelected(model, chosen);
    } catch (err) {
      console.warn('Ollama generation exception handled, falling back:', err);
      const fallbackModel = generateUniversalTopicModel(chosen, 'Universal Domain', count);
      onTopicSelected(fallbackModel, chosen);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in py-2 text-left">
      
      {/* Header Banner - Full Width */}
      <div className="border-b border-[#E2D3A7] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono font-bold text-[#8B5E34]">
            Page 10 • Autonomous Adaptive Viva & Knowledge Synthesis
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2D3748] tracking-tight mt-1">
            Self Learning Arena
          </h1>
          <p className="text-xs sm:text-sm text-[#718096]">
            Enter any subject, engineering discipline, or syllabus concept to synthesize an autonomous oral examination
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-[#E6F4EA] border border-[#A8DAB5] text-xs font-bold text-[#2F855A] flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Unlimited Practice • Retake Until Mastery</span>
          </span>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-bold text-[#8B5E34]">
            <Sparkles className="w-4 h-4 text-[#B7791F]" />
            <span>
              {ollamaStatus.available ? `Hidden AI: Ollama (${ollamaStatus.activeModel})` : 'Offline Domain Engine Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Topic Input Box Container */}
      <div className="w-full max-w-3xl mx-auto py-6">
        <div className="ent-card p-6 sm:p-8 space-y-6 text-center bg-[#FFFCF4] border-[#E2D3A7]">
          
          <div className="w-14 h-14 rounded-[14px] bg-[#FFF3D6] border border-[#E2D3A7] mx-auto flex items-center justify-center text-[#B7791F]">
            <Cpu className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D3748]">
              Choose Your Knowledge Domain
            </h2>
            <p className="text-xs text-[#718096] mt-1">
              The universal ontology engine dynamically constructs questions, evaluation rubric, and prerequisite trees.
            </p>
          </div>

          {/* Topic Input Field */}
          <div className="space-y-2 text-left">
            <label className="form-label">Topic Input</label>
            <div className="relative">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Type any subject (e.g. MOSFET, CNN, Blockchain, Medicine...)"
                className="form-input pl-11 pr-4 h-[52px] text-base"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStart(topicInput);
                }}
              />
              <Search className="w-5 h-5 text-[#8B5E34] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Topic Input Field */}
            <div className="space-y-2 text-left">
              <label className="block text-sm sm:text-base font-extrabold text-[#2D3748]">
                Syllabus Topic or Subject Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g. Stress in Strength of Materials, Hooke’s Law, Mohr’s Circle..."
                  className="w-full text-base sm:text-lg font-bold pl-12 pr-4 py-4 rounded-2xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleStart(topicInput);
                  }}
                />
                <Search className="w-6 h-6 text-[#8B5E34] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Syllabus Preset Chips */}
            <div className="space-y-2 text-left">
              <span className="text-xs font-extrabold text-[#8B5E34] uppercase tracking-wider block">
                Quick Subject Presets:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {exampleTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setTopicInput(topic);
                      handleStart(topic);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#FFF3D6] hover:bg-[#B7791F] hover:text-white text-[#8B5E34] border border-[#E2D3A7] text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Selector (1 to 100 Questions) */}
            <div className="space-y-3 text-left pt-2 border-t border-[#E2D3A7]">
              <div className="flex items-center justify-between">
                <label className="text-sm font-extrabold text-[#2D3748]">
                  Viva Question Count (1 to 100):
                </label>
                <span className="text-sm font-black text-[#B7791F] bg-[#FFF3D6] px-3.5 py-1 rounded-xl border border-[#E2D3A7]">
                  {questionCount} Questions Selected
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {questionPresets.map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setQuestionCount(qty)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-extrabold rounded-xl border-2 transition-all cursor-pointer ${
                      Number(questionCount) === qty
                        ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-sm scale-105'
                        : 'bg-[#FFF8E8] text-[#4A5568] border-[#E2D3A7] hover:border-[#B7791F] hover:bg-[#FFF3D6]'
                    }`}
                  >
                    {qty} Qs
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                  className="w-32 text-base font-black p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                  placeholder="Count"
                />
                <span className="text-xs font-bold text-[#718096]">
                  Enter any custom count from 1 up to 100 questions
                </span>
              </div>
            </div>

            {/* Local Inference Model Selector (Ollama / Local Runtime / Dynamic Engine) */}
            <div className="space-y-2.5 text-left pt-2 border-t border-[#E2D3A7]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-[#8B5E34] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B7791F]" />
                  <span>AI Inference Engine (100% Offline Local Model):</span>
                </label>
                <span className="text-[11px] font-bold text-[#2F855A] bg-[#E6F4EA] px-2 py-0.5 rounded-md border border-[#A8DAB5]">
                  {ollamaStatus.available ? 'Ollama Server Connected' : 'Offline Engine Ready'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(ollamaStatus.models && ollamaStatus.models.length > 0 ? ollamaStatus.models : ['llama3.2:1b', 'llama3.2:latest', 'llama3:latest']).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedModel(m)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedModel === m
                        ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                        : 'bg-[#FFF8E8] text-[#4A5568] border-[#E2D3A7] hover:border-[#B7791F]'
                    }`}
                  >
                    <span>{m}</span>
                    {selectedModel === m && <CheckCircle2 className="w-3 h-3 text-[#FFF3D6]" />}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#718096]">
                Questions, options, answers, and 4-tier progressive hints are synthesized instantly without transmitting any content to cloud services.
              </p>
            </div>

            {/* Big Start Button */}
            <div className="pt-2">
              <button
                disabled={isGenerating}
                onClick={() => handleStart(topicInput)}
                className={`w-full py-4.5 rounded-2xl text-white text-base sm:text-lg font-black shadow-lg shadow-[#B7791F]/25 flex items-center justify-center gap-3 transition-all cursor-pointer text-center ${
                  isGenerating ? 'bg-[#D69E2E] cursor-wait opacity-90' : 'bg-[#B7791F] hover:bg-[#975A16]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#FFF3D6]" />
                    <span>Synthesizing Exam with {selectedModel}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-[#FFF3D6]" />
                    <span>Start Adaptive Viva Examination ({questionCount} Questions)</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN (5 of 12 columns): Real-Time Domain Explorer & Cognitive Rubric (Fills the Right Side) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card 1: Curated Engineering Disciplines */}
          <div className="p-6 rounded-3xl bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#B7791F]" />
                <h3 className="text-base font-extrabold text-[#2D3748]">
                  Curated Engineering Disciplines
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#8B5E34] bg-[#FFF3D6] px-2 py-0.5 rounded-md">
                1-Click Launch
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {engineeringDomains.map((dom, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTopicInput(dom.topic);
                    handleStart(dom.topic);
                  }}
                  className="p-3 rounded-2xl bg-[#FFFDF8] hover:bg-[#FFF3D6] border-2 border-[#E2D3A7] hover:border-[#B7791F] text-left transition-all cursor-pointer flex items-center gap-2.5 group"
                >
                  <span className="text-lg">{dom.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-black text-[#2D3748] truncate group-hover:text-[#B7791F]">
                      {dom.name}
                    </span>
                    <span className="block text-[11px] text-[#718096] truncate">
                      {dom.topic}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Bloom's Taxonomy Cognitive Hierarchy */}
          <div className="p-6 rounded-3xl bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-3.5 shadow-md">
            <div className="flex items-center gap-2 border-b border-[#E2D3A7] pb-3">
              <Brain className="w-5 h-5 text-[#B7791F]" />
              <h3 className="text-base font-extrabold text-[#2D3748]">
                Cognitive Intelligence Progression
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { stage: 'Stage 1: Remembering & Definitions', desc: 'Core axioms, units, and governing laws', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
                { stage: 'Stage 2: Understanding & Mechanisms', desc: 'Physical/computational causal pathways', color: 'bg-blue-100 text-blue-900 border-blue-300' },
                { stage: 'Stage 3: Application & Derivations', desc: 'Real-world problem solving & calculations', color: 'bg-amber-100 text-amber-900 border-amber-300' },
                { stage: 'Stage 4: Analysis & Failure Modes', desc: 'Comparative trade-offs & threshold failure', color: 'bg-rose-100 text-rose-900 border-rose-300' }
              ].map((item, i) => (
                <div key={i} className={`p-2.5 rounded-xl border ${item.color} flex items-center justify-between`}>
                  <strong className="font-bold">{item.stage}</strong>
                  <span className="text-[11px] opacity-80">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Anti-Cheat & Security Seals */}
          <div className="p-5 rounded-3xl bg-[#E6F4EA] border-2 border-[#A8DAB5] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#2F855A] shrink-0" />
              <div>
                <strong className="text-sm font-extrabold text-[#2F855A] block">
                  100% Offline Protected Exam Arena
                </strong>
                <span className="text-[#2F855A]">
                  Zero Cloud Leaks • Real Tab Switch & Clipboard Anti-Cheat Interceptors
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
