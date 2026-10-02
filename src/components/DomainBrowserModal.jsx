import React, { useState } from 'react';
import {
  X,
  Search,
  Cpu,
  Atom,
  HeartPulse,
  TrendingUp,
  BookOpen,
  Scale,
  Languages,
  GraduationCap,
  Sprout,
  Palette,
  CheckSquare,
  Award,
  Sparkles,
  ArrowRight,
  Globe
} from 'lucide-react';
import { DOMAIN_CATEGORIES, generateUniversalTopicModel } from '../services/universalOntology';

export default function DomainBrowserModal({ isOpen, onClose, onSelectTopic }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(DOMAIN_CATEGORIES[0].id);

  if (!isOpen) return null;

  const currentCategoryObj = DOMAIN_CATEGORIES.find(c => c.id === selectedCategory) || DOMAIN_CATEGORIES[0];

  const filteredBranches = searchQuery.trim()
    ? DOMAIN_CATEGORIES.flatMap(cat =>
        cat.branches
          .filter(b => b.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(b => ({ branch: b, category: cat.name }))
      )
    : currentCategoryObj.branches.map(b => ({ branch: b, category: currentCategoryObj.name }));

  const handleLaunchTopic = (topicName) => {
    const model = generateUniversalTopicModel(topicName);
    onSelectTopic(model);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl glass-panel bg-white p-6 sm:p-7 rounded-2xl border border-slate-300 max-h-[92vh] flex flex-col shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start mb-4 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-purple text-xs">Universal Ontology Explorer</span>
              <span className="text-xs text-slate-500 font-medium">100% Domain-Independent</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-heading">
              Universal Domain & Discipline Directory
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Select any engineering branch, scientific field, competitive exam, or enter any custom interdisciplinary topic.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search across all 14 domains, 120+ branches, or enter any custom topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-10 py-2.5 text-xs sm:text-sm bg-white"
            />
          </div>
        </div>

        {/* Main Content: Category Sidebar + Branches Grid */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-4">
          
          {/* Category Tabs (Left) */}
          {!searchQuery && (
            <div className="w-full md:w-60 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1 pr-1 pb-2 md:pb-0 shrink-0 border-b md:border-b-0 md:border-r border-slate-200">
              {DOMAIN_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all whitespace-nowrap md:whitespace-normal ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Branches Grid (Right) */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredBranches.map((item, idx) => {
                const branchName = typeof item === 'string' ? item : item.branch;
                const catName = typeof item === 'object' ? item.category : currentCategoryObj.name;

                return (
                  <button
                    key={idx}
                    onClick={() => handleLaunchTopic(branchName)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 text-left transition-all group flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold group-hover:text-sky-300">
                        {catName}
                      </div>
                      <div className="font-bold text-xs text-slate-900 group-hover:text-white mt-0.5">
                        {branchName}
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-white pt-1 border-t border-slate-200/60 group-hover:border-white/10 font-bold">
                      <span>Launch Adaptive Viva</span>
                      <ArrowRight className="w-3.5 h-3.5 text-sky-600 group-hover:text-sky-300 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">
            Universal generative synthesizer generates questions, concept graphs, and rubrics for any topic.
          </span>
          <button onClick={onClose} className="btn-primary text-xs py-2 px-6 font-bold shadow-md">
            Close Explorer
          </button>
        </div>

      </div>
    </div>
  );
}
