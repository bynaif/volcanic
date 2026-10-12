import React, { useState } from 'react';
import {
  HeartHandshake,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { AppRoute } from '../../types';
import { EmptyState } from '../../components/EmptyState';

interface DonationsPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const DonationsPage: React.FC<DonationsPageProps> = ({ onNavigate }) => {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('more')}
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to More</span>
        </button>
        <span className="text-xs font-mono text-amber-400">Gateway Offline</span>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono">
          Disaster Relief & Research Funds
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Direct links to verified international humanitarian disaster relief organizations.
        </p>
      </div>

      {notice && (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <span>{notice}</span>
          <button
            onClick={() => setNotice(null)}
            className="text-slate-400 hover:text-white px-2 py-0.5 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Honest Empty State */}
      <EmptyState
        icon={HeartHandshake}
        badge="Payment Gateways Not Connected"
        title="Donation Processing Not Connected Yet"
        description="This application does not process payments or collect donations directly. To support communities affected by geological hazards, donate directly through verified international humanitarian relief organizations below."
        actionText="Check Connection"
        onAction={() => setNotice('Payment processing gateways are not connected.')}
        secondaryActionText="Return to More"
        onSecondaryAction={() => onNavigate('more')}
      />

      {/* Real Verified Organizations Links */}
      <section aria-label="Verified humanitarian relief organizations" className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <span>Verified International Relief Organizations</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <a
            href="https://www.ifrc.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-rose-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-rose-400 font-semibold mb-1">
              <span>IFRC</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              International Federation of Red Cross and Red Crescent Societies
            </p>
          </a>

          <a
            href="https://www.msf.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-rose-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-rose-400 font-semibold mb-1">
              <span>Doctors Without Borders</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Médecins Sans Frontières emergency medical response teams
            </p>
          </a>

          <a
            href="https://www.unicef.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-rose-500/40 transition group block"
          >
            <div className="flex items-center justify-between text-rose-400 font-semibold mb-1">
              <span>UNICEF</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Emergency disaster humanitarian relief for children and families
            </p>
          </a>
        </div>
      </section>
    </div>
  );
};
