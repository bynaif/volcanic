import React from 'react';
import { Activity, Radio, RefreshCw } from 'lucide-react';
import { getRelativeTime, formatTimeUTC } from '../hooks/useEarthquakeData';

interface DataCardHeaderProps {
  title?: string;
  source?: string;
  lastUpdated?: Date | number | null;
  count?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export const DataCardHeader: React.FC<DataCardHeaderProps> = ({
  title,
  source = 'USGS',
  lastUpdated,
  count,
  onRefresh,
  isRefreshing = false,
  className = '',
}) => {
  const updatedTimestamp =
    lastUpdated instanceof Date ? lastUpdated.getTime() : typeof lastUpdated === 'number' ? lastUpdated : null;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 text-xs ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        {title && <span className="font-semibold text-white">{title}</span>}

        {/* Live data label with pulsing indicator */}
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span>Live data</span>
        </div>

        {/* Source name */}
        <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
          <span className="text-slate-600">·</span>
          <span>Source:</span>
          <span className="text-cyan-300 font-medium">{source}</span>
        </div>

        {/* Count if available */}
        {typeof count === 'number' && (
          <div className="hidden xs:flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">{count} events</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Last updated time */}
        {updatedTimestamp ? (
          <span
            className="text-[11px] text-slate-400 font-mono"
            title={formatTimeUTC(updatedTimestamp)}
          >
            Updated {getRelativeTime(updatedTimestamp)}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-mono">Syncing...</span>
        )}

        {/* Refresh button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh live data"
            className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
};
