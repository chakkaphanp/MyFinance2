import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getDashboardStats,
  getCategoryBreakdown,
  getMonthlyTrend,
} from '../controllers/dashboardController.js';

const router = Router();

router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/monthly-trend', getMonthlyTrend);

export default router;
