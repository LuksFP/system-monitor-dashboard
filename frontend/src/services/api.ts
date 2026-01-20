import { 
  Service, 
  DashboardMetrics, 
  StatusHistory, 
  ServiceStatus, 
  ApiResponse,
  ServicesResponse 
} from '../types/api';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
      throw new Error(error.error || 'Erro na requisição');
    }

    return response.json();
  }

  async getServices(params?: {
    status?: ServiceStatus;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<ServicesResponse>> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString();
    return this.request<ApiResponse<ServicesResponse>>(
      `/services${queryString ? `?${queryString}` : ''}`
    );
  }

  async getServiceById(id: string): Promise<ApiResponse<Service>> {
    return this.request<ApiResponse<Service>>(`/services/${id}`);
  }

  async updateServiceStatus(
    id: string, 
    status: ServiceStatus, 
    message?: string
  ): Promise<ApiResponse<Service>> {
    return this.request<ApiResponse<Service>>(`/services/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, message }),
    });
  }

  async refreshMonitoring(): Promise<ApiResponse<Service[]>> {
    return this.request<ApiResponse<Service[]>>('/services/refresh', {
      method: 'POST',
    });
  }

  async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    return this.request<ApiResponse<DashboardMetrics>>('/dashboard/metrics');
  }

  async getServiceHistory(id: string, limit = 50): Promise<ApiResponse<StatusHistory[]>> {
    return this.request<ApiResponse<StatusHistory[]>>(
      `/services/${id}/history?limit=${limit}`
    );
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch('http://localhost:3001/health');
    return response.json();
  }
}

export const api = new ApiService();
