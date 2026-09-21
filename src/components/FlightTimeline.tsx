import { parseISO } from 'date-fns';
import type { FlightOutcome, StarshipFlight } from '../types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatUtc(iso: string) {
  const d = parseISO(iso);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} · ${hh}:${mm}`;
}

const OUTCOME_STYLES: Record<FlightOutcome, string> = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  partial: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
  failure: 'border-red-500/40 bg-red-500/10 text-red-400',
  upcoming: 'border-sky-500/40 bg-sky-500/10 text-sky-400',
  scrubbed: 'border-slate-500/40 bg-slate-500/10 text-slate-400',
};

interface Props {
  flights: StarshipFlight[];
}

export function FlightTimeline({ flights }: Props) {
  const sorted = [...flights].sort(
    (a, b) => new Date(b.dateUtc).getTime() - new Date(a.dateUtc).getTime(),
  );

  return (
    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="font-display text-2xl font-semibold text-white">
        Flight timeline
      </h2>
      <p className="mt-1 text-sm text-slate-500">Integrated flight tests & milestones</p>

      <ol className="relative mt-6 space-y-0 border-l border-white/10 pl-6">
        {sorted.map((flight, i) => (
          <li key={flight.id} className="relative pb-8 last:pb-0">
            <span
              className="absolute -left-[1.6rem] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-starship ring-4 ring-space-950"
              aria-hidden
            />
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {flight.name}
                    <span className="ml-2 text-sm font-normal text-slate-500">
                      #{flight.flightNumber}
                    </span>
                  </h3>
                  <time
                    dateTime={flight.dateUtc}
                    className="text-sm text-slate-500"
                  >
                    {formatUtc(flight.dateUtc)} UTC
                  </time>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${OUTCOME_STYLES[flight.outcome]}`}
                >
                  {flight.outcome}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{flight.summary}</p>
              {flight.milestones.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {flight.milestones.map((m) => (
                    <li
                      key={m}
                      className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-400"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-xs text-slate-600">{flight.site}</p>
            </div>
            {i === 0 && flight.outcome === 'upcoming' && (
              <span className="sr-only">Next upcoming flight</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}