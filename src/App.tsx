/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppRoute, MainRoute } from './types';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { OfflineIndicator } from './components/OfflineIndicator';

// Pages
import { HomePage } from './pages/HomePage';
import { LiveMapPage } from './pages/LiveMapPage';
import { AlertsPage } from './pages/AlertsPage';
import { NewsPage } from './pages/NewsPage';
import { MorePage } from './pages/MorePage';

// More sub-pages
import { VolcanoSearchPage } from './pages/more/VolcanoSearchPage';
import { ReportsPage } from './pages/more/ReportsPage';
import { TravelSafetyPage } from './pages/more/TravelSafetyPage';
import { SheltersPage } from './pages/more/SheltersPage';
import { DonationsPage } from './pages/more/DonationsPage';
import { SettingsPage } from './pages/more/SettingsPage';
import { HelpPage } from './pages/more/HelpPage';

function parseHashToRoute(): AppRoute {
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
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

const PAGE_TITLES: Record<AppRoute, string> = {
  home: 'VOLCANIC — Home',
  map: 'Live Map',
  alerts: 'Hazard Alerts',
  news: 'News & Dispatches',
  more: 'More Services',
  'more/search': 'Volcano Search',
  'more/reports': 'Geological Reports',
  'more/safety': 'Travel Safety',
  'more/shelters': 'Emergency Shelters',
  'more/donations': 'Relief Donations',
  'more/settings': 'Settings',
  'more/help': 'Help & Reference',
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(parseHashToRoute);

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
        return <SettingsPage onNavigate={navigateTo} />;
      case 'more/help':
        return <HelpPage onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
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
          title={PAGE_TITLES[currentRoute]}
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
              {renderActivePage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Offline Status Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}
