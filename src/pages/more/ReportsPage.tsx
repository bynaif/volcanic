import React, { useState } from 'react';
import {
  FileText,
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { AppRoute } from '../../types';
import { EmptyState } from '../../components/EmptyState';

interface ReportsPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
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
        <span className="text-xs font-mono text-amber-400">Reports Ingest Offline</span>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono">
          Geological Reports & Sensor Logs
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Observatory situation reports, satellite observations, and ground sensor records.
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
        icon={FileText}
        badge="Reports Ingest Not Connected"
        title="Reports Feed Not Connected Yet"
        description="Direct observatory situation reports and technical sensor feeds are not connected to this application. Access official bulletins directly through the authorized observatory portals below."
        actionText="Test Ingest Status"
        onAction={() => setNotice('Report feed ingest pipeline is not connected yet.')}
        secondaryActionText="Return to More"
        onSecondaryAction={() => onNavigate('more')}
      />

      {/* Real External Sources Links */}
      <section aria-label="Official observatory report portals" className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Official Observatory Report Portals</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <a
            href="https://www.usgs.gov/programs/VHP/volcano-activity-notices"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-blue-400 font-semibold mb-1">
              <span>USGS VHP Notices</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Daily & weekly volcanic activity notices for US volcanoes
            </p>
          </a>

          <a
            href="https://volcano.si.edu/reports_weekly.cfm"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-blue-400 font-semibold mb-1">
              <span>Smithsonian GVP Reports</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Weekly global volcanic activity summaries
            </p>
          </a>

          <a
            href="https://www.ct.ingv.it/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-blue-400 font-semibold mb-1">
              <span>INGV Osservatorio Etneo</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Surveillance bulletins for Etna, Stromboli and Sicilian volcanoes
            </p>
          </a>
        </div>
      </section>
    </div>
  );
};
