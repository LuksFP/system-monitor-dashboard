import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { DashboardMetrics } from '../types/api';

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDashboardMetrics();
      if (response.success && response.data) {
        setMetrics(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar métricas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const refresh = useCallback(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refresh };
};
