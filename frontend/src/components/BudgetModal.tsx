import React, { useState, useEffect } from 'react';
import { X, UtensilsCrossed, Truck, Music, Zap, Heart, ShoppingBag, HelpCircle, Briefcase, Code, TrendingUp } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { useAuthStore } from '../store/authStore';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => void;
  month?: number;
  year?: number;
  categories: string[];
  isLoading?: boolean;
}

export interface BudgetFormData {
  category: string;
  limitAmount: number;
  month: number;
  year: number;
}

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

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  month,
  year,
  categories,
  isLoading,
}) => {
  const { currency } = useAuthStore();
  const today = new Date();
  const [formData, setFormData] = useState<BudgetFormData>({
    category: '',
    limitAmount: 0,
    month: month || today.getMonth() + 1,
    year: year || today.getFullYear(),
  });
  const [amountInput, setAmountInput] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        category: '',
        limitAmount: 0,
        month: month || today.getMonth() + 1,
        year: year || today.getFullYear(),
      });
      setAmountInput('');
    }
  }, [isOpen, month, year]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || formData.limitAmount <= 0) {
      alert('Please fill all fields with valid values');
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-clay-white to-clay-light rounded p-6 w-96 max-h-screen overflow-y-auto" style={{ borderRadius: '24px', boxShadow: '0 20px 60px rgba(255, 159, 90, 0.2)' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-clay-dark">Create Budget</h2>
          <button onClick={onClose} className="text-clay-dark opacity-50 hover:opacity-100 transition-opacity" style={{ borderRadius: '20px' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => {
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
            label={`Monthly Limit (${currency})`}
            type="number"
            value={amountInput}
            onChange={(e) => {
              setAmountInput(e.target.value);
              setFormData({ ...formData, limitAmount: e.target.value ? parseFloat(e.target.value) : 0 });
            }}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label className="label">Month</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderRadius: '12px' }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(2024, m - 1).toLocaleDateString('en-US', { month: 'short' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderRadius: '12px' }}
              >
                {Array.from({ length: 3 }, (_, i) => today.getFullYear() - 1 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1"
            >
              Create Budget
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
