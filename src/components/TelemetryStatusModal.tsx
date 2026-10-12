import React, { useState } from 'react';
import { Activity, X, RefreshCw, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useEarthquakeData, formatTimeUTC } from '../hooks/useEarthquakeData';

interface TelemetryStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelemetryStatusModal: React.FC<TelemetryStatusModalProps> = ({ isOpen, onClose }) => {
  const { data, loading, error, refetch, feedGenerated, fetchTime } = useEarthquakeData();
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsPinging(true);
    setPingResult(null);

    try {
      const succeeded = await refetch();
      setPingResult(
        succeeded
          ? 'Connection verified: USGS GeoJSON feed responded successfully.'
          : 'Connection probe failed: USGS refresh failed. Existing cached data may still be available.'
      );
    } catch {
      setPingResult('Connection probe failed: Unable to refresh the USGS stream.');
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="telemetry-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-2xl text-[var(--text)] relative">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 id="telemetry-modal-title" className="text-sm font-semibold text-[var(--text)]">
                Data Feed Status Diagnostics
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">VOLCANIC Core Telemetry Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close diagnostics"
            className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">App Version</span>
              <span className="text-[var(--text)] font-mono">Phase 2.0 (Live Feeds)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">USGS Seismic Ingest</span>
              {error ? (
                <span className="text-amber-300 font-medium">
                  {data ? 'Refresh Failed · Cached Data Available' : 'Feed Unavailable'}
                </span>
              ) : loading ? (
                <span className="text-[var(--accent)] font-medium">Connecting...</span>
              ) : data ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Live Connected ({data.features.length} quakes)
                </span>
              ) : (
                <span className="text-rose-400 font-medium">Feed Unavailable</span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Tile Provider</span>
              <span className="text-[var(--text)]">OpenFreeMap (Dark Style)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Feed Timestamp</span>
              <span className="text-violet-300 font-mono text-[11px]">
                {feedGenerated ? formatTimeUTC(feedGenerated.getTime()) : 'Syncing...'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Client Fetched</span>
              <span className="text-[var(--accent)] font-mono text-[11px]">
                {fetchTime ? formatTimeUTC(fetchTime.getTime()) : 'Syncing...'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/50 flex items-start gap-2.5 text-xs text-indigo-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Real-time earthquake coordinates and magnitudes are streamed directly from the United States Geological Survey (USGS). Zero mock data is generated.
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
            disabled={isPinging || loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500/15 border border-cyan-400/40 hover:bg-cyan-500/25 text-[var(--accent)] font-medium text-xs transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            <span>{isPinging ? 'Testing Endpoint...' : 'Probe Live Feed'}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-[var(--surface-muted)] hover:bg-slate-700 text-[var(--text)] font-medium text-xs transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
