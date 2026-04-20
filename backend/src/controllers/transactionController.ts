import { Response } from 'express';
import { TransactionService } from '../services/transactionService.js';
import { AuthRequest } from '../middleware/auth.js';
import { TransactionSchema } from '../schemas/validation.js';

const transactionService = new TransactionService();

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const validation = TransactionSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validation.error.errors 
      });
    }
    
    const { type, category, amount, description, date } = validation.data;
    
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
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message || 'Failed to create transaction' });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    
    const result = await transactionService.getTransactions(req.userId!, page, pageSize);
    res.json(result);
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch transactions' });
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
    console.error('Error fetching transaction:', error);
    res.status(404).json({ error: error.message || 'Transaction not found' });
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
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: error.message || 'Failed to update transaction' });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    await transactionService.deleteTransaction(req.params.id, req.userId!);
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: error.message || 'Failed to delete transaction' });
  }
};
