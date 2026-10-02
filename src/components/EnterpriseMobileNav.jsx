import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  Layers,
  User,
  Users,
  FileSpreadsheet
} from 'lucide-react';

export default function EnterpriseMobileNav({
  activeTab,
  setActiveTab,
  currentUser
}) {
  const isFaculty = currentUser?.role === 'faculty';

  const studentItems = [
    { id: 'student-dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'my-assignments', label: 'Assignments', icon: BookOpen },
    { id: 'self-learning', label: 'Viva', icon: Cpu },
    { id: 'knowledge-map', label: 'Knowledge', icon: Layers },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const facultyItems = [
    { id: 'faculty-dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'create-assignment', label: 'Assignments', icon: BookOpen },
    { id: 'faculty-students', label: 'Students', icon: Users },
    { id: 'faculty-results', label: 'Results', icon: FileSpreadsheet },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const items = isFaculty ? facultyItems : studentItems;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF7E2] border-t border-[#E2D3A7] px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-[#B7791F] font-bold'
                  : 'text-[#718096] hover:text-[#2D3748]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#B7791F]' : 'text-[#718096]'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
