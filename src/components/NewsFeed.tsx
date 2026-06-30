import { format, parseISO } from 'date-fns';
import type { NewsItem } from '../types';

const TAG_STYLES: Record<NewsItem['tag'], string> = {
  flight: 'text-starship',
  milestone: 'text-emerald-400',
  infrastructure: 'text-sky-400',
  update: 'text-violet-400',
};

interface Props {
  items: NewsItem[];
}

export function NewsFeed({ items }: Props) {
  return (
    <section aria-labelledby="news-heading">
      <h2 id="news-heading" className="font-display text-2xl font-semibold text-white">
        Updates & news
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Official SpaceX links and community coverage
      </p>

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-starship/30 hover:bg-white/[0.06]"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`font-medium uppercase tracking-wider ${TAG_STYLES[item.tag]}`}>
                  {item.tag}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-500">{item.source}</span>
                <span className="text-slate-600">·</span>
                <time dateTime={item.date} className="text-slate-500">
                  {format(parseISO(item.date), 'MMM d, yyyy')}
                </time>
              </div>
              <span className="font-medium text-slate-200 group-hover:text-white">
                {item.title}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
        <h3 className="text-sm font-medium text-slate-400">Live stream</h3>
        <p className="mt-1 text-sm text-slate-500">
          Watch Starbase activity via NASASpaceflight when tests are active.
        </p>
        <a
          href="https://www.youtube.com/@NASASpaceflight"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600/20 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-600/30"
        >
          ▶ NASASpaceflight Live
        </a>
      </div>
    </section>
  );
}