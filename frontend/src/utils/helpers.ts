import { format } from 'date-fns';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type Currency = 'USD' | 'THB';

const currencyConfig: { [key in Currency]: { symbol: string; code: string; locale: string } } = {
  USD: { symbol: '$', code: 'USD', locale: 'en-US' },
  THB: { symbol: '฿', code: 'THB', locale: 'th-TH' },
};

export const formatCurrency = (amount: number, currency: Currency = 'USD'): string => {
  const config = currencyConfig[currency];
  if (currency === 'THB') {
    return `${config.symbol}${amount.toLocaleString(config.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
  }).format(amount);
};

export const getCurrencySymbol = (currency: Currency = 'USD'): string => {
  return currencyConfig[currency].symbol;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getTransactionTypeColor = (type: 'INCOME' | 'EXPENSE'): string => {
  return type === 'INCOME' ? 'text-green-600' : 'text-red-600';
};

export const getTransactionTypeLabel = (type: 'INCOME' | 'EXPENSE'): string => {
  return type === 'INCOME' ? '+' : '-';
};
