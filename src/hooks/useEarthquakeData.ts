import { useState, useEffect, useCallback, useRef } from 'react';
import { EarthquakeFeed } from '../types';

const USGS_FEED_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// In-memory cache to share data across components/pages
let cachedFeed: EarthquakeFeed | null = null;
let lastFetchTimestamp: number = 0;

export function useEarthquakeData() {
  const [data, setData] = useState<EarthquakeFeed | null>(cachedFeed);
  const [loading, setLoading] = useState<boolean>(!cachedFeed);
  const [error, setError] = useState<string | null>(null);
  const [fetchTime, setFetchTime] = useState<Date | null>(
    lastFetchTimestamp ? new Date(lastFetchTimestamp) : null
  );
  const isMounted = useRef(true);

  const fetchData = useCallback(async (isManualRetry = false) => {
    // If not manual retry and cache is fresher than 30s, use cache
    if (!isManualRetry && cachedFeed && Date.now() - lastFetchTimestamp < 30000) {
      setData(cachedFeed);
      setFetchTime(new Date(lastFetchTimestamp));
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(USGS_FEED_URL, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`USGS server returned status ${response.status} (${response.statusText})`);
      }

      const json: EarthquakeFeed = await response.json();
      if (!json || !Array.isArray(json.features)) {
        throw new Error('Invalid GeoJSON payload received from USGS feed.');
      }

      cachedFeed = json;
      lastFetchTimestamp = Date.now();

      if (isMounted.current) {
        setData(json);
        setFetchTime(new Date(lastFetchTimestamp));
        setError(null);
        setLoading(false);
      }
    } catch (err) {
      if (isMounted.current) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : 'Unable to reach USGS earthquake feed. Please check your internet connection.';
        setError(errorMsg);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchData(true);
    }, REFRESH_INTERVAL_MS);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [fetchData]);

  const feedGenerated = data?.metadata?.generated ? new Date(data.metadata.generated) : null;

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    feedGenerated,
    fetchTime,
  };
}

// Utility functions
export function getMagnitudeColor(mag: number | null): {
  text: string;
  bg: string;
  border: string;
  hex: string;
  badge: string;
} {
  if (mag === null || isNaN(mag)) {
    return {
      text: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/30',
      hex: '#94a3b8',
      badge: 'Unknown',
    };
  }

  if (mag < 2.5) {
    return {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/15',
      border: 'border-cyan-400/30',
      hex: '#00f0ff',
      badge: 'Micro / Minor',
    };
  }

  if (mag < 4.5) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-500/15',
      border: 'border-amber-400/30',
      hex: '#f59e0b',
      badge: 'Light / Moderate',
    };
  }

  if (mag < 6.0) {
    return {
      text: 'text-orange-400',
      bg: 'bg-orange-500/15',
      border: 'border-orange-400/30',
      hex: '#f97316',
      badge: 'Strong · M4.5–5.9',
    };
  }

  return {
    text: 'text-rose-400',
    bg: 'bg-rose-500/20',
    border: 'border-rose-400/40',
    hex: '#f43f5e',
    badge: 'Major · M6.0+',
  };
}

export function getRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}

export function formatTimeUTC(timestamp: number): string {
  return new Date(timestamp).toUTCString();
}

export function formatTimeLocal(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
