import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  createBudget,
  getBudgetsByMonth,
  getBudgetAlerts,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController';

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// Get budget alerts (specific route before /:id parameter)
router.get('/alerts', getBudgetAlerts);

// Create budget
router.post('/', createBudget);

// Get budgets for a specific month
router.get('/', getBudgetsByMonth);

// Update budget
router.put('/:id', updateBudget);

// Delete budget
router.delete('/:id', deleteBudget);

export default router;
