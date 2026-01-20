import { DashboardMetrics } from '../../types/api';
import { Activity, Server, AlertTriangle, XCircle, Clock, Zap } from 'lucide-react';

interface MetricsCardsProps {
  metrics: DashboardMetrics | null;
  loading: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'online' | 'unstable' | 'offline';
  loading?: boolean;
}

const MetricCard = ({ title, value, subtitle, icon, variant = 'default', loading }: MetricCardProps) => {
  const variantClasses = {
    default: 'gradient-card border-border',
    online: 'gradient-online border-status-online/30',
    unstable: 'gradient-unstable border-status-unstable/30',
    offline: 'gradient-offline border-status-offline/30',
  };

  const iconClasses = {
    default: 'text-primary',
    online: 'text-status-online',
    unstable: 'text-status-unstable',
    offline: 'text-status-offline',
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border p-6 shadow-card transition-all duration-300
        hover:scale-[1.02] hover:shadow-lg
        ${variantClasses[variant]}
        ${loading ? 'animate-pulse' : 'animate-fade-in'}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">
            {loading ? '—' : value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={`rounded-lg bg-secondary/50 p-3 ${iconClasses[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const MetricsCards = ({ metrics, loading }: MetricsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <MetricCard
        title="Total de Serviços"
        value={metrics?.totalServices ?? 0}
        icon={<Server className="h-5 w-5" />}
        loading={loading}
      />
      <MetricCard
        title="Online"
        value={metrics?.onlineServices ?? 0}
        icon={<Activity className="h-5 w-5" />}
        variant="online"
        loading={loading}
      />
      <MetricCard
        title="Instáveis"
        value={metrics?.unstableServices ?? 0}
        icon={<AlertTriangle className="h-5 w-5" />}
        variant="unstable"
        loading={loading}
      />
      <MetricCard
        title="Offline"
        value={metrics?.offlineServices ?? 0}
        icon={<XCircle className="h-5 w-5" />}
        variant="offline"
        loading={loading}
      />
      <MetricCard
        title="Uptime Médio"
        value={metrics ? `${metrics.averageUptime.toFixed(1)}%` : '0%'}
        icon={<Clock className="h-5 w-5" />}
        loading={loading}
      />
      <MetricCard
        title="Resp. Média"
        value={metrics ? `${metrics.averageResponseTime.toFixed(0)}ms` : '0ms'}
        icon={<Zap className="h-5 w-5" />}
        loading={loading}
      />
    </div>
  );
};
