import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { AppRoute } from '../../types';
import { EmptyState } from '../../components/EmptyState';

interface TravelSafetyPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const TravelSafetyPage: React.FC<TravelSafetyPageProps> = ({ onNavigate }) => {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('more')}
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to More</span>
        </button>
        <span className="text-xs font-mono text-amber-400">Hazard Feeds Offline</span>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono">
          Travel Safety & Exclusion Protocols
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Official volcanic hazard guidance and authoritative emergency preparedness links.
        </p>
      </div>

      {notice && (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <span>{notice}</span>
          <button
            onClick={() => setNotice(null)}
            className="text-slate-400 hover:text-white px-2 py-0.5 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Honest Empty State */}
      <EmptyState
        icon={ShieldAlert}
        badge="Safety Feeds Not Connected"
        title="Live Exclusion Boundary Feeds Not Connected Yet"
        description="Dynamic danger exclusion zone feeds and localized air quality sensor streams are not connected to this application. Consult official geological survey advisories directly before traveling near active volcanoes."
        actionText="Test Telemetry Feed"
        onAction={() => setNotice('Sensor feed is not connected yet.')}
        secondaryActionText="Return to More"
        onSecondaryAction={() => onNavigate('more')}
      />

      {/* Authoritative Real External Sources */}
      <section aria-label="Authoritative volcanic health and safety portals" className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Authoritative Volcanic Hazard Guidance Portals</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <a
            href="https://www.ivhhn.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-amber-400 font-semibold mb-1">
              <span>IVHHN Health Network</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              International Volcanic Health Hazard Network respiratory guidelines
            </p>
          </a>

          <a
            href="https://www.usgs.gov/programs/VHP/volcanic-ash"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-amber-400 font-semibold mb-1">
              <span>USGS Ash Impacts</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Official USGS guidance on volcanic ashfall and mitigation
            </p>
          </a>

          <a
            href="https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/volcano.html"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-amber-400 font-semibold mb-1">
              <span>American Red Cross</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Community volcano evacuation checklist and readiness
            </p>
          </a>
        </div>
      </section>
    </div>
  );
};
