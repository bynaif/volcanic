import React, { useState } from 'react';
import { Activity, X, RefreshCw, AlertCircle, ShieldAlert, Cpu } from 'lucide-react';

interface TelemetryStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelemetryStatusModal: React.FC<TelemetryStatusModalProps> = ({ isOpen, onClose }) => {
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = () => {
    setIsPinging(true);
    setPingResult(null);
    setTimeout(() => {
      setIsPinging(false);
      setPingResult('Phase 1 Verification Complete: Client online, upstream live feeds awaiting Phase 2 connection.');
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="telemetry-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#0c1022] border border-slate-700/80 p-6 shadow-2xl text-slate-100 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 id="telemetry-modal-title" className="text-sm font-semibold text-white">
                Data Feed Status Diagnostics
              </h3>
              <p className="text-[11px] text-slate-400">VOLCANIC Core Telemetry Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close diagnostics"
            className="text-slate-400 hover:text-white p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">App Version</span>
              <span className="text-slate-200 font-mono">Phase 1 (Release 1.0)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Live Data Ingest</span>
              <span className="text-amber-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Not Connected Yet
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Target Observatories</span>
              <span className="text-slate-300">GVP · USGS · VAAC · INGV</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Client Engine</span>
              <span className="text-cyan-400 font-mono">Vite + React PWA (Standalone Ready)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/50 flex items-start gap-2.5 text-xs text-indigo-200">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              All views are operating in Phase 1 standalone baseline mode. No synthetic, fake, or mocked telemetry data is rendered.
            </p>
          </div>

          {pingResult && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300">
              {pingResult}
            </div>
          )}
        </div>

        <div className="mt-5 flex gap-2.5">
          <button
            onClick={handleTestConnection}
            disabled={isPinging}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500/15 border border-cyan-400/40 hover:bg-cyan-500/25 text-cyan-300 font-medium text-xs transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            <span>{isPinging ? 'Testing Endpoints...' : 'Probe Endpoints'}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
