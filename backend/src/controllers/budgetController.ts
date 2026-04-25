import { Request, Response } from 'express';
import { budgetService } from '../services/budgetService.js';

interface AuthRequest extends Request {
  userId?: string;
}

export const createBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { category, limitAmount, month, year } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!category || !limitAmount || !month || !year) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const budget = await budgetService.createBudget(userId, {
      category,
      limitAmount: parseFloat(limitAmount),
      month: parseInt(month),
      year: parseInt(year),
    });

    res.json(budget);
  } catch (error: any) {
    console.error('Error creating budget:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A budget for this category and month already exists.' });
    }
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

export const getBudgetsByMonth = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { month, year } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const budgets = await budgetService.getAllBudgetsWithSpending(
      userId,
      parseInt(month as string),
      parseInt(year as string)
    );

    res.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

export const getBudgetAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const alerts = await budgetService.checkBudgetAlerts(userId);
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching budget alerts:', error);
    res.status(500).json({ error: 'Failed to fetch budget alerts' });
  }
};

export const updateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { limitAmount } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await budgetService.updateBudget(userId, id, {
      limitAmount: parseFloat(limitAmount),
    });

    const budget = await budgetService.getBudgetWithSpending(userId, id);
    res.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: 'Failed to update budget' });
  }
};

export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await budgetService.deleteBudget(userId, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};
