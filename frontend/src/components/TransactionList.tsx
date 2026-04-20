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
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>

      {Object.entries(groupedByDate).map(([date, txns]) => (
        <div key={date} className="mb-6">
          <p className="text-sm font-medium text-gray-500 mb-3">{date}</p>
          <div className="space-y-2">
            {txns.map((txn) => (
              <div
                key={txn.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-medium text-gray-900">{txn.category}</p>
                  <p className="text-sm text-gray-500">{txn.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`font-bold ${
                      txn.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {txn.type === 'INCOME' ? '+' : '-'}
                    {formatCurrency(txn.amount, currency)}
                  </p>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(txn.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
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
        <p className="text-center text-gray-500 py-8">No transactions yet</p>
      )}
    </div>
  );
};
