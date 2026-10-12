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
        className="hidden md:flex flex-col w-64 shrink-0 theme-nav border-r theme-border min-h-screen sticky top-0 h-screen overflow-y-auto"
      >
        {/* Brand header */}
        <div className="p-5 border-b theme-border">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent-soft)] border border-[var(--border)] theme-accent shadow-lg shadow-black/5">
              <Flame className="w-5 h-5 theme-accent" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-wider theme-text font-mono">
                  VOLCANIC
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[var(--accent-soft)] theme-accent border border-[var(--border)]">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] theme-text-muted">Volcano Monitoring PWA</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="px-3 pb-2 text-[10px] uppercase font-mono tracking-wider theme-text-muted">
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
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      isActive
                        ? 'bg-[var(--accent-soft)] theme-accent border border-[var(--border)] shadow-md shadow-black/5'
                        : 'theme-text-muted hover:theme-text hover:theme-muted'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isActive ? 'theme-accent scale-110' : 'theme-text-muted'
                      }`}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-sm shadow-black/5 animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* More Services Direct Links */}
          <div>
            <div className="px-3 pb-2 text-[10px] uppercase font-mono tracking-wider theme-text-muted flex items-center justify-between">
              <span>Extended Modules</span>
              <span className="text-[10px] theme-text-muted">7 Pages</span>
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
                    className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      isSubActive
                        ? 'bg-[var(--accent-soft)] theme-accent border border-[var(--border)] shadow-sm shadow-black/5'
                        : 'theme-text-muted hover:theme-text hover:theme-muted'
                    }`}
                  >
                    <SubIcon
                      className={`w-3.5 h-3.5 transition-colors ${
                        isSubActive ? 'theme-accent' : 'theme-text-muted'
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
        <div className="p-4 border-t theme-border theme-nav space-y-3">
          <PWAInstallButton variant="card" />

          <div className="p-2.5 rounded-lg theme-muted border theme-border flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="theme-text-muted">USGS Stream</span>
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
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 theme-header backdrop-blur-xl border-t theme-border px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
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
                className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  isActive ? 'theme-accent' : 'theme-text-muted hover:theme-text'
                }`}
              >
                {/* Active glow pip */}
                {isActive && (
                  <span className="absolute -top-1 w-6 h-1 rounded-full bg-[var(--accent)] shadow-sm shadow-black/5"></span>
                )}
                <div
                  className={`p-1 rounded-lg transition-transform duration-200 ${
                    isActive ? 'scale-110 theme-accent' : 'theme-text-muted'
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
