import React, { useState, useEffect } from 'react';
import { Plus, Clock } from 'lucide-react';
import { RecurringTransactionItem } from '../components/RecurringTransactionItem';
import { RecurringModal, RecurringFormData } from '../components/RecurringModal';
import { recurringAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuthStore } from '../store/authStore';

interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  type: 'INCOME' | 'EXPENSE';
  nextOccurrenceDate?: Date;
  isActive: boolean;
}

export const RecurringPage: React.FC = () => {
  const { currency } = useAuthStore();
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [upcoming, setUpcoming] = useState<RecurringTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const commonCategories = [
    'Groceries',
    'Dining',
    'Entertainment',
    'Transportation',
    'Utilities',
    'Healthcare',
    'Shopping',
    'Subscriptions',
    'Salary',
    'Freelance',
  ];

  useEffect(() => {
    loadRecurring();
    setCategories(commonCategories);
  }, []);

  const loadRecurring = async () => {
    try {
      setIsLoading(true);
      const [recurringRes, upcomingRes] = await Promise.all([
        recurringAPI.list(),
        recurringAPI.getUpcoming(30),
      ]);
      setRecurring(recurringRes.data || []);
      setUpcoming(upcomingRes.data || []);
    } catch (error) {
      console.error('Error loading recurring transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRecurring = async (data: RecurringFormData) => {
    try {
      setIsLoading(true);
      await recurringAPI.create(data);
      setIsModalOpen(false);
      await loadRecurring();
    } catch (error) {
      console.error('Error creating recurring transaction:', error);
      alert('Failed to create recurring transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await recurringAPI.update(id, { isActive });
      await loadRecurring();
    } catch (error) {
      console.error('Error updating recurring transaction:', error);
      alert('Failed to update recurring transaction');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recurring transaction?')) return;

    try {
      await recurringAPI.delete(id);
      await loadRecurring();
    } catch (error) {
      console.error('Error deleting recurring transaction:', error);
      alert('Failed to delete recurring transaction');
    }
  };

  const activeCount = recurring.filter((r) => r.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Recurring Transactions</h1>
          <p className="text-gray-600">Set up automatic recurring income and expenses</p>
        </div>

        {/* Summary Cards */}
        {activeCount > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm">Active Recurring</p>
              <p className="text-2xl font-bold text-gray-800">{activeCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">
                {currency} {recurring
                  .filter((r) => r.isActive && r.type === 'INCOME')
                  .reduce((sum, r) => sum + r.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
              <p className="text-gray-600 text-sm">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {currency} {recurring
                  .filter((r) => r.isActive && r.type === 'EXPENSE')
                  .reduce((sum, r) => sum + r.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Add Button */}
        <div className="mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Recurring Transaction
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold text-gray-800">Upcoming (Next 30 Days)</h2>
                </div>
                <div className="space-y-2">
                  {upcoming.map((trans) => (
                    <div key={trans.id} className="bg-white rounded p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{trans.description}</p>
                        <p className="text-sm text-gray-600">
                          {trans.nextOccurrenceDate && new Date(trans.nextOccurrenceDate).toLocaleDateString()}
                        </p>
                      </div>
                      <p className={`font-semibold ${trans.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                        {trans.type === 'INCOME' ? '+' : '-'}{currency} {trans.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Recurring */}
            {recurring.filter((r) => r.isActive).length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Active Recurring</h2>
                <div className="space-y-3">
                  {recurring
                    .filter((r) => r.isActive)
                    .map((trans) => (
                      <RecurringTransactionItem
                        key={trans.id}
                        {...trans}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Inactive Recurring */}
            {recurring.filter((r) => !r.isActive).length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Paused Recurring</h2>
                <div className="space-y-3">
                  {recurring
                    .filter((r) => !r.isActive)
                    .map((trans) => (
                      <RecurringTransactionItem
                        key={trans.id}
                        {...trans}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {recurring.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <h3 className="text-gray-600 mb-2">No recurring transactions yet</h3>
                <p className="text-gray-500 mb-4">Create your first recurring transaction to get started</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Recurring Transaction
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <RecurringModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateRecurring}
        categories={categories}
        isLoading={isLoading}
      />
    </div>
  );
};
