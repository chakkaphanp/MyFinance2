import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const TransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
  date: z.string().date(),
});

export const UpdateTransactionSchema = TransactionSchema.partial();

export const BudgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  limitAmount: z.number().positive('Limit amount must be positive'),
  month: z.number().min(1).max(12, 'Month must be between 1 and 12'),
  year: z.number().min(2000, 'Year must be valid'),
});

export const UpdateBudgetSchema = BudgetSchema.partial();

export const RecurringTransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  dayOfMonth: z.number().min(1).max(31).optional(),
  dayOfWeek: z.number().min(0).max(6).optional(),
  startDate: z.string().date(),
  endDate: z.string().date().optional(),
});

export const UpdateRecurringTransactionSchema = RecurringTransactionSchema.partial();

export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export type TransactionRequest = z.infer<typeof TransactionSchema>;
export type UpdateTransactionRequest = z.infer<typeof UpdateTransactionSchema>;
export type BudgetRequest = z.infer<typeof BudgetSchema>;
export type UpdateBudgetRequest = z.infer<typeof UpdateBudgetSchema>;
export type RecurringTransactionRequest = z.infer<typeof RecurringTransactionSchema>;
export type UpdateRecurringTransactionRequest = z.infer<typeof UpdateRecurringTransactionSchema>;
