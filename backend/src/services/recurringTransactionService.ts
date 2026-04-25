import { prisma } from '../lib/prisma';

export interface CreateRecurringTransactionInput {
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  dayOfMonth?: number;
  dayOfWeek?: number;
  startDate: Date;
  endDate?: Date;
}

export interface UpdateRecurringTransactionInput {
  category?: string;
  amount?: number;
  description?: string;
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  dayOfMonth?: number;
  dayOfWeek?: number;
  endDate?: Date;
  isActive?: boolean;
}

export class RecurringTransactionService {
  async createRecurringTransaction(
    userId: string,
    input: CreateRecurringTransactionInput
  ) {
    return prisma.recurringTransaction.create({
      data: {
        userId,
        ...input,
      },
    });
  }

  async getRecurringTransactionsByUser(userId: string) {
    return prisma.recurringTransaction.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  async getActiveRecurringTransactions(userId: string) {
    return prisma.recurringTransaction.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async getRecurringTransactionById(userId: string, recurringId: string) {
    return prisma.recurringTransaction.findFirst({
      where: {
        id: recurringId,
        userId,
      },
    });
  }

  async updateRecurringTransaction(
    userId: string,
    recurringId: string,
    input: UpdateRecurringTransactionInput
  ) {
    return prisma.recurringTransaction.updateMany({
      where: {
        id: recurringId,
        userId,
      },
      data: input,
    });
  }

  async deleteRecurringTransaction(userId: string, recurringId: string) {
    return prisma.recurringTransaction.deleteMany({
      where: {
        id: recurringId,
        userId,
      },
    });
  }

  async getUpcomingRecurringTransactions(
    userId: string,
    daysAhead: number = 30
  ) {
    const now = new Date();
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    const recurring = await this.getActiveRecurringTransactions(userId);
    const upcoming = [];

    for (const rec of recurring) {
      if (rec.startDate > futureDate) continue;
      if (rec.endDate && rec.endDate < now) continue;

      const nextOccurrence = this.getNextOccurrence(rec);
      if (nextOccurrence && nextOccurrence <= futureDate) {
        upcoming.push({
          ...rec,
          nextOccurrenceDate: nextOccurrence,
        });
      }
    }

    return upcoming.sort((a, b) => a.nextOccurrenceDate.getTime() - b.nextOccurrenceDate.getTime());
  }

  private getNextOccurrence(recurring: any): Date | null {
    const now = new Date();
    let nextDate = new Date(recurring.lastRunDate || recurring.startDate);

    switch (recurring.frequency) {
      case 'DAILY':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'WEEKLY':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'MONTHLY':
        nextDate.setMonth(nextDate.getMonth() + 1);
        if (recurring.dayOfMonth) {
          nextDate.setDate(recurring.dayOfMonth);
        }
        break;
      case 'YEARLY':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    if (recurring.endDate && nextDate > recurring.endDate) {
      return null;
    }

    if (nextDate <= now) {
      return this.getNextOccurrence({ ...recurring, lastRunDate: nextDate });
    }

    return nextDate;
  }

  async processRecurringTransactions(userId: string) {
    const recurring = await this.getActiveRecurringTransactions(userId);
    const processedTransactions = [];

    for (const rec of recurring) {
      if (rec.startDate > new Date()) continue;
      if (rec.endDate && rec.endDate < new Date()) {
        // Auto-deactivate expired recurring transactions
        await this.updateRecurringTransaction(userId, rec.id, { isActive: false });
        continue;
      }

      const nextOccurrence = this.getNextOccurrence(rec);
      if (nextOccurrence && nextOccurrence <= new Date()) {
        // Create the transaction
        const transaction = await prisma.transaction.create({
          data: {
            userId,
            type: rec.type,
            category: rec.category,
            amount: rec.amount,
            description: `[Recurring] ${rec.description}`,
            date: nextOccurrence,
          },
        });

        // Update last run date
        await this.updateRecurringTransaction(userId, rec.id, {
          lastRunDate: nextOccurrence,
        });

        processedTransactions.push(transaction);
      }
    }

    return processedTransactions;
  }
}

export const recurringTransactionService = new RecurringTransactionService();
