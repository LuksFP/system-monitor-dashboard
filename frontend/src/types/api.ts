export enum ServiceStatus {
  ONLINE = 'online',
  UNSTABLE = 'unstable',
  OFFLINE = 'offline'
}

export enum ServiceCategory {
  API = 'API',
  DATABASE = 'Database',
  CACHE = 'Cache',
  MESSAGING = 'Messaging',
  STORAGE = 'Storage',
  AUTHENTICATION = 'Authentication',
  MONITORING = 'Monitoring'
}

export interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  category: ServiceCategory;
  lastCheck: string;
  uptime: number;
  responseTime: number;
  endpoint?: string;
}

export interface StatusHistory {
  serviceId: string;
  status: ServiceStatus;
  timestamp: string;
  message?: string;
}

export interface DashboardMetrics {
  totalServices: number;
  onlineServices: number;
  offlineServices: number;
  unstableServices: number;
  averageUptime: number;
  averageResponseTime: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServicesResponse {
  services: Service[];
  pagination: PaginationInfo;
}
