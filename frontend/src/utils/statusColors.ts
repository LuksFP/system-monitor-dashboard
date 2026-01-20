import { ServiceStatus } from '../types/api';

export const statusColors = {
  [ServiceStatus.ONLINE]: {
    bg: 'bg-status-online/10',
    text: 'text-status-online',
    border: 'border-status-online',
    dot: 'bg-status-online',
  },
  [ServiceStatus.UNSTABLE]: {
    bg: 'bg-status-unstable/10',
    text: 'text-status-unstable',
    border: 'border-status-unstable',
    dot: 'bg-status-unstable',
  },
  [ServiceStatus.OFFLINE]: {
    bg: 'bg-status-offline/10',
    text: 'text-status-offline',
    border: 'border-status-offline',
    dot: 'bg-status-offline',
  },
};

export const statusLabels = {
  [ServiceStatus.ONLINE]: 'Online',
  [ServiceStatus.UNSTABLE]: 'Instável',
  [ServiceStatus.OFFLINE]: 'Offline',
};
