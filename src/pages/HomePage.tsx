import React, { useState } from 'react';
import {
  Flame,
  Globe2,
  AlertTriangle,
  Radio,
  Search,
  Activity,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  MapPin,
  Waves,
} from 'lucide-react';
import { AppRoute } from '../types';
import { formatDepthKm } from '../utils/units';
import { TelemetryStatusModal } from '../components/TelemetryStatusModal';
import {
  useEarthquakeData,
  getMagnitudeColor,
  getRelativeTime,
} from '../hooks/useEarthquakeData';
import { DataCardHeader } from '../components/DataCardHeader';
import { DataErrorState } from '../components/DataErrorState';
import { EarthquakeSkeleton } from '../components/EarthquakeSkeleton';
import { EarthquakeMagnitudeChart } from '../components/EarthquakeMagnitudeChart';

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const { data, loading, error, refetch, feedGenerated, fetchTime } = useEarthquakeData();

  // Get the 10 most recent earthquakes
  const latestTenQuakes = data?.features?.slice(0, 10) || [];

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Hero Banner / Status Overview Card */}
      <section
        aria-label="System overview"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c112b] via-[#090d20] to-[#060814] border border-cyan-500/20 p-6 md:p-8 shadow-2xl"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>VOLCANIC Phase 2 Active</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-300">Live Ingestion Connected</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-mono">
              Global Volcanic & Seismic Monitor
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Mobile-first geological hazard early warning client connected to real-time seismic feeds, interactive geospatial mapping, and rapid alert broadcasting.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('map')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-950/40 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Globe2 className="w-4 h-4" />
              <span>Launch Live Map</span>
            </button>
            <button
              type="button"
              onClick={() => setShowDiagnostics(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-slate-600 text-slate-200 font-medium text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Diagnostics</span>
            </button>
          </div>
        </div>
      </section>

      {/* Latest Earthquakes Live Card */}
      <section
        aria-label="Latest earthquakes feed"
        className="rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-2xl backdrop-blur-xl overflow-hidden space-y-3 p-4 sm:p-5"
      >
        {/* Requirement: On every data card show: source name (USGS), feed's last updated time, and label "Live data" */}
        <DataCardHeader
          title="Latest Earthquakes"
          source="USGS"
          feedTime={feedGenerated}
          fetchTime={fetchTime}
          count={data?.features?.length}
          onRefresh={refetch}
          isRefreshing={loading}
          error={error}
        />

        {error ? (
          <DataErrorState error={error} onRetry={refetch} isRetrying={loading} />
        ) : loading && !data ? (
          <EarthquakeSkeleton count={10} />
        ) : latestTenQuakes.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No earthquakes currently reported in the USGS all-day feed.
          </div>
        ) : (
          <div className="space-y-2">
            {latestTenQuakes.map((quake) => {
              const mag = quake.properties.mag;
              const color = getMagnitudeColor(mag);
              const depth = quake.geometry.coordinates[2];

              return (
                <div
                  key={quake.id}
                  className="group flex items-center justify-between gap-3.5 p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Magnitude badge */}
                    <div
                      className={`w-11 h-11 rounded-xl font-mono font-bold text-sm border flex items-center justify-center shrink-0 shadow-sm ${color.bg} ${color.text} ${color.border}`}
                    >
                      M{mag !== null ? mag.toFixed(1) : '–'}
                    </div>

                    {/* Place and Depth info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-white truncate group-hover:text-cyan-300 transition-colors">
                        {quake.properties.place || 'Unknown Location'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Waves className="w-3 h-3 text-cyan-400" />
                          <span>Depth: {depth !== undefined ? formatDepthKm(depth) : 'N/A'}</span>
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-400 font-mono">
                          {getRelativeTime(quake.properties.time)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions / USGS link */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={quake.properties.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View USGS details for event in ${quake.properties.place}`}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400/40 text-slate-400 hover:text-cyan-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      title="Open USGS event page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                Showing 10 most recent global seismic tremors
              </span>
              <button
                type="button"
                onClick={() => onNavigate('map')}
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold transition"
              >
                <span>View all on Live Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Magnitude Distribution Trend Chart (10 most recent earthquakes) */}
      {!error && latestTenQuakes.length > 0 && (
        <section aria-label="Magnitude trend visualization">
          <EarthquakeMagnitudeChart quakes={latestTenQuakes} />
        </section>
      )}

      {/* Feature Modules Quick Access */}
      <section aria-label="Feature modules">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Navigation Modules
          </h2>
          <span className="text-[11px] text-emerald-400 font-mono">
            {data ? `${data.features.length} Live Seismic Events` : 'Syncing...'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Live Map */}
          <button
            type="button"
            onClick={() => onNavigate('map')}
            className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
              <span>Live Map</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Interactive MapLibre GL map with magnitude color & scale markers.
            </p>
          </button>

          {/* Card 2: Alerts */}
          <button
            type="button"
            onClick={() => onNavigate('alerts')}
            className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-amber-500/40 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
              <span>Alerts (M4.5+)</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Critical in-app alerts for quakes magnitude 4.5 and higher.
            </p>
          </button>

          {/* Card 3: News */}
          <button
            type="button"
            onClick={() => onNavigate('news')}
            className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-violet-500/40 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-3 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors flex items-center justify-between">
              <span>News & Bulletins</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-violet-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Observatory communiqués and geological studies.
            </p>
          </button>

          {/* Card 4: Search */}
          <button
            type="button"
            onClick={() => onNavigate('more/search')}
            className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
              <span>Volcano Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Holocene volcanic edifices catalog and terminology.
            </p>
          </button>
        </div>
      </section>

      <TelemetryStatusModal isOpen={showDiagnostics} onClose={() => setShowDiagnostics(false)} />
    </div>
  );
};
