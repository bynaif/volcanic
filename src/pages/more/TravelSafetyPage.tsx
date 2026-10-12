import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowLeft,
  AlertTriangle,
  Heart,
  Wind,
  Footprints,
  Eye,
  CheckCircle,
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
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Travel Safety & Exclusion Protocols
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Volcanic hazard mitigation standards, gas safety protocols, and emergency evacuation guidelines.
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

      {/* Empty State */}
      <EmptyState
        icon={ShieldAlert}
        badge="Safety Telemetry Not Connected"
        title="Live Safety Hazard Feeds Not Connected Yet"
        description="Dynamic danger exclusion boundaries, real-time volcanic gas sensor arrays (SO₂ and H₂S plume sensors), and ashfall hazard dispersal projections will connect to real-time ground telemetry in Phase 2."
        secondaryInfo="When connected, this page will compute your GPS distance to the nearest active volcanic exclusion cordon and provide real-time air quality indexing."
        actionText="Check Sensor Feeds"
        onAction={() => setNotice('Sensor Array Check: Remote gas spectrometers not connected in Phase 1.')}
        secondaryActionText="Return to More Menu"
        onSecondaryAction={() => onNavigate('more')}
      />

      {/* Essential Volcanology Safety Principles (Real scientific guidance) */}
      <section aria-label="Volcanic safety guidelines" className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-white">
            Essential Volcanic Hazard Preparedness Guidelines
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <Wind className="w-4 h-4" />
              <span>Ashfall & Airway Protection</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Use certified N95 or P100 particle respirators. Standard cloth masks do not filter fine abrasive silica shards. Wear sealed safety goggles rather than contact lenses.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Footprints className="w-4 h-4" />
              <span>Lahars & Mudflow Valleys</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Volcanic mudflows travel at speeds exceeding 50 km/h along river channels. Never seek shelter in river valleys or downstream lowlands during rainfall or eruptions. Seek high ground immediately.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-violet-400 font-semibold">
              <Eye className="w-4 h-4" />
              <span>Toxic Volcanic Gas Safety</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Gases such as Carbon Dioxide (CO₂) and Sulfur Dioxide (SO₂) accumulate in low-lying hollows, ravines, and caves. If sulfur odor is intense or irritation occurs, immediately move upwind and uphill.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Official Exclusion Cordons</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Always respect designated exclusion zones (typically 5 to 20 km around active vents). Ballistic volcanic bombs and pyroclastic density currents (PDCs) move too fast for escape.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
