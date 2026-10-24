import React, { useState } from 'react';
import { Layers, Target, CheckCircle2, AlertTriangle, Play, Sparkles } from 'lucide-react';

export default function StudentKnowledgeMapPage({
  topicModel,
  onPracticeConcept
}) {
  const rootTopic = topicModel?.title || 'Communication Engineering';

  // Dynamically compute tree nodes based on topicModel graphNodes or subject domain
  const computeNodes = () => {
    if (topicModel?.graphNodes && topicModel.graphNodes.length > 0) {
      return topicModel.graphNodes.slice(0, 5).map((gn, idx) => {
        const isMastered = idx < 2;
        const isLearning = idx >= 2 && idx < 4;
        const status = isMastered ? 'Mastered' : isLearning ? 'Learning' : 'Weak';
        return {
          id: gn.id || `node-${idx + 1}`,
          name: gn.label || gn.id,
          status,
          color: isMastered ? '#2F855A' : isLearning ? '#C05621' : '#C53030',
          bg: isMastered ? '#E6F4EA' : isLearning ? '#FFF3D6' : '#FFF0F0',
          border: isMastered ? '#A8DAB5' : isLearning ? '#E2D3A7' : '#FECACA',
          depth: 95 - (idx * 12)
        };
      });
    }

    const lower = rootTopic.toLowerCase();
    if (lower.includes('communication') || lower.includes('telecom') || lower.includes('signal')) {
      return [
        { id: 'c-1', name: 'Nyquist Sampling & Aliasing Bounds', status: 'Mastered', color: '#2F855A', bg: '#E6F4EA', border: '#A8DAB5', depth: 95 },
        { id: 'c-2', name: 'Digital Modulation (QPSK / 16-QAM)', status: 'Mastered', color: '#2F855A', bg: '#E6F4EA', border: '#A8DAB5', depth: 90 },
        { id: 'c-3', name: 'Shannon Channel Capacity & SNR', status: 'Learning', color: '#C05621', bg: '#FFF3D6', border: '#E2D3A7', depth: 74 },
        { id: 'c-4', name: 'Cascaded Noise Figure & Friis Link', status: 'Learning', color: '#C05621', bg: '#FFF3D6', border: '#E2D3A7', depth: 68 },
        { id: 'c-5', name: 'OFDM Multipath & Cyclic Prefix', status: 'Weak', color: '#C53030', bg: '#FFF0F0', border: '#FECACA', depth: 42 }
      ];
    }

    if (lower.includes('fpga') || lower.includes('vlsi') || lower.includes('verilog')) {
      return [
        { id: 'f-1', name: 'Look-Up Table (LUT) & CLB Slice', status: 'Mastered', color: '#2F855A', bg: '#E6F4EA', border: '#A8DAB5', depth: 95 },
        { id: 'f-2', name: 'Static Timing Analysis (Setup Slack)', status: 'Mastered', color: '#2F855A', bg: '#E6F4EA', border: '#A8DAB5', depth: 88 },
        { id: 'f-3', name: 'Clock Domain Crossing & 2-FF Sync', status: 'Learning', color: '#C05621', bg: '#FFF3D6', border: '#E2D3A7', depth: 72 },
        { id: 'f-4', name: 'Asynchronous FIFO Gray Pointers', status: 'Learning', color: '#C05621', bg: '#FFF3D6', border: '#E2D3A7', depth: 65 },
        { id: 'f-5', name: 'High-Level Synthesis AI Fabric', status: 'Weak', color: '#C53030', bg: '#FFF0F0', border: '#FECACA', depth: 40 }
      ];
    }

    // Default / Semiconductor
    return [
      { id: 'node-1', name: 'Semiconductor Basics', status: 'Mastered', color: '#2F855A', bg: '#E6F4EA', border: '#A8DAB5', depth: 94 },
      { id: 'node-2', name: 'Threshold Voltage', status: 'Mastered', color: '#2F855A', bg: '#E6F4EA', border: '#A8DAB5', depth: 90 },
      { id: 'node-3', name: 'Inversion Layer', status: 'Learning', color: '#C05621', bg: '#FFF3D6', border: '#E2D3A7', depth: 72 },
      { id: 'node-4', name: 'Drain Current', status: 'Learning', color: '#C05621', bg: '#FFF3D6', border: '#E2D3A7', depth: 68 },
      { id: 'node-5', name: 'Applications', status: 'Weak', color: '#C53030', bg: '#FFF0F0', border: '#FECACA', depth: 42 }
    ];
  };

  const nodes = computeNodes();
  const [selectedNode, setSelectedNode] = useState(nodes[nodes.length - 1] || nodes[0]);

  React.useEffect(() => {
    setSelectedNode(nodes[nodes.length - 1] || nodes[0]);
  }, [rootTopic]);

  return (
    <div className="space-y-[32px] animate-fade-in w-full py-4 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2D3A7] pb-4">
        <div>
          <span className="text-xs font-mono text-[#718096]">Page 17 • Knowledge Tree Architecture</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
            Knowledge Map
          </h1>
          <p className="text-xs text-[#718096]">
            Hierarchical prerequisite ontology for <strong className="text-[#2D3748]">{rootTopic}</strong>
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-md bg-[#E6F4EA] text-[#2F855A] border border-[#A8DAB5]">Mastered</span>
          <span className="px-2.5 py-1 rounded-md bg-[#FFF3D6] text-[#C05621] border border-[#E2D3A7]">Learning</span>
          <span className="px-2.5 py-1 rounded-md bg-[#FFF0F0] text-[#C53030] border border-[#FECACA]">Weak</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
        
        {/* Interactive Tree View (lg:col-span-8) */}
        <div className="lg:col-span-8 ent-card p-6 sm:p-8 space-y-6 bg-[#FFFCF4] border-[#E2D3A7]">
          <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-3">
            <h3 className="text-base font-bold text-[#2D3748]">Hierarchical Tree Breakdown</h3>
            <span className="text-xs text-[#718096]">Click any branch to inspect</span>
          </div>

          {/* Root Topic Node */}
          <div className="p-4 rounded-[16px] bg-[#FFF3D6] border-2 border-[#B7791F] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#B7791F] text-white flex items-center justify-center font-bold">
                <Layers className="w-5 h-5 text-[#FFF3D6]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8B5E34] uppercase tracking-wider">Root Discipline</span>
                <h4 className="text-lg font-bold text-[#2D3748]">{rootTopic}</h4>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E6F4EA] border border-[#A8DAB5] text-[#2F855A] text-xs font-bold">
              Core Discipline
            </span>
          </div>

          {/* Tree Branches (├ / └ format) */}
          <div className="space-y-3 pl-4 sm:pl-6 border-l-2 border-[#E2D3A7] ml-6">
            {nodes.map((node, idx) => {
              const isLast = idx === nodes.length - 1;
              const isSelected = selectedNode?.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-[14px] border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#B7791F] shadow-sm ring-2 ring-[#B7791F]/20 bg-[#FFF8E8]'
                      : 'border-[#E2D3A7] bg-[#FFFCF4] hover:border-[#B7791F]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-[#8B5E34]">
                      {isLast ? '└' : '├'}
                    </span>
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: node.color }}
                    />
                    <span className="text-sm font-bold text-[#2D3748]">
                      {node.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-md border"
                      style={{ backgroundColor: node.bg, color: node.color, borderColor: node.border }}
                    >
                      {node.status} ({node.depth}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Selected Concept Inspection (lg:col-span-4) */}
        <div className="lg:col-span-4 ent-card p-6 flex flex-col justify-between space-y-6 bg-[#FFFCF4] border-[#E2D3A7]">
          <div className="space-y-4">
            <div className="border-b border-[#E2D3A7] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096]">Selected Node</span>
              <h3 className="text-lg font-bold text-[#2D3748] mt-1">{selectedNode.name}</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-[12px] bg-[#FFF8E8] border border-[#E2D3A7] space-y-1">
                <span className="text-[#718096] block text-[11px]">Current Status</span>
                <strong className="text-sm font-bold block" style={{ color: selectedNode.color }}>
                  {selectedNode.status} ({selectedNode.depth}% Depth)
                </strong>
              </div>

              <div className="p-3 rounded-[12px] bg-[#FFF8E8] border border-[#E2D3A7] space-y-1">
                <span className="text-[#718096] block text-[11px]">Recommendation</span>
                <p className="text-xs text-[#4A5568]">
                  {selectedNode.status === 'Weak' && 'High cognitive priority: targeted adaptive oral reinforcement recommended.'}
                  {selectedNode.status === 'Learning' && 'Moderate confidence: test analytical formulations to achieve mastery.'}
                  {selectedNode.status === 'Mastered' && 'Sufficient depth confirmed: retain through periodic spaced viva review.'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onPracticeConcept && onPracticeConcept(selectedNode.name)}
            className="btn-primary w-full text-xs h-[48px]"
          >
            <Play className="w-4 h-4 mr-1 text-[#FFF3D6]" />
            Practice Concept ({selectedNode.name})
          </button>
        </div>

      </div>

    </div>
  );
}
