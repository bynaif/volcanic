import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Plane,
  ExternalLink,
  Clock,
  Waves,
  CheckCircle2,
} from 'lucide-react';
import { AppRoute } from '../types';
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

interface AlertsPageProps {
  onNavigate: (route: AppRoute) => void;
}

type MinAlertFilter = '4.5' | '5.0' | '6.0' | 'all';

const FILTERS: { id: MinAlertFilter; label: string }[] = [
  { id: '4.5', label: 'M 4.5+' },
  { id: '5.0', label: 'M 5.0+' },
  { id: '6.0', label: 'M 6.0+' },
  { id: 'all', label: 'All Quakes' },
];

const aviationCodes = [
  {
    code: 'GREEN',
    label: 'Normal',
    description:
      'Volcanic activity is considered normal for the volcano. Follow local observatory updates.',
    classes: 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400',
    dot: 'bg-emerald-500',
  },
  {
    code: 'YELLOW',
    label: 'Advisory',
    description:
      'Signs of elevated unrest are being observed. Check the responsible observatory for the specific assessment.',
    classes: 'bg-yellow-950/20 border-yellow-800/40 text-yellow-400',
    dot: 'bg-yellow-500',
  },
  {
    code: 'ORANGE',
    label: 'Watch',
    description:
      'Volcanic unrest is elevated, or an eruption may be underway with limited ash emission. Consult the official notice.',
    classes: 'bg-orange-950/20 border-orange-800/40 text-orange-400',
    dot: 'bg-orange-500',
  },
  {
    code: 'RED',
    label: 'Warning',
    description:
      'An eruption with significant ash emission is occurring or expected. Follow official aviation and emergency instructions.',
    classes: 'bg-rose-950/20 border-rose-800/40 text-rose-400',
    dot: 'bg-rose-500',
  },
];

