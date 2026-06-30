export type FlightOutcome = 'success' | 'partial' | 'failure' | 'upcoming' | 'scrubbed';

export interface StarshipFlight {
  id: string;
  flightNumber: number;
  name: string;
  dateUtc: string;
  site: string;
  outcome: FlightOutcome;
  summary: string;
  milestones: string[];
  reachedSpace: boolean;
}

export interface StarshipMetrics {
  totalFlights: number;
  completedFlights: number;
  reachedSpace: number;
  successRate: number;
  flights2026: number;
  nextFlightNumber: number;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
  url: string;
  tag: 'flight' | 'milestone' | 'infrastructure' | 'update';
}

export interface DashboardData {
  flights: StarshipFlight[];
  metrics: StarshipMetrics;
  news: NewsItem[];
  nextLaunchDate: string | null;
  rocketName: string;
  dataSource: 'spacex-api' | 'fallback';
  lastUpdated: string;
}

export interface RefreshSettings {
  intervalMs: number;
  enabled: boolean;
}