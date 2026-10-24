import React, { useState } from 'react';
import { Cpu, Search, Sparkles } from 'lucide-react';
import { generateUniversalTopicModel } from '../../services/universalOntology';

export default function SelfLearningPage({ onTopicSelected }) {
  const [topicInput, setTopicInput] = useState('');
  const [questionCount, setQuestionCount] = useState(10);

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

  const questionPresets = [5, 10, 15, 20, 25, 30, 50, 75, 100];

  const handleStart = (topicName) => {
    const chosen = topicName || topicInput.trim() || 'Communication Engineering';
    const count = Math.min(100, Math.max(1, parseInt(questionCount, 10) || 10));
    const model = generateUniversalTopicModel(chosen, 'Universal Domain', count);
    onTopicSelected(model);
  };

  return (
    <div className="space-y-[32px] animate-fade-in max-w-[1280px] mx-auto py-4">
      
      {/* Header */}
      <div className="border-b border-[#E2D3A7] pb-4 text-left">
        <span className="text-xs font-mono text-[#718096]">Page 10 • Autonomous Adaptive Viva</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
          Self Learning
        </h1>
        <p className="text-xs text-[#718096]">
          Enter any academic subject or technical concept to synthesize an autonomous adaptive viva
        </p>
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
          </div>

          {/* Required Examples Chips */}
          <div className="space-y-2 pt-2 text-left">
            <span className="text-xs font-bold text-[#718096] block">Syllabus Presets:</span>
            <div className="flex flex-wrap items-center gap-2">
              {exampleTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setTopicInput(topic);
                    handleStart(topic);
                  }}
                  className="px-3 py-1.5 rounded-[12px] bg-[#FFF3D6] hover:bg-[#B7791F] text-[#8B5E34] hover:text-white border border-[#E2D3A7] text-xs font-bold transition-all"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count Selector (1 to 100 Questions) */}
          <div className="space-y-2 pt-2 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#718096]">Viva Question Count (1 to 100):</label>
              <span className="text-xs font-bold text-[#B7791F] bg-[#FFF3D6] px-2.5 py-0.5 rounded-md border border-[#E2D3A7]">
                {questionCount} Questions
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mb-2">
              {questionPresets.map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setQuestionCount(qty)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-[12px] border transition-all ${
                    Number(questionCount) === qty
                      ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                      : 'bg-[#FFF8E8] text-[#4A5568] border-[#E2D3A7] hover:border-[#B7791F]'
                  }`}
                >
                  {qty} Qs
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="100"
                value={questionCount}
                onChange={(e) => setQuestionCount(Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                className="form-input font-bold h-[42px] max-w-[140px]"
                placeholder="Count (1-100)"
              />
              <span className="text-xs text-[#718096]">Enter any number up to 100 questions</span>
            </div>
          </div>

          {/* Mandated Button: Start Adaptive Learning */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => handleStart(topicInput)}
              className="btn-primary w-full max-w-[320px]"
            >
              <Sparkles className="w-4 h-4 mr-1 text-[#FFF3D6]" />
              Start Adaptive Learning ({questionCount} Qs)
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
