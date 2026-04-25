import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error,
  helperText,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && <label className="label">{label}</label>}
      <input 
        {...props} 
        className={`input ${error ? 'border-red-500 focus:border-red-500' : ''}`}
        aria-invalid={!!error}
      />
      {error && <p className="text-clay-coral text-xs mt-1.5 font-medium">{error}</p>}
      {helperText && !error && <p className="text-clay-dark opacity-60 text-xs mt-1.5">{helperText}</p>}
    </div>
  );
};
