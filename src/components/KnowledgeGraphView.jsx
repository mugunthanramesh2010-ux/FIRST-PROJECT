import React, { useState } from 'react';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  GitBranch,
  BookOpen,
  Info
} from 'lucide-react';

export default function KnowledgeGraphView({ topicModel, onSelectPrerequisite }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'MASTERED' | 'LEARNING' | 'WEAK'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [expandedNodes, setExpandedNodes] = useState({ root: true });

  // Exact Knowledge Map Hierarchy:
  // MOSFET -> Semiconductor, Gate, Threshold Voltage, Inversion Layer, Enhancement Mode, Depletion Mode, Applications
  // Color codes: Green = Mastered (#39FF14), Yellow = Learning (#FFB800), Red = Weak (#FF007A)
  const treeNodes = [
    {
      id: 'root',
      label: 'MOSFET',
      category: 'Core System',
      status: 'LEARNING',
      mastery: 84,
      description: 'Metal-Oxide-Semiconductor Field-Effect Transistor fundamental architecture.',
      x: 450,
      y: 80,
      children: ['semi', 'gate', 'vth', 'inversion', 'enhancement', 'depletion', 'apps']
    },
    {
      id: 'semi',
      label: 'Semiconductor',
      category: 'Foundation',
      status: 'MASTERED',
      mastery: 95,
      description: 'P-type and N-type silicon substrate, doping concentrations, and carrier dynamics.',
      prereq: 'Solid State Physics',
      x: 120,
      y: 240
    },
    {
      id: 'gate',
      label: 'Gate',
      category: 'Architecture',
      status: 'MASTERED',
      mastery: 92,
      description: 'Dielectric insulation (SiO2 / High-k) and polysilicon gate electrode biasing.',
      prereq: 'Capacitance & Dielectrics',
      x: 230,
      y: 240
    },
    {
      id: 'vth',
      label: 'Threshold Voltage (Vth)',
      category: 'Electrostatics',
      status: 'LEARNING',
      mastery: 78,
      description: 'Minimum gate bias to achieve strong inversion; Fermi levels and surface potential.',
      prereq: 'Band Theory',
      x: 350,
      y: 240
    },
    {
      id: 'inversion',
      label: 'Inversion Layer',
      category: 'Physics',
      status: 'WEAK',
      mastery: 46,
      description: 'Accumulation, depletion, and inversion kinetics. Two-dimensional electron gas (2DEG).',
      prereq: 'Charge Sheet Approximation',
      x: 480,
      y: 240
    },
    {
      id: 'enhancement',
      label: 'Enhancement Mode',
      category: 'Operation',
      status: 'MASTERED',
      mastery: 90,
      description: 'Normally-OFF device requiring positive gate bias to turn conduction ON.',
      prereq: 'Switching Characteristics',
      x: 610,
      y: 240
    },
    {
      id: 'depletion',
      label: 'Depletion Mode',
      category: 'Operation',
      status: 'LEARNING',
      mastery: 68,
      description: 'Normally-ON device requiring reverse bias gate voltage to turn channel OFF.',
      prereq: 'Pinch-off Voltage',
      x: 730,
      y: 240
    },
    {
      id: 'apps',
      label: 'Applications',
      category: 'Engineering',
      status: 'LEARNING',
      mastery: 80,
      description: 'CMOS logic gates, microinverters, RF power switching, and DRAM memory cells.',
      prereq: 'Circuit Theory',
      x: 840,
      y: 240
    }
  ];

  // Filtered nodes
  const visibleNodes = treeNodes.filter((node) => {
    if (filterStatus === 'ALL') return true;
    return node.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'MASTERED':
        return <span className="badge-mastered">Mastered</span>;
      case 'LEARNING':
        return <span className="badge-learning">Learning</span>;
      case 'WEAK':
        return <span className="badge-weak">Weak Area</span>;
      default:
        return null;
    }
  };

  const getNodeColor = (status) => {
    switch (status) {
      case 'MASTERED':
        return '#39FF14'; // Cyber Lime
      case 'LEARNING':
        return '#FFB800'; // Electric Amber
      case 'WEAK':
        return '#FF007A'; // Neon Magenta
      default:
        return '#00F5D4';
    }
  };

  return (
    <div className="space-y-[24px] animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* 1. Header & Controls */}
      <div className="ent-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-mastered">Full-Screen Ontology Visualization</span>
            <span className="caption-text text-[#8B949E]">Min Height 700px Interactive Canvas</span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#F0F6FC] mt-1 tracking-tight">
            {topicModel?.title || 'MOSFET'} Knowledge Graph
          </h1>
          <p className="caption-text mt-1 text-[#8B949E]">
            Interactive prerequisite tree with real-time mastery color calibration and node expansion.
          </p>
        </div>

        {/* Filter Buttons & Legend */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'MASTERED', 'LEARNING', 'WEAK'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-[10px] text-[12px] font-semibold border transition-all ${
                filterStatus === status
                  ? 'bg-[#00F5D4] text-[#0D1117] border-[#00F5D4] font-bold shadow-md shadow-[#00F5D4]/20'
                  : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
            >
              {status === 'ALL' && 'All Concepts'}
              {status === 'MASTERED' && 'Green: Mastered'}
              {status === 'LEARNING' && 'Yellow: Learning'}
              {status === 'WEAK' && 'Red: Weak'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. FULL SCREEN VISUALIZATION CANVAS (Min Height: 700px) */}
      <div className="ent-card p-0 relative overflow-hidden min-h-[700px] h-[720px] bg-[#0D1117] border border-[#30363D]">
        
        {/* Canvas Toolbar Controls (Zoom In, Zoom Out, Reset, Expansion) */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#161B22]/90 backdrop-blur-md p-2 rounded-[12px] border border-[#30363D]">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 2.0))}
            className="btn-icon w-8 h-8 text-[#8B949E] hover:text-[#00F5D4]"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.6))}
            className="btn-icon w-8 h-8 text-[#8B949E] hover:text-[#00F5D4]"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            className="btn-icon w-8 h-8 text-[#8B949E] hover:text-[#00F5D4]"
            title="Reset Pan & Zoom"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-[#8B949E] px-2 font-bold">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        {/* Legend Overlay */}
        <div className="absolute top-4 right-4 z-20 bg-[#161B22]/90 backdrop-blur-md p-3 rounded-[12px] border border-[#30363D] text-[12px] space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#39FF14]"></span>
            <span className="text-[#F0F6FC] font-semibold">Green: Mastered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FFB800]"></span>
            <span className="text-[#F0F6FC] font-semibold">Yellow: Learning</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF007A]"></span>
            <span className="text-[#F0F6FC] font-semibold">Red: Weak Area</span>
          </div>
        </div>

        {/* Interactive SVG Canvas */}
        <div className="w-full h-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing">
          <svg
            className="w-full h-full transition-transform duration-200"
            viewBox="0 0 960 600"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`
            }}
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#21262D" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Tree Branch Connecting Lines */}
            <g stroke="#30363D" strokeWidth="2" strokeDasharray="4 4">
              {treeNodes.slice(1).map((child) => (
                <line
                  key={`line-${child.id}`}
                  x1={treeNodes[0].x + 40}
                  y1={treeNodes[0].y + 40}
                  x2={child.x + 35}
                  y2={child.y}
                  stroke={selectedNode?.id === child.id ? '#00F5D4' : '#30363D'}
                  strokeWidth={selectedNode?.id === child.id ? 2.5 : 1.5}
                />
              ))}
            </g>

            {/* Tree Nodes Rendering */}
            {treeNodes.map((node) => {
              const isRoot = node.id === 'root';
              const isSelected = selectedNode?.id === node.id;
              const nodeColor = getNodeColor(node.status);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Outer Glow Halo if selected */}
                  {isSelected && (
                    <rect
                      x="-6"
                      y="-6"
                      width={isRoot ? 112 : 92}
                      height={isRoot ? 72 : 62}
                      rx="16"
                      fill="none"
                      stroke="#00F5D4"
                      strokeWidth="2.5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Node Card */}
                  <rect
                    width={isRoot ? 100 : 80}
                    height={isRoot ? 60 : 50}
                    rx="12"
                    fill="#161B22"
                    stroke={isSelected ? '#00F5D4' : nodeColor}
                    strokeWidth="2"
                    className="transition-all hover:fill-[#1F242C]"
                  />

                  {/* Status Indicator Dot */}
                  <circle
                    cx={isRoot ? 88 : 70}
                    cy="12"
                    r="4.5"
                    fill={nodeColor}
                  />

                  {/* Node Label */}
                  <text
                    x={isRoot ? 50 : 40}
                    y={isRoot ? 28 : 22}
                    textAnchor="middle"
                    fill="#F0F6FC"
                    fontSize={isRoot ? "13" : "11"}
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                  >
                    {node.label.length > 12 ? node.label.slice(0, 10) + '..' : node.label}
                  </text>

                  {/* Mastery Percentage */}
                  <text
                    x={isRoot ? 50 : 40}
                    y={isRoot ? 46 : 38}
                    textAnchor="middle"
                    fill={nodeColor}
                    fontSize="10"
                    fontWeight="800"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {node.mastery}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Inspector Flyout */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-20 bg-[#161B22]/95 backdrop-blur-md border border-[#30363D] p-5 rounded-[16px] shadow-2xl animate-fade-in space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="caption-text uppercase text-[10px] font-bold text-[#8B949E]">
                  {selectedNode.category}
                </span>
                <h4 className="text-[18px] font-bold text-[#F0F6FC]">{selectedNode.label}</h4>
              </div>
              <div>{getStatusBadge(selectedNode.status)}</div>
            </div>

            <p className="text-[13px] text-[#8B949E] leading-relaxed">
              {selectedNode.description}
            </p>

            {selectedNode.prereq && (
              <div className="p-2.5 rounded-[10px] bg-[#0D1117] border border-[#30363D] text-[12px] flex justify-between items-center">
                <span className="text-[#8B949E]">Prerequisite:</span>
                <strong className="text-[#00F5D4]">{selectedNode.prereq}</strong>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <span className="text-[12px] font-mono font-bold text-[#F0F6FC]">
                Mastery: <span style={{ color: getNodeColor(selectedNode.status) }}>{selectedNode.mastery}%</span>
              </span>
              {onSelectPrerequisite && selectedNode.prereq && (
                <button
                  onClick={() => onSelectPrerequisite(selectedNode.prereq)}
                  className="btn-secondary h-[36px] min-w-0 px-3 text-[12px]"
                >
                  <span>Practice Prereq</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00F5D4]" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
