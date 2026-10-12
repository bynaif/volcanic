import React, { useState } from 'react';
import {
  HeartHandshake,
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  DollarSign,
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
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Disaster Relief & Research Funds
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Direct support for displaced communities, frontline emergency teams, and independent volcanological research observatories.
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

      {/* Empty State */}
      <EmptyState
        icon={HeartHandshake}
        badge="Donation Gateways Not Connected"
        title="Donation Channels Not Connected Yet"
        description="Verified humanitarian disaster relief fund gateways (such as International Red Cross, UNICEF volcanic disaster funds, and geological survey field equipment funds) are not connected in Phase 1."
        secondaryInfo="In Phase 2, verified non-profit organizations will be integrated with end-to-end transparent ledger tracking and zero intermediary commission."
        actionText="Probe Payment Gateway"
        onAction={() => setNotice('Donation Ingest Probe: No live payment processors or merchant IDs linked in Phase 1.')}
        secondaryActionText="Return to More Menu"
        onSecondaryAction={() => onNavigate('more')}
      />

      {/* Transparency Standards */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <h2 className="text-sm font-semibold text-white">
            VOLCANIC Verification Standards
          </h2>
        </div>
        <p className="text-slate-300 leading-relaxed">
          All emergency aid appeals displayed on VOLCANIC in Phase 2 must undergo rigorous compliance checks: verified 501(c)(3) or equivalent tax-exempt charity registration, audited disaster response deployment records, and 100% direct-to-aid allocations.
        </p>
      </div>
    </div>
  );
};
