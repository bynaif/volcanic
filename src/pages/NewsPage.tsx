import React, { useCallback, useEffect, useState } from 'react';
import {
  Radio,
  Newspaper,
  Rss,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from 'lucide-react';
import { AppRoute } from '../types';

interface NewsPageProps {
  onNavigate: (route: AppRoute) => void;
}

interface NoticeSection {
  vName?: string;
  region?: string;
  synopsis?: string;
  alertLevel?: string;
  colorCode?: string;
  vUrl?: string;
}

interface USGSNotice {
  noticeTitle?: string;
  sentUtc?: string;
  obs?: string;
  noticeId?: string;
  noticeUrl?: string;
  obsAlertLevel?: string;
  obsColorCode?: string;
  noticeSections?: NoticeSection[];
}

const FEED_URL = 'https://volcanoes.usgs.gov/vsc/api/hansApi/newest';

const sources = [
  {
    name: 'Smithsonian GVP',
    description: 'Weekly volcanic activity reports from around the world.',
    url: 'https://volcano.si.edu/reports_weekly.cfm',
  },
  {
    name: 'USGS Volcano Hazards Program',
    description: 'Official daily and weekly US observatory notices.',
    url: 'https://www.usgs.gov/programs/VHP/volcano-activity-notices',
  },
  {
    name: 'NOAA / ICAO VAAC',
    description: 'Volcanic ash advisories for aviation safety.',
    url: 'https://www.weather.gov/aviation/vaac/',
  },
];

function formatDate(value?: string) {
  if (!value) return 'Date unavailable';

  const date = new Date(
    value.length === 10 ? `${value}T12:00:00Z` : value,
  );

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function alertStyle(level?: string) {
  switch ((level || '').toUpperCase()) {
    case 'WARNING':
      return 'border-red-500/30 bg-red-500/10 text-red-300';
    case 'WATCH':
      return 'border-orange-500/30 bg-orange-500/10 text-orange-300';
    case 'ADVISORY':
      return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
    case 'NORMAL':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    default:
      return 'border-slate-700 bg-slate-800/70 text-slate-300';
  }
}

export const NewsPage: React.FC<NewsPageProps> = ({ onNavigate }) => {
  const [notices, setNotices] = useState<USGSNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadNotices = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    if (notices.length === 0) setLoading(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(FEED_URL, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`USGS returned HTTP ${response.status}`);
      }

      const result: unknown = await response.json();

      if (!Array.isArray(result)) {
        throw new Error('Unexpected response from the USGS feed.');
      }

      const validNotices = (result as USGSNotice[])
        .filter(
          (item) =>
            item &&
            typeof item === 'object' &&
            (item.noticeTitle || item.noticeUrl),
        )
        .sort((a, b) =>
          (b.sentUtc || '').localeCompare(a.sentUtc || ''),
        );

      setNotices(validNotices);
      setLastUpdated(new Date());
      setError(
        validNotices.length
          ? null
          : 'The feed responded successfully, but no notices were returned.',
      );
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name === 'AbortError'
          ? 'The USGS feed timed out. Please try again.'
          : cause instanceof Error
            ? `Could not load the USGS feed: ${cause.message}`
            : 'Could not load the USGS feed.',
      );
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
      setRefreshing(false);
    }
  }, [notices.length]);

  useEffect(() => {
    void loadNotices();

    const interval = window.setInterval(
      () => void loadNotices(true),
      5 * 60 * 1000,
    );

    return () => window.clearInterval(interval);
  }, [loadNotices]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-violet-400 font-mono">
            <Radio className="w-3.5 h-3.5" />
            <span>Observatory News &amp; Bulletins</span>
            <span className="text-slate-600">·</span>
            {loading && notices.length === 0 ? (
              <span className="text-slate-400">Connecting…</span>
            ) : error && notices.length === 0 ? (
              <span className="text-amber-300">Feed unavailable</span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                USGS Feed Connected
              </span>
            )}
          </div>

          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono">
            Volcanological Dispatches
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Live notices from the USGS Volcano Notification Service.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {lastUpdated && (
            <span className="text-[11px] text-slate-400 font-mono">
              Updated:{' '}
              {new Intl.DateTimeFormat('en', {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: 'UTC',
              }).format(lastUpdated)}{' '}
              UTC
            </span>
          )}

          <button
            type="button"
            onClick={() => void loadNotices(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-sm text-slate-200 hover:border-violet-500/50 disabled:opacity-60 transition"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            {refreshing ? 'Refreshing…' : 'Refresh Feed'}
          </button>
        </div>
      </header>

      {error && (
        <div
          role="status"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-sm"
        >
          <div className="flex items-start gap-2 text-amber-200">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              {error}
              {notices.length > 0 &&
                ' Showing the last successfully loaded notices.'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => void loadNotices(true)}
            className="text-xs font-semibold text-amber-200 hover:text-white"
          >
            Retry connection
          </button>
        </div>
      )}

      {loading && notices.length === 0 && (
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/50 text-center">
          <RefreshCw className="w-6 h-6 mx-auto mb-3 text-violet-400 animate-spin" />
          <p className="text-sm text-slate-200">
            Connecting to the USGS observatory feed…
          </p>
          <p className="mt-1 text-xs text-slate-500">
            This may take a few seconds.
          </p>
        </div>
      )}

      {!loading && notices.length === 0 && error && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 text-center">
          <Newspaper className="w-8 h-8 mx-auto mb-3 text-slate-500" />
          <h2 className="text-sm font-semibold text-white">
            Live notices are temporarily unavailable
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Use the official source portals below in the meantime.
          </p>
          <button
            type="button"
            onClick={() => void loadNotices(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-violet-500/15 text-violet-300 text-xs font-semibold"
          >
            Try again
          </button>
        </div>
      )}

      {notices.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            {notices.length} official USGS{' '}
            {notices.length === 1 ? 'notice' : 'notices'} loaded
          </span>
          <span className="text-slate-600">·</span>
          <span>Refreshes every 5 minutes</span>
        </div>
      )}

      <section aria-label="Live USGS volcano notices" className="space-y-3">
        {notices.map((notice, index) => {
          const sections = notice.noticeSections || [];
          const title = notice.noticeTitle || 'USGS Volcano Observatory Update';
          const key =
            notice.noticeId || notice.noticeUrl || `${title}-${index}`;
          const level =
            notice.obsAlertLevel || sections[0]?.alertLevel || 'UNASSIGNED';
          const color =
            notice.obsColorCode || sections[0]?.colorCode || 'UNASSIGNED';

          const summaries = sections.filter(
            (section) => section.vName || section.synopsis,
          );

          return (
            <article
              key={key}
              className="p-4 md:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700 transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                    <span className="text-violet-300 font-semibold">USGS</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">
                      {(notice.obs || 'USGS').toUpperCase()} Observatory
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <Clock3 className="w-3 h-3" />
                      {formatDate(notice.sentUtc)}
                    </span>
                  </div>

                  <h2 className="text-sm md:text-base font-semibold leading-snug text-white">
                    {title}
                  </h2>

                  {summaries.length > 0 ? (
                    <div className="space-y-3">
                      {summaries.map((section, sectionIndex) => (
                        <div
                          key={`${section.vName || 'summary'}-${sectionIndex}`}
                          className="space-y-1.5"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            {section.vName &&
                              (section.vUrl ? (
                                <a
                                  href={section.vUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium text-slate-200 hover:text-cyan-300"
                                >
                                  {section.vName}
                                </a>
                              ) : (
                                <span className="text-sm font-medium text-slate-200">
                                  {section.vName}
                                </span>
                              ))}

                            {section.region && (
                              <span className="text-[11px] text-slate-500">
                                {section.region}
                              </span>
                            )}

                            {section.alertLevel &&
                              section.alertLevel.toUpperCase() !==
                                'UNASSIGNED' && (
                                <span
                                  className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold ${alertStyle(section.alertLevel)}`}
                                >
                                  {section.alertLevel}
                                  {section.colorCode &&
                                  section.colorCode.toUpperCase() !==
                                    'UNASSIGNED'
                                    ? ` / ${section.colorCode}`
                                    : ''}
                                </span>
                              )}
                          </div>

                          {section.synopsis && (
                            <p className="text-xs md:text-sm leading-relaxed text-slate-400">
                              {section.synopsis}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Open the original USGS notice for the full report.
                    </p>
                  )}
                </div>

                <div className="flex lg:flex-col items-start lg:items-end justify-between gap-3 lg:min-w-36">
                  <span
                    className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-semibold ${alertStyle(level)}`}
                  >
                    {level}
                    {color && color.toUpperCase() !== 'UNASSIGNED'
                      ? ` / ${color}`
                      : ''}
                  </span>

                  {notice.noticeUrl && (
                    <a
                      href={notice.noticeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 whitespace-nowrap"
                    >
                      View full notice
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section
        aria-label="Official observatory news sources"
        className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3"
      >
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Rss className="w-4 h-4 text-violet-400" />
          Official External News &amp; Dispatch Portals
        </h2>

        <p className="text-xs text-slate-400">
          The live feed above contains USGS observatory notices. These
          additional official portals provide broader activity reports and
          aviation advisories.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {sources.map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-violet-500/40 transition group block"
            >
              <div className="flex items-center justify-between text-violet-400 font-semibold mb-1">
                <span>{source.name}</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-slate-400 text-[11px]">
                {source.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      <p className="text-[11px] leading-relaxed text-slate-500">
        Source: U.S. Geological Survey Volcano Notification Service (HANS).
        Notices and alert levels are provided by USGS observatories. Consult
        the original notice for official details.
      </p>

      <button
        type="button"
        onClick={() => onNavigate('home')}
        className="text-xs text-slate-500 hover:text-slate-300 transition"
      >
        ← Return to Home
      </button>
    </div>
  );
};
