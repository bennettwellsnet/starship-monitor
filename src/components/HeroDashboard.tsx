import type { DashboardData } from '../types';
import { CountdownTimer } from './CountdownTimer';

interface Props {
  data: DashboardData;
}

export function HeroDashboard({ data }: Props) {
  const { metrics, nextLaunchDate } = data;
  const latest = [...data.flights]
    .filter((f) => f.outcome !== 'upcoming')
    .sort((a, b) => new Date(b.dateUtc).getTime() - new Date(a.dateUtc).getTime())[0];

  const statusLabel =
    latest?.outcome === 'success'
      ? 'Operational cadence'
      : latest?.outcome === 'partial'
        ? 'Progressing'
        : 'In development';

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-space-900/60 p-6 md:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-starship/20 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-starship/30 bg-starship/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-starship">
            <span className="h-2 w-2 animate-pulse rounded-full bg-starship" aria-hidden />
            Live monitor
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Starship
            <span className="block text-2xl font-medium text-slate-400 md:text-3xl">
              Progress Monitor
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-slate-400">
            Tracking integrated flight tests, booster catches, ship recovery milestones, and the
            road to rapid reusability at Starbase.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-lg bg-emerald-500/15 px-3 py-1 text-sm text-emerald-400">
              {statusLabel}
            </span>
            {latest && (
              <span className="rounded-lg bg-white/5 px-3 py-1 text-sm text-slate-300">
                Latest: {latest.name} — {latest.outcome}
              </span>
            )}
          </div>
        </div>
        <CountdownTimer
          targetDate={nextLaunchDate}
          label={`Flight ${metrics.nextFlightNumber}`}
        />
      </div>

      <div className="relative mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Completed flights', value: metrics.completedFlights },
          { label: 'Reached space', value: metrics.reachedSpace },
          { label: 'Success rate', value: `${metrics.successRate}%` },
          { label: `${new Date().getFullYear()} flights`, value: metrics.flights2026 },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-white/5 bg-black/30 px-4 py-4 text-left"
          >
            <div className="font-display text-2xl font-bold text-white md:text-3xl">{m.value}</div>
            <div className="mt-1 text-xs text-slate-500">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}