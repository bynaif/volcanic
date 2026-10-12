import React, { useState } from 'react';
import {
  Radio,
  Newspaper,
  Rss,
  ExternalLink,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { AppRoute } from '../types';
import { EmptyState } from '../components/EmptyState';

interface NewsPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({ onNavigate }) => {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-violet-400 font-mono">
            <Radio className="w-3.5 h-3.5" />
            <span>Observatory News & Bulletins</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Feed Not Connected</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono">
            Volcanological Dispatches
          </h1>
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
        icon={Newspaper}
        badge="News Feeds Not Connected"
        title="Live Dispatches Feed Not Connected Yet"
        description="Official RSS and news feeds from volcano observatories are not connected to this application. In the meantime, consult official dispatches directly at their source links below."
        actionText="Check Feed Connection"
        onAction={() => setNotice('Observatory news ingest feed is not connected yet.')}
        secondaryActionText="Return to Home"
        onSecondaryAction={() => onNavigate('home')}
      />

      {/* Direct Links to Real External Sources */}
      <section aria-label="Official observatory news sources" className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Rss className="w-4 h-4 text-violet-400" />
          <span>Official External News & Dispatch Portals</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <a
            href="https://volcano.si.edu/reports_weekly.cfm"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-violet-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-violet-400 font-semibold mb-1">
              <span>Smithsonian GVP</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Weekly Volcanic Activity Report (Smithsonian / USGS)
            </p>
          </a>

          <a
            href="https://www.usgs.gov/programs/VHP/volcano-activity-notices"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-violet-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-violet-400 font-semibold mb-1">
              <span>USGS VHP</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Daily & weekly volcanic activity notices for US observatories
            </p>
          </a>

          <a
            href="https://www.weather.gov/aviation/vaac/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-violet-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-violet-400 font-semibold mb-1">
              <span>NOAA / ICAO VAAC</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Volcanic Ash Advisory Center aviation bulletins
            </p>
          </a>
        </div>
      </section>
    </div>
  );
};
