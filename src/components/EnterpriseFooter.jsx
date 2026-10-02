import React from 'react';
import { HardDrive, ShieldCheck } from 'lucide-react';

export default function EnterpriseFooter() {
  return (
    <footer className="h-[64px] bg-[#FFF7E2] border-t border-[#E2D3A7] px-4 sm:px-8 shrink-0">
      <div className="max-w-[1280px] h-full mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#718096] gap-2">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#2F855A]" />
          <strong className="text-[#2D3748]">VIVA ANALYSER Enterprise</strong>
          <span>• 100% Offline AI Cognitive Engine</span>
        </div>
        <div className="text-[11px] font-mono text-[#718096] hidden sm:block">
          Smart India Hackathon Standard • Zero External Cloud Footprint
        </div>
      </div>
    </footer>
  );
}
