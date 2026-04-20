import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import {
  X,
  UtensilsCrossed,
  Truck,
  Music,
  Zap,
  Heart,
  ShoppingBag,
  HelpCircle,
  Briefcase,
  Code,
  TrendingUp,
} from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionData) => void;
  isLoading?: boolean;
}

export interface TransactionData {
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  date: string;
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

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<TransactionData>({
    type: 'EXPENSE',
    category: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: 'EXPENSE',
        category: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = CATEGORIES[formData.type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Transaction</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label className="label">Type</label>
          <div className="flex gap-3">
            <button
              onClick={() =>
                setFormData({
                  ...formData,
                  type: 'EXPENSE',
                  category: '',
                })
              }
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                formData.type === 'EXPENSE'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Expense
            </button>
            <button
              onClick={() =>
                setFormData({
                  ...formData,
                  type: 'INCOME',
                  category: '',
                })
              }
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                formData.type === 'INCOME'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="label">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => {
              const config = CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG];
              const IconComponent = config.icon;
              const isSelected = formData.category === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition ${
                    isSelected
                      ? `${config.color} border-current shadow-md scale-105`
                      : `${config.color} border-transparent hover:opacity-80`
                  }`}
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
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional description"
        />

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSubmit(formData);
              onClose();
            }}
            isLoading={isLoading}
            className="flex-1"
          >
            Add Transaction
          </Button>
        </div>
      </div>
    </div>
  );
};
