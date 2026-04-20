import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="label">{label}</label>}
      <input {...props} className={`input ${error ? 'border-red-500' : ''}`} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
