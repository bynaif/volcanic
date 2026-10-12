import React, { useState } from 'react';
import { Activity, Shield, ArrowLeft } from 'lucide-react';
import { AppRoute } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { TelemetryStatusModal } from './TelemetryStatusModal';

interface HeaderProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate, title }) => {
  const [showModal, setShowModal] = useState(false);
  const isSubRoute = currentRoute.startsWith('more/');

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#070914]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-6 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand or Back Button */}
          <div className="flex items-center gap-3">
            {isSubRoute ? (
              <button
                type="button"
                onClick={() => onNavigate('more')}
                aria-label="Back to More menu"
                className="group flex items-center gap-1.5 px-2.5 py-1.5 -ml-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs font-medium">More</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-violet-600/30 border border-cyan-400/30 text-cyan-400 shadow-md shadow-cyan-950/40">
                  {/* Glowing volcanic icon */}
                  <svg className="w-5 h-5 fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L15 8L19 12L21 21H3L5 12L9 8L12 2Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2V8" stroke="#00f0ff" />
                    <circle cx="12" cy="5" r="1" fill="#00f0ff" />
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 font-mono">
                      VOLCANIC
                    </span>
                    <span className="hidden sm:inline text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                      PWA
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 hidden xs:block">
                    Geological Early Warning Baseline
                  </p>
                </div>
              </div>
            )}

            {title && isSubRoute && (
              <span className="text-sm font-semibold text-white truncate max-w-[180px] xs:max-w-none">
                {title}
              </span>
            )}
          </div>

          {/* Right: Telemetry status & PWA install */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Status indicator badge / trigger */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              aria-label="View data feed status"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <span className="text-[11px] font-medium hidden sm:inline">Data Offline</span>
              <span className="text-[11px] font-medium sm:hidden">Offline</span>
            </button>

            {/* Install button */}
            <PWAInstallButton variant="nav" />
          </div>
        </div>
      </header>

      <TelemetryStatusModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
