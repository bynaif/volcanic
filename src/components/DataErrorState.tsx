import React from 'react';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

interface DataErrorStateProps {
  error?: string | null;
  onRetry: () => void;
  isRetrying?: boolean;
  className?: string;
}

export const DataErrorState: React.FC<DataErrorStateProps> = ({
  error,
  onRetry,
  isRetrying = false,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`rounded-2xl theme-surface border border-rose-500/30 p-6 md:p-8 text-center space-y-4 shadow-xl shadow-rose-950/20 backdrop-blur-xl ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
        <WifiOff className="w-6 h-6" />
      </div>

      <div className="max-w-md mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>USGS Geological Stream Unavailable</span>
        </div>
        <h3 className="text-base font-bold theme-text">
          Real-Time Seismic Feed Disrupted
        </h3>
        <p className="text-xs theme-text-muted leading-relaxed">
          {error ||
            'The USGS earthquake GeoJSON feed could not be fetched. This may be due to temporary network connectivity loss or upstream API maintenance.'}
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/40 hover:bg-cyan-500/25 theme-accent font-semibold text-xs transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Re-establishing Connection...' : 'Retry Feed Ingestion'}</span>
        </button>
      </div>
    </div>
  );
};
