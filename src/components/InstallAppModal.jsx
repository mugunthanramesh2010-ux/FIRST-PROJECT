import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  WifiOff,
  Copy,
  Check,
  ExternalLink,
  Laptop
} from 'lucide-react';

export default function InstallAppModal({ isOpen, onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState('android'); // 'android' | 'ios' | 'qr'
  const [copied, setCopied] = useState(false);

  const defaultPublicUrl = 'https://things-explaining-prepared-puzzle.trycloudflare.com';
  const currentUrl = (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1'))
    ? window.location.origin
    : defaultPublicUrl;

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('[VIVA PWA] beforeinstallprompt event captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Browser doesn't trigger beforeinstallprompt (e.g., iOS or already installed or desktop Chrome without prompt)
      alert(
        'To install directly on your phone:\n\n' +
        '• Android (Chrome): Tap the 3 dots (⋮) in the top-right corner -> Select "Install app" or "Add to Home screen".\n\n' +
        '• iPhone (Safari): Tap the Share button at the bottom -> Select "Add to Home Screen".'
      );
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-lg bg-[#161B22] border-2 border-[#00F5D4]/70 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 text-[#F0F6FC]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition-all cursor-pointer"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-xl bg-[#00F5D4]/15 border border-[#00F5D4]/40 flex items-center justify-center text-[#00F5D4] shrink-0">
            <Smartphone className="w-6 h-6 text-[#00F5D4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#00F5D4]/20 border border-[#00F5D4]/40 text-[#00F5D4] text-[10px] font-bold tracking-wide uppercase">
                PWA Mobile Install
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#39FF14]/20 border border-[#39FF14]/40 text-[#39FF14] text-[10px] font-bold">
                100% Offline
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-[#F0F6FC] leading-tight mt-1">
              Install VIVA as Phone App
            </h3>
            <p className="text-xs text-[#8B949E] mt-0.5">
              Zero cloud latency • Works with your PC completely turned OFF
            </p>
          </div>
        </div>

        {/* Offline Guarantee Notice */}
        <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-start gap-3 text-xs">
          <div className="w-7 h-7 rounded-lg bg-[#39FF14]/15 flex items-center justify-center shrink-0 mt-0.5">
            <WifiOff className="w-4 h-4 text-[#39FF14]" />
          </div>
          <div className="space-y-1 text-[#8B949E]">
            <p className="text-[#F0F6FC] font-semibold">
              How does it work without PC running?
            </p>
            <p className="leading-relaxed">
              When installed, our Service Worker caches all question ontologies, Bloom-scale adaptivity, and evaluation engines directly onto your phone. You can turn off your laptop/PC and the app runs 24/7 forever.
            </p>
          </div>
        </div>

        {/* Device Switcher Tabs */}
        <div className="flex rounded-xl bg-[#0D1117] p-1 border border-[#30363D]">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'android' ? 'bg-[#00F5D4] text-[#0D1117] shadow-sm' : 'text-[#8B949E] hover:text-[#F0F6FC]'
            }`}
          >
            Android (Chrome)
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'ios' ? 'bg-[#00F5D4] text-[#0D1117] shadow-sm' : 'text-[#8B949E] hover:text-[#F0F6FC]'
            }`}
          >
            iPhone (Safari)
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'qr' ? 'bg-[#00F5D4] text-[#0D1117] shadow-sm' : 'text-[#8B949E] hover:text-[#F0F6FC]'
            }`}
          >
            Scan QR Code
          </button>
        </div>

        {/* Tab 1: Android */}
        {activeTab === 'android' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="space-y-2.5 text-[#8B949E] bg-[#0D1117] p-3.5 rounded-xl border border-[#30363D]">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#21262D] text-[#00F5D4] font-bold flex items-center justify-center shrink-0">1</span>
                <span>Open this link in <strong>Chrome</strong> on your phone.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#21262D] text-[#00F5D4] font-bold flex items-center justify-center shrink-0">2</span>
                <span>Tap the <strong>"Install App to Phone Now"</strong> button below.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#21262D] text-[#00F5D4] font-bold flex items-center justify-center shrink-0">3</span>
                <span>Or tap Chrome menu (<strong>⋮</strong>) in the top-right corner and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
              </div>
            </div>

            <button
              onClick={handleInstallClick}
              className="w-full h-[48px] rounded-xl bg-[#00F5D4] hover:bg-[#00F5D4]/90 text-[#0D1117] font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00F5D4]/20 transition-all active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-[#0D1117]" />
              <span>{isInstalled ? '✓ App Already Installed on Device' : 'Install App to Phone Now'}</span>
            </button>
          </div>
        )}

        {/* Tab 2: iPhone iOS */}
        {activeTab === 'ios' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="space-y-2.5 text-[#8B949E] bg-[#0D1117] p-3.5 rounded-xl border border-[#30363D]">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#21262D] text-[#00F5D4] font-bold flex items-center justify-center shrink-0">1</span>
                <span>Open the link in <strong>Safari</strong> on your iPhone.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#21262D] text-[#00F5D4] font-bold flex items-center justify-center shrink-0">2</span>
                <span>Tap the <strong>Share button</strong> <Share2 className="w-3.5 h-3.5 inline text-[#00F5D4] mx-0.5" /> at the bottom of Safari.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#21262D] text-[#00F5D4] font-bold flex items-center justify-center shrink-0">3</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-[#00F5D4] mx-0.5" />.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#21262D] text-[#00F5D4] font-bold flex items-center justify-center shrink-0">4</span>
                <span>Tap <strong>Add</strong> in the top-right corner. The VIVA icon appears on your home screen!</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#00F5D4]/10 border border-[#00F5D4]/30 text-center text-[#00F5D4] font-semibold">
              iOS Safari adds VIVA directly as a standalone app with full offline cache.
            </div>
          </div>
        )}

        {/* Tab 3: QR Code & Link Sharing */}
        {activeTab === 'qr' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="flex flex-col items-center justify-center p-4 bg-[#0D1117] rounded-xl border border-[#30363D] text-center space-y-3">
              <div className="p-3 bg-white rounded-xl shadow-md">
                <QRCodeSVG value={currentUrl} size={150} level="M" />
              </div>
              <p className="text-[#8B949E] text-xs">
                Scan with your phone's camera to open and install instantly.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2.5 text-xs text-[#00F5D4] font-mono truncate focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="h-[38px] px-3.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-[#F0F6FC] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-[#39FF14]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Link bar if not in QR tab */}
        {activeTab !== 'qr' && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs">
            <span className="font-mono text-[#00F5D4] truncate max-w-[260px] sm:max-w-xs text-[11px]">
              {currentUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="text-[#F0F6FC] hover:text-[#00F5D4] font-semibold flex items-center gap-1 cursor-pointer shrink-0 px-2 py-1 rounded bg-[#21262D]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#39FF14]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        )}

        {/* Footer Note */}
        <div className="pt-2 border-t border-[#30363D] flex items-center justify-between text-[11px] text-[#8B949E]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
            <span>Service Worker Precaching Active</span>
          </span>
          <button
            onClick={onClose}
            className="text-[#F0F6FC] font-bold hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
