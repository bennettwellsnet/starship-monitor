interface Props {
  lastUpdated: string;
  dataSource: string;
  onRefresh: () => void;
  loading?: boolean;
}

export function ShareBar({ lastUpdated, dataSource, onRefresh, loading }: Props) {
  const url = 'https://bennettwells.net/starship/';
  const text = 'Starship Progress Monitor — live SpaceX Starship flight tracker';

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Starship Progress Monitor', text, url });
      return;
    }
    await navigator.clipboard.writeText(url);
  };

  const updated = new Date(lastUpdated).toLocaleString();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-3 text-slate-400">
        <span>
          Updated: <time dateTime={lastUpdated}>{updated}</time>
        </span>
        <span className="hidden sm:inline">·</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs capitalize">
          {dataSource === 'spacex-api' ? 'SpaceX API' : 'Curated fallback'}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
        <button
          type="button"
          onClick={share}
          className="rounded-lg bg-starship px-3 py-1.5 font-medium text-white transition hover:bg-starship-dim"
        >
          Share
        </button>
      </div>
    </div>
  );
}