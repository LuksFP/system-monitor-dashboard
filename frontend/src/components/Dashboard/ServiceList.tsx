import { Service } from '../../types/api';
import { ServiceCard } from './ServiceCard';
import { Loader2 } from 'lucide-react';

interface ServiceListProps {
  services: Service[];
  loading: boolean;
  error: string | null;
  onServiceClick: (service: Service) => void;
}

export const ServiceList = ({ services, loading, error, onServiceClick }: ServiceListProps) => {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 p-8">
        <p className="text-destructive font-medium">Erro ao carregar serviços</p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-border bg-card p-8">
        <p className="text-muted-foreground">Nenhum serviço encontrado</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <div 
          key={service.id}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ServiceCard 
            service={service} 
            onClick={() => onServiceClick(service)} 
          />
        </div>
      ))}
    </div>
  );
};
