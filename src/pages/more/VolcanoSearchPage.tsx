import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ArrowLeft,
  Compass,
  ExternalLink,
  ChevronRight,
  Mountain,
  Flame,
  Globe2,
} from 'lucide-react';
import { AppRoute } from '../../types';
import { WELL_KNOWN_VOLCANOES, Volcano } from '../../data/volcanoes';
import { formatElevationM } from '../../utils/units';

interface VolcanoSearchPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const VolcanoSearchPage: React.FC<VolcanoSearchPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filtered list of 25 volcanoes
  const filteredVolcanoes = useMemo(() => {
    return WELL_KNOWN_VOLCANOES.filter((v) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.region.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === 'all' ||
        v.type.toLowerCase().includes(selectedType.toLowerCase());

      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  const uniqueTypes = useMemo(() => {
    return ['all', 'Stratovolcano', 'Shield', 'Caldera', 'Complex', 'Fissure vent'];
  }, []);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Navigation & Title */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('more')}
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to More</span>
        </button>

        {/* Smithsonian GVP Reference Badge */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
          <span>Reference data:</span>
          <span className="text-cyan-300 font-semibold">Smithsonian GVP</span>
        </div>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono">
          Volcano Explorer & Catalog
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Search and explore 25 major Holocene volcanic centers with official Smithsonian Global Volcanism Program coordinates, elevation, and live local summit meteorological telemetry.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by volcano name or country (e.g., Etna, Fuji, Kilauea, Iceland)..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-xs md:text-sm text-white placeholder-slate-500 transition shadow-inner"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              className="absolute right-3 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Morphology Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 shrink-0 text-[11px] uppercase font-mono mr-1">
          Type:
        </span>
        {uniqueTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              selectedType === type
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {type === 'all' ? 'All Types' : type}
          </button>
        ))}
      </div>

      {/* Results Count & Source Notice */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
        <span>Showing {filteredVolcanoes.length} of 25 volcanoes</span>
        <span className="text-cyan-400">GVP Holocene Registry</span>
      </div>

      {/* List of 25 Volcanoes */}
      {filteredVolcanoes.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <p className="text-sm font-semibold text-white">No volcanoes match your search</p>
          <p className="text-xs text-slate-400">
            Try a different search query or clear the type filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
            }}
            className="mt-2 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredVolcanoes.map((volcano) => (
            <div
              key={volcano.id}
              className="group p-4 sm:p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-900/95 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-200 shadow-lg shadow-black/20 flex flex-col justify-between space-y-3 cursor-pointer"
              onClick={() => onNavigate(`volcano/${volcano.id}` as AppRoute)}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Mountain className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {volcano.name}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {volcano.region} · {volcano.country}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-300 shrink-0">
                    {volcano.type}
                  </span>
                </div>

                <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block uppercase">Elevation</span>
                    <span>{formatElevationM(volcano.elevationM)}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block uppercase">Coordinates</span>
                    <span>
                      {volcano.latitude.toFixed(2)}° N, {volcano.longitude.toFixed(2)}° E
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <a
                  href={volcano.gvpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition"
                  title="View on Smithsonian Global Volcanism Program"
                >
                  <span>Smithsonian GVP</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => onNavigate(`volcano/${volcano.id}` as AppRoute)}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 group-hover:text-cyan-300 font-semibold transition"
                >
                  <span>Summit Weather & Details</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
