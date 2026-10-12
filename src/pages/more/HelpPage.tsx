import React, { useState } from 'react';
import {
  HelpCircle,
  ArrowLeft,
  BookOpen,
  Flame,
  LifeBuoy,
  ExternalLink,
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
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono">
          Help, Reference & Sources
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Official scientific reference sources, Volcanic Explosivity Index (VEI), and application documentation.
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

      {/* Honest Empty State for Interactive Support */}
      <EmptyState
        icon={LifeBuoy}
        badge="Support Helpdesk Not Connected"
        title="Live Interactive Dispatch Not Connected Yet"
        description="Live chat with volcano observatory staff and interactive emergency dispatch lines are not connected to this application. Consult official geological survey references directly through the authorized portals below."
        actionText="Test Helpdesk Connection"
        onAction={() => setNotice('Interactive support helpdesk is not connected yet.')}
        secondaryActionText="Return to More"
        onSecondaryAction={() => onNavigate('more')}
      />

      {/* Official Reference Documentation Links */}
      <section aria-label="Official volcanology references" className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">
              Official Volcanology Reference Sources
            </h2>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">Scientific Reference</span>
        </div>
        <p className="text-xs text-slate-400">
          For authoritative scientific education on eruption scales and classification:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <a
            href="https://volcano.si.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-cyan-400 font-semibold mb-1">
              <span>Smithsonian Global Volcanism Program</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Holocene volcano database, weekly reports, and eruptive histories
            </p>
          </a>

          <a
            href="https://www.usgs.gov/programs/VHP"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-cyan-400 font-semibold mb-1">
              <span>USGS Volcano Hazards Program</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Eruption dynamics, monitoring networks, and hazard mitigation
            </p>
          </a>
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
              Where does the live data come from?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Global earthquake coordinates and magnitudes stream from the <strong>United States Geological Survey (USGS)</strong> all-day GeoJSON feed. Summit meteorological forecasts stream from <strong>Open-Meteo</strong>. Volcano reference coordinates come from the <strong>Smithsonian Institution Global Volcanism Program (GVP)</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <h3 className="font-semibold text-slate-200">
              Is VOLCANIC installable as a standalone app?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Yes. VOLCANIC complies with PWA standards including a Web App Manifest, service worker asset precaching, and in-app install triggers for desktop and mobile browsers.
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
