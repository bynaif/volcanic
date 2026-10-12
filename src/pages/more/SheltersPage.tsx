import React, { useState } from 'react';
import {
  Building2,
  ArrowLeft,
  MapPin,
  Compass,
  AlertCircle,
  Home,
  CheckCircle,
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
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Emergency Shelters & Relief Hubs
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Civil protection evacuation centers, medical aid stations, and temporary disaster shelter registries.
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

      {/* Empty State */}
      <EmptyState
        icon={Building2}
        badge="Shelters Feed Not Connected"
        title="Evacuation Shelters Directory Not Connected Yet"
        description="National disaster management registry endpoints and local emergency shelter capacity feeds are not connected in Phase 1. When integrated in Phase 2, this directory will display nearest designated safe zones, real-time occupancy, and navigation routes."
        secondaryInfo="Civil Protection API Standards: UN OCHA Humanitarian Data Exchange (HDX) and regional emergency management shelter protocols."
        actionText="Query Directory Feed"
        onAction={() => setNotice('Shelter Directory Polling: 0 connected endpoints in Phase 1.')}
        secondaryActionText="Return to More Menu"
        onSecondaryAction={() => onNavigate('more')}
      />

      {/* Protocol Information */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Home className="w-4 h-4 text-emerald-400" />
          <span>Emergency Shelter Admission Protocols</span>
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Designated volcanic evacuation shelters require arriving evacuees to remove ash-contaminated outer garments before entering enclosed sleeping quarters to prevent indoor silica air contamination.
        </p>
      </div>
    </div>
  );
};
