import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'card' | 'badge';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'nav',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGenericGuide, setShowGenericGuide] = useState(false);

  if (isInstalled) {
    if (variant === 'badge') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>App Installed</span>
        </span>
      );
    }
    return null;
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowGenericGuide(true);
    }
  };

  const buttonContent = (
    <>
      <Download className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
      <span>Install PWA</span>
    </>
  );

  return (
    <>
      {variant === 'card' ? (
        <button
          onClick={handleInstallClick}
          type="button"
          aria-label="Install VOLCANIC application to home screen"
          className={`group flex items-center justify-between w-full p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400/60 shadow-lg shadow-cyan-950/20 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                Install VOLCANIC App
              </p>
              <p className="text-xs text-slate-400">
                Add to your home screen for rapid offline alerts & monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-xs font-medium text-cyan-300 group-hover:bg-cyan-500/25 transition-all">
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </div>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          type="button"
          aria-label="Install VOLCANIC Progressive Web App"
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-xs font-medium text-cyan-300 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${className}`}
        >
          {buttonContent}
        </button>
      )}

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 id="ios-modal-title" className="text-base font-semibold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                Install on iOS Safari
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                aria-label="Close dialog"
                className="text-slate-400 hover:text-white p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/40">
                <Share2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  1. Tap the <strong className="text-white">Share</strong> button in Safari's bottom toolbar.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/40">
                <PlusSquare className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <p>
                  2. Scroll down and choose <strong className="text-white">Add to Home Screen</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Generic Browser Guide Modal */}
      {showGenericGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="browser-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 id="browser-modal-title" className="text-base font-semibold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                Install VOLCANIC
              </h3>
              <button
                onClick={() => setShowGenericGuide(false)}
                aria-label="Close dialog"
                className="text-slate-400 hover:text-white p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-300 leading-relaxed">
              To install this PWA on your device, use your browser's menu (such as the address bar install icon on Chrome/Edge or "Add to Home Screen" on mobile browsers).
            </p>
            <div className="mt-3 p-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-[11px] text-slate-400">
              Status: Service worker active · Ready for standalone launch.
            </div>
            <button
              onClick={() => setShowGenericGuide(false)}
              className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
