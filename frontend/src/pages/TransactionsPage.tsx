import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { TransactionModal, TransactionData } from '../components/TransactionModal';
import { TransactionList } from '../components/TransactionList';
import { Plus } from 'lucide-react';
import { transactionAPI } from '../services/api';
import { useNotificationStore } from '../store/notificationStore';

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  date: string;
}

export const TransactionsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const showNotification = useNotificationStore((state) => state.show);

  useEffect(() => {
    loadTransactions();
  }, [page]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await transactionAPI.list(page, 50);
      setTransactions(response.data.data);
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error('Failed to load transactions', error);
      showNotification('Failed to load transactions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (data: TransactionData) => {
    try {
      setIsSubmitting(true);
      await transactionAPI.create(data);
      setPage(1);
      await loadTransactions();
      showNotification('Transaction added successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to add transaction', error);
      const errorMessage = error.response?.data?.error || 'Failed to add transaction';
      showNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await transactionAPI.delete(id);
      await loadTransactions();
      showNotification('Transaction deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete transaction', error);
      showNotification('Failed to delete transaction', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-2">View and manage all your transactions</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={20} />
            Add Transaction
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        ) : (
          <>
            <TransactionList
              transactions={transactions}
              onDelete={handleDeleteTransaction}
            />

            {hasMore && (
              <div className="mt-6 flex justify-center">
                <Button onClick={() => setPage(page + 1)} variant="secondary">
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTransaction}
        isLoading={isSubmitting}
      />
    </div>
  );
};
