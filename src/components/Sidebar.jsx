import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  BrainCircuit,
  Layers,
  Sparkles,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  isCollapsed,
  setIsCollapsed,
  onOpenAuth,
  onLogout,
  onOpenReport
}) {
  // Exactly 8 main menu items as specified
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'arena', label: 'Viva Arena', icon: Cpu },
    { id: 'dna', label: 'Learning DNA', icon: BrainCircuit },
    { id: 'graph', label: 'Knowledge Map', icon: Layers },
    { id: 'innovation', label: 'Innovation Center', icon: Sparkles },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (id) => {
    if (id === 'reports') {
      onOpenReport();
    } else {
      setActiveTab(id);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 bg-[#161B22] border-r border-[#30363D] transition-all duration-300 flex flex-col justify-between select-none ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* 1. Brand Logo & Collapse Toggle */}
      <div>
        <div className="h-[72px] border-b border-[#30363D] px-4 flex items-center justify-between">
          <div
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-3 cursor-pointer overflow-hidden ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
            title="VIVA ANALYSER Enterprise"
          >
            <div className="w-10 h-10 rounded-[10px] bg-[#00F5D4] text-[#0D1117] flex items-center justify-center font-black text-lg shrink-0 shadow-lg shadow-[#00F5D4]/20">
              <Cpu className="w-5 h-5 text-[#0D1117]" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight">
                <div className="font-bold text-[15px] tracking-tight text-[#F0F6FC]">
                  VIVA <span className="text-[#00F5D4]">ANALYSER</span>
                </div>
                <div className="text-[11px] font-semibold text-[#8B949E] flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse"></span>
                  <span>Enterprise v2.0</span>
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="btn-icon w-8 h-8 text-[#8B949E] hover:text-[#00F5D4]"
              title="Collapse Sidebar (72px)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expand Trigger when collapsed to 72px */}
        {isCollapsed && (
          <div className="p-3 border-b border-[#30363D] flex justify-center">
            <button
              onClick={() => setIsCollapsed(false)}
              className="btn-icon w-8 h-8 text-[#8B949E] hover:text-[#00F5D4]"
              title="Expand Sidebar (260px)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. Exactly 8 Main Menu Items (Icons + Labels) */}
        <nav className="p-3 space-y-1.5 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-[12px] text-[14px] font-semibold transition-all ${
                  isActive
                    ? 'bg-[#00F5D4] text-[#0D1117] font-bold shadow-md shadow-[#00F5D4]/20'
                    : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-[#0D1117]' : 'text-[#8B949E]'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Bottom User Profile Card / Session info */}
      <div className="p-3 border-t border-[#30363D]">
        {currentUser ? (
          <div
            className={`p-2.5 rounded-[12px] bg-[#0D1117] border border-[#30363D] flex items-center gap-3 ${
              isCollapsed ? 'justify-center p-2' : ''
            }`}
          >
            <div className="w-9 h-9 rounded-[10px] bg-[#21262D] border border-[#30363D] text-[#00F5D4] font-bold text-sm flex items-center justify-center shrink-0">
              {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#F0F6FC] truncate">
                  {currentUser.fullName}
                </div>
                <div className="text-[11px] text-[#8B949E] truncate">
                  {currentUser.role === 'faculty' ? 'Faculty Evaluator' : (currentUser.registerNumber || 'Student')}
                </div>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={onLogout}
                title="Log Out"
                className="btn-icon w-8 h-8 text-[#8B949E] hover:text-[#FF007A] hover:border-[#FF007A]/50"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => onOpenAuth('register')}
              className={`btn-primary w-full h-[40px] min-w-0 text-[13px] ${
                isCollapsed ? 'px-0 justify-center' : ''
              }`}
              title="Create New Account"
            >
              <User className="w-4 h-4 text-[#0D1117]" />
              {!isCollapsed && <span>Register</span>}
            </button>

            {!isCollapsed && (
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-secondary w-full h-[38px] min-w-0 text-[12px]"
                title="Existing User Login"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
