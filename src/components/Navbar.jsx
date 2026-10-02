import React, { useState, useEffect } from 'react';
import {
  Cpu,
  ShieldCheck,
  HardDriveDownload,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  Share2,
  FileText,
  Activity,
  Layers,
  BrainCircuit,
  Lock,
  Globe,
  Bot,
  QrCode,
  Smartphone
} from 'lucide-react';

export default function Navbar({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onOpenReport,
  onOpenDomainBrowser,
  onOpenMultiAgent,
  onOpenDeviceConnect
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      if (onOpenDeviceConnect) onOpenDeviceConnect();
    }
  };

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: User },
    { id: 'arena', label: 'Viva Arena', icon: Cpu },
    { id: 'dna', label: 'Learning DNA', icon: BrainCircuit },
    { id: 'graph', label: 'Knowledge Map', icon: Layers },
    { id: 'innovation', label: 'Innovation Center', icon: Sparkles },
    { id: 'faculty', label: 'Faculty Control', icon: Activity }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D0E3F5] px-3 sm:px-4 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand & Universal Badge */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('gate')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#000080] p-[2px] shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-[#00E5FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-[#333333] font-heading">
                  VIVA <span className="text-[#4169E1]">ANALYSER</span>
                </span>
                <span className="badge badge-emerald text-[9px] py-0.5">OFFLINE AI</span>
              </div>
              <p className="text-[10px] text-[#555555] -mt-0.5 hidden sm:block font-medium">
                Universal Adaptive Cognitive viva Engine
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#E6F2FD] p-1.5 rounded-xl border border-[#D0E3F5]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#000080] text-white shadow-sm'
                    : 'text-[#333333] hover:text-[#000080] hover:bg-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00E5FF]' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Utilities (Dark Commanding Buttons) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Universal Domains Directory Explorer */}
          <button
            onClick={onOpenDomainBrowser}
            title="Browse all 14 Domains & 120+ Disciplines"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 transition-all shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">All Domains</span>
          </button>

          {/* Multi-Agent AI Drawer */}
          <button
            onClick={onOpenMultiAgent}
            title="Inspect 7 Cooperating AI Agents"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 transition-all shadow-sm"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">7 Agents</span>
          </button>

          {/* Connect Phone / Tablet / QR Code */}
          <button
            onClick={onOpenDeviceConnect}
            title="Connect & Install on Mobile / Tablet / PC"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-900 transition-all shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Connect Phone</span>
          </button>

          {/* User Account / Auth Trigger */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-800">{currentUser.fullName}</div>
                <div className="text-[10px] text-sky-700 font-mono font-semibold">
                  {currentUser.role === 'faculty' ? 'Faculty Mode' : currentUser.regNo}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 sm:p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-primary text-xs py-1.5 px-3"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 lg:hidden hover:bg-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 flex flex-col gap-1.5 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-300' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => {
              onOpenDeviceConnect();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 mt-1"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Connect & Install on Any Device (QR Code)</span>
          </button>
        </div>
      )}
    </header>
  );
}
