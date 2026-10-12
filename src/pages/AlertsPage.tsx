import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  ShieldAlert,
  Flame,
  Plane,
  SlidersHorizontal,
  RefreshCw,
  Info,
} from 'lucide-react';
import { AppRoute } from '../types';
import { EmptyState } from '../components/EmptyState';

interface AlertsPageProps {
  onNavigate: (route: AppRoute) => void;
}

type AlertFilter = 'all' | 'red' | 'orange' | 'yellow' | 'green';

export const AlertsPage: React.FC<AlertsPageProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFilterClick = (newFilter: AlertFilter) => {
    setFilter(newFilter);
    setStatusMessage(`Filter set to "${newFilter.toUpperCase()}": Alert feed is not connected yet.`);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Page Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Hazard Broadcast Center</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Feed Offline</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Volcanic Hazard Alerts
          </h1>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'All Levels' },
            { id: 'red', label: 'Red' },
            { id: 'orange', label: 'Orange' },
            { id: 'yellow', label: 'Yellow' },
            { id: 'green', label: 'Green' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleFilterClick(item.id as AlertFilter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === item.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <span>{statusMessage}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white px-2 py-0.5 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Clean Empty State */}
      <EmptyState
        icon={Bell}
        badge="Early Warning Stream Not Connected"
        title="No Live Alerts — Feed Not Connected Yet"
        description="The early warning alert engine is awaiting API connection to USGS Volcano Hazards Program, VAAC aviation feeds, and national geological survey webhooks. When connected in Phase 2, real-time alert broadcasts with aviation color codes and evacuation warnings will display here."
        secondaryInfo="ICAO & WMO Aviation Color Code integration standard will stream live warnings directly to push notifications and local devices."
        actionText="Recheck Alert Feed"
        onAction={() => setStatusMessage('Alert Feed Polling: No active webhook subscriptions connected in Phase 1.')}
        secondaryActionText="Alert Settings"
        onSecondaryAction={() => onNavigate('more/settings')}
      />

      {/* Scientific Reference: Aviation Color Codes (Standard USGS / ICAO definitions) */}
      <section aria-label="Aviation color code reference" className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white">
            ICAO / USGS Aviation Color Code Scale
          </h2>
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
