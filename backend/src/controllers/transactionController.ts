import { Response } from 'express';
import { TransactionService } from '../services/transactionService.js';
import { AuthRequest } from '../middleware/auth.js';

const transactionService = new TransactionService();

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { type, category, amount, description, date } = req.body;
    
    if (!type || !category || !amount || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const transaction = await transactionService.createTransaction(
      req.userId!,
      type,
      category,
      amount,
      description || '',
      date
    );
    
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    
    const result = await transactionService.getTransactions(req.userId!, page, pageSize);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id,
      req.userId!
    );
    res.json(transaction);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await transactionService.updateTransaction(
      req.params.id,
      req.userId!,
      req.body
    );
    res.json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    await transactionService.deleteTransaction(req.params.id, req.userId!);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
