import React, { useState } from 'react';
import {
  Flame,
  Globe2,
  AlertTriangle,
  Radio,
  Search,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  WifiOff,
} from 'lucide-react';
import { AppRoute } from '../types';
import { EmptyState } from '../components/EmptyState';
import { TelemetryStatusModal } from '../components/TelemetryStatusModal';

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Hero Banner / Status Overview Card */}
      <section aria-label="System overview" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c112b] via-[#090d20] to-[#060814] border border-cyan-500/20 p-6 md:p-8 shadow-2xl">
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>VOLCANIC Core PWA</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Phase 1 Baseline</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-mono">
              Global Volcanic Activity Monitor
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Mobile-first geological hazard early warning client. Built with high-fidelity geospatial rendering, PWA offline caching, and real-time alert architecture.
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
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Diagnostic Feed</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Empty State: Data Feed Not Connected */}
      <section aria-label="Live monitoring feed">
        <EmptyState
          icon={Flame}
          badge="Live Telemetry Ingest Offline"
          title="Data Is Not Connected Yet"
          description="The Phase 1 application shell, navigation graph, and PWA service worker are operating. Real-time seismic tremor telemetry, satellite infrared heat signatures, and volcanic eruption bulletins will stream when upstream APIs are connected in Phase 2."
          secondaryInfo="Target Ingestion Feeds: Smithsonian Institution Global Volcanism Program (GVP) Holocene Catalog, USGS Volcano Hazards Program GeoJSON stream, and ICAO Volcanic Ash Advisory Centers (VAAC)."
          actionText="Test Telemetry Feed"
          onAction={() => setShowDiagnostics(true)}
          secondaryActionText="View Alerts Configuration"
          onSecondaryAction={() => onNavigate('alerts')}
        />
      </section>

      {/* Quick Launch Cards */}
      <section aria-label="Feature modules">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Core Modules
          </h2>
          <span className="text-[11px] text-cyan-400 font-mono">0 Live Streams</span>
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
              Geospatial projection of volcanic calderas & exclusion radii.
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
              <span>Alerts</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Aviation color codes & geological hazard bulletins.
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
              <span>News & Dispatches</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-violet-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Official observatory communiqués and geological studies.
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
              Search over 1,500 active Holocene volcanic features.
            </p>
          </button>
        </div>
      </section>

      {/* Architecture Readiness Card */}
      <section aria-label="Readiness specs" className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase text-slate-400">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Client Architecture Readiness</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">PWA Capabilities</span>
            <span className="text-emerald-400 font-medium">Offline Ready & Installable</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">State & Routing</span>
            <span className="text-cyan-400 font-medium">All 12 Views Fully Wired</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">Data Ingestion</span>
            <span className="text-amber-400 font-medium">Awaiting Phase 2 Link</span>
          </div>
        </div>
      </section>

      <TelemetryStatusModal isOpen={showDiagnostics} onClose={() => setShowDiagnostics(false)} />
    </div>
  );
};
