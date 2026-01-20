import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Service, ServiceStatus, PaginationInfo } from '../types/api';

interface UseServicesParams {
  status?: ServiceStatus;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const useServices = (params?: UseServicesParams) => {
  const [services, setServices] = useState<Service[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getServices(params);
      if (response.success && response.data) {
        setServices(response.data.services);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  }, [params?.status, params?.category, params?.search, params?.page, params?.limit]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const refresh = useCallback(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, pagination, loading, error, refresh };
};
