import { useEffect, useState } from 'react';
import { intervalToDuration, isPast, parseISO } from 'date-fns';

interface Props {
  targetDate: string | null;
  label?: string;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function CountdownTimer({ targetDate, label = 'Flight 14' }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!targetDate) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-sm text-slate-400">Next launch TBD</p>
      </div>
    );
  }

  const target = parseISO(targetDate);
  if (isPast(target)) {
    return (
      <div className="rounded-2xl border border-starship/30 bg-starship/10 p-6 text-center">
        <p className="text-sm uppercase tracking-widest text-starship">Window active</p>
        <p className="mt-2 font-display text-2xl font-semibold">{label}</p>
        <p className="mt-1 text-sm text-slate-400">Target date passed — awaiting update</p>
      </div>
    );
  }

  const duration = intervalToDuration({ start: now, end: target.getTime() });
  const days = duration.days ?? 0;
  const hours = duration.hours ?? 0;
  const minutes = duration.minutes ?? 0;
  const seconds = duration.seconds ?? 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
      <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        Countdown to {label}
      </p>
      <div className="mt-4 grid grid-cols-4 gap-3 text-center" role="timer" aria-live="polite">
        {[
          { value: days, unit: 'Days' },
          { value: hours, unit: 'Hrs' },
          { value: minutes, unit: 'Min' },
          { value: seconds, unit: 'Sec' },
        ].map(({ value, unit }) => (
          <div key={unit} className="rounded-xl bg-space-900/80 px-2 py-3">
            <div className="font-display text-2xl font-bold tabular-nums text-white md:text-3xl">
              {pad(value)}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">{unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}