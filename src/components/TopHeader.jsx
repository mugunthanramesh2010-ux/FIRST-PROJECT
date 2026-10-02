import React, { useState } from 'react';
import {
  Search,
  Bell,
  User,
  Cpu,
  Menu,
  CheckCircle2,
  Sparkles,
  Command,
  X
} from 'lucide-react';

export default function TopHeader({
  activeTab,
  topicModel,
  currentUser,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  onOpenDomainBrowser,
  onOpenAuth
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Exam Readiness Verified', time: '10m ago', unread: true },
    { id: 2, title: 'MOSFET Inversion Layer Mastered', time: '1h ago', unread: true },
    { id: 3, title: 'Zero Malpractice Telemetry Passed', time: '2h ago', unread: false }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#161B22] border-b border-[#30363D] h-[72px] px-6 sm:px-8 flex items-center justify-between transition-colors">
      
      {/* 1. Logo & System Name */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="btn-icon lg:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-[#00F5D4] text-[#0D1117] flex items-center justify-center font-black shadow-md shadow-[#00F5D4]/20 shrink-0">
            <Cpu className="w-5 h-5 text-[#0D1117]" />
          </div>
          <div>
            <div className="text-[17px] font-bold tracking-tight text-[#F0F6FC] leading-none">
              VIVA <span className="text-[#00F5D4]">ANALYSER</span>
            </div>
            <div className="text-[11px] text-[#8B949E] font-medium mt-1 hidden sm:block">
              Universal Adaptive Cognitive Viva Engine
            </div>
          </div>
        </div>
      </div>

      {/* 2. Enterprise Search Bar */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8B949E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={onOpenDomainBrowser}
            placeholder={`Search topics, concepts, or disciplines (Current: ${topicModel?.title || 'MOSFET'})...`}
            className="w-full h-[40px] pl-10 pr-12 rounded-[10px] bg-[#0D1117] border border-[#30363D] text-[13px] text-[#F0F6FC] placeholder-[#6E7681] focus:border-[#00F5D4] focus:outline-none transition-colors"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#21262D] border border-[#30363D] text-[10px] font-mono text-[#8B949E]">
            ⌘K
          </div>
        </div>
      </div>

      {/* 3. Notifications & Profile (40px x 40px icon buttons, radius 10px) */}
      <div className="flex items-center gap-3">
        
        {/* Topic Quick Chip on Mobile */}
        <button
          onClick={onOpenDomainBrowser}
          className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#0D1117] border border-[#30363D] text-[12px] font-semibold text-[#00F5D4]"
        >
          <span>{topicModel?.title || 'MOSFET'}</span>
        </button>

        {/* Notifications Icon Button: 40px × 40px, radius 10px */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-icon relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#F0F6FC]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF007A]"></span>
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#161B22] border border-[#30363D] rounded-[16px] shadow-2xl p-4 z-50 animate-fade-in space-y-3">
              <div className="flex justify-between items-center border-b border-[#30363D] pb-2">
                <span className="text-[14px] font-bold text-[#F0F6FC]">System Alerts</span>
                <span className="text-[11px] text-[#00F5D4] font-semibold">2 New</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-[10px] bg-[#0D1117] border border-[#30363D] text-left">
                    <div className="text-[13px] font-semibold text-[#F0F6FC]">{n.title}</div>
                    <div className="text-[11px] text-[#8B949E] mt-0.5">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Guest Register Button */}
        {!currentUser && (
          <button
            onClick={() => onOpenAuth('register')}
            className="btn-primary h-[38px] min-w-0 px-3.5 text-[13px] font-semibold hidden sm:inline-flex"
            title="Create Student Account"
          >
            <span>Register</span>
          </button>
        )}

        {/* Profile Icon Button: 40px × 40px, radius 10px */}
        <button
          onClick={() => onOpenAuth('login')}
          className="btn-icon"
          title={currentUser ? currentUser.fullName : 'Sign In'}
        >
          {currentUser ? (
            <span className="font-bold text-xs text-[#00F5D4]">
              {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
            </span>
          ) : (
            <User className="w-4 h-4 text-[#F0F6FC]" />
          )}
        </button>

      </div>

    </header>
  );
}
