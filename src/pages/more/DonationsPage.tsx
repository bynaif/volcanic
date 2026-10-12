import React from 'react';
import {
  HeartHandshake,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Globe,
  Stethoscope,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { AppRoute } from '../../types';

interface DonationsPageProps {
  onNavigate: (route: AppRoute) => void;
}

const organizations = [
  {
    name: 'IFRC',
    fullName: 'International Federation of Red Cross and Red Crescent Societies',
    description:
      'Humanitarian response and support through national Red Cross and Red Crescent societies.',
    url: 'https://www.ifrc.org/',
    icon: HeartHandshake,
    color: 'text-rose-400',
    border: 'hover:border-rose-500/40',
  },
  {
    name: 'Doctors Without Borders',
    fullName: 'Médecins Sans Frontières (MSF)',
    description:
      'Independent medical humanitarian assistance for people affected by crises.',
    url: 'https://www.msf.org/',
    icon: Stethoscope,
    color: 'text-cyan-400',
    border: 'hover:border-cyan-500/40',
  },
  {
    name: 'UNICEF',
    fullName: 'United Nations Children’s Fund',
    description:
      'Humanitarian assistance and protection for children and families in emergencies.',
    url: 'https://www.unicef.org/',
    icon: Users,
    color: 'text-blue-400',
    border: 'hover:border-blue-500/40',
  },
];

export const DonationsPage: React.FC<DonationsPageProps> = ({
  onNavigate,
}) => {
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <button
        type="button"
        onClick={() => onNavigate('more')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 transition hover:text-[var(--accent)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to More</span>
      </button>

      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
          <HeartHandshake className="h-4 w-4" />
          COMMUNITY SUPPORT
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[var(--text)] md:text-2xl">
          Support Communities
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-400">
          Help communities affected by volcanic eruptions and other disasters
          through established humanitarian organizations.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-amber-800/40 bg-amber-950/20 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div className="space-y-1.5">
            <h2 className="text-sm font-semibold text-amber-300">
              Donate directly and verify the appeal
            </h2>
            <p className="text-xs leading-5 text-slate-300">
              VOLCANIC does not collect donations or process payments. The
              organizations listed here are established humanitarian
              organizations, not confirmation of an active volcano-specific
              appeal. Visit their official websites to check current
              emergencies, eligible appeals, payment options, and how funds
              will be used.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-label="Humanitarian organizations"
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-[var(--text)]">
            Official organization websites
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {organizations.map((organization) => {
            const Icon = organization.icon;

            return (
              <article
                key={organization.name}
                className={`flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition ${organization.border}`}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70">
                  <Icon className={`h-5 w-5 ${organization.color}`} />
                </div>

                <h3 className="text-sm font-semibold text-[var(--text)]">
                  {organization.name}
                </h3>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  {organization.fullName}
                </p>
                <p className="mt-3 flex-1 text-xs leading-5 text-slate-400">
                  {organization.description}
                </p>

                <a
                  href={organization.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 inline-flex items-center gap-1.5 text-xs font-medium ${organization.color} hover:underline`}
                >
                  Visit official website
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Globe className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />
          <div>
            <h2 className="text-sm font-semibold text-[var(--text)]">
              Before you contribute
            </h2>
            <ul className="mt-2 space-y-2 text-xs leading-5 text-slate-400">
              <li>• Confirm the appeal on the organization’s official website.</li>
              <li>• Check whether the appeal supports the affected region or community.</li>
              <li>• Review how donations are allocated and whether fees apply.</li>
              <li>• Avoid unsolicited payment requests and unfamiliar fundraising links.</li>
            </ul>
          </div>
        </div>
      </section>

      <p className="text-[11px] leading-5 text-slate-500">
        VOLCANIC provides these links for informational purposes. It does not
        endorse a particular campaign, verify individual appeals, receive
        funds, or guarantee how a third-party organization will use a donation.
      </p>
    </div>
  );
};