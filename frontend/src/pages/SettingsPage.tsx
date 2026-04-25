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
    <div className="min-h-screen bg-gradient-to-br from-clay-light to-clay-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-clay-dark">Settings</h1>
          <p className="text-clay-dark opacity-60 mt-2">Customize your MyFinance experience</p>
        </div>

        {/* Currency Settings */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-clay-dark mb-6">Currency Preference</h2>
          
          <div className="space-y-4">
            {currencies.map((curr) => (
              <div
                key={curr.value}
                onClick={() => handleCurrencyChange(curr.value)}
                className={`p-4 border-2 rounded cursor-pointer transition-all duration-300 ${
                  currency === curr.value
                    ? 'border-clay-primary bg-clay-light'
                    : 'border-clay-gray bg-clay-white hover:border-clay-primary'
                }`}
                style={{ borderRadius: '24px' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-clay-light to-clay-white rounded flex items-center justify-center text-2xl font-bold text-clay-primary" style={{ borderRadius: '20px' }}>
                      {curr.symbol}
                    </div>
                    <div>
                      <p className="font-semibold text-clay-dark">{curr.label}</p>
                      <p className="text-sm text-clay-dark opacity-60">
                        {curr.value === 'USD' ? 'Default currency' : 'Thai Baht'}
                      </p>
                    </div>
                  </div>
                  {currency === curr.value && (
                    <div className="w-6 h-6 bg-gradient-to-r from-clay-primary to-clay-secondary rounded-full flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-clay-light border border-clay-gray rounded" style={{ borderRadius: '20px' }}>
            <p className="text-sm text-clay-dark">
              <strong>Note:</strong> Your selected currency will be displayed throughout the app. This setting is saved locally and will persist when you return.
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="card">
          <h2 className="text-2xl font-bold text-clay-dark mb-4">About MyFinance</h2>
          <p className="text-clay-dark opacity-70 mb-4">
            MyFinance is a personal finance tracker that helps you manage your daily spending and income, with beautiful dashboards and detailed analytics.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gradient-to-br from-clay-light to-clay-white rounded" style={{ borderRadius: '20px', boxShadow: '0 4px 12px rgba(255, 159, 90, 0.08)' }}>
              <p className="text-sm text-clay-dark opacity-60">Version</p>
              <p className="font-semibold text-clay-dark">1.0.0</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-clay-light to-clay-white rounded" style={{ borderRadius: '20px', boxShadow: '0 4px 12px rgba(255, 159, 90, 0.08)' }}>
              <p className="text-sm text-clay-dark opacity-60">Last Updated</p>
              <p className="font-semibold text-clay-dark">April 2026</p>
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
