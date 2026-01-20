import { ServiceStatus, ServiceCategory } from '../../types/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, RefreshCw, Filter, X } from 'lucide-react';

interface FiltersProps {
  statusFilter: ServiceStatus | 'all';
  categoryFilter: string;
  searchQuery: string;
  onStatusChange: (status: ServiceStatus | 'all') => void;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Filters = ({
  statusFilter,
  categoryFilter,
  searchQuery,
  onStatusChange,
  onCategoryChange,
  onSearchChange,
  onRefresh,
  isRefreshing,
}: FiltersProps) => {
  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery !== '';

  const clearFilters = () => {
    onStatusChange('all');
    onCategoryChange('all');
    onSearchChange('');
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar serviços..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={(val) => onStatusChange(val as ServiceStatus | 'all')}>
          <SelectTrigger className="w-[140px] bg-card border-border">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value={ServiceStatus.ONLINE}>Online</SelectItem>
            <SelectItem value={ServiceStatus.UNSTABLE}>Instável</SelectItem>
            <SelectItem value={ServiceStatus.OFFLINE}>Offline</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px] bg-card border-border">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {Object.values(ServiceCategory).map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Refresh Button */}
      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        Atualizar
      </Button>
    </div>
  );
};
