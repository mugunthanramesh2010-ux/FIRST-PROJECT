import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  AlertTriangle,
  KeyRound,
  FileText,
  Clock,
  Eye,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { getAuditLogs } from '../services/db';

export default function SecurityCenterView() {
  const [auditLogs, setAuditLogs] = useState(() => getAuditLogs());

  const securityMetrics = {
    copyAttemptsBlocked: 0,
    pasteAttemptsBlocked: 0,
    tabSwitchesDetected: 0,
    authenticityScore: 98,
    humanTypingScore: 96,
    aiMisuseProbability: 2.1
  };

  return (
    <div className="space-y-[48px] animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* 1. Header Card */}
      <div className="ent-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-mastered">Zero-Trust Security Core</span>
            <span className="caption-text text-[#8B949E]">Keystroke Biometrics &amp; Clipboard Isolation</span>
          </div>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-[#F0F6FC] mt-1 tracking-tight">
            Academic Security &amp; Anti-Cheat Center
          </h2>
          <p className="caption-text mt-1 text-[#8B949E] max-w-2xl leading-relaxed">
            Continuous background telemetry protecting examination authenticity. Monitors clipboard interceptions, focus blur events, burst typing anomalies, and automated LLM copy-paste attempts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0D1117] px-4 py-2 rounded-[12px] border border-[#30363D]">
          <ShieldCheck className="w-5 h-5 text-[#39FF14]" />
          <span className="text-[13px] font-bold text-[#F0F6FC]">Shield Active &amp; Enforcing</span>
        </div>
      </div>

      {/* 2. 6 Metric Cards (Cards: Radius 16px, Padding 24px) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[20px]">
        <div className="score-card h-[160px] flex flex-col justify-between items-start">
          <span className="text-[10px] text-[#8B949E] uppercase font-bold tracking-wider">Copy Attempts</span>
          <div className="text-[32px] font-black text-[#F0F6FC] font-mono leading-none">
            {securityMetrics.copyAttemptsBlocked}
          </div>
          <span className="badge-mastered text-[10px]">Blocked</span>
        </div>

        <div className="score-card h-[160px] flex flex-col justify-between items-start">
          <span className="text-[10px] text-[#8B949E] uppercase font-bold tracking-wider">Paste Attempts</span>
          <div className="text-[32px] font-black text-[#F0F6FC] font-mono leading-none">
            {securityMetrics.pasteAttemptsBlocked}
          </div>
          <span className="badge-mastered text-[10px]">Blocked</span>
        </div>

        <div className="score-card h-[160px] flex flex-col justify-between items-start">
          <span className="text-[10px] text-[#8B949E] uppercase font-bold tracking-wider">Tab Switches</span>
          <div className="text-[32px] font-black text-[#F0F6FC] font-mono leading-none">
            {securityMetrics.tabSwitchesDetected}
          </div>
          <span className="caption-text text-[11px]">0 Blur Events</span>
        </div>

        <div className="score-card h-[160px] flex flex-col justify-between items-start">
          <span className="text-[10px] text-[#8B949E] uppercase font-bold tracking-wider">Authenticity</span>
          <div className="text-[32px] font-black text-[#39FF14] font-mono leading-none">
            {securityMetrics.authenticityScore}%
          </div>
          <span className="badge-mastered text-[10px]">Certified</span>
        </div>

        <div className="score-card h-[160px] flex flex-col justify-between items-start">
          <span className="text-[10px] text-[#8B949E] uppercase font-bold tracking-wider">Human Rhythm</span>
          <div className="text-[32px] font-black text-[#00F5D4] font-mono leading-none">
            {securityMetrics.humanTypingScore}%
          </div>
          <span className="text-[11px] text-[#00F5D4] font-semibold">Variance OK</span>
        </div>

        <div className="score-card h-[160px] flex flex-col justify-between items-start">
          <span className="text-[10px] text-[#8B949E] uppercase font-bold tracking-wider">AI Misuse Risk</span>
          <div className="text-[32px] font-black text-[#39FF14] font-mono leading-none">
            {securityMetrics.aiMisuseProbability}%
          </div>
          <span className="badge-mastered text-[10px]">Negligible</span>
        </div>
      </div>

      {/* 3. Security Policies & Audit Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        
        {/* Security Policies */}
        <div className="ent-card space-y-4">
          <h3 className="text-[20px] font-bold text-[#F0F6FC] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#00F5D4]" />
            <span>Active Enforcement Policies</span>
          </h3>

          <div className="space-y-3 pt-2 text-[13px]">
            <div className="p-3.5 rounded-[12px] bg-[#0D1117] border border-[#30363D] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#39FF14] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#F0F6FC]">Clipboard Interception</strong>
                <p className="caption-text text-[#8B949E] text-[12px] mt-0.5">
                  Direct paste shortcuts (Ctrl+V, Shift+Insert) and right-click paste context menus are completely blocked.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-[12px] bg-[#0D1117] border border-[#30363D] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#39FF14] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#F0F6FC]">Focus Blur Tracking</strong>
                <p className="caption-text text-[#8B949E] text-[12px] mt-0.5">
                  Window focus blur and alt-tab switching events are recorded and deducted from examination marks.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-[12px] bg-[#0D1117] border border-[#30363D] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#39FF14] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#F0F6FC]">Keystroke Cadence Telemetry</strong>
                <p className="caption-text text-[#8B949E] text-[12px] mt-0.5">
                  Bursts exceeding 150 WPM without human inter-key latency variance trigger an anomaly flag.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="ent-card space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[20px] font-bold text-[#F0F6FC] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FFB800]" />
              <span>Real-Time Audit Log</span>
            </h3>
            <button
              onClick={() => setAuditLogs(getAuditLogs())}
              className="btn-icon w-8 h-8 text-[#8B949E]"
              title="Refresh Audit Trail"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <div className="p-6 text-center text-[#8B949E] bg-[#0D1117] rounded-[12px] border border-[#30363D]">
                <ShieldCheck className="w-8 h-8 text-[#39FF14] mx-auto mb-2" />
                <span className="text-[13px] font-semibold text-[#F0F6FC] block">Clean Behavioral Record</span>
                <span className="caption-text text-[11px]">No malicious inputs or clipboard violations logged.</span>
              </div>
            ) : (
              auditLogs.slice(0, 6).map((log, i) => (
                <div key={i} className="p-3 rounded-[10px] bg-[#0D1117] border border-[#30363D] text-[12px] flex justify-between items-center">
                  <span className="text-[#F0F6FC]">{log.action || log.event}</span>
                  <span className="font-mono text-[#8B949E] text-[11px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
