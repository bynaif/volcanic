import React, { useState } from 'react';
import {
  FileText,
  ArrowLeft,
  Filter,
  CheckCircle2,
  Clock,
  Shield,
  Send,
} from 'lucide-react';
import { AppRoute } from '../../types';
import { EmptyState } from '../../components/EmptyState';

interface ReportsPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
  const [tab, setTab] = useState<'observatory' | 'satellite' | 'field'>('observatory');
  const [notice, setNotice] = useState<string | null>(null);

  const handleTabChange = (t: 'observatory' | 'satellite' | 'field') => {
    setTab(t);
    setNotice(`Tab switched to "${t.toUpperCase()}": Report feeds are not connected yet.`);
  };

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
        <span className="text-xs font-mono text-amber-400">Reports Ingest Offline</span>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Geological Reports & Sensor Logs
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Official observatory situation reports, satellite overpass analysis, and ground sensor diagnostic records.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 self-start overflow-x-auto max-w-full">
        {[
          { id: 'observatory', label: 'Observatory Bulletins' },
          { id: 'satellite', label: 'Satellite Overpasses' },
          { id: 'field', label: 'Field Sensor Logs' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id as 'observatory' | 'satellite' | 'field')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              tab === item.id
                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
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
        icon={FileText}
        badge="Reports Ingest Inactive"
        title="No Geological Reports Connected Yet"
        description="The situation report parser will ingest daily and weekly technical bulletins from USGS, INGV Catania, SERNAGEOMIN, and CVGHM. These data pipelines will be activated in Phase 2."
        secondaryInfo="Supported Formats in Phase 2: PDF bulletin parsers, GeoTIFF satellite maps, and USGS CAP (Common Alerting Protocol) XML."
        actionText="Verify Ingest Status"
        onAction={() => setNotice('Pipeline Probe: No report webhooks active in Phase 1 baseline.')}
        secondaryActionText="Return to More Menu"
        onSecondaryAction={() => onNavigate('more')}
      />
    </div>
  );
};
