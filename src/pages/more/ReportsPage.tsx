
import React, { useCallback, useEffect, useState } from 'react';
import {
  FileText,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Clock3,
} from 'lucide-react';
import { AppRoute } from '../../types';

interface ReportsPageProps {
  onNavigate: (route: AppRoute) => void;
}

interface USGSNoticeSection {
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
  noticeId?: string;
  noticeUrl?: string;
  obsAlertLevel?: string;
  obsColorCode?: string;
  noticeSections?: USGSNoticeSection[];
}

const FEED_URL = 'https://volcanoes.usgs.gov/vsc/api/hansApi/newest';

function formatDate(value?: string) {
  if (!value) return 'Date unavailable';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  onNavigate,
}) => {
  const [notices, setNotices] = useState<USGSNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadReports = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    if (notices.length === 0) setLoading(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(FEED_URL, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`USGS returned HTTP ${response.status}`);
      }

      const payload: unknown = await response.json();

      if (!Array.isArray(payload)) {
        throw new Error('Unexpected response from the USGS feed.');
      }

      const valid = (payload as USGSNotice[])
        .filter(
          (item) =>
            item &&
            typeof item === 'object' &&
            (item.noticeTitle || item.noticeUrl),
        )
        .sort((a, b) =>
          (b.sentUtc || '').localeCompare(a.sentUtc || ''),
        );

      setNotices(valid);
      setLastUpdated(new Date());
      setError(
        valid.length === 0
          ? 'The feed responded successfully, but no notices were returned.'
          : null,
      );
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name === 'AbortError'
          ? 'The USGS feed timed out. Try again.'
          : cause instanceof Error
            ? `Unable to load reports: ${cause.message}`
            : 'Unable to load reports.',
      );
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
      setRefreshing(false);
    }
  }, [notices.length]);

  useEffect(() => {
    void loadReports();

    const interval = window.setInterval(
      () => void loadReports(true),
      5 * 60 * 1000,
    );

    return () => window.clearInterval(interval);
  }, [loadReports]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('more')}
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-[var(--accent)] font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to More
        </button>

        <span className="text-xs font-mono text-[var(--accent)]">
          USGS · HANS
        </span>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text)] font-mono">
          Geological Reports & Notices
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Official USGS Volcano Notification Service notices. These are
          published advisories, not a complete global sensor feed.
        </p>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[var(--text-muted)]">
            <p>Source: U.S. Geological Survey</p>
            <p className="mt-1">
              Last checked: {lastUpdated
                ? formatDate(lastUpdated.toISOString())
                : 'Not checked yet'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadReports(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-800 bg-cyan-950/50 px-3 py-2 text-xs text-[var(--accent-hover)] disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
            />
            {refreshing ? 'Refreshing…' : 'Refresh reports'}
          </button>
        </div>
      </section>

      {error && (
        <div
          role="status"
          className="rounded-xl border border-amber-700/40 bg-amber-950/20 p-4 text-sm text-amber-200"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p>{error}</p>
              {notices.length > 0 && (
                <p className="mt-1 text-xs text-amber-100/70">
                  Previously loaded notices remain visible; they may be stale.
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => void loadReports(true)}
            className="mt-3 underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {loading && notices.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-slate-300">
          Loading official USGS notices…
        </div>
      ) : notices.length === 0 ? (
        !error && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-[var(--text-muted)]">
            No notices are currently available from this feed.
          </div>
        )
      ) : (
        <div className="space-y-3">
          {notices.map((notice, index) => {
            const sections = notice.noticeSections || [];

            return (
              <article
                key={notice.noticeId || notice.noticeUrl || `${notice.noticeTitle}-${index}`}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-semibold leading-6 text-[var(--text)]">
                    {notice.noticeTitle || 'USGS Volcano Notice'}
                  </h2>
                  <span className="shrink-0 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] text-slate-300">
                    Official notice
                  </span>
                </div>

                <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <Clock3 className="h-3.5 w-3.5" />
                  Published: {formatDate(notice.sentUtc)}
                </p>

                {notice.obsAlertLevel && (
                  <p className="mt-3 text-xs text-amber-300">
                    Alert level: {notice.obsAlertLevel}
                    {notice.obsColorCode
                      ? ` · Aviation color: ${notice.obsColorCode}`
                      : ''}
                  </p>
                )}

                {sections.map((section, sectionIndex) => (
                  <div
                    key={`${section.vName || 'volcano'}-${sectionIndex}`}
                    className="mt-4 border-t border-slate-800 pt-3"
                  >
                    <p className="text-xs font-semibold text-[var(--accent-hover)]">
                      {section.vName || 'Volcano update'}
                      {section.region ? ` · ${section.region}` : ''}
                    </p>

                    {section.alertLevel && (
                      <p className="mt-1 text-xs text-amber-300">
                        Alert level: {section.alertLevel}
                        {section.colorCode
                          ? ` · Aviation color: ${section.colorCode}`
                          : ''}
                      </p>
                    )}

                    {section.synopsis && (
                      <p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-300">
                        {section.synopsis}
                      </p>
                    )}

                    {section.vUrl && (
                      <a
                        href={section.vUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:text-[var(--accent-hover)]"
                      >
                        Volcano details
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ))}

                {notice.noticeUrl && (
                  <a
                    href={notice.noticeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-cyan-800/70 px-3 py-2 text-xs font-medium text-[var(--accent-hover)] hover:bg-cyan-950/40"
                  >
                    Read original USGS notice
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </article>
            );
          })}
        </div>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
          <FileText className="h-4 w-4 text-[var(--accent)]" />
          More official reporting sources
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <a
            href="https://volcano.si.edu/reports_weekly.cfm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            Smithsonian GVP weekly reports
          </a>
          <a
            href="https://www.usgs.gov/programs/VHP/volcano-activity-notices"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            USGS activity notices
          </a>
        </div>
      </section>
    </div>
  );
};
