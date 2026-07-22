import type { DashboardData, NewsItem, StarshipFlight } from '../types';

/** Curated Starship integrated-flight-test history (fallback when API unavailable).
 *  Sources: SpaceX flight pages, Wikipedia List of Starship launches (as of 2026-07-21).
 */
export const FALLBACK_FLIGHTS: StarshipFlight[] = [
  {
    id: 'ift-1',
    flightNumber: 1,
    name: 'Flight 1 (IFT-1)',
    dateUtc: '2023-04-20T13:33:00Z',
    site: 'Starbase OLP-1',
    outcome: 'failure',
    summary:
      'First integrated flight (B7/S24). Multiple engine outages; loss of control before stage separation. Vehicle destroyed by flight termination.',
    milestones: ['First full-stack launch', 'Cleared the pad'],
    reachedSpace: false,
  },
  {
    id: 'ift-2',
    flightNumber: 2,
    name: 'Flight 2 (IFT-2)',
    dateUtc: '2023-11-18T13:02:00Z',
    site: 'Starbase OLP-1',
    outcome: 'failure',
    summary:
      'Hot-staging demonstrated; all 33 booster engines burned full duration. Booster lost after boostback; ship destroyed after reaching space.',
    milestones: ['Hot-staging', 'Reached space (~150 km)', 'Water deluge system'],
    reachedSpace: true,
  },
  {
    id: 'ift-3',
    flightNumber: 3,
    name: 'Flight 3 (IFT-3)',
    dateUtc: '2024-03-14T13:25:00Z',
    site: 'Starbase OLP-1',
    outcome: 'partial',
    summary:
      'Full-duration second-stage burn and suborbital trajectory. Payload door and propellant-transfer demos. Both stages lost on landing attempts.',
    milestones: ['Payload door demo', 'On-orbit propellant transfer demo', 'SECO'],
    reachedSpace: true,
  },
  {
    id: 'ift-4',
    flightNumber: 4,
    name: 'Flight 4 (IFT-4)',
    dateUtc: '2024-06-06T12:50:00Z',
    site: 'Starbase OLP-1',
    outcome: 'success',
    summary:
      'First controlled soft splashdowns of both stages. Ship survived reentry flap damage; booster soft-landed in the Gulf on a virtual-tower profile.',
    milestones: ['Controlled reentry', 'Booster soft splashdown', 'Ship soft splashdown'],
    reachedSpace: true,
  },
  {
    id: 'flight-5',
    flightNumber: 5,
    name: 'Flight 5',
    dateUtc: '2024-10-13T12:25:00Z',
    site: 'Starbase OLP-1',
    outcome: 'success',
    summary:
      'First Super Heavy tower catch at Mechazilla (B12). Ship soft-landed in the Indian Ocean. No engine failures on the full stack.',
    milestones: ['Tower catch (chopsticks)', 'Ship soft splashdown', 'Engine-out free flight'],
    reachedSpace: true,
  },
  {
    id: 'flight-6',
    flightNumber: 6,
    name: 'Flight 6',
    dateUtc: '2024-11-19T22:00:00Z',
    site: 'Starbase OLP-1',
    outcome: 'success',
    summary:
      'Final Block 1 ship. Booster diverted to Gulf after tower damage on liftoff. Ship completed in-space Raptor relight and daylight soft splashdown.',
    milestones: ['Raptor relight in space', 'Daylight ship splashdown', 'First payload (plush banana)'],
    reachedSpace: true,
  },
  {
    id: 'flight-7',
    flightNumber: 7,
    name: 'Flight 7',
    dateUtc: '2025-01-16T22:37:00Z',
    site: 'Starbase OLP-1',
    outcome: 'failure',
    summary:
      'Block 2 ship debut (S33). Booster catch succeeded. Ship lost ~8.5 min into flight after propellant leak and engine shutdowns during ascent burn.',
    milestones: ['Block 2 ship debut', 'Booster catch', 'Starlink simulators (not deployed)'],
    reachedSpace: true,
  },
  {
    id: 'flight-8',
    flightNumber: 8,
    name: 'Flight 8',
    dateUtc: '2025-03-06T23:31:00Z',
    site: 'Starbase OLP-1',
    outcome: 'failure',
    summary:
      'Ship (S34) lost control during ascent burn after multiple Raptor shutdowns. Booster (B15) successfully caught despite two boostback engine issues.',
    milestones: ['Booster catch', 'Block 2 path refinement'],
    reachedSpace: false,
  },
  {
    id: 'flight-9',
    flightNumber: 9,
    name: 'Flight 9',
    dateUtc: '2025-05-27T23:36:00Z',
    site: 'Starbase OLP-1',
    outcome: 'failure',
    summary:
      'First Super Heavy reflight (B14-2). Booster lost before Gulf splashdown; ship reached SECO but failed payload deploy and broke up on reentry.',
    milestones: ['First booster reflight', 'Ship SECO', 'Aggressive reentry profile'],
    reachedSpace: true,
  },
  {
    id: 'flight-10',
    flightNumber: 10,
    name: 'Flight 10',
    dateUtc: '2025-08-26T23:30:00Z',
    site: 'Starbase OLP-1',
    outcome: 'success',
    summary:
      'First Starlink simulator deployment (8 sats). In-space Raptor relight; ship soft splashdown ~3 m from target despite engine-section heat damage.',
    milestones: ['Starlink simulator deploy', 'Raptor relight', 'Ship soft splashdown'],
    reachedSpace: true,
  },
  {
    id: 'flight-11',
    flightNumber: 11,
    name: 'Flight 11',
    dateUtc: '2025-10-13T23:23:00Z',
    site: 'Starbase OLP-1',
    outcome: 'success',
    summary:
      'Final Block 2 flight and last launch from OLP-1 pre-retrofit. Eight simulators deployed; ship mostly undamaged through reentry with tiles intentionally removed. Soft splashdown on target.',
    milestones: ['Last Block 2 flight', 'Starlink simulators', 'Heat-shield tile removal test'],
    reachedSpace: true,
  },
  {
    id: 'flight-12',
    flightNumber: 12,
    name: 'Flight 12',
    dateUtc: '2026-05-22T22:30:00Z',
    site: 'Starbase OLP-2',
    outcome: 'partial',
    summary:
      'Block 3 debut (B19/S39) and first launch from Pad 2. Ship reached SECO, deployed 20 simulators + 2 Starlink V3 test sats, soft-landed in ocean. Booster boostback failed; high-speed Gulf impact.',
    milestones: [
      'Block 3 / V3 hardware debut',
      'First OLP-2 launch',
      'Starlink V3 test sats',
      'Ship soft splashdown',
    ],
    reachedSpace: true,
  },
  {
    id: 'flight-13',
    flightNumber: 13,
    name: 'Flight 13',
    dateUtc: '2026-07-23T22:45:00Z',
    site: 'Starbase OLP-2',
    outcome: 'upcoming',
    summary:
      'Second Block 3 flight (B20/S40). Suborbital profile with planned ship soft splashdown and booster water landing. Prior attempt aborted Jul 16 on engine start; window opens 5:45 p.m. CT.',
    milestones: [
      '20 Starlink V3 satellites (planned)',
      'In-space Raptor relight reattempt',
      'Ship soft splashdown',
    ],
    reachedSpace: false,
  },
];

