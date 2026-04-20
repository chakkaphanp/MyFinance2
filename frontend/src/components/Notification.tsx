import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';

export const Notification: React.FC = () => {
  const { message, type, isVisible, hide } = useNotificationStore();

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  }[type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }[type];

  return (
    <div className={`fixed top-4 right-4 ${bgColor} border rounded-lg p-4 flex items-center gap-3 shadow-lg max-w-md z-50 animate-in fade-in slide-in-from-top`}>
      <Icon size={20} className={textColor} />
      <p className={textColor}>{message}</p>
      <button onClick={hide} className={`ml-auto ${textColor} hover:opacity-70`}>
        <X size={18} />
      </button>
    </div>
  );
};
