import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  Copy,
  ExternalLink,
  Wifi,
  HardDriveDownload,
  Share2,
  Cpu
} from 'lucide-react';

export default function DeviceConnectModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Detect current hostname and build mobile address
  const currentHost = window.location.hostname;
  const currentPort = window.location.port || '5173';
  const protocol = window.location.protocol;

  // If running on localhost on PC, suggest the local LAN IP for phones
  const localUrl = `${protocol}//${currentHost}:${currentPort}`;
  const networkIp = currentHost === 'localhost' || currentHost === '127.0.0.1'
    ? '10.52.212.218'
    : currentHost;
  const mobileDeviceUrl = `${protocol}//${networkIp}:${currentPort}`;

  const handleCopyUrl = (urlToCopy) => {
    navigator.clipboard.writeText(urlToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel bg-white p-6 sm:p-7 rounded-2xl border border-slate-300 max-h-[92vh] overflow-y-auto space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald text-xs">Multi-Device Connectivity</span>
              <span className="text-xs text-slate-500 font-medium">100% Offline Local Wi-Fi / Hotspot</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1 font-heading">
              Open & Install App on Any Phone, Tablet or PC
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Run VIVA ANALYSER natively as an installed app across all devices with zero cloud dependency.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code and Quick Connect Block */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
          
          {/* QR Code Card */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm shrink-0 text-center">
            <QRCodeSVG
              value={mobileDeviceUrl}
              size={160}
              bgColor="#ffffff"
              fgColor="#0f172a"
              level="M"
              includeMargin={false}
            />
            <div className="text-[10px] text-slate-700 font-bold mt-2 uppercase tracking-wider">
              Scan with Phone Camera
            </div>
          </div>

          {/* Details & URL Copy */}
          <div className="flex-1 space-y-3 w-full">
            <div className="flex items-center gap-2 text-xs text-slate-900 font-bold uppercase tracking-wider">
              <Wifi className="w-4 h-4 text-emerald-600" />
              <span>Connect on Same Wi-Fi / Hotspot</span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 font-semibold">Direct Mobile Address:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={mobileDeviceUrl}
                  className="glass-input font-mono text-xs py-2 text-slate-900 font-bold select-all bg-white"
                />
                <button
                  onClick={() => handleCopyUrl(mobileDeviceUrl)}
                  className="btn-secondary text-xs py-2 px-3 shrink-0 flex items-center gap-1.5 font-bold"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 leading-relaxed font-medium">
              💡 <strong>Instant Access:</strong> On your Android phone (Chrome) or iPhone (Safari), scan the QR code above or type the address directly.
            </div>
          </div>

        </div>

        {/* 3 Step Installation Guides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          {/* Android Guide */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Android (Chrome)</span>
            </div>
            <ol className="list-decimal list-inside text-slate-600 space-y-1 leading-relaxed font-medium">
              <li>Open URL in Chrome</li>
              <li>Tap <strong>Menu (3 dots)</strong></li>
              <li>Tap <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong></li>
            </ol>
          </div>

          {/* iOS Guide */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Tablet className="w-4 h-4 text-sky-600" />
              <span>iPhone / iPad (Safari)</span>
            </div>
            <ol className="list-decimal list-inside text-slate-600 space-y-1 leading-relaxed font-medium">
              <li>Open URL in Safari</li>
              <li>Tap <strong>Share</strong> button</li>
              <li>Tap <strong>"Add to Home Screen"</strong></li>
            </ol>
          </div>

          {/* PC / Desktop Guide */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Laptop className="w-4 h-4 text-purple-600" />
              <span>Windows / Mac (Desktop)</span>
            </div>
            <ol className="list-decimal list-inside text-slate-600 space-y-1 leading-relaxed font-medium">
              <li>Open in Chrome or Edge</li>
              <li>Click <strong>Install</strong> icon in URL bar</li>
              <li>Runs in dedicated desktop app window</li>
            </ol>
          </div>

        </div>

        {/* Offline Guarantee */}
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Service Worker Active: App caches all resources locally and works 100% offline.</span>
          </div>
          <span className="badge badge-emerald text-[9px]">PWA Ready</span>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-200">
          <button onClick={onClose} className="btn-primary text-xs py-2.5 px-6 font-bold shadow-md">
            Close & Continue
          </button>
        </div>

      </div>
    </div>
  );
}
