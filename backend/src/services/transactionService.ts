import { prisma } from '../lib/prisma.js';

export class TransactionService {
  async createTransaction(
    userId: string,
    type: string,
    category: string,
    amount: number,
    description: string,
    date: string
  ) {
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        category,
        amount: parseFloat(amount.toString()),
        description,
        date: new Date(date),
      },
    });
    
    return this.formatTransaction(transaction);
  }
  
  async getTransactions(userId: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.transaction.count({ where: { userId } }),
    ]);
    
    return {
      data: transactions.map(t => this.formatTransaction(t)),
      total,
      page,
      pageSize,
      hasMore: skip + pageSize < total,
    };
  }
  
  async getTransactionById(id: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    return this.formatTransaction(transaction);
  }
  
  async updateTransaction(
    id: string,
    userId: string,
    data: Partial<{
      type: string;
      category: string;
      amount: number;
      description: string;
      date: string;
    }>
  ) {
    const transaction = await prisma.transaction.updateMany({
      where: { id, userId },
      data: {
        ...data,
        ...(data.date && { date: new Date(data.date) }),
        ...(data.amount && { amount: parseFloat(data.amount.toString()) }),
      },
    });
    
    if (transaction.count === 0) {
      throw new Error('Transaction not found');
    }
    
    const updated = await prisma.transaction.findUnique({ where: { id } });
    return this.formatTransaction(updated!);
  }
  
  async deleteTransaction(id: string, userId: string) {
    const result = await prisma.transaction.deleteMany({
      where: { id, userId },
    });
    
    if (result.count === 0) {
      throw new Error('Transaction not found');
    }
  }
  
  private formatTransaction(transaction: any) {
    return {
      id: transaction.id,
      userId: transaction.userId,
      type: transaction.type,
      category: transaction.category,
      amount: parseFloat(transaction.amount),
      description: transaction.description,
      date: transaction.date.toISOString().split('T')[0],
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }
}
