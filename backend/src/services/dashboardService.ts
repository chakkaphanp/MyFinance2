import { prisma } from '../lib/prisma.js';

export class DashboardService {
  async getDashboardStats(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });
    
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyTransactions = transactions.filter(t => 
      new Date(t.date) >= currentMonth
    );
    
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    const monthlyExpense = monthlyTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      monthlyIncome,
      monthlyExpense,
      monthlyBalance: monthlyIncome - monthlyExpense,
      transactionCount: transactions.length,
    };
  }
  
  async getCategoryBreakdown(userId: string, month?: number, year?: number) {
    let query = { where: { userId } };
    
    if (month !== undefined && year !== undefined) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      query.where = {
        ...query.where,
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    }
    
    const transactions = await prisma.transaction.findMany(query);
    
    const expenseMap: { [key: string]: { amount: number; count: number } } = {};
    const incomeMap: { [key: string]: { amount: number; count: number } } = {};
    let totalExpense = 0;
    let totalIncome = 0;
    
    transactions.forEach(t => {
      const amount = parseFloat(t.amount.toString());
      
      if (t.type === 'EXPENSE') {
        if (!expenseMap[t.category]) {
          expenseMap[t.category] = { amount: 0, count: 0 };
        }
        expenseMap[t.category].amount += amount;
        expenseMap[t.category].count += 1;
        totalExpense += amount;
      } else {
        if (!incomeMap[t.category]) {
          incomeMap[t.category] = { amount: 0, count: 0 };
        }
        incomeMap[t.category].amount += amount;
        incomeMap[t.category].count += 1;
        totalIncome += amount;
      }
    });
    
    return {
      expenses: Object.entries(expenseMap).map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0,
        count: data.count,
      })),
      income: Object.entries(incomeMap).map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: totalIncome > 0 ? (data.amount / totalIncome) * 100 : 0,
        count: data.count,
      })),
    };
  }
  
  async getMonthlyTrend(userId: string, months: number = 6) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });
    
    const now = new Date();
    const trend = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= month && tDate <= monthEnd;
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
      
      const expense = monthTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
      
      trend.push({
        month: month.toISOString().slice(0, 7),
        income,
        expense,
        net: income - expense,
      });
    }
    
    return trend;
  }
}