export const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Flight 13 retargeted for Thursday, July 23 after abort',
    date: '2026-07-19',
    source: 'SpaceX',
    url: 'https://www.spacex.com/launches/starship-flight-13',
    tag: 'flight',
  },
  {
    id: 'n2',
    title: 'Flight 13 countdown aborted late in window on July 16',
    date: '2026-07-16',
    source: 'SpaceX',
    url: 'https://www.spacex.com/launches/starship-flight-13',
    tag: 'update',
  },
  {
    id: 'n3',
    title: 'Flight 12: Block 3 debut — ship success, booster lost on landing',
    date: '2026-05-22',
    source: 'SpaceX',
    url: 'https://www.spacex.com/launches',
    tag: 'flight',
  },
  {
    id: 'n4',
    title: 'Pad 2 (OLP-2) hosts first Starship launch on Flight 12',
    date: '2026-05-22',
    source: 'NASASpaceflight',
    url: 'https://www.youtube.com/@NASASpaceflight',
    tag: 'infrastructure',
  },
  {
    id: 'n5',
    title: 'Flight 11 closes Block 2 era with full mission success',
    date: '2025-10-13',
    source: 'SpaceX',
    url: 'https://www.spacex.com/launches/starship-flight-11',
    tag: 'milestone',
  },
];

export function buildFallbackDashboard(): DashboardData {
  const completed = FALLBACK_FLIGHTS.filter((f) => f.outcome !== 'upcoming');
  const successes = completed.filter((f) => f.outcome === 'success').length;
  const partials = completed.filter((f) => f.outcome === 'partial').length;
  const reachedSpace = completed.filter((f) => f.reachedSpace).length;
  const year = new Date().getFullYear();
  const upcoming = FALLBACK_FLIGHTS.find((f) => f.outcome === 'upcoming');

  return {
    flights: FALLBACK_FLIGHTS,
    metrics: {
      totalFlights: FALLBACK_FLIGHTS.length,
      completedFlights: completed.length,
      reachedSpace,
      successRate: completed.length
        ? Math.round(((successes + partials * 0.5) / completed.length) * 100)
        : 0,
      flights2026: FALLBACK_FLIGHTS.filter(
        (f) => new Date(f.dateUtc).getFullYear() === year && f.outcome !== 'upcoming',
      ).length,
      nextFlightNumber: upcoming?.flightNumber ?? completed.length + 1,
    },
    news: FALLBACK_NEWS,
    nextLaunchDate: upcoming?.dateUtc ?? '2026-07-23T22:45:00Z',
    rocketName: 'Starship',
    dataSource: 'fallback',
    lastUpdated: new Date().toISOString(),
  };
}
