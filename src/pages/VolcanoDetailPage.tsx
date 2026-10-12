import React, { useMemo } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Clock,
  Compass,
  Thermometer,
  Wind,
  Droplets,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  AlertTriangle,
  Waves,
  Shield,
  RefreshCw,
  Globe2,
  Calendar,
} from 'lucide-react';
import { AppRoute } from '../types';
import { WELL_KNOWN_VOLCANOES, calculateDistanceKm } from '../data/volcanoes';
import { useVolcanoWeather, getWeatherDescription } from '../hooks/useVolcanoWeather';
import { useEarthquakeData, getMagnitudeColor, getRelativeTime } from '../hooks/useEarthquakeData';
import { DataCardHeader } from '../components/DataCardHeader';
import { DataErrorState } from '../components/DataErrorState';
import {
  formatElevationM,
  formatTemperatureC,
  formatWindSpeedKmh,
  formatPrecipitationMm,
  formatDistanceKm,
  formatDepthKm,
} from '../utils/units';

interface VolcanoDetailPageProps {
  volcanoId: string;
  onNavigate: (route: AppRoute) => void;
}

export const VolcanoDetailPage: React.FC<VolcanoDetailPageProps> = ({
  volcanoId,
  onNavigate,
}) => {
  const volcano = useMemo(() => {
    return WELL_KNOWN_VOLCANOES.find((v) => v.id === volcanoId) || WELL_KNOWN_VOLCANOES[0];
  }, [volcanoId]);

  // Weather from Open-Meteo
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
    lastUpdated: weatherFetchTime,
  } = useVolcanoWeather(volcano.latitude, volcano.longitude);

  // Earthquakes from USGS
  const {
    data: earthquakeData,
    loading: quakeLoading,
    error: quakeError,
    refetch: refetchQuakes,
    feedGenerated,
    fetchTime: quakeFetchTime,
  } = useEarthquakeData();

  // Filter USGS earthquakes within 100 km
  const nearbyEarthquakes = useMemo(() => {
    if (!earthquakeData?.features) return [];

    return earthquakeData.features
      .map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const distanceKm = calculateDistanceKm(volcano.latitude, volcano.longitude, lat, lng);
        return { feature, distanceKm };
      })
      .filter((item) => item.distanceKm <= 100)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [earthquakeData, volcano]);

  const renderWeatherIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'sun':
        return <Sun className={`${className} text-amber-400`} />;
      case 'cloud':
        return <Cloud className={`${className} text-slate-300`} />;
      case 'rain':
        return <CloudRain className={`${className} text-[var(--accent)]`} />;
      case 'snow':
        return <CloudSnow className={`${className} text-blue-200`} />;
      case 'thunder':
        return <CloudLightning className={`${className} text-[var(--accent)]`} />;
      default:
        return <Sun className={`${className} text-amber-400`} />;
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('more/search')}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:text-[var(--accent)] font-medium transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Volcano Explorer</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('map')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] text-xs font-medium text-slate-200 hover:text-[var(--accent)] transition"
        >
          <Globe2 className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>View on Global Map</span>
        </button>
      </div>

      {/* Volcano Header Card */}
      <section
        aria-label="Volcano summary"
        className="relative overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 md:p-8 shadow-2xl space-y-4"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[var(--accent)]/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono text-[var(--accent)] uppercase tracking-wider">
                {volcano.country}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">{volcano.region}</span>
              <span className="text-slate-600">·</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono">
                {volcano.type}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[var(--text)] font-mono">
              {volcano.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>
                  {volcano.latitude.toFixed(3)}° N, {volcano.longitude.toFixed(3)}° E
                </span>
              </span>
              <span className="text-slate-600">·</span>
              <span>Elevation: {formatElevationM(volcano.elevationM)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            {/* GVP Smithsonian Link */}
            <a
              href={volcano.gvpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-[var(--accent)] text-xs font-semibold shadow-lg shadow-cyan-950/30 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span>Smithsonian GVP Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Sourced label */}
            <div className="text-[11px] text-slate-400 font-mono text-center md:text-right">
              Reference data: <span className="text-slate-200">Smithsonian GVP</span> (VN #{volcano.gvpVn})
            </div>
          </div>
        </div>

        {/* Local Time and Timezone Bar */}
        <div className="relative z-10 p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-slate-400">Volcano Local Time:</span>
            <span className="font-semibold text-[var(--text)] font-mono">
              {weather ? weather.localTimeFormatted : 'Calculating timezone...'}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>Timezone:</span>
            <span className="text-[var(--accent)]">{weather?.timezone || 'Auto'}</span>
            {weather?.timezoneAbbreviation && (
              <span className="text-slate-500">({weather.timezoneAbbreviation})</span>
            )}
          </div>
        </div>
      </section>

      {/* Weather Section (Open-Meteo) */}
      <section
        aria-label="Volcano weather forecast"
        className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl backdrop-blur-xl p-4 sm:p-5 space-y-4"
      >
        {/* Requirement: Label the weather "Live data: Open-Meteo" with last-updated time */}
        <DataCardHeader
          title="Meteorological Conditions at Summit"
          source="Open-Meteo"
          feedTime={weather?.current?.time}
          fetchTime={weatherFetchTime}
          onRefresh={refetchWeather}
          isRefreshing={weatherLoading}
        />

        {weatherError ? (
          <DataErrorState error={weatherError} onRetry={refetchWeather} isRetrying={weatherLoading} />
        ) : weatherLoading && !weather ? (
          <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent)]" />
            <span>Fetching real-time weather from Open-Meteo...</span>
          </div>
        ) : weather ? (
          <div className="space-y-4">
            {/* Current Weather Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Temperature */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Temperature</span>
                  <Thermometer className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[var(--text)] font-mono">
                  {formatTemperatureC(weather.current.temperature)}
                </div>
                <div className="text-[11px] text-slate-400">
                  Feels like {formatTemperatureC(weather.current.apparentTemperature)}
                </div>
              </div>

              {/* Conditions */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Conditions</span>
                  {renderWeatherIcon(getWeatherDescription(weather.current.weatherCode).iconName)}
                </div>
                <div className="text-sm sm:text-base font-semibold text-[var(--text)] truncate">
                  {getWeatherDescription(weather.current.weatherCode).label}
                </div>
                <div className="text-[11px] text-slate-400">
                  WMO Code {weather.current.weatherCode}
                </div>
              </div>

              {/* Wind Speed */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Wind Speed</span>
                  <Wind className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[var(--text)] font-mono">
                  {formatWindSpeedKmh(weather.current.windSpeed)}
                </div>
                <div className="text-[11px] text-slate-400">10m AGL wind vector</div>
              </div>

              {/* Humidity & Rain */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Humidity</span>
                  <Droplets className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[var(--text)] font-mono">
                  {weather.current.relativeHumidity}%
                </div>
                <div className="text-[11px] text-slate-400">
                  Rain: {formatPrecipitationMm(weather.current.precipitation)}
                </div>
              </div>
            </div>

            {/* 5-Day Forecast Strip */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
                5-Day Summit Weather Outlook
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {weather.daily.map((day, idx) => {
                  const desc = getWeatherDescription(day.weatherCode);
                  const dateObj = new Date(day.date);
                  const dayName = idx === 0 ? 'Today' : dateObj.toLocaleDateString(undefined, { weekday: 'short' });
                  const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                  return (
                    <div
                      key={day.date}
                      className="p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex flex-col items-center text-center space-y-1.5"
                    >
                      <span className="text-xs font-semibold text-[var(--text)]">{dayName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{dateStr}</span>
                      <div className="my-1">{renderWeatherIcon(desc.iconName, 'w-6 h-6')}</div>
                      <span className="text-[11px] text-slate-300 font-medium truncate w-full">
                        {desc.label}
                      </span>
                      <div className="text-xs font-mono text-slate-200">
                        <span className="text-[var(--text)] font-bold">{formatTemperatureC(day.tempMax)}</span>
                        <span className="text-slate-500 mx-1">/</span>
                        <span className="text-slate-400">{formatTemperatureC(day.tempMin)}</span>
                      </div>
                      {day.precipitationSum > 0 && (
                        <span className="text-[10px] text-[var(--accent)] font-mono">
                          {formatPrecipitationMm(day.precipitationSum)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* Recent Earthquakes Within 100 km */}
      <section
        aria-label="Nearby earthquakes"
        className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl backdrop-blur-xl p-4 sm:p-5 space-y-4"
      >
        <DataCardHeader
          title={`Recent Earthquakes Within 100 km of ${volcano.name}`}
          source="USGS"
          feedTime={feedGenerated}
          fetchTime={quakeFetchTime}
          count={nearbyEarthquakes.length}
          onRefresh={refetchQuakes}
          isRefreshing={quakeLoading}
          error={quakeError}
        />

        {quakeError ? (
          <DataErrorState error={quakeError} onRetry={refetchQuakes} isRetrying={quakeLoading} />
        ) : quakeLoading && !earthquakeData ? (
          <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent)]" />
            <span>Scanning seismic feeds within 100 km radius...</span>
          </div>
        ) : nearbyEarthquakes.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[var(--accent)] flex items-center justify-center mx-auto mb-2">
              <Waves className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text)]">
              No Earthquakes Within 100 km (Past 24 Hours)
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              No seismic events were recorded within a 100 km radial distance of {volcano.name} in the latest USGS all-day feed.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {nearbyEarthquakes.map(({ feature, distanceKm }) => {
              const mag = feature.properties.mag;
              const color = getMagnitudeColor(mag);
              const depth = feature.geometry.coordinates[2];

              return (
                <div
                  key={feature.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] hover:border-cyan-500/40 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl font-mono font-bold text-sm border flex items-center justify-center shrink-0 ${color.bg} ${color.text} ${color.border}`}
                    >
                      M{mag !== null ? mag.toFixed(1) : '–'}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-[var(--text)] truncate">
                        {feature.properties.place || 'Unknown Epicenter'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="text-[var(--accent)] font-semibold font-mono">
                          {formatDistanceKm(distanceKm)} away
                        </span>
                        <span className="text-slate-600">·</span>
                        <span>Depth: {formatDepthKm(depth)}</span>
                        <span className="text-slate-600">·</span>
                        <span>{getRelativeTime(feature.properties.time)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="self-end sm:self-center shrink-0">
                    <a
                      href={feature.properties.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-muted)] hover:bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--accent)] text-xs font-medium transition"
                    >
                      <span>USGS Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Eruption Forecast Section (Strictly Sourced: No Invented Probabilities) */}
      <section
        aria-label="Eruption forecast policy"
        className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3"
      >
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs">
          <AlertTriangle className="w-4 h-4" />
          <span>Eruption Forecast Status</span>
        </div>

        <h2 className="text-base font-bold text-[var(--text)]">
          No official forecast published by this app's sources
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          VOLCANIC strictly adheres to scientific data integrity. Volcanic alert levels, aviation hazard color codes, and eruption prognoses must only be issued by the designated state authority monitoring {volcano.name}. Never rely on third-party synthetic or unverified probability models.
        </p>

        <div className="pt-2">
          <a
            href={volcano.observatoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-semibold transition"
          >
            <span>Consult Official Observatory: {volcano.observatoryName}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
};
