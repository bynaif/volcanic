import React, { useState } from 'react';
import {
  Globe2,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  MapPin,
  RefreshCw,
  AlertCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { AppRoute } from '../types';
import { EmptyState } from '../components/EmptyState';

interface LiveMapPageProps {
  onNavigate: (route: AppRoute) => void;
}

type MapLayer = 'terrain' | 'thermal' | 'ash' | 'seismic';

export const LiveMapPage: React.FC<LiveMapPageProps> = ({ onNavigate }) => {
  const [zoomLevel, setZoomLevel] = useState(2);
  const [activeLayer, setActiveLayer] = useState<MapLayer>('terrain');
  const [layerNotice, setLayerNotice] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState({ lat: 0.0, lng: 0.0 });

  const handleLayerSwitch = (layer: MapLayer) => {
    setActiveLayer(layer);
    setLayerNotice(`Selected "${layer.toUpperCase()}" layer: Data feed not connected yet.`);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    // Map to approx lat/lng
    const lat = Number(((0.5 - y) * 160).toFixed(4));
    const lng = Number(((x - 0.5) * 360).toFixed(4));
    setCoordinates({ lat, lng });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Map Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Interactive Geospatial Canvas</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-400">Feed Offline</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Global Volcanic Activity Map
          </h1>
        </div>

        {/* Layer Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
          {(
            [
              { id: 'terrain', label: 'Terrain' },
              { id: 'thermal', label: 'Thermal IR' },
              { id: 'ash', label: 'Ash Drift' },
              { id: 'seismic', label: 'Seismic' },
            ] as { id: MapLayer; label: string }[]
          ).map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => handleLayerSwitch(layer.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeLayer === layer.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {layerNotice && (
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 text-xs text-indigo-200 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{layerNotice}</span>
          </div>
          <button
            onClick={() => setLayerNotice(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Geospatial Canvas Card */}
      <div
        onMouseMove={handleMouseMove}
        className="relative h-[380px] md:h-[480px] w-full rounded-2xl bg-[#060814] border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4 md:p-6"
      >
        {/* Background Grid & Coordinate lines */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* Dark Continent Outlines (Simulated Vector Basemap Grid) */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
          <svg className="w-full h-full stroke-cyan-400/40 fill-none" viewBox="0 0 1000 500">
            {/* Latitude parallels */}
            <line x1="0" y1="125" x2="1000" y2="125" strokeDasharray="4 8" strokeWidth="0.8" />
            <line x1="0" y1="250" x2="1000" y2="250" strokeWidth="1" />
            <line x1="0" y1="375" x2="1000" y2="375" strokeDasharray="4 8" strokeWidth="0.8" />
            {/* Longitude meridians */}
            <line x1="250" y1="0" x2="250" y2="500" strokeDasharray="4 8" strokeWidth="0.8" />
            <line x1="500" y1="0" x2="500" y2="500" strokeWidth="1" />
            <line x1="750" y1="0" x2="750" y2="500" strokeDasharray="4 8" strokeWidth="0.8" />

            {/* Subtle continental boundary curves */}
            <path d="M150 120 Q 220 180 260 220 T 320 300 Q 280 400 320 450" strokeWidth="1" />
            <path d="M460 100 Q 520 160 540 220 Q 580 320 540 400" strokeWidth="1" />
            <path d="M680 120 Q 780 180 840 220 T 900 320 Q 860 400 890 440" strokeWidth="1" />
          </svg>
        </div>

        {/* Top Controls Overlay */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-mono backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {coordinates.lat >= 0 ? `${coordinates.lat}° N` : `${Math.abs(coordinates.lat)}° S`},{' '}
              {coordinates.lng >= 0 ? `${coordinates.lng}° E` : `${Math.abs(coordinates.lng)}° W`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 1, 8))}
              aria-label="Zoom in"
              className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-400/40 backdrop-blur-md transition focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 1, 1))}
              aria-label="Zoom out"
              className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-400/40 backdrop-blur-md transition focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(2);
                setCoordinates({ lat: 0, lng: 0 });
              }}
              aria-label="Reset zoom and center"
              className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-400/40 backdrop-blur-md transition focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Empty State Card */}
        <div className="relative z-10 max-w-md mx-auto my-auto text-center p-6 rounded-2xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-xl shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="text-[11px] font-mono text-amber-400 mb-1">
            GEOSPATIAL FEED NOT CONNECTED
          </div>
          <h2 className="text-base font-bold text-white mb-2">
            No Active Volcano Coordinates Linked
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            The interactive WebGL mapping coordinate engine is active. In Phase 2, live coordinates of over 1,500 active Holocene volcanoes and ash cloud vectors will render on this canvas.
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setLayerNotice('Pipeline status: Upstream GeoJSON endpoints ready for Phase 2 connection.')}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/25 text-xs font-medium transition"
            >
              Check GeoJSON Pipeline
            </button>
          </div>
        </div>

        {/* Bottom Status Readout */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-md">
          <span>Projection: WGS84 Web Mercator</span>
          <span className="text-cyan-400">Zoom: {zoomLevel}x</span>
          <span className="text-amber-400">Markers: 0 / 0</span>
        </div>
      </div>

      {/* Layer Specs Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 block mb-1">Terrain Layer</span>
          <span className="text-slate-200">Topographic contours & caldera morphology</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 block mb-1">Thermal IR</span>
          <span className="text-slate-200">Copernicus Sentinel-2 Shortwave Infrared</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 block mb-1">Ash Plume Drift</span>
          <span className="text-slate-200">Atmospheric wind dispersion modeling</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 block mb-1">Seismic Telemetry</span>
          <span className="text-slate-200">Real-time harmonic tremor hypocenters</span>
        </div>
      </div>
    </div>
  );
};
