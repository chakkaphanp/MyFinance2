import React from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { useAuthStore, Currency } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currency, setCurrency } = useAuthStore();
  const navigate = useNavigate();

  const currencies: { value: Currency; label: string; symbol: string }[] = [
    { value: 'USD', label: 'US Dollar', symbol: '$' },
    { value: 'THB', label: 'Thai Baht', symbol: '฿' },
  ];

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Customize your MyFinance experience</p>
        </div>

        {/* Currency Settings */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Currency Preference</h2>
          
          <div className="space-y-4">
            {currencies.map((curr) => (
              <div
                key={curr.value}
                onClick={() => handleCurrencyChange(curr.value)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  currency === curr.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl font-bold">
                      {curr.symbol}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{curr.label}</p>
                      <p className="text-sm text-gray-500">
                        {curr.value === 'USD' ? 'Default currency' : 'Thai Baht'}
                      </p>
                    </div>
                  </div>
                  {currency === curr.value && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Your selected currency will be displayed throughout the app. This setting is saved locally and will persist when you return.
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About MyFinance</h2>
          <p className="text-gray-600 mb-4">
            MyFinance is a personal finance tracker that helps you manage your daily spending and income, with beautiful dashboards and detailed analytics.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Version</p>
              <p className="font-semibold text-gray-900">1.0.0</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-semibold text-gray-900">April 2026</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/dashboard')} className="flex-1">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
