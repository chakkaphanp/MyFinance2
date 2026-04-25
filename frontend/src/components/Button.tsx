import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading,
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  }[variant];

  const sizeClass = {
    sm: 'text-xs px-4 py-1 min-h-8',
    md: 'text-sm px-6 py-2 min-h-10',
    lg: 'text-base px-8 py-3 min-h-12',
  }[size];

  return (
    <button
      {...props}
      className={`${variantClass} ${sizeClass} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
