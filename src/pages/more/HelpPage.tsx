import React from 'react';
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Flame,
  Map,
  MapPin,
  ShieldAlert,
  Smartphone,
  Waves,
  CloudSun,
  HeartHandshake,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { AppRoute } from '../../types';

interface HelpPageProps {
  onNavigate: (route: AppRoute) => void;
}

const references = [
  {
    title: 'Smithsonian Global Volcanism Program',
    description:
      'Volcano profiles, eruptive histories, and weekly reports for historical context.',
    url: 'https://volcano.si.edu/',
    icon: Flame,
  },
  {
    title: 'USGS Volcano Hazards Program',
    description:
      'Volcano notices, hazard information, and scientific monitoring resources.',
    url: 'https://www.usgs.gov/programs/VHP',
    icon: ShieldAlert,
  },
  {
    title: 'USGS Earthquake Catalog',
    description:
      'Earthquake event information, magnitudes, locations, and event details.',
    url: 'https://earthquake.usgs.gov/earthquakes/',
    icon: Waves,
  },
  {
    title: 'Open-Meteo',
    description:
      'Weather forecast data. Forecasts are not volcanic ash or eruption predictions.',
    url: 'https://open-meteo.com/',
    icon: CloudSun,
  },
];

const faqs = [
  {
    question: 'Are earthquake alerts the same as volcano alerts?',
    answer:
      'No. Earthquake events come from the USGS earthquake feed. Volcano alerts are issued by responsible volcano observatories. An earthquake magnitude alone does not establish a volcanic eruption, local damage, or personal risk.',
  },
  {
    question: 'How current is the information?',
    answer:
      'Feeds refresh on their configured schedules and may be delayed, revised, or temporarily unavailable. Check the source and last-updated information shown on the relevant page. Open the original notice for the latest official assessment.',
  },
  {
    question: 'Does VOLCANIC predict eruptions?',
    answer:
      'VOLCANIC does not guarantee eruption dates or outcomes. Use official observatory assessments and published hazard guidance. Historical activity and general forecasts should not be treated as a definitive prediction.',
  },
  {
    question: 'Why is my location not showing?',
    answer:
      'Your browser may have denied location permission, the device may not have a reliable location fix, or the request may have timed out. Check browser location permissions, enable device location services, and try again. You can still explore volcanoes without sharing your location.',
  },
  {
    question: 'Can I install VOLCANIC on my phone?',
    answer:
      'VOLCANIC is built as a progressive web app. Where supported, use your browser’s Add to Home Screen or Install option. Availability and installation steps vary by browser and device.',
  },
  {
    question: 'Does the app contact emergency services?',
    answer:
      'No. VOLCANIC does not dispatch emergency responders, provide live emergency chat, or guarantee that an evacuation route or shelter is safe. Contact local emergency services and follow official instructions during an emergency.',
  },
];

