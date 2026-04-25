import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { BudgetCard } from '../components/BudgetCard';
import { BudgetModal, BudgetFormData } from '../components/BudgetModal';
import { budgetAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface BudgetWithSpending {
  id: string;
  category: string;
  limitAmount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  isExceeded: boolean;
}

export const BudgetsPage: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetWithSpending[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

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
    loadBudgets();
    loadAlerts();
    setCategories(commonCategories);
  }, [month, year]);

  const loadBudgets = async () => {
    try {
      setIsLoading(true);
      const response = await budgetAPI.list(month, year);
      setBudgets(response.data || []);
    } catch (error) {
      console.error('Error loading budgets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const response = await budgetAPI.alerts();
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const handleCreateBudget = async (data: BudgetFormData) => {
    try {
      setIsLoading(true);
      await budgetAPI.create(data);
      setIsModalOpen(false);
      await loadBudgets();
      await loadAlerts();
    } catch (error: any) {
      console.error('Error creating budget:', error);
      alert(error.response?.data?.error || 'Failed to create budget');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value));
  };

  const getMonthYear = () => {
    return new Date(year, month - 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const exceeded = alerts.filter((a) => a.alertType === 'EXCEEDED').length;
  const warning = alerts.filter((a) => a.alertType === 'WARNING').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-clay-light to-clay-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Budget Goals</h1>
          <p className="text-gray-600">Track your spending against monthly budget limits</p>
        </div>

        {/* Alerts Summary */}
        {(exceeded > 0 || warning > 0) && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-1">Budget Alert</h3>
              <p className="text-orange-700 text-sm">
                {exceeded > 0 && `${exceeded} budget(s) exceeded. `}
                {warning > 0 && `${warning} budget(s) at 80% or more.`}
              </p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={month}
                  onChange={handleMonthChange}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(2024, m - 1).toLocaleDateString('en-US', { month: 'short' })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={year}
                  onChange={handleYearChange}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - 1 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Budget
            </button>
          </div>
        </div>

        {/* Budgets Grid */}
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : budgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <BudgetCard key={budget.id} {...budget} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <h3 className="text-gray-600 mb-2">No budgets set for {getMonthYear()}</h3>
            <p className="text-gray-500 mb-4">Create your first budget to get started</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Budget
            </button>
          </div>
        )}
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateBudget}
        month={month}
        year={year}
        categories={categories}
        isLoading={isLoading}
      />
    </div>
  );
};
