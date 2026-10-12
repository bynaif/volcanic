import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Globe2,
  Navigation,
  ExternalLink,
  X,
  Layers,
  Activity,
  Calendar,
  Clock,
  Compass,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { AppRoute, EarthquakeFeature } from '../types';
import {
  useEarthquakeData,
  getMagnitudeColor,
  getRelativeTime,
  formatTimeLocal,
  formatTimeUTC,
} from '../hooks/useEarthquakeData';
import { DataCardHeader } from '../components/DataCardHeader';
import { DataErrorState } from '../components/DataErrorState';
import { EarthquakeSkeleton } from '../components/EarthquakeSkeleton';

interface LiveMapPageProps {
  onNavigate: (route: AppRoute) => void;
}

type MinMagFilter = 'all' | '2.5' | '4.5';

const OPENFREEMAP_DARK_STYLE = 'https://tiles.openfreemap.org/styles/dark';

export const LiveMapPage: React.FC<LiveMapPageProps> = () => {
  const { data, loading, error, refetch, lastUpdated } = useEarthquakeData();

  const [minMag, setMinMag] = useState<MinMagFilter>('all');
  const [selectedQuake, setSelectedQuake] = useState<EarthquakeFeature | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  // Filter earthquakes according to selected minimum magnitude
  const filteredFeatures = useMemo(() => {
    if (!data?.features) return [];
    if (minMag === '2.5') {
      return data.features.filter((f) => f.properties.mag !== null && f.properties.mag >= 2.5);
    }
    if (minMag === '4.5') {
      return data.features.filter((f) => f.properties.mag !== null && f.properties.mag >= 4.5);
    }
    return data.features;
  }, [data, minMag]);

  // Counts for each tier
  const stats = useMemo(() => {
    if (!data?.features) return { all: 0, m25: 0, m45: 0 };
    let m25 = 0;
    let m45 = 0;
    data.features.forEach((f) => {
      const m = f.properties.mag ?? 0;
      if (m >= 4.5) m45++;
      if (m >= 2.5) m25++;
    });
    return { all: data.features.length, m25, m45 };
  }, [data]);

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: OPENFREEMAP_DARK_STYLE,
        center: [0, 20],
        zoom: 1.6,
        maxZoom: 14,
        minZoom: 1,
        attributionControl: false,
      });

      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
          customAttribution: '© OpenFreeMap | © OpenStreetMap contributors | USGS',
        }),
        'bottom-right'
      );

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

      map.on('load', () => {
        // Add GeoJSON source
        map.addSource('usgs-earthquakes', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        // Layer: Outer halo glow
        map.addLayer({
          id: 'earthquake-glow',
          type: 'circle',
          source: 'usgs-earthquakes',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['coalesce', ['get', 'mag'], 1],
              0, 8,
              2.5, 14,
              4.5, 24,
              6.5, 38,
            ],
            'circle-color': [
              'step',
              ['coalesce', ['get', 'mag'], 1],
              '#00f0ff', // < 2.5
              2.5, '#f59e0b', // 2.5 - 4.5
              4.5, '#f97316', // 4.5 - 6.0
              6.0, '#f43f5e', // >= 6.0
            ],
            'circle-opacity': 0.25,
            'circle-blur': 0.6,
          },
        });

        // Layer: Solid circle marker
        map.addLayer({
          id: 'earthquake-circles',
          type: 'circle',
          source: 'usgs-earthquakes',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['coalesce', ['get', 'mag'], 1],
              0, 4,
              2.5, 7,
              4.5, 12,
              6.5, 20,
            ],
            'circle-color': [
              'step',
              ['coalesce', ['get', 'mag'], 1],
              '#00f0ff', // < 2.5
              2.5, '#f59e0b', // 2.5 - 4.5
              4.5, '#f97316', // 4.5 - 6.0
              6.0, '#f43f5e', // >= 6.0
            ],
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-opacity': 0.85,
          },
        });

        // Click handler on earthquake marker
        map.on('click', 'earthquake-circles', (e: any) => {
          if (!e.features || e.features.length === 0) return;
          const clickedFeature = e.features[0];
          const coords = (clickedFeature.geometry as any)?.coordinates || [0, 0, 0];
          const lng = coords[0];
          const lat = coords[1];
          const depth = coords[2] ?? 0;

          const props = clickedFeature.properties as any;
          const fullFeature: EarthquakeFeature = {
            type: 'Feature',
            id: String(clickedFeature.id || props.code || Math.random()),
            properties: {
              mag: typeof props.mag === 'number' ? props.mag : parseFloat(props.mag),
              place: props.place,
              time: typeof props.time === 'number' ? props.time : parseInt(props.time, 10),
              updated: typeof props.updated === 'number' ? props.updated : parseInt(props.updated, 10),
              tz: null,
              url: props.url,
              detail: props.detail || '',
              felt: null,
              cdi: null,
              mmi: null,
              alert: props.alert || null,
              status: props.status || '',
              tsunami: props.tsunami || 0,
              sig: props.sig || 0,
              net: props.net || '',
              code: props.code || '',
              ids: props.ids || '',
              sources: props.sources || '',
              types: props.types || '',
              nst: null,
              dmin: null,
              rms: null,
              gap: null,
              magType: props.magType || '',
              type: props.type || 'earthquake',
              title: props.title || '',
            },
            geometry: {
              type: 'Point',
              coordinates: [lng, lat, depth],
            },
          };

          setSelectedQuake(fullFeature);

          // Fly smoothly to marker
          map.flyTo({
            center: [lng, lat],
            zoom: Math.max(map.getZoom(), 4.5),
            speed: 1.2,
          });
        });

        // Cursor pointer styling
        map.on('mouseenter', 'earthquake-circles', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'earthquake-circles', () => {
          map.getCanvas().style.cursor = '';
        });
      });

      mapRef.current = map;
    }

    return () => {
      // Don't destroy on simple re-renders
    };
  }, []);

  // Update GeoJSON source when features change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateSource = () => {
      const source = map.getSource('usgs-earthquakes') as maplibregl.GeoJSONSource | undefined;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: filteredFeatures as any,
        });
      }
    };

    if (map.isStyleLoaded()) {
      updateSource();
    } else {
      map.once('load', updateSource);
    }
  }, [filteredFeatures]);

  // Handle Browser Geolocation ("Locate Me")
  const handleLocateMe = () => {
    if (!('geolocation' in navigator)) {
      setGeoNotice('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoNotice(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { longitude, latitude } = position.coords;
        const map = mapRef.current;
        if (map) {
          // Remove previous marker if any
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          // Create pulse element for user location
          const el = document.createElement('div');
          el.className = 'user-location-marker';
          el.style.width = '18px';
          el.style.height = '18px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = '#00f0ff';
          el.style.border = '3px solid #ffffff';
          el.style.boxShadow = '0 0 16px #00f0ff';

          userMarkerRef.current = new maplibregl.Marker({ element: el })
            .setLngLat([longitude, latitude])
            .addTo(map);

          map.flyTo({
            center: [longitude, latitude],
            zoom: 5.5,
            essential: true,
            speed: 1.4,
          });
          setGeoNotice('Map centered on your location.');
          setTimeout(() => setGeoNotice(null), 3000);
        }
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve your location.';
        if (err.code === 1) msg = 'Location access was denied.';
        if (err.code === 2) msg = 'Position unavailable.';
        if (err.code === 3) msg = 'Location request timed out.';
        setGeoNotice(msg);
        setTimeout(() => setGeoNotice(null), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      {/* Header and Source Card */}
      <DataCardHeader
        title="Live Seismic Activity Map"
        source="USGS"
        lastUpdated={lastUpdated}
        count={filteredFeatures.length}
        onRefresh={refetch}
        isRefreshing={loading}
      />

      {/* Control bar: Magnitude filters & Locate button */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
        {/* Magnitude filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline mr-1">
            Filter Mag:
          </span>
          <button
            type="button"
            onClick={() => setMinMag('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              minMag === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-sm shadow-cyan-950/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({stats.all})
          </button>
          <button
            type="button"
            onClick={() => setMinMag('2.5')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              minMag === '2.5'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm shadow-amber-950/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            M2.5+ ({stats.m25})
          </button>
          <button
            type="button"
            onClick={() => setMinMag('4.5')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              minMag === '4.5'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30 shadow-sm shadow-rose-950/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            M4.5+ ({stats.m45})
          </button>
        </div>

        {/* Locate Me button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            aria-label="Locate me using GPS"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-xs font-medium text-cyan-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
          </button>
        </div>
      </div>

      {geoNotice && (
        <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between animate-in fade-in">
          <span>{geoNotice}</span>
          <button
            onClick={() => setGeoNotice(null)}
            className="text-slate-400 hover:text-white px-1 text-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Error state if feed unavailable */}
      {error && (
        <DataErrorState
          error={error}
          onRetry={refetch}
          isRetrying={loading}
        />
      )}

      {/* Map Container */}
      <div className="relative rounded-2xl border border-slate-800 overflow-hidden shadow-2xl bg-[#070913]">
        {loading && !data && (
          <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-3">
            <EarthquakeSkeleton type="map" />
          </div>
        )}

        <div
          ref={mapContainerRef}
          className="w-full h-[450px] sm:h-[540px] md:h-[620px] bg-[#070913]"
        />

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-10 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px] font-mono space-y-1.5 shadow-xl pointer-events-auto">
          <div className="text-slate-400 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-800">
            Magnitude Scale
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff]"></span>
            <span>&lt; 2.5 Micro/Minor</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
            <span>2.5 – 4.4 Moderate</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
            <span>4.5 – 5.9 Strong</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></span>
            <span>6.0+ Major Alert</span>
          </div>
        </div>

        {/* Selected Earthquake Details Modal / Card Overlay */}
        {selectedQuake && (
          <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="quake-detail-title"
            className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-md z-20 rounded-2xl bg-[#0c1022]/95 border border-cyan-500/40 p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-slate-100 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                {(() => {
                  const color = getMagnitudeColor(selectedQuake.properties.mag);
                  return (
                    <div
                      className={`px-3 py-1.5 rounded-xl font-mono font-bold text-base border flex items-center justify-center ${color.bg} ${color.text} ${color.border}`}
                    >
                      M {selectedQuake.properties.mag !== null ? selectedQuake.properties.mag.toFixed(1) : 'N/A'}
                    </div>
                  );
                })()}
                <div>
                  <h3 id="quake-detail-title" className="text-sm font-semibold text-white leading-tight">
                    {selectedQuake.properties.place || 'Unknown Location'}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>Depth: {selectedQuake.geometry.coordinates[2].toFixed(1)} km</span>
                    <span>·</span>
                    <span className="text-cyan-400">
                      {getRelativeTime(selectedQuake.properties.time)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedQuake(null)}
                aria-label="Close earthquake details"
                className="text-slate-400 hover:text-white p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Local Time
                  </span>
                  <span>{formatTimeLocal(selectedQuake.properties.time)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    UTC Time
                  </span>
                  <span className="font-mono">{formatTimeUTC(selectedQuake.properties.time)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-300">
                <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Coordinates
                  </span>
                  <span className="font-mono">
                    {selectedQuake.geometry.coordinates[1].toFixed(4)}° N,{' '}
                    {selectedQuake.geometry.coordinates[0].toFixed(4)}° E
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">USGS Event Page</span>
              <a
                href={selectedQuake.properties.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-semibold transition"
              >
                <span>View Full Data</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
