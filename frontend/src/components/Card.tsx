import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  title,
  subtitle
}) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-medium text-clay-dark">{title}</h3>
          {subtitle && <p className="text-sm text-clay-dark opacity-60 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};
