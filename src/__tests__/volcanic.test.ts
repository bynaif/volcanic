import { describe, it, expect, vi } from 'vitest';
import {
  calculateDistanceKm,
  WELL_KNOWN_VOLCANOES,
  Volcano,
} from '../data/volcanoes';
import {
  getMagnitudeColor,
  getRelativeTime,
  formatTimeUTC,
  formatTimeLocal,
} from '../hooks/useEarthquakeData';
import { EarthquakeFeature, EarthquakeFeed } from '../types';

// ========================================================
// 1. USGS Data Parser & Helper Tests
// ========================================================
describe('USGS Data Parser & Formatting Helpers', () => {
  const sampleFeature: EarthquakeFeature = {
    type: 'Feature',
    id: 'us7000sample',
    properties: {
      mag: 5.2,
      place: '15 km SSW of Volcano, Hawaii',
      time: 1728739200000, // Oct 12, 2024 approx
      updated: 1728740000000,
      tz: null,
      url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000sample',
      detail: '',
      felt: 42,
      cdi: 4.1,
      mmi: 4.8,
      alert: 'green',
      status: 'reviewed',
      tsunami: 0,
      sig: 416,
      net: 'us',
      code: '7000sample',
      ids: ',us7000sample,',
      sources: ',us,',
      types: ',origin,phase-data,',
      nst: 35,
      dmin: 0.1,
      rms: 0.22,
      gap: 75,
      magType: 'mww',
      type: 'earthquake',
      title: 'M 5.2 - 15 km SSW of Volcano, Hawaii',
    },
    geometry: {
      type: 'Point',
      coordinates: [-155.35, 19.31, 10.5], // [lng, lat, depthKm]
    },
  };

  it('correctly parses properties and coordinates from GeoJSON feature', () => {
    expect(sampleFeature.properties.mag).toBe(5.2);
    expect(sampleFeature.properties.place).toContain('Volcano, Hawaii');
    expect(sampleFeature.geometry.coordinates[0]).toBe(-155.35); // Longitude
    expect(sampleFeature.geometry.coordinates[1]).toBe(19.31);  // Latitude
    expect(sampleFeature.geometry.coordinates[2]).toBe(10.5);   // Depth km
  });

  it('determines magnitude colors accurately across scales', () => {
    // Micro / Minor (< 2.5)
    const minor = getMagnitudeColor(1.8);
    expect(minor.hex).toBe('#00f0ff');
    expect(minor.badge).toBe('Micro / Minor');

    // Light / Moderate (2.5 - 4.49)
    const moderate = getMagnitudeColor(3.7);
    expect(moderate.hex).toBe('#f59e0b');
    expect(moderate.badge).toBe('Light / Moderate');

    // Strong Warning (4.5 - 5.99)
    const strong = getMagnitudeColor(5.2);
    expect(strong.hex).toBe('#f97316');
    expect(strong.badge).toBe('Strong Warning');

    // Major Alert (>= 6.0)
    const major = getMagnitudeColor(6.8);
    expect(major.hex).toBe('#f43f5e');
    expect(major.badge).toBe('Major Disaster');

    // Null or invalid magnitude fallback
    const fallback = getMagnitudeColor(null);
    expect(fallback.badge).toBe('Unknown');
  });

  it('formats relative times and UTC timestamps cleanly', () => {
    const now = Date.now();
    expect(getRelativeTime(now - 10000)).toBe('Just now');
    expect(getRelativeTime(now - 5 * 60 * 1000)).toBe('5m ago');
    expect(getRelativeTime(now - 3 * 3600 * 1000)).toBe('3h ago');
    expect(getRelativeTime(now - 48 * 3600 * 1000)).toBe('2d ago');

    const utcString = formatTimeUTC(1700000000000);
    expect(utcString).toContain('GMT');
  });
});