export const HelpPage: React.FC<HelpPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <button
        type="button"
        onClick={() => onNavigate('more')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 transition hover:text-[var(--accent)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to More
      </button>

      <header className="space-y-2">
        <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
          <BookOpen className="h-4 w-4" />
          USER GUIDE & REFERENCES
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[var(--text)] md:text-2xl">
          Help & Safety Guide
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-400">
          Learn how to use VOLCANIC, understand its data, and find authoritative
          information when conditions change.
        </p>
      </header>

      <section className="rounded-2xl border border-rose-800/40 bg-rose-950/20 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div className="space-y-1.5">
            <h2 className="text-sm font-semibold text-rose-300">
              In an emergency
            </h2>
            <p className="text-xs leading-5 text-slate-300">
              Follow instructions from local authorities and the responsible
              volcano observatory. Move away from designated hazard zones when
              instructed. Do not rely on this app alone to decide whether a
              location, road, or shelter is safe. VOLCANIC is not an emergency
              dispatch service.
            </p>
            <a
              href="https://www.usgs.gov/programs/VHP/volcano-safety"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 pt-1 text-xs font-medium text-rose-300 hover:underline"
            >
              Read USGS volcano safety guidance
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>

      <section
        aria-label="How to use VOLCANIC"
        className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5"
      >
        <h2 className="text-sm font-semibold text-[var(--text)]">How to use the app</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
            <Map className="h-4 w-4 shrink-0 text-cyan-400" />
            <div>
              <h3 className="text-xs font-semibold text-slate-200">Live Map</h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Explore mapped volcanoes and earthquake information. Map markers
                are not, by themselves, evacuation boundaries or hazard zones.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('map')}
                className="mt-2 text-xs text-[var(--accent)] hover:underline"
              >
                Open map →
              </button>
            </div>
          </div>

          <div className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
            <MapPin className="h-4 w-4 shrink-0 text-violet-400" />
            <div>
              <h3 className="text-xs font-semibold text-slate-200">
                Volcano Explorer
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Search volcano profiles and review historical activity. Check
                official notices for current conditions.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('more/search')}
                className="mt-2 text-xs text-[var(--accent)] hover:underline"
              >
                Search volcanoes →
              </button>
            </div>
          </div>

          <div className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
            <div>
              <h3 className="text-xs font-semibold text-slate-200">Alerts</h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Review earthquake events in the loaded USGS feed. These are not
                a substitute for official volcanic warnings.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('alerts')}
                className="mt-2 text-xs text-[var(--accent)] hover:underline"
              >
                View alerts →
              </button>
            </div>
          </div>

          <div className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
            <RefreshCw className="h-4 w-4 shrink-0 text-emerald-400" />
            <div>
              <h3 className="text-xs font-semibold text-slate-200">
                Reports & News
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Check source links and timestamps. If a feed fails, revisit the
                official source rather than assuming conditions are unchanged.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('news')}
                className="mt-2 text-xs text-[var(--accent)] hover:underline"
              >
                Read news →
              </button>
            </div>
          </div>

          <div className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 sm:col-span-2">
            <Smartphone className="h-4 w-4 shrink-0 text-blue-400" />
            <div>
              <h3 className="text-xs font-semibold text-slate-200">
                Install on your device
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Open your browser menu and look for Install App or Add to Home
                Screen. If the option is unavailable, check browser support and
                ensure the site is loaded over HTTPS.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Official data sources"
        className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5"
      >
        <h2 className="text-sm font-semibold text-[var(--text)]">
          Official data & scientific references
        </h2>
        <p className="text-xs leading-5 text-slate-400">
          Use these sources to verify current notices and understand the
          underlying information. Data availability, coverage, and update
          schedules differ between providers.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {references.map((reference) => {
            const Icon = reference.icon;

            return (
              <a
                key={reference.title}
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 transition hover:border-cyan-500/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-2.5">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                    <div>
                      <h3 className="text-xs font-semibold text-slate-200">
                        {reference.title}
                      </h3>
                      <p className="mt-1 text-[11px] leading-5 text-slate-400">
                        {reference.description}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500 transition group-hover:text-[var(--accent)]" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section
        aria-label="Frequently asked questions"
        className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5"
      >
        <h2 className="text-sm font-semibold text-[var(--text)]">
          Frequently asked questions
        </h2>

        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-xl border border-slate-800 bg-slate-950/50 p-3.5"
          >
            <summary className="cursor-pointer list-none text-xs font-semibold text-slate-200 marker:hidden">
              <span className="flex items-center justify-between gap-3">
                {faq.question}
                <span className="text-cyan-400 transition group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              {faq.answer}
            </p>
          </details>
        ))}
      </section>

      <p className="text-[11px] leading-5 text-slate-500">
        VOLCANIC is an informational tool, not a certified emergency warning
        system. Source information may be delayed, incomplete, or revised.
        Always prioritize current instructions from the relevant authorities.
      </p>
    </div>
  );
};
