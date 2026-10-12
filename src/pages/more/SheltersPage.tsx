import React, { useState } from 'react';
import {
  Building2,
  ArrowLeft,
  ExternalLink,
  Home,
} from 'lucide-react';
import { AppRoute } from '../../types';
import { EmptyState } from '../../components/EmptyState';

interface SheltersPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const SheltersPage: React.FC<SheltersPageProps> = ({ onNavigate }) => {
  const [radius, setRadius] = useState<number>(25);
  const [notice, setNotice] = useState<string | null>(null);

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    setNotice(`Search radius set to ${newRadius} km: Shelter directory is not connected yet.`);
  };

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
        <span className="text-xs font-mono text-amber-400">Directory Offline</span>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono">
          Emergency Shelters & Relief Hubs
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Civil protection evacuation centers and disaster registry connections.
        </p>
      </div>

      {/* Radius Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Search Radius:</span>
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          {[10, 25, 50, 100].map((r) => (
            <button
              key={r}
              onClick={() => handleRadiusChange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                radius === r
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
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
        icon={Building2}
        badge="Shelters Feed Not Connected"
        title="Evacuation Shelters Directory Not Connected Yet"
        description="Local disaster management registry endpoints and emergency evacuation center capacity feeds are not connected to this application. In an emergency, always follow orders from local civil defense authorities."
        actionText="Check Connection"
        onAction={() => setNotice('Shelter registry feed is not connected yet.')}
        secondaryActionText="Return to More"
        onSecondaryAction={() => onNavigate('more')}
      />

      {/* Real External Sources Links */}
      <section aria-label="Official emergency shelter resources" className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Home className="w-4 h-4 text-emerald-400" />
          <span>Official Emergency Shelter Registries</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <a
            href="https://data.humdata.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-emerald-400 font-semibold mb-1">
              <span>UN OCHA Humanitarian Data Exchange</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Global humanitarian facilities, displaced populations, and crisis data
            </p>
          </a>

          <a
            href="https://www.redcross.org/get-help/disaster-relief-and-recovery-services/find-an-open-shelter.html"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-emerald-400 font-semibold mb-1">
              <span>American Red Cross Open Shelters</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Official locator for open emergency disaster evacuation shelters
            </p>
          </a>
        </div>
      </section>
    </div>
  );
};
