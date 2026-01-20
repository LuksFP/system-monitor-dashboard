import fs from 'fs';
import path from 'path';
import { Service, StatusHistory, ServiceStatus, ServiceCategory } from '../types';

const DB_PATH = path.join(__dirname, '../../data/db.json');

interface Database {
  services: Service[];
  statusHistory: StatusHistory[];
}

const ensureDataDir = (): void => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const initializeDb = (): Database => {
  const initialData: Database = {
    services: [
      {
        id: '1',
        name: 'Main API Gateway',
        description: 'Primary REST API endpoint for all client requests',
        status: ServiceStatus.ONLINE,
        category: ServiceCategory.API,
        lastCheck: new Date().toISOString(),
        uptime: 99.9,
        responseTime: 45,
        endpoint: 'https://api.example.com'
      },
      {
        id: '2',
        name: 'PostgreSQL Database',
        description: 'Main production database cluster',
        status: ServiceStatus.ONLINE,
        category: ServiceCategory.DATABASE,
        lastCheck: new Date().toISOString(),
        uptime: 99.95,
        responseTime: 12,
        endpoint: 'postgres://prod-db.example.com:5432'
      },
      {
        id: '3',
        name: 'Redis Cache',
        description: 'Distributed caching layer',
        status: ServiceStatus.UNSTABLE,
        category: ServiceCategory.CACHE,
        lastCheck: new Date().toISOString(),
        uptime: 98.5,
        responseTime: 8,
        endpoint: 'redis://cache.example.com:6379'
      },
      {
        id: '4',
        name: 'RabbitMQ',
        description: 'Message queue for async processing',
        status: ServiceStatus.ONLINE,
        category: ServiceCategory.MESSAGING,
        lastCheck: new Date().toISOString(),
        uptime: 99.7,
        responseTime: 15,
        endpoint: 'amqp://queue.example.com'
      },
      {
        id: '5',
        name: 'AWS S3 Storage',
        description: 'Object storage for user uploads',
        status: ServiceStatus.ONLINE,
        category: ServiceCategory.STORAGE,
        lastCheck: new Date().toISOString(),
        uptime: 99.99,
        responseTime: 120,
        endpoint: 's3://prod-bucket.example.com'
      },
      {
        id: '6',
        name: 'Auth Service',
        description: 'OAuth2/JWT authentication service',
        status: ServiceStatus.OFFLINE,
        category: ServiceCategory.AUTHENTICATION,
        lastCheck: new Date().toISOString(),
        uptime: 95.2,
        responseTime: 0,
        endpoint: 'https://auth.example.com'
      },
      {
        id: '7',
        name: 'Grafana Monitoring',
        description: 'Metrics and monitoring dashboard',
        status: ServiceStatus.ONLINE,
        category: ServiceCategory.MONITORING,
        lastCheck: new Date().toISOString(),
        uptime: 99.8,
        responseTime: 230,
        endpoint: 'https://grafana.example.com'
      },
      {
        id: '8',
        name: 'Backup API',
        description: 'Automated backup service',
        status: ServiceStatus.ONLINE,
        category: ServiceCategory.API,
        lastCheck: new Date().toISOString(),
        uptime: 99.3,
        responseTime: 340,
        endpoint: 'https://backup-api.example.com'
      }
    ],
    statusHistory: []
  };

  return initialData;
};

export const readDb = (): Database => {
  ensureDataDir();
  
  if (!fs.existsSync(DB_PATH)) {
    const initialData = initializeDb();
    writeDb(initialData);
    return initialData;
  }

  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data) as Database;
};

export const writeDb = (data: Database): void => {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

export const addStatusHistory = (
  serviceId: string,
  status: ServiceStatus,
  message?: string
): void => {
  const db = readDb();
  
  const history: StatusHistory = {
    serviceId,
    status,
    timestamp: new Date().toISOString(),
    message
  };

  db.statusHistory.push(history);
  
  const serviceHistory = db.statusHistory.filter(h => h.serviceId === serviceId);
  if (serviceHistory.length > 100) {
    db.statusHistory = db.statusHistory.filter(h => h.serviceId !== serviceId)
      .concat(serviceHistory.slice(-100));
  }

  writeDb(db);
};
