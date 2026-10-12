import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Database,
  ArrowLeft,
  Compass,
} from 'lucide-react';
import { AppRoute } from '../../types';
import { EmptyState } from '../../components/EmptyState';

interface VolcanoSearchPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const VolcanoSearchPage: React.FC<VolcanoSearchPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setFeedback(`Query "${searchTerm}": Volcano database is not connected yet. 0 records available.`);
    }
  };

  const handleFilterSelect = (filterName: string) => {
    setSelectedFilter(filterName);
    setFeedback(`Filter "${filterName}": Database feed not connected yet.`);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Navigation & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('more')}
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to More</span>
        </button>
        <span className="text-xs font-mono text-amber-400">Database Offline</span>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Volcano Search Catalog
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Search over 1,500 Holocene volcanoes by name, geographic region, tectonic setting, or summit elevation.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by volcano name, region, or ID (e.g., Krakatoa, Etna)..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-xs md:text-sm text-white placeholder-slate-500 transition shadow-inner"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Morphology Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 shrink-0 text-[11px] uppercase font-mono mr-1">
          Type:
        </span>
        {[
          { id: 'all', label: 'All Structures' },
          { id: 'stratovolcano', label: 'Stratovolcano' },
          { id: 'caldera', label: 'Caldera' },
          { id: 'shield', label: 'Shield' },
          { id: 'submarine', label: 'Submarine' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleFilterSelect(item.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              selectedFilter === item.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <span>{feedback}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-white px-2 py-0.5 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Empty State */}
      <EmptyState
        icon={Database}
        badge="Catalog Not Connected"
        title="Volcano Database Not Connected Yet"
        description="The search index is initialized and ready to ingest the Smithsonian Global Volcanism Program (GVP) Holocene volcano database. No volcano data feeds are connected in Phase 1."
        secondaryInfo="When connected in Phase 2, this catalog will provide full geological summaries, coordinates, eruption histories, and tectonic classifications for 1,500+ active volcanoes worldwide."
        actionText="Check Catalog Status"
        onAction={() => setFeedback('Catalog Check: Ingestion pipeline awaiting API link in Phase 2.')}
        secondaryActionText="Return to More Menu"
        onSecondaryAction={() => onNavigate('more')}
      />
    </div>
  );
};
