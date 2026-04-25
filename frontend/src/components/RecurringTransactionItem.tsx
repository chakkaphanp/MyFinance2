import React from 'react';
import { Calendar, AlertCircle, Trash2 } from 'lucide-react';

interface RecurringTransactionItemProps {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  type: 'INCOME' | 'EXPENSE';
  nextOccurrenceDate?: Date;
  isActive: boolean;
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

export const RecurringTransactionItem: React.FC<RecurringTransactionItemProps> = ({
  id,
  description,
  amount,
  frequency,
  type,
  nextOccurrenceDate,
  isActive,
  onToggle,
  onDelete,
}) => {
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const frequencyText = {
    DAILY: 'Every day',
    WEEKLY: 'Every week',
    MONTHLY: 'Every month',
    YEARLY: 'Every year',
  };

  return (
    <div className={`border rounded p-4 mb-3 ${isActive ? 'bg-white border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{description}</h3>
          <p className="text-sm text-gray-600">{frequencyText[frequency as keyof typeof frequencyText]}</p>
        </div>
        <div className="text-right">
          <p className={`font-bold text-lg ${type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
            {type === 'INCOME' ? '+' : '-'}${amount.toFixed(2)}
          </p>
          {!isActive && <p className="text-xs text-gray-500">Inactive</p>}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>Next: {formatDate(nextOccurrenceDate)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onToggle(id, !isActive)}
          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
            isActive
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {isActive ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={() => onDelete(id)}
          className="px-3 py-2 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
