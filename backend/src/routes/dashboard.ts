import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  getDashboardStats,
  getCategoryBreakdown,
  getMonthlyTrend,
} from '../controllers/dashboardController.js';

const router = Router();

router.use(auth);

router.get('/stats', getDashboardStats);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/monthly-trend', getMonthlyTrend);

export default router;
