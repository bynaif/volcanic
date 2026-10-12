import React from 'react';
import { Activity, Radio, RefreshCw, Clock, ArrowDownToLine } from 'lucide-react';
import { getRelativeTime, formatTimeUTC } from '../hooks/useEarthquakeData';

interface DataCardHeaderProps {
  title?: string;
  source?: string;
  feedTime?: Date | number | string | null; // Data feed's own timestamp (USGS metadata.generated or Open-Meteo current.time)
  fetchTime?: Date | number | null;         // Client device fetch timestamp
  count?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  error?: string | null;
  className?: string;
}

export const DataCardHeader: React.FC<DataCardHeaderProps> = ({
  title,
  source = 'USGS',
  feedTime,
  fetchTime,
  count,
  onRefresh,
  isRefreshing = false,
  error = null,
  className = '',
}) => {
  // Format feed's own timestamp
  const formatFeedTime = (time: Date | number | string | null | undefined): string => {
    if (!time) return 'Pending';
    if (typeof time === 'string') {
      // E.g. Open-Meteo "2026-10-12T15:45"
      return time.replace('T', ' ');
    }
    const ms = time instanceof Date ? time.getTime() : time;
    return new Date(ms).toUTCString().replace(/^.*?, /, '').replace(/:\d{2} GMT$/, ' UTC');
  };

  // Format client fetch timestamp
  const formatFetchTime = (time: Date | number | null | undefined): string => {
    if (!time) return 'Pending';
    const ms = time instanceof Date ? time.getTime() : time;
    return getRelativeTime(ms);
  };

  const getFullFetchUTC = (time: Date | number | null | undefined): string => {
    if (!time) return '';
    const ms = time instanceof Date ? time.getTime() : time;
    return new Date(ms).toUTCString();
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 text-xs ${className}`}
    >
      {/* Left items: Title, Live data badge, Source, Count */}
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

      {/* Right items: Feed timestamp + Client fetch timestamp + Refresh */}
      <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
        {/* Requirement 3: Show data feed's own timestamp AND fetch time separately */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          {/* Feed's own generated timestamp */}
          <div className="flex items-center gap-1 text-slate-300 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
            <Clock className="w-3 h-3 text-violet-400" />
            <span className="text-slate-500">Feed Generated:</span>
            <span className="text-violet-300 font-medium">{formatFeedTime(feedTime)}</span>
          </div>

          {/* Client fetch timestamp */}
          <div
            className="flex items-center gap-1 text-slate-300 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800"
            title={`Client Fetched at ${getFullFetchUTC(fetchTime)}`}
          >
            <ArrowDownToLine className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-500">Fetched:</span>
            <span className="text-cyan-300 font-medium">{formatFetchTime(fetchTime)}</span>
          </div>
        </div>

        {/* Refresh button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh live data"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition disabled:opacity-50"
            title="Refresh feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
};
