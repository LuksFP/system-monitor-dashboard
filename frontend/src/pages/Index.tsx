import { useState, useEffect, useCallback } from 'react';
import { Service, ServiceStatus } from '../types/api';
import { api } from '../services/api';
import { useServices } from '../hooks/useServices';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useServiceHistory } from '../hooks/useServiceHistory';
import { Header } from '../components/Layout/Header';
import { MetricsCards } from '../components/Dashboard/MetricsCards';
import { ServiceList } from '../components/Dashboard/ServiceList';
import { Filters } from '../components/Filters/Filters';
import { ServiceDetailsModal } from '../components/Modal/ServiceDetailsModal';
import { useToast } from '../hooks/use-toast';

const REFRESH_INTERVAL = 30000; // 30 seconds

const Index = () => {
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const { toast } = useToast();

  // Build filter params
  const filterParams = {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    search: searchQuery || undefined,
    limit: 50,
  };

  const { services, loading: servicesLoading, error: servicesError, refresh: refreshServices } = useServices(filterParams);
  const { metrics, loading: metricsLoading, refresh: refreshMetrics } = useDashboardMetrics();
  const { history, loading: historyLoading, fetchHistory, clearHistory } = useServiceHistory();

  // Check backend connection
  const checkConnection = useCallback(async () => {
    try {
      await api.healthCheck();
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  }, []);

  // Initial connection check
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      refreshServices();
      refreshMetrics();
      checkConnection();
      setLastUpdate(new Date().toISOString());
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [refreshServices, refreshMetrics, checkConnection]);

  // Handle service click
  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    fetchHistory(service.id);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    clearHistory();
  };

  // Handle status update from modal
  const handleStatusUpdate = async () => {
    await refreshServices();
    await refreshMetrics();
    if (selectedService) {
      const response = await api.getServiceById(selectedService.id);
      if (response.success && response.data) {
        setSelectedService(response.data);
        fetchHistory(selectedService.id);
      }
    }
  };

  // Handle refresh all
  const handleRefreshAll = async () => {
    try {
      setIsRefreshing(true);
      await api.refreshMonitoring();
      await refreshServices();
      await refreshMetrics();
      setLastUpdate(new Date().toISOString());
      toast({
        title: 'Monitoramento atualizado',
        description: 'Todos os serviços foram verificados',
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={isConnected} lastUpdate={lastUpdate} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Connection Warning */}
        {!isConnected && (
          <div className="rounded-lg border border-status-offline/30 bg-status-offline/10 p-4 animate-fade-in">
            <p className="text-status-offline font-medium">
              ⚠️ Não foi possível conectar ao backend
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Verifique se a API está rodando em <code className="font-mono bg-secondary px-1 rounded">http://localhost:3001</code>
            </p>
          </div>
        )}

        {/* Metrics */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Visão Geral</h2>
          <MetricsCards metrics={metrics} loading={metricsLoading} />
        </section>

        {/* Filters */}
        <section>
          <Filters
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            searchQuery={searchQuery}
            onStatusChange={setStatusFilter}
            onCategoryChange={setCategoryFilter}
            onSearchChange={setSearchQuery}
            onRefresh={handleRefreshAll}
            isRefreshing={isRefreshing}
          />
        </section>

        {/* Services Grid */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            Serviços {services.length > 0 && <span className="text-muted-foreground font-normal">({services.length})</span>}
          </h2>
          <ServiceList
            services={services}
            loading={servicesLoading}
            error={servicesError}
            onServiceClick={handleServiceClick}
          />
        </section>
      </main>

      {/* Service Details Modal */}
      <ServiceDetailsModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        history={history}
        historyLoading={historyLoading}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default Index;
