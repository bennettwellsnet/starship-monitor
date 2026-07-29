import type { DashboardData, FlightOutcome, StarshipFlight } from '../types';
import { buildFallbackDashboard, FALLBACK_FLIGHTS } from './fallbackData';

const API_BASE = 'https://api.spacexdata.com/v4';
const ROCKET_NAME = 'Starship';

/** Documented SpaceX API endpoints used by this app. */
export const API_ENDPOINTS = {
  rockets: `${API_BASE}/rockets`,
  rocketById: (id: string) => `${API_BASE}/rockets/${id}`,
  launches: `${API_BASE}/launches`,
  launchesQuery: `${API_BASE}/launches/query`,
  upcoming: `${API_BASE}/launches/upcoming`,
  past: `${API_BASE}/launches/past`,
  latest: `${API_BASE}/launches/latest`,
  v5Launches: 'https://api.spacexdata.com/v5/launches',
} as const;

interface SpaceXLaunch {
  id: string;
  name: string;
  date_utc: string;
  date_unix: number;
  success: boolean | null;
  upcoming: boolean;
  details: string | null;
  launchpad: string;
  rocket: string;
}

interface SpaceXRocket {
  id: string;
  name: string;
  success_rate_pct: number;
  first_flight: string;
  description: string;
}

function mapOutcome(launch: SpaceXLaunch): FlightOutcome {
  if (launch.upcoming) return 'upcoming';
  if (launch.success === true) return 'success';
  if (launch.success === false) return 'failure';
  return 'partial';
}

function extractFlightNumber(name: string): number {
  const match = name.match(/(?:IFT|Flight|Starship)\s*-?\s*(\d+)/i);
  if (match) return parseInt(match[1], 10);
  const ift = name.match(/IFT-(\d+)/i);
  if (ift) return parseInt(ift[1], 10);
  return 0;
}

function mapLaunchToFlight(launch: SpaceXLaunch, index: number): StarshipFlight {
  const flightNumber = extractFlightNumber(launch.name) || index + 1;
  const outcome = mapOutcome(launch);
  return {
    id: launch.id,
    flightNumber,
    name: launch.name,
    dateUtc: launch.date_utc,
    site: 'Starbase, TX',
    outcome,
    summary: launch.details ?? 'SpaceX Starship integrated flight test.',
    milestones: [],
    reachedSpace: outcome !== 'failure' && outcome !== 'upcoming',
  };
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, { ...init, signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function findStarshipRocketId(): Promise<string | null> {
  const rockets = await fetchJson<SpaceXRocket[]>(API_ENDPOINTS.rockets);
  if (!rockets) return null;
  const starship = rockets.find((r) => r.name.toLowerCase().includes('starship'));
  return starship?.id ?? null;
}

async function fetchStarshipLaunches(rocketId: string): Promise<SpaceXLaunch[]> {
  const body = {
    query: { rocket: rocketId },
    options: { sort: { date_unix: 'asc' }, populate: ['launchpad'] },
  };
  const result = await fetchJson<{ docs: SpaceXLaunch[] }>(API_ENDPOINTS.launchesQuery, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (result?.docs?.length) return result.docs;

  const all = await fetchJson<SpaceXLaunch[]>(API_ENDPOINTS.launches);
  if (!all) return [];
  return all.filter(
    (l) =>
      l.rocket === rocketId ||
      l.name.toLowerCase().includes('starship') ||
      l.name.toLowerCase().includes('ift'),
  );
}

function mergeWithFallback(apiFlights: StarshipFlight[]): StarshipFlight[] {
  if (apiFlights.length === 0) return FALLBACK_FLIGHTS;

  // Prefer curated fallback for known flight numbers — API often lags on
  // Starship outcomes, milestones, and accurate site/summary text.
  const byNumber = new Map<number, StarshipFlight>();
  for (const api of apiFlights) {
    byNumber.set(api.flightNumber, api);
  }
  for (const fb of FALLBACK_FLIGHTS) {
    const existing = byNumber.get(fb.flightNumber);
    if (!existing) {
      byNumber.set(fb.flightNumber, fb);
      continue;
    }
    const apiIncomplete =
      existing.outcome === 'upcoming' || existing.outcome === 'scrubbed';
    const fbComplete = fb.outcome !== 'upcoming' && fb.outcome !== 'scrubbed';
    if (fbComplete && apiIncomplete) {
      byNumber.set(fb.flightNumber, fb);
    } else if (fb.milestones.length > existing.milestones.length) {
      byNumber.set(fb.flightNumber, {
        ...existing,
        summary: fb.summary || existing.summary,
        milestones: fb.milestones,
        site: fb.site || existing.site,
        reachedSpace: fb.reachedSpace || existing.reachedSpace,
        outcome: fbComplete ? fb.outcome : existing.outcome,
      });
    }
  }

  return [...byNumber.values()].sort(
    (a, b) => new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime(),
  );
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const rocketId = await findStarshipRocketId();
  let apiFlights: StarshipFlight[] = [];
  let rocketName = ROCKET_NAME;
  let usedApi = false;

  if (rocketId) {
    const launches = await fetchStarshipLaunches(rocketId);
    if (launches.length > 0) {
      apiFlights = launches.map(mapLaunchToFlight);
      usedApi = true;
    }
    const rocket = await fetchJson<SpaceXRocket>(API_ENDPOINTS.rocketById(rocketId));
    if (rocket) rocketName = rocket.name;
  }

  if (!usedApi) {
    return buildFallbackDashboard();
  }

  const flights = mergeWithFallback(apiFlights);
  const completed = flights.filter((f) => f.outcome !== 'upcoming');
  const successes = completed.filter((f) => f.outcome === 'success').length;
  const partials = completed.filter((f) => f.outcome === 'partial').length;
  const upcoming = flights.find((f) => f.outcome === 'upcoming');
  const year = new Date().getFullYear();

  return {
    flights,
    metrics: {
      totalFlights: flights.length,
      completedFlights: completed.length,
      reachedSpace: completed.filter((f) => f.reachedSpace).length,
      successRate: completed.length
        ? Math.round(((successes + partials * 0.5) / completed.length) * 100)
        : 0,
      flights2026: flights.filter(
        (f) => new Date(f.dateUtc).getFullYear() === year && f.outcome !== 'upcoming',
      ).length,
      nextFlightNumber: (upcoming?.flightNumber ?? completed.length + 1),
    },
    news: buildFallbackDashboard().news,
    nextLaunchDate: upcoming?.dateUtc ?? null,
    rocketName,
    dataSource: 'spacex-api',
    lastUpdated: new Date().toISOString(),
  };
}