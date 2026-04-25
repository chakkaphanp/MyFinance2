import { prisma } from '../lib/prisma';

export interface CreateBudgetInput {
  category: string;
  limitAmount: number;
  month: number;
  year: number;
}

export interface UpdateBudgetInput {
  limitAmount?: number;
}

export class BudgetService {
  async createBudget(userId: string, input: CreateBudgetInput) {
    return prisma.budget.create({
      data: {
        userId,
        ...input,
      },
    });
  }

  async getBudgetsByMonth(userId: string, month: number, year: number) {
    return prisma.budget.findMany({
      where: {
        userId,
        month,
        year,
      },
    });
  }

  async getBudgetById(userId: string, budgetId: string) {
    return prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId,
      },
    });
  }

  async getAllBudgets(userId: string) {
    return prisma.budget.findMany({
      where: { userId },
    });
  }

  async updateBudget(userId: string, budgetId: string, input: UpdateBudgetInput) {
    return prisma.budget.updateMany({
      where: {
        id: budgetId,
        userId,
      },
      data: input,
    });
  }

  async deleteBudget(userId: string, budgetId: string) {
    return prisma.budget.deleteMany({
      where: {
        id: budgetId,
        userId,
      },
    });
  }

  async getBudgetWithSpending(userId: string, budgetId: string) {
    const budget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId,
      },
    });

    if (!budget) return null;

    // Get spending for this category in the budget month/year
    const startDate = new Date(budget.year, budget.month - 1, 1);
    const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59, 999);

    const spending = await prisma.transaction.aggregate({
      where: {
        userId,
        category: budget.category,
        type: 'EXPENSE',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const spent = spending._sum.amount || 0;
    const remaining = Math.max(0, budget.limitAmount - spent);
    const percentUsed = Math.round((spent / budget.limitAmount) * 100);
    const isExceeded = spent > budget.limitAmount;

    return {
      ...budget,
      spent,
      remaining,
      percentUsed,
      isExceeded,
    };
  }

  async getAllBudgetsWithSpending(userId: string, month: number, year: number) {
    const budgets = await this.getBudgetsByMonth(userId, month, year);
    const budgetsWithSpending = await Promise.all(
      budgets.map((b) => this.getBudgetWithSpending(userId, b.id))
    );
    return budgetsWithSpending.filter((b) => b !== null);
  }

  async checkBudgetAlerts(userId: string) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const budgetsWithSpending = await this.getAllBudgetsWithSpending(userId, month, year);

    return budgetsWithSpending
      .filter((b) => b !== null)
      .map((budget) => ({
        budgetId: budget!.id,
        category: budget!.category,
        limitAmount: budget!.limitAmount,
        spent: budget!.spent,
        remaining: budget!.remaining,
        percentUsed: budget!.percentUsed,
        isExceeded: budget!.isExceeded,
        alertType: budget!.isExceeded ? 'EXCEEDED' : budget!.percentUsed >= 80 ? 'WARNING' : 'NORMAL',
      }));
  }
}

export const budgetService = new BudgetService();