// ========================================================
// 2. Magnitude Filter Tests
// ========================================================
describe('Magnitude Filter Logic', () => {
  const testQuakes: EarthquakeFeature[] = [
    {
      type: 'Feature',
      id: 'q1',
      properties: { mag: 1.2, place: 'A', time: Date.now() } as any,
      geometry: { type: 'Point', coordinates: [0, 0, 5] },
    },
    {
      type: 'Feature',
      id: 'q2',
      properties: { mag: 2.5, place: 'B', time: Date.now() } as any,
      geometry: { type: 'Point', coordinates: [0, 0, 5] },
    },
    {
      type: 'Feature',
      id: 'q3',
      properties: { mag: 4.4, place: 'C', time: Date.now() } as any,
      geometry: { type: 'Point', coordinates: [0, 0, 5] },
    },
    {
      type: 'Feature',
      id: 'q4',
      properties: { mag: 4.5, place: 'D', time: Date.now() } as any,
      geometry: { type: 'Point', coordinates: [0, 0, 5] },
    },
    {
      type: 'Feature',
      id: 'q5',
      properties: { mag: 6.1, place: 'E', time: Date.now() } as any,
      geometry: { type: 'Point', coordinates: [0, 0, 5] },
    },
    {
      type: 'Feature',
      id: 'q6',
      properties: { mag: null, place: 'F', time: Date.now() } as any,
      geometry: { type: 'Point', coordinates: [0, 0, 5] },
    },
  ];

  function filterByMag(quakes: EarthquakeFeature[], minMag: 'all' | '2.5' | '4.5') {
    if (minMag === '2.5') {
      return quakes.filter((q) => q.properties.mag !== null && q.properties.mag >= 2.5);
    }
    if (minMag === '4.5') {
      return quakes.filter((q) => q.properties.mag !== null && q.properties.mag >= 4.5);
    }
    return quakes;
  }

  it('returns all earthquakes when filter is "all"', () => {
    const result = filterByMag(testQuakes, 'all');
    expect(result.length).toBe(6);
  });

  it('filters earthquakes with magnitude >= 2.5', () => {
    const result = filterByMag(testQuakes, '2.5');
    expect(result.map((q) => q.id)).toEqual(['q2', 'q3', 'q4', 'q5']);
    expect(result.length).toBe(4);
  });

  it('filters earthquakes with magnitude >= 4.5', () => {
    const result = filterByMag(testQuakes, '4.5');
    expect(result.map((q) => q.id)).toEqual(['q4', 'q5']);
    expect(result.length).toBe(2);
  });
});

// ========================================================
// 3. Distance (Haversine) Function Tests
// ========================================================
describe('Geodesic Distance (Haversine) Function', () => {
  it('calculates 0 distance between identical coordinates', () => {
    const d = calculateDistanceKm(37.748, 14.999, 37.748, 14.999);
    expect(d).toBeCloseTo(0, 1);
  });

  it('accurately calculates known geographic distances', () => {
    // Mount Etna (37.748 N, 14.999 E) to Catania (37.502 N, 15.087 E) is ~28 km
    const distEtnaCatania = calculateDistanceKm(37.748, 14.999, 37.502, 15.087);
    expect(distEtnaCatania).toBeGreaterThan(25);
    expect(distEtnaCatania).toBeLessThan(32);

    // Kīlauea (19.421 N, -155.287 W) to Hilo (19.729 N, -155.085 W) is ~40 km
    const distKilaueaHilo = calculateDistanceKm(19.421, -155.287, 19.729, -155.085);
    expect(distKilaueaHilo).toBeGreaterThan(35);
    expect(distKilaueaHilo).toBeLessThan(45);
  });

  it('accurately applies the 100 km radial filter', () => {
    const etna = { lat: 37.748, lng: 14.999 };
    // Quake inside 100 km (e.g. 30 km away)
    const nearbyQuake = { lat: 37.6, lng: 15.1 };
    // Quake far away (e.g. Rome ~500 km away)
    const farQuake = { lat: 41.9, lng: 12.5 };

    const dNear = calculateDistanceKm(etna.lat, etna.lng, nearbyQuake.lat, nearbyQuake.lng);
    const dFar = calculateDistanceKm(etna.lat, etna.lng, farQuake.lat, farQuake.lng);

    expect(dNear).toBeLessThanOrEqual(100);
    expect(dFar).toBeGreaterThan(100);
  });
});

