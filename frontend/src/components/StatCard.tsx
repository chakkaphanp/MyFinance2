import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
  accent?: 'blue' | 'green' | 'orange';
}

export const StatCard: React.FC<CardProps> = ({ 
  title, 
  value, 
  subtitle, 
  className,
  accent = 'blue'
}) => {
  const accentColor = {
    blue: 'text-clay-primary',
    green: 'text-clay-primary',
    orange: 'text-clay-accent',
  }[accent];

  return (
    <div className={`card ${className}`}>
      <p className="text-clay-dark opacity-60 text-sm font-medium">{title}</p>
      <h3 className={`text-3xl font-bold ${accentColor} mt-2`}>{value}</h3>
      {subtitle && <p className="text-clay-dark opacity-50 text-xs mt-1">{subtitle}</p>}
    </div>
  );
};
