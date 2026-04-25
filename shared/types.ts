// Shared Types for Finance App

export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionCategory = 
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Utilities'
  | 'Healthcare'
  | 'Shopping'
  | 'Other';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: string; // ISO 8601
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyBalance: number;
  transactionCount: number;
}

export interface CategoryBreakdown {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  count: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limitAmount: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetWithSpending extends Budget {
  spent: number;
  remaining: number;
  percentUsed: number;
  isExceeded: boolean;
}

export interface BudgetAlert {
  budgetId: string;
  category: string;
  limitAmount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  isExceeded: boolean;
  alertType: 'NORMAL' | 'WARNING' | 'EXCEEDED';
}

export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface RecurringTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  frequency: RecurrenceFrequency;
  dayOfMonth?: number;
  dayOfWeek?: number;
  startDate: string; // ISO 8601
  endDate?: string; // ISO 8601
  isActive: boolean;
  lastRunDate?: string; // ISO 8601
  createdAt: string;
  updatedAt: string;
  nextOccurrenceDate?: string; // ISO 8601
}
