import React from 'react';
import { Menu, Cpu, User, LogOut, Smartphone } from 'lucide-react';

export default function EnterpriseNavbar({
  currentUser,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  onNavigate,
  onLogout,
  onOpenInstallModal
}) {
  return (
    <header className="h-[72px] bg-[#FFF7E2] border-b border-[#E2D3A7] sticky top-0 z-30 px-6 sm:px-8">
      <div className="w-full h-full flex items-center justify-between">
        
        {/* Left: Mobile Toggle + Logo + VIVA ANALYSER + OFFLINE AI Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="btn-icon w-9 h-9 lg:hidden text-[#4A5568] bg-[#FFF8E8] border-[#E2D3A7]"
            title="Toggle Sidebar Navigation"
          >
            <Menu className="w-5 h-5 text-[#8B5E34]" />
          </button>

          <div
            onClick={() => onNavigate(currentUser?.role === 'faculty' ? 'faculty-dashboard' : 'student-dashboard')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-[14px] bg-[#B7791F] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
              <Cpu className="w-5 h-5 text-[#FFF3D6]" />
            </div>
            <div className="flex items-center gap-2">
              <div className="font-extrabold text-[18px] text-[#2D3748] tracking-tight">
                VIVA <span className="text-[#B7791F]">ANALYSER</span>
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#FFF3D6] border border-[#E2D3A7] text-[10px] font-bold text-[#8B5E34]">
                OFFLINE AI
              </span>
            </div>
          </div>
        </div>

        {/* Center: Clean (Nothing as specified) */}

        {/* Right: Install App + Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-[14px] bg-[#B7791F] hover:bg-[#975A16] text-[#FFF8E8] font-bold text-xs shadow-sm transition-all cursor-pointer"
              title="Install as Phone App (Works with PC Off)"
            >
              <Smartphone className="w-4 h-4 text-[#FFF3D6]" />
              <span className="hidden sm:inline">Install Phone App</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-[14px] border border-[#E2D3A7] hover:border-[#B7791F] bg-[#FFFCF4] transition-colors shadow-xs"
            title="View Profile"
          >
            <div className="w-8 h-8 rounded-[10px] bg-[#B7791F] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              {currentUser?.fullName?.charAt(0) || <User className="w-4 h-4" />}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-[#2D3748] leading-tight">
                {currentUser?.fullName || 'Academic Portal'}
              </div>
              <div className="text-[10px] text-[#718096] font-medium leading-tight">
                {currentUser?.role === 'faculty' ? 'Faculty Member' : 'Student'}
              </div>
            </div>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-9 h-9 rounded-[12px] border border-[#E2D3A7] bg-[#FFFCF4] hover:bg-[#FEE2E2] hover:border-[#FECACA] text-[#718096] hover:text-[#C53030] flex items-center justify-center transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
