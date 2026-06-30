import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardData } from '../services/spacexApi';
import type { DashboardData, RefreshSettings } from '../types';

const DEFAULT_REFRESH: RefreshSettings = {
  intervalMs: 5 * 60 * 1000,
  enabled: true,
};

export function useStarshipData(settings: RefreshSettings = DEFAULT_REFRESH) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const result = await fetchDashboardData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!settings.enabled) return;
    const id = window.setInterval(refresh, settings.intervalMs);
    return () => window.clearInterval(id);
  }, [refresh, settings.enabled, settings.intervalMs]);

  return { data, loading, error, refresh };
}