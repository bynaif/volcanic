
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bell,
  Gauge,
  Activity,
  CheckCircle2,
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

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onNavigate,
}) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('volcanic_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [diagnosticsMessage, setDiagnosticsMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('volcanic_settings', JSON.stringify(settings));
    } catch {
      setSaveToast('Unable to save settings in this browser.');
    }
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaveToast(`Setting "${key}" updated.`);
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setDiagnosticsMessage(null);
    setSaveToast('Reset to default settings.');
  };

  const handleRunDiagnostics = () => {
    try {
      const stored = localStorage.getItem('volcanic_settings');

      if (stored === null) {
        setDiagnosticsMessage(
          'Browser storage is accessible, but no saved settings were found.',
        );
        return;
      }

      const parsed: unknown = JSON.parse(stored);

      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        !('unitSystem' in parsed)
      ) {
        setDiagnosticsMessage(
          'Browser storage is accessible, but the saved settings format appears invalid.',
        );
        return;
      }

      setDiagnosticsMessage(
        'Local storage check passed. Saved settings were read and parsed successfully. No upstream API connectivity was tested.',
      );
    } catch {
      setDiagnosticsMessage(
        'Local storage check failed. Browser storage may be blocked or the saved settings may be invalid.',
      );
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('more')}
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to More</span>
        </button>
        <span className="text-xs font-mono text-cyan-400">
          Local Settings
        </span>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Application Settings & Diagnostics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure saved preferences and inspect local settings storage.
          Push notifications and upstream telemetry are not connected.
        </p>
      </div>

      {saveToast && (
        <div
          role="status"
          className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-300 flex items-center justify-between"
        >
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

      <div className="space-y-4">
        <section className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Hazard Alert Notifications</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-slate-200">
                  Push Notifications
                </p>
                <span className="text-[10px] text-amber-400 font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  Coming soon
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Notifications are not delivered by VOLCANIC yet.
              </p>
            </div>
            <button
              type="button"
              disabled
              aria-label="Push notifications coming soon"
              className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-slate-800 opacity-60"
            >
              <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-slate-400 shadow-lg" />
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <label
              htmlFor="alert-threshold"
              className="text-xs font-medium text-slate-200"
            >
              Alert Severity Preference
            </label>
            <p className="text-[11px] text-slate-400">
              Saved for future notification support. This does not filter
              current alerts.
            </p>
            <select
              id="alert-threshold"
              value={settings.alertThreshold}
              onChange={(e) =>
                updateSetting(
                  'alertThreshold',
                  e.target.value as AppSettings['alertThreshold'],
                )
              }
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="all">All Alerts</option>
              <option value="advisory">Advisory & Above</option>
              <option value="warning">Watch & Warning</option>
              <option value="aviation-red">Aviation Red Only</option>
            </select>
          </div>
        </section>

        <section className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Gauge className="w-4 h-4 text-violet-400" />
            <span>Measurement Units</span>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-200">
              Unit System
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Saved preference. Other screens may still use their default units.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-pressed={settings.unitSystem === 'metric'}
              onClick={() => updateSetting('unitSystem', 'metric')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                settings.unitSystem === 'metric'
                  ? 'bg-violet-500/25 text-violet-300 border border-violet-400/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Metric (km, m)
            </button>
            <button
              type="button"
              aria-pressed={settings.unitSystem === 'imperial'}
              onClick={() => updateSetting('unitSystem', 'imperial')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                settings.unitSystem === 'imperial'
                  ? 'bg-violet-500/25 text-violet-300 border border-violet-400/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Imperial (mi, ft)
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <EmptyState
            icon={Activity}
            badge="Local Diagnostics"
            title="Browser Storage Check"
            description="Check whether saved settings can be read and parsed in this browser. This does not test a remote API or live telemetry."
            actionText="Run Storage Check"
            onAction={handleRunDiagnostics}
            secondaryActionText="Reset Settings"
            onSecondaryAction={handleResetDefaults}
          />

          {diagnosticsMessage && (
            <div
              role="status"
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300"
            >
              {diagnosticsMessage}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
