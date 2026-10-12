import React from 'react';
import {
  Search,
  FileText,
  ShieldAlert,
  Building2,
  HeartHandshake,
  Settings,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Smartphone,
  Activity,
  Layers,
} from 'lucide-react';
import { AppRoute, MoreSubRoute } from '../types';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface MorePageProps {
  onNavigate: (route: AppRoute) => void;
}

interface MenuItem {
  id: MoreSubRoute;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badge?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'search',
    label: 'Volcano Search',
    description: 'Explore the global database of over 1,500 active Holocene volcanic edifices',
    icon: Search,
    accentColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  },
  {
    id: 'reports',
    label: 'Reports',
    description: 'Access official observatory field studies, bulletins, and sensor logs',
    icon: FileText,
    accentColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  },
  {
    id: 'safety',
    label: 'Travel Safety',
    description: 'Exclusion zones, volcanic ash inhalation guidelines, and escape protocols',
    icon: ShieldAlert,
    accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  {
    id: 'shelters',
    label: 'Shelters',
    description: 'Civil protection emergency shelter locations and evacuation staging points',
    icon: Building2,
    accentColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  {
    id: 'donations',
    label: 'Donations',
    description: 'Support verified disaster relief agencies and volcanology monitoring funds',
    icon: HeartHandshake,
    accentColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Configure notification alerts, metric units, and telemetry cache preferences',
    icon: Settings,
    accentColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  },
  {
    id: 'help',
    label: 'Help & Reference',
    description: 'Volcanic explosivity index (VEI) guide, terminology, and system FAQ',
    icon: HelpCircle,
    accentColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  },
];

export const MorePage: React.FC<MorePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>Extended Modules Directory</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-amber-400">Data Offline</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
          More Services & Tools
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-lg">
          Select any service below to open its dedicated view. In Phase 1, each view operates in baseline mode awaiting upstream data connection.
        </p>
      </div>

      {/* Navigation List */}
      <nav aria-label="Extended service modules" className="space-y-2.5">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(`more/${item.id}`)}
              className="group w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all duration-200 shadow-md shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${item.accentColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {item.label}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-3">
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          );
        })}
      </nav>

      {/* PWA Install Promotion Box */}
      <section aria-label="PWA install action">
        <PWAInstallButton variant="card" />
      </section>

      {/* Status Notice */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>All 7 sub-modules routed · Data pipelines standing by</span>
        </div>
        <span className="font-mono text-cyan-400">Phase 1.0</span>
      </div>
    </div>
  );
};
