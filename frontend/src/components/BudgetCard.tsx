import React from 'react';
import { AlertCircle } from 'lucide-react';

interface BudgetCardProps {
  category: string;
  limitAmount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  isExceeded: boolean;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  category,
  limitAmount,
  spent,
  remaining,
  percentUsed,
  isExceeded,
}) => {
  const getColorClass = () => {
    if (isExceeded) return 'border-red-500 bg-red-50';
    if (percentUsed >= 80) return 'border-yellow-500 bg-yellow-50';
    return 'border-blue-200 bg-white';
  };

  const getProgressColorClass = () => {
    if (isExceeded) return 'bg-red-500';
    if (percentUsed >= 80) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getAlertIcon = () => {
    if (isExceeded || percentUsed >= 80) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className={`border rounded p-4 ${getColorClass()}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{category}</h3>
          <p className="text-sm text-gray-600">${spent.toFixed(2)} / ${limitAmount.toFixed(2)}</p>
        </div>
        {getAlertIcon()}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getProgressColorClass()}`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-gray-600">Used</p>
          <p className="font-semibold text-gray-800">{percentUsed}%</p>
        </div>
        <div>
          <p className="text-gray-600">Remaining</p>
          <p className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${remaining.toFixed(2)}
          </p>
        </div>
      </div>

      {isExceeded && (
        <div className="mt-2 p-2 bg-red-200 text-red-800 rounded text-xs">
          ⚠️ Budget exceeded by ${(spent - limitAmount).toFixed(2)}
        </div>
      )}
      {percentUsed >= 80 && !isExceeded && (
        <div className="mt-2 p-2 bg-yellow-200 text-yellow-800 rounded text-xs">
          ⚠️ You've reached 80% of your budget
        </div>
      )}
    </div>
  );
};
