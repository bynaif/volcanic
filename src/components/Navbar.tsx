import React from 'react';
import {
  Flame,
  Globe2,
  AlertTriangle,
  Radio,
  LayoutGrid,
  Search,
  FileText,
  ShieldAlert,
  Building2,
  HeartHandshake,
  Settings,
  HelpCircle,
  Activity,
} from 'lucide-react';
import { AppRoute, MainRoute, MoreSubRoute } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

interface NavItem {
  id: MainRoute;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Flame },
  { id: 'map', label: 'Live Map', icon: Globe2 },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'news', label: 'News', icon: Radio },
  { id: 'more', label: 'More', icon: LayoutGrid },
];

const MORE_SUB_ITEMS: { id: MoreSubRoute; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'search', label: 'Volcano Search', icon: Search },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'safety', label: 'Travel Safety', icon: ShieldAlert },
  { id: 'shelters', label: 'Shelters', icon: Building2 },
  { id: 'donations', label: 'Donations', icon: HeartHandshake },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const isMoreActive = currentRoute === 'more' || currentRoute.startsWith('more/');

  return (
    <>
      {/* ======================================================== */}
      {/* DESKTOP SIDEBAR (Visible on md: and above)               */}
      {/* ======================================================== */}
      <aside
        aria-label="Desktop sidebar navigation"
        className="hidden md:flex flex-col w-64 shrink-0 bg-[#070914] border-r border-slate-800/80 min-h-screen sticky top-0 h-screen overflow-y-auto"
      >
        {/* Brand header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/25 to-violet-600/35 border border-cyan-400/30 text-cyan-400 shadow-lg shadow-cyan-950/40">
              <Flame className="w-5 h-5 text-cyan-400" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-wider text-white font-mono">
                  VOLCANIC
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Volcano Monitoring PWA</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="px-3 pb-2 text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Navigation
            </div>
            <nav className="space-y-1">
              {MAIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === 'more' ? currentRoute === 'more' : currentRoute === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/15 to-violet-500/15 text-cyan-300 border border-cyan-400/30 shadow-md shadow-cyan-950/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* More Services Direct Links */}
          <div>
            <div className="px-3 pb-2 text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center justify-between">
              <span>Extended Modules</span>
              <span className="text-[10px] text-slate-400">7 Pages</span>
            </div>
            <div className="space-y-1">
              {MORE_SUB_ITEMS.map((sub) => {
                const SubIcon = sub.icon;
                const subRoute = `more/${sub.id}` as AppRoute;
                const isSubActive = currentRoute === subRoute;

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => onNavigate(subRoute)}
                    aria-current={isSubActive ? 'page' : undefined}
                    className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      isSubActive
                        ? 'bg-gradient-to-r from-violet-500/15 to-cyan-500/15 text-violet-300 border border-violet-400/30 shadow-sm shadow-violet-950/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    <SubIcon
                      className={`w-3.5 h-3.5 transition-colors ${
                        isSubActive ? 'text-violet-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Install button & Status indicator */}
        <div className="p-4 border-t border-slate-800/80 bg-[#050711] space-y-3">
          <PWAInstallButton variant="card" />

          <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300">USGS Stream</span>
            </div>
            <span className="text-emerald-400 font-mono">Live</span>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION (Visible below md)              */}
      {/* ======================================================== */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070914]/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.id === 'more' ? isMoreActive : currentRoute === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isActive ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Active glow pip */}
                {isActive && (
                  <span className="absolute -top-1 w-6 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm shadow-cyan-400"></span>
                )}
                <div
                  className={`p-1 rounded-lg transition-transform duration-200 ${
                    isActive ? 'scale-110 text-cyan-400' : 'text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
