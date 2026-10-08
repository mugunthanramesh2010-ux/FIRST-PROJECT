import React from 'react';
import {
  GraduationCap,
  Users,
  UserPlus,
  ShieldCheck,
  Brain,
  Network,
  Cpu,
  Sparkles,
  Smartphone
} from 'lucide-react';

export default function LandingPage({ onNavigate, onOpenInstallModal }) {
  const featureCards = [
    {
      title: 'Adaptive Viva',
      desc: 'Dynamic Bloom-scale questioning that adapts in real time to student depth and mastery level.',
      icon: Cpu,
      badge: 'Cognitive Engine'
    },
    {
      title: 'Learning DNA',
      desc: 'Multi-dimensional learner profiling mapping analytical, practical, and conceptual velocities.',
      icon: Brain,
      badge: 'Cognitive Profiler'
    },
    {
      title: 'Knowledge Graph',
      desc: 'Hierarchical prerequisite concept tree mapping mastery states from basics to applications.',
      icon: Network,
      badge: 'Concept Mapping'
    },
    {
      title: 'Secure Assessment',
      desc: '100% local, offline assessment verification with behavioral cadence tracking and zero cloud footprint.',
      icon: ShieldCheck,
      badge: 'Integrity Shield'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E8] text-[#4A5568] flex flex-col justify-between">
      
      {/* 1. HEADER (Height 72px, #FFF7E2, Border #E2D3A7) */}
      <header className="h-[72px] bg-[#FFF7E2] border-b border-[#E2D3A7] sticky top-0 z-40 px-6 sm:px-8">
        <div className="max-w-[1280px] h-full mx-auto flex items-center justify-between">
          
          {/* Left: Logo + VIVA ANALYSER + OFFLINE AI Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#B7791F] flex items-center justify-center text-white shadow-sm shrink-0">
              <Cpu className="w-5 h-5 text-[#FFF3D6]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[19px] text-[#2D3748] tracking-tight">
                VIVA <span className="text-[#B7791F]">ANALYSER</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FFF3D6] border border-[#E2D3A7] text-[11px] font-bold text-[#8B5E34]">
                OFFLINE AI
              </span>
            </div>
          </div>

          {/* Center: Clean (Nothing as specified) */}

          {/* Right: Install App, Student Login, Faculty Login, Register */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF3D6] border border-[#B7791F]/40 text-[#8B5E34] hover:bg-[#B7791F] hover:text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Install as Phone App (Runs 100% Offline with PC Off)"
              >
                <Smartphone className="w-4 h-4" />
                <span>📲 Install Phone App</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('student-login')}
              className="text-sm font-bold text-[#4A5568] hover:text-[#B7791F] px-3 py-2 rounded-xl hover:bg-[#FFF3D6] transition-colors"
            >
              Student Login
            </button>
            <button
              onClick={() => onNavigate('faculty-login')}
              className="text-sm font-bold text-[#4A5568] hover:text-[#B7791F] px-3 py-2 rounded-xl hover:bg-[#FFF3D6] transition-colors"
            >
              Faculty Login
            </button>
            <button
              onClick={() => onNavigate('student-register')}
              className="btn-primary text-xs sm:text-sm h-[44px] min-w-0 px-5"
            >
              Register
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="max-w-[1280px] w-full mx-auto px-6 sm:px-8 py-12 flex-1 flex flex-col justify-center space-y-[40px]">
        
        {/* Banner with Soft Honey Gradient */}
        <div className="p-8 sm:p-12 rounded-[24px] bg-gradient-to-br from-[#FFF3D6] via-[#FFFCF4] to-[#FFF8E8] border border-[#E2D3A7] shadow-[0px_8px_24px_rgba(183,121,31,0.08)] text-center max-w-4xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF3D6] border border-[#E2D3A7] text-[#8B5E34] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#B7791F]" />
            <span>Smart India Hackathon • Enterprise AI Viva System</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2D3748] tracking-tight leading-[1.15] uppercase">
              Master Any Subject Through <br />
              <span className="text-[#B7791F]">Adaptive AI Learning</span>
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-x-3 text-sm sm:text-base text-[#4A5568] font-bold pt-1">
              <span>100% Offline</span>
              <span>•</span>
              <span>Local AI</span>
              <span>•</span>
              <span>Secure Assessments</span>
              <span>•</span>
              <span>Personalized Learning</span>
            </div>
          </div>

          {/* Mandated Action Buttons: Student Login, Faculty Login, Create Account, Install App */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('student-login')}
              className="btn-primary"
            >
              <GraduationCap className="w-5 h-5 mr-1" />
              <span>Student Login</span>
            </button>

            <button
              onClick={() => onNavigate('faculty-login')}
              className="btn-secondary"
            >
              <Users className="w-5 h-5 mr-1" />
              <span>Faculty Login</span>
            </button>

            <button
              onClick={() => onNavigate('student-register')}
              className="btn-accent"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              <span>Create Account</span>
            </button>

            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                className="inline-flex items-center justify-center px-6 py-3 rounded-[16px] bg-[#B7791F] hover:bg-[#975A16] text-[#FFF8E8] font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4 mr-2 text-[#FFF3D6]" />
                <span>📲 Install on Phone (Runs Offline)</span>
              </button>
            )}
          </div>

        </div>

        {/* 3. FEATURE CARDS (Exactly 4 Cards: Adaptive Viva, Learning DNA, Knowledge Graph, Secure Assessment) */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B5E34]">Core Architecture</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D3748] mt-1">Autonomous Enterprise Systems</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="ent-card p-6 flex flex-col justify-between space-y-4 bg-[#FFFCF4] border-[#E2D3A7] hover:border-[#B7791F]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-[12px] bg-[#FFF3D6] border border-[#E2D3A7] flex items-center justify-center text-[#B7791F]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-[#8B5E34] bg-[#FFF3D6] px-2 py-0.5 rounded-md border border-[#E2D3A7]">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#2D3748]">{card.title}</h3>
                    <p className="text-xs text-[#718096] leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-[#E2D3A7] bg-[#FFF7E2] text-center text-xs text-[#718096]">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VIVA ANALYSER • Enterprise Edition (100% Offline AI)</span>
          <span>Coursera & SIH Enterprise Design Standard</span>
        </div>
      </footer>

    </div>
  );
}
