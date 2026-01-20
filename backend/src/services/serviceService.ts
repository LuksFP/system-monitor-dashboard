import { Service, ServiceStatus, DashboardMetrics, ServiceQueryParams, StatusHistory } from '../types';
import { readDb, writeDb, addStatusHistory } from '../database/db';

export class ServiceService {
  getAllServices(query: ServiceQueryParams): Service[] {
    const db = readDb();
    let services = db.services;

    if (query.status) {
      services = services.filter(s => s.status === query.status);
    }

    if (query.category) {
      services = services.filter(s => s.category === query.category);
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      services = services.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
      );
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;

    return services.slice(startIdx, endIdx);
  }

  getServiceById(id: string): Service | null {
    const db = readDb();
    return db.services.find(s => s.id === id) || null;
  }

  updateServiceStatus(id: string, status: ServiceStatus, message?: string): Service | null {
    const db = readDb();
    const serviceIdx = db.services.findIndex(s => s.id === id);

    if (serviceIdx === -1) {
      return null;
    }

    if (!Object.values(ServiceStatus).includes(status)) {
      throw new Error('Status inválido');
    }

    db.services[serviceIdx].status = status;
    db.services[serviceIdx].lastCheck = new Date().toISOString();

    if (status === ServiceStatus.OFFLINE) {
      db.services[serviceIdx].responseTime = 0;
    }

    writeDb(db);
    addStatusHistory(id, status, message);

    return db.services[serviceIdx];
  }

  refreshMonitoring(): Service[] {
    const db = readDb();
    
    db.services.forEach(service => {
      service.lastCheck = new Date().toISOString();
      
      if (Math.random() < 0.05) {
        const statuses = [ServiceStatus.ONLINE, ServiceStatus.UNSTABLE, ServiceStatus.OFFLINE];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        if (newStatus !== service.status) {
          service.status = newStatus;
          addStatusHistory(service.id, newStatus, 'Status atualizado automaticamente');
        }
      }

      if (service.status === ServiceStatus.ONLINE) {
        service.responseTime = Math.floor(Math.random() * 200) + 10;
      } else if (service.status === ServiceStatus.UNSTABLE) {
        service.responseTime = Math.floor(Math.random() * 500) + 200;
      } else {
        service.responseTime = 0;
      }
    });

    writeDb(db);
    return db.services;
  }

  getDashboardMetrics(): DashboardMetrics {
    const db = readDb();
    const services = db.services;

    const totalServices = services.length;
    const onlineServices = services.filter(s => s.status === ServiceStatus.ONLINE).length;
    const offlineServices = services.filter(s => s.status === ServiceStatus.OFFLINE).length;
    const unstableServices = services.filter(s => s.status === ServiceStatus.UNSTABLE).length;

    const averageUptime = services.reduce((acc, s) => acc + s.uptime, 0) / totalServices;
    
    const activeServices = services.filter(s => s.status !== ServiceStatus.OFFLINE);
    const averageResponseTime = activeServices.length > 0
      ? activeServices.reduce((acc, s) => acc + s.responseTime, 0) / activeServices.length
      : 0;

    return {
      totalServices,
      onlineServices,
      offlineServices,
      unstableServices,
      averageUptime: Math.round(averageUptime * 100) / 100,
      averageResponseTime: Math.round(averageResponseTime)
    };
  }

  getServiceHistory(serviceId: string, limit: number = 50): StatusHistory[] {
    const db = readDb();
    return db.statusHistory
      .filter(h => h.serviceId === serviceId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  countServices(query: ServiceQueryParams): number {
    const db = readDb();
    let services = db.services;

    if (query.status) {
      services = services.filter(s => s.status === query.status);
    }

    if (query.category) {
      services = services.filter(s => s.category === query.category);
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      services = services.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
      );
    }

    return services.length;
  }
}
