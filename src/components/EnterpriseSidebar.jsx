import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  Layers,
  FileText,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Users,
  FileSpreadsheet,
  BarChart3,
  ShieldCheck
} from 'lucide-react';

export default function EnterpriseSidebar({
  activeTab,
  setActiveTab,
  currentUser,
  isCollapsed,
  setIsCollapsed,
  onLogout
}) {
  const isFaculty = currentUser?.role === 'faculty';

  // Student Navigation (as strictly specified in SIH prompt)
  const studentNav = [
    { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-assignments', label: 'Assignments', icon: BookOpen },
    { id: 'self-learning', label: 'Self Learning', icon: Cpu },
    { id: 'knowledge-map', label: 'Knowledge Map', icon: Layers },
    { id: 'final-result', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  // Faculty Navigation (as strictly specified in SIH prompt)
  const facultyNav = [
    { id: 'faculty-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-assignment', label: 'Create Assignment', icon: PlusCircle },
    { id: 'faculty-students', label: 'Students', icon: Users },
    { id: 'faculty-results', label: 'Results', icon: FileSpreadsheet },
    { id: 'security-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'security-analytics', label: 'Security', icon: ShieldCheck },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const menuItems = isFaculty ? facultyNav : studentNav;

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 bg-[#FFF2CC] border-r border-[#E2D3A7] transition-all duration-300 flex flex-col justify-between select-none shadow-[2px_0_12px_rgba(183,121,31,0.04)] ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-[72px] border-b border-[#E2D3A7] px-4 flex items-center justify-between">
          <div
            onClick={() => setActiveTab(isFaculty ? 'faculty-dashboard' : 'student-dashboard')}
            className={`flex items-center gap-2.5 cursor-pointer overflow-hidden ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
            title="VIVA ANALYSER Enterprise"
          >
            <div className="w-10 h-10 rounded-[14px] bg-[#B7791F] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
              <Cpu className="w-5 h-5 text-[#FFF3D6]" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight">
                <div className="font-extrabold text-[15px] tracking-tight text-[#2D3748]">
                  VIVA <span className="text-[#B7791F]">ANALYSER</span>
                </div>
                <div className="text-[10px] font-bold text-[#8B5E34] flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F855A] animate-pulse"></span>
                  <span>{isFaculty ? 'Faculty Portal' : 'Student Portal'}</span>
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="btn-icon w-8 h-8 text-[#718096] hover:text-[#B7791F] bg-[#FFF8E8] border-[#E2D3A7]"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expand Trigger when collapsed */}
        {isCollapsed && (
          <div className="p-3 border-b border-[#E2D3A7] flex justify-center">
            <button
              onClick={() => setIsCollapsed(false)}
              className="btn-icon w-8 h-8 text-[#718096] hover:text-[#B7791F] bg-[#FFF8E8] border-[#E2D3A7]"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Nav Items List */}
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-xs font-bold transition-all ${
                  isCollapsed ? 'justify-center px-0' : ''
                } ${
                  isActive
                    ? 'bg-[#B7791F] text-white shadow-sm'
                    : 'text-[#4A5568] hover:bg-[#FFF8E8] hover:text-[#B7791F]'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#8B5E34]'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile / Logout Area */}
      <div className="p-3 border-t border-[#E2D3A7] space-y-2">
        {!isCollapsed && (
          <div className="p-2.5 rounded-[14px] bg-[#FFF8E8] border border-[#E2D3A7] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#B7791F] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {currentUser?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#2D3748] truncate">
                {currentUser?.fullName || 'Academic User'}
              </div>
              <div className="text-[10px] font-mono text-[#718096] truncate">
                {currentUser?.regNo || 'REG-ID'}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[14px] text-xs font-bold text-[#C53030] hover:bg-[#FFF0F0] transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
