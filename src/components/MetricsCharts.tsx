import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { StarshipFlight } from '../types';

const OUTCOME_COLORS: Record<string, string> = {
  success: '#34d399',
  partial: '#fbbf24',
  failure: '#f87171',
  upcoming: '#38bdf8',
  scrubbed: '#94a3b8',
};

interface Props {
  flights: StarshipFlight[];
}

export function MetricsCharts({ flights }: Props) {
  const completed = flights.filter((f) => f.outcome !== 'upcoming');

  const outcomeCounts = ['success', 'partial', 'failure'].map((outcome) => ({
    name: outcome,
    value: completed.filter((f) => f.outcome === outcome).length,
    fill: OUTCOME_COLORS[outcome],
  })).filter((d) => d.value > 0);

  const byYear = completed.reduce<Record<string, number>>((acc, f) => {
    const year = new Date(f.dateUtc).getFullYear().toString();
    acc[year] = (acc[year] ?? 0) + 1;
    return acc;
  }, {});

  const yearData = Object.entries(byYear)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, count]) => ({ year, flights: count }));

  return (
    <section aria-labelledby="charts-heading">
      <h2 id="charts-heading" className="font-display text-2xl font-semibold text-white">
        Analytics
      </h2>
      <p className="mt-1 text-sm text-slate-500">Success rate and flight cadence</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="mb-4 text-sm font-medium text-slate-400">Outcome breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={outcomeCounts}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {outcomeCounts.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#111827',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="mb-4 text-sm font-medium text-slate-400">Flights per year</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: '#111827',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="flights" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}