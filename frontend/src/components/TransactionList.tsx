import React from 'react';
import { useAuthStore } from '../store/authStore';
import { formatCurrency } from '../utils/helpers';

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const currency = useAuthStore((state) => state.currency);

  const groupedByDate = transactions.reduce(
    (acc, t) => {
      if (!acc[t.date]) acc[t.date] = [];
      acc[t.date].push(t);
      return acc;
    },
    {} as { [key: string]: Transaction[] }
  );

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-clay-dark mb-4">Recent Transactions</h2>

      {Object.entries(groupedByDate).map(([date, txns]) => (
        <div key={date} className="mb-6">
          <p className="text-sm font-medium text-clay-dark opacity-60 mb-3">{date}</p>
          <div className="space-y-2">
            {txns.map((txn) => (
              <div
                key={txn.id}
                className="flex justify-between items-center p-3 bg-clay-light rounded hover:bg-clay-gray transition-all duration-300"
                style={{ borderRadius: '20px' }}
              >
                <div>
                  <p className="font-medium text-clay-dark">{txn.category}</p>
                  <p className="text-sm text-clay-dark opacity-60">{txn.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`font-bold ${
                      txn.type === 'INCOME' ? 'text-clay-primary' : 'text-clay-coral'
                    }`}
                  >
                    {txn.type === 'INCOME' ? '+' : '-'}
                    {formatCurrency(txn.amount, currency)}
                  </p>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(txn.id)}
                      className="text-clay-coral hover:text-clay-dark text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {transactions.length === 0 && (
        <p className="text-center text-clay-dark opacity-60 py-8">No transactions yet</p>
      )}
    </div>
  );
};
