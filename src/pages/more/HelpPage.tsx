import React, { useState } from 'react';
import {
  HelpCircle,
  ArrowLeft,
  BookOpen,
  HelpCircle as QuestionIcon,
  Flame,
  Info,
  Shield,
  LifeBuoy,
} from 'lucide-react';
import { AppRoute } from '../../types';
import { EmptyState } from '../../components/EmptyState';

interface HelpPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onNavigate }) => {
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
        <span className="text-xs font-mono text-cyan-400">Documentation Online</span>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Help, Reference & Glossary
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Volcanology terminology, Volcanic Explosivity Index (VEI) reference, and system documentation.
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
        icon={LifeBuoy}
        badge="Live Support Desks Not Connected"
        title="Emergency Dispatch & Support Desks Not Connected Yet"
        description="Live chat with volcano observatory staff, real-time emergency dispatch linkages, and interactive satellite downlink troubleshooting channels are not connected in Phase 1."
        secondaryInfo="Reference documentation and the scientific glossary below are fully functional offline."
        actionText="Test Help Service Endpoint"
        onAction={() => setNotice('Help Desk Endpoint: Standby mode. Upstream helpdesk integration scheduled for Phase 2.')}
        secondaryActionText="Return to More Menu"
        onSecondaryAction={() => onNavigate('more')}
      />

      {/* VEI Reference Scale */}
      <section aria-label="Volcanic Explosivity Index" className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white">
            Volcanic Explosivity Index (VEI Scale)
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          The relative measure of the explosiveness of volcanic eruptions, developed by Newhall and Self (1982):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">VEI 0–1 · Effusive</span>
            <span className="text-slate-300 block mb-1">Plume: &lt; 1 km</span>
            <span className="text-slate-400 text-[11px]">Hawaiian type, continuous lava flows, gentle ash output.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">VEI 2–3 · Moderate</span>
            <span className="text-slate-300 block mb-1">Plume: 1–15 km</span>
            <span className="text-slate-400 text-[11px]">Strombolian & Vulcanian type, explosive bursts, localized tephra.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">VEI 4–5 · Sub-Plinian</span>
            <span className="text-slate-300 block mb-1">Plume: 10–25 km</span>
            <span className="text-slate-400 text-[11px]">Catastrophic columns, pyroclastic flows, regional ashfall.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-rose-400 font-bold block mb-1">VEI 6–8 · Ultra-Plinian</span>
            <span className="text-slate-300 block mb-1">Plume: &gt; 25 km</span>
            <span className="text-slate-400 text-[11px]">Colossal / Supervolcanic caldera collapse, global climate impact.</span>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section aria-label="Frequently asked questions" className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <h3 className="font-semibold text-slate-200">
              Why does every page say "data is not connected yet"?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              You are currently running <strong>Phase 1 of VOLCANIC</strong>. Phase 1 establishes the mobile-first Progressive Web App architecture, interactive routing graph, accessible layout, and service worker shell. Upstream data feeds from USGS, Smithsonian GVP, and satellite agencies will be connected in Phase 2.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <h3 className="font-semibold text-slate-200">
              Is VOLCANIC installable as a standalone app?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Yes. VOLCANIC complies with PWA standards including a Web App Manifest, service worker asset precaching, and in-app install triggers. You can tap "Install PWA" or add to your home screen directly from mobile Safari/Chrome.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <h3 className="font-semibold text-slate-200">
              Are any mock or synthetic volcano alerts being displayed?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              No. By strict architectural design, VOLCANIC displays zero fabricated, mock, or hallucinated volcano coordinates, eruption alerts, or relief figures.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
