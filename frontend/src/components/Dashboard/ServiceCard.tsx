import { Service, ServiceStatus } from '../../types/api';
import { statusColors, statusLabels } from '../../utils/statusColors';
import { formatRelativeTime } from '../../utils/formatDate';
import { 
  Database, 
  Server, 
  HardDrive, 
  MessageSquare, 
  Shield, 
  Activity,
  Layers,
  Clock,
  Zap
} from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  API: <Server className="h-4 w-4" />,
  Database: <Database className="h-4 w-4" />,
  Cache: <Layers className="h-4 w-4" />,
  Messaging: <MessageSquare className="h-4 w-4" />,
  Storage: <HardDrive className="h-4 w-4" />,
  Authentication: <Shield className="h-4 w-4" />,
  Monitoring: <Activity className="h-4 w-4" />,
};

export const ServiceCard = ({ service, onClick }: ServiceCardProps) => {
  const colors = statusColors[service.status];
  
  const pulseClass = {
    [ServiceStatus.ONLINE]: 'pulse-online',
    [ServiceStatus.UNSTABLE]: 'pulse-unstable',
    [ServiceStatus.OFFLINE]: 'pulse-offline',
  }[service.status];

  const glowClass = {
    [ServiceStatus.ONLINE]: 'hover:shadow-glow-online',
    [ServiceStatus.UNSTABLE]: 'hover:shadow-glow-unstable',
    [ServiceStatus.OFFLINE]: 'hover:shadow-glow-offline',
  }[service.status];

  return (
    <div
      onClick={onClick}
      className={`
        group relative cursor-pointer overflow-hidden rounded-lg border 
        gradient-card shadow-card transition-all duration-300
        hover:scale-[1.02] ${glowClass}
        animate-fade-in
      `}
    >
      {/* Status indicator bar */}
      <div className={`absolute left-0 top-0 h-full w-1 ${colors.dot}`} />
      
      <div className="p-5 pl-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {categoryIcons[service.category]}
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {service.category}
              </span>
            </div>
            <h3 className="mt-2 font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {service.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {service.description}
            </p>
          </div>
          
          {/* Status Badge */}
          <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${colors.bg} ${colors.border} border`}>
            <span className={`h-2 w-2 rounded-full ${colors.dot} ${pulseClass}`} />
            <span className={`text-xs font-medium ${colors.text}`}>
              {statusLabels[service.status]}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatRelativeTime(service.lastCheck)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>{service.responseTime}ms</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <span>{service.uptime.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
