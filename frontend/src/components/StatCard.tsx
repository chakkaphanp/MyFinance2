import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<CardProps> = ({ title, value, subtitle, className }) => {
  return (
    <div className={`card ${className}`}>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );
};
