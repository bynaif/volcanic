import React, { useState } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, ExternalLink,
  Globe2, Radio, Search, Waves,
} from 'lucide-react';
import { AppRoute } from '../types';
import { formatDepthKm } from '../utils/units';
import { TelemetryStatusModal } from '../components/TelemetryStatusModal';
import {
  useEarthquakeData, getMagnitudeColor, getRelativeTime,
} from '../hooks/useEarthquakeData';
import { DataCardHeader } from '../components/DataCardHeader';
import { DataErrorState } from '../components/DataErrorState';
import { EarthquakeSkeleton } from '../components/EarthquakeSkeleton';
import { EarthquakeMagnitudeChart } from '../components/EarthquakeMagnitudeChart';

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const { data, loading, error, refetch, feedGenerated, fetchTime } = useEarthquakeData();
  const quakes = data?.features?.slice(0, 10) || [];

  const linkClass = 'group flex items-center justify-between gap-3 border-b border-[var(--border)] py-5 text-left transition hover:bg-[var(--surface-muted)]';
  const labelClass = 'text-[10px] font-bold uppercase tracking-[.2em] text-[#bc4a2b]';

  return (
    <main className="min-h-screen bg-[var(--page)] pb-24 text-[var(--text)] md:pb-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        <header className="flex items-center justify-between border-b border-[var(--border)] py-5">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3" aria-label="VOLCANIC home">
            <span className="grid h-9 w-9 place-items-center bg-[#d95735] text-white">
              <Activity size={20} />
            </span>
            <span className="text-xl font-black tracking-[-.07em]">VOLCANIC<span className="text-[#d95735]">.</span></span>
          </button>
          <div className="hidden text-right sm:block">
            <p className={labelClass}>Earth, in motion</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Understand our restless planet</p>
          </div>
          <button onClick={() => setShowDiagnostics(true)} className="border border-[var(--border)] px-3 py-2 text-xs font-semibold hover:border-[#d95735]">
            Data status
          </button>
        </header>

        <section className="grid gap-8 border-b border-[var(--border)] py-10 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-16">
          <div>
            <p className={labelClass}>A field guide to our planet</p>
            <h1 className="mt-5 text-6xl font-black leading-[.9] tracking-[-.085em] sm:text-8xl lg:text-[100px]">
              The Earth<br />is <span className="font-serif font-normal italic text-[#d95735]">alive.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[var(--text-muted)] sm:text-lg">
              Discover the forces shaping our world. Explore earthquakes,
              learn about volcanoes, and understand what scientists are observing —
              no science degree required.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => onNavigate('map')} className="flex items-center gap-3 bg-[var(--text)] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#d95735]">
                Explore the live map <ArrowRight size={16} />
              </button>
              <a href="#earthquakes" className="border border-[var(--border)] px-5 py-3.5 text-sm font-semibold hover:border-[var(--accent)]">
                Latest earthquakes ↓
              </a>
            </div>
          </div>

          <div className="relative flex min-h-[310px] items-end overflow-hidden bg-[#282e28] p-7 sm:min-h-[390px] sm:p-9">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-radial-gradient(ellipse at 55% 45%, transparent 0 15px, #c9c6ad 16px, transparent 17px 29px)' }} />
            <div className="absolute inset-x-0 bottom-0 h-[35%] bg-[#3b4438]" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <path d="M30 300 L190 95 L245 168 L285 125 L470 300 Z" fill="#d95735" />
              <path d="M190 95 L245 168 L216 155 Z" fill="#f0a078" />
              <path d="M0 325 Q130 280 250 328 T500 320" fill="none" stroke="#d0cfba" strokeOpacity=".45" />
              <path d="M0 350 Q130 305 250 353 T500 345" fill="none" stroke="#d0cfba" strokeOpacity=".35" />
              <path d="M0 375 Q130 330 250 378 T500 370" fill="none" stroke="#d0cfba" strokeOpacity=".25" />
            </svg>
            <div className="relative z-10 text-[#f7f5ef]">
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#d8d7c8]">Earth science / 001</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">A living planet.</h2>
              <p className="mt-2 max-w-xs text-sm leading-6 text-[#d0d0c5]">
                Beneath the surface, our planet is always changing.
              </p>
            </div>
          </div>
        </section>

        <section className="grid border-b border-[var(--border)] sm:grid-cols-3">
          {[
            ['01 / EARTHQUAKES', 'When the ground moves', 'Earthquakes happen when energy is released as rocks move along faults.'],
            ['02 / VOLCANOES', 'When the Earth erupts', 'Magma, gas, and pressure can produce eruptions and different hazards.'],
            ['03 / THE EVIDENCE', 'Understand the data', 'Scientific observations help us understand activity, but cannot predict every event.'],
          ].map(([eyebrow, title, description], i) => (
            <article key={eyebrow} className={`py-5 sm:pr-5 ${i > 0 ? 'border-t border-[var(--border)] sm:border-l sm:border-t-0 sm:pl-5' : ''}`}>
              <p className={labelClass}>{eyebrow}</p>
              <h2 className="mt-2 text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
            </article>
          ))}
        </section>

        <section id="earthquakes" className="scroll-mt-5 py-10 sm:py-14">
          <p className={labelClass}>The planet, right now</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-4xl font-black tracking-[-.065em] sm:text-5xl">Earthquake watch<span className="text-[#d95735]">.</span></h2>
            <button onClick={() => onNavigate('map')} className="flex items-center gap-2 pb-1 text-sm font-bold hover:text-[#d95735]">
              Explore map <ArrowRight size={15} />
            </button>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            Magnitude describes an earthquake’s size. Depth tells us how far
            below the surface it began. These are recorded events, not predictions.
          </p>

          <div className="mt-6 border-y border-[var(--border)]">
            <div className="py-3">
              <DataCardHeader title="Recent seismic events" source="USGS" feedTime={feedGenerated} fetchTime={fetchTime} count={data?.features?.length} onRefresh={refetch} isRefreshing={loading} error={error} />
            </div>
            {error ? (
              <div className="py-4"><DataErrorState error={error} onRetry={refetch} isRetrying={loading} /></div>
            ) : loading && !data ? (
              <div className="py-4"><EarthquakeSkeleton count={5} /></div>
            ) : quakes.length === 0 ? (
              <p className="py-10 text-center text-sm text-[var(--text-muted)]">No earthquakes are currently listed. Try refreshing shortly.</p>
            ) : (
              <>
                {quakes.map((quake, i) => {
                  const mag = quake.properties.mag;
                  const color = getMagnitudeColor(mag);
                  const depth = quake.geometry.coordinates[2];
                  return (
                    <article key={quake.id} className="grid grid-cols-[25px_52px_minmax(0,1fr)_34px] items-center gap-3 border-t border-[var(--border)] py-4 sm:grid-cols-[35px_62px_minmax(0,1fr)_38px] sm:gap-4">
                      <span className="font-mono text-xs text-[var(--text-muted)]">{String(i + 1).padStart(2, '0')}</span>
                      <span className={`flex h-11 items-center justify-center border text-sm font-black ${color.bg} ${color.text} ${color.border}`} aria-label={`Magnitude ${mag ?? 'unknown'}`}>
                        {mag !== null ? mag.toFixed(1) : '—'}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold sm:text-base">{quake.properties.place || 'Unknown location'}</h3>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
                          <span className="flex items-center gap-1"><Waves size={12} /> Depth: {depth !== undefined ? formatDepthKm(depth) : 'Unknown'}</span>
                          <span>{getRelativeTime(quake.properties.time)}</span>
                        </div>
                      </div>
                      <a href={quake.properties.url} target="_blank" rel="noopener noreferrer" aria-label={`View USGS details for ${quake.properties.place}`} className="grid h-9 w-9 place-items-center border border-[var(--border)] text-[#686a61] hover:border-[#d95735] hover:text-[#d95735]">
                        <ExternalLink size={15} />
                      </a>
                    </article>
                  );
                })}
                <div className="flex flex-wrap justify-between gap-2 border-t border-[var(--border)] py-4 text-xs text-[var(--text-muted)]">
                  <span>Showing the 10 most recent events in this feed.</span>
                  <button onClick={() => onNavigate('map')} className="font-bold text-[#bc4a2b]">View all events →</button>
                </div>
              </>
            )}
          </div>
        </section>

        {!error && quakes.length > 0 && (
          <section className="mb-10 border-y border-[var(--border)] py-7">
            <p className={labelClass}>Read the data</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">Earthquake magnitudes</h2>
            <p className="mb-5 mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              Magnitude is measured on a logarithmic scale: even a small numerical
              increase can mean a much larger earthquake.
            </p>
            <EarthquakeMagnitudeChart quakes={quakes} />
          </section>
        )}

        <section className="pb-8">
          <p className={labelClass}>Keep exploring</p>
          <h2 className="mt-2 text-4xl font-black tracking-[-.06em]">Go a little deeper<span className="text-[#d95735]">.</span></h2>
          <p className="mt-3 text-sm text-[var(--text-muted)]">Follow the data, read official updates, and discover volcanoes.</p>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Live map', desc: 'Explore earthquake locations around the world.', icon: Globe2, route: 'map' as AppRoute },
              { title: 'Earthquake alerts', desc: 'Browse the app’s magnitude-based alerts.', icon: AlertTriangle, route: 'alerts' as AppRoute },
              { title: 'News & bulletins', desc: 'Read volcano observatory notices and updates.', icon: Radio, route: 'news' as AppRoute },
              { title: 'Volcano catalog', desc: 'Discover volcanoes and scientific terminology.', icon: Search, route: 'more/search' as AppRoute },
            ].map(({ title, desc, icon: Icon, route }) => (
              <button key={title} onClick={() => onNavigate(route)} className={`${linkClass} sm:px-4`}>
                <span>
                  <Icon size={22} className="mb-4 text-[#d95735]" />
                  <span className="block font-bold">{title}</span>
                  <span className="mt-2 block pr-3 text-sm font-normal leading-6 text-[var(--text-muted)]">{desc}</span>
                </span>
                <ArrowRight size={16} className="shrink-0 transition group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-[var(--border)] py-5 text-xs leading-5 text-[var(--text-muted)] sm:flex-row sm:justify-between">
          <span>VOLCANIC — explore the science beneath our feet.</span>
          <span>Educational information, not an official emergency warning service.</span>
        </footer>
      </div>

      <TelemetryStatusModal isOpen={showDiagnostics} onClose={() => setShowDiagnostics(false)} />
    </main>
  );
};
