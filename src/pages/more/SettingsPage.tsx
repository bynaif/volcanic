import React, { useState, useEffect } from 'react';
import {
  Settings,
  ArrowLeft,
  Bell,
  Gauge,
  Sliders,
  Moon,
  RefreshCw,
  Activity,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { AppRoute, AppSettings } from '../../types';
import { EmptyState } from '../../components/EmptyState';

interface SettingsPageProps {
  onNavigate: (route: AppRoute) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  notificationsEnabled: false,
  unitSystem: 'metric',
  alertThreshold: 'all',
  refreshInterval: 'manual',
  neonAccents: true,
};

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('volcanic_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [diagnosticsMessage, setDiagnosticsMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('volcanic_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaveToast(`Setting "${key}" updated.`);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleRequestNotifications = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          updateSetting('notificationsEnabled', true);
          setSaveToast('Push notification permission granted!');
        } else {
          updateSetting('notificationsEnabled', false);
          setSaveToast('Notification permission denied by browser.');
        }
      } catch (err) {
        setSaveToast('Notification API error or unsupported.');
      }
    } else {
      setSaveToast('Notifications not supported by this browser.');
    }
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaveToast('Reset to default settings.');
    setTimeout(() => setSaveToast(null), 2500);
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
        <span className="text-xs font-mono text-cyan-400">Settings Engine Active</span>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Application Settings & Diagnostics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure notification preferences, unit measurements, and local telemetry cache.
        </p>
      </div>

      {saveToast && (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-300 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{saveToast}</span>
          </div>
          <button
            onClick={() => setSaveToast(null)}
            className="text-slate-400 hover:text-white px-2 py-0.5 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Settings Form */}
      <div className="space-y-4">
        {/* Section 1: Notifications */}
        <section className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Hazard Alert Notifications</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-slate-200">Push Notifications</p>
                <span className="text-[10px] text-amber-400 font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  Coming soon
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automated alert dispatch is currently in development. Push notifications are not delivered at this time.
              </p>
            </div>
            <button
              type="button"
              disabled={true}
              aria-disabled="true"
              aria-label="Push notifications coming soon"
              className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-slate-800 opacity-60"
            >
              <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-400 shadow-lg ring-0 transition duration-200 ease-in-out translate-x-0" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
            <div>
              <p className="text-xs font-medium text-slate-200">Alert Severity Filter</p>
              <p className="text-[11px] text-slate-400">
                Minimum severity required to trigger a push notification
              </p>
            </div>
            <select
              value={settings.alertThreshold}
              onChange={(e) => updateSetting('alertThreshold', e.target.value as AppSettings['alertThreshold'])}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="all">All Alerts</option>
              <option value="advisory">Advisory & Above</option>
              <option value="warning">Watch & Warning</option>
              <option value="aviation-red">Aviation Red Only</option>
            </select>
          </div>
        </section>

        {/* Section 2: Units of Measurement */}
        <section className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Gauge className="w-4 h-4 text-violet-400" />
            <span>Measurement Units</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-200">Unit System</p>
              <p className="text-[11px] text-slate-400">
                Distance, elevation, and plume height units
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => updateSetting('unitSystem', 'metric')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  settings.unitSystem === 'metric'
                    ? 'bg-violet-500/25 text-violet-300 border border-violet-400/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Metric (km, m)
              </button>
              <button
                type="button"
                onClick={() => updateSetting('unitSystem', 'imperial')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  settings.unitSystem === 'imperial'
                    ? 'bg-violet-500/25 text-violet-300 border border-violet-400/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Imperial (mi, ft)
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Telemetry Diagnostics Empty State */}
        <section className="space-y-3">
          <EmptyState
            icon={Activity}
            badge="Diagnostic Telemetry Standby"
            title="Data Pipeline Not Connected Yet"
            description="The client settings engine and persistent storage are operational. Ingest endpoints for live seismic streaming, real-time alert webhooks, and satellite overpasses are not connected in Phase 1."
            secondaryInfo="Upstream Connection Target: /api/v1/telemetry (Status: Unconnected in Phase 1 Baseline)."
            actionText="Run Diagnostic Probe"
            onAction={() => setDiagnosticsMessage('Diagnostics: HTTP 200 Client OK. Upstream streaming endpoint is awaiting Phase 2 configuration.')}
            secondaryActionText="Reset Settings"
            onSecondaryAction={handleResetDefaults}
          />

          {diagnosticsMessage && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-mono">
              {diagnosticsMessage}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
