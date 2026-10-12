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
      <Download className="w-3.5 h-3.5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
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
          className={`group flex items-center justify-between w-full p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] shadow-lg shadow-cyan-950/20 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                Install VOLCANIC App
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Add to your home screen for rapid offline alerts & monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-soft)] border border-[var(--border)] text-xs font-medium text-[var(--accent)] group-hover:bg-[var(--accent-soft)] transition-all">
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </div>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          type="button"
          aria-label="Install VOLCANIC Progressive Web App"
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--accent-soft)] hover:bg-[var(--accent-soft)] border border-[var(--border)] hover:border-[var(--accent)] text-xs font-medium text-[var(--accent)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${className}`}
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
          <div className="w-full max-w-sm rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-2xl text-[var(--text)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 id="ios-modal-title" className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[var(--accent)]" />
                Install on iOS Safari
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                aria-label="Close dialog"
                className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-[var(--text-muted)]">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)]">
                <Share2 className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                <p>
                  1. Tap the <strong className="text-[var(--text)]">Share</strong> button in Safari's bottom toolbar.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)]">
                <PlusSquare className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                <p>
                  2. Scroll down and choose <strong className="text-[var(--text)]">Add to Home Screen</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-slate-950 font-semibold text-xs transition"
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
          <div className="w-full max-w-sm rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-2xl text-[var(--text)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 id="browser-modal-title" className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
                <Download className="w-4 h-4 text-[var(--accent)]" />
                Install VOLCANIC
              </h3>
              <button
                onClick={() => setShowGenericGuide(false)}
                aria-label="Close dialog"
                className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-[var(--text-muted)] leading-relaxed">
              To install this PWA on your device, use your browser's menu (such as the address bar install icon on Chrome/Edge or "Add to Home Screen" on mobile browsers).
            </p>
            <div className="mt-3 p-3 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-[11px] text-[var(--text-muted)]">
              Status: Service worker active · Ready for standalone launch.
            </div>
            <button
              onClick={() => setShowGenericGuide(false)}
              className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[var(--text)] font-medium text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
