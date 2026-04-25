import { Request, Response } from 'express';
import { recurringTransactionService } from '../services/recurringTransactionService';

interface AuthRequest extends Request {
  userId?: string;
}

export const createRecurringTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { type, category, amount, description, frequency, dayOfMonth, dayOfWeek, startDate, endDate } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!type || !category || !amount || !description || !frequency || !startDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const recurringTransaction = await recurringTransactionService.createRecurringTransaction(
      userId,
      {
        type,
        category,
        amount: parseFloat(amount),
        description,
        frequency,
        dayOfMonth: dayOfMonth !== undefined && dayOfMonth !== null ? parseInt(dayOfMonth) : undefined,
        dayOfWeek: dayOfWeek !== undefined && dayOfWeek !== null ? parseInt(dayOfWeek) : undefined,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
      }
    );

    res.json(recurringTransaction);
  } catch (error: any) {
    console.error('Error creating recurring transaction:', error);
    res.status(500).json({ error: 'Failed to create recurring transaction: ' + (error.message || '') });
  }
};

export const getRecurringTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transactions = await recurringTransactionService.getRecurringTransactionsByUser(userId);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching recurring transactions:', error);
    res.status(500).json({ error: 'Failed to fetch recurring transactions' });
  }
};

export const getUpcomingRecurringTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { daysAhead } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transactions = await recurringTransactionService.getUpcomingRecurringTransactions(
      userId,
      daysAhead ? parseInt(daysAhead as string) : 30
    );

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching upcoming recurring transactions:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming recurring transactions' });
  }
};

export const updateRecurringTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { category, amount, description, frequency, dayOfMonth, dayOfWeek, endDate, isActive } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await recurringTransactionService.updateRecurringTransaction(userId, id, {
      category,
      amount: amount ? parseFloat(amount) : undefined,
      description,
      frequency,
      dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : undefined,
      dayOfWeek: dayOfWeek ? parseInt(dayOfWeek) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      isActive,
    });

    const transaction = await recurringTransactionService.getRecurringTransactionById(userId, id);
    res.json(transaction);
  } catch (error) {
    console.error('Error updating recurring transaction:', error);
    res.status(500).json({ error: 'Failed to update recurring transaction' });
  }
};

export const deleteRecurringTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await recurringTransactionService.deleteRecurringTransaction(userId, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting recurring transaction:', error);
    res.status(500).json({ error: 'Failed to delete recurring transaction' });
  }
};

export const processRecurringTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const processedTransactions = await recurringTransactionService.processRecurringTransactions(userId);
    res.json({
      success: true,
      processedCount: processedTransactions.length,
      transactions: processedTransactions,
    });
  } catch (error) {
    console.error('Error processing recurring transactions:', error);
    res.status(500).json({ error: 'Failed to process recurring transactions' });
  }
};