export const AlertsPage: React.FC<AlertsPageProps> = ({ onNavigate }) => {
  const { data, loading, error, refetch, feedGenerated, fetchTime } =
    useEarthquakeData();
  const [filterThreshold, setFilterThreshold] =
    useState<MinAlertFilter>('4.5');

  const alertQuakes = useMemo(() => {
    if (!data?.features) return [];

    const cutoff = Date.now() - 24 * 60 * 60 * 1000;

    return data.features.filter((feature) => {
      const magnitude = feature.properties.mag;
      const time = feature.properties.time;

      if (
        magnitude === null ||
        !Number.isFinite(magnitude) ||
        !Number.isFinite(time) ||
        time < cutoff
      ) {
        return false;
      }

      if (filterThreshold === '4.5') return magnitude >= 4.5;
      if (filterThreshold === '5.0') return magnitude >= 5.0;
      if (filterThreshold === '6.0') return magnitude >= 6.0;
      return true;
    });
  }, [data, filterThreshold]);

  const m45Count = useMemo(
    () =>
      data?.features.filter(
        (feature) =>
          feature.properties.mag !== null &&
          Number.isFinite(feature.properties.mag) &&
          feature.properties.mag >= 4.5,
      ).length ?? 0,
    [data],
  );

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-rose-400">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>USGS Earthquake Feed</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-cyan-300">Periodically updated</span>
          </div>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
            Earthquake Alerts
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400">
            Significant earthquake events reported by the USGS in the last
            24 hours. These are earthquake-feed results, not volcano eruption
            alerts or a guarantee of local impact.
          </p>
        </div>

        <div
          className="flex flex-wrap items-center gap-1.5 self-start rounded-xl border border-slate-800 bg-slate-900/80 p-1 sm:self-auto"
          aria-label="Filter earthquakes by magnitude"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={filterThreshold === filter.id}
              onClick={() => setFilterThreshold(filter.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filterThreshold === filter.id
                  ? 'border border-rose-400/30 bg-rose-500/20 text-rose-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      <section
        aria-label="Earthquake events reported in the last 24 hours"
        className="space-y-4 rounded-2xl border border-slate-800/90 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-xl sm:p-5"
      >
        <DataCardHeader
          title="Earthquake Events · Last 24 Hours"
          source="USGS"
          feedTime={feedGenerated}
          fetchTime={fetchTime}
          count={alertQuakes.length}
          onRefresh={refetch}
          isRefreshing={loading}
        />

        {data && (
          <p className="text-xs text-slate-400">
            {m45Count} event{m45Count === 1 ? '' : 's'} of magnitude 4.5 or
            greater in the loaded feed. Your selected filter currently shows{' '}
            {alertQuakes.length}.
          </p>
        )}

        {error ? (
          <DataErrorState
            error={error}
            onRetry={refetch}
            isRetrying={loading}
          />
        ) : loading && !data ? (
          <EarthquakeSkeleton count={4} />
        ) : alertQuakes.length === 0 ? (
          <div className="space-y-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-8 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-semibold text-white">
              No matching earthquake events
            </h2>
            <p className="mx-auto max-w-md text-xs leading-relaxed text-slate-400">
              No events in the loaded USGS feed match this magnitude filter
              and 24-hour window. This does not mean there is no volcanic
              hazard or other local emergency. Check official local alerts.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertQuakes.map((quake) => {
              const magnitude = quake.properties.mag;
              if (magnitude === null) return null;

              const color = getMagnitudeColor(magnitude);
              const depth = quake.geometry.coordinates[2];

              return (
                <article
                  key={quake.id}
                  className={`rounded-xl border bg-gradient-to-r from-slate-950/90 to-slate-900/80 p-4 shadow-lg transition sm:p-5 ${
                    magnitude >= 6
                      ? 'border-rose-500/50 shadow-rose-950/30'
                      : magnitude >= 5
                        ? 'border-orange-500/40 shadow-orange-950/20'
                        : 'border-amber-500/30'
                  }`}
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`flex shrink-0 flex-col items-center justify-center rounded-xl border px-3 py-2 font-mono text-base font-bold shadow-sm ${color.bg} ${color.text} ${color.border}`}
                        aria-label={`Magnitude ${magnitude.toFixed(1)}`}
                      >
                        <span>M {magnitude.toFixed(1)}</span>
                        <span className="mt-0.5 text-[9px] font-sans font-normal uppercase opacity-90">
                          {color.badge}
                        </span>
                      </div>

                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-800/70 px-2 py-0.5 text-[11px] text-slate-300">
                            <AlertTriangle className="h-3 w-3" />
                            Earthquake event
                          </span>
                          <span className="font-mono text-xs text-slate-400">
                            {getRelativeTime(quake.properties.time)}
                          </span>
                        </div>

                        <h3 className="break-words text-sm font-bold text-white sm:text-base">
                          {quake.properties.place || 'Location unavailable'}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <Waves className="h-3.5 w-3.5 text-cyan-400" />
                            Depth:{' '}
                            {Number.isFinite(depth)
                              ? `${depth.toFixed(1)} km`
                              : 'Unavailable'}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="h-3.5 w-3.5 text-violet-400" />
                            Local: {formatTimeLocal(quake.properties.time)}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400">
                            UTC: {formatTimeUTC(quake.properties.time)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={quake.properties.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:border-cyan-400/50 hover:bg-slate-800"
                    >
                      USGS event details
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section
        aria-label="Volcano aviation color code reference"
        className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 md:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">
              Volcano Aviation Color Codes
            </h2>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            Reference only
          </span>
        </div>

        <p className="text-xs leading-relaxed text-slate-400">
          These colors describe a volcano observatory's assessment of volcanic
          activity and aviation ash hazard. They are separate from earthquake
          magnitude and are not calculated from the earthquake feed on this page.
          The precise criteria and wording may vary by observatory.
        </p>

        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
          {aviationCodes.map((item) => (
            <div
              key={item.code}
              className={`space-y-2 rounded-xl border p-3.5 ${item.classes}`}
            >
              <div className="flex items-center gap-2 font-bold">
                <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                <span>{item.code} · {item.label}</span>
              </div>
              <p className="leading-5 text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>

        <a
          href="https://www.usgs.gov/programs/VHP/volcano-activity-notices"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:underline"
        >
          Read official USGS volcano notices
          <ExternalLink className="h-3 w-3" />
        </a>
      </section>

      <p className="text-xs leading-5 text-slate-500">
        Earthquake reports can be revised as more information becomes
        available. Magnitude alone does not determine damage, felt intensity,
        or danger at a particular location. For immediate safety decisions,
        follow local emergency services and official volcano observatory
        advisories.
      </p>
    </div>
  );
};