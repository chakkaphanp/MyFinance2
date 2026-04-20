import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/Button';
import { TransactionModal, TransactionData } from '../components/TransactionModal';
import { Plus } from 'lucide-react';
import { dashboardAPI, transactionAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { formatCurrency } from '../utils/helpers';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyBalance: number;
  transactionCount: number;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export const DashboardPage: React.FC = () => {
  const currency = useAuthStore((state) => state.currency);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [expenseData, setExpenseData] = useState<CategoryData[]>([]);
  const [incomeData, setIncomeData] = useState<CategoryData[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, categoryRes, trendRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getCategoryBreakdown(),
        dashboardAPI.getMonthlyTrend(6),
      ]);

      setStats(statsRes.data);
      setExpenseData(categoryRes.data.expenses || []);
      setIncomeData(categoryRes.data.income || []);
      setTrendData(trendRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (data: TransactionData) => {
    try {
      setIsSubmitting(true);
      await transactionAPI.create(data);
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to add transaction', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's your financial overview</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={20} />
            Add Transaction
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Balance"
                value={formatCurrency(stats?.balance || 0, currency)}
                subtitle="All time"
              />
              <StatCard
                title="Monthly Balance"
                value={formatCurrency(stats?.monthlyBalance || 0, currency)}
                subtitle="This month"
              />
              <StatCard
                title="Monthly Income"
                value={formatCurrency(stats?.monthlyIncome || 0, currency)}
                subtitle="This month"
                className="bg-green-50 border-green-200"
              />
              <StatCard
                title="Monthly Expense"
                value={formatCurrency(stats?.monthlyExpense || 0, currency)}
                subtitle="This month"
                className="bg-red-50 border-red-200"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Monthly Trend */}
              <div className="lg:col-span-3 card">
                <h2 className="text-xl font-bold mb-4">Monthly Trend</h2>
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#10B981"
                        name="Income"
                      />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#EF4444"
                        name="Expense"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-12">No data available</p>
                )}
              </div>
            </div>

            {/* Split Charts - Expense and Income */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Expense Distribution */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Expense Distribution</h2>
                {expenseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expenseData}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-12">No expenses recorded</p>
                )}
              </div>

              {/* Income Distribution */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Income Distribution</h2>
                {incomeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={incomeData}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {incomeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-12">No income recorded</p>
                )}
              </div>
            </div>

            {/* Expense Breakdown Table */}
            {expenseData.length > 0 && (
              <div className="card mb-8">
                <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {expenseData.map((item, index) => (
                    <div key={item.category} className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <p className="font-medium text-gray-900">{item.category}</p>
                      </div>
                      <p className="text-lg font-bold text-red-600">
                        {formatCurrency(item.amount, currency)}
                      </p>
                      <p className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500 mt-1">{item.count} transaction(s)</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Income Breakdown Table */}
            {incomeData.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Income Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {incomeData.map((item, index) => (
                    <div key={item.category} className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <p className="font-medium text-gray-900">{item.category}</p>
                      </div>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(item.amount, currency)}
                      </p>
                      <p className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500 mt-1">{item.count} transaction(s)</p>
                    </div>
                  ))}
                </div>
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
