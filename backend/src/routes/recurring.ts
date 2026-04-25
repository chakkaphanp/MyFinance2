import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  createRecurringTransaction,
  getRecurringTransactions,
  getUpcomingRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  processRecurringTransactions,
} from '../controllers/recurringTransactionController.js';

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// Create recurring transaction
router.post('/', createRecurringTransaction);

// Get all recurring transactions
router.get('/', getRecurringTransactions);

// Get upcoming recurring transactions
router.get('/upcoming', getUpcomingRecurringTransactions);

// Process recurring transactions (trigger creation of transactions)
router.post('/process', processRecurringTransactions);

// Update recurring transaction
router.put('/:id', updateRecurringTransaction);

// Delete recurring transaction
router.delete('/:id', deleteRecurringTransaction);

export default router;
