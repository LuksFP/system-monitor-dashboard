import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { StatusHistory } from '../types/api';

export const useServiceHistory = () => {
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (serviceId: string, limit = 50) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getServiceHistory(serviceId, limit);
      if (response.success && response.data) {
        setHistory(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, loading, error, fetchHistory, clearHistory };
};
