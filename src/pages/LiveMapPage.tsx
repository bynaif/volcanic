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
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Mountain,
  ChevronRight,
} from 'lucide-react';
import { AppRoute, EarthquakeFeature } from '../types';
import { WELL_KNOWN_VOLCANOES, Volcano } from '../data/volcanoes';
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

/**
 * Checks whether WebGL / hardware acceleration is available in the browser.
 */
function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (_e) {
    return false;
  }
}

export const LiveMapPage: React.FC<LiveMapPageProps> = ({ onNavigate }) => {
  const { data, loading, error, refetch, feedGenerated, fetchTime } = useEarthquakeData();

  const [minMag, setMinMag] = useState<MinMagFilter>('all');
  const [selectedQuake, setSelectedQuake] = useState<EarthquakeFeature | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(1.6);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapInitKey, setMapInitKey] = useState<number>(0);

  // Volcano Map Search
  const [volcanoSearchQuery, setVolcanoSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const volcanoMarkersRef = useRef<maplibregl.Marker[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

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

  const filteredFeaturesRef = useRef(filteredFeatures);
  useEffect(() => {
    filteredFeaturesRef.current = filteredFeatures;
  }, [filteredFeatures]);

  const handleRetryMap = () => {
    setMapError(null);
    if (mapRef.current) {
      try {
        mapRef.current.remove();
      } catch (_e) {}
      mapRef.current = null;
    }
    setMapInitKey((prev) => prev + 1);
  };

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

  // Volcano search suggestions
  const volcanoSearchResults = useMemo(() => {
    if (!volcanoSearchQuery.trim()) return [];
    const q = volcanoSearchQuery.toLowerCase();
    return WELL_KNOWN_VOLCANOES.filter(
      (v) => v.name.toLowerCase().includes(q) || v.country.toLowerCase().includes(q)
    );
  }, [volcanoSearchQuery]);

  // Fly to volcano on search selection
  const handleSelectVolcano = (volcano: Volcano) => {
    setVolcanoSearchQuery(volcano.name);
    setIsSearchDropdownOpen(false);

    const map = mapRef.current;
    if (map) {
      map.flyTo({
        center: [volcano.longitude, volcano.latitude],
        zoom: 7,
        essential: true,
        speed: 1.4,
      });
      setGeoNotice(`Centered on ${volcano.name} (${volcano.country})`);
      setTimeout(() => setGeoNotice(null), 3000);
    }
  };

  // Initialize MapLibre GL
  useEffect(() => {
    // 4. Ensure map is initialised only after the container ref exists
    if (!mapContainerRef.current) return;

    // Clean up any existing map instance before creating a new one
    if (mapRef.current) {
      try {
        mapRef.current.remove();
      } catch (_e) {}
      mapRef.current = null;
    }

    // 3. WebGL availability check
    if (!checkWebGLSupport()) {
      setMapError(
        'WebGL is unavailable or disabled in your browser. Enable hardware acceleration or WebGL in your browser settings to view the interactive map.'
      );
      return;
    }

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: OPENFREEMAP_DARK_STYLE,
        center: [0, 20],
        zoom: 1.6,
        maxZoom: 14,
        minZoom: 1,
        attributionControl: false,
      });
    } catch (err: any) {
      console.error('Failed to initialize MapLibre GL:', err);
      setMapError(
        err?.message ||
          'Failed to initialize the map graphics context. Please verify WebGL support and try again.'
      );
      return;
    }

    // 3. Handle map errors: listen to the map 'error' event
    map.on('error', (e: any) => {
      console.error('MapLibre GL error event:', e);
      const errMsg =
        e.error?.message ||
        (typeof e.error === 'string' ? e.error : '') ||
        (e.status ? `Map error (status ${e.status})` : '');

      if (
        !map.isStyleLoaded() ||
        errMsg.toLowerCase().includes('tile') ||
        errMsg.toLowerCase().includes('style') ||
        errMsg.toLowerCase().includes('webgl') ||
        errMsg.toLowerCase().includes('failed to fetch') ||
        errMsg.toLowerCase().includes('network')
      ) {
        setMapError(
          errMsg ||
            'Unable to load map style or tiles. Please check your network connection and try again.'
        );
      }
    });

    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: '© OpenFreeMap | © OpenStreetMap | USGS | Smithsonian GVP',
      }),
      'bottom-right'
    );

    // Track zoom level changes
    map.on('zoom', () => {
      setCurrentZoom(map.getZoom());
    });

    // 4. Earthquake and volcano layers added inside map.on('load')
    map.on('load', () => {
      // Clear any prior markers
      volcanoMarkersRef.current.forEach((m) => m.remove());
      volcanoMarkersRef.current = [];

      WELL_KNOWN_VOLCANOES.forEach((volcano) => {
        const el = document.createElement('div');
        el.className = 'group volcano-marker-pin cursor-pointer select-none';
        el.style.zIndex = '15';
        el.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background: #090d20; border: 2px solid #00f0ff; box-shadow: 0 0 12px rgba(0, 240, 255, 0.6); border-radius: 8px; padding: 3px 5px; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#00f0ff" stroke="#ffffff" stroke-width="1.5">
                <polygon points="12,2 22,21 2,21" />
              </svg>
            </div>
            <div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid #00f0ff;"></div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onNavigate(`volcano/${volcano.id}` as AppRoute);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([volcano.longitude, volcano.latitude])
          .addTo(map);

        volcanoMarkersRef.current.push(marker);
      });

      // Add GeoJSON source for earthquakes (initialise with latest features if available)
      map.addSource('usgs-earthquakes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: (filteredFeaturesRef.current || []) as any,
        },
      });

      // Layer: Outer halo glow for earthquakes
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

      // Layer: Solid circle marker for earthquakes
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

        map.flyTo({
          center: [lng, lat],
          zoom: Math.max(map.getZoom(), 4.5),
          speed: 1.2,
        });
      });

      map.on('mouseenter', 'earthquake-circles', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'earthquake-circles', () => {
        map.getCanvas().style.cursor = '';
      });

      // 2. Call map.resize() on load
      map.resize();
    });

    mapRef.current = map;

    // 2. Call map.resize() after mount and after small timeouts for layout settling
    map.resize();
    const timer1 = setTimeout(() => {
      if (mapRef.current) mapRef.current.resize();
    }, 100);
    const timer2 = setTimeout(() => {
      if (mapRef.current) mapRef.current.resize();
    }, 350);

    // 2. Call map.resize() when container resizes
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
      resizeObserverRef.current = resizeObserver;
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      volcanoMarkersRef.current.forEach((m) => m.remove());
      volcanoMarkersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (_e) {}
        mapRef.current = null;
      }
    };
  }, [onNavigate, mapInitKey]);

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
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setIsLocating(false);
      setGeoNotice('Location unavailable. Allow location access in your browser settings and try again');
      return;
    }

    setIsLocating(true);
    setGeoNotice(null);

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          const { longitude, latitude } = position.coords;
          const map = mapRef.current;
          if (map) {
            if (userMarkerRef.current) {
              userMarkerRef.current.remove();
            }

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
        (_err) => {
          // Catch permission denied (code 1), unavailable (code 2), timeout (code 3), or frame restrictions
          setIsLocating(false);
          setGeoNotice('Location unavailable. Allow location access in your browser settings and try again');
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } catch (_err) {
      // Handles synchronous exceptions (e.g. frame security error or permissions policy violation)
      setIsLocating(false);
      setGeoNotice('Location unavailable. Allow location access in your browser settings and try again');
    }
  };

  // Custom Zoom Controls Handlers (styled dark theme & touch accessible)
  const handleZoomIn = () => {
    const map = mapRef.current;
    if (map) {
      map.zoomIn({ duration: 300 });
    }
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (map) {
      map.zoomOut({ duration: 300 });
    }
  };

  const handleResetZoom = () => {
    const map = mapRef.current;
    if (map) {
      map.flyTo({
        center: [0, 20],
        zoom: 1.6,
        essential: true,
        speed: 1.2,
      });
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      {/* Header and Source Card */}
      <DataCardHeader
        title="Live Seismic & Volcano Activity Map"
        source="USGS & Smithsonian GVP"
        feedTime={feedGenerated}
        fetchTime={fetchTime}
        count={filteredFeatures.length}
        onRefresh={refetch}
        isRefreshing={loading}
      />

      {/* Control bar: Volcano Search box + Magnitude filters + Locate button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
        {/* Requirement 4: Map search box that finds volcanoes by name and flies to them */}
        <div className="relative flex-1 max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={volcanoSearchQuery}
              onChange={(e) => {
                setVolcanoSearchQuery(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => setIsSearchDropdownOpen(true)}
              placeholder="Find volcano on map (e.g., Etna, Fuji, Kilauea)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            {volcanoSearchQuery && (
              <button
                type="button"
                onClick={() => {
                  setVolcanoSearchQuery('');
                  setIsSearchDropdownOpen(false);
                }}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchDropdownOpen && volcanoSearchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-30 max-h-56 overflow-y-auto rounded-xl bg-[#090d20] border border-cyan-500/40 shadow-2xl p-1 space-y-0.5">
              {volcanoSearchResults.map((volcano) => (
                <button
                  key={volcano.id}
                  type="button"
                  onClick={() => handleSelectVolcano(volcano)}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs text-slate-200 hover:text-white hover:bg-cyan-500/15 transition group"
                >
                  <div className="flex items-center gap-2">
                    <Mountain className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <div>
                      <span className="font-semibold">{volcano.name}</span>
                      <span className="text-[11px] text-slate-400 ml-1.5">
                        {volcano.country} · {volcano.elevationM}m
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    Fly to →
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls: Filters & Locate */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 overflow-x-auto pb-1 sm:pb-0">
          {/* Magnitude filters */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMinMag('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                minMag === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Quakes ({stats.all})
            </button>
            <button
              type="button"
              onClick={() => setMinMag('2.5')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                minMag === '2.5'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              M2.5+ ({stats.m25})
            </button>
            <button
              type="button"
              onClick={() => setMinMag('4.5')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                minMag === '4.5'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              M4.5+ ({stats.m45})
            </button>
          </div>

          {/* Locate Me button */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            aria-label="Locate me using GPS"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-xs font-medium text-cyan-300 transition whitespace-nowrap disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
          </button>
        </div>
      </div>

      {geoNotice && (
        <div
          role="status"
          aria-live="polite"
          className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between animate-in fade-in"
        >
          <span>{geoNotice}</span>
          <button
            onClick={() => setGeoNotice(null)}
            aria-label="Dismiss message"
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
      <div
        className="relative rounded-2xl border border-slate-800 overflow-hidden shadow-2xl bg-[#070913] min-h-[400px]"
        style={{ minHeight: '400px' }}
      >
        {/* 3. Visible Error State with Retry Button for Tile/Style/WebGL failures */}
        {mapError && (
          <div
            role="alert"
            aria-live="assertive"
            className="absolute inset-0 z-30 bg-[#070913]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/40">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="max-w-md space-y-1.5">
              <h3 className="text-base font-semibold text-white">Map Failed to Load</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{mapError}</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRetryMap}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold shadow-lg shadow-cyan-950/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Map</span>
              </button>
              <button
                type="button"
                onClick={() => setMapError(null)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {loading && !data && (
          <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-3">
            <EarthquakeSkeleton type="map" />
          </div>
        )}

        {/* 2. Map container with explicit non-zero height on mobile and desktop */}
        <div
          ref={mapContainerRef}
          className="w-full min-h-[400px] h-[calc(100dvh-260px)] md:h-[620px] bg-[#070913] relative"
          style={{ minHeight: '400px', height: '100%' }}
        />

        {/* Custom MapLibre GL Zoom & View Controls (styled dark theme & touch-accessible) */}
        <div
          role="toolbar"
          aria-label="Map Zoom and View Controls"
          className="absolute top-4 right-4 z-10 flex flex-col items-center bg-[#090d20]/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl space-y-1.5 select-none"
        >
          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in on map"
            title="Zoom In"
            className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 active:bg-cyan-500/30 text-slate-200 hover:text-cyan-300 border border-slate-700/50 hover:border-cyan-400/40 flex items-center justify-center transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <ZoomIn className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>

          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out of map"
            title="Zoom Out"
            className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 active:bg-cyan-500/30 text-slate-200 hover:text-cyan-300 border border-slate-700/50 hover:border-cyan-400/40 flex items-center justify-center transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <ZoomOut className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>

          <div className="w-6 h-px bg-slate-800" />

          {/* Reset Zoom / Global View */}
          <button
            type="button"
            onClick={handleResetZoom}
            aria-label="Reset map view to global extent"
            title="Reset to Global View"
            className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 active:bg-cyan-500/30 text-slate-200 hover:text-cyan-300 border border-slate-700/50 hover:border-cyan-400/40 flex items-center justify-center transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <Maximize2 className="w-4 h-4 text-slate-300 hover:text-cyan-300" />
          </button>

          {/* Zoom level indicator badge */}
          <div
            aria-label={`Current map zoom level ${currentZoom.toFixed(1)}`}
            className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 border border-slate-800 rounded-md bg-slate-950/70"
          >
            {currentZoom.toFixed(1)}x
          </div>
        </div>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-10 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px] font-mono space-y-1.5 shadow-xl pointer-events-auto">
          <div className="text-slate-400 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-800">
            Map Legend
          </div>
          {/* Volcano Marker Legend */}
          <div className="flex items-center gap-2 text-cyan-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#00f0ff" stroke="#ffffff" strokeWidth="1.5">
              <polygon points="12,2 22,21 2,21" />
            </svg>
            <span className="font-semibold">Volcano (Tap for Summit Data)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff]"></span>
            <span>&lt; 2.5 Micro/Minor Quake</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
            <span>2.5 – 4.4 Moderate Quake</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
            <span>4.5 – 5.9 Strong Quake</span>
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
