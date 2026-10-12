import React from 'react';
import {
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Wind,
  Route,
  Radio,
  RefreshCw,
} from 'lucide-react';
import { AppRoute } from '../../types';

interface TravelSafetyPageProps {
  onNavigate: (route: AppRoute) => void;
}

const officialResources = [
  {
    title: 'USGS — Volcanic Ash',
    description:
      'Official information about volcanic ash, its impacts, and protective measures.',
    url: 'https://www.usgs.gov/programs/VHP/volcanic-ash',
    source: 'U.S. Geological Survey',
  },
  {
    title: 'IVHHN — Health Guidance',
    description:
      'Health information and guidance for communities exposed to volcanic emissions and ash.',
    url: 'https://www.ivhhn.org/',
    source: 'International Volcanic Health Hazard Network',
  },
  {
    title: 'American Red Cross — Volcanoes',
    description:
      'Preparedness, evacuation planning, and emergency supplies guidance.',
    url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/volcano.html',
    source: 'American Red Cross',
  },
  {
    title: 'Smithsonian Global Volcanism Program',
    description:
      'Volcano background information and weekly reports of volcanic activity.',
    url: 'https://volcano.si.edu/reports_weekly.cfm',
    source: 'Smithsonian Institution',
  },
  {
    title: 'USGS Volcano Activity Notices',
    description:
      'Official USGS volcano notices and activity updates for monitored U.S. volcanoes.',
    url: 'https://www.usgs.gov/programs/VHP/volcano-activity-notices',
    source: 'U.S. Geological Survey',
  },
];

const precautions = [
  {
    icon: Wind,
    title: 'If volcanic ash is falling',
    points: [
      'Follow instructions from local emergency authorities.',
      'If advised to shelter, remain indoors and close windows and doors.',
      'Avoid unnecessary driving; ash can reduce visibility and damage vehicles.',
      'Use a properly fitted particulate respirator if recommended by health authorities. Ordinary dust masks may offer limited protection.',
    ],
  },
  {
    icon: Route,
    title: 'Before travelling near a volcano',
    points: [
      'Check the relevant volcano observatory and local emergency-management advisories.',
      'Confirm road closures, evacuation orders, and access restrictions with local authorities.',
      'Keep essential medicines, drinking water, a charged phone, and emergency contacts available.',
      'Do not enter a closed area based on a map or an unofficial report.',
    ],
  },
  {
    icon: Radio,
    title: 'If an evacuation is ordered',
    points: [
      'Leave promptly using the route directed by local authorities.',
      'Do not approach river valleys or channels during possible lahars or heavy rain near volcanic terrain.',
      'Do not return until authorities say it is safe.',
      'If immediate danger exists, contact local emergency services.',
    ],
  },
];

export const TravelSafetyPage: React.FC<TravelSafetyPageProps> = ({
  onNavigate,
}) => {
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('more')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 transition hover:text-cyan-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to More
        </button>
        <span className="text-xs font-mono text-amber-400">
          Live hazard zones unavailable
        </span>
      </div>

      <header>
        <h1 className="font-mono text-xl font-bold tracking-tight text-white md:text-2xl">
          Travel Safety & Hazard Guidance
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Practical precautions and links to official volcanic hazard
          information. Always follow the latest instructions from local
          emergency authorities.
        </p>
      </header>

      <section
        role="status"
        className="rounded-2xl border border-amber-700/50 bg-amber-950/25 p-4 md:p-5"
      >
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <h2 className="text-sm font-semibold text-amber-200">
              Safety limitation — read before travelling
            </h2>
            <p className="mt-2 text-xs leading-5 text-amber-100/80">
              VOLCANIC does not currently receive live exclusion boundaries,
              local ash-sensor readings, verified shelter availability, or
              authoritative safe-route data. This page cannot determine
              whether a place or route is safe. Check current local official
              alerts and obey closures and evacuation orders before travelling.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-cyan-300" />
          <h2 className="text-sm font-semibold text-white">
            Travel safety checklist
          </h2>
        </div>
        <ul className="mt-4 space-y-3">
          {[
            'Check the latest notice from the volcano observatory responsible for your destination.',
            'Check local government emergency announcements and road closures.',
            'Prepare essential medicines, water, a charged phone, and emergency contacts.',
            'Identify an evacuation plan using instructions from local authorities.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-xs leading-5 text-slate-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-white">
            What to do in common situations
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            General precautions; local official instructions take priority.
          </p>
        </div>

        {precautions.map(({ icon: Icon, title, points }) => (
          <article
            key={title}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5"
          >
            <h3 className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
              <Icon className="h-4 w-4 shrink-0" />
              {title}
            </h3>
            <ul className="mt-3 space-y-2">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-xs leading-5 text-slate-300"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Official information sources
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            These links open external sources. Their content and update
            schedules are controlled by the publishing organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {officialResources.map((resource) => (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-cyan-700/70"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xs font-semibold leading-5 text-cyan-200">
                  {resource.title}
                </h3>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500 transition group-hover:text-cyan-300" />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {resource.description}
              </p>
              <p className="mt-3 text-[10px] text-slate-500">
                Source: {resource.source}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <h2 className="text-xs font-semibold text-slate-200">
              Data transparency
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              This page provides general guidance and external links; it is
              not a live hazard monitoring service or a substitute for
              emergency instructions. VOLCANIC does not generate eruption
              predictions or certify locations as safe.
            </p>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-700 hover:text-cyan-200"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Reload page
      </button>
    </div>
  );
};