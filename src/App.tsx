/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppRoute, MainRoute } from './types';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { OfflineIndicator } from './components/OfflineIndicator';

// Lazy-loaded pages reduce the initial JavaScript bundle.
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const LiveMapPage = lazy(() => import('./pages/LiveMapPage').then(m => ({ default: m.LiveMapPage })));
const AlertsPage = lazy(() => import('./pages/AlertsPage').then(m => ({ default: m.AlertsPage })));
const NewsPage = lazy(() => import('./pages/NewsPage').then(m => ({ default: m.NewsPage })));
const MorePage = lazy(() => import('./pages/MorePage').then(m => ({ default: m.MorePage })));

const VolcanoSearchPage = lazy(() => import('./pages/more/VolcanoSearchPage').then(m => ({ default: m.VolcanoSearchPage })));
const ReportsPage = lazy(() => import('./pages/more/ReportsPage').then(m => ({ default: m.ReportsPage })));
const TravelSafetyPage = lazy(() => import('./pages/more/TravelSafetyPage').then(m => ({ default: m.TravelSafetyPage })));
const SheltersPage = lazy(() => import('./pages/more/SheltersPage').then(m => ({ default: m.SheltersPage })));
const DonationsPage = lazy(() => import('./pages/more/DonationsPage').then(m => ({ default: m.DonationsPage })));
const SettingsPage = lazy(() => import('./pages/more/SettingsPage').then(m => ({ default: m.SettingsPage })));
const HelpPage = lazy(() => import('./pages/more/HelpPage').then(m => ({ default: m.HelpPage })));
const VolcanoDetailPage = lazy(() => import('./pages/VolcanoDetailPage').then(m => ({ default: m.VolcanoDetailPage })));

import { WELL_KNOWN_VOLCANOES } from './data/volcanoes';

function parseHashToRoute(): AppRoute {
  const hash = window.location.hash.replace(/^#\/?/, '').trim();

  if (hash.startsWith('volcano/')) {
    return hash as AppRoute;
  }

  const validRoutes: AppRoute[] = [
    'home',
    'map',
    'alerts',
    'news',
    'more',
    'more/search',
    'more/reports',
    'more/safety',
    'more/shelters',
    'more/donations',
    'more/settings',
    'more/help',
  ];

  if (validRoutes.includes(hash as AppRoute)) {
    return hash as AppRoute;
  }
  return 'home';
}

const STATIC_PAGE_TITLES: Record<string, string> = {
  home: 'VOLCANIC — Home',
  map: 'Live Map',
  alerts: 'Hazard Alerts',
  news: 'News & Dispatches',
  more: 'More Services',
  'more/search': 'Volcano Explorer',
  'more/reports': 'Geological Reports',
  'more/safety': 'Travel Safety',
  'more/shelters': 'Emergency Shelters',
  'more/donations': 'Relief Donations',
  'more/settings': 'Settings',
  'more/help': 'Help & Reference',
};

function getPageTitle(route: AppRoute): string {
  if (route.startsWith('volcano/')) {
    const id = route.replace(/^volcano\//, '');
    const found = WELL_KNOWN_VOLCANOES.find((v) => v.id === id);
    return found ? `${found.name} — Summit Details` : 'Volcano Details';
  }
  return STATIC_PAGE_TITLES[route] || 'VOLCANIC';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(parseHashToRoute);
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>(() => {
    try {
      const saved = localStorage.getItem('volcanic_settings');
      const parsed = saved ? JSON.parse(saved) : {};
      return parsed.theme === 'light' || parsed.theme === 'dark' || parsed.theme === 'system'
        ? parsed.theme
        : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const applyTheme = () => {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const resolvedTheme = themePreference === 'system'
        ? (systemDark ? 'dark' : 'light')
        : themePreference;

      document.documentElement.dataset.theme = resolvedTheme;
      document.documentElement.style.colorScheme = resolvedTheme;
    };

    applyTheme();

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [themePreference]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('volcanic_settings');
      const parsed = saved ? JSON.parse(saved) : {};
      localStorage.setItem('volcanic_settings', JSON.stringify({
        ...parsed,
        theme: themePreference,
      }));
    } catch {
      // Keep the app usable when browser storage is unavailable.
    }
  }, [themePreference]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(parseHashToRoute());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: AppRoute) => {
    window.location.hash = `#${route}`;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    if (currentRoute.startsWith('volcano/')) {
      const volcanoId = currentRoute.replace(/^volcano\//, '');
      return <VolcanoDetailPage volcanoId={volcanoId} onNavigate={navigateTo} />;
    }

    switch (currentRoute) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'map':
        return <LiveMapPage onNavigate={navigateTo} />;
      case 'alerts':
        return <AlertsPage onNavigate={navigateTo} />;
      case 'news':
        return <NewsPage onNavigate={navigateTo} />;
      case 'more':
        return <MorePage onNavigate={navigateTo} />;
      case 'more/search':
        return <VolcanoSearchPage onNavigate={navigateTo} />;
      case 'more/reports':
        return <ReportsPage onNavigate={navigateTo} />;
      case 'more/safety':
        return <TravelSafetyPage onNavigate={navigateTo} />;
      case 'more/shelters':
        return <SheltersPage onNavigate={navigateTo} />;
      case 'more/donations':
        return <DonationsPage onNavigate={navigateTo} />;
      case 'more/settings':
        return <SettingsPage onNavigate={navigateTo} themePreference={themePreference} onThemeChange={setThemePreference} />;
      case 'more/help':
        return <HelpPage onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="theme-page min-h-screen flex flex-col md:flex-row font-sans">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-slate-950 focus:rounded-lg focus:font-bold focus:shadow-xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Navigation (Sidebar on desktop, bottom navigation on mobile) */}
      <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          title={getPageTitle(currentRoute)}
        />

        {/* Page Content with smooth transition */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 outline-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoute}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <Suspense
                fallback={
                  <div className="flex min-h-[40vh] items-center justify-center text-cyan-300">
                    Loading...
                  </div>
                }
              >
                {renderActivePage()}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Offline Status Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}
