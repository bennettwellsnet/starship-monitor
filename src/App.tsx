import { useState } from 'react';
import { HeroDashboard } from './components/HeroDashboard';
import { FlightTimeline } from './components/FlightTimeline';
import { MetricsCharts } from './components/MetricsCharts';
import { NewsFeed } from './components/NewsFeed';
import { ShareBar } from './components/ShareBar';
import { useStarshipData } from './hooks/useStarshipData';

const REFRESH_OPTIONS = [
  { label: '1 min', ms: 60_000 },
  { label: '5 min', ms: 300_000 },
  { label: '15 min', ms: 900_000 },
  { label: 'Off', ms: 0 },
];

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading">
      <div className="h-64 rounded-3xl bg-white/5" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-48 rounded-2xl bg-white/5" />
        <div className="h-48 rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}

export default function App() {
  const [refreshMs, setRefreshMs] = useState(300_000);
  const { data, loading, error, refresh } = useStarshipData({
    enabled: refreshMs > 0,
    intervalMs: refreshMs || 300_000,
  });

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <a
          href="https://bennettwells.net/"
          className="text-sm text-slate-500 transition hover:text-slate-300"
        >
          ← bennettwells.net
        </a>
        <label className="flex items-center gap-2 text-sm text-slate-500">
          Auto-refresh
          <select
            value={refreshMs}
            onChange={(e) => setRefreshMs(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-space-900 px-2 py-1 text-slate-300"
          >
            {REFRESH_OPTIONS.map((o) => (
              <option key={o.label} value={o.ms}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
        >
          {error} — showing cached/fallback data when available.
        </div>
      )}

      {loading && !data ? (
        <LoadingSkeleton />
      ) : data ? (
        <main className="space-y-10">
          <HeroDashboard data={data} />
          <ShareBar
            lastUpdated={data.lastUpdated}
            dataSource={data.dataSource}
            onRefresh={refresh}
            loading={loading}
          />
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <FlightTimeline flights={data.flights} />
            </div>
            <div className="lg:col-span-2">
              <NewsFeed items={data.news} />
            </div>
          </div>
          <MetricsCharts flights={data.flights} />
        </main>
      ) : null}

      <footer className="mt-16 border-t border-white/10 pt-6 text-center text-xs text-slate-600">
        <p>
          Not affiliated with SpaceX. Data from{' '}
          <a
            href="https://github.com/r-spacex/SpaceX-API"
            className="underline hover:text-slate-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            SpaceX API
          </a>{' '}
          with curated fallback. Built by{' '}
          <a href="https://bennettwells.net" className="underline hover:text-slate-400">
            Bennett Wells
          </a>
          .
        </p>
      </footer>
    </div>
  );
}