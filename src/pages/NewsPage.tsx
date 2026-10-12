import React, { useState } from 'react';
import {
  Radio,
  Newspaper,
  Rss,
  ExternalLink,
  RefreshCw,
  FileText,
  BookmarkCheck,
} from 'lucide-react';
import { AppRoute } from '../types';
import { EmptyState } from '../components/EmptyState';

interface NewsPageProps {
  onNavigate: (route: AppRoute) => void;
}

type NewsCategory = 'all' | 'bulletins' | 'research' | 'civil-defense';

export const NewsPage: React.FC<NewsPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all');
  const [notice, setNotice] = useState<string | null>(null);

  const handleCategoryClick = (cat: NewsCategory) => {
    setActiveCategory(cat);
    setNotice(`Filtered by "${cat.toUpperCase()}": Observatory news ingest is not connected yet.`);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-violet-400 font-mono">
            <Radio className="w-3.5 h-3.5" />
            <span>Observatory News & Bulletins</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Feed Offline</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Volcanological Dispatches
          </h1>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'All Dispatches' },
            { id: 'bulletins', label: 'Observatories' },
            { id: 'research', label: 'Research' },
            { id: 'civil-defense', label: 'Civil Defense' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id as NewsCategory)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
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
        icon={Newspaper}
        badge="News Feed Ingest Not Connected"
        title="No Dispatches — Feed Not Connected Yet"
        description="The scientific news and official observatory communiqué aggregator is standing by. Official weekly volcanic activity reports from the Smithsonian Institution (GVP) and daily observatory activity summaries will populate when news feeds are connected in Phase 2."
        secondaryInfo="Target Feed Protocol: Official RSS/Atom syndication feeds and JSON-LD feeds from USGS, GVP, INGV, and PHIVOLCS."
        actionText="Poll News Endpoints"
        onAction={() => setNotice('Polling News Ingest: Upstream feed syndication inactive in Phase 1.')}
        secondaryActionText="View Reports Page"
        onSecondaryAction={() => onNavigate('more/reports')}
      />

      {/* Planned Sources Architecture */}
      <section aria-label="Planned syndication sources" className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Rss className="w-4 h-4 text-violet-400" />
          <span>Planned Observatory Syndication Endpoints</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-violet-400 font-semibold block mb-0.5">Smithsonian GVP</span>
            <span className="text-slate-400">Weekly Volcanic Activity Report (USGS & GVP)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-violet-400 font-semibold block mb-0.5">USGS VHP</span>
            <span className="text-slate-400">Daily and weekly activity notices for US volcanoes</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-violet-400 font-semibold block mb-0.5">VAAC Advisories</span>
            <span className="text-slate-400">Aviation ash cloud direction and flight level warnings</span>
          </div>
        </div>
      </section>
    </div>
  );
};