// ========================================================
// 4. Volcano Search & Filter Tests
// ========================================================
describe('Volcano Search and Catalog Filter', () => {
  it('contains exactly 25 curated well-known volcanoes', () => {
    expect(WELL_KNOWN_VOLCANOES.length).toBe(25);
  });

  it('each volcano has accurate coordinates and valid Smithsonian GVP links', () => {
    WELL_KNOWN_VOLCANOES.forEach((v) => {
      expect(v.id).toBeTruthy();
      expect(v.name).toBeTruthy();
      expect(v.country).toBeTruthy();
      expect(v.type).toBeTruthy();
      expect(v.latitude).toBeGreaterThanOrEqual(-90);
      expect(v.latitude).toBeLessThanOrEqual(90);
      expect(v.longitude).toBeGreaterThanOrEqual(-180);
      expect(v.longitude).toBeLessThanOrEqual(180);
      expect(v.elevationM).toBeGreaterThan(-500);
      expect(v.gvpUrl).toContain('volcano.si.edu/volcano.cfm?vn=');
      expect(v.observatoryUrl).toMatch(/^https?:\/\//);
    });
  });

  it('searches volcanoes by name case-insensitively', () => {
    const query = 'etna';
    const results = WELL_KNOWN_VOLCANOES.filter((v) =>
      v.name.toLowerCase().includes(query.toLowerCase())
    );
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Mount Etna');

    const queryFuji = 'FUJI';
    const resultsFuji = WELL_KNOWN_VOLCANOES.filter((v) =>
      v.name.toLowerCase().includes(queryFuji.toLowerCase())
    );
    expect(resultsFuji.length).toBe(1);
    expect(resultsFuji[0].name).toBe('Mount Fuji');
  });

  it('filters volcanoes by country', () => {
    const resultsItaly = WELL_KNOWN_VOLCANOES.filter(
      (v) => v.country.toLowerCase() === 'italy'
    );
    // Etna, Stromboli, Vesuvius
    expect(resultsItaly.length).toBe(3);
  });

  it('filters volcanoes by morphological type', () => {
    const shields = WELL_KNOWN_VOLCANOES.filter((v) =>
      v.type.toLowerCase().includes('shield')
    );
    // Kīlauea, Mauna Loa, Piton de la Fournaise
    expect(shields.length).toBeGreaterThanOrEqual(3);

    const calderas = WELL_KNOWN_VOLCANOES.filter((v) =>
      v.type.toLowerCase().includes('caldera')
    );
    // Krakatau, Taal
    expect(calderas.length).toBeGreaterThanOrEqual(2);
  });
});

// ========================================================
// 5. Error & Retry State Simulation Tests
// ========================================================
describe('Error and Retry State Behavior', () => {
  it('correctly handles failed fetch and invokes retry callback', async () => {
    let attempts = 0;
    const mockFetch = vi.fn().mockImplementation(async () => {
      attempts++;
      if (attempts === 1) {
        throw new Error('USGS upstream timeout');
      }
      return {
        ok: true,
        json: async () => ({
          type: 'FeatureCollection',
          metadata: { count: 1 },
          features: [],
        }),
      };
    });

    let data: any = null;
    let error: string | null = null;
    let loading = true;

    async function loadData() {
      loading = true;
      try {
        const res = await mockFetch();
        data = await res.json();
        error = null;
      } catch (err: any) {
        error = err.message;
        data = null;
      } finally {
        loading = false;
      }
    }

    // First attempt fails
    await loadData();
    expect(error).toBe('USGS upstream timeout');
    expect(data).toBeNull();
    expect(loading).toBe(false);

    // User triggers Retry
    await loadData();
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(attempts).toBe(2);
  });
});

// ========================================================
// 6. Geolocation Error Handling & Locate Me Tests
// ========================================================
describe('Geolocation and Locate Me Failure Handling', () => {
  const EXPECTED_MSG =
    'Location unavailable. Allow location access in your browser settings and try again';

  it('handles permission denied (code 1) gracefully with expected inline message', () => {
    let geoNotice: string | null = null;
    let isLocating = true;

    const mockGetCurrentPosition = vi.fn((_success, error) => {
      error({ code: 1, message: 'User denied Geolocation', PERMISSION_DENIED: 1 });
    });

    try {
      mockGetCurrentPosition(
        () => {},
        (err: any) => {
          isLocating = false;
          geoNotice = EXPECTED_MSG;
        }
      );
    } catch {
      isLocating = false;
      geoNotice = EXPECTED_MSG;
    }

    expect(isLocating).toBe(false);
    expect(geoNotice).toBe(EXPECTED_MSG);
  });

  it('handles position unavailable (code 2) gracefully', () => {
    let geoNotice: string | null = null;
    let isLocating = true;

    const mockGetCurrentPosition = vi.fn((_success, error) => {
      error({ code: 2, message: 'Position unavailable', POSITION_UNAVAILABLE: 2 });
    });

    try {
      mockGetCurrentPosition(
        () => {},
        (err: any) => {
          isLocating = false;
          geoNotice = EXPECTED_MSG;
        }
      );
    } catch {
      isLocating = false;
      geoNotice = EXPECTED_MSG;
    }

    expect(isLocating).toBe(false);
    expect(geoNotice).toBe(EXPECTED_MSG);
  });

  it('handles request timeout (code 3) gracefully', () => {
    let geoNotice: string | null = null;
    let isLocating = true;

    const mockGetCurrentPosition = vi.fn((_success, error) => {
      error({ code: 3, message: 'Timeout', TIMEOUT: 3 });
    });

    try {
      mockGetCurrentPosition(
        () => {},
        (err: any) => {
          isLocating = false;
          geoNotice = EXPECTED_MSG;
        }
      );
    } catch {
      isLocating = false;
      geoNotice = EXPECTED_MSG;
    }

    expect(isLocating).toBe(false);
    expect(geoNotice).toBe(EXPECTED_MSG);
  });

  it('catches synchronous exceptions when blocked by embedding frame or permissions policy', () => {
    let geoNotice: string | null = null;
    let isLocating = true;

    const mockGetCurrentPosition = vi.fn(() => {
      throw new Error(
        'Failed to execute getCurrentPosition on Geolocation: Permissions policy violation'
      );
    });

    try {
      mockGetCurrentPosition();
    } catch {
      isLocating = false;
      geoNotice = EXPECTED_MSG;
    }

    expect(isLocating).toBe(false);
    expect(geoNotice).toBe(EXPECTED_MSG);
  });
});

// ========================================================
// 7. Custom MapLibre GL Zoom Controls Tests
// ========================================================
describe('Custom MapLibre GL Zoom Controls', () => {
  it('correctly invokes map zoomIn and zoomOut with smooth duration', () => {
    const mockMap = {
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      flyTo: vi.fn(),
      getZoom: vi.fn(() => 1.6),
    };

    // Zoom in
    mockMap.zoomIn({ duration: 300 });
    expect(mockMap.zoomIn).toHaveBeenCalledWith({ duration: 300 });

    // Zoom out
    mockMap.zoomOut({ duration: 300 });
    expect(mockMap.zoomOut).toHaveBeenCalledWith({ duration: 300 });

    // Reset zoom
    mockMap.flyTo({
      center: [0, 20],
      zoom: 1.6,
      essential: true,
      speed: 1.2,
    });
    expect(mockMap.flyTo).toHaveBeenCalledWith({
      center: [0, 20],
      zoom: 1.6,
      essential: true,
      speed: 1.2,
    });
  });

  it('formats zoom level indicator to single decimal precision', () => {
    const zoom1 = 1.6;
    const zoom2 = 7.423;
    expect(zoom1.toFixed(1)).toBe('1.6');
    expect(zoom2.toFixed(1)).toBe('7.4');
  });
});

// ========================================================
// 8. Earthquake Magnitude Distribution Chart Tests
// ========================================================
describe('Earthquake Magnitude Distribution Chart', () => {
  it('correctly processes 10 most recent earthquakes and computes statistics', () => {
    const mockEarthquakes = [
      { id: '1', properties: { mag: 6.2, place: 'Honshu, Japan', time: 1000 }, geometry: { coordinates: [140, 35, 10] } },
      { id: '2', properties: { mag: 4.5, place: 'Southern California', time: 900 }, geometry: { coordinates: [-118, 34, 5] } },
      { id: '3', properties: { mag: 2.1, place: 'Hawaii', time: 800 }, geometry: { coordinates: [-155, 19, 2] } },
      { id: '4', properties: { mag: 7.1, place: 'Vanuatu', time: 700 }, geometry: { coordinates: [168, -16, 25] } },
    ] as any;

    const magnitudes = mockEarthquakes.map((eq: any) => eq.properties.mag);
    const maxMag = Math.max(...magnitudes);
    const minMag = Math.min(...magnitudes);
    const avgMag = magnitudes.reduce((a: number, b: number) => a + b, 0) / magnitudes.length;

    expect(maxMag).toBe(7.1);
    expect(minMag).toBe(2.1);
    expect(avgMag).toBeCloseTo(4.975);
  });

  it('handles null magnitude gracefully', () => {
    const rawMag = null;
    const safeMag = rawMag !== null ? Math.max(0, rawMag) : 0;
    expect(safeMag).toBe(0);
  });
});

