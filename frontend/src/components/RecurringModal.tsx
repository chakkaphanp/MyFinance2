import React, { useState, useEffect } from 'react';
import { X, UtensilsCrossed, Truck, Music, Zap, Heart, ShoppingBag, HelpCircle, Briefcase, Code, TrendingUp } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { useAuthStore } from '../store/authStore';

interface RecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecurringFormData) => void;
  categories: string[];
  isLoading?: boolean;
}

export interface RecurringFormData {
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  dayOfMonth?: number;
  dayOfWeek?: number;
  startDate: string;
  endDate?: string;
}

const CATEGORIES = {
  INCOME: ['Salary', 'Freelance', 'Investment', 'Other'],
  EXPENSE: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'],
};

const CATEGORY_CONFIG = {
  // Expense categories
  Food: { icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-600 border-orange-300' },
  Transport: { icon: Truck, color: 'bg-blue-100 text-blue-600 border-blue-300' },
  Entertainment: { icon: Music, color: 'bg-purple-100 text-purple-600 border-purple-300' },
  Utilities: { icon: Zap, color: 'bg-yellow-100 text-yellow-600 border-yellow-300' },
  Healthcare: { icon: Heart, color: 'bg-red-100 text-red-600 border-red-300' },
  Shopping: { icon: ShoppingBag, color: 'bg-pink-100 text-pink-600 border-pink-300' },
  // Income categories
  Salary: { icon: Briefcase, color: 'bg-green-100 text-green-600 border-green-300' },
  Freelance: { icon: Code, color: 'bg-blue-100 text-blue-600 border-blue-300' },
  Investment: { icon: TrendingUp, color: 'bg-purple-100 text-purple-600 border-purple-300' },
  // Default
  Other: { icon: HelpCircle, color: 'bg-gray-100 text-gray-600 border-gray-300' },
};

export const RecurringModal: React.FC<RecurringModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const { currency } = useAuthStore();
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState<RecurringFormData>({
    type: 'EXPENSE',
    category: '',
    amount: 0,
    description: '',
    frequency: 'MONTHLY',
    startDate: today,
  });

  const [amountInput, setAmountInput] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: 'EXPENSE',
        category: '',
        amount: 0,
        description: '',
        frequency: 'MONTHLY',
        startDate: new Date().toISOString().split('T')[0],
      });
      setAmountInput('');
      setShowAdvanced(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'dayOfMonth' || name === 'dayOfWeek' ? (value ? parseInt(value) : undefined) :
        value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.description || formData.amount <= 0) {
      alert('Please fill all required fields');
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const currentCategories = CATEGORIES[formData.type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-gradient-to-br from-clay-white to-clay-light rounded p-6 w-96 max-h-screen overflow-y-auto my-8" style={{ borderRadius: '24px', boxShadow: '0 20px 60px rgba(255, 159, 90, 0.2)' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-clay-dark">Add Recurring</h2>
          <button onClick={onClose} className="text-clay-dark opacity-50 hover:opacity-100 transition-opacity" style={{ borderRadius: '20px' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label">Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'EXPENSE', category: '' })}
                className={`flex-1 py-2 px-4 font-medium transition duration-300 rounded-full ${
                  formData.type === 'EXPENSE'
                    ? 'bg-gradient-to-r from-clay-coral to-clay-pink text-white'
                    : 'bg-clay-light text-clay-dark hover:bg-clay-gray'
                }`}
                style={{ borderRadius: '20px' }}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'INCOME', category: '' })}
                className={`flex-1 py-2 px-4 font-medium transition duration-300 rounded-full ${
                  formData.type === 'INCOME'
                    ? 'bg-gradient-to-r from-clay-primary to-clay-secondary text-white'
                    : 'bg-clay-light text-clay-dark hover:bg-clay-gray'
                }`}
                style={{ borderRadius: '20px' }}
              >
                Income
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="label">Frequency</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ borderRadius: '12px' }}
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="label">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {currentCategories.map((cat) => {
                const config = CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.Other;
                const IconComponent = config.icon;
                const isSelected = formData.category === cat;

                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`flex flex-col items-center justify-center py-3 px-2 border-2 transition duration-300 ${
                      isSelected
                        ? `${config.color} border-current shadow-md scale-105`
                        : `${config.color} border-transparent hover:opacity-80`
                    }`}
                    style={{ borderRadius: '20px' }}
                    title={cat}
                  >
                    <IconComponent size={20} className="mb-1" />
                    <span className="text-xs font-medium text-center">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Input
            label={`Amount (${currency})`}
            type="number"
            value={amountInput}
            onChange={(e) => {
              setAmountInput(e.target.value);
              setFormData({ ...formData, amount: e.target.value ? parseFloat(e.target.value) : 0 });
            }}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g., Netflix Subscription"
            required
          />

          <div className="grid grid-cols-2 gap-3 mb-2">
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date (Optional)"
              type="date"
              name="endDate"
              value={formData.endDate || ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-clay-primary hover:text-clay-secondary mb-4"
          >
            {showAdvanced ? '▼ Hide Advanced Options' : '▶ Show Advanced Options'}
          </button>

          {showAdvanced && (
            <div className="border-t border-gray-200 pt-3 space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Day of Month</label>
                  <input
                    type="number"
                    name="dayOfMonth"
                    value={formData.dayOfMonth || ''}
                    onChange={handleChange}
                    min="1"
                    max="31"
                    placeholder="1-31"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: '12px' }}
                  />
                </div>
                <div>
                  <label className="label">Day of Week</label>
                  <select
                    name="dayOfWeek"
                    value={formData.dayOfWeek || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: '12px' }}
                  >
                    <option value="">Select Day</option>
                    <option value="0">Sunday</option>
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
