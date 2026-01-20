import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  updateServiceStatus,
  refreshMonitoring,
  getDashboardMetrics,
  getServiceHistory
} from '../controllers/serviceController';

const router = Router();

router.get('/services', getAllServices);
router.get('/services/:id', getServiceById);
router.put('/services/:id/status', updateServiceStatus);
router.post('/services/refresh', refreshMonitoring);
router.get('/services/:id/history', getServiceHistory);
router.get('/dashboard/metrics', getDashboardMetrics);

export default router;
