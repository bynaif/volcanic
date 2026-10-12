import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Bell,
  ShieldAlert,
  Flame,
  Plane,
  ExternalLink,
  MapPin,
  Clock,
  Waves,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { AppRoute } from '../types';
import {
  useEarthquakeData,
  getMagnitudeColor,
  getRelativeTime,
  formatTimeLocal,
  formatTimeUTC,
} from '../hooks/useEarthquakeData';
import { DataCardHeader } from '../components/DataCardHeader';
import { DataErrorState } from '../components/DataErrorState';
import { EarthquakeSkeleton } from '../components/EarthquakeSkeleton';

interface AlertsPageProps {
  onNavigate: (route: AppRoute) => void;
}

type MinAlertFilter = '4.5' | '5.0' | '6.0' | 'all';

export const AlertsPage: React.FC<AlertsPageProps> = ({ onNavigate }) => {
  const { data, loading, error, refetch, feedGenerated, fetchTime } = useEarthquakeData();
  const [filterThreshold, setFilterThreshold] = useState<MinAlertFilter>('4.5');

  // Filter for earthquakes in the last 24h meeting threshold (default 4.5+)
  const alertQuakes = useMemo(() => {
    if (!data?.features) return [];
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

    return data.features.filter((f) => {
      const mag = f.properties.mag;
      const time = f.properties.time;
      if (mag === null || isNaN(mag)) return false;
      if (time < twentyFourHoursAgo) return false;

      if (filterThreshold === '4.5') return mag >= 4.5;
      if (filterThreshold === '5.0') return mag >= 5.0;
      if (filterThreshold === '6.0') return mag >= 6.0;
      return true; // all
    });
  }, [data, filterThreshold]);

  // Overall M4.5+ count for badge
  const m45Count = useMemo(() => {
    if (!data?.features) return 0;
    return data.features.filter((f) => f.properties.mag !== null && f.properties.mag >= 4.5).length;
  }, [data]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>High-Severity Ground Motion Feed</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400">Stream Connected</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Major Seismic Alerts (M4.5+)
          </h1>
        </div>

        {/* Magnitude threshold filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 self-start sm:self-auto">
          {[
            { id: '4.5', label: 'M 4.5+' },
            { id: '5.0', label: 'M 5.0+' },
            { id: '6.0', label: 'M 6.0+' },
            { id: 'all', label: 'All Quakes' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilterThreshold(item.id as MinAlertFilter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterThreshold === item.id
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Alert Feed Card */}
      <section
        aria-label="Active seismic alerts"
        className="rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-2xl backdrop-blur-xl p-4 sm:p-5 space-y-4"
      >
        {/* Requirement: On every data card show: source name (USGS), feed's last updated time, and label "Live data" */}
        <DataCardHeader
          title="Active Geological Warnings (Last 24 Hours)"
          source="USGS"
          feedTime={feedGenerated}
          fetchTime={fetchTime}
          count={alertQuakes.length}
          onRefresh={refetch}
          isRefreshing={loading}
        />

        {error ? (
          <DataErrorState error={error} onRetry={refetch} isRetrying={loading} />
        ) : loading && !data ? (
          <EarthquakeSkeleton count={4} />
        ) : alertQuakes.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              No High-Magnitude Quakes in Last 24 Hours
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              No earthquakes of magnitude {filterThreshold === 'all' ? 'any' : `${filterThreshold}+`}{' '}
              were recorded in the last 24 hours by the USGS global seismic telemetry network.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertQuakes.map((quake) => {
              const mag = quake.properties.mag ?? 0;
              const color = getMagnitudeColor(mag);
              const depth = quake.geometry.coordinates[2];

              return (
                <div
                  key={quake.id}
                  className={`p-4 sm:p-5 rounded-xl border bg-gradient-to-r from-slate-950/90 to-slate-900/80 transition-all duration-200 shadow-lg ${
                    mag >= 6.0
                      ? 'border-rose-500/50 shadow-rose-950/30'
                      : mag >= 5.0
                      ? 'border-orange-500/40 shadow-orange-950/20'
                      : 'border-amber-500/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      {/* Magnitude pill */}
                      <div
                        className={`px-3 py-2 rounded-xl font-mono font-bold text-base border flex flex-col items-center justify-center shrink-0 shadow-sm ${color.bg} ${color.text} ${color.border}`}
                      >
                        <span>M {mag.toFixed(1)}</span>
                        <span className="text-[9px] uppercase font-sans font-normal opacity-90 mt-0.5">
                          {color.badge}
                        </span>
                      </div>

                      {/* Location and Timestamps */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            <AlertTriangle className="w-3 h-3" />
                            Severe Tremor
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {getRelativeTime(quake.properties.time)}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-white">
                          {quake.properties.place || 'Unknown Epicenter'}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <Waves className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Depth: {depth.toFixed(1)} km</span>
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-violet-400" />
                            <span>Local: {formatTimeLocal(quake.properties.time)}</span>
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400 font-mono text-[11px]">
                            UTC: {formatTimeUTC(quake.properties.time)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:self-center shrink-0">
                      <a
                        href={quake.properties.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400/50 text-cyan-300 text-xs font-medium transition"
                      >
                        <span>USGS Event</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Scientific Reference: Aviation Color Codes (Standard USGS / ICAO definitions) */}
      <section
        aria-label="Aviation color code reference"
        className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">
              ICAO / USGS Aviation Color Code Scale
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Scientific Reference</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Standard alert levels used by volcano observatories worldwide to communicate volcanic ash hazard severity to civil aviation and emergency agencies:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Green */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>GREEN · Normal</span>
            </div>
            <p className="text-slate-300">
              Volcano is in typical background, non-eruptive state. Seismic tremor is at baseline.
            </p>
          </div>

          {/* Yellow */}
          <div className="p-3.5 rounded-xl bg-yellow-950/20 border border-yellow-800/40 space-y-1">
            <div className="flex items-center gap-2 text-yellow-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              <span>YELLOW · Advisory</span>
            </div>
            <p className="text-slate-300">
              Volcano exhibits signs of elevated unrest above known background level.
            </p>
          </div>

          {/* Orange */}
          <div className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-800/40 space-y-1">
            <div className="flex items-center gap-2 text-orange-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span>ORANGE · Watch</span>
            </div>
            <p className="text-slate-300">
              Heightened unrest with increased potential of eruption, or minor eruption with little/no ash.
            </p>
          </div>

          {/* Red */}
          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-1">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>RED · Warning</span>
            </div>
            <p className="text-slate-300">
              Eruption is underway or imminent with significant ash emission into the atmosphere.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
