import React from 'react';
import {
  Building2,
  ArrowLeft,
  ExternalLink,
  Home,
  AlertTriangle,
  Phone,
  MapPin,
  ClipboardCheck,
} from 'lucide-react';
import { AppRoute } from '../../types';

interface SheltersPageProps {
  onNavigate: (route: AppRoute) => void;
}

const resources = [
  {
    title: 'UN OCHA Humanitarian Data Exchange',
    description:
      'Explore humanitarian datasets. Individual datasets vary in coverage, freshness, and whether they list operational shelters.',
    url: 'https://data.humdata.org/',
    source: 'United Nations Office for the Coordination of Humanitarian Affairs',
  },
  {
    title: 'American Red Cross Open Shelters',
    description:
      'Check the Red Cross shelter locator for relevant U.S. disaster responses.',
    url: 'https://www.redcross.org/get-help/disaster-relief-and-recovery-services/find-an-open-shelter.html',
    source: 'American Red Cross',
  },
  {
    title: 'IFRC — National Red Cross and Red Crescent Societies',
    description:
      'Find the relevant national society for local disaster preparedness and response information.',
    url: 'https://www.ifrc.org/our-work/national-societies',
    source: 'International Federation of Red Cross and Red Crescent Societies',
  },
];

const verificationChecklist = [
  'Confirm the shelter is officially designated or recommended by local emergency authorities.',
  'Contact the operator or local emergency service to verify it is open and accepting people now.',
  'Ask about accessibility, children, essential medicines, pets, and other specific needs.',
  'Use evacuation routes and transport instructions issued by local authorities.',
];

export const SheltersPage: React.FC<SheltersPageProps> = ({
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
          Live directory unavailable
        </span>
      </div>

      <header>
        <h1 className="font-mono text-xl font-bold tracking-tight text-white md:text-2xl">
          Emergency Shelters & Relief Hubs
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Resources for finding emergency accommodation and checking local
          relief information during a volcanic event.
        </p>
      </header>

      <section
        role="status"
        className="rounded-2xl border border-amber-700/50 bg-amber-950/25 p-4 md:p-5"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <h2 className="text-sm font-semibold text-amber-200">
              Shelter availability is not verified by VOLCANIC
            </h2>
            <p className="mt-2 text-xs leading-5 text-amber-100/80">
              This application does not currently have a live shelter registry,
              occupancy data, operating status, or verified safe-route feed.
              External directories may be incomplete or out of date. Confirm
              availability with the shelter operator or local emergency
              authorities before travelling, unless authorities direct you
              to evacuate immediately.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-cyan-300" />
          <h2 className="text-sm font-semibold text-white">
            Before relying on a shelter listing
          </h2>
        </div>
        <ul className="mt-4 space-y-3">
          {verificationChecklist.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-xs leading-5 text-slate-300"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-cyan-300" />
          <h2 className="text-sm font-semibold text-white">
            Need emergency assistance?
          </h2>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Contact your local emergency services or civil protection authority
          for current evacuation instructions, designated shelters, and
          transport arrangements. Emergency numbers and shelter systems vary
          by country; use the official number for your location.
        </p>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Shelter and relief information sources
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            These are external resources, not a live list of nearby open
            shelters. Coverage depends on the organization and the emergency.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {resources.map((resource) => (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-cyan-700/70"
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
              <p className="mt-3 text-[10px] leading-4 text-slate-500">
                Source: {resource.source}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
          <div>
            <h2 className="text-xs font-semibold text-slate-200">
              About nearby shelter searches
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              A distance radius alone cannot identify an appropriate shelter.
              VOLCANIC will need a reliable location dataset, freshness
              information, and an authoritative way to verify operational
              status before it can display nearby shelters as available.
            </p>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <Home className="h-3.5 w-3.5" />
        No shelter locations or capacities are fabricated by this page.
      </div>
    </div>
  );
};