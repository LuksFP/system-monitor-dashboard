import { useState } from 'react';
import { Service, ServiceStatus, StatusHistory } from '../../types/api';
import { statusColors, statusLabels } from '../../utils/statusColors';
import { formatDate } from '../../utils/formatDate';
import { api } from '../../services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  Activity,
  Globe,
  History,
  Loader2
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface ServiceDetailsModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  history: StatusHistory[];
  historyLoading: boolean;
  onStatusUpdate: () => void;
}

export const ServiceDetailsModal = ({
  service,
  isOpen,
  onClose,
  history,
  historyLoading,
  onStatusUpdate,
}: ServiceDetailsModalProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  if (!service) return null;

  const colors = statusColors[service.status];

  const handleSimulateFailure = async () => {
    try {
      setIsUpdating(true);
      const newStatus = service.status === ServiceStatus.OFFLINE 
        ? ServiceStatus.ONLINE 
        : ServiceStatus.OFFLINE;
      
      await api.updateServiceStatus(
        service.id, 
        newStatus,
        `Status alterado manualmente para ${statusLabels[newStatus]}`
      );
      
      toast({
        title: 'Status atualizado',
        description: `${service.name} agora está ${statusLabels[newStatus]}`,
      });
      
      onStatusUpdate();
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSetUnstable = async () => {
    try {
      setIsUpdating(true);
      await api.updateServiceStatus(
        service.id, 
        ServiceStatus.UNSTABLE,
        'Simulação de instabilidade'
      );
      
      toast({
        title: 'Status atualizado',
        description: `${service.name} agora está Instável`,
      });
      
      onStatusUpdate();
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const StatusIcon = {
    [ServiceStatus.ONLINE]: CheckCircle2,
    [ServiceStatus.UNSTABLE]: AlertTriangle,
    [ServiceStatus.OFFLINE]: XCircle,
  }[service.status];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <StatusIcon className={`h-6 w-6 ${colors.text}`} />
            {service.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <Badge className={`${colors.bg} ${colors.text} ${colors.border} border`}>
              {statusLabels[service.status]}
            </Badge>
            <span className="text-sm text-muted-foreground">{service.category}</span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground">{service.description}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span className="text-xs">Uptime</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{service.uptime.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span className="text-xs">Resposta</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{service.responseTime}ms</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Última verificação</span>
              </div>
              <p className="mt-1 text-sm font-medium">{formatDate(service.lastCheck)}</p>
            </div>
            {service.endpoint && (
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">Endpoint</span>
                </div>
                <p className="mt-1 text-sm font-mono truncate">{service.endpoint}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="destructive"
              onClick={handleSimulateFailure}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              {service.status === ServiceStatus.OFFLINE ? 'Restaurar Online' : 'Simular Falha'}
            </Button>
            <Button
              variant="outline"
              onClick={handleSetUnstable}
              disabled={isUpdating || service.status === ServiceStatus.UNSTABLE}
              className="border-status-unstable/50 text-status-unstable hover:bg-status-unstable/10"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Marcar Instável
            </Button>
          </div>

          <Separator className="bg-border" />

          {/* History */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Histórico de Status</h3>
            </div>
            
            {historyLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhum histórico disponível
              </p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {history.map((entry, index) => {
                  const entryColors = statusColors[entry.status];
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3"
                    >
                      <span className={`h-2 w-2 rounded-full ${entryColors.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-medium ${entryColors.text}`}>
                            {statusLabels[entry.status]}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(entry.timestamp)}
                          </span>
                        </div>
                        {entry.message && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {entry.message}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
